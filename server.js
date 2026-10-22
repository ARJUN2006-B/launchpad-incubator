/* ============================================================
   server.js — LaunchPad Express Server
   Full-stack Startup Incubator Platform
   Supports both Local Server and Vercel Serverless Function
============================================================ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, getDbStatus, isServerless } = require('./db/database');
const { seedIfEmpty } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database Initialization Singleton ──
let dbReadyPromise = null;
function ensureDatabase() {
  if (!dbReadyPromise) {
    dbReadyPromise = (async () => {
      await initDB();
      seedIfEmpty();
    })().catch(err => {
      // Clear promise so subsequent requests can retry if failed
      dbReadyPromise = null;
      throw err;
    });
  }
  return dbReadyPromise;
}

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Ensure DB Ready for all requests ──
app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ error: 'Database failed to initialize', message: err.message });
    }
    next();
  }
});

// ── Static Files ──
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dashboards', express.static(path.join(__dirname, 'dashboards')));
// Legacy: serve original dashboard files from root
app.use(express.static(__dirname));
// Uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes (modular routers) ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/funding', require('./routes/funding'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/investors', require('./routes/investors'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/admin', require('./routes/admin'));

// ── Global Search ──
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ results: {} });
  const { dbWrapper } = require('./db/database');
  const startups = dbWrapper.all("SELECT id, name, industry, stage, tagline, 'startup' as type FROM startups WHERE is_public = 1 AND (name LIKE ? OR tagline LIKE ? OR industry LIKE ?) LIMIT 5", [`%${q}%`, `%${q}%`, `%${q}%`]);
  const mentors = dbWrapper.all("SELECT id, name, role, 'mentor' as type FROM mentors WHERE name LIKE ? OR role LIKE ? LIMIT 5", [`%${q}%`, `%${q}%`]);
  const events = dbWrapper.all("SELECT id, title as name, category, event_date, 'event' as type FROM events WHERE title LIKE ? LIMIT 5", [`%${q}%`]);
  res.json({ results: { startups, mentors, events } });
});

// ── Health Check & DB Status ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'LaunchPad Incubator',
    serverless: isServerless,
    timestamp: new Date().toISOString(),
    database: getDbStatus()
  });
});

app.get('/api/db-status', (req, res) => {
  res.json(getDbStatus());
});

// ── Page Routes ──

// Public pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/programs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'programs.html')));
app.get('/startups', (req, res) => res.sendFile(path.join(__dirname, 'public', 'startups.html')));
app.get('/mentors', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mentors.html')));
app.get('/events', (req, res) => res.sendFile(path.join(__dirname, 'public', 'events.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Dashboard routes (protected by client-side auth check, server sends HTML)
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'startup', 'index.html')));
app.get('/dashboard/startup', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'startup', 'index.html')));
app.get('/dashboard/mentor', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'mentor', 'index.html')));
app.get('/dashboard/investor', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'investor', 'index.html')));
app.get('/dashboard/admin', (req, res) => res.sendFile(path.join(__dirname, 'dashboards', 'admin', 'index.html')));

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

// ── Bootstrap (only starts listener when run directly) ──
async function start() {
  await ensureDatabase();
  
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

if (require.main === module) {
  start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = app;
