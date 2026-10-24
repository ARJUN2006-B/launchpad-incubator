/* api/programs.js — Incubation programs directory */
const express = require('express');
const router = express.Router();
const { dbWrapper } = require('../db/database');

// GET /api/programs — Public programs list
router.get('/', (req, res) => {
  try {
    const programs = dbWrapper.all('SELECT * FROM incubation_programs WHERE is_active = 1 ORDER BY created_at ASC');
    res.json({ programs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch programs', message: err.message });
  }
});

// GET /api/programs/:id — Single program details
router.get('/:id', (req, res) => {
  try {
    const program = dbWrapper.get('SELECT * FROM incubation_programs WHERE id = ?', [req.params.id]);
    if (!program) return res.status(404).json({ error: 'Program not found' });
    res.json({ program });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch program', message: err.message });
  }
});

module.exports = router;
