/* api/startups.js — Startup CRUD routes */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/startups — Public startup list
router.get('/', (req, res) => {
  const { industry, stage, search } = req.query;
  let sql = `SELECT s.*, u.full_name as founder_name, u.email as founder_email
             FROM startups s JOIN users u ON s.user_id = u.id
             WHERE s.is_public = 1`;
  const params = [];
  if (industry) { sql += ' AND s.industry LIKE ?'; params.push(`%${industry}%`); }
  if (stage) { sql += ' AND s.stage = ?'; params.push(stage); }
  if (search) { sql += ' AND (s.name LIKE ? OR s.tagline LIKE ? OR s.industry LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  sql += ' ORDER BY s.created_at DESC';
  const startups = dbWrapper.all(sql, params);
  res.json({ startups });
});

// GET /api/startups/my — Current user's startup
router.get('/my', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT * FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found for this user' });

  const team = dbWrapper.all('SELECT * FROM startup_team_members WHERE startup_id = ?', [startup.id]);
  const mentor_assignment = dbWrapper.get(
    `SELECT ma.*, m.name as mentor_name, m.initials, m.role as mentor_role, m.rating, m.expertise, m.bio, m.availability, m.sessions_completed
     FROM mentor_assignments ma JOIN mentors m ON ma.mentor_id = m.id
     WHERE ma.startup_id = ? AND ma.is_active = 1`, [startup.id]
  );

  res.json({ startup, team, mentor: mentor_assignment || null });
});

// GET /api/startups/:id
router.get('/:id', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT * FROM startups WHERE id = ?', [req.params.id]);
  if (!startup) return res.status(404).json({ error: 'Startup not found' });

  // Check access: startup owner, assigned mentor, admin, or investor (public only)
  const isOwner = startup.user_id === req.user.id;
  const isAdmin = req.user.role === 'admin';
  const isMentor = req.user.role === 'mentor';
  const isInvestor = req.user.role === 'investor';

  if (!isOwner && !isAdmin && !isMentor && !(isInvestor && startup.is_public)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const team = dbWrapper.all('SELECT * FROM startup_team_members WHERE startup_id = ?', [startup.id]);
  res.json({ startup, team });
});

// PUT /api/startups/my — Update own startup
router.put('/my', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT * FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const fields = ['name', 'tagline', 'description', 'industry', 'stage', 'founded_date', 'location', 'website',
    'problem', 'solution', 'target_customers', 'business_model', 'revenue_model', 'market_size', 'competitors', 'technology', 'traction', 'is_public'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push('updated_at = datetime(\'now\')');
  params.push(startup.id);
  dbWrapper.run(`UPDATE startups SET ${updates.join(', ')} WHERE id = ?`, params);

  // Log activity
  dbWrapper.run(
    'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
    [uuidv4(), req.user.id, startup.id, '✏️', 'rgba(108,99,255,0.12)', '<strong>Startup profile</strong> updated']
  );

  const updated = dbWrapper.get('SELECT * FROM startups WHERE id = ?', [startup.id]);
  res.json({ startup: updated });
});

// POST /api/startups/my/team — Add team member
router.post('/my/team', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const { name, role, email, experience, skills, color } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Name and role are required' });

  const id = uuidv4();
  const initials = name.substring(0, 2).toUpperCase();
  dbWrapper.run(
    'INSERT INTO startup_team_members (id, startup_id, name, role, email, experience, skills, color, initials) VALUES (?,?,?,?,?,?,?,?,?)',
    [id, startup.id, name, role, email || '', experience || '', JSON.stringify(skills || []), color || '#6C63FF', initials]
  );

  res.json({ success: true, member: dbWrapper.get('SELECT * FROM startup_team_members WHERE id = ?', [id]) });
});

// DELETE /api/startups/my/team/:memberId
router.delete('/my/team/:memberId', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });
  dbWrapper.run('DELETE FROM startup_team_members WHERE id = ? AND startup_id = ?', [req.params.memberId, startup.id]);
  res.json({ success: true });
});

// GET /api/startups/my/activity — Activity log
router.get('/my/activity', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ activities: [] });
  const activities = dbWrapper.all('SELECT * FROM activity_log WHERE startup_id = ? ORDER BY created_at DESC LIMIT 20', [startup.id]);
  res.json({ activities });
});

module.exports = router;
