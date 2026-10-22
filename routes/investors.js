/* api/investors.js — Investor hub */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/investors — Investor list (public/startups)
router.get('/', (req, res) => {
  const investors = dbWrapper.all('SELECT id, name, organization, initials, color, bg, investor_type, focus_sectors, investment_range_text, portfolio_count, preferred_stage, description, website, contact_name, is_verified FROM investors WHERE is_verified = 1 ORDER BY portfolio_count DESC');
  res.json({ investors });
});

// GET /api/investors/profile — Get own investor profile
router.get('/profile', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT * FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.status(404).json({ error: 'Investor profile not found' });
  res.json({ investor });
});

// PUT /api/investors/profile — Update investor profile
router.put('/profile', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT id FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.status(404).json({ error: 'Profile not found' });

  const { organization, investor_type, focus_sectors, investment_range_text, portfolio_count, preferred_stage, description, website } = req.body;
  dbWrapper.run(
    `UPDATE investors SET organization=?, investor_type=?, focus_sectors=?, investment_range_text=?, portfolio_count=?, preferred_stage=?, description=?, website=?, updated_at=datetime('now') WHERE id=?`,
    [organization, investor_type, JSON.stringify(focus_sectors || []), investment_range_text, portfolio_count || 0, preferred_stage, description, website, investor.id]
  );
  res.json({ success: true });
});

// GET /api/investors/opportunities — Startups that are public (investor view)
router.get('/opportunities', auth, (req, res) => {
  const { industry, stage, search } = req.query;
  let sql = `SELECT s.id, s.name, s.logo, s.tagline, s.industry, s.stage, s.progress, s.location, s.market_size, s.cohort, s.founded_date
             FROM startups s WHERE s.is_public = 1 AND s.incubation_status = 'active'`;
  const params = [];
  if (industry) { sql += ' AND s.industry LIKE ?'; params.push(`%${industry}%`); }
  if (stage) { sql += ' AND s.stage = ?'; params.push(stage); }
  if (search) { sql += ' AND (s.name LIKE ? OR s.tagline LIKE ? OR s.industry LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  sql += ' ORDER BY s.progress DESC';
  const startups = dbWrapper.all(sql, params);
  res.json({ startups, opportunities: startups });
});

// GET /api/investors/watchlist
router.get('/watchlist', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT id FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.json({ watchlist: [] });

  const watchlist = dbWrapper.all(
    `SELECT s.id, s.name, s.logo, s.tagline, s.industry, s.stage, s.progress, w.created_at
     FROM watchlist w JOIN startups s ON w.startup_id = s.id WHERE w.investor_id = ?`,
    [investor.id]
  );
  res.json({ watchlist });
});

// POST /api/investors/watchlist/:startupId
router.post('/watchlist/:startupId', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT id FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.status(404).json({ error: 'Investor profile not found' });

  const existing = dbWrapper.get('SELECT id FROM watchlist WHERE investor_id = ? AND startup_id = ?', [investor.id, req.params.startupId]);
  if (existing) {
    dbWrapper.run('DELETE FROM watchlist WHERE id = ?', [existing.id]);
    return res.json({ success: true, action: 'removed' });
  }

  dbWrapper.run('INSERT INTO watchlist (id, investor_id, startup_id) VALUES (?,?,?)', [uuidv4(), investor.id, req.params.startupId]);
  res.json({ success: true, action: 'added' });
});

// POST /api/investors/interest — Show investment interest
router.post('/interest', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT id FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.status(404).json({ error: 'Investor profile not found' });

  const { startup_id, proposed_amount, message, investment_type } = req.body;
  if (!startup_id) return res.status(400).json({ error: 'Startup ID required' });

  const existing = dbWrapper.get('SELECT id FROM investment_interests WHERE investor_id = ? AND startup_id = ?', [investor.id, startup_id]);
  if (existing) {
    dbWrapper.run('UPDATE investment_interests SET status = ?, proposed_amount = ?, message = ? WHERE id = ?', ['interested', proposed_amount || 0, message || '', existing.id]);
  } else {
    dbWrapper.run(
      'INSERT INTO investment_interests (id, investor_id, startup_id, proposed_amount, message, investment_type, status) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), investor.id, startup_id, proposed_amount || 0, message || '', investment_type || 'Equity', 'interested']
    );
  }

  // Notify startup
  const startupData = dbWrapper.get('SELECT user_id, name FROM startups WHERE id = ?', [startup_id]);
  const invData = dbWrapper.get('SELECT name FROM investors WHERE id = ?', [investor.id]);
  if (startupData) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), startupData.user_id, 'investor', '💼', 'Investor interest!', `${invData?.name || 'An investor'} showed interest in ${startupData.name}.`, '#investors']
    );
    dbWrapper.run(
      'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
      [uuidv4(), startupData.user_id, startup_id, '👁', 'rgba(255,184,48,0.12)', `<strong>${invData?.name}</strong> showed investment interest`]
    );
  }

  res.json({ success: true });
});

// GET /api/investors/interests/my — Get interests shown TO current startup
router.get('/interests/my', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.json({ interests: [] });

  const interests = dbWrapper.all(
    `SELECT ii.*, inv.name as investor_name, inv.organization, inv.initials, inv.color, inv.bg, inv.investor_type
     FROM investment_interests ii JOIN investors inv ON ii.investor_id = inv.id
     WHERE ii.startup_id = ? ORDER BY ii.created_at DESC`,
    [startup.id]
  );
  res.json({ interests });
});

// GET /api/investors/my-interests — Get interests shown BY current investor
router.get('/my-interests', ...requireRole('investor'), (req, res) => {
  const investor = dbWrapper.get('SELECT id FROM investors WHERE user_id = ?', [req.user.id]);
  if (!investor) return res.json({ interests: [] });

  const interests = dbWrapper.all(
    `SELECT ii.*, s.name as startup_name, s.industry, s.stage, s.logo
     FROM investment_interests ii JOIN startups s ON ii.startup_id = s.id
     WHERE ii.investor_id = ? ORDER BY ii.created_at DESC`,
    [investor.id]
  );
  res.json({ interests });
});

module.exports = router;
