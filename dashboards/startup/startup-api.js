/* ============================================================
   startup-api.js — Full Backend Integration for Startup Dashboard
   Replaces ALL dummy data with live API data across every page.
   Runs AFTER app.js / pages-1.js / pages-2.js
============================================================ */

(async function () {
  /* ── 1. AUTH GUARD ── */
  const user = Api.requireAuth(['startup']);
  if (!user) return;

  /* ── 2. UPDATE SIDEBAR USER INFO ── */
  document.querySelectorAll('.avatar-name-sm').forEach(el => {
    el.textContent = user.name.split(' ')[0];
  });

  /* ── 3. LOAD ALL DATA FROM BACKEND ── */
  try {
    await loadAllData();
  } catch (err) {
    console.warn('Some data could not be loaded from backend:', err.message);
  }

  /* ── 4. PATCH ALL ACTION HANDLERS ── */
  patchActions();

  /* ── 5. PATCH ALL RENDER FUNCTIONS ── */
  patchRenders();

  /* ── 6. RENDER CURRENT PAGE WITH REAL DATA ── */
  const hash = window.location.hash.replace('#', '') || 'overview';
  setTimeout(() => {
    if (typeof renderPage === 'function') renderPage(hash);
  }, 150);

  console.log('✅ LaunchPad Startup Dashboard — connected to live backend');
})();

