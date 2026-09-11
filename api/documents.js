/* api/documents.js — Document management */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { dbWrapper } = require('../db/database');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.png', '.jpg', '.jpeg', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

// GET /api/documents — Get documents for current startup
router.get('/', auth, (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.json({ documents: [] });

  const { category, search } = req.query;
  let sql = 'SELECT * FROM documents WHERE startup_id = ?';
  const params = [startup.id];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  sql += ' ORDER BY created_at DESC';

  res.json({ documents: dbWrapper.all(sql, params) });
});

// POST /api/documents — Upload document
router.post('/', auth, upload.single('file'), (req, res) => {
  const startup = dbWrapper.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id]);
  if (!startup) return res.status(404).json({ error: 'No startup found' });

  const { category, version, milestone_id } = req.body;
  const file = req.file;

  let name, file_path, file_type, size_text, icon, color;

  if (file) {
    name = req.body.name || file.originalname;
    file_path = file.filename;
    file_type = path.extname(file.originalname).slice(1).toLowerCase();
    size_text = formatSize(file.size);
  } else if (req.body.name) {
    // Demo upload (no actual file)
    name = req.body.name;
    file_path = null;
    file_type = req.body.file_type || 'pdf';
    size_text = req.body.size_text || '1.0 MB';
  } else {
    return res.status(400).json({ error: 'File or name required' });
  }

  // Icon & color by category
  const catConfig = {
    'Business Plan': { icon: '📄', color: '#FF4D6A' },
    'Pitch Deck': { icon: '📊', color: '#FF7A50' },
    'Financial Plan': { icon: '📈', color: '#00D4AA' },
    'Product Documents': { icon: '📝', color: '#6C63FF' },
    'Legal Documents': { icon: '⚖️', color: '#A78BFA' },
    'Progress Reports': { icon: '📋', color: '#FFB830' },
  };
  const config = catConfig[category] || { icon: '📄', color: '#6C63FF' };

  const id = uuidv4();
  dbWrapper.run(
    `INSERT INTO documents (id, startup_id, user_id, name, original_name, file_path, file_type, category, size_text, version, status, icon, color, milestone_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, startup.id, req.user.id, name, file?.originalname || name, file_path, file_type, category || 'Other', size_text, version || 'v1.0', 'In Review', config.icon, config.color, milestone_id || null]
  );

  // Log activity
  dbWrapper.run(
    'INSERT INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
    [uuidv4(), req.user.id, startup.id, '📄', 'rgba(108,99,255,0.12)', `<strong>${name}</strong> uploaded to Documents`]
  );

  res.json({ success: true, document: dbWrapper.get('SELECT * FROM documents WHERE id = ?', [id]) });
});

// DELETE /api/documents/:id
router.delete('/:id', auth, (req, res) => {
  const doc = dbWrapper.get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  // Delete file if exists
  if (doc.file_path) {
    const filePath = path.join(__dirname, '..', 'uploads', doc.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  dbWrapper.run('DELETE FROM documents WHERE id = ?', [doc.id]);
  res.json({ success: true });
});

// GET /api/documents/:id/download — Serve file
router.get('/:id/download', auth, (req, res) => {
  const doc = dbWrapper.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (!doc.file_path) return res.status(404).json({ error: 'No file attached' });

  const filePath = path.join(__dirname, '..', 'uploads', doc.file_path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  res.download(filePath, doc.name);
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

module.exports = router;
