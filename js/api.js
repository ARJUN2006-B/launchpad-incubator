/* ============================================================
   public/js/api.js — Shared API Client for all dashboards
============================================================ */
const API_BASE = '/api';

const Api = {
  // ── Auth ──
  getToken: () => localStorage.getItem('lp_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('lp_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('lp_token'),
  
  setAuth: (token, user) => {
    localStorage.setItem('lp_token', token);
    localStorage.setItem('lp_user', JSON.stringify(user));
  },
  
  clearAuth: () => {
    localStorage.removeItem('lp_token');
    localStorage.removeItem('lp_user');
  },

  headers: () => {
    const token = localStorage.getItem('lp_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  },

  async request(method, endpoint, body = null) {
    const opts = {
      method,
      headers: Api.headers(),
    };
    if (body) opts.body = JSON.stringify(body);
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      console.error(`API ${method} ${endpoint}:`, err.message);
      throw err;
    }
  },

  get: (endpoint) => Api.request('GET', endpoint),
  post: (endpoint, body) => Api.request('POST', endpoint, body),
  put: (endpoint, body) => Api.request('PUT', endpoint, body),
  delete: (endpoint) => Api.request('DELETE', endpoint),

  // ── Auth routes ──
  login: (email, password) => Api.post('/auth/login', { email, password }),
  register: (data) => Api.post('/auth/register', data),
  logout: async () => { await Api.post('/auth/logout'); Api.clearAuth(); },
  me: () => Api.get('/auth/me'),

  // ── Startups ──
  getMyStartup: () => Api.get('/startups/my'),
  updateMyStartup: (data) => Api.put('/startups/my', data),
  addTeamMember: (data) => Api.post('/startups/my/team', data),
  removeTeamMember: (id) => Api.delete(`/startups/my/team/${id}`),
  getActivity: () => Api.get('/startups/my/activity'),
  getPublicStartups: (params = {}) => Api.get(`/startups?${new URLSearchParams(params)}`),

  // ── Applications ──
  getMyApplication: () => Api.get('/applications/my'),
  saveApplication: (data) => Api.post('/applications', data),
  submitApplication: (id) => Api.post(`/applications/${id}/submit`),
  getPrograms: () => Api.get('/programs'),

  // ── Milestones ──
  getMilestones: () => Api.get('/milestones'),
  getMilestone: (id) => Api.get(`/milestones/${id}`),
  createMilestone: (data) => Api.post('/milestones', data),
  updateMilestone: (id, data) => Api.put(`/milestones/${id}`, data),
  toggleTask: (milestoneId, taskId, isDone) => Api.put(`/milestones/${milestoneId}/tasks/${taskId}`, { is_done: isDone }),
  submitMilestone: (id) => Api.post(`/milestones/${id}/submit`),

  // ── Documents ──
  getDocuments: (params = {}) => Api.get(`/documents?${new URLSearchParams(params)}`),
  deleteDocument: (id) => Api.delete(`/documents/${id}`),
  uploadDocumentMeta: async (name, category, size_text, file_type, version) => {
    return Api.post('/documents', { name, category, size_text, file_type, version });
  },

  // ── Meetings ──
  getMeetings: () => Api.get('/meetings'),
  requestMeeting: (data) => Api.post('/meetings', data),
  updateMeeting: (id, data) => Api.put(`/meetings/${id}`, data),
  deleteMeeting: (id) => Api.delete(`/meetings/${id}`),

  // ── Funding ──
  getFunding: () => Api.get('/funding'),
  applyFunding: (data) => Api.post('/funding', data),

  // ── Events ──
  getEvents: () => Api.get('/events'),
  getMyEventRegistrations: () => Api.get('/events/my-registrations'),
  registerEvent: (id) => Api.post(`/events/${id}/register`),
  cancelEventRegistration: (id) => Api.delete(`/events/${id}/register`),

  // ── Notifications ──
  getNotifications: () => Api.get('/notifications'),
  markRead: (id) => Api.put(`/notifications/${id}/read`),
  markAllRead: () => Api.put('/notifications/read-all'),
  deleteNotification: (id) => Api.delete(`/notifications/${id}`),

  // ── Messages ──
  getConversations: () => Api.get('/messages/conversations'),
  getMessages: (convId) => Api.get(`/messages/${convId}`),
  sendMessage: (recipientId, text) => Api.post('/messages', { recipient_id: recipientId, text }),
  replyInConversation: (convId, text) => Api.post(`/messages/conversation/${convId}`, { text }),

  // ── Investors (startup view) ──
  getInvestors: () => Api.get('/investors'),
  getInvestorInterests: () => Api.get('/investors/interests/my'),
  getOpportunities: (params = {}) => Api.get(`/investors/opportunities?${new URLSearchParams(params)}`),
  toggleWatchlist: (startupId) => Api.post(`/investors/watchlist/${startupId}`),
  showInterest: (data) => Api.post('/investors/interest', data),
  getMyInterests: () => Api.get('/investors/my-interests'),
  getWatchlist: () => Api.get('/investors/watchlist'),
  getInvestorProfile: () => Api.get('/investors/profile'),
  updateInvestorProfile: (data) => Api.put('/investors/profile', data),

  // ── Mentor ──
  getMentorProfile: () => Api.get('/mentor/profile'),
  updateMentorProfile: (data) => Api.put('/mentor/profile', data),
  getMentorStartups: () => Api.get('/mentor/startups'),
  getMentorStartup: (id) => Api.get(`/mentor/startups/${id}`),
  submitFeedback: (data) => Api.post('/mentor/feedback', data),
  submitEvaluation: (data) => Api.post('/mentor/evaluations', data),
  getAllMentors: () => Api.get('/mentor/all'),

  // ── Admin ──
  getAdminDashboard: () => Api.get('/admin/dashboard'),
  getAdminStartups: (params = {}) => Api.get(`/admin/startups?${new URLSearchParams(params)}`),
  updateAdminStartup: (id, data) => Api.put(`/admin/startups/${id}`, data),
  getAdminApplications: (params = {}) => Api.get(`/admin/applications?${new URLSearchParams(params)}`),
  reviewApplication: (id, data) => Api.put(`/admin/applications/${id}`, data),
  getAdminMentors: () => Api.get('/admin/mentors'),
  assignMentor: (data) => Api.post('/admin/mentor/assign', data),
  getAdminInvestors: () => Api.get('/admin/investors'),
  verifyInvestor: (id, verified) => Api.put(`/admin/investors/${id}/verify`, { verified }),
  getAdminUsers: () => Api.get('/admin/users'),
  getAdminPrograms: () => Api.get('/admin/programs'),
  createProgram: (data) => Api.post('/admin/programs', data),
  getReports: () => Api.get('/admin/reports/summary'),
  globalSearch: (q) => Api.get(`/search?q=${encodeURIComponent(q)}`),

  // ── Helper ──
  redirectToDashboard: (role) => {
    const routes = {
      startup: '/dashboard/startup',
      mentor: '/dashboard/mentor',
      investor: '/dashboard/investor',
      admin: '/dashboard/admin'
    };
    window.location.href = routes[role] || '/';
  },

  requireAuth: (allowedRoles = []) => {
    if (!Api.isLoggedIn()) { window.location.href = '/login'; return false; }
    const user = Api.getUser();
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      Api.redirectToDashboard(user?.role);
      return false;
    }
    return user;
  }
};

// Upload document with actual file
Api.uploadDocument = async (file, category, version) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('version', version || 'v1.0');

  const token = Api.getToken();
  const res = await fetch('/api/documents', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
};

window.Api = Api;
