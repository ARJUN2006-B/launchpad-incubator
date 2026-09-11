/* api/meetings.js — Meeting management */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/meetings
router.get('/', auth, (req, res) => {
  const meetings = dbWrapper.all(
    `SELECT m.*, 
      u1.full_name as organizer_name, 
      u2.full_name as participant_name,
      s.name as startup_name
     FROM meetings m
     LEFT JOIN users u1 ON m.organizer_id = u1.id
     LEFT JOIN users u2 ON m.participant_id = u2.id
     LEFT JOIN startups s ON m.startup_id = s.id
     WHERE m.organizer_id = ? OR m.participant_id = ?
     ORDER BY m.meeting_date DESC`,
    [req.user.id, req.user.id]
  );
  res.json({ meetings });
});

// POST /api/meetings — Request a meeting
router.post('/', auth, (req, res) => {
  const { title, participant_id, startup_id, meeting_date, meeting_time, meeting_type, topic, description, notes } = req.body;
  if (!title || !participant_id || !meeting_date) {
    return res.status(400).json({ error: 'Title, participant and date are required' });
  }

  const id = uuidv4();
  dbWrapper.run(
    `INSERT INTO meetings (id, title, organizer_id, participant_id, startup_id, meeting_date, meeting_time, meeting_type, topic, description, notes, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, title, req.user.id, participant_id, startup_id || null, meeting_date, meeting_time || '', meeting_type || 'Video Call', topic || '', description || '', notes || '', 'requested']
  );

  // Notify participant
  dbWrapper.run(
    'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), participant_id, 'meeting', '📅', 'New meeting request', `${req.user.name} has requested a meeting: ${title}`, 'meetings']
  );

  // Log activity
  if (startup_id) {
    dbWrapper.run(
      'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
      [uuidv4(), req.user.id, startup_id, '📅', 'rgba(255,184,48,0.12)', `<strong>Meeting requested</strong> — ${title}`]
    );
  }

  res.json({ success: true, meeting: dbWrapper.get('SELECT * FROM meetings WHERE id = ?', [id]) });
});

// PUT /api/meetings/:id — Update meeting status
router.put('/:id', auth, (req, res) => {
  const meeting = dbWrapper.get('SELECT * FROM meetings WHERE id = ?', [req.params.id]);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  if (meeting.organizer_id !== req.user.id && meeting.participant_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { status, notes, meeting_date, meeting_time } = req.body;
  const updates = ["updated_at = datetime('now')"];
  const params = [];

  if (status) { updates.push('status = ?'); params.push(status); }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
  if (meeting_date) { updates.push('meeting_date = ?'); params.push(meeting_date); }
  if (meeting_time) { updates.push('meeting_time = ?'); params.push(meeting_time); }

  params.push(meeting.id);
  dbWrapper.run(`UPDATE meetings SET ${updates.join(', ')} WHERE id = ?`, params);

  // Notify the other party about status change
  const notifyId = meeting.organizer_id === req.user.id ? meeting.participant_id : meeting.organizer_id;
  if (status && status !== meeting.status) {
    dbWrapper.run(
      'INSERT INTO notifications (id, user_id, type, icon, title, text, link) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), notifyId, 'meeting', '📅', `Meeting ${status}`, `"${meeting.title}" has been ${status}.`, 'meetings']
    );
  }

  res.json({ success: true });
});

// DELETE /api/meetings/:id
router.delete('/:id', auth, (req, res) => {
  const meeting = dbWrapper.get('SELECT * FROM meetings WHERE id = ?', [req.params.id]);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  if (meeting.organizer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  dbWrapper.run('DELETE FROM meetings WHERE id = ?', [meeting.id]);
  res.json({ success: true });
});

module.exports = router;
