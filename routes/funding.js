/* api/funding.js — Funding applications */
const express = require('express');
const router = express.Router();
const { randomUUID: uuidv4 } = require('crypto');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/funding — Get funding for current startup or all (admin)
router.get('/', auth, (req, res) => {
  let funding;
  if (req.user.role === 'admin') {
    funding = dbWrapper.all(
      `SELECT f.*, s.name as startup_name, u.full_name as founder_name
       FROM funding_applications f
       JOIN startups s ON f.startup_id = s.id
       JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );
  } else {
    const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
    if (!startup) return res.json({ funding: [] });
    funding = dbWrapper.all('SELECT * FROM funding_applications WHERE startup_id = ? ORDER BY created_at DESC', [startup.id]);
  }
  res.json({ funding });
});

// POST /api/funding — Submit funding application
router.post('/', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const { name, category, amount_requested, purpose, budget_breakdown, expected_outcome } = req.body;
  if (!name || !amount_requested) return res.status(400).json({ error: 'Name and amount required' });

  const id = uuidv4();
  dbWrapper.run(
    `INSERT INTO funding_applications (id, startup_id, user_id, name, category, amount_requested, purpose, budget_breakdown, expected_outcome, status)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id, startup.id, req.user.id, name, category || '', amount_requested, purpose || '', JSON.stringify(budget_breakdown || {}), expected_outcome || '', 'pending']
  );

  // Notify admin
  const admin = dbWrapper.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (admin) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), admin.id, 'funding', '💰', 'New funding application', `${req.user.name} submitted a funding application: ${name}`, 'funding']
    );
  }

  // Log activity
  dbWrapper.run(
    'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
    [uuidv4(), req.user.id, startup.id, '💰', 'rgba(0,212,170,0.12)', `<strong>Funding application</strong> submitted — ${name}`]
  );

  // Notify self
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), req.user.id, 'funding', '💰', 'Funding application submitted', `Your application for "${name}" has been submitted.`, '#funding']
  );

  res.json({ success: true, funding: dbWrapper.get('SELECT * FROM funding_applications WHERE id = ?', [id]) });
});

// PUT /api/funding/:id — Admin update (approve/reject)
router.put('/:id', ...requireRole('admin'), (req, res) => {
  const fa = dbWrapper.get('SELECT * FROM funding_applications WHERE id = ?', [req.params.id]);
  if (!fa) return res.status(404).json({ error: 'Funding application not found' });

  const { status, amount_approved, amount_released, admin_notes } = req.body;
  const updates = ["updated_at = datetime('now')", "reviewed_at = datetime('now')", 'reviewed_by = ?'];
  const params = [req.user.id];

  if (status) { updates.push('status = ?'); params.push(status); }
  if (amount_approved !== undefined) { updates.push('amount_approved = ?'); params.push(amount_approved); }
  if (amount_released !== undefined) { updates.push('amount_released = ?'); params.push(amount_released); }
  if (admin_notes) { updates.push('admin_notes = ?'); params.push(admin_notes); }

  params.push(fa.id);
  dbWrapper.run(`UPDATE funding_applications SET ${updates.join(', ')} WHERE id = ?`, params);

  // Notify startup user
  const statusLabel = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Updated';
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), fa.user_id, 'funding', '💰', `Funding application ${statusLabel}`, `Your funding application "${fa.name}" has been ${statusLabel.toLowerCase()}.`, '#funding']
  );

  res.json({ success: true });
});

module.exports = router;
