/* api/messages.js — Internal messaging system */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// GET /api/messages/conversations — Get all conversations for current user
router.get('/conversations', auth, (req, res) => {
  const conversations = dbWrapper.all(
    `SELECT c.*,
      u1.full_name as p1_name, u1.role as p1_role,
      u2.full_name as p2_name, u2.role as p2_role,
      (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
      (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND is_read = 0) as unread_count
     FROM conversations c
     LEFT JOIN users u1 ON c.participant_one_id = u1.id
     LEFT JOIN users u2 ON c.participant_two_id = u2.id
     WHERE c.participant_one_id = ? OR c.participant_two_id = ?
     ORDER BY last_message_at DESC`,
    [req.user.id, req.user.id, req.user.id]
  );
  res.json({ conversations });
});

// GET /api/messages/:conversationId — Get messages in a conversation
router.get('/:conversationId', auth, (req, res) => {
  const conv = dbWrapper.get(
    'SELECT * FROM conversations WHERE id = ? AND (participant_one_id = ? OR participant_two_id = ?)',
    [req.params.conversationId, req.user.id, req.user.id]
  );
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const messages = dbWrapper.all(
    `SELECT m.*, u.full_name as sender_name, u.role as sender_role
     FROM messages m JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = ? ORDER BY m.created_at ASC`,
    [conv.id]
  );

  // Mark messages as read
  dbWrapper.run('UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?', [conv.id, req.user.id]);

  res.json({ conversation: conv, messages });
});

// POST /api/messages — Send a message
router.post('/', auth, (req, res) => {
  const { recipient_id, text } = req.body;
  if (!recipient_id || !text) return res.status(400).json({ error: 'Recipient and text required' });

  // Find or create conversation
  let conv = dbWrapper.get(
    `SELECT * FROM conversations WHERE 
     (participant_one_id = ? AND participant_two_id = ?) OR 
     (participant_one_id = ? AND participant_two_id = ?)`,
    [req.user.id, recipient_id, recipient_id, req.user.id]
  );

  if (!conv) {
    const convId = uuidv4();
    dbWrapper.run(
      'INSERT INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)',
      [convId, req.user.id, recipient_id]
    );
    conv = dbWrapper.get('SELECT * FROM conversations WHERE id = ?', [convId]);
  }

  const msgId = uuidv4();
  dbWrapper.run(
    'INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?,?,?,?)',
    [msgId, conv.id, req.user.id, text]
  );

  // Update conversation timestamp
  dbWrapper.run("UPDATE conversations SET last_message_at = datetime('now') WHERE id = ?", [conv.id]);

  res.json({ success: true, message: dbWrapper.get('SELECT * FROM messages WHERE id = ?', [msgId]), conversation_id: conv.id });
});

// POST /api/messages/conversation/:id — Reply in existing conversation
router.post('/conversation/:id', auth, (req, res) => {
  const conv = dbWrapper.get(
    'SELECT * FROM conversations WHERE id = ? AND (participant_one_id = ? OR participant_two_id = ?)',
    [req.params.id, req.user.id, req.user.id]
  );
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required' });

  const msgId = uuidv4();
  dbWrapper.run('INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?,?,?,?)', [msgId, conv.id, req.user.id, text]);
  dbWrapper.run("UPDATE conversations SET last_message_at = datetime('now') WHERE id = ?", [conv.id]);

  res.json({ success: true, message: dbWrapper.get('SELECT * FROM messages WHERE id = ?', [msgId]) });
});

module.exports = router;
