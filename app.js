/* ============================================================
   app.js — Core Application Logic (Routing, State, UI)
============================================================ */

// --- Routing System ---
function initRouter() {
  const handleHashChange = () => {
    let hash = window.location.hash.substring(1) || 'overview';
    
    // Fallback if hash doesn't match a page
    if(!document.getElementById(`page-${hash}`)) {
      hash = 'overview';
    }
    
    // Update State
    AppState.currentPage = hash;
    
    // Update Sidebar UI
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('active'));
    const activeNav = document.querySelector(`[data-nav="${hash}"]`);
    if(activeNav) activeNav.classList.add('active');
    
    // Hide all pages, show active
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${hash}`).classList.add('active');
    
    // Render specific page
    renderPage(hash);
    
    // Scroll to top
    document.getElementById('contentArea').scrollTop = 0;
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // Initial load
}

window.navigateTo = function(pageId) {
  window.location.hash = pageId;
};

// --- Page Renderer Router ---
function renderPage(pageId) {
  switch(pageId) {
    case 'overview': renderOverview(); break;
    case 'startup': renderStartup(); break;
    case 'journey': renderJourney(); break;
    case 'mentor': renderMentor(); break;
    case 'milestones': renderMilestones(); break;
    case 'documents': renderDocuments(); break;
    case 'funding': renderFunding(); break;
    case 'investors': renderInvestors(); break;
    case 'meetings': renderMeetings(); break;
    case 'events': renderEvents(); break;
    case 'messages': renderMessages(); break;
    case 'notifications': renderNotifications(); break;
    case 'settings': renderSettings(); break;
    case 'profile': renderProfile(); break;
  }
}

// --- UI Interactions ---

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const mainArea = document.getElementById('mainArea');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
  mainArea.classList.toggle('expanded');
  sidebarToggle.classList.toggle('exp');
});

// Navigation Click
document.querySelectorAll('[data-nav]').forEach(item => {
  item.addEventListener('click', () => {
    navigateTo(item.dataset.nav);
    if(window.innerWidth <= 768) {
      sidebar.classList.remove('expanded');
      mainArea.classList.remove('expanded');
      sidebarToggle.classList.remove('exp');
    }
  });
});

// Dropdowns
function setupDropdown(btnId, ddId) {
  const btn = document.getElementById(btnId);
  const dd = document.getElementById(ddId);
  if(!btn || !dd) return;
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dd.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    if(!isOpen) dd.classList.add('open');
  });
}
setupDropdown('notifBtn', 'notifDd');
setupDropdown('avatarBtn', 'avatarDd');

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
});

// Search Bar
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if(searchBar.classList.contains('open')) searchInput.focus();
});

// FAB Menu
const fabMain = document.getElementById('fabMain');
const fabActions = document.getElementById('fabActions');
fabMain.addEventListener('click', () => {
  fabMain.classList.toggle('open');
  fabActions.classList.toggle('open');
});

// Modals
window.openModal = function(id) {
  document.getElementById(id).classList.add('open');
  // Close FAB and Dropdowns if open
  fabMain.classList.remove('open');
  fabActions.classList.remove('open');
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
};

window.closeModal = function(id) {
  document.getElementById(id).classList.remove('open');
};

document.getElementById('createBtn').addEventListener('click', () => {
  openModal('createModal');
});

// Toast System
let toastTimeout;
window.showToast = function(text, icon = '✓') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-icon').innerText = icon;
  document.getElementById('toast-text').innerText = text;
  
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// --- Form Submissions (Simulated) ---
window.handleFileUpload = function(input) {
  if(input.files && input.files[0]) {
    document.getElementById('docNameInput').value = input.files[0].name;
    document.getElementById('uploadDropZone').innerHTML = `<div class="drop-zone-icon" style="opacity:1;color:var(--teal)">📄</div><div style="font-size:14px;font-weight:600;color:var(--teal)">${input.files[0].name} selected</div>`;
    document.getElementById('uploadDropZone').style.borderColor = 'var(--teal)';
  }
};

window.submitDocUpload = function() {
  const name = document.getElementById('docNameInput').value;
  if(!name) { showToast('Please select a file', '❌'); return; }
  
  const cat = document.getElementById('docCatSelect').value;
  
  // Add to AppState
  AppState.documents.unshift({
    id: Date.now(),
    name: name,
    type: name.split('.').pop() || 'pdf',
    category: cat,
    size: '1.2 MB',
    date: 'Just now',
    version: 'v1.0',
    status: 'In Review',
    icon: '📄',
    color: '#6C63FF'
  });
  
  closeModal('uploadDocModal');
  showToast('Document uploaded successfully', '📄');
  if(AppState.currentPage === 'documents') renderDocuments();
};

window.submitMeetingRequest = function() {
  closeModal('requestMeetingModal');
  showToast('Meeting request sent', '📅');
};

window.submitFundingApp = function() {
  closeModal('applyFundingModal');
  showToast('Funding application submitted', '💰');
  if(AppState.currentPage === 'funding') renderFunding();
};

window.addTeamMember = function() {
  const name = document.getElementById('newMemberName').value;
  const role = document.getElementById('newMemberRole').value;
  const skills = document.getElementById('newMemberSkills').value.split(',').map(s=>s.trim());
  
  if(!name || !role) { showToast('Please enter name and role', '❌'); return; }
  
  AppState.teamMembers.push({
    name, role, skills: skills[0] ? skills : ['Team Member'],
    color: '#6C63FF', initials: name.substring(0,2).toUpperCase()
  });
  
  closeModal('addTeamModal');
  showToast('Team member added', '👤');
  if(AppState.currentPage === 'startup') renderStartup();
};

// Overview Task Toggle
window.toggleOverviewTask = function(idx) {
  const task = AppData.milestones[3].tasks[idx];
  task.done = !task.done;
  renderOverview();
  showToast(task.done ? 'Task completed' : 'Task unmarked', '✅');
};

// Milestone Task Toggle
window.toggleMsTask = function(msId, tIdx, el) {
  const ms = AppData.milestones.find(m => m.id === msId);
  if(ms) {
    ms.tasks[tIdx].done = !ms.tasks[tIdx].done;
    
    // Recalculate progress
    const total = ms.tasks.length;
    const done = ms.tasks.filter(t => t.done).length;
    ms.progress = Math.round((done / total) * 100);
    
    renderMilestones();
    showToast(ms.tasks[tIdx].done ? 'Task completed' : 'Task unmarked', '✅');
  }
};

// Journey Stage Toggle
window.toggleJourneyStage = function(el) {
  const isExp = el.classList.contains('expanded');
  document.querySelectorAll('.jstage').forEach(s => s.classList.remove('expanded'));
  if(!isExp) el.classList.add('expanded');
};


// --- Global Data Updates ---
window.updateSidebarBadges = function() {
  // Notifications
  const unreadNotif = AppState.notifications.filter(n => !n.read).length;
  const badgeNotif = document.querySelector('[data-badge="notifications"]');
  if(badgeNotif) {
    badgeNotif.innerText = unreadNotif;
    badgeNotif.style.display = unreadNotif > 0 ? 'block' : 'none';
  }
  
  // Header Bell
  const headerBell = document.getElementById('notifBadge');
  if(headerBell) headerBell.style.display = unreadNotif > 0 ? 'block' : 'none';
  
  // Header dropdown list
  const ddList = document.getElementById('headerNotifList');
  if(ddList) {
    const recent = AppState.notifications.slice(0, 5);
    ddList.innerHTML = recent.length > 0 ? recent.map(n => `
      <div class="dd-item" style="${!n.read ? 'background:rgba(108,99,255,0.06)' : ''}" onclick="handleNotifClick(${n.id}, '${n.link}')">
        <div style="font-size:16px">${n.icon}</div>
        <div style="flex:1">
          <div style="font-size:12.5px;color:var(--txt-primary);margin-bottom:2px">${n.title}</div>
          <div style="font-size:10.5px;color:var(--txt-muted)">${n.time}</div>
        </div>
      </div>
    `).join('') : '<div style="padding:20px;text-align:center;color:var(--txt-muted)">No notifications</div>';
  }
  
  // Messages
  const badgeMsg = document.querySelector('[data-badge="messages"]');
  if(badgeMsg) {
    badgeMsg.innerText = AppState.unreadMessages;
    badgeMsg.style.display = AppState.unreadMessages > 0 ? 'block' : 'none';
  }
};

document.getElementById('markAllReadBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  markAllNotificationsRead();
  if(AppState.currentPage === 'notifications') renderNotifications();
});

// --- Bootstrapper ---
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarBadges();
  initRouter();
  console.log("LaunchPad Dashboard Loaded");
});
