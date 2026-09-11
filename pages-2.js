/* ============================================================
   pages-2.js — Render functions for Pages 8 to 14
============================================================ */

// 8. INVESTOR HUB
function renderInvestors() {
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Investor Hub</div><div class="page-subtitle">Connect with top VCs and angel investors looking for startups like yours.</div></div>
      
      <div class="inv-hub-layout">
        <div class="inv-filter-panel">
          <div class="doc-search" style="margin-bottom:20px;width:100%">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--txt-muted)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search investors..."/>
          </div>
          
          <div class="filter-section">
            <div class="filter-title">Investment Sector</div>
            <label class="filter-opt"><input type="checkbox" checked/> AgriTech</label>
            <label class="filter-opt"><input type="checkbox" checked/> Artificial Intelligence</label>
            <label class="filter-opt"><input type="checkbox"/> FinTech</label>
            <label class="filter-opt"><input type="checkbox"/> B2B SaaS</label>
            <label class="filter-opt"><input type="checkbox"/> DeepTech</label>
          </div>
          
          <div class="filter-section">
            <div class="filter-title">Funding Stage</div>
            <label class="filter-opt"><input type="checkbox" checked/> Pre-Seed</label>
            <label class="filter-opt"><input type="checkbox" checked/> Seed</label>
            <label class="filter-opt"><input type="checkbox"/> Series A</label>
            <label class="filter-opt"><input type="checkbox"/> Series B+</label>
          </div>
          
          <div class="filter-section" style="margin-bottom:0">
            <div class="filter-title">Investor Type</div>
            <label class="filter-opt"><input type="checkbox" checked/> Venture Capital</label>
            <label class="filter-opt"><input type="checkbox" checked/> Angel Network</label>
            <label class="filter-opt"><input type="checkbox"/> Micro VC</label>
          </div>
        </div>
        
        <div>
          <div class="card" style="margin-bottom:24px;padding:18px 22px">
            <div style="font-family:'Space Grotesk';font-size:16px;font-weight:700;margin-bottom:6px">Investor Interest</div>
            <div style="font-size:13px;color:var(--txt-secondary);margin-bottom:14px">Investors who have recently engaged with your profile.</div>
            <table class="fund-app-table interest-table" style="background:transparent">
              <tbody>
                <tr><td><div class="inv-logo" style="background:rgba(108,99,255,0.12);color:#6C63FF;width:24px;height:24px;font-size:10px;border-radius:6px">TV</div> <strong>TechVentures</strong></td><td>Viewed Pitch Deck (3x)</td><td>Aug 27</td><td><button class="btn btn-secondary btn-xs" onclick="navigateTo('messages')">Message</button></td></tr>
                <tr><td><div class="inv-logo" style="background:rgba(0,212,170,0.12);color:#00D4AA;width:24px;height:24px;font-size:10px;border-radius:6px">GC</div> <strong>Green Capital</strong></td><td>Saved Profile</td><td>Aug 23</td><td><button class="btn btn-secondary btn-xs" onclick="showToast('Connection request sent','🤝')">Connect</button></td></tr>
              </tbody>
            </table>
          </div>
          
          <div class="inv-cards-grid">
            ${AppData.investors.map(inv => `
              <div class="inv-card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <div class="inv-big-logo" style="background:${inv.bg};color:${inv.color}">${inv.initials}</div>
                  <span class="tag tag-muted" style="border:1px solid ${inv.statusBg};background:${inv.statusBg};color:${inv.statusColor}">${inv.status}</span>
                </div>
                <div class="inv-name">${inv.name}</div>
                <div class="inv-type">${inv.type} · ${inv.stage}</div>
                <div class="inv-tags">
                  ${inv.focus.map(f => `<span class="tag tag-muted">${f}</span>`).join('')}
                </div>
                <div style="font-size:12px;color:var(--txt-secondary);margin-bottom:16px;display:flex;align-items:center;gap:6px">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Check Size: ${inv.range}
                </div>
                <div class="inv-actions">
                  <button class="btn btn-primary btn-sm" style="flex:1" onclick="showToast('Connection request sent','🤝')">Connect</button>
                  <button class="btn btn-secondary btn-sm" style="flex:1" onclick="showInvestorModal(${inv.id})">Profile</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-investors').innerHTML = html;
}

window.showInvestorModal = function(id) {
  const inv = AppData.investors.find(i => i.id === id);
  if(!inv) return;
  document.getElementById('invModalTitle').innerText = inv.name;
  document.getElementById('invModalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div class="inv-big-logo" style="background:${inv.bg};color:${inv.color};width:64px;height:64px;font-size:20px">${inv.initials}</div>
      <div>
        <div style="font-family:'Space Grotesk';font-size:20px;font-weight:700">${inv.name}</div>
        <div style="font-size:13px;color:var(--txt-secondary)">${inv.type} · ${inv.website}</div>
      </div>
    </div>
    <div style="font-size:13.5px;line-height:1.6;margin-bottom:20px">${inv.description}</div>
    <div class="info-row"><div class="info-label">Investment Range</div><div class="info-value" style="font-weight:600">${inv.range}</div></div>
    <div class="info-row"><div class="info-label">Preferred Stage</div><div class="info-value">${inv.stage}</div></div>
    <div class="info-row"><div class="info-label">Portfolio Size</div><div class="info-value">${inv.portfolio} active companies</div></div>
    <div class="info-row"><div class="info-label">Key Contact</div><div class="info-value">${inv.contact}</div></div>
    <div class="section-row" style="margin-top:20px;margin-bottom:10px"><div class="section-label">Focus Areas</div></div>
    <div class="inv-tags" style="margin-bottom:24px">
      ${inv.focus.map(f => `<span class="tag tag-muted">${f}</span>`).join('')}
    </div>
    <div class="modal-footer" style="margin-top:0">
      <button class="btn btn-secondary" onclick="closeModal('investorProfileModal')">Close</button>
      <button class="btn btn-primary" onclick="closeModal('investorProfileModal');showToast('Connection request sent to ${inv.name}','🤝')">Send Connection Request</button>
    </div>
  `;
  openModal('investorProfileModal');
};

// 9. MEETINGS PAGE
function renderMeetings() {
  const allM = AppState.meetings;
  const upcoming = allM.filter(m => !m.past);
  const past = allM.filter(m => m.past);
  
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header-row"><div class="page-header"><div class="page-title">Meetings & Schedule</div><div class="page-subtitle">Manage your calendar with mentors, investors, and admins.</div></div><button class="btn btn-primary" onclick="openModal('requestMeetingModal')">Request Meeting</button></div>
      
      <div class="meetings-layout">
        <div>
          <div class="tabs">
            <button class="tab active" data-target="mtg-upcoming">Upcoming (${upcoming.length})</button>
            <button class="tab" data-target="mtg-past">Past Meetings (${past.length})</button>
            <button class="tab" data-target="mtg-requests">Requests (0)</button>
          </div>
          
          <div id="mtg-upcoming" class="tab-content active">
            ${upcoming.map(m => `
              <div class="meeting-card">
                <div class="meeting-card-header">
                  <div class="meeting-date-box" style="padding:10px 14px;background:rgba(108,99,255,0.08);border-color:transparent">
                    <div class="meeting-mo">${m.month}</div>
                    <div class="meeting-dy" style="font-size:22px">${m.day}</div>
                  </div>
                  <div style="flex:1">
                    <div class="meeting-type-badge" style="background:${m.color}22;color:${m.color}">${m.type}</div>
                    <div style="font-family:'Space Grotesk';font-size:16px;font-weight:700;margin-bottom:4px">${m.title}</div>
                    <div style="font-size:13px;color:var(--txt-secondary);margin-bottom:8px">With <strong>${m.with}</strong> (${m.role})</div>
                    <div style="display:flex;align-items:center;gap:12px;font-size:12px;color:var(--txt-secondary)">
                      <span style="display:flex;align-items:center;gap:4px"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${m.time}</span>
                      <span style="display:flex;align-items:center;gap:4px"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ${m.status}</span>
                    </div>
                  </div>
                </div>
                <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:var(--radius-sm);font-size:12.5px;color:var(--txt-secondary);margin-bottom:14px;border:1px dashed var(--border)">
                  ${m.notes}
                </div>
                <div style="display:flex;gap:10px">
                  <button class="btn btn-primary btn-sm" onclick="showToast('Meeting joined successfully','📹')">Join Meeting</button>
                  <button class="btn btn-secondary btn-sm" onclick="showToast('Reschedule request sent','📅')">Reschedule</button>
                  <button class="btn btn-secondary btn-sm" onclick="showToast('Meeting cancelled','❌')">Cancel</button>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div id="mtg-past" class="tab-content">
            ${past.map(m => `
              <div class="meeting-card" style="opacity:0.8">
                <div class="meeting-card-header">
                  <div class="meeting-date-box" style="padding:10px 14px;background:rgba(255,255,255,0.04);border-color:transparent;color:var(--txt-muted)">
                    <div class="meeting-mo">${m.month}</div>
                    <div class="meeting-dy" style="font-size:22px">${m.day}</div>
                  </div>
                  <div style="flex:1">
                    <div class="meeting-type-badge" style="background:rgba(255,255,255,0.05);color:var(--txt-muted)">${m.type}</div>
                    <div style="font-family:'Space Grotesk';font-size:16px;font-weight:700;margin-bottom:4px;color:var(--txt-muted)">${m.title}</div>
                    <div style="font-size:13px;color:var(--txt-secondary);margin-bottom:8px">With <strong>${m.with}</strong> (${m.role})</div>
                  </div>
                </div>
                <div style="background:rgba(255,255,255,0.02);padding:12px 14px;border-radius:var(--radius-sm);font-size:12.5px;color:var(--txt-secondary);margin-bottom:14px;border:1px solid var(--border)">
                  <strong>Notes:</strong> ${m.notes}
                </div>
                <div style="display:flex;gap:10px">
                  <button class="btn btn-secondary btn-sm">View Full Notes</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div id="mtg-requests" class="tab-content">
            <div style="padding:40px;text-align:center;color:var(--txt-muted);background:var(--bg-card);border:1px dashed var(--border);border-radius:var(--radius)">No pending meeting requests.</div>
          </div>
        </div>
        
        <div class="mini-cal">
          <div class="cal-header">
            <button class="icon-btn" style="width:28px;height:28px"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div style="font-family:'Space Grotesk';font-weight:700">August 2024</div>
            <button class="icon-btn" style="width:28px;height:28px"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
          <div class="cal-grid">
            <div class="cal-day-name">Su</div><div class="cal-day-name">Mo</div><div class="cal-day-name">Tu</div><div class="cal-day-name">We</div><div class="cal-day-name">Th</div><div class="cal-day-name">Fr</div><div class="cal-day-name">Sa</div>
            <div class="cal-day other-month">28</div><div class="cal-day other-month">29</div><div class="cal-day other-month">30</div><div class="cal-day other-month">31</div><div class="cal-day">1</div><div class="cal-day">2</div><div class="cal-day">3</div>
            <div class="cal-day">4</div><div class="cal-day">5</div><div class="cal-day">6</div><div class="cal-day">7</div><div class="cal-day">8</div><div class="cal-day">9</div><div class="cal-day">10</div>
            <div class="cal-day">11</div><div class="cal-day">12</div><div class="cal-day">13</div><div class="cal-day">14</div><div class="cal-day">15</div><div class="cal-day">16</div><div class="cal-day">17</div>
            <div class="cal-day">18</div><div class="cal-day">19</div><div class="cal-day">20</div><div class="cal-day">21</div><div class="cal-day">22</div><div class="cal-day">23</div><div class="cal-day">24</div>
            <div class="cal-day">25</div><div class="cal-day">26</div><div class="cal-day">27</div><div class="cal-day today">28</div><div class="cal-day has-event">29</div><div class="cal-day has-event">30</div><div class="cal-day">31</div>
          </div>
          
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
            <div style="font-size:11px;font-weight:700;color:var(--txt-muted);text-transform:uppercase;margin-bottom:12px">Sync Calendars</div>
            <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:flex-start;margin-bottom:8px">📅 Google Calendar Sync</button>
            <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:flex-start">📅 Outlook Calendar Sync</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-meetings').innerHTML = html;
  
  // Tab Logic
  const tabs = document.getElementById('page-meetings').querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('page-meetings').querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

// 10. EVENTS PAGE
function renderEvents() {
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Events & Community</div><div class="page-subtitle">Workshops, pitch days, and networking opportunities.</div></div>
      
      <div class="tabs" style="margin-bottom:24px">
        <button class="tab active">All Events</button>
        <button class="tab">Workshops</button>
        <button class="tab">Pitch Days</button>
        <button class="tab">Investor Meets</button>
        <button class="tab">Registered (2)</button>
      </div>
      
      <div class="events-grid">
        ${AppData.events.map(ev => `
          <div class="event-card">
            <div class="event-banner" style="background:${ev.color}">
              <div class="event-banner-label" style="background:${ev.tagColor};color:#fff">${ev.type}</div>
              ${ev.emoji}
            </div>
            <div class="event-body">
              <div class="event-title">${ev.title}</div>
              <div class="event-meta">
                <span class="event-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> ${ev.date}</span>
                <span class="event-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${ev.time}</span>
              </div>
              <div class="event-desc">${ev.desc}</div>
              <div style="font-size:11px;color:var(--txt-secondary);margin-bottom:14px">Host: <strong>${ev.host}</strong></div>
              <div class="event-footer">
                <div class="seats-badge">${ev.seats === 0 ? '<span style="color:var(--red);font-weight:600">Event Full</span>' : (ev.registered ? '<span style="color:var(--teal);font-weight:600">✓ Registered</span>' : `${ev.seats} seats left`)}</div>
                ${ev.registered 
                  ? `<button class="btn btn-secondary btn-xs" onclick="showEventModal(${ev.id})">View Details</button>`
                  : `<button class="btn btn-primary btn-xs" ${ev.seats === 0 ? 'disabled style="opacity:0.5"' : ''} onclick="showEventModal(${ev.id})">Register</button>`
                }
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('page-events').innerHTML = html;
}

window.showEventModal = function(id) {
  const ev = AppData.events.find(e => e.id === id);
  if(!ev) return;
  document.getElementById('eventModalTitle').innerText = ev.title;
  
  let btnText = ev.registered ? 'Cancel Registration' : (ev.seats === 0 ? 'Waitlist' : 'Register Now');
  let btnClass = ev.registered ? 'btn-danger' : 'btn-primary';
  let btnOnclick = ev.registered ? `closeModal('eventDetailModal');showToast('Registration cancelled','❌')` : `closeModal('eventDetailModal');showToast('Registered for ${ev.title}','🎟️')`;
  
  document.getElementById('eventRegisterBtn').className = `btn ${btnClass}`;
  document.getElementById('eventRegisterBtn').innerText = btnText;
  document.getElementById('eventRegisterBtn').setAttribute('onclick', btnOnclick);
  
  document.getElementById('eventModalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span class="tag" style="background:${ev.tagColor}22;color:${ev.tagColor}">${ev.type}</span>
      <span style="font-size:12px;color:var(--txt-secondary)">Host: ${ev.host}</span>
    </div>
    <div class="info-row"><div class="info-label">Date & Time</div><div class="info-value">${ev.date} · ${ev.time}</div></div>
    <div class="info-row"><div class="info-label">Location</div><div class="info-value">${ev.location}</div></div>
    <div class="info-row" style="border-bottom:none"><div class="info-label">Availability</div><div class="info-value">${ev.seats} of ${ev.total} seats remaining</div></div>
    <div style="font-size:13.5px;line-height:1.6;margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">${ev.desc}</div>
    ${ev.registered ? `<div style="margin-top:20px;padding:12px;background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.3);border-radius:var(--radius-sm);color:var(--teal);font-size:12.5px;display:flex;align-items:center;gap:8px">✓ You are registered for this event. A calendar invite has been sent to your email.</div>` : ''}
  `;
  openModal('eventDetailModal');
};

// 11. MESSAGES PAGE
function renderMessages() {
  const convs = AppData.conversations;
  const activeConv = convs.find(c => c.id === AppState.activeConversation) || convs[0];
  
  let html = `
    <div class="messages-shell fade-up">
      <div class="conv-list">
        <div class="conv-search">
          <div class="conv-search-inner"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--txt-muted)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Search messages..."/></div>
        </div>
        <div class="conv-items">
          ${convs.map(c => `
            <div class="conv-item ${c.id === AppState.activeConversation ? 'active-conv' : ''}" onclick="loadConversation(${c.id})">
              <div class="conv-av" style="background:${c.color}22;color:${c.color}">
                ${c.initials}
                ${c.online ? '<div class="conv-online-dot"></div>' : ''}
              </div>
              <div style="flex:1;overflow:hidden">
                <div class="conv-name">${c.name}</div>
                <div class="conv-preview" style="${c.unread > 0 ? 'color:var(--txt-primary);font-weight:600' : ''}">${c.messages[c.messages.length-1].text}</div>
              </div>
              <div class="conv-time">${c.messages[c.messages.length-1].time.split(', ')[0]}</div>
              ${c.unread > 0 ? `<div class="conv-unread">${c.unread}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="chat-area">
        <div class="chat-header">
          <div class="conv-av" style="background:${activeConv.color}22;color:${activeConv.color}">
            ${activeConv.initials}
            ${activeConv.online ? '<div class="conv-online-dot"></div>' : ''}
          </div>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:700;font-family:'Space Grotesk'">${activeConv.name}</div>
            <div style="font-size:11.5px;color:var(--txt-secondary)">${activeConv.role} · ${activeConv.online ? 'Online' : 'Offline'}</div>
          </div>
          <button class="icon-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
        </div>
        
        <div class="chat-messages" id="chatMessagesBox">
          <div style="text-align:center;font-size:11px;color:var(--txt-muted);margin-bottom:10px">Conversation started in August 2024</div>
          ${activeConv.messages.map(m => `
            <div class="msg-group ${m.sender === 'me' ? 'sent' : 'received'}">
              <div class="msg-av" style="${m.sender === 'me' ? 'background:linear-gradient(135deg,var(--accent),var(--teal));color:#fff' : `background:${activeConv.color}22;color:${activeConv.color}`}">${m.sender === 'me' ? 'A' : activeConv.initials}</div>
              <div class="msg-bubbles">
                <div class="msg-bubble">${m.text}</div>
                <div class="msg-time">${m.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="chat-input-area">
          <div class="chat-input-wrap">
            <button class="icon-btn" style="border:none;background:transparent;width:24px;height:24px" title="Attach file"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
            <textarea id="chatInput" placeholder="Type a message..." rows="1" oninput="this.style.height='';this.style.height=this.scrollHeight+'px'" onkeypress="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();sendChatMessage();}"></textarea>
            <div class="chat-actions">
              <button class="icon-btn" style="border:none;background:transparent;width:24px;height:24px" title="Emoji"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
              <button class="btn btn-primary btn-sm" style="border-radius:50%;width:32px;height:32px;padding:0;display:flex;align-items:center;justify-content:center" onclick="sendChatMessage()"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contact-panel">
        <div style="text-align:center">
          <div class="contact-av-lg" style="background:${activeConv.color}22;color:${activeConv.color}">${activeConv.initials}</div>
          <div style="font-family:'Space Grotesk';font-size:18px;font-weight:700">${activeConv.name}</div>
          <div style="font-size:13px;color:var(--txt-secondary);margin:4px 0 12px">${activeConv.role}</div>
          <button class="btn btn-secondary btn-sm" style="width:100%" onclick="openModal('requestMeetingModal')">Request Meeting</button>
        </div>
        
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--txt-muted);margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:6px">Shared Files</div>
          ${activeConv.sharedFiles.map(f => `
            <div class="shared-file" onclick="showToast('Downloading ${f}','⬇️')">
              <span style="font-size:16px">📄</span>
              <span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f}</span>
            </div>
          `).join('')}
          ${activeConv.sharedFiles.length === 0 ? '<div style="font-size:12px;color:var(--txt-muted)">No files shared yet</div>' : ''}
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-messages').innerHTML = html;
  setTimeout(() => {
    const box = document.getElementById('chatMessagesBox');
    if(box) box.scrollTop = box.scrollHeight;
  }, 10);
}

window.loadConversation = function(id) {
  AppState.activeConversation = id;
  // Mark read
  const conv = AppData.conversations.find(c => c.id === id);
  if(conv) {
    if(conv.unread > 0) {
      AppState.unreadMessages -= conv.unread;
      conv.unread = 0;
      updateSidebarBadges();
    }
  }
  renderMessages();
};

window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  
  const conv = AppData.conversations.find(c => c.id === AppState.activeConversation);
  if(conv) {
    conv.messages.push({
      id: Date.now(),
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    input.value = '';
    renderMessages();
  }
};

// 12. NOTIFICATIONS PAGE
function renderNotifications() {
  let html = `
    <div class="page-inner fade-up" style="max-width:800px;margin:0 auto">
      <div class="page-header-row"><div class="page-header"><div class="page-title">Notifications</div><div class="page-subtitle">Updates, alerts, and activity related to your startup.</div></div><button class="btn btn-secondary" onclick="markAllNotificationsRead();renderNotifications()">Mark all as read</button></div>
      
      <div class="card" style="padding:0;overflow:hidden">
        <div class="tabs" style="border:none;border-bottom:1px solid var(--border);border-radius:0;padding:12px 20px;margin:0">
          <button class="tab active">All</button>
          <button class="tab">Unread (${AppState.notifications.filter(n=>!n.read).length})</button>
          <button class="tab">Milestones</button>
          <button class="tab">Messages</button>
        </div>
        <div class="notif-list">
          ${AppState.notifications.map(n => {
            let color = '#7B89A0'; let bg = 'rgba(255,255,255,0.05)';
            if(n.type === 'milestone') { color = '#00D4AA'; bg = 'rgba(0,212,170,0.12)'; }
            else if(n.type === 'investor' || n.type === 'funding') { color = '#FFB830'; bg = 'rgba(255,184,48,0.12)'; }
            else if(n.type === 'mentor' || n.type === 'meeting') { color = '#6C63FF'; bg = 'rgba(108,99,255,0.12)'; }
            
            return `
              <div class="notif-entry ${n.read ? '' : 'unread'}" onclick="handleNotifClick(${n.id}, '${n.link}')">
                <div class="notif-type-icon" style="background:${bg};color:${color}">${n.icon}</div>
                <div class="notif-content">
                  <div class="notif-text">${n.text}</div>
                  <div class="notif-meta">${n.time}</div>
                </div>
                <div class="notif-actions">
                  ${!n.read ? `<button class="icon-btn" style="width:28px;height:28px" title="Mark as read" onclick="event.stopPropagation();markNotifRead(${n.id});renderNotifications()"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>` : ''}
                  <button class="icon-btn" style="width:28px;height:28px" title="Delete" onclick="event.stopPropagation();deleteNotif(${n.id});renderNotifications()"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </div>
              </div>
            `;
          }).join('')}
          ${AppState.notifications.length === 0 ? '<div style="padding:40px;text-align:center;color:var(--txt-muted)">No notifications found.</div>' : ''}
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-notifications').innerHTML = html;
}

window.handleNotifClick = function(id, link) {
  markNotifRead(id);
  navigateTo(link);
};

window.markNotifRead = function(id) {
  const n = AppState.notifications.find(n => n.id === id);
  if(n && !n.read) {
    n.read = true;
    updateSidebarBadges();
  }
};

window.deleteNotif = function(id) {
  AppState.notifications = AppState.notifications.filter(n => n.id !== id);
  updateSidebarBadges();
};

window.markAllNotificationsRead = function() {
  AppState.notifications.forEach(n => n.read = true);
  updateSidebarBadges();
};

// 13. SETTINGS PAGE
function renderSettings() {
  const s = AppState.settings;
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Settings</div><div class="page-subtitle">Manage your account preferences and security.</div></div>
      
      <div class="settings-layout">
        <div class="settings-nav">
          <div class="settings-nav-item active">👤 Profile Settings</div>
          <div class="settings-nav-item">🏢 Startup Settings</div>
          <div class="settings-nav-item">🔔 Notifications</div>
          <div class="settings-nav-item">🔒 Security</div>
        </div>
        
        <div>
          <div class="settings-section">
            <div class="settings-section-title">Profile Settings</div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" value="${AppData.user.name}"/></div>
              <div class="form-group"><label class="form-label">Email Address</label><input class="form-input" type="email" value="${AppData.user.email}"/></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Phone Number</label><input class="form-input" value="${AppData.user.phone}"/></div>
              <div class="form-group"><label class="form-label">Role in Startup</label><input class="form-input" value="${AppData.user.role}"/></div>
            </div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">LinkedIn Profile</label><input class="form-input" value="${AppData.user.linkedin}"/></div>
            <div style="margin-top:20px"><button class="btn btn-primary" onclick="showToast('Profile updated','✅')">Save Profile</button></div>
          </div>
          
          <div class="settings-section">
            <div class="settings-section-title">Startup Visibility Settings</div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Public Startup Profile</div><div class="toggle-desc">Allow your startup to be visible in the public directory.</div></div>
              <label class="toggle"><input type="checkbox" ${s.startup.publicProfile ? 'checked' : ''} onchange="toggleSetting('startup','publicProfile',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Investor Access</div><div class="toggle-desc">Allow verified investors to view your pitch deck and documents.</div></div>
              <label class="toggle"><input type="checkbox" ${s.startup.investorAccess ? 'checked' : ''} onchange="toggleSetting('startup','investorAccess',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Show Journey Progress</div><div class="toggle-desc">Display your milestone progress to program mentors.</div></div>
              <label class="toggle"><input type="checkbox" ${s.startup.progressVisible ? 'checked' : ''} onchange="toggleSetting('startup','progressVisible',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="settings-section-title">Notification Preferences</div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Email Notifications</div><div class="toggle-desc">Receive important updates via email.</div></div>
              <label class="toggle"><input type="checkbox" ${s.notifications.email ? 'checked' : ''} onchange="toggleSetting('notifications','email',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Meeting Reminders</div><div class="toggle-desc">Get notified 15 minutes before meetings.</div></div>
              <label class="toggle"><input type="checkbox" ${s.notifications.meetings ? 'checked' : ''} onchange="toggleSetting('notifications','meetings',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
            <div class="toggle-wrap">
              <div class="toggle-info"><div class="toggle-title">Funding Updates</div><div class="toggle-desc">Alerts regarding grant applications and investor interest.</div></div>
              <label class="toggle"><input type="checkbox" ${s.notifications.funding ? 'checked' : ''} onchange="toggleSetting('notifications','funding',this.checked)"/><span class="toggle-slider"></span></label>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="settings-section-title">Security & Sessions</div>
            <div class="form-row" style="margin-bottom:24px">
              <div class="form-group" style="margin-bottom:0"><label class="form-label">Current Password</label><input class="form-input" type="password" placeholder="••••••••"/></div>
              <div class="form-group" style="margin-bottom:0"><label class="form-label">New Password</label><input class="form-input" type="password" placeholder="Enter new password"/></div>
            </div>
            <button class="btn btn-secondary btn-sm" style="margin-bottom:24px" onclick="showToast('Password updated successfully','🔒')">Update Password</button>
            
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--txt-muted);margin-bottom:12px">Active Sessions</div>
            <div class="session-entry">
              <div class="session-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg></div>
              <div style="flex:1"><div style="font-size:13px;font-weight:600">Windows 11 • Chrome</div><div style="font-size:11px;color:var(--txt-secondary)">Bangalore, India • Active now</div></div>
              <span class="tag tag-teal">Current Session</span>
            </div>
            <div class="session-entry">
              <div class="session-icon-wrap" style="background:rgba(255,255,255,0.05)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--txt-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <div style="flex:1"><div style="font-size:13px;font-weight:600">iPhone 14 • Safari</div><div style="font-size:11px;color:var(--txt-secondary)">Bangalore, India • Last active 2h ago</div></div>
              <button class="btn btn-secondary btn-xs" onclick="showToast('Session revoked','🔒')">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-settings').innerHTML = html;
}

window.toggleSetting = function(category, setting, value) {
  AppState.settings[category][setting] = value;
  showToast('Setting updated', '⚙️');
};

// 14. USER PROFILE PAGE
function renderProfile() {
  const u = AppData.user;
  const s = AppData.startup;
  let html = `
    <div class="page-inner fade-up" style="max-width:900px;margin:0 auto">
      <div class="page-header-row"><div class="page-header"><div class="page-title">Founder Profile</div></div><button class="btn btn-secondary" onclick="navigateTo('settings')">Edit Profile</button></div>
      
      <div class="profile-hero">
        <div class="profile-big-av">${u.avatar}</div>
        <div style="font-family:'Space Grotesk';font-size:28px;font-weight:700;margin-bottom:4px">${u.name}</div>
        <div style="font-size:14px;color:var(--txt-secondary);margin-bottom:12px">${u.role} at ${s.name}</div>
        <div style="display:flex;justify-content:center;gap:8px">
          <span class="tag tag-muted">📍 ${u.location}</span>
          <span class="tag tag-accent">🎓 Cohort ${s.cohort}</span>
        </div>
        
        <div class="profile-stats">
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px">
            <div style="font-size:11px;color:var(--txt-secondary);text-transform:uppercase;margin-bottom:4px">Program Joined</div>
            <div style="font-size:15px;font-weight:600">${u.joined}</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px">
            <div style="font-size:11px;color:var(--txt-secondary);text-transform:uppercase;margin-bottom:4px">Milestones Completed</div>
            <div style="font-size:15px;font-weight:600">3 of 7</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px">
            <div style="font-size:11px;color:var(--txt-secondary);text-transform:uppercase;margin-bottom:4px">Mentor Sessions</div>
            <div style="font-size:15px;font-weight:600">8 Sessions</div>
          </div>
        </div>
      </div>
      
      <div class="profile-grid">
        <div class="card">
          <div class="section-row"><div class="section-label">About</div></div>
          <div style="font-size:13.5px;color:var(--txt-secondary);line-height:1.6;margin-bottom:20px">${u.bio}</div>
          <div class="section-row"><div class="section-label">Contact Information</div></div>
          <div class="info-row"><div class="info-label">Email</div><div class="info-value">${u.email}</div></div>
          <div class="info-row"><div class="info-label">Phone</div><div class="info-value">${u.phone}</div></div>
          <div class="info-row"><div class="info-label">LinkedIn</div><div class="info-value" style="color:var(--accent);cursor:pointer">${u.linkedin}</div></div>
        </div>
        
        <div class="card">
          <div class="section-row"><div class="section-label">Startup Information</div><button class="link-btn" onclick="navigateTo('startup')">View Full</button></div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <div style="width:60px;height:60px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;font-family:'Space Grotesk'">${s.logo}</div>
            <div>
              <div style="font-family:'Space Grotesk';font-size:18px;font-weight:700">${s.name}</div>
              <div style="font-size:13px;color:var(--txt-secondary)">${s.industry}</div>
            </div>
          </div>
          <div class="info-row"><div class="info-label">Stage</div><div class="info-value"><span class="tag tag-orange">${s.stage}</span></div></div>
          <div class="info-row"><div class="info-label">Progress</div><div class="info-value"><div class="prog-track sm" style="width:100px;margin-top:6px"><div class="prog-fill" style="width:${s.progress}%"></div></div></div></div>
          <div class="info-row"><div class="info-label">Website</div><div class="info-value" style="color:var(--accent);cursor:pointer">${s.website}</div></div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-profile').innerHTML = html;
}
