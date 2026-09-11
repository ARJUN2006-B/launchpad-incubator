/* api/notifications.js — Notification system */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/notifications
router.get('/', auth, (req, res) => {
  const notifications = dbWrapper.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.user.id]
  );
  const unread_count = notifications.filter(n => !n.is_read).length;
  res.json({ notifications, unread_count });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, (req, res) => {
  dbWrapper.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, (req, res) => {
  dbWrapper.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
  res.json({ success: true });
});

// DELETE /api/notifications/:id
router.delete('/:id', auth, (req, res) => {
  dbWrapper.run('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
