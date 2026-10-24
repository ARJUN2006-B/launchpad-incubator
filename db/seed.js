/* ============================================================
   db/seed.js — Comprehensive Demo Data Seeder
   Creates realistic, vibrant Indian startup ecosystem demo data
   across public directories and startup, mentor, investor & admin dashboards.
============================================================ */
const bcrypt = require('bcryptjs');
const { randomUUID: uuidv4 } = require('crypto');
const { dbWrapper } = require('./database');

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Demo@2024', 10);

// Fixed canonical IDs for consistent demo navigation and testing
const IDS = {
  // Users
  adminUser: 'usr-admin-launchpad',
  startupUser: 'usr-startup-arjun',
  mentorUser: 'usr-mentor-rahul',
  investorUser: 'usr-investor-vikram',
  
  startupUser2: 'usr-startup-priya',
  startupUser3: 'usr-startup-arun',
  startupUser4: 'usr-startup-suresh',
  startupUser5: 'usr-startup-rajesh',
  startupUser6: 'usr-startup-aditya',
  startupUser7: 'usr-startup-neha',
  startupUser8: 'usr-startup-divya',
  startupUser9: 'usr-startup-manoj',
  startupUser10: 'usr-startup-ananya',
  startupUser11: 'usr-startup-rohit',
  startupUser12: 'usr-startup-karthik',
  startupUser13: 'usr-startup-sanjana',
  startupUser14: 'usr-startup-vivek',
  startupUser15: 'usr-startup-harish',
  startupUser16: 'usr-startup-tanvi',

  mentorUser2: 'usr-mentor-priya-sharma',
  mentorUser3: 'usr-mentor-arun-k',
  mentorUser4: 'usr-mentor-meenakshi',
  mentorUser5: 'usr-mentor-vikramaditya',
  mentorUser6: 'usr-mentor-shalini',
  mentorUser7: 'usr-mentor-deepak',
  mentorUser8: 'usr-mentor-kavita',
  mentorUser9: 'usr-mentor-siddharth',
  mentorUser10: 'usr-mentor-ritu',

  investorUser2: 'usr-investor-ananya',
  investorUser3: 'usr-investor-suresh-patel',
  investorUser4: 'usr-investor-ira',
  investorUser5: 'usr-investor-rohan',
  investorUser6: 'usr-investor-sunita',
  investorUser7: 'usr-investor-tarun',
  investorUser8: 'usr-investor-meera',

  // Startups
  startup1: 'startup-novasphere',
  startup2: 'startup-finedge',
  startup3: 'startup-healthsync',
  startup4: 'startup-kisanai',
  startup5: 'startup-agropulse',
  startup6: 'startup-rupeeflow',
  startup7: 'startup-creditkendra',
  startup8: 'startup-curelink',
  startup9: 'startup-genecraft',
  startup10: 'startup-eduvibe',
  startup11: 'startup-vidyaverse',
  startup12: 'startup-cloudops',
  startup13: 'startup-signetiq',
  startup14: 'startup-quantumleap',
  startup15: 'startup-neurorobotics',
  startup16: 'startup-greenspark',

  // Mentors
  mentor1: 'mentor-rahul',
  mentor2: 'mentor-priya-sharma',
  mentor3: 'mentor-arun-krishnan',
  mentor4: 'mentor-meenakshi',
  mentor5: 'mentor-vikramaditya',
  mentor6: 'mentor-shalini',
  mentor7: 'mentor-deepak',
  mentor8: 'mentor-kavita',
  mentor9: 'mentor-siddharth',
  mentor10: 'mentor-ritu',

  // Investors
  investor1: 'investor-techventures',
  investor2: 'investor-greencapital',
  investor3: 'investor-ruralinvest',
  investor4: 'investor-nexusventures',
  investor5: 'investor-peakscale',
  investor6: 'investor-bharatseed',
  investor7: 'investor-elevationangels',
  investor8: 'investor-farmfuture',

  // Programs
  program1: 'prog-idealab',
  program2: 'prog-launchpad-core',
  program3: 'prog-scaleup',
  program4: 'prog-global'
};

function ensureColumns() {
  const colChecks = [
    { table: 'incubation_programs', col: 'tagline', type: 'TEXT' },
    { table: 'incubation_programs', col: 'equity_terms', type: 'TEXT' },
    { table: 'incubation_programs', col: 'funding_amount', type: 'TEXT' },
    { table: 'incubation_programs', col: 'emoji', type: 'TEXT' },
    { table: 'incubation_programs', col: 'features', type: 'TEXT' }
  ];
  for (const c of colChecks) {
    try {
      dbWrapper.run(`ALTER TABLE ${c.table} ADD COLUMN ${c.col} ${c.type}`);
    } catch (e) {
      // Column already exists
    }
  }
}

