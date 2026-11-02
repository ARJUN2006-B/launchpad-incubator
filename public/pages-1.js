/* ============================================================
   pages-1.js — Render functions for Pages 1 to 7
============================================================ */

// 1. OVERVIEW PAGE
function renderOverview() {
  const data = AppData.startup;
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Mission Control</div><div class="page-subtitle">Your central hub for tracking ${data.name}'s progress.</div></div>
      
      <div class="hero">
        <div class="hero-grid">
          <div>
            <div class="hero-title">${data.name}</div>
            <div class="hero-sub">${data.tagline}</div>
            
            <div class="journey-roadmap">
  `;
  
  AppData.milestones.forEach((ms, idx) => {
    html += `<div class="stage-node ${ms.status}">
      <div class="stage-circle" title="${ms.title}">${ms.status === 'done' ? '✓' : idx + 1}</div>
      <div class="stage-lbl">${ms.title}</div>
    </div>`;
    if (idx < AppData.milestones.length - 1) {
      let connClass = ms.status === 'done' ? 'done' : (ms.status === 'active' ? 'partial' : '');
      html += `<div class="stage-conn ${connClass}"></div>`;
    }
  });

  html += `
            </div>
            
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
              <span style="font-size:13px;font-weight:600;width:90px">Overall Progress</span>
              <div class="prog-track" style="flex:1"><div class="prog-fill" style="width:${data.progress}%"></div></div>
              <span style="font-size:13px;font-weight:700;color:var(--teal)">${data.progress}%</span>
            </div>
          </div>
          
          <div class="hero-stats">
            <div class="hero-stat"><div class="hero-stat-lbl">Incubation Stage</div><div class="hero-stat-val">${data.stage}</div><div class="hero-stat-sub">Cohort ${data.cohort}</div></div>
            <div class="hero-stat"><div class="hero-stat-lbl">Days Active</div><div class="hero-stat-val">${data.daysActive}</div><div class="hero-stat-sub">Since ${data.founded}</div></div>
          </div>
        </div>
      </div>

      <div class="overview-grid">
        <div class="ov-left">
          <div class="card">
            <div class="section-row"><div class="section-label">Today's Focus</div><button class="link-btn" onclick="navigateTo('milestones')">View all</button></div>
            <div id="overviewTasks"></div>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
            <div class="card">
              <div class="section-row"><div class="section-label">Startup Health</div></div>
              <div class="health-chart-wrap"><canvas id="healthChart"></canvas><div class="health-score-center"><div class="health-score-num">82</div><div class="health-score-lbl">Score</div></div></div>
              <div class="hm-row"><div class="hm-name">Product</div><div class="hm-bar"><div class="hm-fill" style="width:90%;background:#6C63FF"></div></div><div class="hm-val">90</div></div>
              <div class="hm-row"><div class="hm-name">Market</div><div class="hm-bar"><div class="hm-fill" style="width:75%;background:#00D4AA"></div></div><div class="hm-val">75</div></div>
              <div class="hm-row"><div class="hm-name">Team</div><div class="hm-bar"><div class="hm-fill" style="width:85%;background:#FFB830"></div></div><div class="hm-val">85</div></div>
              <div class="hm-row"><div class="hm-name">Traction</div><div class="hm-bar"><div class="hm-fill" style="width:40%;background:#FF7A50"></div></div><div class="hm-val">40</div></div>
              <div class="insight-box"><strong>Insight:</strong> Focus on early traction. Market testing phase next month will boost this score.</div>
            </div>
            
            <div class="card">
              <div class="section-row"><div class="section-label">Funding Snapshot</div><button class="link-btn" onclick="navigateTo('funding')">Details</button></div>
              <div style="font-size:24px;font-weight:700;font-family:'Space Grotesk'">₹8.5L <span style="font-size:12px;color:var(--txt-secondary);font-weight:400;font-family:'Inter'">raised of ₹20L</span></div>
              <div class="prog-track" style="margin:12px 0 16px"><div class="prog-fill" style="width:42.5%"></div></div>
              <div style="font-size:11px;font-weight:700;color:var(--txt-muted);text-transform:uppercase;margin-bottom:8px">Sources</div>
              <div style="display:flex;flex-direction:column;gap:8px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span>Incubator Grant</span><span style="font-weight:600;color:var(--teal)">₹2.5L</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span>Govt Grant (BIRAC)</span><span style="font-weight:600;color:var(--teal)">₹3.0L</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span>Investor (Pending)</span><span style="font-weight:600;color:var(--gold)">₹3.0L</span></div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="section-row"><div class="section-label">Recent Activity</div></div>
            <div id="overviewActivity"></div>
          </div>
        </div>
        
        <div class="ov-right">
          <div class="card">
            <div class="section-row"><div class="section-label">Assigned Mentor</div><button class="link-btn" onclick="navigateTo('mentor')">Space</button></div>
            <div class="mentor-card-inner">
              <div class="mentor-av">${AppData.mentor.initials}<div class="mentor-online"></div></div>
              <div>
                <div class="mentor-name">${AppData.mentor.name}</div>
                <div class="mentor-role">${AppData.mentor.role}</div>
                <div style="display:flex;gap:6px"><button class="btn btn-primary btn-xs" onclick="navigateTo('messages')">Message</button><button class="btn btn-secondary btn-xs" onclick="openModal('requestMeetingModal')">Meet</button></div>
              </div>
            </div>
            <div class="next-mtg"><span style="font-size:12px;font-weight:600;color:var(--teal)">Next: Product Review</span><span style="font-size:11px;color:var(--txt-secondary)">Tomorrow, 3PM</span></div>
            <div class="feedback-quote">"Your MVP direction is strong. Focus on validating the solution with at least 20 potential users."</div>
          </div>
          
          <div class="card">
            <div class="section-row"><div class="section-label">Upcoming Meetings</div><button class="link-btn" onclick="navigateTo('meetings')">Calendar</button></div>
            <div id="overviewMeetings"></div>
          </div>
          
          <div class="card">
            <div class="section-row"><div class="section-label">Investor Interest</div><button class="link-btn" onclick="navigateTo('investors')">Hub</button></div>
            <div style="font-size:13px;color:var(--txt-secondary);margin-bottom:12px">3 Investors showed interest this week.</div>
            <div id="overviewInvestors"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-overview').innerHTML = html;
  
  // Render Overview Data
  const taskHtml = AppData.milestones[3].tasks.slice(0,3).map((t,i) => `
    <div class="task-item ${t.done ? 'done' : ''}" onclick="toggleOverviewTask(${i})">
      <div class="task-check" id="ovTaskCheck${i}"><svg class="check-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div><div class="task-name" id="ovTaskName${i}">${t.t}</div><div style="display:flex;gap:6px"><span class="tag ${i===0?'tag-orange':'tag-muted'}">${i===0?'Urgent':'Pending'}</span></div></div>
    </div>
  `).join('');
  document.getElementById('overviewTasks').innerHTML = taskHtml;
  
  const actItems = (AppState.activity && AppState.activity.length ? AppState.activity : (AppData.activities||[])).slice(0,5);
  document.getElementById('overviewActivity').innerHTML = actItems.map(a => `
    <div class="activity-item"><div class="activity-icon" style="background:${a.bg||'rgba(108,99,255,0.12)'}">${a.icon||'📋'}</div><div class="activity-body"><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div></div>
  `).join('') || '<div style="color:var(--txt-secondary);font-size:13px;padding:8px 0">No recent activity yet.</div>';
  
  document.getElementById('overviewMeetings').innerHTML = AppState.meetings.filter(m => !m.past).slice(0,3).map(m => `
    <div class="meeting-item"><div class="meeting-date-box"><div class="meeting-mo">${m.month}</div><div class="meeting-dy">${m.day}</div></div><div class="meeting-info"><div class="meeting-time-txt">${m.time} · ${m.type}</div><div class="meeting-title-txt">${m.title}</div><div class="meeting-with-txt">${m.with}</div></div><button class="join-btn" onclick="showToast('Meeting joined','📹')">Join</button></div>
  `).join('');
  
  document.getElementById('overviewInvestors').innerHTML = AppData.investors.slice(0,2).map(i => `
    <div class="investor-item" onclick="showInvestorModal(${i.id})"><div class="inv-logo" style="background:${i.bg};color:${i.color}">${i.initials}</div><div><div style="font-size:13px;font-weight:600">${i.name}</div><div style="font-size:11px;color:var(--txt-secondary);margin-top:2px">${i.status === 'Interested' ? 'Interested in AgriTech' : 'Viewed your pitch deck'}</div></div></div>
  `).join('');
  
  // Init Chart
  setTimeout(() => {
    const ctx = document.getElementById('healthChart');
    if(ctx && !window.healthChartInst) {
      window.healthChartInst = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Product','Market','Team','Traction'], datasets: [{ data: [35, 25, 30, 10], backgroundColor: ['#6C63FF', '#00D4AA', '#FFB830', '#FF7A50'], borderWidth: 0, hoverOffset: 4 }] },
        options: { cutout: '75%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
      });
    }
  }, 100);
}

