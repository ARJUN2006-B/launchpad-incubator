/* api/auth.js — Authentication routes */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { dbWrapper } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'launchpad_secret';
const JWT_EXPIRES = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.full_name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, role, startup_name, industry, expertise, organization, investment_sectors } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Email, password, name and role are required' });
    }

    if (!['startup', 'mentor', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be startup, mentor, or investor' });
    }

    const existing = dbWrapper.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    dbWrapper.run(
      'INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES (?,?,?,?,?,?)',
      [userId, email.toLowerCase(), password_hash, full_name, phone || '', role]
    );

    // Create role-specific profile
    if (role === 'startup') {
      const startupId = uuidv4();
      const initials = (startup_name || full_name).substring(0, 2).toUpperCase();
      dbWrapper.run(
        `INSERT INTO startups (id, user_id, name, logo, industry, incubation_status) VALUES (?,?,?,?,?,?)`,
        [startupId, userId, startup_name || `${full_name}'s Startup`, initials, industry || 'Technology', 'applicant']
      );
      // Add founder as team member
      dbWrapper.run(
        'INSERT INTO startup_team_members (id, startup_id, name, role, color, initials) VALUES (?,?,?,?,?,?)',
        [uuidv4(), startupId, full_name, 'Founder & CEO', '#6C63FF', full_name.substring(0, 2).toUpperCase()]
      );
    } else if (role === 'mentor') {
      dbWrapper.run(
        `INSERT INTO mentors (id, user_id, name, initials, role, expertise, bio) VALUES (?,?,?,?,?,?,?)`,
        [uuidv4(), userId, full_name, full_name.substring(0, 2).toUpperCase(), expertise || 'Startup Advisor', JSON.stringify([expertise || 'Startup Strategy']), '']
      );
    } else if (role === 'investor') {
      dbWrapper.run(
        `INSERT INTO investors (id, user_id, name, organization, initials, focus_sectors) VALUES (?,?,?,?,?,?)`,
        [uuidv4(), userId, full_name, organization || '', full_name.substring(0, 2).toUpperCase(), JSON.stringify(investment_sectors ? [investment_sectors] : ['Technology'])]
      );
    }

    const user = dbWrapper.get('SELECT id, email, full_name, role FROM users WHERE id = ?', [userId]);
    const token = generateToken(user);

    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.full_name, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbWrapper.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.full_name, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = dbWrapper.get('SELECT id, email, full_name, role, phone, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
