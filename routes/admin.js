/* api/admin.js — Admin management routes */
const express = require('express');
const router = express.Router();
const { randomUUID: uuidv4 } = require('crypto');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// All admin routes require admin role
router.use(...requireRole('admin'));

// GET /api/admin/dashboard — Analytics overview
router.get('/dashboard', (req, res) => {
  const totalStartups = dbWrapper.get('SELECT COUNT(*) as count FROM startups')?.count || 0;
  const activeStartups = dbWrapper.get("SELECT COUNT(*) as count FROM startups WHERE incubation_status = 'active'")?.count || 0;
  const graduatedStartups = dbWrapper.get("SELECT COUNT(*) as count FROM startups WHERE incubation_status = 'graduated'")?.count || 0;
  const pendingApplications = dbWrapper.get("SELECT COUNT(*) as count FROM incubation_applications WHERE status IN ('submitted','under_review','interview')")?.count || 0;
  const totalMentors = dbWrapper.get('SELECT COUNT(*) as count FROM mentors')?.count || 0;
  const totalInvestors = dbWrapper.get('SELECT COUNT(*) as count FROM investors')?.count || 0;
  const totalUsers = dbWrapper.get('SELECT COUNT(*) as count FROM users')?.count || 0;
  const upcomingEvents = dbWrapper.get("SELECT COUNT(*) as count FROM events WHERE event_date >= date('now')")?.count || 0;

  const fundingApproved = dbWrapper.get("SELECT SUM(amount_approved) as total FROM funding_applications WHERE status IN ('approved','released')")?.total || 0;
  const fundingReleased = dbWrapper.get("SELECT SUM(amount_released) as total FROM funding_applications WHERE amount_released > 0")?.total || 0;

  const industryDist = dbWrapper.all('SELECT industry, COUNT(*) as count FROM startups GROUP BY industry ORDER BY count DESC LIMIT 8');
  const stageDist = dbWrapper.all('SELECT stage, COUNT(*) as count FROM startups GROUP BY stage ORDER BY count DESC');
  const applicationStatusDist = dbWrapper.all('SELECT status, COUNT(*) as count FROM incubation_applications GROUP BY status');

  const recentStartups = dbWrapper.all(`SELECT s.*, u.full_name as founder_name FROM startups s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT 5`);
  const recentApplications = dbWrapper.all(`SELECT ia.*, u.full_name as founder_name, s.name as startup_name FROM incubation_applications ia JOIN users u ON ia.user_id = u.id LEFT JOIN startups s ON ia.startup_id = s.id ORDER BY ia.created_at DESC LIMIT 5`);

  res.json({
    stats: { totalStartups, activeStartups, graduatedStartups, pendingApplications, totalMentors, totalInvestors, totalUsers, upcomingEvents, fundingApproved, fundingReleased },
    charts: { industryDist, stageDist, applicationStatusDist },
    recentStartups, recentApplications
  });
});

