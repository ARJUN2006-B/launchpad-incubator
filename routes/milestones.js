/* api/milestones.js — Milestone management */
const express = require('express');
const router = express.Router();
const { randomUUID: uuidv4 } = require('crypto');
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/milestones — Get milestones for current startup
router.get('/', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.json({ milestones: [] });

  const milestones = dbWrapper.all('SELECT * FROM milestones WHERE startup_id = ? ORDER BY order_index ASC', [startup.id]);
  const result = milestones.map(ms => {
    const tasks = dbWrapper.all('SELECT * FROM milestone_tasks WHERE milestone_id = ? ORDER BY order_index ASC', [ms.id]);
    return { ...ms, tasks };
  });
  res.json({ milestones: result });
});

// GET /api/milestones/:id
router.get('/:id', auth, (req, res) => {
  const ms = dbWrapper.get('SELECT * FROM milestones WHERE id = ?', [req.params.id]);
  if (!ms) return res.status(404).json({ error: 'Milestone not found' });

  const tasks = dbWrapper.all('SELECT * FROM milestone_tasks WHERE milestone_id = ? ORDER BY order_index ASC', [ms.id]);
  res.json({ milestone: { ...ms, tasks } });
});

// POST /api/milestones — Create new milestone (startup)
router.post('/', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const { title, description, deadline, icon, submission, tasks } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const maxOrder = dbWrapper.get('SELECT MAX(order_index) as max_idx FROM milestones WHERE startup_id = ?', [startup.id]);
  const id = uuidv4();

  dbWrapper.run(
    `INSERT INTO milestones (id, startup_id, title, icon, description, deadline, submission, status, progress, order_index)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id, startup.id, title, icon || '🎯', description || '', deadline || '', submission || '', 'not_started', 0, (maxOrder?.max_idx || 0) + 1]
  );

  if (tasks && Array.isArray(tasks)) {
    tasks.forEach((t, i) => {
      dbWrapper.run('INSERT INTO milestone_tasks (id, milestone_id, title, order_index) VALUES (?,?,?,?)', [uuidv4(), id, t, i]);
    });
  }

  res.json({ success: true, milestone: dbWrapper.get('SELECT * FROM milestones WHERE id = ?', [id]) });
});

// PUT /api/milestones/:id — Update milestone
router.put('/:id', auth, (req, res) => {
  const ms = dbWrapper.get('SELECT * FROM milestones WHERE id = ?', [req.params.id]);
  if (!ms) return res.status(404).json({ error: 'Milestone not found' });

  // Check ownership
  const startup = dbWrapper.get('SELECT id FROM startups WHERE id = ? AND user_id = ?', [ms.startup_id, req.user.id]);
  const isMentor = req.user.role === 'mentor';
  const isAdmin = req.user.role === 'admin';
  if (!startup && !isMentor && !isAdmin) return res.status(403).json({ error: 'Access denied' });

  const { title, description, deadline, status, progress, submission, mentor_status, mentor_comment } = req.body;
  const updates = [];
  const params = [];

  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (deadline !== undefined) { updates.push('deadline = ?'); params.push(deadline); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (progress !== undefined) { updates.push('progress = ?'); params.push(progress); }
  if (submission !== undefined) { updates.push('submission = ?'); params.push(submission); }
  if (mentor_status !== undefined) { updates.push('mentor_status = ?'); params.push(mentor_status); }
  if (mentor_comment !== undefined) { updates.push('mentor_comment = ?'); params.push(mentor_comment); }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    params.push(ms.id);
    dbWrapper.run(`UPDATE milestones SET ${updates.join(', ')} WHERE id = ?`, params);
  }

  // Update startup overall progress
  const allMs = dbWrapper.all('SELECT progress FROM milestones WHERE startup_id = ?', [ms.startup_id]);
  const avgProgress = Math.round(allMs.reduce((sum, m) => sum + m.progress, 0) / allMs.length);
  dbWrapper.run('UPDATE startups SET progress = ?, updated_at = datetime(\'now\') WHERE id = ?', [avgProgress, ms.startup_id]);

  // Send notification if mentor approved
  if (mentor_status === 'Approved' && startup) {
    const startupData = dbWrapper.get('SELECT user_id, name FROM startups WHERE id = ?', [ms.startup_id]);
    if (startupData) {
      dbWrapper.run(
        'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
        [uuidv4(), startupData.user_id, 'milestone', '🎯', 'Milestone approved!', `Your "${ms.title}" milestone has been approved.`, '#milestones']
      );
    }
  }

  res.json({ success: true, milestone: dbWrapper.get('SELECT * FROM milestones WHERE id = ?', [ms.id]) });
});

// PUT /api/milestones/:id/tasks/:taskId — Toggle task
router.put('/:id/tasks/:taskId', auth, (req, res) => {
  const task = dbWrapper.get('SELECT * FROM milestone_tasks WHERE id = ? AND milestone_id = ?', [req.params.taskId, req.params.id]);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const newDone = req.body.is_done !== undefined ? (req.body.is_done ? 1 : 0) : (task.is_done ? 0 : 1);
  dbWrapper.run('UPDATE milestone_tasks SET is_done = ? WHERE id = ?', [newDone, task.id]);

  // Recalculate milestone progress
  const allTasks = dbWrapper.all('SELECT is_done FROM milestone_tasks WHERE milestone_id = ?', [req.params.id]);
  const doneTasks = allTasks.filter(t => t.is_done).length;
  const newProgress = allTasks.length ? Math.round((doneTasks / allTasks.length) * 100) : 0;
  dbWrapper.run("UPDATE milestones SET progress = ?, updated_at = datetime('now') WHERE id = ?", [newProgress, req.params.id]);

  res.json({ success: true, is_done: newDone, progress: newProgress });
});

// POST /api/milestones/:id/submit — Submit milestone for review
router.post('/:id/submit', auth, (req, res) => {
  const ms = dbWrapper.get('SELECT m.*, s.user_id FROM milestones m JOIN startups s ON m.startup_id = s.id WHERE m.id = ?', [req.params.id]);
  if (!ms) return res.status(404).json({ error: 'Milestone not found' });
  if (ms.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  dbWrapper.run("UPDATE milestones SET status = 'submitted', mentor_status = 'Pending Review', updated_at = datetime('now') WHERE id = ?", [ms.id]);

  // Notify mentor
  const assignment = dbWrapper.get('SELECT ma.mentor_id, m.user_id as mentor_user_id FROM mentor_assignments ma JOIN mentors m ON ma.mentor_id = m.id WHERE ma.startup_id = ? AND ma.is_active = 1', [ms.startup_id]);
  if (assignment) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), assignment.mentor_user_id, 'milestone', '🚀', 'Milestone submitted for review', `${ms.title} has been submitted for your review.`, 'milestones']
    );
  }

  res.json({ success: true });
});

module.exports = router;