// 2. MY STARTUP PAGE
function renderStartup() {
  const data = AppData.startup;
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header-row"><div class="page-header"><div class="page-title">My Startup</div><div class="page-subtitle">Manage your startup profile and team details.</div></div><button class="btn btn-primary" onclick="saveStartupProfile()">Save Changes</button></div>
      
      <div class="startup-grid">
        <div class="card">
          <div class="section-row"><div class="section-label">Startup Identity</div></div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <div style="width:72px;height:72px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;font-family:'Space Grotesk'">${data.logo}</div>
            <div><button class="btn btn-secondary btn-sm" onclick="document.getElementById('logoUpload').click()">Change Logo</button><input type="file" id="logoUpload" style="display:none"/><div style="font-size:11px;color:var(--txt-secondary);margin-top:6px">Recommended: 400x400px</div></div>
          </div>
          <div class="form-row"><div class="form-group"><label class="form-label">Startup Name</label><input class="form-input" id="startupName" value="${data.name}"/></div><div class="form-group"><label class="form-label">Founded Date</label><input class="form-input" id="startupFounded" value="${data.founded||''}"/></div></div>
          <div class="form-group"><label class="form-label">Tagline</label><input class="form-input" id="startupTagline" value="${data.tagline}"/></div>
          <div class="form-row"><div class="form-group"><label class="form-label">Industry</label><input class="form-input" id="startupIndustry" value="${data.industry}"/></div><div class="form-group"><label class="form-label">Startup Stage</label><select class="form-select" id="startupStage"><option ${data.stage==='Idea'?'selected':''}>Idea</option><option ${data.stage==='Prototype'?'selected':''}>Prototype</option><option ${data.stage==='MVP Development'?'selected':''}>MVP Development</option><option ${data.stage==='Market Validation'?'selected':''}>Market Validation</option><option ${data.stage==='Scaling'?'selected':''}>Scaling</option></select></div></div>
          <div class="form-row"><div class="form-group"><label class="form-label">Location</label><input class="form-input" id="startupLocation" value="${data.location}"/></div><div class="form-group"><label class="form-label">Website</label><input class="form-input" id="startupWebsite" value="${data.website}"/></div></div>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:22px">
          <div class="card">
            <div class="section-row"><div class="section-label">Core Hypothesis</div></div>
            <div class="form-group"><label class="form-label">Problem Statement</label><textarea class="form-textarea" id="startupProblem">${data.problem||''}</textarea></div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Proposed Solution</label><textarea class="form-textarea" id="startupSolution">${data.solution||''}</textarea></div>
          </div>
          <div class="card">
            <div class="section-row"><div class="section-label">Business Information</div></div>
            <div class="form-group"><label class="form-label">Business Model</label><textarea class="form-textarea" style="min-height:60px" id="startupBusinessModel">${data.businessModel||''}</textarea></div>
            <div class="form-group"><label class="form-label">Target Customers</label><input class="form-input" id="startupTargetCustomers" value="${data.targetCustomers||''}"/></div>
            <div class="form-group"><label class="form-label">Revenue Model</label><input class="form-input" id="startupRevenueModel" value="${data.revenueModel||''}"/></div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Market Size</label><input class="form-input" id="startupMarketSize" value="${data.marketSize||''}"/></div>
          </div>
        </div>
      </div>
      
      <div class="card" style="margin-top:22px">
        <div class="section-row"><div class="section-label">Team Members</div><button class="btn btn-secondary btn-sm" onclick="openModal('addTeamModal')">+ Add Member</button></div>
        <div class="team-grid" id="teamGridRender"></div>
      </div>
    </div>
  `;
  document.getElementById('page-startup').innerHTML = html;
  
  // Render Team — use AppData.team (updated by backend)
  const teamSource = AppData.team && AppData.team.length ? AppData.team : (AppState.teamMembers||[]);
  const teamHtml = teamSource.map((m, i) => `
    <div class="team-card">
      <div class="team-av" style="background:${m.color}22;color:${m.color};border:1px solid ${m.color}44">${m.initials}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:14px">
        ${(m.skills||[]).map(s => `<span class="tag tag-muted">${s}</span>`).join('')}
      </div>
      <button class="btn btn-secondary btn-xs" style="width:100%" onclick="removeTeamMember('${m.id||i}')">Remove</button>
    </div>
  `).join('') || '<div style="color:var(--txt-secondary);font-size:13px;padding:12px 0">No team members yet.</div>';
  document.getElementById('teamGridRender').innerHTML = teamHtml;
}

// 3. INCUBATION JOURNEY PAGE
function renderJourney() {
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Incubation Journey</div><div class="page-subtitle">Your interactive roadmap from idea to graduation.</div></div>
      
      <div class="journey-wrap">
        <div class="journey-timeline">
  `;
  
  AppData.milestones.forEach((ms, idx) => {
    let expClass = ms.id === AppState.activeMilestone ? 'expanded' : '';
    let btnHtml = ms.status === 'done' ? `<button class="btn btn-teal btn-xs">View Report</button>` : (ms.status === 'active' ? `<button class="btn btn-primary btn-xs" onclick="navigateTo('milestones')">Go to Milestone</button>` : '');
    
    html += `
      <div class="jstage ${ms.status} ${expClass}" onclick="toggleJourneyStage(this)">
        <div class="jstage-dot">${ms.status === 'done' ? '✓' : idx + 1}</div>
        <div class="jstage-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="jstage-name">${ms.icon} ${ms.title}</div>
              <div style="font-size:11px;color:var(--txt-secondary);margin-bottom:8px">Deadline: ${ms.deadline}</div>
            </div>
            ${ms.status === 'done' ? '<span class="tag tag-teal">Completed</span>' : (ms.status === 'active' ? '<span class="tag tag-orange">In Progress</span>' : '<span class="tag tag-muted">Upcoming</span>')}
          </div>
          <div class="jstage-desc">${ms.description}</div>
          <div class="jstage-detail">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--txt-muted);margin-bottom:6px">Required Tasks</div>
            <div class="jstage-tasks">
              ${ms.tasks.map(t => `<div class="jtask"><div class="jtask-dot" style="background:${t.done ? 'var(--teal)' : 'var(--border)'}"></div><span style="${t.done ? 'text-decoration:line-through;color:var(--txt-muted)' : ''}">${t.t}</span></div>`).join('')}
            </div>
            <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:11.5px"><span style="color:var(--txt-secondary)">Submission:</span> <strong>${ms.submission}</strong></div>
              ${btnHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `
        </div>
        
        <div class="journey-detail-panel">
          <div class="section-row"><div class="section-label">Current Status</div></div>
          <div style="font-family:'Space Grotesk';font-size:24px;font-weight:700;color:var(--accent);margin-bottom:4px">MVP Development</div>
          <div style="font-size:13px;color:var(--txt-secondary);margin-bottom:20px">Phase 4 of 7</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <div class="prog-track" style="flex:1"><div class="prog-fill" style="width:68%"></div></div>
            <span style="font-size:13px;font-weight:700;color:var(--teal)">68%</span>
          </div>
          <div style="font-size:11px;color:var(--txt-secondary);margin-bottom:24px">Overall journey progress</div>
          
          <div style="padding:14px;background:rgba(255,122,80,0.06);border:1px solid rgba(255,122,80,0.2);border-radius:var(--radius-sm);margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:var(--orange);text-transform:uppercase;margin-bottom:6px">Next Objective</div>
            <div style="font-size:13.5px;font-weight:500;line-height:1.4">Complete beta testing with 50 users and optimize app performance.</div>
          </div>
          
          <div class="section-row"><div class="section-label">Recent Feedback</div></div>
          <div class="feedback-entry" style="margin-bottom:12px">
            <div style="font-size:11px;color:var(--txt-muted);margin-bottom:4px">Dr. Rahul Mehta • Aug 20</div>
            <div style="font-size:12.5px;line-height:1.5">Your MVP direction is strong. Focus next on validating your solution with at least 20 potential users before your next milestone review.</div>
          </div>
          <button class="btn btn-secondary" style="width:100%" onclick="navigateTo('mentor')">View Mentor Space</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-journey').innerHTML = html;
}

// 4. MENTOR SPACE
function renderMentor() {
  const m = AppData.mentor;
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Mentor Space</div><div class="page-subtitle">Your dedicated collaboration workspace with ${m.name}.</div></div>
      
      <div class="mentor-page-grid">
        <div class="mentor-profile-card">
          <div class="mentor-big-av">${m.initials}</div>
          <div style="text-align:center;margin-bottom:20px">
            <div style="font-family:'Space Grotesk';font-size:20px;font-weight:700">${m.name}</div>
            <div style="font-size:13px;color:var(--txt-secondary);margin:4px 0 8px">${m.role}</div>
            <div class="tag tag-accent">★ ${m.rating} Rating</div>
          </div>
          <div class="info-row"><div class="info-label">Experience</div><div class="info-value">${m.experience}</div></div>
          <div class="info-row"><div class="info-label">Startups Assigned</div><div class="info-value">${m.assignedStartups} active</div></div>
          <div class="info-row"><div class="info-label">Sessions with you</div><div class="info-value">${m.sessionsCompleted} completed</div></div>
          <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px">
            <button class="btn btn-primary" onclick="navigateTo('messages')">Send Message</button>
            <button class="btn btn-secondary" onclick="openModal('requestMeetingModal')">Request Meeting</button>
          </div>
        </div>
        
        <div>
          <div class="card" style="margin-bottom:22px">
            <div class="section-row"><div class="section-label">Biography</div></div>
            <div style="font-size:13.5px;color:var(--txt-secondary);line-height:1.6;margin-bottom:20px">${m.bio}</div>
            <div class="section-row"><div class="section-label">Areas of Expertise</div></div>
            <div class="expertise-tags">
              ${m.expertise.map(e => `<span class="tag tag-muted">${e}</span>`).join('')}
            </div>
            <div class="section-row" style="margin-top:24px"><div class="section-label">Availability (Typical)</div></div>
            <ul style="font-size:13px;color:var(--txt-secondary);list-style:disc;padding-left:16px;line-height:1.6">
              ${m.availability.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
            <div class="card">
              <div class="section-row"><div class="section-label">Feedback History</div></div>
              <div class="feedback-history">
                ${m.feedbackHistory.slice(0,3).map(f => `
                  <div class="feedback-entry">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                      <div style="font-size:12px;font-weight:600">${f.topic}</div>
                      <div style="font-size:11px;color:var(--txt-muted)">${f.date}</div>
                    </div>
                    <div style="font-size:12.5px;color:var(--txt-secondary);line-height:1.5">${f.text}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="card">
              <div class="section-row"><div class="section-label">Previous Sessions</div></div>
              <div>
                ${m.sessions.map(s => `
                  <div class="session-item">
                    <div class="session-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div>
                    <div style="flex:1">
                      <div style="font-size:13px;font-weight:600;margin-bottom:2px">${s.topic}</div>
                      <div style="font-size:11px;color:var(--txt-secondary)">${s.date} · ${s.duration}</div>
                    </div>
                    <span class="tag tag-teal">Completed</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-mentor').innerHTML = html;
}

// 5. MILESTONES PAGE
function renderMilestones() {
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header"><div class="page-title">Milestone Tracker</div><div class="page-subtitle">Track required deliverables and mentor approvals.</div></div>
      
      <div class="milestone-layout">
        <div class="milestone-list">
  `;
  
  AppData.milestones.forEach(ms => {
    let actClass = ms.id === AppState.activeMilestone ? 'active-ms' : '';
    html += `
      <div class="ms-item ${actClass}" onclick="loadMilestoneDetail(${ms.id}, this)">
        <div class="ms-top">
          <div class="ms-icon" style="background:rgba(255,255,255,0.05)">${ms.icon}</div>
          <div style="flex:1">
            <div class="ms-title">${ms.title}</div>
            <div class="ms-deadline">Due: ${ms.deadline}</div>
          </div>
          ${ms.status === 'done' ? '<span class="tag tag-teal">Approved</span>' : (ms.status === 'active' ? '<span class="tag tag-orange">Active</span>' : '<span class="tag tag-muted">Pending</span>')}
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px">
          <div class="prog-track sm" style="flex:1"><div class="prog-fill" style="width:${ms.progress}%;background:${ms.status === 'done' ? 'var(--teal)' : 'var(--accent)'}"></div></div>
          <span style="font-size:11px;font-weight:700">${ms.progress}%</span>
        </div>
      </div>
    `;
  });
  
  html += `
        </div>
        <div id="msDetailContainer"></div>
      </div>
    </div>
  `;
  document.getElementById('page-milestones').innerHTML = html;
  
  // Load active milestone initially
  const firstActive = document.querySelector('.ms-item.active-ms');
  loadMilestoneDetail(AppState.activeMilestone, firstActive);
}

// Global func to handle milestone click
window.loadMilestoneDetail = function(id, el) {
  if (el) {
    document.querySelectorAll('.ms-item').forEach(i => i.classList.remove('active-ms'));
    el.classList.add('active-ms');
  }
  AppState.activeMilestone = id;
  const ms = AppData.milestones.find(m => m.id === id);
  
  let html = `
    <div class="ms-detail-panel fade-up">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-family:'Space Grotesk';font-size:20px;font-weight:700">${ms.icon} ${ms.title}</div>
        <span class="tag tag-${ms.status === 'done' ? 'teal' : 'accent'}">${ms.progress}% Complete</span>
      </div>
      <div style="font-size:13px;color:var(--txt-secondary);line-height:1.5;margin-bottom:20px">${ms.description}</div>
      
      <div class="section-row"><div class="section-label">Required Tasks</div></div>
      <div style="display:flex;flex-direction:column;margin-bottom:24px">
        ${ms.tasks.map((t, i) => `
          <div class="ms-task ${t.done ? 'done' : ''}" onclick="toggleMsTask(${ms.id}, ${i}, this)">
            <div class="ms-task-check"><svg class="check-svg" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="ms-task-name">${t.t}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="section-row"><div class="section-label">Submission & Approval</div></div>
      <div style="background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:24px">
        <div class="info-row" style="padding-top:0"><div class="info-label">Required</div><div class="info-value" style="font-weight:600">${ms.submission}</div></div>
        <div class="info-row"><div class="info-label">Mentor Status</div><div class="info-value" style="color:var(--${ms.mentorStatus === 'Approved' ? 'teal' : 'orange'})">${ms.mentorStatus}</div></div>
        <div class="info-row" style="padding-bottom:0;border:none"><div class="info-label">Uploaded Docs</div><div class="info-value" style="font-size:12px">
          ${ms.docs.length > 0 ? ms.docs.map(d => `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:var(--accent)">📄</span> ${d}</div>`).join('') : '<span style="color:var(--txt-muted)">No documents uploaded yet</span>'}
        </div></div>
      </div>
      
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1" onclick="showToast('Milestone submitted for review','🚀')" ${ms.status === 'done' ? 'disabled' : ''}>Submit for Review</button>
        <button class="btn btn-secondary" onclick="openModal('uploadDocModal')">Attach Proof</button>
      </div>
    </div>
  `;
  document.getElementById('msDetailContainer').innerHTML = html;
};

// 6. DOCUMENTS PAGE
function renderDocuments() {
  let html = `
    <div class="page-inner fade-up" style="padding-bottom:0">
      <div class="page-header-row"><div class="page-header"><div class="page-title">Document Hub</div><div class="page-subtitle">Manage all your startup files and submissions.</div></div><button class="btn btn-primary" onclick="openModal('uploadDocModal')">Upload File</button></div>
    </div>
    
    <div class="doc-layout">
      <div class="doc-sidebar">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--txt-muted);margin-bottom:12px;letter-spacing:0.5px">Categories</div>
        <div class="doc-cat active">📁 All Documents <span class="doc-cat-count">${AppState.documents.length}</span></div>
        <div class="doc-cat">📄 Business Plan <span class="doc-cat-count">2</span></div>
        <div class="doc-cat">📊 Pitch Deck <span class="doc-cat-count">1</span></div>
        <div class="doc-cat">📈 Financial Plan <span class="doc-cat-count">1</span></div>
        <div class="doc-cat">📝 Product Documents <span class="doc-cat-count">2</span></div>
        <div class="doc-cat">⚖️ Legal Documents <span class="doc-cat-count">2</span></div>
        <div class="doc-cat">📋 Progress Reports <span class="doc-cat-count">2</span></div>
      </div>
      
      <div class="doc-main">
        <div class="doc-toolbar">
          <div class="doc-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--txt-muted)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search documents..."/>
          </div>
          <select class="form-select" style="width:140px"><option>Sort by Date</option><option>Sort by Name</option></select>
        </div>
        
        <div class="doc-grid" id="docGridContainer">
          ${AppState.documents.map(d => `
            <div class="doc-card" onclick="showToast('Downloading ${d.name}','⬇️')">
              <div class="doc-type-badge" style="background:${d.color}22;color:${d.color}">${d.type}</div>
              <div class="doc-icon" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1)">${d.icon}</div>
              <div class="doc-name" title="${d.name}">${d.name}</div>
              <div class="doc-meta">${d.size} · ${d.date}</div>
              <div style="font-size:10px;margin-top:8px;color:${d.status === 'Approved' ? 'var(--teal)' : 'var(--txt-secondary)'}">${d.status}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-documents').innerHTML = html;
  
  // Interactive doc cats
  document.querySelectorAll('.doc-cat').forEach(el => {
    el.addEventListener('click', function() {
      document.querySelectorAll('.doc-cat').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// 7. FUNDING PAGE
function renderFunding() {
  const f = AppData.funding;
  let html = `
    <div class="page-inner fade-up">
      <div class="page-header-row"><div class="page-header"><div class="page-title">Funding Center</div><div class="page-subtitle">Track grants, investments, and expenses.</div></div><button class="btn btn-primary" onclick="openModal('applyFundingModal')">Apply for Funding</button></div>
      
      <div class="funding-stats">
        <div class="stat-card"><div class="stat-label">Funding Goal</div><div class="stat-value">₹20L</div><div class="stat-sub">For Seed Stage</div></div>
        <div class="stat-card"><div class="stat-label">Total Raised</div><div class="stat-value" style="color:var(--teal)">₹8.5L</div><div class="stat-sub">42% of Goal</div></div>
        <div class="stat-card"><div class="stat-label">Remaining</div><div class="stat-value" style="color:var(--orange)">₹11.5L</div><div class="stat-sub">To raise</div></div>
        <div class="stat-card"><div class="stat-label">Runway</div><div class="stat-value">9 Months</div><div class="stat-sub">Based on burn rate</div></div>
      </div>
      
      <div class="tabs">
        <button class="tab active" data-target="fund-overview">Overview</button>
        <button class="tab" data-target="fund-apps">Applications</button>
        <button class="tab" data-target="fund-history">History</button>
        <button class="tab" data-target="fund-expenses">Expenses</button>
      </div>
      
      <!-- TAB: Overview -->
      <div id="fund-overview" class="tab-content active">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
          <div class="card">
            <div class="section-row"><div class="section-label">Funding Sources</div></div>
            <div class="funding-source-list">
              ${f.sources.map(s => `
                <div class="fs-item">
                  <div class="fs-dot" style="background:${s.color}"></div>
                  <div class="fs-info">
                    <div style="display:flex;justify-content:space-between">
                      <div class="fs-name">${s.name}</div>
                      <div class="fs-amount">₹${(s.amount/100000).toFixed(1)}L</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
                      <div class="fs-bar-wrap"><div style="height:100%;width:100%;background:${s.color};border-radius:99px"></div></div>
                      <span class="tag ${s.status === 'Released' ? 'tag-teal' : 'tag-orange'}">${s.status}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="card">
            <div class="section-row"><div class="section-label">Burn Rate vs Runway</div></div>
            <div style="height:180px;background:rgba(255,255,255,0.02);border:1px dashed var(--border);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;color:var(--txt-muted);font-size:13px;flex-direction:column;gap:10px">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              Financial chart visualization would render here
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
              <div><div style="font-size:11px;color:var(--txt-secondary);margin-bottom:2px">Avg Monthly Burn</div><div style="font-size:16px;font-weight:700">₹65,000</div></div>
              <div style="text-align:right"><div style="font-size:11px;color:var(--txt-secondary);margin-bottom:2px">Cash in Bank</div><div style="font-size:16px;font-weight:700;color:var(--teal)">₹6,80,000</div></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- TAB: Applications -->
      <div id="fund-apps" class="tab-content">
        <div class="card" style="padding:0;overflow:hidden">
          <table class="fund-app-table">
            <thead><tr><th>Opportunity Name</th><th>Category</th><th>Amount</th><th>Applied Date</th><th>Status</th></tr></thead>
            <tbody>
              ${f.applications.map(a => {
                let tagClass = a.status === 'Approved' ? 'tag-teal' : (a.status === 'Under Review' ? 'tag-accent' : 'tag-orange');
                return `<tr><td style="font-weight:600">${a.name}</td><td>${a.category}</td><td style="font-family:'Space Grotesk';font-weight:600">${a.amount}</td><td>${a.date}</td><td><span class="tag ${tagClass}">${a.status}</span></td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- TAB: History -->
      <div id="fund-history" class="tab-content">
        <div class="card" style="max-width:800px">
          ${f.history.map(h => `
            <div class="info-row" style="padding:14px 0">
              <div class="info-label" style="min-width:90px">${h.date}</div>
              <div class="info-value" style="flex:1">${h.event}</div>
              <div style="font-family:'Space Grotesk';font-weight:700;color:var(--${h.type==='credit'?'teal':(h.type==='debit'?'txt-primary':'orange')})">${h.amount}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- TAB: Expenses -->
      <div id="fund-expenses" class="tab-content">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
          <div class="card">
            <div class="section-row"><div class="section-label">Expense Breakdown</div><select class="form-select form-select-sm" style="width:auto;padding:4px 26px 4px 10px;font-size:12px"><option>Aug 2024</option><option>Jul 2024</option></select></div>
            <div style="display:flex;flex-direction:column;gap:12px">
              ${f.expenses.map(e => `
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px"><span style="font-weight:600">${e.cat}</span><span>${e.amount}</span></div>
                  <div class="prog-track sm"><div class="prog-fill" style="width:${e.pct}%;background:${e.color}"></div></div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card">
            <div class="section-row"><div class="section-label">Recent Transactions</div></div>
            <div style="display:flex;flex-direction:column;gap:0">
              <div class="expense-item"><div class="expense-cat" style="background:rgba(108,99,255,0.15);color:var(--accent)">TECH</div><div style="flex:1"><div style="font-size:13px;font-weight:600">AWS Hosting</div><div style="font-size:11px;color:var(--txt-secondary)">Aug 24, 2024</div></div><div style="font-weight:600">-₹12,400</div></div>
              <div class="expense-item"><div class="expense-cat" style="background:rgba(0,212,170,0.15);color:var(--teal)">TEAM</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Priya Nair (Salary)</div><div style="font-size:11px;color:var(--txt-secondary)">Aug 01, 2024</div></div><div style="font-weight:600">-₹80,000</div></div>
              <div class="expense-item"><div class="expense-cat" style="background:rgba(0,212,170,0.15);color:var(--teal)">TEAM</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Rohit Verma (Salary)</div><div style="font-size:11px;color:var(--txt-secondary)">Aug 01, 2024</div></div><div style="font-weight:600">-₹70,000</div></div>
              <div class="expense-item"><div class="expense-cat" style="background:rgba(255,122,80,0.15);color:var(--orange)">MKTG</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Facebook Ads</div><div style="font-size:11px;color:var(--txt-secondary)">Jul 28, 2024</div></div><div style="font-weight:600">-₹15,000</div></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;
  document.getElementById('page-funding').innerHTML = html;
  
  // Tab Logic
  const tabs = document.getElementById('page-funding').querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('page-funding').querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}
