/* ============================================================
   server.js — LaunchPad Express Server
   Full-stack Startup Incubator Platform
============================================================ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db/database');
const { seedIfEmpty } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Static Files ──
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dashboards', express.static(path.join(__dirname, 'dashboards')));
// Legacy: serve original dashboard files from root
app.use(express.static(__dirname));
// Uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──
app.use('/api/auth', require('./api/auth'));
app.use('/api/startups', require('./api/startups'));
app.use('/api/milestones', require('./api/milestones'));
app.use('/api/meetings', require('./api/meetings'));
app.use('/api/funding', require('./api/funding'));
app.use('/api/events', require('./api/events'));
app.use('/api/notifications', require('./api/notifications'));
app.use('/api/messages', require('./api/messages'));
app.use('/api/mentor', require('./api/mentor'));
app.use('/api/investors', require('./api/investors'));
app.use('/api/applications', require('./api/applications'));
app.use('/api/documents', require('./api/documents'));
app.use('/api/admin', require('./api/admin'));

// ── Page Routes ──

// Public pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/programs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'programs.html')));
app.get('/startups-directory', (req, res) => res.sendFile(path.join(__dirname, 'public', 'startups.html')));
app.get('/mentors-directory', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mentors.html')));
app.get('/events-directory', (req, res) => res.sendFile(path.join(__dirname, 'public', 'events-public.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Dashboard routes (protected by client-side auth check, server sends HTML)
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'startup', 'index.html')));
app.get('/dashboard/startup', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'startup', 'index.html')));
app.get('/dashboard/mentor', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'mentor', 'index.html')));
app.get('/dashboard/investor', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'investor', 'index.html')));
app.get('/dashboard/admin', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'admin', 'index.html')));

// ── Global Search ──
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ results: {} });
  const { dbWrapper } = require('./db/database');
  const startups = dbWrapper.all('SELECT id, name, industry, stage, tagline, \'startup\' as type FROM startups WHERE is_public = 1 AND (name LIKE ? OR tagline LIKE ? OR industry LIKE ?) LIMIT 5', [`%${q}%`, `%${q}%`, `%${q}%`]);
  const mentors = dbWrapper.all('SELECT id, name, role, \'mentor\' as type FROM mentors WHERE name LIKE ? OR role LIKE ? LIMIT 5', [`%${q}%`, `%${q}%`]);
  const events = dbWrapper.all('SELECT id, title as name, category, event_date, \'event\' as type FROM events WHERE title LIKE ? LIMIT 5', [`%${q}%`]);
  res.json({ results: { startups, mentors, events } });
});

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', platform: 'LaunchPad Incubator' });
});

// ── 404 Handler ──
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.redirect('/');
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Bootstrap ──
async function start() {
  await initDB();
  seedIfEmpty();
  
  app.listen(PORT, () => {
    console.log('\n');
    console.log('🚀 ══════════════════════════════════════════════════');
    console.log('🚀  LaunchPad — Online Startup Incubator Platform');
    console.log('🚀 ══════════════════════════════════════════════════');
    console.log(`🌐  Public Site:      http://localhost:${PORT}`);
    console.log(`📊  Startup Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🎓  Mentor Dashboard:  http://localhost:${PORT}/dashboard/mentor`);
    console.log(`💼  Investor Dashboard:http://localhost:${PORT}/dashboard/investor`);
    console.log(`⚙️  Admin Dashboard:   http://localhost:${PORT}/dashboard/admin`);
    console.log('─────────────────────────────────────────────────────');
    console.log('📧  Demo Accounts (password: Demo@2024):');
    console.log('    startup@launchpad.demo   → Startup Dashboard');
    console.log('    mentor@launchpad.demo    → Mentor Dashboard');
    console.log('    investor@launchpad.demo  → Investor Dashboard');
    console.log('    admin@launchpad.demo     → Admin Dashboard');
    console.log('🚀 ══════════════════════════════════════════════════\n');
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
