/* api/mentor.js — Mentor module */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/mentor/profile — Get mentor's own profile
router.get('/profile', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT * FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(404).json({ error: 'Mentor profile not found' });
  res.json({ mentor });
});

// PUT /api/mentor/profile — Update mentor profile
router.put('/profile', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(404).json({ error: 'Mentor profile not found' });

  const { role, experience, bio, expertise, availability, linkedin, website } = req.body;
  dbWrapper.run(
    `UPDATE mentors SET role=?, experience=?, bio=?, expertise=?, availability=?, linkedin=?, website=?, updated_at=datetime('now') WHERE id=?`,
    [role, experience, bio, JSON.stringify(expertise || []), JSON.stringify(availability || []), linkedin || '', website || '', mentor.id]
  );
  res.json({ success: true });
});

// GET /api/mentor/startups — Get startups assigned to mentor
router.get('/startups', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(404).json({ startups: [] });

  const startups = dbWrapper.all(
    `SELECT s.*, u.full_name as founder_name, u.email as founder_email, ma.assigned_at
     FROM mentor_assignments ma
     JOIN startups s ON ma.startup_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE ma.mentor_id = ? AND ma.is_active = 1`,
    [mentor.id]
  );
  res.json({ startups });
});

// GET /api/mentor/startups/:startupId — Get full startup detail for mentor
router.get('/startups/:startupId', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(403).json({ error: 'Access denied' });

  const assignment = dbWrapper.get('SELECT id FROM mentor_assignments WHERE mentor_id = ? AND startup_id = ? AND is_active = 1', [mentor.id, req.params.startupId]);
  if (!assignment) return res.status(403).json({ error: 'You are not assigned to this startup' });

  const startup = dbWrapper.get('SELECT * FROM startups WHERE id = ?', [req.params.startupId]);
  const team = dbWrapper.all('SELECT * FROM startup_team_members WHERE startup_id = ?', [startup.id]);
  const milestones = dbWrapper.all('SELECT * FROM milestones WHERE startup_id = ? ORDER BY order_index ASC', [startup.id]);
  const mWithTasks = milestones.map(ms => ({
    ...ms,
    tasks: dbWrapper.all('SELECT * FROM milestone_tasks WHERE milestone_id = ? ORDER BY order_index ASC', [ms.id])
  }));
  const documents = dbWrapper.all('SELECT * FROM documents WHERE startup_id = ? ORDER BY created_at DESC', [startup.id]);
  const feedbackHistory = dbWrapper.all('SELECT * FROM mentor_feedback WHERE startup_id = ? AND mentor_id = ? ORDER BY created_at DESC', [startup.id, mentor.id]);

  res.json({ startup, team, milestones: mWithTasks, documents, feedback: feedbackHistory });
});

// POST /api/mentor/feedback — Submit feedback on a startup
router.post('/feedback', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(403).json({ error: 'Access denied' });

  const { startup_id, milestone_id, topic, feedback_text, rating } = req.body;
  if (!startup_id || !feedback_text) return res.status(400).json({ error: 'Startup ID and feedback text required' });

  const id = uuidv4();
  dbWrapper.run(
    'INSERT INTO mentor_feedback (id, mentor_id, startup_id, milestone_id, topic, feedback_text, rating) VALUES (?,?,?,?,?,?,?)',
    [id, mentor.id, startup_id, milestone_id || null, topic || 'General Feedback', feedback_text, rating || 0]
  );

  // Notify startup
  const startupData = dbWrapper.get('SELECT user_id, name FROM startups WHERE id = ?', [startup_id]);
  if (startupData) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), startupData.user_id, 'mentor', '👨‍🏫', 'New mentor feedback', `${req.user.name} left feedback on your startup.`, '#mentor']
    );
    dbWrapper.run(
      'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
      [uuidv4(), startupData.user_id, startup_id, '💬', 'rgba(108,99,255,0.12)', `<strong>Mentor feedback</strong> received from ${req.user.name}`]
    );
  }

  res.json({ success: true });
});

// POST /api/mentor/evaluations — Evaluate a startup
router.post('/evaluations', ...requireRole('mentor'), (req, res) => {
  const mentor = dbWrapper.get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
  if (!mentor) return res.status(403).json({ error: 'Access denied' });

  const { startup_id, innovation, problem_solution, market_potential, business_model, technology, team, scalability, traction, strengths, weaknesses, risks, recommendations, overall_comments } = req.body;
  if (!startup_id) return res.status(400).json({ error: 'Startup ID required' });

  const id = uuidv4();
  dbWrapper.run(
    `INSERT INTO mentor_evaluations (id, mentor_id, startup_id, innovation, problem_solution, market_potential, business_model, technology, team, scalability, traction, strengths, weaknesses, risks, recommendations, overall_comments)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, mentor.id, startup_id, innovation || 0, problem_solution || 0, market_potential || 0, business_model || 0, technology || 0, team || 0, scalability || 0, traction || 0, strengths || '', weaknesses || '', risks || '', recommendations || '', overall_comments || '']
  );

  // Notify startup
  const startupData = dbWrapper.get('SELECT user_id FROM startups WHERE id = ?', [startup_id]);
  if (startupData) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), startupData.user_id, 'mentor', '⭐', 'New startup evaluation', `${req.user.name} completed an evaluation of your startup.`, '#mentor']
    );
  }

  res.json({ success: true });
});

// GET /api/mentor/all — Public mentor list
router.get('/all', (req, res) => {
  const mentors = dbWrapper.all(
    `SELECT m.*, COALESCE(u.email, '') as email FROM mentors m LEFT JOIN users u ON m.user_id = u.id WHERE m.is_verified = 1 ORDER BY m.rating DESC`
  );
  res.json({ mentors });
});

module.exports = router;