// GET /api/admin/startups — All startups with filters
router.get('/startups', (req, res) => {
  const { status, industry, stage, search } = req.query;
  let sql = `SELECT s.*, u.full_name as founder_name, u.email as founder_email FROM startups s JOIN users u ON s.user_id = u.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND s.incubation_status = ?'; params.push(status); }
  if (industry) { sql += ' AND s.industry LIKE ?'; params.push(`%${industry}%`); }
  if (stage) { sql += ' AND s.stage = ?'; params.push(stage); }
  if (search) { sql += ' AND (s.name LIKE ? OR u.full_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY s.created_at DESC';
  res.json({ startups: dbWrapper.all(sql, params) });
});

// PUT /api/admin/startups/:id — Update startup (admin)
router.put('/startups/:id', (req, res) => {
  const { incubation_status, stage, cohort, progress, is_public } = req.body;
  const updates = ["updated_at = datetime('now')"];
  const params = [];
  if (incubation_status !== undefined) { updates.push('incubation_status = ?'); params.push(incubation_status); }
  if (stage !== undefined) { updates.push('stage = ?'); params.push(stage); }
  if (cohort !== undefined) { updates.push('cohort = ?'); params.push(cohort); }
  if (progress !== undefined) { updates.push('progress = ?'); params.push(progress); }
  if (is_public !== undefined) { updates.push('is_public = ?'); params.push(is_public); }
  params.push(req.params.id);
  dbWrapper.run(`UPDATE startups SET ${updates.join(', ')} WHERE id = ?`, params);
  res.json({ success: true });
});

// GET /api/admin/applications — All applications
router.get('/applications', (req, res) => {
  const { status, search } = req.query;
  let sql = `SELECT ia.*, u.full_name as founder_name, u.email as founder_email, s.name as startup_name
             FROM incubation_applications ia 
             JOIN users u ON ia.user_id = u.id 
             LEFT JOIN startups s ON ia.startup_id = s.id
             WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND ia.status = ?'; params.push(status); }
  if (search) { sql += ' AND (u.full_name LIKE ? OR s.name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY ia.created_at DESC';
  res.json({ applications: dbWrapper.all(sql, params) });
});

// PUT /api/admin/applications/:id — Review application
router.put('/applications/:id', (req, res) => {
  const { status, admin_notes, interview_date, mentor_id } = req.body;
  const app = dbWrapper.get('SELECT * FROM incubation_applications WHERE id = ?', [req.params.id]);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  dbWrapper.run(
    `UPDATE incubation_applications SET status=?, admin_notes=?, interview_date=?, reviewed_at=datetime('now'), reviewed_by=?, updated_at=datetime('now') WHERE id=?`,
    [status || app.status, admin_notes || app.admin_notes, interview_date || app.interview_date, req.user.id, app.id]
  );

  // Notify applicant
  const statusMsg = status === 'approved' ? 'Congratulations! Your application has been approved.' : status === 'rejected' ? 'Your application has been reviewed.' : `Your application status has been updated to: ${status}`;
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), app.user_id, 'application', '📋', `Application ${status || 'updated'}`, statusMsg, '#journey']
  );

  // If approved and mentor_id provided, assign mentor
  if (status === 'approved' && mentor_id) {
    // Update startup status
    dbWrapper.run("UPDATE startups SET incubation_status = 'active' WHERE id = ?", [app.startup_id]);
    // Remove old assignments
    dbWrapper.run('UPDATE mentor_assignments SET is_active = 0 WHERE startup_id = ?', [app.startup_id]);
    // New assignment
    dbWrapper.run(
      'INSERT INTO mentor_assignments (id, mentor_id, startup_id, assigned_by) VALUES (?,?,?,?)',
      [uuidv4(), mentor_id, app.startup_id, req.user.id]
    );
    // Notify startup about mentor
    const mentor = dbWrapper.get('SELECT m.name FROM mentors m WHERE m.id = ?', [mentor_id]);
    if (mentor) {
      dbWrapper.run(
        'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
        [uuidv4(), app.user_id, 'mentor', '👨‍🏫', 'Mentor assigned!', `${mentor.name} has been assigned as your mentor.`, '#mentor']
      );
    }
  }

  res.json({ success: true });
});

// GET /api/admin/mentors — All mentors
router.get('/mentors', (req, res) => {
  const mentors = dbWrapper.all(`
    SELECT m.*, COALESCE(u.email, '') as email, COALESCE(u.full_name, m.name) as full_name,
    (SELECT COUNT(*) FROM mentor_assignments ma WHERE ma.mentor_id = m.id AND ma.is_active = 1) as assigned_count
    FROM mentors m LEFT JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC`
  );
  res.json({ mentors });
});