/* ════════════════════════════════════════════════════════════
   DATA LOADING — Pull everything from API into AppData
════════════════════════════════════════════════════════════ */
async function loadAllData() {
  const [startupRes, notifRes, meetingsRes, eventsRes, regsRes, convRes, activityRes, investorsRes, interestsRes] = await Promise.allSettled([
    Api.getMyStartup(),
    Api.getNotifications(),
    Api.getMeetings(),
    Api.getEvents(),
    Api.getMyEventRegistrations(),
    Api.getConversations(),
    Api.getActivity(),
    Api.getInvestors(),
    Api.getInvestorInterests()
  ]);

  /* ── STARTUP + TEAM + MENTOR ── */
  if (startupRes.status === 'fulfilled') {
    const { startup, team, mentor } = startupRes.value;
    if (startup) {
      Object.assign(AppData.startup, {
        id:            startup.id,
        name:          startup.name          || AppData.startup.name,
        tagline:       startup.tagline       || AppData.startup.tagline,
        industry:      startup.industry      || AppData.startup.industry,
        stage:         startup.stage         || AppData.startup.stage,
        location:      startup.location      || AppData.startup.location,
        website:       startup.website       || AppData.startup.website,
        progress:      startup.progress      ?? AppData.startup.progress,
        cohort:        startup.cohort        || AppData.startup.cohort,
        problem:       startup.problem       || AppData.startup.problem,
        solution:      startup.solution      || AppData.startup.solution,
        businessModel: startup.business_model|| AppData.startup.businessModel,
        targetCustomers:startup.target_customers || AppData.startup.targetCustomers,
        marketSize:    startup.market_size   || AppData.startup.marketSize,
        founded:       startup.founded_date  || AppData.startup.founded,
      });
      document.title = `${startup.name} — LaunchPad`;
    }
    if (team && team.length) {
      AppData.team = team.map(m => ({
        id: m.id, name: m.name, role: m.role,
        skills: safeJson(m.skills, []),
        color: m.color || '#6C63FF', initials: m.initials || m.name.substring(0,2).toUpperCase(),
        email: m.email || ''
      }));
    }
    if (mentor) {
      Object.assign(AppData.mentor, {
        name:              mentor.mentor_name      || AppData.mentor.name,
        role:              mentor.mentor_role      || AppData.mentor.role,
        rating:            mentor.rating           || AppData.mentor.rating,
        expertise:         safeJson(mentor.expertise, AppData.mentor.expertise),
        bio:               mentor.bio              || AppData.mentor.bio,
        availability:      safeJson(mentor.availability, AppData.mentor.availability),
        sessionsCompleted: mentor.sessions_completed || AppData.mentor.sessionsCompleted,
        sessionCount:      mentor.sessions_completed || AppData.mentor.sessionCount,
        linkedin:          mentor.linkedin         || '',
      });
    }
    // Milestones
    if (startup && startup.milestones && startup.milestones.length) {
      AppData.milestones = startup.milestones.map(ms => ({
        id: ms.id, title: ms.title, icon: ms.icon || '🎯',
        status: statusMap(ms.status),
        progress: ms.progress || 0,
        deadline: ms.deadline || '',
        description: ms.description || '',
        tasks: safeJson(ms.tasks, []).map(t => ({ t: t.title || t.t, done: !!t.is_done || !!t.done })),
        submission: ms.submission || '',
        mentorStatus: ms.mentor_status || 'Not Started',
        mentorComment: ms.mentor_comment || '',
        docs: []
      }));
    }
    // Documents
    if (startup && startup.documents && startup.documents.length) {
      AppData.documents = startup.documents.map(d => ({
        id: d.id, name: d.name, type: d.file_type || 'pdf',
        category: d.category, size: d.size_text || '',
        date: fmtDate(d.created_at), version: d.version || 'v1.0',
        status: d.status || 'Draft',
        icon: docIcon(d.category), color: docColor(d.category)
      }));
    }
    // Funding
    if (startup && startup.funding && startup.funding.length) {
      AppData.fundingApps = startup.funding.map(f => ({
        id: f.id, name: f.name, category: f.category,
        amount: f.amount_requested, purpose: f.purpose,
        status: f.status, amountApproved: f.amount_approved,
        amountReleased: f.amount_released, date: fmtDate(f.created_at),
        adminNotes: f.admin_notes || ''
      }));
    }
  }

  /* ── USER ── */
  AppData.user.name = user.name;
  AppData.user.firstName = user.name.split(' ')[0];
  AppData.user.email = user.email;
  AppData.user.avatar = user.name[0].toUpperCase();

  /* ── NOTIFICATIONS ── */
  if (notifRes.status === 'fulfilled') {
    const { notifications, unread_count } = notifRes.value;
    AppState.notifications = (notifications || []).map(n => ({
      id: n.id, type: n.type, icon: n.icon || '🔔',
      text: n.text, time: timeAgo(n.created_at),
      link: n.link || '#', read: !!n.is_read
    }));
    AppState.unreadCount = unread_count || 0;
  }

  /* ── MEETINGS ── */
  if (meetingsRes.status === 'fulfilled') {
    const { meetings } = meetingsRes.value;
    const now = new Date();
    AppState.meetings = (meetings || []).map(m => {
      const md = new Date(m.meeting_date + ' ' + (m.meeting_time || '00:00'));
      const isPast = md < now || m.status === 'completed';
      const [mon, day] = getMonthDay(m.meeting_date);
      const isOrg = m.organizer_id === user.id;
      return {
        id: m.id, title: m.title,
        with: isOrg ? (m.participant_name || 'LaunchPad') : (m.organizer_name || 'LaunchPad'),
        role: m.meeting_type === 'mentor' ? 'Mentor' : m.meeting_type === 'investor' ? 'Investor' : 'Admin',
        date: m.meeting_date, day, month: mon, time: m.meeting_time || '',
        type: m.meeting_type === 'video_call' ? 'Video Call' : 'In-Person',
        status: m.status || 'Scheduled', notes: m.notes || '',
        color: m.color || '#6C63FF', past: isPast
      };
    });
  } else {
    AppState.meetings = AppData.meetings || [];
  }

  /* ── EVENTS ── */
  if (eventsRes.status === 'fulfilled') {
    const { events } = eventsRes.value;
    const regIds = regsRes.status === 'fulfilled'
      ? new Set((regsRes.value.registrations || []).map(r => r.id))
      : new Set();
    AppData.events = (events || []).map(ev => ({
      id: ev.id, title: ev.title, type: ev.category || 'Event',
      date: ev.event_date, time: ev.event_time || '',
      location: ev.venue || 'Online', host: ev.host || 'LaunchPad',
      desc: ev.description || '', emoji: ev.emoji || '📅',
      seats: Math.max(0, (ev.capacity || 0) - (ev.registered_count || 0)),
      total: ev.capacity || 0,
      registered: regIds.has(ev.id),
      color: ev.color || 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(108,99,255,0.2))',
      tagColor: ev.tag_color || '#6C63FF'
    }));
  }

  /* ── CONVERSATIONS ── */
  if (convRes.status === 'fulfilled') {
    const { conversations } = convRes.value;
    AppState.unreadMessages = (conversations || []).reduce((s, c) => s + (c.unread_count || 0), 0);
    AppData.conversations = (conversations || []).map(c => {
      const isP1 = c.participant_one_id === user.id;
      const name = isP1 ? c.p2_name : c.p1_name;
      const role = isP1 ? c.p2_role : c.p1_role;
      return {
        id: c.id, name: name || 'User', role: role || 'Member',
        initials: (name || 'US').substring(0, 2).toUpperCase(),
        color: roleColor(role), online: false,
        unread: c.unread_count || 0, sharedFiles: [],
        conversationDbId: c.id, lastMessage: c.last_message || '',
        messages: [] // loaded on-demand
      };
    });
    if (AppData.conversations.length > 0 && !AppState.activeConversation) {
      AppState.activeConversation = AppData.conversations[0].id;
    }
  }

  /* ── ACTIVITY FEED ── */
  if (activityRes.status === 'fulfilled') {
    const { activities } = activityRes.value;
    AppState.activity = (activities || []).map(a => ({
      icon: a.icon || '📋', bg: a.bg || 'rgba(108,99,255,0.12)',
      text: a.text, time: timeAgo(a.created_at)
    }));
  }

  /* ── INVESTORS (as seen by startup) ── */
  if (investorsRes.status === 'fulfilled') {
    const { investors } = investorsRes.value;
    AppData.investors = (investors || []).map(inv => ({
      id: inv.id,
      name: inv.name,
      initials: inv.initials || (inv.name||'IN').substring(0,2).toUpperCase(),
      investor_type: inv.investor_type,
      type: inv.investor_type,
      preferred_stage: inv.preferred_stage,
      stage: inv.preferred_stage,
      focus: safeJson(inv.focus_sectors, []),
      focus_sectors: inv.focus_sectors,
      investment_range_text: inv.investment_range_text,
      range: inv.investment_range_text,
      bg: inv.bg || 'rgba(108,99,255,0.12)',
      color: inv.color || '#A78BFA',
      description: inv.description || '',
      website: inv.website || '',
      contact: inv.contact_name || '',
      portfolio: inv.portfolio_count || 0,
      status: 'Active', statusBg: 'rgba(0,212,170,0.12)', statusColor: '#00D4AA'
    }));
  }

  if (interestsRes.status === 'fulfilled') {
    AppData.investorInterests = interestsRes.value.interests || [];
  }

  // Update sidebar badges
  if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
}

