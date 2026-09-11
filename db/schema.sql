-- LaunchPad Database Schema
-- SQLite

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'startup',  -- startup | mentor | investor | admin
  avatar TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS startups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  logo TEXT DEFAULT 'NS',
  tagline TEXT,
  description TEXT,
  industry TEXT,
  stage TEXT DEFAULT 'Idea',
  founded_date TEXT,
  location TEXT,
  website TEXT,
  problem TEXT,
  solution TEXT,
  target_customers TEXT,
  business_model TEXT,
  revenue_model TEXT,
  market_size TEXT,
  competitors TEXT,
  technology TEXT,
  traction TEXT,
  incubation_status TEXT DEFAULT 'applicant',  -- applicant | active | graduated | suspended
  cohort TEXT,
  progress INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS startup_team_members (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  experience TEXT,
  skills TEXT,  -- JSON array
  color TEXT DEFAULT '#6C63FF',
  initials TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS incubation_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  eligibility TEXT,
  benefits TEXT,  -- JSON array
  application_deadline TEXT,
  max_startups INTEGER DEFAULT 30,
  current_startups INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  cohort TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS incubation_applications (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  program_id TEXT REFERENCES incubation_programs(id),
  status TEXT DEFAULT 'draft',  -- draft | submitted | under_review | interview | approved | rejected | changes_requested
  step_completed INTEGER DEFAULT 1,
  founder_info TEXT,   -- JSON
  startup_info TEXT,   -- JSON
  problem_solution TEXT, -- JSON
  market TEXT,         -- JSON
  business_model TEXT, -- JSON
  team TEXT,           -- JSON
  documents TEXT,      -- JSON
  admin_notes TEXT,
  interview_date TEXT,
  submitted_at TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  program_id TEXT REFERENCES incubation_programs(id),
  title TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  description TEXT,
  deadline TEXT,
  status TEXT DEFAULT 'not_started', -- not_started | in_progress | submitted | approved | needs_revision | completed
  progress INTEGER DEFAULT 0,
  submission TEXT,
  mentor_status TEXT DEFAULT 'Not Started',
  mentor_comment TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestone_tasks (
  id TEXT PRIMARY KEY,
  milestone_id TEXT NOT NULL REFERENCES milestones(id),
  title TEXT NOT NULL,
  is_done INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  initials TEXT,
  role TEXT,
  experience TEXT,
  bio TEXT,
  expertise TEXT,  -- JSON array
  availability TEXT, -- JSON array
  rating REAL DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  is_verified INTEGER DEFAULT 0,
  linkedin TEXT,
  website TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentor_assignments (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES mentors(id),
  startup_id TEXT NOT NULL REFERENCES startups(id),
  assigned_by TEXT REFERENCES users(id),
  assigned_at TEXT DEFAULT (datetime('now')),
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS mentor_evaluations (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES mentors(id),
  startup_id TEXT NOT NULL REFERENCES startups(id),
  innovation INTEGER DEFAULT 0,
  problem_solution INTEGER DEFAULT 0,
  market_potential INTEGER DEFAULT 0,
  business_model INTEGER DEFAULT 0,
  technology INTEGER DEFAULT 0,
  team INTEGER DEFAULT 0,
  scalability INTEGER DEFAULT 0,
  traction INTEGER DEFAULT 0,
  strengths TEXT,
  weaknesses TEXT,
  risks TEXT,
  recommendations TEXT,
  overall_comments TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentor_feedback (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES mentors(id),
  startup_id TEXT NOT NULL REFERENCES startups(id),
  milestone_id TEXT REFERENCES milestones(id),
  topic TEXT,
  feedback_text TEXT NOT NULL,
  rating INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT,
  file_type TEXT,
  category TEXT DEFAULT 'Other',
  size_text TEXT,
  version TEXT DEFAULT 'v1.0',
  status TEXT DEFAULT 'In Review',  -- Draft | In Review | Approved | Verified
  icon TEXT DEFAULT '📄',
  color TEXT DEFAULT '#6C63FF',
  milestone_id TEXT REFERENCES milestones(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organizer_id TEXT NOT NULL REFERENCES users(id),
  participant_id TEXT NOT NULL REFERENCES users(id),
  startup_id TEXT REFERENCES startups(id),
  meeting_date TEXT,
  meeting_time TEXT,
  meeting_type TEXT DEFAULT 'Video Call',  -- Video Call | In-Person | Phone
  topic TEXT,
  description TEXT,
  notes TEXT,
  status TEXT DEFAULT 'requested',  -- requested | confirmed | rescheduled | completed | cancelled
  meeting_link TEXT,
  color TEXT DEFAULT '#6C63FF',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS funding_applications (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  amount_requested INTEGER NOT NULL,
  purpose TEXT,
  budget_breakdown TEXT,  -- JSON
  expected_outcome TEXT,
  status TEXT DEFAULT 'pending',  -- pending | under_review | approved | rejected | partially_approved | released
  amount_approved INTEGER DEFAULT 0,
  amount_released INTEGER DEFAULT 0,
  admin_notes TEXT,
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS investors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  organization TEXT,
  initials TEXT,
  color TEXT DEFAULT '#FFB830',
  bg TEXT DEFAULT 'rgba(255,184,48,0.12)',
  investor_type TEXT,  -- VC | Angel | Impact Investor | Sector Fund
  focus_sectors TEXT,  -- JSON array
  investment_range_min INTEGER DEFAULT 0,
  investment_range_max INTEGER DEFAULT 0,
  investment_range_text TEXT,
  portfolio_count INTEGER DEFAULT 0,
  preferred_stage TEXT,
  description TEXT,
  website TEXT,
  contact_name TEXT,
  is_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS investment_interests (
  id TEXT PRIMARY KEY,
  investor_id TEXT NOT NULL REFERENCES investors(id),
  startup_id TEXT NOT NULL REFERENCES startups(id),
  proposed_amount INTEGER,
  message TEXT,
  investment_type TEXT,
  status TEXT DEFAULT 'interested',  -- interested | contacted | meeting | due_diligence | invested | declined
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,
  investor_id TEXT NOT NULL REFERENCES investors(id),
  startup_id TEXT NOT NULL REFERENCES startups(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT,
  event_time TEXT,
  venue TEXT,
  online_link TEXT,
  host TEXT,
  category TEXT,  -- Workshop | Hackathon | Bootcamp | Pitch Day | Demo Day | Investor Meet | Networking
  capacity INTEGER DEFAULT 100,
  registered_count INTEGER DEFAULT 0,
  emoji TEXT DEFAULT '🚀',
  color TEXT,
  tag_color TEXT DEFAULT '#6C63FF',
  is_public INTEGER DEFAULT 1,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  startup_id TEXT REFERENCES startups(id),
  registered_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  participant_one_id TEXT NOT NULL REFERENCES users(id),
  participant_two_id TEXT NOT NULL REFERENCES users(id),
  last_message_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  attachment_name TEXT,
  attachment_path TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT,  -- milestone | investor | meeting | funding | mentor | event | document | application
  icon TEXT DEFAULT '🔔',
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  link TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  startup_id TEXT REFERENCES startups(id),
  icon TEXT,
  bg TEXT DEFAULT 'rgba(108,99,255,0.12)',
  text TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_startups_user ON startups(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_startup ON incubation_applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_milestones_startup ON milestones(startup_id);
CREATE INDEX IF NOT EXISTS idx_milestone_tasks_milestone ON milestone_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentor ON mentor_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_startup ON mentor_assignments(startup_id);
CREATE INDEX IF NOT EXISTS idx_documents_startup ON documents(startup_id);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer ON meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_participant ON meetings(participant_id);
CREATE INDEX IF NOT EXISTS idx_funding_startup ON funding_applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_investment_interests_investor ON investment_interests(investor_id);
CREATE INDEX IF NOT EXISTS idx_investment_interests_startup ON investment_interests(startup_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_startup ON activity_log(startup_id);
