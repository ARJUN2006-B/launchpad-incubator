/* api/events.js — Events management */
const express = require('express');
const router = express.Router();
const { randomUUID: uuidv4 } = require('crypto');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/events — Public event list
router.get('/', (req, res) => {
  const events = dbWrapper.all('SELECT * FROM events WHERE is_public = 1 ORDER BY event_date ASC');
  res.json({ events });
});

// GET /api/events/my-registrations — Events registered by current user
router.get('/my-registrations', auth, (req, res) => {
  const registrations = dbWrapper.all(
    `SELECT e.*, er.registered_at FROM events e 
     JOIN event_registrations er ON e.id = er.event_id 
     WHERE er.user_id = ? ORDER BY e.event_date ASC`,
    [req.user.id]
  );
  res.json({ registrations });
});

// POST /api/events/:id/register — Register for event
router.post('/:id/register', auth, (req, res) => {
  const ev = dbWrapper.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
  if (!ev) return res.status(404).json({ error: 'Event not found' });

  const existing = dbWrapper.get('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?', [ev.id, req.user.id]);
  if (existing) return res.status(409).json({ error: 'Already registered' });

  if (ev.capacity > 0 && ev.registered_count >= ev.capacity) {
    return res.status(400).json({ error: 'Event is full' });
  }

  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  dbWrapper.run(
    'INSERT INTO event_registrations (id, event_id, user_id, startup_id) VALUES (?,?,?,?)',
    [uuidv4(), ev.id, req.user.id, startup?.id || null]
  );
  dbWrapper.run('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?', [ev.id]);

  // Notify user
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), req.user.id, 'event', '🎟️', 'Event registration confirmed', `You are registered for "${ev.title}".`, '#events']
  );

  res.json({ success: true });
});

// DELETE /api/events/:id/register — Cancel registration
router.delete('/:id/register', auth, (req, res) => {
  const existing = dbWrapper.get('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!existing) return res.status(404).json({ error: 'Registration not found' });
  dbWrapper.run('DELETE FROM event_registrations WHERE id = ?', [existing.id]);
  dbWrapper.run('UPDATE events SET registered_count = MAX(0, registered_count - 1) WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// POST /api/events — Admin create event
router.post('/', ...requireRole('admin'), (req, res) => {
  const { title, description, event_date, event_time, venue, online_link, host, category, capacity, emoji, color, tag_color } = req.body;
  if (!title || !event_date) return res.status(400).json({ error: 'Title and date are required' });

  const id = uuidv4();
  dbWrapper.run(
    `INSERT INTO events (id, title, description, event_date, event_time, venue, online_link, host, category, capacity, emoji, color, tag_color, created_by)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, title, description || '', event_date, event_time || '', venue || '', online_link || '', host || 'LaunchPad', category || 'Workshop', capacity || 100, emoji || '🚀', color || '', tag_color || '#6C63FF', req.user.id]
  );
  res.json({ success: true, event: dbWrapper.get('SELECT * FROM events WHERE id = ?', [id]) });
});

// PUT /api/events/:id — Admin update event
router.put('/:id', ...requireRole('admin'), (req, res) => {
  const ev = dbWrapper.get('SELECT id FROM events WHERE id = ?', [req.params.id]);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const { title, description, event_date, event_time, venue, host, category, capacity } = req.body;
  dbWrapper.run(
    `UPDATE events SET title=?, description=?, event_date=?, event_time=?, venue=?, host=?, category=?, capacity=?, updated_at=datetime('now') WHERE id=?`,
    [title, description, event_date, event_time, venue, host, category, capacity, ev.id]
  );
  res.json({ success: true });
});

// GET /api/events/:id/registrations — Admin view registrations
router.get('/:id/registrations', ...requireRole('admin'), (req, res) => {
  const regs = dbWrapper.all(
    `SELECT er.*, u.full_name, u.email, s.name as startup_name 
     FROM event_registrations er 
     JOIN users u ON er.user_id = u.id 
     LEFT JOIN startups s ON er.startup_id = s.id 
     WHERE er.event_id = ?`,
    [req.params.id]
  );
  res.json({ registrations: regs });
});

module.exports = router;