/* ════════════════════════════════════════════════════════════
   PATCH RENDERS — Overwrite key render functions to pull live data
════════════════════════════════════════════════════════════ */
function patchRenders() {
  /* ── MESSAGES: load msgs from API on conversation switch ── */
  const origLoadConv = window.loadConversation;
  window.loadConversation = async function(id) {
    const conv = AppData.conversations.find(c => c.id === id);
    if (conv && conv.messages.length === 0) {
      try {
        const { messages } = await Api.getMessages(id);
        const me = Api.getUser();
        conv.messages = (messages || []).map(m => ({
          id: m.id, sender: m.sender_id === me.id ? 'me' : 'them',
          text: m.text, time: fmtDateTime(m.created_at)
        }));
        // mark read
        await Api.markAllRead().catch(() => {});
      } catch (e) {}
    }
    AppState.activeConversation = id;
    renderMessages();
  };

  /* ── SEND CHAT ── */
  window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const text = (input?.value || '').trim();
    if (!text) return;
    const conv = AppData.conversations.find(c => c.id === AppState.activeConversation);
    if (!conv) return;
    try {
      await Api.replyInConversation(conv.conversationDbId, text);
      conv.messages.push({ id: Date.now(), sender: 'me', text, time: 'Just now' });
      conv.lastMessage = text;
      input.value = '';
      renderMessages();
      // Scroll to bottom
      setTimeout(() => {
        const msgArea = document.querySelector('.messages-list');
        if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
      }, 50);
    } catch (e) { showToast('Failed to send message', '❌'); }
  };

  /* ── NOTIFICATIONS ── */
  window.markNotifRead = async function(id) {
    await Api.markRead(id).catch(() => {});
    const n = AppState.notifications.find(n => n.id === id);
    if (n) { n.read = true; AppState.unreadCount = Math.max(0, AppState.unreadCount - 1); }
    updateSidebarBadges();
  };

  window.markAllNotificationsRead = async function() {
    await Api.markAllRead().catch(() => {});
    AppState.notifications.forEach(n => n.read = true);
    AppState.unreadCount = 0;
    updateSidebarBadges();
  };

  window.deleteNotif = async function(id) {
    await Api.deleteNotification(id).catch(() => {});
    AppState.notifications = AppState.notifications.filter(n => n.id !== id);
  };
}

