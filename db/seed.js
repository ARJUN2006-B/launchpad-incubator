/* ============================================================
   db/seed.js — Demo Data Seeder
   Creates realistic Indian startup ecosystem demo accounts
============================================================ */
const bcrypt = require('bcryptjs');
const { randomUUID: uuidv4 } = require('crypto');
const { dbWrapper } = require('./database');

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Demo@2024', 10);

// Fixed IDs for demo accounts
const IDS = {
  // Users
  startupUser: 'usr-startup-arjun',
  mentorUser: 'usr-mentor-rahul',
  investorUser: 'usr-investor-vikram',
  adminUser: 'usr-admin-launchpad',
  startupUser2: 'usr-startup-priya',
  startupUser3: 'usr-startup-arun',

  // Entities
  startup1: 'startup-novasphere',
  startup2: 'startup-finedge',
  startup3: 'startup-healthsync',
  mentor1: 'mentor-rahul',
  mentor2: 'mentor-priya-sharma',
  mentor3: 'mentor-arun-krishnan',
  investor1: 'investor-techventures',
  program1: 'program-cohort-2024b',
};

function seedIfEmpty() {
  const existingUser = dbWrapper.get('SELECT id FROM users WHERE email = ?', ['startup@launchpad.demo']);
  if (existingUser) {
    console.log('✅ Database already seeded');
    return;
  }

  console.log('🌱 Seeding database with demo data...');

  // ── USERS ──
  const users = [
    { id: IDS.startupUser, email: 'startup@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Arjun', phone: '+91 98765 43210', role: 'startup' },
    { id: IDS.mentorUser, email: 'mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Rahul Mehta', phone: '+91 99887 76655', role: 'mentor' },
    { id: IDS.investorUser, email: 'investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Vikram Bajaj', phone: '+91 98001 12345', role: 'investor' },
    { id: IDS.adminUser, email: 'admin@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'LaunchPad Admin', phone: '+91 80-4567-8901', role: 'admin' },
    { id: IDS.startupUser2, email: 'priya@finedge.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Priya Nair', phone: '+91 97654 32109', role: 'startup' },
    { id: IDS.startupUser3, email: 'arun@healthsync.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Arun Kumar', phone: '+91 96543 21098', role: 'startup' },
  ];

  for (const u of users) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO users (id, email, password_hash, full_name, phone, role) VALUES (?,?,?,?,?,?)',
      [u.id, u.email, u.password_hash, u.full_name, u.phone, u.role]
    );
  }

  // ── INCUBATION PROGRAM ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO incubation_programs (id, name, description, duration, eligibility, benefits, application_deadline, max_startups, current_startups, cohort)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.program1,
      'LaunchPad Cohort 2024-B',
      'An intensive 9-month startup incubation program supporting early-stage founders from Idea to Market. Includes mentorship, funding support, office space, investor connections, and world-class training.',
      '9 months (March – December 2024)',
      'Early-stage startups (pre-seed to seed) with at least 1 full-time founder. Technology-first startups preferred.',
      JSON.stringify(['₹5L Seed Grant', 'Premium Coworking Space', 'Expert Mentorship (12+ mentors)', 'Investor Connections', 'Legal & CA Support', 'Demo Day Access']),
      'February 28, 2024',
      30,
      28,
      '2024-B'
    ]
  );

  // ── STARTUPS ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO startups 
     (id, user_id, name, logo, tagline, industry, stage, founded_date, location, website, problem, solution, 
      target_customers, business_model, revenue_model, market_size, incubation_status, cohort, progress, days_active, is_public)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.startup1, IDS.startupUser, 'NovaSphere', 'NS',
      'AI-powered insights for modern farmers',
      'AgriTech / Artificial Intelligence', 'MVP Development', 'January 2024',
      'Bangalore, India', 'www.novasphere.in',
      'Over 60% of Indian farmers face crop losses due to lack of timely, localized agricultural data. Existing solutions are expensive, complex, or not adapted to regional conditions.',
      'NovaSphere uses AI and satellite data to provide hyper-local, affordable, actionable farming insights via a simple mobile app in regional languages.',
      'Small and medium-scale farmers (2–10 acres), Agro-input companies, State agriculture departments',
      'Freemium SaaS model with ₹199/month premium tier for advanced analytics. B2B licensing to agro-input companies.',
      'Subscription fees, B2B data licensing, API access for agro companies',
      '₹45,000 Cr Indian AgriTech market (2024), growing at 25% CAGR',
      'active', '2024-B', 68, 142, 1
    ]
  );

  dbWrapper.run(
    `INSERT OR IGNORE INTO startups 
     (id, user_id, name, logo, tagline, industry, stage, founded_date, location, website, problem, solution, 
      business_model, revenue_model, market_size, incubation_status, cohort, progress, days_active, is_public)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.startup2, IDS.startupUser2, 'FinEdge', 'FE',
      'Democratizing financial planning for India\'s next billion',
      'FinTech / AI', 'Market Validation', 'October 2023',
      'Mumbai, India', 'www.finedge.in',
      'Over 500 million Indians lack access to basic financial planning tools.',
      'FinEdge offers AI-driven financial planning tools in 12 Indian languages.',
      'B2C subscription at ₹299/month. B2B partnerships with banks and NBFCs.',
      'Subscription + B2B licensing + transaction fees',
      '₹1.2 lakh Cr FinTech market India (2024)',
      'active', '2024-B', 82, 180, 1
    ]
  );

  dbWrapper.run(
    `INSERT OR IGNORE INTO startups 
     (id, user_id, name, logo, tagline, industry, stage, founded_date, location, website, problem, solution, 
      business_model, revenue_model, market_size, incubation_status, cohort, progress, days_active, is_public)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.startup3, IDS.startupUser3, 'HealthSync', 'HS',
      'Connecting rural patients to urban specialists',
      'HealthTech / Telemedicine', 'Prototype', 'March 2024',
      'Chennai, India', 'www.healthsync.care',
      'Rural India has 1 doctor per 11,000 patients.',
      'HealthSync connects rural patients to verified urban specialists via video consultations and AI triage.',
      'Per-consultation fee + subscription for clinics. B2B with hospitals.',
      'Consultation fees (30%) + Hospital SaaS (70%)',
      '₹72,000 Cr Indian HealthTech market (2024)',
      'active', '2024-B', 45, 98, 1
    ]
  );

  // ── TEAM MEMBERS for NovaSphere ──
  const teamMembers = [
    { startup_id: IDS.startup1, name: 'Arjun', role: 'Founder & CEO', skills: JSON.stringify(['Product Strategy', 'AI/ML', 'Business Development']), color: '#6C63FF', initials: 'A' },
    { startup_id: IDS.startup1, name: 'Priya Nair', role: 'CTO', skills: JSON.stringify(['Machine Learning', 'Python', 'AWS']), color: '#00D4AA', initials: 'PN' },
    { startup_id: IDS.startup1, name: 'Rohit Verma', role: 'Lead Designer', skills: JSON.stringify(['UI/UX', 'Figma', 'User Research']), color: '#FFB830', initials: 'RV' },
    { startup_id: IDS.startup1, name: 'Kavya Singh', role: 'Growth Lead', skills: JSON.stringify(['Marketing', 'Content', 'SEO']), color: '#FF7A50', initials: 'KS' },
  ];
  for (const m of teamMembers) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO startup_team_members (id, startup_id, name, role, skills, color, initials) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), m.startup_id, m.name, m.role, m.skills, m.color, m.initials]
    );
  }

  // ── MENTORS ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO mentors (id, user_id, name, initials, role, experience, bio, expertise, availability, rating, sessions_completed, is_verified)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.mentor1, IDS.mentorUser, 'Dr. Rahul Mehta', 'RM',
      'Startup Strategy & Product Growth',
      '12+ years',
      'Dr. Rahul Mehta is a seasoned entrepreneur and startup advisor with over 12 years of experience building and scaling technology companies. He has co-founded 3 successful startups and mentored 50+ early-stage founders across AgriTech, FinTech, and B2B SaaS.',
      JSON.stringify(['Startup Strategy', 'Product-Market Fit', 'AgriTech', 'Go-to-Market', 'Fundraising', 'Team Building', 'B2B Sales', 'Growth Hacking']),
      JSON.stringify(['Monday 2–5 PM', 'Wednesday 3–6 PM', 'Friday 10 AM – 1 PM']),
      4.9, 8, 1
    ]
  );

  dbWrapper.run(
    `INSERT OR IGNORE INTO mentors (id, user_id, name, initials, role, experience, bio, expertise, availability, rating, sessions_completed, is_verified)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.mentor2, uuidv4(), 'Priya Sharma', 'PS',
      'FinTech & Product Management',
      '9+ years',
      'Priya Sharma is a product leader with experience at leading FinTech companies including Razorpay and Paytm. She specializes in helping startups achieve product-market fit and scale their growth strategies.',
      JSON.stringify(['FinTech', 'Product Management', 'User Research', 'Growth Strategy', 'Regulatory Compliance']),
      JSON.stringify(['Tuesday 3–6 PM', 'Thursday 4–7 PM']),
      4.7, 12, 1
    ]
  );

  dbWrapper.run(
    `INSERT OR IGNORE INTO mentors (id, user_id, name, initials, role, experience, bio, expertise, availability, rating, sessions_completed, is_verified)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.mentor3, uuidv4(), 'Arun Krishnan', 'AK',
      'HealthTech & Operations',
      '15+ years',
      'Arun Krishnan is a healthcare industry veteran with 15 years of experience across hospitals, medtech, and health startups. He has led operations at Apollo Hospitals and advised multiple HealthTech startups.',
      JSON.stringify(['HealthTech', 'Operations Management', 'Healthcare Policy', 'Scaling', 'Hospital Partnerships']),
      JSON.stringify(['Monday 10 AM – 1 PM', 'Wednesday 11 AM – 2 PM', 'Saturday 10 AM – 12 PM']),
      4.8, 6, 1
    ]
  );

  // ── MENTOR ASSIGNMENTS ──
  dbWrapper.run(
    'INSERT OR IGNORE INTO mentor_assignments (id, mentor_id, startup_id, assigned_by) VALUES (?,?,?,?)',
    [uuidv4(), IDS.mentor1, IDS.startup1, IDS.adminUser]
  );
  dbWrapper.run(
    'INSERT OR IGNORE INTO mentor_assignments (id, mentor_id, startup_id, assigned_by) VALUES (?,?,?,?)',
    [uuidv4(), IDS.mentor2, IDS.startup2, IDS.adminUser]
  );
  dbWrapper.run(
    'INSERT OR IGNORE INTO mentor_assignments (id, mentor_id, startup_id, assigned_by) VALUES (?,?,?,?)',
    [uuidv4(), IDS.mentor3, IDS.startup3, IDS.adminUser]
  );

  // ── MILESTONES for NovaSphere ──
  const milestones = [
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Idea Validation', icon: '💡', description: 'Validate the core problem hypothesis with at least 50 farmer interviews.', deadline: 'Apr 15, 2024', status: 'completed', progress: 100, submission: 'Validation Report v1.0', mentor_status: 'Approved', order_index: 1 },
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Business Model Canvas', icon: '📊', description: 'Create and validate a comprehensive business model canvas.', deadline: 'May 10, 2024', status: 'completed', progress: 100, submission: 'BMC Final v2.0', mentor_status: 'Approved', order_index: 2 },
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Prototype Development', icon: '🔧', description: 'Build a working prototype demonstrating core features.', deadline: 'Jun 20, 2024', status: 'completed', progress: 100, submission: 'Prototype Demo', mentor_status: 'Approved', order_index: 3 },
    { id: 'ms-mvp-dev', startup_id: IDS.startup1, title: 'MVP Development', icon: '🚀', description: 'Build a fully functional MVP with core features ready for beta testing.', deadline: 'Sep 10, 2024', status: 'in_progress', progress: 68, submission: 'MVP Testing Report', mentor_status: 'Pending Review', order_index: 4 },
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Market Testing', icon: '📈', description: 'Launch to a targeted user segment and gather market feedback.', deadline: 'Oct 30, 2024', status: 'not_started', progress: 0, submission: 'Market Testing Report', mentor_status: 'Not Started', order_index: 5 },
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Investor Pitch', icon: '💰', description: 'Prepare and deliver investor pitch to at least 3 interested investors.', deadline: 'Dec 5, 2024', status: 'not_started', progress: 0, submission: 'Pitch Deck & Recording', mentor_status: 'Not Started', order_index: 6 },
    { id: uuidv4(), startup_id: IDS.startup1, title: 'Graduation', icon: '🎓', description: 'Complete the incubation program and receive graduation certificate.', deadline: 'Jan 15, 2025', status: 'not_started', progress: 0, submission: 'Final Report', mentor_status: 'Not Started', order_index: 7 },
  ];

  const milestoneIds = {};
  for (const ms of milestones) {
    milestoneIds[ms.title] = ms.id;
    dbWrapper.run(
      `INSERT OR IGNORE INTO milestones (id, startup_id, title, icon, description, deadline, status, progress, submission, mentor_status, order_index)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [ms.id, ms.startup_id, ms.title, ms.icon, ms.description, ms.deadline, ms.status, ms.progress, ms.submission, ms.mentor_status, ms.order_index]
    );
  }

  // Milestone tasks for MVP Development
  const mvpTasks = [
    { title: 'Core AI model development', is_done: 1 },
    { title: 'Mobile app (Android)', is_done: 1 },
    { title: 'Backend API development', is_done: 1 },
    { title: 'Beta testing with 50 users', is_done: 0 },
    { title: 'Performance optimization', is_done: 0 },
    { title: 'Submit MVP report', is_done: 0 },
  ];
  for (let i = 0; i < mvpTasks.length; i++) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO milestone_tasks (id, milestone_id, title, is_done, order_index) VALUES (?,?,?,?,?)',
      [uuidv4(), 'ms-mvp-dev', mvpTasks[i].title, mvpTasks[i].is_done, i]
    );
  }

  // ── INVESTOR ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO investors (id, user_id, name, organization, initials, color, bg, investor_type, focus_sectors, investment_range_text, portfolio_count, preferred_stage, description, website, contact_name, is_verified)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      IDS.investor1, IDS.investorUser, 'Vikram Bajaj', 'TechVentures India', 'TV',
      '#6C63FF', 'rgba(108,99,255,0.12)',
      'Venture Capital',
      JSON.stringify(['AI', 'AgriTech', 'FinTech']),
      '₹50L – ₹5Cr',
      42, 'Seed to Series A',
      'Leading VC firm focused on deep-tech and emerging technology startups across India. Portfolio includes 3 AgriTech unicorns.',
      'techventures.in', 'Vikram Bajaj, Partner', 1
    ]
  );

  // Additional investors (non-user-linked, for display)
  const extraInvestors = [
    { name: 'Green Capital', org: 'Green Capital', initials: 'GC', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', type: 'Impact Investor', focus: ['AgriTech', 'CleanTech', 'Sustainability'], range: '₹25L – ₹2Cr', portfolio: 28, stage: 'Pre-Seed to Seed', desc: 'Impact-first investment fund focused on sustainable agriculture, clean energy, and environmental solutions across South Asia.', website: 'greencapital.org', contact: 'Ananya Pillai, Investment Director' },
    { name: 'RuralInvest Fund', org: 'RuralInvest Fund', initials: 'RI', color: '#FFB830', bg: 'rgba(255,184,48,0.12)', type: 'Angel Network', focus: ['AgriTech', 'Rural Tech', 'B2B SaaS'], range: '₹10L – ₹75L', portfolio: 18, stage: 'Pre-Seed', desc: 'Angel network with 30+ investors specifically focused on rural technology and agribusiness startups.', website: 'ruralinvest.co', contact: 'Suresh Patel, Managing Partner' },
    { name: 'Nexus Ventures', org: 'Nexus Ventures', initials: 'NV', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', type: 'Venture Capital', focus: ['AI', 'SaaS', 'B2B'], range: '₹1Cr – ₹20Cr', portfolio: 65, stage: 'Series A+', desc: 'Top-tier VC fund with strong focus on AI-first companies. Looking for startups with proven market traction and strong tech moat.', website: 'nexusventures.co', contact: 'Ira Sharma, Associate' },
    { name: 'Farm Future Fund', org: 'Farm Future Fund', initials: 'FF', color: '#FF7A50', bg: 'rgba(255,122,80,0.12)', type: 'Sector Fund', focus: ['AgriTech', 'FoodTech', 'Supply Chain'], range: '₹50L – ₹3Cr', portfolio: 22, stage: 'Seed to Series A', desc: 'Dedicated AgriFood fund with expertise in agricultural supply chains, precision farming, and food processing technologies.', website: 'farmfuturefund.in', contact: 'Meera Chandran, Partner' },
  ];
  for (const inv of extraInvestors) {
    dbWrapper.run(
      `INSERT OR IGNORE INTO investors (id, user_id, name, organization, initials, color, bg, investor_type, focus_sectors, investment_range_text, portfolio_count, preferred_stage, description, website, contact_name, is_verified)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), uuidv4(), inv.name, inv.org, inv.initials, inv.color, inv.bg, inv.type, JSON.stringify(inv.focus), inv.range, inv.portfolio, inv.stage, inv.desc, inv.website, inv.contact, 1]
    );
  }

  // ── INVESTMENT INTERESTS ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO investment_interests (id, investor_id, startup_id, proposed_amount, message, status)
     VALUES (?,?,?,?,?,?)`,
    [uuidv4(), IDS.investor1, IDS.startup1, 5000000, 'NovaSphere aligns perfectly with our AgriTech thesis. We would like to explore a seed investment.', 'meeting']
  );

  // ── EVENTS ──
  const events = [
    { title: 'AgriTech Innovation Summit', event_date: 'Sep 5, 2024', event_time: '9:00 AM – 5:00 PM', venue: 'Bangalore Convention Centre', host: 'NASSCOM', category: 'Workshop', capacity: 200, emoji: '🌾', color: 'linear-gradient(135deg,#00D4AA22,#00D4AA44)', tag_color: '#00D4AA', description: 'Full-day summit exploring the future of agricultural technology. Hear from 20+ speakers and connect with 300+ professionals.' },
    { title: 'Startup Pitch Day — Cohort 2024-B', event_date: 'Sep 15, 2024', event_time: '10:00 AM – 4:00 PM', venue: 'LaunchPad HQ, Koramangala', host: 'LaunchPad', category: 'Pitch Day', capacity: 30, emoji: '🎤', color: 'linear-gradient(135deg,#6C63FF22,#6C63FF44)', tag_color: '#6C63FF', description: 'Pitch your startup to a panel of 10 investors and industry experts. Selected startups receive direct funding consideration.' },
    { title: 'Founder Masterclass: Product-Market Fit', event_date: 'Sep 20, 2024', event_time: '2:00 PM – 5:00 PM', venue: 'Online (Zoom)', host: 'Dr. Rahul Mehta', category: 'Workshop', capacity: 40, emoji: '🎯', color: 'linear-gradient(135deg,#FF7A5022,#FF7A5044)', tag_color: '#FF7A50', description: 'Intensive workshop on finding and validating your product-market fit using proven frameworks and real case studies.' },
    { title: 'Investor Speed Dating', event_date: 'Oct 3, 2024', event_time: '6:00 PM – 9:00 PM', venue: 'ITC Gardenia, Bangalore', host: 'Angel Network India', category: 'Investor Meet', capacity: 20, emoji: '💼', color: 'linear-gradient(135deg,#FFB83022,#FFB83044)', tag_color: '#FFB830', description: '3-minute pitches to 15 pre-screened angel investors. Maximum exposure in minimum time. Selected startups get follow-up meetings.' },
    { title: 'Demo Day 2024 — LaunchPad', event_date: 'Dec 10, 2024', event_time: '9:00 AM – 6:00 PM', venue: 'IISc Auditorium, Bangalore', host: 'LaunchPad', category: 'Demo Day', capacity: 28, emoji: '🚀', color: 'linear-gradient(135deg,#A78BFA22,#A78BFA44)', tag_color: '#A78BFA', description: 'Annual Demo Day showcasing all 28 startups from Cohort 2024-B to investors, media, and industry leaders. The biggest day of the program.' },
    { title: 'Networking Night: AgriTech Founders', event_date: 'Oct 18, 2024', event_time: '7:00 PM – 10:00 PM', venue: 'Draper Startup House, Bangalore', host: 'AgriTech India', category: 'Networking', capacity: 60, emoji: '🤝', color: 'linear-gradient(135deg,#00D4AA22,#6C63FF22)', tag_color: '#00D4AA', description: 'Informal networking evening for AgriTech founders. Connect with peers, share challenges, and build lasting relationships.' },
  ];
  const eventIds = [];
  for (const ev of events) {
    const id = uuidv4();
    eventIds.push(id);
    dbWrapper.run(
      `INSERT OR IGNORE INTO events (id, title, description, event_date, event_time, venue, host, category, capacity, registered_count, emoji, color, tag_color, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, ev.title, ev.description, ev.event_date, ev.event_time, ev.venue, ev.host, ev.category, ev.capacity, 0, ev.emoji, ev.color, ev.tag_color, IDS.adminUser]
    );
  }

  // Register startup for 2 events
  if (eventIds[1]) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO event_registrations (id, event_id, user_id, startup_id) VALUES (?,?,?,?)',
      [uuidv4(), eventIds[1], IDS.startupUser, IDS.startup1]
    );
    dbWrapper.run('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?', [eventIds[1]]);
  }
  if (eventIds[4]) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO event_registrations (id, event_id, user_id, startup_id) VALUES (?,?,?,?)',
      [uuidv4(), eventIds[4], IDS.startupUser, IDS.startup1]
    );
    dbWrapper.run('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?', [eventIds[4]]);
  }

  // ── DOCUMENTS ──
  const docs = [
    { name: 'Business Plan 2024', category: 'Business Plan', size_text: '2.4 MB', version: 'v2.1', status: 'Approved', icon: '📄', color: '#FF4D6A' },
    { name: 'Investor Pitch Deck', category: 'Pitch Deck', size_text: '8.1 MB', version: 'v3.2', status: 'In Review', icon: '📊', color: '#FF7A50' },
    { name: 'Business Model Canvas', category: 'Business Plan', size_text: '1.2 MB', version: 'v2.0', status: 'Approved', icon: '📄', color: '#FF4D6A' },
    { name: 'Financial Projections', category: 'Financial Plan', size_text: '3.8 MB', version: 'v1.4', status: 'Draft', icon: '📈', color: '#00D4AA' },
    { name: 'MVP Architecture Doc', category: 'Product Documents', size_text: '1.9 MB', version: 'v1.0', status: 'Approved', icon: '📝', color: '#6C63FF' },
    { name: 'API Documentation', category: 'Product Documents', size_text: '4.2 MB', version: 'v2.3', status: 'Draft', icon: '📝', color: '#6C63FF' },
    { name: 'Incorporation Certificate', category: 'Legal Documents', size_text: '0.8 MB', version: 'v1.0', status: 'Verified', icon: '⚖️', color: '#A78BFA' },
    { name: 'Co-Founder Agreement', category: 'Legal Documents', size_text: '1.1 MB', version: 'v1.0', status: 'Verified', icon: '⚖️', color: '#A78BFA' },
    { name: 'Progress Report - Q2', category: 'Progress Reports', size_text: '2.6 MB', version: 'v1.0', status: 'Submitted', icon: '📋', color: '#FFB830' },
    { name: 'Progress Report - Q3', category: 'Progress Reports', size_text: '3.1 MB', version: 'v1.0', status: 'Draft', icon: '📋', color: '#FFB830' },
  ];
  for (const doc of docs) {
    dbWrapper.run(
      `INSERT OR IGNORE INTO documents (id, startup_id, user_id, name, category, size_text, version, status, icon, color)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), IDS.startup1, IDS.startupUser, doc.name, doc.category, doc.size_text, doc.version, doc.status, doc.icon, doc.color]
    );
  }

  // ── MEETINGS ──
  const meetingRecords = [
    { title: 'Mentor Review Session', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Aug 29, 2024', meeting_time: '3:00 PM', meeting_type: 'Video Call', notes: 'Review MVP progress and discuss beta testing strategy.', status: 'confirmed', color: '#6C63FF' },
    { title: 'Investor Introduction', organizer_id: IDS.investorUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Aug 30, 2024', meeting_time: '11:00 AM', meeting_type: 'Video Call', notes: 'First introduction call with TechVentures team.', status: 'confirmed', color: '#FFB830' },
    { title: 'Monthly Check-in', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Sep 12, 2024', meeting_time: '4:00 PM', meeting_type: 'Video Call', notes: 'Monthly progress review.', status: 'confirmed', color: '#6C63FF' },
    { title: 'Demo Day Prep', organizer_id: IDS.adminUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Dec 1, 2024', meeting_time: '10:00 AM', meeting_type: 'In-Person', notes: 'Preparation session for Demo Day presentation.', status: 'confirmed', color: '#A78BFA' },
    { title: 'Prototype Review', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Jun 18, 2024', meeting_time: '3:00 PM', meeting_type: 'Video Call', notes: 'Reviewed prototype. Feedback: Strong UX, needs more AI accuracy.', status: 'completed', color: '#6C63FF' },
    { title: 'Cohort Orientation', organizer_id: IDS.adminUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Mar 20, 2024', meeting_time: '11:00 AM', meeting_type: 'In-Person', notes: 'Program overview and cohort introductions.', status: 'completed', color: '#A78BFA' },
  ];
  for (const m of meetingRecords) {
    dbWrapper.run(
      `INSERT OR IGNORE INTO meetings (id, title, organizer_id, participant_id, startup_id, meeting_date, meeting_time, meeting_type, notes, status, color)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), m.title, m.organizer_id, m.participant_id, m.startup_id, m.meeting_date, m.meeting_time, m.meeting_type, m.notes, m.status, m.color]
    );
  }

  // ── FUNDING APPLICATIONS ──
  const fundingApps = [
    { name: 'LaunchPad Seed Grant', category: 'Incubator Grant', amount_requested: 250000, purpose: 'Initial operations and team support', status: 'approved', amount_approved: 250000, amount_released: 250000 },
    { name: 'BIRAC BIG Grant', category: 'Government Grant', amount_requested: 300000, purpose: 'Technology development and R&D', status: 'approved', amount_approved: 300000, amount_released: 300000 },
    { name: 'DST-NIDHI PRAYAS', category: 'Government Grant', amount_requested: 500000, purpose: 'Market expansion and pilot programs', status: 'under_review', amount_approved: 0, amount_released: 0 },
    { name: 'Startup India Seed Fund', category: 'Government Grant', amount_requested: 1000000, purpose: 'Scale MVP and grow team', status: 'pending', amount_approved: 0, amount_released: 0 },
    { name: 'TechVentures Seed Round', category: 'Investor Funding', amount_requested: 5000000, purpose: 'Series Seed funding for market expansion', status: 'under_review', amount_approved: 0, amount_released: 0 },
  ];
  for (const f of fundingApps) {
    dbWrapper.run(
      `INSERT OR IGNORE INTO funding_applications (id, startup_id, user_id, name, category, amount_requested, purpose, status, amount_approved, amount_released)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), IDS.startup1, IDS.startupUser, f.name, f.category, f.amount_requested, f.purpose, f.status, f.amount_approved, f.amount_released]
    );
  }

  // ── MENTOR FEEDBACK ──
  const feedbackHistory = [
    { topic: 'Prototype Review', text: 'Your MVP direction is strong. Focus next on validating your solution with at least 20 potential users before your next milestone review. The UI is clean but consider adding regional language support from day one.', rating: 4 },
    { topic: 'Business Model Review', text: 'The freemium model makes sense for farmer adoption. However, I suggest exploring a stronger B2B angle — agro-input companies would pay premium for this data. Revise your revenue projections accordingly.', rating: 5 },
    { topic: 'Prototype Demo', text: 'Great work on the prototype! The core AI predictions look promising. The next challenge is accuracy at district level. Consider partnering with a meteorology data provider.', rating: 4 },
    { topic: 'BMC Review', text: 'Good first draft of the BMC. Key strength is the clear value proposition for farmers. Weakness is the distribution channel strategy — think about how you will actually reach 10,000 farmers by Year 1.', rating: 3 },
  ];
  for (const f of feedbackHistory) {
    dbWrapper.run(
      `INSERT OR IGNORE INTO mentor_feedback (id, mentor_id, startup_id, topic, feedback_text, rating)
       VALUES (?,?,?,?,?,?)`,
      [uuidv4(), IDS.mentor1, IDS.startup1, f.topic, f.text, f.rating]
    );
  }

  // ── CONVERSATIONS & MESSAGES ──
  const conv1 = uuidv4();
  dbWrapper.run(
    'INSERT OR IGNORE INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)',
    [conv1, IDS.startupUser, IDS.mentorUser]
  );
  const messages1 = [
    { sender: IDS.mentorUser, text: 'Hi Arjun! How is the MVP development going? Are you on track for the Sep 10 deadline?' },
    { sender: IDS.startupUser, text: "Hi Dr. Mehta! Yes, we're mostly on track. The core AI model is ready and Android app is in final testing. We still need to complete beta testing with 50 users — planning to start that next week." },
    { sender: IDS.mentorUser, text: "That's great to hear! Make sure you document all feedback from beta users — that will be crucial for the milestone submission." },
    { sender: IDS.mentorUser, text: "Also, don't forget we have our review session tomorrow at 3 PM. Please prepare a quick demo of the current app state." },
    { sender: IDS.startupUser, text: "Absolutely! I'll have a 10-minute demo ready. Should I also include the user research data from last month?" },
    { sender: IDS.mentorUser, text: 'Yes please! That would be very helpful to understand the market validation progress. See you tomorrow! 👍' },
  ];
  for (const msg of messages1) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, text, is_read) VALUES (?,?,?,?,?)',
      [uuidv4(), conv1, msg.sender, msg.text, 1]
    );
  }

  const conv2 = uuidv4();
  dbWrapper.run(
    'INSERT OR IGNORE INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)',
    [conv2, IDS.startupUser, IDS.investorUser]
  );
  const messages2 = [
    { sender: IDS.investorUser, text: "Hello! We came across NovaSphere through LaunchPad's program. Your AI-agriculture focus is very aligned with our current portfolio thesis." },
    { sender: IDS.startupUser, text: "Thank you for reaching out! We're excited about the opportunity. NovaSphere is building hyper-local AI insights for farmers — would love to share more details." },
    { sender: IDS.investorUser, text: "Please share your pitch deck when you get a chance. We'd like to schedule a 30-min intro call this week." },
    { sender: IDS.startupUser, text: "Sharing the deck now! I've also confirmed the meeting for Aug 30, 11 AM. Looking forward to it." },
  ];
  for (const msg of messages2) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, text, is_read) VALUES (?,?,?,?,?)',
      [uuidv4(), conv2, msg.sender, msg.text, 1]
    );
  }

  const conv3 = uuidv4();
  dbWrapper.run(
    'INSERT OR IGNORE INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)',
    [conv3, IDS.startupUser, IDS.adminUser]
  );
  const messages3 = [
    { sender: IDS.adminUser, text: "Hi Arjun! Quick reminder — your Q3 Progress Report is due by Aug 31. Please submit it through the Documents section.", is_read: 1 },
    { sender: IDS.startupUser, text: "Thanks for the reminder! I'm currently working on it and should have it ready by Aug 29.", is_read: 1 },
    { sender: IDS.adminUser, text: "Perfect! Also, please confirm your registration for the Product Validation Workshop on Sep 2.", is_read: 0 },
    { sender: IDS.adminUser, text: "There are only 5 spots left!", is_read: 0 },
  ];
  for (const msg of messages3) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, text, is_read) VALUES (?,?,?,?,?)',
      [uuidv4(), conv3, msg.sender, msg.text, msg.is_read || 0]
    );
  }

  // ── NOTIFICATIONS ──
  const notifications = [
    { user_id: IDS.startupUser, type: 'milestone', icon: '🎯', title: 'Prototype milestone approved', text: 'Dr. Rahul Mehta approved your Prototype Development milestone. Well done!', link: '#milestones', is_read: 0 },
    { user_id: IDS.startupUser, type: 'investor', icon: '💼', title: 'Investor interest', text: 'TechVentures showed interest in your startup profile and requested an introduction.', link: '#investors', is_read: 0 },
    { user_id: IDS.startupUser, type: 'meeting', icon: '📅', title: 'Meeting confirmed', text: 'Your meeting with TechVentures is confirmed for Aug 30, 11:00 AM.', link: '#meetings', is_read: 0 },
    { user_id: IDS.startupUser, type: 'funding', icon: '💰', title: 'Funding application submitted', text: 'Your application for DST-NIDHI PRAYAS (₹5,00,000) has been submitted successfully.', link: '#funding', is_read: 0 },
    { user_id: IDS.startupUser, type: 'mentor', icon: '👨‍🏫', title: 'New mentor feedback', text: 'Dr. Rahul Mehta left feedback on your MVP Development plan. Review it now.', link: '#mentor', is_read: 1 },
    { user_id: IDS.startupUser, type: 'event', icon: '🎤', title: 'Event registration confirmed', text: 'You are registered for Startup Pitch Day – Cohort 2024-B on Sep 15.', link: '#events', is_read: 1 },
    { user_id: IDS.startupUser, type: 'document', icon: '📄', title: 'Document approved', text: 'Your Business Plan 2024 has been reviewed and approved by the incubator team.', link: '#documents', is_read: 1 },
    { user_id: IDS.startupUser, type: 'investor', icon: '👁', title: 'Investor viewed your deck', text: 'Green Capital viewed your pitch deck 3 times this week.', link: '#investors', is_read: 1 },
    // Mentor notifications
    { user_id: IDS.mentorUser, type: 'milestone', icon: '🚀', title: 'Milestone submitted for review', text: 'NovaSphere has submitted MVP Development milestone for your review.', link: 'milestones', is_read: 0 },
    { user_id: IDS.mentorUser, type: 'meeting', icon: '📅', title: 'Meeting request from NovaSphere', text: 'Arjun has requested a mentor session for Sep 12 at 4:00 PM.', link: 'meetings', is_read: 0 },
    // Admin notifications
    { user_id: IDS.adminUser, type: 'application', icon: '📋', title: 'New incubation application', text: 'A new startup application has been submitted and requires review.', link: 'applications', is_read: 0 },
    { user_id: IDS.adminUser, type: 'funding', icon: '💰', title: 'Funding application pending review', text: 'DST-NIDHI PRAYAS funding application from NovaSphere requires your review.', link: 'funding', is_read: 0 },
  ];
  for (const n of notifications) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO notifications (id, user_id, type, icon, title, text, link, is_read) VALUES (?,?,?,?,?,?,?,?)',
      [uuidv4(), n.user_id, n.type, n.icon, n.title, n.text, n.link, n.is_read]
    );
  }

  // ── ACTIVITY LOG ──
  const activities = [
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '✓', bg: 'rgba(0,212,170,0.12)', text: '<strong>Mentor approved</strong> Prototype milestone' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '📄', bg: 'rgba(108,99,255,0.12)', text: '<strong>Pitch deck</strong> updated — v3.2' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '💰', bg: 'rgba(0,212,170,0.12)', text: '<strong>Funding application</strong> submitted (DST-NIDHI)' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '📅', bg: 'rgba(255,184,48,0.12)', text: '<strong>Meeting scheduled</strong> with Dr. Rahul Mehta' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '👁', bg: 'rgba(255,122,80,0.12)', text: '<strong>TechVentures</strong> viewed your startup profile' },
  ];
  for (const a of activities) {
    dbWrapper.run(
      'INSERT OR IGNORE INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
      [uuidv4(), a.user_id, a.startup_id, a.icon, a.bg, a.text]
    );
  }

  // ── INCUBATION APPLICATION (approved) ──
  dbWrapper.run(
    `INSERT OR IGNORE INTO incubation_applications (id, startup_id, user_id, program_id, status, step_completed, submitted_at, reviewed_at, reviewed_by)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [uuidv4(), IDS.startup1, IDS.startupUser, IDS.program1, 'approved', 8, '2024-02-20', '2024-03-10', IDS.adminUser]
  );

  console.log('✅ Database seeded successfully!');
  console.log('📧 Demo accounts:');
  console.log('  startup@launchpad.demo / Demo@2024');
  console.log('  mentor@launchpad.demo  / Demo@2024');
  console.log('  investor@launchpad.demo / Demo@2024');
  console.log('  admin@launchpad.demo   / Demo@2024');
}

module.exports = { seedIfEmpty };
