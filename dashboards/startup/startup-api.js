/* ============================================================
   startup-api.js — Bridges the existing dashboard to the real backend
   Runs AFTER app.js to enrich AppData and AppState with real data
============================================================ */

(async function () {
  // ── 1. Auth Guard ──
  const user = Api.requireAuth(['startup']);
  if (!user) return; // redirects to login

  // ── 2. Update sidebar user info ──
  const avatarEls = document.querySelectorAll('.avatar-name-sm');
  avatarEls.forEach(el => el.textContent = user.name.split(' ')[0]);

  // ── 3. Load real data and merge into AppData ──
  try {
    // Load startup data
    const { startup, team, mentor } = await Api.getMyStartup().catch(() => ({ startup: null, team: [], mentor: null }));
    
    if (startup) {
      // Update AppData.startup
      AppData.startup.name = startup.name;
      AppData.startup.tagline = startup.tagline || AppData.startup.tagline;
      AppData.startup.industry = startup.industry || AppData.startup.industry;
      AppData.startup.stage = startup.stage || AppData.startup.stage;
      AppData.startup.location = startup.location || AppData.startup.location;
      AppData.startup.website = startup.website || AppData.startup.website;
      AppData.startup.progress = startup.progress || AppData.startup.progress;
      AppData.startup.id = startup.id;
      
      // Update document title
      document.title = `${startup.name} — LaunchPad Incubator`;
    }
    
    if (team && team.length > 0) {
      AppData.team = team.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        skills: JSON.parse(m.skills || '[]'),
        color: m.color,
        initials: m.initials,
        email: m.email || ''
      }));
    }

    if (mentor) {
      AppData.mentor.name = mentor.mentor_name || AppData.mentor.name;
      AppData.mentor.role = mentor.mentor_role || AppData.mentor.role;
      AppData.mentor.rating = mentor.rating || AppData.mentor.rating;
      AppData.mentor.expertise = JSON.parse(mentor.expertise || '[]');
      AppData.mentor.bio = mentor.bio || AppData.mentor.bio;
      AppData.mentor.availability = JSON.parse(mentor.availability || '[]');
      AppData.mentor.sessionsCompleted = mentor.sessions_completed || AppData.mentor.sessionsCompleted;
    }

    // Load user profile
    AppData.user.name = user.name;
    AppData.user.email = user.email;
    AppData.user.role = 'Founder & CEO'; // Use registered role

    // Load notifications (replace mock)
    try {
      const { notifications, unread_count } = await Api.getNotifications();
      AppState.notifications = notifications.map(n => ({
        id: n.id,
        type: n.type,
        icon: n.icon,
        text: n.text,
        time: formatNotifTime(n.created_at),
        link: n.link || '#',
        read: n.is_read === 1
      }));
      AppState.unreadCount = unread_count;
    } catch (e) {}

    // Load milestones
    try {
      const { milestones } = await Api.getMilestones();
      if (milestones && milestones.length > 0) {
        AppData.milestones = milestones.map((ms, i) => ({
          id: ms.id,
          title: ms.title,
          icon: ms.icon,
          description: ms.description,
          deadline: ms.deadline,
          status: mapMilestoneStatus(ms.status),
          progress: ms.progress,
          submission: ms.submission,
          mentorStatus: ms.mentor_status,
          mentorComment: ms.mentor_comment || '',
          tasks: ms.tasks || []
        }));
      }
    } catch (e) {}

    // Load funding
    try {
      const { funding } = await Api.getFunding();
      if (funding && funding.length > 0) {
        AppData.fundingApps = funding.map(f => ({
          id: f.id,
          name: f.name,
          category: f.category,
          amount: f.amount_requested,
          purpose: f.purpose,
          status: f.status,
          amountApproved: f.amount_approved,
          amountReleased: f.amount_released,
          date: formatDate(f.created_at),
          adminNotes: f.admin_notes
        }));
      }
    } catch (e) {}

    // Load documents
    try {
      const { documents } = await Api.getDocuments();
      if (documents && documents.length > 0) {
        AppData.documents = documents.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          size: d.size_text,
          version: d.version,
          status: d.status,
          icon: d.icon,
          color: d.color,
          date: formatDate(d.created_at)
        }));
      }
    } catch (e) {}

    // Load meetings
    try {
      const { meetings } = await Api.getMeetings();
      if (meetings && meetings.length > 0) {
        const now = new Date();
        AppState.meetings = meetings.map(m => {
          const mDate = new Date(m.meeting_date);
          const isPast = mDate < now || m.status === 'completed';
          const [month, day] = getMonthDay(m.meeting_date);
          const otherParty = m.organizer_id === user.id ? m.participant_name : m.organizer_name;
          const otherRole = 'Mentor/Admin';
          return {
            id: m.id,
            title: m.title,
            month, day,
            time: m.meeting_time,
            with: otherParty,
            role: otherRole,
            type: m.meeting_type,
            color: m.color || '#6C63FF',
            notes: m.notes,
            status: m.status || 'Video Call Link: meet.launchpad.demo',
            past: isPast
          };
        });
      }
    } catch (e) {}

    // Load events + registrations
    try {
      const [{ events }, { registrations }] = await Promise.all([
        Api.getEvents(),
        Api.getMyEventRegistrations()
      ]);
      const registeredIds = new Set((registrations || []).map(r => r.id));
      if (events && events.length > 0) {
        AppData.events = events.map((ev, i) => ({
          id: ev.id,
          title: ev.title,
          type: ev.category,
          date: ev.event_date,
          time: ev.event_time,
          location: ev.venue || 'Online',
          host: ev.host,
          desc: ev.description,
          seats: Math.max(0, ev.capacity - ev.registered_count),
          total: ev.capacity,
          emoji: ev.emoji,
          color: ev.color || `linear-gradient(135deg,rgba(108,99,255,0.12),rgba(108,99,255,0.2))`,
          tagColor: ev.tag_color || '#6C63FF',
          registered: registeredIds.has(ev.id)
        }));
      }
    } catch (e) {}

    // Load investors
    try {
      const { investors } = await Api.getInvestors();
      if (investors && investors.length > 0) {
        AppData.investors = investors.map((inv, i) => ({
          id: inv.id,
          name: inv.name,
          initials: inv.initials,
          type: inv.investor_type,
          stage: inv.preferred_stage,
          focus: JSON.parse(inv.focus_sectors || '[]'),
          range: inv.investment_range_text,
          bg: inv.bg,
          color: inv.color,
          status: 'Active',
          statusBg: 'rgba(0,212,170,0.12)',
          statusColor: '#00D4AA',
          description: inv.description,
          website: inv.website,
          contact: inv.contact_name,
          portfolio: inv.portfolio_count
        }));
      }
    } catch (e) {}

    // Load conversations
    try {
      const { conversations } = await Api.getConversations();
      if (conversations && conversations.length > 0) {
        AppState.unreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        AppData.conversations = await Promise.all(conversations.map(async (c) => {
          const isP1 = c.participant_one_id === user.id;
          const otherName = isP1 ? c.p2_name : c.p1_name;
          const otherRole = isP1 ? c.p2_role : c.p1_role;
          const initials = (otherName || 'UN').substring(0, 2).toUpperCase();
          const colors = ['#6C63FF', '#00D4AA', '#FFB830', '#FF7A50', '#A78BFA'];
          const colorIdx = c.id.charCodeAt(0) % colors.length;

          try {
            const { messages } = await Api.getMessages(c.id);
            return {
              id: c.id,
              name: otherName,
              role: otherRole,
              initials: initials,
              color: colors[colorIdx],
              online: false,
              unread: c.unread_count || 0,
              sharedFiles: [],
              conversationDbId: c.id,
              messages: (messages || []).map(msg => ({
                id: msg.id,
                sender: msg.sender_id === user.id ? 'me' : 'them',
                text: msg.text,
                time: formatMessageTime(msg.created_at)
              }))
            };
          } catch { return null; }
        }));
        AppData.conversations = AppData.conversations.filter(Boolean);
        if (AppData.conversations.length > 0) {
          AppState.activeConversation = AppData.conversations[0].id;
        }
      }
    } catch (e) {}

    // Load activity
    try {
      const { activities } = await Api.getActivity();
      if (activities && activities.length > 0) {
        AppState.activity = activities.map(a => ({
          icon: a.icon,
          bg: a.bg,
          text: a.text,
          time: formatNotifTime(a.created_at)
        }));
      }
    } catch (e) {}

  } catch (err) {
    console.warn('Could not load some real data, using demo data:', err.message);
  }

  // ── 4. Add logout to sidebar ──
  const sidebarBottom = document.querySelector('.sidebar-bottom');
  if (sidebarBottom) {
    const logoutBtn = document.createElement('div');
    logoutBtn.className = 'nav-item';
    logoutBtn.style.marginTop = '4px';
    logoutBtn.innerHTML = `
      <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <span class="nav-label">Logout</span>
    `;
    logoutBtn.onclick = async () => {
      await Api.logout();
      window.location.href = '/login';
    };
    sidebarBottom.appendChild(logoutBtn);
  }

  // ── 5. Override key actions to use real API ──

  // Mark notification as read via API
  const origMarkRead = window.markNotifRead;
  window.markNotifRead = function(id) {
    Api.markRead(id).catch(() => {});
    if (origMarkRead) origMarkRead(id);
  };

  // Mark all notifications as read via API
  const origMarkAllRead = window.markAllNotificationsRead;
  window.markAllNotificationsRead = function() {
    Api.markAllRead().catch(() => {});
    if (origMarkAllRead) origMarkAllRead();
  };

  // Override sendChatMessage to use real API
  window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const text = input?.value?.trim();
    if (!text) return;
    
    const activeConv = AppData.conversations.find(c => c.id === AppState.activeConversation);
    if (activeConv && activeConv.conversationDbId) {
      try {
        await Api.replyInConversation(activeConv.conversationDbId, text);
      } catch (e) {}
    }
    
    if (activeConv) {
      activeConv.messages.push({
        id: Date.now(),
        sender: 'me',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      input.value = '';
      renderMessages();
    }
  };

  // ── 6. Refresh sidebar badges with real data ──
  updateSidebarBadges();

  // Re-render current page with real data
  const currentPage = window.location.hash.replace('#', '') || 'overview';
  if (typeof navigateTo === 'function') {
    setTimeout(() => navigateTo(currentPage), 100);
  }

  console.log('✅ Startup dashboard connected to backend API');
})();

// ── Helpers ──
function mapMilestoneStatus(status) {
  const map = {
    'not_started': 'Not Started',
    'in_progress': 'In Progress',
    'submitted': 'Submitted',
    'approved': 'Approved',
    'completed': 'Completed',
    'needs_revision': 'Needs Revision'
  };
  return map[status] || status;
}

function formatNotifTime(dateStr) {
  if (!dateStr) return 'Just now';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getMonthDay(dateStr) {
  if (!dateStr) return ['---', '--'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(dateStr);
  return [months[d.getMonth()], d.getDate().toString().padStart(2, '0')];
}