/* ════════════════════════════════════════════════════════════
   PATCH ACTIONS — Wire all form submissions to real API
════════════════════════════════════════════════════════════ */
function patchActions() {
  /* ── SAVE STARTUP PROFILE ── */
  window.saveStartupProfile = async function() {
    const data = {
      name: document.getElementById('startupName')?.value,
      tagline: document.getElementById('startupTagline')?.value,
      industry: document.getElementById('startupIndustry')?.value,
      stage: document.getElementById('startupStage')?.value,
      location: document.getElementById('startupLocation')?.value,
      website: document.getElementById('startupWebsite')?.value,
      problem: document.getElementById('startupProblem')?.value,
      solution: document.getElementById('startupSolution')?.value,
      business_model: document.getElementById('startupBusinessModel')?.value,
      target_customers: document.getElementById('startupTargetCustomers')?.value,
      market_size: document.getElementById('startupMarketSize')?.value,
    };
    // Remove nulls
    Object.keys(data).forEach(k => { if (!data[k]) delete data[k]; });
    try {
      await Api.updateMyStartup(data);
      Object.assign(AppData.startup, {
        name: data.name || AppData.startup.name,
        tagline: data.tagline || AppData.startup.tagline,
        industry: data.industry || AppData.startup.industry,
        stage: data.stage || AppData.startup.stage,
        location: data.location || AppData.startup.location,
        website: data.website || AppData.startup.website,
        problem: data.problem || AppData.startup.problem,
        solution: data.solution || AppData.startup.solution,
        businessModel: data.business_model || AppData.startup.businessModel,
        targetCustomers: data.target_customers || AppData.startup.targetCustomers,
        marketSize: data.market_size || AppData.startup.marketSize,
      });
      showToast('Startup profile saved!', '✅');
    } catch (e) { showToast('Save failed: ' + e.message, '❌'); }
  };

  /* ── ADD TEAM MEMBER ── */
  const origAddTeam = window.addTeamMember;
  window.addTeamMember = async function() {
    const name = document.getElementById('tmName')?.value?.trim();
    const role = document.getElementById('tmRole')?.value?.trim();
    const skills = document.getElementById('tmSkills')?.value?.trim();
    if (!name || !role) { showToast('Name and role are required', '⚠️'); return; }
    try {
      const res = await Api.addTeamMember({
        name, role,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        color: randomColor()
      });
      AppData.team.push({
        id: res.id, name, role,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        color: randomColor(),
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      });
      closeModal('addTeamModal');
      renderPage('startup');
      showToast(`${name} added to team!`, '🎉');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── REMOVE TEAM MEMBER ── */
  window.removeTeamMember = async function(id) {
    try {
      await Api.removeTeamMember(id);
      AppData.team = AppData.team.filter(m => m.id !== id);
      renderPage('startup');
      showToast('Team member removed', '✅');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── SUBMIT MILESTONE ── */
  window.submitMilestoneForReview = async function(msId) {
    try {
      await Api.submitMilestone(msId);
      const ms = AppData.milestones.find(m => m.id === msId);
      if (ms) { ms.status = 'submitted'; ms.mentorStatus = 'Pending Review'; }
      renderPage('milestones');
      showToast('Milestone submitted for mentor review!', '🎯');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── TOGGLE MILESTONE TASK ── */
  const origToggleMs = window.toggleMsTask;
  window.toggleMsTask = async function(msId, tIdx, el) {
    const ms = AppData.milestones.find(m => m.id === msId);
    if (!ms) return;
    const task = ms.tasks[tIdx];
    if (!task) return;
    const isDone = !task.done;
    // Update UI immediately
    task.done = isDone;
    el.classList.toggle('done', isDone);
    // Get task id from the API tasks if available
    const taskId = task.id || tIdx;
    try {
      await Api.toggleTask(msId, taskId, isDone);
      // Recalculate milestone progress
      const done = ms.tasks.filter(t => t.done).length;
      ms.progress = ms.tasks.length ? Math.round((done / ms.tasks.length) * 100) : 0;
    } catch (e) {
      // Revert on failure
      task.done = !isDone;
      el.classList.toggle('done', !isDone);
    }
  };

  /* ── UPLOAD DOCUMENT ── */
  window.submitDocUpload = async function() {
    const fileInput = document.getElementById('docFile');
    const category = document.getElementById('docCategory')?.value;
    const version = document.getElementById('docVersion')?.value || 'v1.0';
    const file = fileInput?.files?.[0];
    if (!file) { showToast('Please select a file', '⚠️'); return; }
    try {
      const res = await Api.uploadDocument(file, category, version);
      AppData.documents.unshift({
        id: res.document?.id, name: file.name,
        type: file.name.split('.').pop(), category,
        size: formatSize(file.size), date: 'Just now',
        version, status: 'Draft',
        icon: docIcon(category), color: docColor(category)
      });
      closeModal('uploadDocModal');
      renderPage('documents');
      showToast('Document uploaded!', '📄');
    } catch (e) { showToast('Upload failed: ' + e.message, '❌'); }
  };

  /* ── DELETE DOCUMENT ── */
  window.deleteDocument = async function(id) {
    try {
      await Api.deleteDocument(id);
      AppData.documents = AppData.documents.filter(d => d.id !== id);
      renderPage('documents');
      showToast('Document deleted', '🗑️');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── BOOK MEETING ── */
  window.submitMeetingRequest = async function() {
    const title = document.getElementById('meetingTitle')?.value?.trim();
    const date = document.getElementById('meetingDate')?.value;
    const time = document.getElementById('meetingTime')?.value;
    const type = document.getElementById('meetingType')?.value;
    const notes = document.getElementById('meetingNotes')?.value;
    if (!title || !date || !time) { showToast('Please fill all required fields', '⚠️'); return; }
    try {
      const res = await Api.requestMeeting({ title, meeting_date: date, meeting_time: time, meeting_type: type, notes });
      const [mon, day] = getMonthDay(date);
      AppState.meetings.push({
        id: res.meeting_id, title, with: 'LaunchPad Admin',
        role: 'Admin', date, day, month: mon, time,
        type: type === 'video_call' ? 'Video Call' : 'In-Person',
        status: 'Requested', notes: notes || '',
        color: '#6C63FF', past: false
      });
      closeModal('requestMeetingModal');
      renderPage('meetings');
      showToast('Meeting request sent!', '📅');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── APPLY FOR FUNDING ── */
  window.submitFundingApp = async function() {
    const name = document.getElementById('fundingName')?.value?.trim();
    const category = document.getElementById('fundingCategory')?.value;
    const amount = parseFloat(document.getElementById('fundingAmount')?.value);
    const purpose = document.getElementById('fundingPurpose')?.value?.trim();
    if (!name || !amount || !purpose) { showToast('Please fill all fields', '⚠️'); return; }
    try {
      const res = await Api.applyFunding({ name, category, amount_requested: amount, purpose });
      if (!AppData.fundingApps) AppData.fundingApps = [];
      AppData.fundingApps.unshift({
        id: res.application_id, name, category,
        amount, purpose, status: 'Submitted',
        amountApproved: 0, amountReleased: 0,
        date: 'Just now', adminNotes: ''
      });
      closeModal('applyFundingModal');
      renderPage('funding');
      showToast('Funding application submitted!', '💰');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── EVENT REGISTRATION ── */
  window.registerForEvent = async function(id) {
    try {
      await Api.registerEvent(id);
      const ev = AppData.events.find(e => e.id === id);
      if (ev) { ev.registered = true; ev.seats = Math.max(0, ev.seats - 1); }
      renderPage('events');
      showToast('Registered for event!', '🎟️');
    } catch (e) { showToast(e.message, '❌'); }
  };

  window.cancelEventReg = async function(id) {
    try {
      await Api.cancelEventRegistration(id);
      const ev = AppData.events.find(e => e.id === id);
      if (ev) { ev.registered = false; ev.seats += 1; }
      renderPage('events');
      showToast('Registration cancelled', '❌');
    } catch (e) { showToast(e.message, '❌'); }
  };

  /* ── SAVE USER PROFILE ── */
  window.saveUserProfile = async function() {
    const data = {
      name: document.getElementById('profileName')?.value,
      phone: document.getElementById('profilePhone')?.value,
      linkedin: document.getElementById('profileLinkedin')?.value,
      bio: document.getElementById('profileBio')?.value,
      location: document.getElementById('profileLocation')?.value,
    };
    try {
      await Api.updateMyStartup(data); // re-uses startup update for profile fields
      if (data.name) { AppData.user.name = data.name; AppData.user.firstName = data.name.split(' ')[0]; }
      if (data.phone) AppData.user.phone = data.phone;
      if (data.linkedin) AppData.user.linkedin = data.linkedin;
      if (data.bio) AppData.user.bio = data.bio;
      if (data.location) AppData.user.location = data.location;
      showToast('Profile updated!', '✅');
    } catch (e) { showToast('Failed: ' + e.message, '❌'); }
  };

  /* ── LOGOUT ── */
  window.doLogout = async function() {
    await Api.logout();
    window.location.href = '/login';
  };
}

/* ════════════════════════════════════════════════════════════
   HELPER UTILITIES
════════════════════════════════════════════════════════════ */
function statusMap(s) {
  const m = { completed:'done', approved:'done', in_progress:'active', submitted:'active', not_started:'future' };
  return m[s] || s || 'future';
}

function safeJson(val, fallback) {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val || 'null') || fallback; } catch { return fallback; }
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Just now';
  const diff = (Date.now() - new Date(dateStr)) / 60000;
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${Math.floor(diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
  if (diff < 10080) return `${Math.floor(diff/1440)}d ago`;
  return fmtDate(dateStr);
}

function fmtDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getMonthDay(dateStr) {
  if (!dateStr) return ['---', '--'];
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return [months[d.getMonth()], String(d.getDate()).padStart(2, '0')];
}

function docIcon(cat = '') {
  const map = { 'Business Plan':'📄', 'Pitch Deck':'📊', 'Financial Plan':'📈', 'Product Documents':'📝', 'Legal Documents':'⚖️', 'Progress Reports':'📋' };
  return map[cat] || '📎';
}

function docColor(cat = '') {
  const map = { 'Business Plan':'#FF4D6A', 'Pitch Deck':'#FF7A50', 'Financial Plan':'#00D4AA', 'Product Documents':'#6C63FF', 'Legal Documents':'#A78BFA', 'Progress Reports':'#FFB830' };
  return map[cat] || '#7B89A0';
}

function roleColor(role = '') {
  const r = role.toLowerCase();
  if (r.includes('mentor')) return '#6C63FF';
  if (r.includes('investor')) return '#FFB830';
  if (r.includes('admin')) return '#FF4D6A';
  return '#00D4AA';
}

function randomColor() {
  return ['#6C63FF','#00D4AA','#FFB830','#FF7A50','#A78BFA'][Math.floor(Math.random()*5)];
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1048576).toFixed(1) + ' MB';
}
