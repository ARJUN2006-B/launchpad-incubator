/* api/applications.js — Incubation application */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/applications/my
router.get('/my', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.json({ application: null });
  const application = dbWrapper.get('SELECT * FROM incubation_applications WHERE startup_id = ? ORDER BY created_at DESC LIMIT 1', [startup.id]);
  res.json({ application });
});

// POST /api/applications — Create/update draft application
router.post('/', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const existing = dbWrapper.get("SELECT id, status FROM incubation_applications WHERE startup_id = ? AND status = 'draft' LIMIT 1", [startup.id]);

  const { program_id, step_completed, founder_info, startup_info, problem_solution, market, business_model, team, documents } = req.body;

  if (existing) {
    dbWrapper.run(
      `UPDATE incubation_applications SET program_id=?, step_completed=?, founder_info=?, startup_info=?, problem_solution=?, market=?, business_model=?, team=?, documents=?, updated_at=datetime('now') WHERE id=?`,
      [program_id, step_completed || 1, JSON.stringify(founder_info || {}), JSON.stringify(startup_info || {}), JSON.stringify(problem_solution || {}), JSON.stringify(market || {}), JSON.stringify(business_model || {}), JSON.stringify(team || {}), JSON.stringify(documents || {}), existing.id]
    );
    res.json({ success: true, id: existing.id });
  } else {
    const id = uuidv4();
    dbWrapper.run(
      `INSERT INTO incubation_applications (id, startup_id, user_id, program_id, status, step_completed, founder_info, startup_info, problem_solution, market, business_model, team, documents)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, startup.id, req.user.id, program_id, 'draft', step_completed || 1, JSON.stringify(founder_info || {}), JSON.stringify(startup_info || {}), JSON.stringify(problem_solution || {}), JSON.stringify(market || {}), JSON.stringify(business_model || {}), JSON.stringify(team || {}), JSON.stringify(documents || {})]
    );
    res.json({ success: true, id });
  }
});

// POST /api/applications/:id/submit
router.post('/:id/submit', auth, (req, res) => {
  const app = dbWrapper.get('SELECT * FROM incubation_applications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (app.status !== 'draft') return res.status(400).json({ error: 'Application already submitted' });

  dbWrapper.run(
    "UPDATE incubation_applications SET status = 'submitted', submitted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?",
    [app.id]
  );

  // Notify admin
  const admin = dbWrapper.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (admin) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), admin.id, 'application', '📋', 'New incubation application', `${req.user.name} submitted a new application.`, 'applications']
    );
  }

  // Notify startup
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), req.user.id, 'application', '📋', 'Application submitted', 'Your incubation application has been submitted successfully. We will review it and get back to you.', '#journey']
  );

  res.json({ success: true });
});

// GET /api/applications/programs — Get available programs
router.get('/programs', (req, res) => {
  const programs = dbWrapper.all('SELECT * FROM incubation_programs WHERE is_active = 1 ORDER BY created_at DESC');
  res.json({ programs });
});

module.exports = router;