// POST /api/admin/mentor/assign — Assign mentor to startup
router.post('/mentor/assign', (req, res) => {
  const { mentor_id, startup_id } = req.body;
  if (!mentor_id || !startup_id) return res.status(400).json({ error: 'Mentor ID and startup ID required' });

  // Deactivate existing assignments
  dbWrapper.run('UPDATE mentor_assignments SET is_active = 0 WHERE startup_id = ?', [startup_id]);

  // New assignment
  dbWrapper.run(
    'INSERT INTO mentor_assignments (id, mentor_id, startup_id, assigned_by) VALUES (?,?,?,?)',
    [uuidv4(), mentor_id, startup_id, req.user.id]
  );

  const startup = dbWrapper.get('SELECT user_id, name FROM startups WHERE id = ?', [startup_id]);
  const mentor = dbWrapper.get('SELECT name FROM mentors WHERE id = ?', [mentor_id]);

  if (startup && mentor) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), startup.user_id, 'mentor', '👨‍🏫', 'Mentor assigned', `${mentor.name} has been assigned as your mentor for ${startup.name}.`, '#mentor']
    );
  }

  res.json({ success: true });
});

// GET /api/admin/investors — All investors
router.get('/investors', (req, res) => {
  const investors = dbWrapper.all('SELECT i.*, COALESCE(u.email, \'\') as email FROM investors i LEFT JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC');
  res.json({ investors });
});

// PUT /api/admin/investors/:id/verify — Verify investor
router.put('/investors/:id/verify', (req, res) => {
  dbWrapper.run('UPDATE investors SET is_verified = ? WHERE id = ?', [req.body.verified ? 1 : 0, req.params.id]);
  res.json({ success: true });
});

// GET /api/admin/users — All users
router.get('/users', (req, res) => {
  const users = dbWrapper.all('SELECT id, email, full_name, role, phone, created_at FROM users ORDER BY created_at DESC');
  res.json({ users });
});

// GET /api/admin/programs — Programs
router.get('/programs', (req, res) => {
  const programs = dbWrapper.all('SELECT * FROM incubation_programs ORDER BY created_at DESC');
  res.json({ programs });
});

// POST /api/admin/programs — Create program
router.post('/programs', (req, res) => {
  const { name, description, duration, eligibility, benefits, application_deadline, max_startups, cohort } = req.body;
  const id = uuidv4();
  dbWrapper.run(
    'INSERT INTO incubation_programs (id, name, description, duration, eligibility, benefits, application_deadline, max_startups, cohort) VALUES (?,?,?,?,?,?,?,?,?)',
    [id, name, description, duration, eligibility, JSON.stringify(benefits || []), application_deadline, max_startups || 30, cohort || '']
  );
  res.json({ success: true, program: dbWrapper.get('SELECT * FROM incubation_programs WHERE id = ?', [id]) });
});

// GET /api/admin/reports/summary — Generate report summary
router.get('/reports/summary', (req, res) => {
  const fundingSummary = dbWrapper.all('SELECT status, COUNT(*) as count, SUM(amount_requested) as total_requested, SUM(amount_approved) as total_approved FROM funding_applications GROUP BY status');
  const milestoneSummary = dbWrapper.all('SELECT status, COUNT(*) as count FROM milestones GROUP BY status');
  const eventSummary = dbWrapper.all('SELECT category, COUNT(*) as count, SUM(registered_count) as total_registrations FROM events GROUP BY category');
  const investorActivity = dbWrapper.all('SELECT ii.status, COUNT(*) as count FROM investment_interests ii GROUP BY ii.status');

  res.json({ fundingSummary, milestoneSummary, eventSummary, investorActivity });
});

// GET /api/admin/applications — search by startup
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ results: [] });

  const startups = dbWrapper.all('SELECT id, name, industry, stage, \'startup\' as type FROM startups WHERE name LIKE ? LIMIT 5', [`%${q}%`]);
  const mentors = dbWrapper.all('SELECT id, name, role, \'mentor\' as type FROM mentors WHERE name LIKE ? LIMIT 5', [`%${q}%`]);
  const investors = dbWrapper.all('SELECT id, name, organization, \'investor\' as type FROM investors WHERE name LIKE ? LIMIT 5', [`%${q}%`]);
  const events = dbWrapper.all('SELECT id, title as name, category, \'event\' as type FROM events WHERE title LIKE ? LIMIT 5', [`%${q}%`]);

  res.json({ results: { startups, mentors, investors, events } });
});

module.exports = router;