function seedDatabase(force = false) {
  ensureColumns();

  const existingStartupsCount = dbWrapper.get('SELECT COUNT(*) as cnt FROM startups')?.cnt || 0;
  if (!force && existingStartupsCount >= 10) {
    console.log(`✅ Database already seeded with ${existingStartupsCount} startups.`);
    return;
  }

  console.log('🌱 Seeding database with rich Indian startup ecosystem data...');

  // ── 1. USERS ──
  const users = [
    // Primary Demo Logins
    { id: IDS.startupUser, email: 'startup@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Arjun', phone: '+91 98765 43210', role: 'startup' },
    { id: IDS.mentorUser, email: 'mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Rahul Mehta', phone: '+91 99887 76655', role: 'mentor' },
    { id: IDS.investorUser, email: 'investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Vikram Bajaj', phone: '+91 98001 12345', role: 'investor' },
    { id: IDS.adminUser, email: 'admin@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'LaunchPad Admin', phone: '+91 80-4567-8901', role: 'admin' },

    // Additional Startup Founders
    { id: IDS.startupUser2, email: 'priya@finedge.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Priya Nair', phone: '+91 97654 32109', role: 'startup' },
    { id: IDS.startupUser3, email: 'arun@healthsync.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Arun Kumar', phone: '+91 96543 21098', role: 'startup' },
    { id: IDS.startupUser4, email: 'suresh@kisanai.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Suresh Patil', phone: '+91 98450 11223', role: 'startup' },
    { id: IDS.startupUser5, email: 'rajesh@agropulse.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Rajesh Deshmukh', phone: '+91 98220 33445', role: 'startup' },
    { id: IDS.startupUser6, email: 'aditya@rupeeflow.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Aditya Roy', phone: '+91 99100 44556', role: 'startup' },
    { id: IDS.startupUser7, email: 'neha@creditkendra.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Neha Agarwal', phone: '+91 94140 55667', role: 'startup' },
    { id: IDS.startupUser8, email: 'divya@curelink.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Divya Raman', phone: '+91 98400 66778', role: 'startup' },
    { id: IDS.startupUser9, email: 'manoj@genecraft.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Manoj Pillai', phone: '+91 98470 77889', role: 'startup' },
    { id: IDS.startupUser10, email: 'ananya@eduvibe.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Ananya Shah', phone: '+91 98250 88990', role: 'startup' },
    { id: IDS.startupUser11, email: 'rohit@vidyaverse.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Rohit Sharma', phone: '+91 98110 99001', role: 'startup' },
    { id: IDS.startupUser12, email: 'karthik@cloudops.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Karthik Swamy', phone: '+91 98860 12340', role: 'startup' },
    { id: IDS.startupUser13, email: 'sanjana@signetiq.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Sanjana Sen', phone: '+91 98180 23451', role: 'startup' },
    { id: IDS.startupUser14, email: 'vivek@quantumleap.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Vivek Murthy', phone: '+91 99000 34562', role: 'startup' },
    { id: IDS.startupUser15, email: 'harish@neurorobotics.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Harish Krishnan', phone: '+91 97900 45673', role: 'startup' },
    { id: IDS.startupUser16, email: 'tanvi@greenspark.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Tanvi Jain', phone: '+91 98930 56784', role: 'startup' },

    // Additional Mentors
    { id: IDS.mentorUser2, email: 'priyasharma.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Priya Sharma', phone: '+91 98711 00223', role: 'mentor' },
    { id: IDS.mentorUser3, email: 'arun.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Arun Krishnan', phone: '+91 98401 22334', role: 'mentor' },
    { id: IDS.mentorUser4, email: 'meenakshi.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Meenakshi Sundaram', phone: '+91 98402 33445', role: 'mentor' },
    { id: IDS.mentorUser5, email: 'vikram.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Vikramaditya Singhania', phone: '+91 98200 44556', role: 'mentor' },
    { id: IDS.mentorUser6, email: 'shalini.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Shalini Reddy', phone: '+91 98490 55667', role: 'mentor' },
    { id: IDS.mentorUser7, email: 'deepak.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Deepak Sengupta', phone: '+91 98300 66778', role: 'mentor' },
    { id: IDS.mentorUser8, email: 'kavita.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Kavita Nambiar', phone: '+91 98800 77889', role: 'mentor' },
    { id: IDS.mentorUser9, email: 'siddharth.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Siddharth Verma', phone: '+91 98100 88990', role: 'mentor' },
    { id: IDS.mentorUser10, email: 'ritu.mentor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Dr. Ritu Agarwal', phone: '+91 94120 99001', role: 'mentor' },

    // Additional Investors
    { id: IDS.investorUser2, email: 'ananya.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Ananya Pillai', phone: '+91 98451 11223', role: 'investor' },
    { id: IDS.investorUser3, email: 'suresh.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Suresh Patel', phone: '+91 98240 22334', role: 'investor' },
    { id: IDS.investorUser4, email: 'ira.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Ira Sharma', phone: '+91 98111 33445', role: 'investor' },
    { id: IDS.investorUser5, email: 'rohan.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Rohan Mehra', phone: '+91 98201 44556', role: 'investor' },
    { id: IDS.investorUser6, email: 'sunita.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Sunita Chawla', phone: '+91 98101 55667', role: 'investor' },
    { id: IDS.investorUser7, email: 'tarun.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Tarun Kapoor', phone: '+91 98720 66778', role: 'investor' },
    { id: IDS.investorUser8, email: 'meera.investor@launchpad.demo', password_hash: DEMO_PASSWORD_HASH, full_name: 'Meera Chandran', phone: '+91 98403 77889', role: 'investor' }
  ];

  for (const u of users) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO users (id, email, password_hash, full_name, phone, role) VALUES (?,?,?,?,?,?)',
      [u.id, u.email, u.password_hash, u.full_name, u.phone, u.role]
    );
  }

  // ── 2. INCUBATION PROGRAMS ──
  const programs = [
    {
      id: IDS.program1,
      name: 'IdeaLab',
      emoji: '💡',
      tagline: 'For pre-idea and early-concept founders',
      duration: '4 Weeks',
      equity_terms: 'Equity-Free',
      funding_amount: '0 Fee',
      application_deadline: 'Nov 15, 2026',
      cohort: '2026-C',
      description: 'Intensive 4-week structured sprint to validate customer pain points, develop initial prototypes, and test market viability before building.',
      eligibility: 'Open to aspiring founders, students, and early researchers with an innovative concept.',
      max_startups: 40,
      current_startups: 35,
      features: JSON.stringify([
        'Validate problem hypothesis with 30+ structured customer interviews',
        'Weekly workshops with successful serial entrepreneurs',
        'Access to Lean Canvas and rapid prototyping toolkits',
        'Direct feedback from top incubator selection committees',
        'Certificate of completion & fast-track admission to LaunchPad Core'
      ]),
      benefits: JSON.stringify(['Mentorship', 'Idea Validation', 'Community Access', 'Office Hours'])
    },
    {
      id: IDS.program2,
      name: 'LaunchPad Core',
      emoji: '🚀',
      tagline: 'Flagship 6-month seed incubation program',
      duration: '6 Months',
      equity_terms: '3% Equity',
      funding_amount: '5,00,000',
      application_deadline: 'Dec 1, 2026',
      cohort: '2026-B',
      description: 'Our premier incubation program providing structured milestones, dedicated 1-on-1 mentorship, ₹5L seed grant, legal/compliance support, and Demo Day access.',
      eligibility: 'Early-stage startups with an MVP or working prototype, at least 1 full-time technical or business founder.',
      max_startups: 30,
      current_startups: 28,
      features: JSON.stringify([
        'Dedicated industry veteran mentor matched to your startup',
        '₹5,00,000 equity-linked seed grant upon cohort onboarding',
        'Bangalore Koramangala premium coworking hub access',
        'Complete company incorporation, patent/IP & compliance support',
        'Curated Demo Day pitching to 100+ accredited angel & VC investors',
        'Access to ₹50L+ in software cloud credits (AWS, Google Cloud, Stripe)'
      ]),
      benefits: JSON.stringify(['₹5L Grant', 'Coworking Hub', '1-on-1 Mentorship', 'Investor Demo Day', 'Legal & CA Support'])
    },
    {
      id: IDS.program3,
      name: 'ScaleUp',
      emoji: '📈',
      tagline: 'For post-revenue startups ready to scale',
      duration: '3 Months',
      equity_terms: 'Revenue-Share',
      funding_amount: '15,00,000',
      application_deadline: 'Dec 15, 2026',
      cohort: '2026-Q4',
      description: 'Tailored for validated startups with active traction seeking rapid customer acquisition, enterprise B2B sales pipelines, and Series A readiness.',
      eligibility: 'Post-revenue startups with at least ₹1L monthly recurring revenue (MRR) or 5,000 active users.',
      max_startups: 15,
      current_startups: 12,
      features: JSON.stringify([
        'Tailored Go-To-Market and B2B enterprise sales strategy sprints',
        'Warm introductions to Fortune 500 enterprise buyers & pilot partners',
        'Direct access to institutional Tier-1 VC partners across India',
        'Unit economics optimization and financial model review with CFO mentors',
        'Growth marketing playbooks with ₹15L+ partner credit packages'
      ]),
      benefits: JSON.stringify(['Enterprise Introductions', 'Series A Prep', 'Growth Hacking', 'Institutional VC Access'])
    },
    {
      id: IDS.program4,
      name: 'Global Accelerator',
      emoji: '🌍',
      tagline: 'India-to-Global international expansion desk',
      duration: '4 Months',
      equity_terms: '1.5% Equity',
      funding_amount: 'US/SG Desk',
      application_deadline: 'Jan 20, 2027',
      cohort: '2027-A',
      description: 'Supports high-growth Indian technology startups expanding into the US, Singapore, and Middle Eastern markets with soft-landing infrastructure.',
      eligibility: 'Startups with proven domestic product-market fit looking to establish international subsidiaries.',
      max_startups: 10,
      current_startups: 8,
      features: JSON.stringify([
        'Soft-landing desks in Silicon Valley, Singapore, and Dubai',
        'US Delaware & Singapore cross-border legal & tax structuring',
        'Access to global cross-border angel networks & international VCs',
        'Bi-weekly coaching with international founders who scaled globally',
        'International Demo Day in San Francisco & Singapore'
      ]),
      benefits: JSON.stringify(['Global Soft-Landing', 'US/SG Structuring', 'Cross-Border VCs', 'International Mentorship'])
    }
  ];

  for (const p of programs) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO incubation_programs 
       (id, name, emoji, tagline, duration, equity_terms, funding_amount, application_deadline, cohort, description, eligibility, max_startups, current_startups, features, benefits, is_active)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
      [p.id, p.name, p.emoji, p.tagline, p.duration, p.equity_terms, p.funding_amount, p.application_deadline, p.cohort, p.description, p.eligibility, p.max_startups, p.current_startups, p.features, p.benefits]
    );
  }

  // ── 3. STARTUPS (16 Startups across 7 Filters) ──
  const startups = [
    // AgriTech
    {
      id: IDS.startup1,
      user_id: IDS.startupUser,
      name: 'NovaSphere',
      logo: 'NS',
      tagline: 'AI-powered insights and crop yield forecasting for modern farmers',
      industry: 'AgriTech',
      stage: 'MVP Development',
      founded_date: 'January 2024',
      location: 'Bangalore, India',
      website: 'www.novasphere.in',
      problem: 'Over 60% of Indian smallholder farmers experience severe crop losses due to unpredicted weather shifts and delayed pest detection.',
      solution: 'NovaSphere provides hyper-local satellite imagery and AI models delivered via regional voice/WhatsApp interfaces for actionable farming decisions.',
      business_model: 'Freemium farmer app with ₹199/month premium tier; B2B data licensing to agrochemical and crop insurance firms.',
      revenue_model: 'SaaS subscriptions (40%), B2B enterprise data feeds (60%)',
      market_size: '₹45,000 Cr Indian AgriTech market, growing at 25% CAGR',
      cohort: '2024-B',
      progress: 68,
      days_active: 142
    },
    {
      id: IDS.startup4,
      user_id: IDS.startupUser4,
      name: 'KisanAI',
      logo: 'KA',
      tagline: 'Precision soil health diagnostics using hyperspectral drone sensors',
      industry: 'AgriTech',
      stage: 'Prototype',
      founded_date: 'April 2024',
      location: 'Pune, Maharashtra',
      website: 'www.kisanai.tech',
      problem: 'Traditional soil lab testing takes 3 to 4 weeks and requires sending physical samples, leaving farmers guessing fertilizer needs.',
      solution: 'KisanAI uses automated drone flyovers and infrared optical sensors to map NPK nutrient levels in under 30 minutes.',
      business_model: 'Per-acre scanning fee paid by farmer cooperatives and sugar mills.',
      revenue_model: 'Service fee per acre + seasonal subscription contracts',
      market_size: '₹18,000 Cr precision farming and soil testing segment',
      cohort: '2024-B',
      progress: 45,
      days_active: 88
    },
    {
      id: IDS.startup5,
      user_id: IDS.startupUser5,
      name: 'AgroPulse',
      logo: 'AP',
      tagline: 'Smart cold-chain logistics optimization for perishable farm produce',
      industry: 'AgriTech',
      stage: 'Market Validation',
      founded_date: 'November 2023',
      location: 'Nashik, Maharashtra',
      website: 'www.agropulse.co',
      problem: '30% of fruits and vegetables in India spoil before reaching retail markets due to temperature spikes in transit.',
      solution: 'IoT real-time temperature loggers combined with predictive rerouting algorithms that dynamically direct produce to the nearest active cold storage.',
      business_model: 'Hardware leasing + monthly platform fee per refrigerated truck.',
      revenue_model: 'IoT device subscription + logistics routing commission',
      market_size: '₹28,000 Cr horticulture cold-chain logistics market',
      cohort: '2024-B',
      progress: 75,
      days_active: 195
    },

    // FinTech
    {
      id: IDS.startup2,
      user_id: IDS.startupUser2,
      name: 'FinEdge',
      logo: 'FE',
      tagline: 'Democratizing algorithmic financial planning for Tier-2/3 India',
      industry: 'FinTech',
      stage: 'Market Validation',
      founded_date: 'October 2023',
      location: 'Mumbai, Maharashtra',
      website: 'www.finedge.in',
      problem: 'Over 500 million aspiring Indians lack access to certified, unbiased financial advisors and affordable wealth management.',
      solution: 'FinEdge provides automated portfolio allocation and goal-based micro-investments in 12 regional languages through UPI autopay.',
      business_model: 'B2C subscription at ₹299/year; distribution commission on mutual funds and digital gold.',
      revenue_model: 'Subscription fees + distributor revenue share',
      market_size: '₹1.2 Lakh Cr retail wealth management market in India',
      cohort: '2024-B',
      progress: 82,
      days_active: 180
    },
    {
      id: IDS.startup6,
      user_id: IDS.startupUser6,
      name: 'RupeeFlow',
      logo: 'RF',
      tagline: 'Instant cross-border invoice factoring and treasury management for Indian exporters',
      industry: 'FinTech',
      stage: 'MVP Development',
      founded_date: 'February 2024',
      location: 'Gurgaon, Haryana',
      website: 'www.rupeeflow.io',
      problem: 'MSME exporters wait 90-120 days for overseas buyer remittances, causing severe working capital bottlenecks.',
      solution: 'RupeeFlow verifies customs shipping bills digitally and advances up to 85% of invoice value in INR within 24 hours.',
      business_model: 'Discounting fee of 1.2% - 1.8% per 30-day factoring cycle.',
      revenue_model: 'Factoring discount spread + foreign exchange margin',
      market_size: '₹60,000 Cr MSME cross-border factoring demand',
      cohort: '2024-B',
      progress: 60,
      days_active: 110
    },
    {
      id: IDS.startup7,
      user_id: IDS.startupUser7,
      name: 'CreditKendra',
      logo: 'CK',
      tagline: 'Alternative credit scoring engine for unbanked micro-enterprises',
      industry: 'FinTech',
      stage: 'Scaling',
      founded_date: 'August 2023',
      location: 'Jaipur, Rajasthan',
      website: 'www.creditkendra.org',
      problem: '63 million Indian MSMEs lack formal audited balance sheets and are rejected by traditional commercial banks.',
      solution: 'Proprietary underwriting API analyzing GSTN cash flows, utility payments, and digital supply-chain purchase orders.',
      business_model: 'B2B API license fee per credit assessment score to NBFCs and digital lending apps.',
      revenue_model: 'API usage fees (₹75 per report) + success fee on sanctioned loans',
      market_size: '₹85,000 Cr micro-enterprise credit market',
      cohort: '2024-A',
      progress: 90,
      days_active: 280
    },

    // HealthTech
    {
      id: IDS.startup3,
      user_id: IDS.startupUser3,
      name: 'HealthSync',
      logo: 'HS',
      tagline: 'Tele-triage platform connecting rural Primary Health Centres to urban specialists',
      industry: 'HealthTech',
      stage: 'Prototype',
      founded_date: 'March 2024',
      location: 'Hyderabad, Telangana',
      website: 'www.healthsync.care',
      problem: 'Rural districts have only 1 specialist doctor per 11,000 patients, forcing villagers to travel 150+ km for basic consultations.',
      solution: 'Cloud tele-triage kiosk equipped with calibrated digital vitals monitors that enables rapid specialist consultations in 10 minutes.',
      business_model: 'Fixed monthly fee per clinic kiosk + subsidized consultation fee.',
      revenue_model: 'Government PPP contracts (60%) + private diagnostic clinic subscriptions (40%)',
      market_size: '₹72,000 Cr Indian tele-health and diagnostic sector',
      cohort: '2024-B',
      progress: 55,
      days_active: 98
    },
    {
      id: IDS.startup8,
      user_id: IDS.startupUser8,
      name: 'CureLink',
      logo: 'CL',
      tagline: 'Remote monitoring and automated recovery guidance for post-cardiac surgery patients',
      industry: 'HealthTech',
      stage: 'Market Validation',
      founded_date: 'December 2023',
      location: 'Chennai, Tamil Nadu',
      website: 'www.curelink.health',
      problem: 'Cardiovascular readmission rates within 90 days after discharge exceed 22% due to poor home recovery compliance.',
      solution: 'FDA-cleared Bluetooth wearable paired with an intelligent recovery companion app providing 24/7 ECG anomaly detection.',
      business_model: 'Hospital discharge bundle sold to cardiology departments at ₹4,500 per patient recovery cycle.',
      revenue_model: 'B2B hospital sales + recurring SaaS platform subscription',
      market_size: '₹14,000 Cr post-operative recovery monitoring market',
      cohort: '2024-B',
      progress: 70,
      days_active: 165
    },
    {
      id: IDS.startup9,
      user_id: IDS.startupUser9,
      name: 'GeneCraft Diagnostics',
      logo: 'GD',
      tagline: 'Point-of-care rapid molecular diagnostic kit for infectious diseases',
      industry: 'HealthTech',
      stage: 'MVP Development',
      founded_date: 'January 2024',
      location: 'Kochi, Kerala',
      website: 'www.genecraft.bio',
      problem: 'PCR pathogen confirmation requires expensive lab machinery and takes 24 to 48 hours for tuberculosis and dengue diagnosis.',
      solution: 'Isothermal amplification microfluidic test cartridge delivering PCR-grade accuracy in 25 minutes without cold chain requirements.',
      business_model: 'Razor-and-blade model: portable reader device + consumable test strips.',
      revenue_model: 'Device sales + high-margin consumable test cartridges',
      market_size: '₹22,000 Cr point-of-care diagnostic market',
      cohort: '2024-B',
      progress: 65,
      days_active: 130
    },

    // EdTech
    {
      id: IDS.startup10,
      user_id: IDS.startupUser10,
      name: 'EduVibe',
      logo: 'EV',
      tagline: 'Gamified STEM experiential learning platform in 8 Indian regional languages',
      industry: 'EdTech',
      stage: 'Market Validation',
      founded_date: 'September 2023',
      location: 'Ahmedabad, Gujarat',
      website: 'www.eduvibe.in',
      problem: '70% of state-board school students struggle with abstract science and math concepts taught via passive textbooks.',
      solution: 'Interactive 3D simulation sandboxes and bite-sized gamified physics/chemistry challenges accessible on low-cost smartphones.',
      business_model: 'B2C parent subscription at ₹149/month; B2B school lab annual licenses.',
      revenue_model: 'Consumer subscriptions (50%) + institutional school licensing (50%)',
      market_size: '₹35,000 Cr K-12 supplemental education market',
      cohort: '2024-A',
      progress: 78,
      days_active: 240
    },
    {
      id: IDS.startup11,
      user_id: IDS.startupUser11,
      name: 'VidyaVerse',
      logo: 'VV',
      tagline: 'AI copilot for vocational technical skills training and apprenticeship matchmaking',
      industry: 'EdTech',
      stage: 'Prototype',
      founded_date: 'May 2024',
      location: 'Noida, Uttar Pradesh',
      website: 'www.vidyaverse.ai',
      problem: 'ITI graduates lack practical industry exposure, while manufacturers face a 40% technician talent shortage.',
      solution: 'Vernacular interactive AR video modules for electrical, CNC, and solar technician training linked directly to employer apprenticeships.',
      business_model: 'Free for learners; employers pay recruitment success fee upon hiring verified technicians.',
      revenue_model: 'Corporate hiring fees + NSDC government skilling project grants',
      market_size: '₹16,000 Cr vocational training & technical placement market',
      cohort: '2024-B',
      progress: 50,
      days_active: 75
    },

    // B2B SaaS
    {
      id: IDS.startup12,
      user_id: IDS.startupUser12,
      name: 'CloudOps360',
      logo: 'CO',
      tagline: 'Autonomous multi-cloud FinOps and Kubernetes cost observability platform',
      industry: 'B2B SaaS',
      stage: 'Scaling',
      founded_date: 'June 2023',
      location: 'Bangalore, Karnataka',
      website: 'www.cloudops360.io',
      problem: 'Mid-market tech companies waste 32% of their cloud spend on idle Kubernetes clusters and over-provisioned cloud instances.',
      solution: 'Agentless ML pipeline that predicts workload traffic and automatically rightsizes cluster nodes in real time with zero downtime.',
      business_model: 'Tiered monthly SaaS based on monthly cloud bill ($299 to $2,499/mo).',
      revenue_model: 'SaaS subscription + 10% gain-share on verified cloud savings',
      market_size: '$12 Billion global cloud FinOps and cost management market',
      cohort: '2024-A',
      progress: 88,
      days_active: 320
    },
    {
      id: IDS.startup13,
      user_id: IDS.startupUser13,
      name: 'SignetIQ',
      logo: 'SQ',
      tagline: 'Enterprise compliance and contract intelligence powered by domain-tuned LLMs',
      industry: 'B2B SaaS',
      stage: 'Market Validation',
      founded_date: 'November 2023',
      location: 'New Delhi',
      website: 'www.signetiq.ai',
      problem: 'Legal and procurement teams spend 14 hours per vendor agreement verifying clauses against Indian regulatory mandates.',
      solution: 'Secure self-hosted legal LLM that redlines contracts, detects indemnity risks, and ensures compliance with Indian DPDP Act 2023.',
      business_model: 'Annual enterprise license per seat + custom model fine-tuning fee.',
      revenue_model: 'Annual recurring revenue (ARR) enterprise software contracts',
      market_size: '$4.5 Billion legal technology and compliance automation market',
      cohort: '2024-B',
      progress: 72,
      days_active: 170
    },

    // DeepTech
    {
      id: IDS.startup14,
      user_id: IDS.startupUser14,
      name: 'QuantumLeap',
      logo: 'QL',
      tagline: 'Room-temperature photonic quantum computing modules for cryptographic simulation',
      industry: 'DeepTech',
      stage: 'Prototype',
      founded_date: 'January 2024',
      location: 'Bangalore, Karnataka',
      website: 'www.quantumleap.tech',
      problem: 'Cryogenic quantum systems require massive liquid helium cooling infrastructure, making deployment outside research labs impossible.',
      solution: 'Proprietary silicon-nitride photonic chip waveguides operating at room temperature for quantum key distribution (QKD).',
      business_model: 'Hardware module sales to defense, banking institutions, and cloud providers.',
      revenue_model: 'Hardware sales + specialized quantum algorithm licensing',
      market_size: '$8 Billion quantum communications & post-quantum crypto market',
      cohort: '2024-B',
      progress: 40,
      days_active: 115
    },
    {
      id: IDS.startup15,
      user_id: IDS.startupUser15,
      name: 'NeuroRobotics',
      logo: 'NR',
      tagline: 'Bionic wearable exoskeletons for industrial worker safety and mobility rehab',
      industry: 'DeepTech',
      stage: 'MVP Development',
      founded_date: 'October 2023',
      location: 'Coimbatore, Tamil Nadu',
      website: 'www.neurorobotics.in',
      problem: 'Musculoskeletal injuries among manufacturing and automotive assembly workers cost Indian industry over ₹12,000 Cr annually.',
      solution: 'Ultra-lightweight carbon fiber unpowered and servo-assisted back-support exoskeletons that reduce lumbar strain by 45%.',
      business_model: 'B2B equipment sale or Robots-as-a-Service (RaaS) leasing at ₹6,000/month.',
      revenue_model: 'RaaS subscription leases + outright enterprise fleet purchase',
      market_size: '₹9,500 Cr industrial ergonomics & assistive robotics market',
      cohort: '2024-B',
      progress: 62,
      days_active: 155
    },

    // CleanTech / ClimateTech
    {
      id: IDS.startup16,
      user_id: IDS.startupUser16,
      name: 'GreenSpark',
      logo: 'GS',
      tagline: 'Decentralized solar micro-grids and battery swapping for electric farm equipment',
      industry: 'CleanTech',
      stage: 'Market Validation',
      founded_date: 'July 2023',
      location: 'Indore, Madhya Pradesh',
      website: 'www.greenspark.energy',
      problem: 'Rural farmers spend up to 35% of total input costs on diesel for irrigation pumps and light utility tillers.',
      solution: 'Community solar micro-grids with containerized LFP swappable batteries that power converted electric agricultural machinery at 60% lower cost.',
      business_model: 'Pay-per-swap energy token model sold through local village entrepreneurs.',
      revenue_model: 'Battery swapping fees + carbon credit aggregation revenue',
      market_size: '₹32,000 Cr rural clean energy & farm mechanization market',
      cohort: '2024-A',
      progress: 80,
      days_active: 265
    }
  ];

  for (const s of startups) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO startups 
       (id, user_id, name, logo, tagline, industry, stage, founded_date, location, website, problem, solution, 
        business_model, revenue_model, market_size, incubation_status, cohort, progress, days_active, is_public)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
      [
        s.id, s.user_id, s.name, s.logo, s.tagline, s.industry, s.stage, s.founded_date, s.location, s.website,
        s.problem, s.solution, s.business_model, s.revenue_model, s.market_size, 'active', s.cohort, s.progress, s.days_active
      ]
    );
  }

  // ── 4. TEAM MEMBERS (for top startups) ──
  const teamList = [
    { startup_id: IDS.startup1, name: 'Arjun', role: 'Founder & CEO', skills: JSON.stringify(['Product Strategy', 'AI/ML', 'Business Development']), color: '#6C63FF', initials: 'A' },
    { startup_id: IDS.startup1, name: 'Priya Nair', role: 'CTO & Co-Founder', skills: JSON.stringify(['Deep Learning', 'Python', 'Satellite Imagery']), color: '#00D4AA', initials: 'PN' },
    { startup_id: IDS.startup1, name: 'Rohit Verma', role: 'Lead Product Designer', skills: JSON.stringify(['UI/UX', 'Figma', 'Farmer Field Research']), color: '#FFB830', initials: 'RV' },
    { startup_id: IDS.startup1, name: 'Kavya Singh', role: 'Growth & Partnerships Lead', skills: JSON.stringify(['Rural Marketing', 'Agro-Tie-ups', 'Community']), color: '#FF7A50', initials: 'KS' },

    { startup_id: IDS.startup2, name: 'Priya Nair', role: 'Founder & CEO', skills: JSON.stringify(['FinTech', 'WealthTech', 'Capital Markets']), color: '#00D4AA', initials: 'PN' },
    { startup_id: IDS.startup2, name: 'Aman Saxena', role: 'Lead Quant Engineer', skills: JSON.stringify(['Algorithms', 'Go', 'Financial Modeling']), color: '#6C63FF', initials: 'AS' },

    { startup_id: IDS.startup12, name: 'Karthik Swamy', role: 'Founder & Chief Architect', skills: JSON.stringify(['Kubernetes', 'AWS', 'Distributed Systems']), color: '#6C63FF', initials: 'KS' },
    { startup_id: IDS.startup12, name: 'Megha Joshi', role: 'VP Engineering', skills: JSON.stringify(['eBPF', 'Rust', 'Cloud Infrastructure']), color: '#00D4AA', initials: 'MJ' }
  ];

  for (const t of teamList) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO startup_team_members (id, startup_id, name, role, skills, color, initials) VALUES (?,?,?,?,?,?,?)',
      [uuidv4(), t.startup_id, t.name, t.role, t.skills, t.color, t.initials]
    );
  }

  // ── 5. MENTORS (10 World-Class Mentors) ──
  const mentors = [
    {
      id: IDS.mentor1,
      user_id: IDS.mentorUser,
      name: 'Dr. Rahul Mehta',
      initials: 'RM',
      role: 'Startup Strategy & Product Growth',
      experience: '12+ years',
      bio: 'Ex-VP Product at InMobi & serial entrepreneur with 3 successful exits. Guided 50+ seed startups through market entry, pricing models, and investor readiness.',
      expertise: JSON.stringify(['Startup Strategy', 'Product-Market Fit', 'AgriTech', 'Go-to-Market', 'Fundraising', 'B2B Sales']),
      availability: JSON.stringify(['Monday 2–5 PM', 'Wednesday 3–6 PM', 'Friday 10 AM – 1 PM']),
      rating: 4.9,
      sessions_completed: 34
    },
    {
      id: IDS.mentor2,
      user_id: IDS.mentorUser2,
      name: 'Priya Sharma',
      initials: 'PS',
      role: 'FinTech & Regulatory Compliance',
      experience: '15+ years',
      bio: 'Former Director at RBI Innovation Sandbox and senior fintech product leader at Razorpay. Expert in payment rails, NBFC regulations, and lending compliance.',
      expertise: JSON.stringify(['FinTech', 'Digital Lending', 'Regulatory Compliance', 'UPI Infrastructure', 'Risk & Underwriting']),
      availability: JSON.stringify(['Tuesday 3–6 PM', 'Thursday 4–7 PM']),
      rating: 4.8,
      sessions_completed: 28
    },
    {
      id: IDS.mentor3,
      user_id: IDS.mentorUser3,
      name: 'Arun Krishnan',
      initials: 'AK',
      role: 'DeepTech & Enterprise AI',
      experience: '14+ years',
      bio: 'Founding Member at AI India Initiative and former Principal Scientist at Microsoft Research India. Advises deep tech founders on AI defensibility and patent strategy.',
      expertise: JSON.stringify(['DeepTech', 'Computer Vision', 'LLM Architectures', 'IP & Patents', 'Cloud Infrastructure']),
      availability: JSON.stringify(['Monday 10 AM – 1 PM', 'Wednesday 11 AM – 2 PM']),
      rating: 4.9,
      sessions_completed: 32
    },
    {
      id: IDS.mentor4,
      user_id: IDS.mentorUser4,
      name: 'Dr. Meenakshi Sundaram',
      initials: 'MS',
      role: 'HealthTech & MedTech Commercialization',
      experience: '16+ years',
      bio: 'Former Head of Bio-Design at IIT Madras Healthcare Incubator. Advised 20+ MedTech startups on clinical trials, CDSCO approvals, and hospital chain procurement.',
      expertise: JSON.stringify(['HealthTech', 'Medical Devices', 'Clinical Trials', 'Hospital Procurement', 'Healthcare Policy']),
      availability: JSON.stringify(['Tuesday 10 AM – 1 PM', 'Friday 2–5 PM']),
      rating: 5.0,
      sessions_completed: 26
    },
    {
      id: IDS.mentor5,
      user_id: IDS.mentorUser5,
      name: 'Vikramaditya Singhania',
      initials: 'VS',
      role: 'B2B SaaS Go-To-Market & US Sales',
      experience: '15+ years',
      bio: 'Managing Partner at SaaS Guild and former SaaS founder who scaled from India to $12M ARR in North America before being acquired by Freshworks.',
      expertise: JSON.stringify(['B2B SaaS', 'US Enterprise Sales', 'Pricing Models', 'Product-Led Growth', 'Inbound Marketing']),
      availability: JSON.stringify(['Wednesday 4–7 PM', 'Thursday 5–8 PM']),
      rating: 4.9,
      sessions_completed: 40
    },
    {
      id: IDS.mentor6,
      user_id: IDS.mentorUser6,
      name: 'Shalini Reddy',
      initials: 'SR',
      role: 'EdTech & Learning Science',
      experience: '11+ years',
      bio: 'Ex-Chief Learning Officer at Unacademy and cognitive science researcher. Specialist in curriculum gamification, retention funnels, and vernacular learning adoption.',
      expertise: JSON.stringify(['EdTech', 'Gamification', 'User Retention', 'Vernacular Learning', 'K-12 Distribution']),
      availability: JSON.stringify(['Monday 3–6 PM', 'Thursday 2–5 PM']),
      rating: 4.8,
      sessions_completed: 22
    },
    {
      id: IDS.mentor7,
      user_id: IDS.mentorUser7,
      name: 'Deepak Sengupta',
      initials: 'DS',
      role: 'CleanTech & Hardware Manufacturing',
      experience: '18+ years',
      bio: 'Veteran clean energy technologist and former Head of Manufacturing at Tata Power Solar. Guides founders through bill of materials (BOM), testing, and supply chain sourcing.',
      expertise: JSON.stringify(['CleanTech', 'Solar Micro-grids', 'Hardware Prototyping', 'Supply Chain', 'Carbon Credits']),
      availability: JSON.stringify(['Tuesday 2–5 PM', 'Saturday 10 AM – 1 PM']),
      rating: 4.9,
      sessions_completed: 29
    },
    {
      id: IDS.mentor8,
      user_id: IDS.mentorUser8,
      name: 'Kavita Nambiar',
      initials: 'KN',
      role: 'Venture Fundraising & Term Sheets',
      experience: '13+ years',
      bio: 'Angel investor and former Principal at Matrix Partners India. Evaluated over 800 pitches and led 24 seed investments. Helps founders craft bulletproof pitch decks.',
      expertise: JSON.stringify(['Pitch Decks', 'Venture Capital', 'Valuation & Dilution', 'Term Sheet Negotiation', 'Financial Projections']),
      availability: JSON.stringify(['Wednesday 10 AM – 1 PM', 'Friday 3–6 PM']),
      rating: 4.9,
      sessions_completed: 38
    },
    {
      id: IDS.mentor9,
      user_id: IDS.mentorUser9,
      name: 'Siddharth Verma',
      initials: 'SV',
      role: 'Growth Marketing & Brand Building',
      experience: '12+ years',
      bio: 'Former CMO at Razorpay and angel investor. Master of zero-cac growth loops, developer relations, B2B viral loops, and brand storytelling for emerging startups.',
      expertise: JSON.stringify(['Growth Marketing', 'Brand Storytelling', 'Zero-CAC Funnels', 'Performance Ads', 'PR & Media Strategy']),
      availability: JSON.stringify(['Thursday 11 AM – 2 PM', 'Friday 11 AM – 2 PM']),
      rating: 4.8,
      sessions_completed: 31
    },
    {
      id: IDS.mentor10,
      user_id: IDS.mentorUser10,
      name: 'Dr. Ritu Agarwal',
      initials: 'RA',
      role: 'AgriTech & Rural Distribution Systems',
      experience: '20+ years',
      bio: 'Professor of Rural Management, former advisor to Ministry of Agriculture, and board member at 4 Farmer Producer Organizations (FPOs).',
      expertise: JSON.stringify(['Rural Distribution', 'FPO Networks', 'Farm Economics', 'Government Grants', 'Agri Supply Chains']),
      availability: JSON.stringify(['Monday 11 AM – 2 PM', 'Wednesday 2–5 PM']),
      rating: 5.0,
      sessions_completed: 35
    }
  ];

  for (const m of mentors) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO mentors 
       (id, user_id, name, initials, role, experience, bio, expertise, availability, rating, sessions_completed, is_verified)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,1)`,
      [m.id, m.user_id, m.name, m.initials, m.role, m.experience, m.bio, m.expertise, m.availability, m.rating, m.sessions_completed]
    );
  }

  // ── 6. MENTOR ASSIGNMENTS (Connecting Mentors to Startups) ──
  const assignments = [
    // Dr. Rahul Mehta's startups (Active in his Mentor Dashboard)
    { mentor_id: IDS.mentor1, startup_id: IDS.startup1 }, // NovaSphere
    { mentor_id: IDS.mentor1, startup_id: IDS.startup5 }, // AgroPulse
    { mentor_id: IDS.mentor1, startup_id: IDS.startup4 }, // KisanAI

    // Other Mentor assignments
    { mentor_id: IDS.mentor2, startup_id: IDS.startup2 }, // FinEdge -> Priya Sharma
    { mentor_id: IDS.mentor2, startup_id: IDS.startup6 }, // RupeeFlow -> Priya Sharma
    { mentor_id: IDS.mentor3, startup_id: IDS.startup14 }, // QuantumLeap -> Arun Krishnan
    { mentor_id: IDS.mentor4, startup_id: IDS.startup3 }, // HealthSync -> Dr. Meenakshi
    { mentor_id: IDS.mentor4, startup_id: IDS.startup8 }, // CureLink -> Dr. Meenakshi
    { mentor_id: IDS.mentor5, startup_id: IDS.startup12 }, // CloudOps360 -> Vikramaditya
    { mentor_id: IDS.mentor5, startup_id: IDS.startup13 }, // SignetIQ -> Vikramaditya
    { mentor_id: IDS.mentor6, startup_id: IDS.startup10 }, // EduVibe -> Shalini Reddy
    { mentor_id: IDS.mentor7, startup_id: IDS.startup16 }, // GreenSpark -> Deepak Sengupta
    { mentor_id: IDS.mentor8, startup_id: IDS.startup1 },  // NovaSphere -> Kavita Nambiar (Fundraising)
    { mentor_id: IDS.mentor10, startup_id: IDS.startup1 } // NovaSphere -> Dr. Ritu Agarwal (Rural distribution)
  ];

  for (const a of assignments) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO mentor_assignments (id, mentor_id, startup_id, assigned_by, is_active) VALUES (?,?,?,?,1)',
      [uuidv4(), a.mentor_id, a.startup_id, IDS.adminUser]
    );
  }

  // ── 7. MILESTONES & TASKS ──
  // NovaSphere 7 Milestones (Milestone 4 is currently pending review by Dr. Rahul Mehta)
  const novaMilestones = [
    { id: 'ms-nova-1', title: 'Idea Validation', icon: '💡', description: 'Validate core farmer pain points with at least 50 structured in-person interviews across Karnataka districts.', deadline: 'Apr 15, 2024', status: 'completed', progress: 100, submission: 'Farmer Validation Report v1.2.pdf', mentor_status: 'Approved', order_index: 1 },
    { id: 'ms-nova-2', title: 'Business Model Canvas', icon: '📊', description: 'Complete BMC covering farmer subscription pricing, agrochemical partnership B2B channels, and unit economics.', deadline: 'May 10, 2024', status: 'completed', progress: 100, submission: 'BMC Final v2.0.pdf', mentor_status: 'Approved', order_index: 2 },
    { id: 'ms-nova-3', title: 'Prototype Development', icon: '🔧', description: 'Build functional prototype connecting satellite vegetation index (NDVI) to regional language advisory bot.', deadline: 'Jun 20, 2024', status: 'completed', progress: 100, submission: 'Prototype Demo Video & APK.mp4', mentor_status: 'Approved', order_index: 3 },
    { id: 'ms-nova-4', title: 'MVP Development', icon: '🚀', description: 'Deploy Android application to 100 active beta farmers and achieve 60% 30-day retention with live weather push alerts.', deadline: 'Sep 10, 2024', status: 'submitted', progress: 68, submission: 'MVP Beta Testing Report v1.0.pdf', mentor_status: 'Pending Review', order_index: 4 },
    { id: 'ms-nova-5', title: 'Market Testing & Revenue', icon: '📈', description: 'Onboard first 25 paying farmer clusters and close 1 paid pilot with a regional agro-input retail network.', deadline: 'Oct 30, 2024', status: 'not_started', progress: 0, submission: 'Market Traction Data.pdf', mentor_status: 'Not Started', order_index: 5 },
    { id: 'ms-nova-6', title: 'Investor Pitch Readiness', icon: '💰', description: 'Finalize institutional pitch deck, audited financial projections, and rehearse Demo Day pitch with mentors.', deadline: 'Dec 5, 2024', status: 'not_started', progress: 0, submission: 'Investor Deck v3.2.pdf', mentor_status: 'Not Started', order_index: 6 },
    { id: 'ms-nova-7', title: 'Cohort Graduation 🎓', icon: '🎓', description: 'Present on National Demo Day stage, complete program graduation requirements, and join LaunchPad Alumni.', deadline: 'Jan 15, 2025', status: 'not_started', progress: 0, submission: 'Final Incubation Report.pdf', mentor_status: 'Not Started', order_index: 7 }
  ];

  for (const ms of novaMilestones) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO milestones 
       (id, startup_id, title, icon, description, deadline, status, progress, submission, mentor_status, order_index)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [ms.id, IDS.startup1, ms.title, ms.icon, ms.description, ms.deadline, ms.status, ms.progress, ms.submission, ms.mentor_status, ms.order_index]
    );
  }

  // Tasks for NovaSphere Milestone 4 (MVP Development)
  const mvpTasks = [
    { title: 'Core AI satellite NDVI anomaly detection pipeline', is_done: 1 },
    { title: 'Android mobile app with Kannada and Hindi audio guidance', is_done: 1 },
    { title: 'FastAPI backend on AWS Lambda with PostgreSQL', is_done: 1 },
    { title: 'Field beta testing with 100 farmers in Mandya district', is_done: 1 },
    { title: 'Pest alert accuracy validation with agricultural university', is_done: 0 },
    { title: 'Submit final MVP beta review metrics report', is_done: 0 }
  ];
  for (let i = 0; i < mvpTasks.length; i++) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO milestone_tasks (id, milestone_id, title, is_done, order_index) VALUES (?,?,?,?,?)',
      [`task-nova-${i + 1}`, 'ms-nova-4', mvpTasks[i].title, mvpTasks[i].is_done, i]
    );
  }

  // AgroPulse Milestone 5 also pending review (so Dr. Rahul Mehta has multiple reviews in queue)
  dbWrapper.run(
    `INSERT OR REPLACE INTO milestones 
     (id, startup_id, title, icon, description, deadline, status, progress, submission, mentor_status, order_index)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    ['ms-agro-5', IDS.startup5, 'Cold-Chain Pilot Deployment', '🚚', 'Complete 15 active truck monitoring runs from Nashik to Mumbai markets.', 'Nov 20, 2024', 'submitted', 75, 'Transit Spoilage Reduction Report.pdf', 'Pending Review', 5]
  );

  // ── 8. INVESTORS (8 Top-Tier Institutional & Angel Investors) ──
  const investors = [
    {
      id: IDS.investor1,
      user_id: IDS.investorUser,
      name: 'Vikram Bajaj',
      org: 'TechVentures India',
      initials: 'TV',
      color: '#6C63FF',
      bg: 'rgba(108,99,255,0.12)',
      type: 'Venture Capital',
      focus: JSON.stringify(['AI', 'AgriTech', 'FinTech']),
      range: '₹50L – ₹5Cr',
      portfolio: 42,
      stage: 'Seed to Series A',
      desc: 'Leading Indian technology venture fund backing bold founders transforming traditional sectors with AI, deep tech, and automated logistics.',
      website: 'techventures.in',
      contact: 'Vikram Bajaj, Managing Partner'
    },
    {
      id: IDS.investor2,
      user_id: IDS.investorUser2,
      name: 'Ananya Pillai',
      org: 'Green Capital',
      initials: 'GC',
      color: '#00D4AA',
      bg: 'rgba(0,212,170,0.12)',
      type: 'Impact Investor',
      focus: JSON.stringify(['CleanTech', 'AgriTech', 'Sustainability']),
      range: '₹25L – ₹2Cr',
      portfolio: 28,
      stage: 'Pre-Seed to Seed',
      desc: 'Impact-first fund investing in climate resilience, rural electrification, decentralized solar energy, and sustainable agriculture.',
      website: 'greencapital.org',
      contact: 'Ananya Pillai, Investment Director'
    },
    {
      id: IDS.investor3,
      user_id: IDS.investorUser3,
      name: 'Suresh Patel',
      org: 'RuralInvest Fund',
      initials: 'RI',
      color: '#FFB830',
      bg: 'rgba(255,184,48,0.12)',
      type: 'Angel Network',
      focus: JSON.stringify(['AgriTech', 'Rural Tech', 'B2B SaaS']),
      range: '₹10L – ₹75L',
      portfolio: 19,
      stage: 'Pre-Seed',
      desc: 'Curated syndicate of 40+ agribusiness leaders, agrochemical executives, and serial founders backing Bharat-focused startups.',
      website: 'ruralinvest.co',
      contact: 'Suresh Patel, Managing Partner'
    },
    {
      id: IDS.investor4,
      user_id: IDS.investorUser4,
      name: 'Ira Sharma',
      org: 'Nexus Ventures',
      initials: 'NV',
      color: '#A78BFA',
      bg: 'rgba(167,139,250,0.12)',
      type: 'Venture Capital',
      focus: JSON.stringify(['AI', 'B2B SaaS', 'FinTech']),
      range: '₹1Cr – ₹20Cr',
      portfolio: 65,
      stage: 'Series A+',
      desc: 'Top-tier Indo-US venture fund partnering with product-first founders building global technology enterprises out of India.',
      website: 'nexusventures.co',
      contact: 'Ira Sharma, Principal'
    },
    {
      id: IDS.investor5,
      user_id: IDS.investorUser5,
      name: 'Rohan Mehra',
      org: 'PeakScale Capital',
      initials: 'PS',
      color: '#FF7A50',
      bg: 'rgba(255,122,80,0.12)',
      type: 'Micro VC',
      focus: JSON.stringify(['DeepTech', 'B2B SaaS', 'DevTools']),
      range: '₹75L – ₹3Cr',
      portfolio: 34,
      stage: 'Seed to Pre-Series A',
      desc: 'High-conviction seed fund founded by former tech executives, specializing in developer infrastructure and AI efficiency.',
      website: 'peakscale.vc',
      contact: 'Rohan Mehra, Partner'
    },
    {
      id: IDS.investor6,
      user_id: IDS.investorUser6,
      name: 'Sunita Chawla',
      org: 'Bharat Seed Fund',
      initials: 'BS',
      color: '#00D4AA',
      bg: 'rgba(0,212,170,0.12)',
      type: 'Seed Fund',
      focus: JSON.stringify(['FinTech', 'HealthTech', 'EdTech']),
      range: '₹25L – ₹1.5Cr',
      portfolio: 50,
      stage: 'Pre-Seed to Seed',
      desc: 'Dedicated early-stage vehicle backing startups building digital infrastructure for mass-market inclusion across India.',
      website: 'bharatseed.in',
      contact: 'Sunita Chawla, Partner'
    },
    {
      id: IDS.investor7,
      user_id: IDS.investorUser7,
      name: 'Tarun Kapoor',
      org: 'Elevation Angels',
      initials: 'EA',
      color: '#FF4D6A',
      bg: 'rgba(255,77,106,0.12)',
      type: 'Angel Syndicate',
      focus: JSON.stringify(['CleanTech', 'Consumer Tech', 'AgriTech']),
      range: '₹15L – ₹1Cr',
      portfolio: 22,
      stage: 'Angel to Pre-Seed',
      desc: 'Fast-moving angel syndicate offering founders quick decision-making, founder-friendly terms, and active operational mentorship.',
      website: 'elevationangels.in',
      contact: 'Tarun Kapoor, Syndicate Lead'
    },
    {
      id: IDS.investor8,
      user_id: IDS.investorUser8,
      name: 'Meera Chandran',
      org: 'Farm Future Fund',
      initials: 'FF',
      color: '#FFB830',
      bg: 'rgba(255,184,48,0.12)',
      type: 'Sector Fund',
      focus: JSON.stringify(['AgriTech', 'FoodTech', 'Supply Chain']),
      range: '₹50L – ₹3Cr',
      portfolio: 24,
      stage: 'Seed to Series A',
      desc: 'Dedicated AgriFood tech fund with deep supply chain connections and strategic ties to India largest food processing conglomerates.',
      website: 'farmfuturefund.in',
      contact: 'Meera Chandran, Partner'
    }
  ];

  for (const inv of investors) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO investors 
       (id, user_id, name, organization, initials, color, bg, investor_type, focus_sectors, investment_range_text, portfolio_count, preferred_stage, description, website, contact_name, is_verified)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
      [inv.id, inv.user_id, inv.name, inv.org, inv.initials, inv.color, inv.bg, inv.type, inv.focus, inv.range, inv.portfolio, inv.stage, inv.desc, inv.website, inv.contact]
    );
  }

  // ── 9. INVESTOR WATCHLIST & INTERESTS ──
  const watchlistItems = [
    { investor_id: IDS.investor1, startup_id: IDS.startup1 }, // Vikram -> NovaSphere
    { investor_id: IDS.investor1, startup_id: IDS.startup2 }, // Vikram -> FinEdge
    { investor_id: IDS.investor1, startup_id: IDS.startup12 }, // Vikram -> CloudOps360
    { investor_id: IDS.investor1, startup_id: IDS.startup16 }, // Vikram -> GreenSpark
    { investor_id: IDS.investor2, startup_id: IDS.startup16 }, // Green Capital -> GreenSpark
    { investor_id: IDS.investor3, startup_id: IDS.startup4 }   // RuralInvest -> KisanAI
  ];
  for (const w of watchlistItems) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO watchlist (id, investor_id, startup_id) VALUES (?,?,?)',
      [uuidv4(), w.investor_id, w.startup_id]
    );
  }

  const interests = [
    { investor_id: IDS.investor1, startup_id: IDS.startup1, proposed_amount: 5000000, message: 'NovaSphere hyper-local AI insights align closely with our AgriTech fund thesis. We would like to lead the seed round.', status: 'meeting' },
    { investor_id: IDS.investor1, startup_id: IDS.startup2, proposed_amount: 3500000, message: 'Impressive traction on regional wealth management. Due diligence documentation under review.', status: 'due_diligence' },
    { investor_id: IDS.investor2, startup_id: IDS.startup16, proposed_amount: 4000000, message: 'Solar micro-grid decentralized battery model has exceptional carbon abatement potential. Scheduling partner meet.', status: 'due_diligence' },
    { investor_id: IDS.investor5, startup_id: IDS.startup12, proposed_amount: 7500000, message: 'Very impressed with the Kubernetes optimization benchmarks. Interested in discussing a seed financing round.', status: 'interested' }
  ];
  for (const i of interests) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO investment_interests (id, investor_id, startup_id, proposed_amount, message, status) VALUES (?,?,?,?,?,?)',
      [uuidv4(), i.investor_id, i.startup_id, i.proposed_amount, i.message, i.status]
    );
  }

  // ── 10. EVENTS (8 Late-2026/2027 Upcoming Events) ──
  const events = [
    {
      id: 'ev-1',
      title: 'AgriTech Innovation & Farmer Impact Summit',
      event_date: '2026-12-05',
      event_time: '9:00 AM – 5:00 PM',
      venue: 'Bangalore International Convention Centre',
      host: 'NASSCOM & LaunchPad',
      category: 'Workshop',
      capacity: 200,
      registered_count: 188,
      emoji: '🌾',
      color: 'linear-gradient(135deg,#00D4AA22,#00D4AA44)',
      tag_color: '#00D4AA',
      description: 'Full-day summit bringing together 300+ AgriTech founders, agronomy scientists, and state agriculture directors. Features panels on AI satellite sensing and rural distribution.'
    },
    {
      id: 'ev-2',
      title: 'National Demo Day 2026 — Cohort Finale',
      event_date: '2026-12-18',
      event_time: '10:00 AM – 6:00 PM',
      venue: 'IISc Auditorium, Bangalore',
      host: 'LaunchPad Incubator',
      category: 'Demo Day',
      capacity: 300,
      registered_count: 276,
      emoji: '🚀',
      color: 'linear-gradient(135deg,#6C63FF22,#6C63FF44)',
      tag_color: '#6C63FF',
      description: 'The premier annual showcase featuring 28 graduating startups from Cohort 2026 pitching live to 120+ active venture funds, angel networks, and national media.'
    },
    {
      id: 'ev-3',
      title: 'VC Speed Dating: Winter Seed Round',
      event_date: '2026-12-22',
      event_time: '5:00 PM – 8:30 PM',
      venue: 'ITC Gardenia, Bangalore',
      host: 'Indian Angel Network & LaunchPad',
      category: 'Investor Meet',
      capacity: 40,
      registered_count: 35,
      emoji: '💼',
      color: 'linear-gradient(135deg,#FFB83022,#FFB83044)',
      tag_color: '#FFB830',
      description: 'High-speed 1-on-1 pitch sessions pairing pre-screened seed startups directly with partners from Sequoia Surge, Matrix Partners, Blume Ventures, and TechVentures.'
    },
    {
      id: 'ev-4',
      title: 'Founder Masterclass: Scaling B2B SaaS to $1M ARR',
      event_date: '2027-01-08',
      event_time: '2:00 PM – 5:00 PM',
      venue: 'Online (Zoom Interactive)',
      host: 'Vikramaditya Singhania',
      category: 'Workshop',
      capacity: 100,
      registered_count: 82,
      emoji: '🎯',
      color: 'linear-gradient(135deg,#FF7A5022,#FF7A5044)',
      tag_color: '#FF7A50',
      description: 'Hands-on teardown masterclass covering outbound enterprise sequencing, pricing power, POC contract templates, and building US sales motions from India.'
    },
    {
      id: 'ev-5',
      title: 'DeepTech & AI Builders Hackathon 2027',
      event_date: '2027-01-15',
      event_time: '48 Hours (Jan 15–16)',
      venue: 'LaunchPad Innovation Hub, Koramangala',
      host: 'LaunchPad Tech Team',
      category: 'Hackathon',
      capacity: 80,
      registered_count: 68,
      emoji: '🔬',
      color: 'linear-gradient(135deg,#A78BFA22,#A78BFA44)',
      tag_color: '#A78BFA',
      description: '48-hour intensive sprint building autonomous edge agents, robotics kinematics, and computer vision models. ₹5 Lakhs in cash prizes + incubation spots.'
    },
    {
      id: 'ev-6',
      title: 'HealthTech Regulatory & Clinical Trial Playbook',
      event_date: '2027-01-22',
      event_time: '10:00 AM – 3:00 PM',
      venue: 'Hybrid: LaunchPad Hub + Virtual',
      host: 'Dr. Meenakshi Sundaram',
      category: 'Bootcamp',
      capacity: 60,
      registered_count: 54,
      emoji: '🏥',
      color: 'linear-gradient(135deg,#00D4AA22,#6C63FF22)',
      tag_color: '#00D4AA',
      description: 'Essential compliance walkthrough covering CDSCO medical device certification, institutional ethics committee review, and clinical efficacy data collection.'
    },
    {
      id: 'ev-7',
      title: 'Women in Indian Tech Founders Mixer',
      event_date: '2027-01-28',
      event_time: '6:30 PM – 9:30 PM',
      venue: 'Draper Startup House, Koramangala',
      host: 'LaunchPad Women In Tech',
      category: 'Networking',
      capacity: 75,
      registered_count: 75,
      emoji: '🤝',
      color: 'linear-gradient(135deg,#FF4D6A22,#FFB83022)',
      tag_color: '#FF4D6A',
      description: 'Curated networking evening and dinner bringing together 75 women founders, venture partners, and angel investors to share growth strategies and build peer alliances.'
    },
    {
      id: 'ev-8',
      title: 'Startup India & BIRAC Grant Application Sprint',
      event_date: '2027-02-05',
      event_time: '11:00 AM – 4:00 PM',
      venue: 'Online (Zoom Workshop)',
      host: 'LaunchPad Grants Desk',
      category: 'Workshop',
      capacity: 150,
      registered_count: 120,
      emoji: '💰',
      color: 'linear-gradient(135deg,#FFB83022,#00D4AA22)',
      tag_color: '#FFB830',
      description: 'Step-by-step guidance on securing non-dilutive government grants (DST-NIDHI, BIRAC BIG, Startup India Seed Fund) with reviews of real winning proposals.'
    }
  ];

  for (const ev of events) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO events 
       (id, title, description, event_date, event_time, venue, host, category, capacity, registered_count, emoji, color, tag_color, is_public, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)`,
      [ev.id, ev.title, ev.description, ev.event_date, ev.event_time, ev.venue, ev.host, ev.category, ev.capacity, ev.registered_count, ev.emoji, ev.color, ev.tag_color, IDS.adminUser]
    );
  }

  // Register NovaSphere founder for events 2 and 3
  dbWrapper.run(
    'INSERT OR REPLACE INTO event_registrations (id, event_id, user_id, startup_id) VALUES (?,?,?,?)',
    ['reg-nova-2', 'ev-2', IDS.startupUser, IDS.startup1]
  );
  dbWrapper.run(
    'INSERT OR REPLACE INTO event_registrations (id, event_id, user_id, startup_id) VALUES (?,?,?,?)',
    ['reg-nova-3', 'ev-3', IDS.startupUser, IDS.startup1]
  );

  // ── 11. DOCUMENTS (For NovaSphere) ──
  const docs = [
    { name: 'Business Plan 2026', category: 'Business Plan', size_text: '2.4 MB', version: 'v2.1', status: 'Approved', icon: '📄', color: '#FF4D6A' },
    { name: 'Investor Pitch Deck', category: 'Pitch Deck', size_text: '8.1 MB', version: 'v3.2', status: 'In Review', icon: '📊', color: '#FF7A50' },
    { name: 'Business Model Canvas', category: 'Business Plan', size_text: '1.2 MB', version: 'v2.0', status: 'Approved', icon: '📄', color: '#FF4D6A' },
    { name: '3-Year Financial Projections', category: 'Financial Plan', size_text: '3.8 MB', version: 'v1.4', status: 'Draft', icon: '📈', color: '#00D4AA' },
    { name: 'MVP Technical Architecture', category: 'Product Documents', size_text: '1.9 MB', version: 'v1.0', status: 'Approved', icon: '📝', color: '#6C63FF' },
    { name: 'REST & GraphQL API Specs', category: 'Product Documents', size_text: '4.2 MB', version: 'v2.3', status: 'Draft', icon: '📝', color: '#6C63FF' },
    { name: 'Certificate of Incorporation', category: 'Legal Documents', size_text: '0.8 MB', version: 'v1.0', status: 'Verified', icon: '⚖️', color: '#A78BFA' },
    { name: 'Executed Co-Founder Agreement', category: 'Legal Documents', size_text: '1.1 MB', version: 'v1.0', status: 'Verified', icon: '⚖️', color: '#A78BFA' },
    { name: 'Q2 Cohort Progress Report', category: 'Progress Reports', size_text: '2.6 MB', version: 'v1.0', status: 'Approved', icon: '📋', color: '#FFB830' },
    { name: 'Q3 Cohort Progress Report', category: 'Progress Reports', size_text: '3.1 MB', version: 'v1.0', status: 'Submitted', icon: '📋', color: '#FFB830' }
  ];
  for (const d of docs) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO documents (id, startup_id, user_id, name, category, size_text, version, status, icon, color)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), IDS.startup1, IDS.startupUser, d.name, d.category, d.size_text, d.version, d.status, d.icon, d.color]
    );
  }

  // ── 12. MEETINGS ──
  const meetings = [
    { title: 'MVP Milestone Review', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Dec 02, 2026', meeting_time: '3:00 PM', meeting_type: 'Video Call', notes: 'Review beta metrics and farmer feedback from Mandya pilot.', status: 'confirmed', color: '#6C63FF' },
    { title: 'Investor Introduction Call', organizer_id: IDS.investorUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Dec 04, 2026', meeting_time: '11:00 AM', meeting_type: 'Video Call', notes: 'Discussion on ₹50L seed round terms with TechVentures investment committee.', status: 'confirmed', color: '#FFB830' },
    { title: 'Monthly Advisory Check-in', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Dec 10, 2026', meeting_time: '4:00 PM', meeting_type: 'Video Call', notes: 'Review unit economics and Q4 customer acquisition strategy.', status: 'confirmed', color: '#6C63FF' },
    { title: 'Demo Day Pitch Rehearsal', organizer_id: IDS.adminUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Dec 16, 2026', meeting_time: '10:00 AM', meeting_type: 'In-Person', notes: 'Stage presence, slide timing, and Q&A drill in IISc Auditorium.', status: 'confirmed', color: '#A78BFA' },
    { title: 'Prototype Architecture Review', organizer_id: IDS.startupUser, participant_id: IDS.mentorUser, startup_id: IDS.startup1, meeting_date: 'Nov 12, 2026', meeting_time: '3:00 PM', meeting_type: 'Video Call', notes: 'Reviewed prototype. Mentor approved system latency benchmarks.', status: 'completed', color: '#6C63FF' },
    { title: 'Cohort Onboarding Orientation', organizer_id: IDS.adminUser, participant_id: IDS.startupUser, startup_id: IDS.startup1, meeting_date: 'Oct 15, 2026', meeting_time: '11:00 AM', meeting_type: 'In-Person', notes: 'Program induction, mentor matching, and grant disbursal process.', status: 'completed', color: '#A78BFA' }
  ];
  for (const m of meetings) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO meetings (id, title, organizer_id, participant_id, startup_id, meeting_date, meeting_time, meeting_type, notes, status, color)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), m.title, m.organizer_id, m.participant_id, m.startup_id, m.meeting_date, m.meeting_time, m.meeting_type, m.notes, m.status, m.color]
    );
  }

  // ── 13. FUNDING APPLICATIONS (Total released ₹18L+, total approved ₹45.5L+) ──
  const fundingRecords = [
    { startup_id: IDS.startup1, user_id: IDS.startupUser, name: 'LaunchPad Seed Grant', category: 'Incubator Grant', amount_requested: 250000, purpose: 'Core AI model development & cloud compute', status: 'approved', amount_approved: 250000, amount_released: 250000 },
    { startup_id: IDS.startup1, user_id: IDS.startupUser, name: 'BIRAC BIG Grant', category: 'Government Grant', amount_requested: 300000, purpose: 'Bio-informatics satellite data integration', status: 'approved', amount_approved: 300000, amount_released: 300000 },
    { startup_id: IDS.startup1, user_id: IDS.startupUser, name: 'DST-NIDHI PRAYAS', category: 'Government Grant', amount_requested: 500000, purpose: 'Field sensor prototyping & farmer kits', status: 'under_review', amount_approved: 500000, amount_released: 0 },
    { startup_id: IDS.startup1, user_id: IDS.startupUser, name: 'Startup India Seed Fund', category: 'Government Grant', amount_requested: 1000000, purpose: 'Expansion into 5 new agricultural districts', status: 'pending', amount_approved: 0, amount_released: 0 },
    { startup_id: IDS.startup1, user_id: IDS.startupUser, name: 'TechVentures Seed Round', category: 'Investor Funding', amount_requested: 5000000, purpose: 'Series Seed expansion & hiring tech team', status: 'under_review', amount_approved: 0, amount_released: 0 },

    { startup_id: IDS.startup2, user_id: IDS.startupUser2, name: 'LaunchPad Seed Grant', category: 'Incubator Grant', amount_requested: 250000, purpose: 'UPI SDK integration and security audit', status: 'approved', amount_approved: 250000, amount_released: 250000 },
    { startup_id: IDS.startup12, user_id: IDS.startupUser12, name: 'Incubator Scale Grant', category: 'Incubator Grant', amount_requested: 500000, purpose: 'Kubernetes cluster benchmarking lab', status: 'approved', amount_approved: 500000, amount_released: 500000 },
    { startup_id: IDS.startup16, user_id: IDS.startupUser16, name: 'Clean Energy Grant', category: 'Incubator Grant', amount_requested: 500000, purpose: 'LFP battery safety casing certification', status: 'approved', amount_approved: 500000, amount_released: 500000 }
  ];

  for (const f of fundingRecords) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO funding_applications 
       (id, startup_id, user_id, name, category, amount_requested, purpose, status, amount_approved, amount_released)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), f.startup_id, f.user_id, f.name, f.category, f.amount_requested, f.purpose, f.status, f.amount_approved, f.amount_released]
    );
  }

  // ── 14. MENTOR FEEDBACK ──
  const feedbackList = [
    { mentor_id: IDS.mentor1, startup_id: IDS.startup1, topic: 'MVP Beta Testing Review', rating: 5, text: 'Strong progress on the farmer Android client. The local dialect voice audio messages have significantly reduced onboarding friction. Prioritize tracking 30-day retention over raw downloads.' },
    { mentor_id: IDS.mentor1, startup_id: IDS.startup1, topic: 'Business Model Review', rating: 4, text: 'Farmer willingness to pay ₹199/month has been demonstrated in the Mandya pilot. I recommend pitching a B2B enterprise data feed to crop insurance companies to diversify revenue streams.' },
    { mentor_id: IDS.mentor8, startup_id: IDS.startup1, topic: 'Pitch Deck Teardown', rating: 4, text: 'The problem statement is crisp and highly relatable. On slide 7 (Unit Economics), make sure to emphasize your low CAC of ₹45 per active farmer attained via WhatsApp referrals.' },
    { mentor_id: IDS.mentor1, startup_id: IDS.startup5, topic: 'Truck Telematics Sensor Check', rating: 4, text: 'Thermocouple accuracy is solid. Focus on improving battery life for transit times exceeding 36 hours on rural highways.' }
  ];
  for (const fb of feedbackList) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO mentor_feedback (id, mentor_id, startup_id, topic, feedback_text, rating) VALUES (?,?,?,?,?,?)',
      [uuidv4(), fb.mentor_id, fb.startup_id, fb.topic, fb.text, fb.rating]
    );
  }

  // ── 15. INCUBATION APPLICATIONS (For Admin Dashboard Review) ──
  const incApps = [
    { id: 'ia-app-1', startup_id: IDS.startup1, user_id: IDS.startupUser, program_id: IDS.program2, status: 'approved', step: 8, submitted_at: '2024-02-20', reviewed_at: '2024-03-05' },
    { id: 'ia-app-2', startup_id: IDS.startup2, user_id: IDS.startupUser2, program_id: IDS.program2, status: 'approved', step: 8, submitted_at: '2024-02-22', reviewed_at: '2024-03-08' },
    { id: 'ia-app-3', startup_id: IDS.startup4, user_id: IDS.startupUser4, program_id: IDS.program2, status: 'submitted', step: 8, submitted_at: '2026-10-18', reviewed_at: null },
    { id: 'ia-app-4', startup_id: IDS.startup6, user_id: IDS.startupUser6, program_id: IDS.program3, status: 'submitted', step: 8, submitted_at: '2026-10-20', reviewed_at: null },
    { id: 'ia-app-5', startup_id: IDS.startup9, user_id: IDS.startupUser9, program_id: IDS.program2, status: 'under_review', step: 8, submitted_at: '2026-10-12', reviewed_at: null },
    { id: 'ia-app-6', startup_id: IDS.startup11, user_id: IDS.startupUser11, program_id: IDS.program1, status: 'under_review', step: 8, submitted_at: '2026-10-14', reviewed_at: null },
    { id: 'ia-app-7', startup_id: IDS.startup15, user_id: IDS.startupUser15, program_id: IDS.program2, status: 'interview', step: 8, submitted_at: '2026-10-05', reviewed_at: null },
    { id: 'ia-app-8', startup_id: IDS.startup14, user_id: IDS.startupUser14, program_id: IDS.program4, status: 'rejected', step: 8, submitted_at: '2026-09-15', reviewed_at: '2026-09-28' }
  ];

  for (const ia of incApps) {
    dbWrapper.run(
      `INSERT OR REPLACE INTO incubation_applications 
       (id, startup_id, user_id, program_id, status, step_completed, submitted_at, reviewed_at, reviewed_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [ia.id, ia.startup_id, ia.user_id, ia.program_id, ia.status, ia.step, ia.submitted_at, ia.reviewed_at, ia.reviewed_at ? IDS.adminUser : null]
    );
  }

  // ── 16. CONVERSATIONS & MESSAGES ──
  const conv1 = 'conv-arjun-rahul';
  dbWrapper.run('INSERT OR REPLACE INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)', [conv1, IDS.startupUser, IDS.mentorUser]);
  const msgs1 = [
    { sender: IDS.mentorUser, text: 'Hi Arjun! How is the MVP beta deployment progressing in Mandya district?' },
    { sender: IDS.startupUser, text: 'Hello Dr. Mehta! We have onboarded 85 farmers so far. Daily active engagement with the pest advisory audio alerts is over 68%!' },
    { sender: IDS.mentorUser, text: 'That is outstanding engagement for a rural application. Make sure to capture specific farmer video testimonials before our review session tomorrow at 3 PM.' },
    { sender: IDS.startupUser, text: 'Will do! We have 4 short video clips recorded in Kannada. Ready to showcase during the demo.' }
  ];
  for (const m of msgs1) {
    dbWrapper.run('INSERT OR REPLACE INTO messages (id, conversation_id, sender_id, text, is_read) VALUES (?,?,?,?,1)', [uuidv4(), conv1, m.sender, m.text]);
  }

  const conv2 = 'conv-arjun-vikram';
  dbWrapper.run('INSERT OR REPLACE INTO conversations (id, participant_one_id, participant_two_id) VALUES (?,?,?)', [conv2, IDS.startupUser, IDS.investorUser]);
  const msgs2 = [
    { sender: IDS.investorUser, text: 'Hi Arjun, TechVentures has reviewed NovaSphere latest progress metrics through the LaunchPad portal. The unit economics look very promising.' },
    { sender: IDS.startupUser, text: 'Thank you Mr. Bajaj! We are excited to present our expansion roadmap for our upcoming seed financing.' },
    { sender: IDS.investorUser, text: 'Looking forward to our introductory committee call on Dec 4 at 11 AM.' }
  ];
  for (const m of msgs2) {
    dbWrapper.run('INSERT OR REPLACE INTO messages (id, conversation_id, sender_id, text, is_read) VALUES (?,?,?,?,1)', [uuidv4(), conv2, m.sender, m.text]);
  }

  // ── 17. NOTIFICATIONS ──
  const notifs = [
    // Startup notifications
    { user_id: IDS.startupUser, type: 'milestone', icon: '🎯', title: 'Prototype milestone approved', text: 'Dr. Rahul Mehta reviewed and approved your Prototype milestone.', link: '#milestones', is_read: 0 },
    { user_id: IDS.startupUser, type: 'investor', icon: '💼', title: 'Investor meeting confirmed', text: 'TechVentures India confirmed intro call for Dec 04 at 11:00 AM.', link: '#meetings', is_read: 0 },
    { user_id: IDS.startupUser, type: 'funding', icon: '💰', title: 'Grant disbursed successfully', text: '₹3,00,000 from BIRAC BIG Grant has been credited to your startup escrow account.', link: '#funding', is_read: 1 },
    { user_id: IDS.startupUser, type: 'event', icon: '🎟️', title: 'Demo Day registration confirmed', text: 'You are registered for National Demo Day 2026 on Dec 18.', link: '#events', is_read: 1 },

    // Mentor notifications
    { user_id: IDS.mentorUser, type: 'milestone', icon: '🚀', title: 'Milestone pending your review', text: 'NovaSphere submitted MVP Development milestone for your review.', link: 'milestones', is_read: 0 },
    { user_id: IDS.mentorUser, type: 'milestone', icon: '🚚', title: 'AgroPulse submitted pilot review', text: 'AgroPulse submitted Cold-Chain Pilot Deployment for your approval.', link: 'milestones', is_read: 0 },
    { user_id: IDS.mentorUser, type: 'meeting', icon: '📅', title: 'Upcoming mentoring session', text: 'Review meeting with NovaSphere tomorrow at 3:00 PM.', link: 'meetings', is_read: 0 },

    // Investor notifications
    { user_id: IDS.investorUser, type: 'investor', icon: '📈', title: 'New traction update: NovaSphere', text: 'NovaSphere uploaded Q3 progress report and beta metrics.', link: 'startups', is_read: 0 },
    { user_id: IDS.investorUser, type: 'event', icon: '🎟️', title: 'VIP pass: National Demo Day 2026', text: 'Your VIP investor pass for Demo Day on Dec 18 is ready.', link: 'events', is_read: 0 },

    // Admin notifications
    { user_id: IDS.adminUser, type: 'application', icon: '📋', title: '2 new incubation applications submitted', text: 'KisanAI and RupeeFlow submitted incubation applications requiring review.', link: 'applications', is_read: 0 },
    { user_id: IDS.adminUser, type: 'funding', icon: '💰', title: 'Funding request pending approval', text: 'DST-NIDHI PRAYAS application for NovaSphere (₹5,00,000) awaits decision.', link: 'funding', is_read: 0 }
  ];
  for (const n of notifs) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO notifications (id, user_id, type, icon, title, text, link, is_read) VALUES (?,?,?,?,?,?,?,?)',
      [uuidv4(), n.user_id, n.type, n.icon, n.title, n.text, n.link, n.is_read]
    );
  }

  // ── 18. ACTIVITY LOG ──
  const activities = [
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '✓', bg: 'rgba(0,212,170,0.12)', text: '<strong>Mentor approved</strong> Prototype Development milestone' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '📄', bg: 'rgba(108,99,255,0.12)', text: '<strong>Pitch deck</strong> updated to version v3.2' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '💰', bg: 'rgba(0,212,170,0.12)', text: '<strong>BIRAC BIG Grant</strong> of ₹3,00,000 disbursed' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '📅', bg: 'rgba(255,184,48,0.12)', text: '<strong>Meeting scheduled</strong> with Dr. Rahul Mehta for Dec 2' },
    { user_id: IDS.startupUser, startup_id: IDS.startup1, icon: '💼', bg: 'rgba(255,122,80,0.12)', text: '<strong>TechVentures India</strong> confirmed seed term sheet call' }
  ];
  for (const a of activities) {
    dbWrapper.run(
      'INSERT OR REPLACE INTO activity_log (id, user_id, startup_id, icon, bg, text) VALUES (?,?,?,?,?,?)',
      [uuidv4(), a.user_id, a.startup_id, a.icon, a.bg, a.text]
    );
  }

  console.log('✅ Database seeded with 16 startups, 10 mentors, 8 investors, 4 programs & 8 events!');
  console.log('📧 Demo Logins:');
  console.log('  Startup  : startup@launchpad.demo  / Demo@2024');
  console.log('  Mentor   : mentor@launchpad.demo   / Demo@2024');
  console.log('  Investor : investor@launchpad.demo / Demo@2024');
  console.log('  Admin    : admin@launchpad.demo    / Demo@2024');
}

function seedIfEmpty() {
  seedDatabase(false);
}

module.exports = { seedDatabase, seedIfEmpty };
