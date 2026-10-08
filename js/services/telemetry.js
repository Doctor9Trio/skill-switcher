/* Skill Switcher — Live Telemetry & INR Cost Engine */
/* Contains: openTelemetryModal, fetchSessionTelemetry, renderTelemetryUI, */
/*           updateGlobalTelemetryBadges, setTelemetryCurrency, changeTelemetryModel, */
/*           toggleShadcnSelect, selectTelemetryModel, selectTelemetrySession */

function openTelemetryModal() {
  const overlay = document.getElementById('agent-telemetry-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  isTelemetryModalOpen = true;
  fetchSessionTelemetry(false);

  // Accelerated polling when modal is in focus (4 seconds)
  if (telemetryPollTimer) clearInterval(telemetryPollTimer);
  telemetryPollTimer = setInterval(() => {
    if (isTelemetryModalOpen) {
      fetchSessionTelemetry(true);
    }
  }, 4000);
}

function closeTelemetryModal() {
  const overlay = document.getElementById('agent-telemetry-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  isTelemetryModalOpen = false;

  // Close any open select dropdowns
  document.querySelectorAll('.shadcn-select-wrapper.open').forEach(w => w.classList.remove('open'));

  // Revert to background polling (15s) for navbar badge
  if (telemetryPollTimer) clearInterval(telemetryPollTimer);
  telemetryPollTimer = setInterval(() => {
    fetchSessionTelemetry(true);
  }, 15000);
}

function closeTelemetryModalOnBackdrop(e) {
  if (e.target.id === 'agent-telemetry-modal-overlay') {
    closeTelemetryModal();
  }
}

// ─── shadcn UI Select Controllers ──────────────────────────────────────────
function toggleShadcnSelect(wrapperId) {
  const target = document.getElementById(wrapperId);
  if (!target) return;
  const wasOpen = target.classList.contains('open');
  // Close all other shadcn selects first
  document.querySelectorAll('.shadcn-select-wrapper.open').forEach(w => {
    if (w !== target) w.classList.remove('open');
  });
  target.classList.toggle('open', !wasOpen);
}

const TELEMETRY_MODEL_LABELS = {
  'all-combined': 'All Models Combined (Blended Portfolio)',
  'gemini-flash': 'Gemini 3.8 Flash (Active IDE Default)',
  'gemini-pro': 'Gemini 1.5 / 2.5 Pro',
  'claude-sonnet': 'Claude 3.5 Sonnet',
  'claude-haiku': 'Claude 3.5 Haiku',
  'gpt-4o': 'GPT-4o (Omni)',
  'deepseek-v3': 'DeepSeek V3'
};

function selectTelemetryModel(modelKey) {
  selectedTelemetryModel = modelKey;

  // Update trigger display text
  const labelEl = document.getElementById('shadcn-tel-model-value');
  if (labelEl) {
    labelEl.textContent = TELEMETRY_MODEL_LABELS[modelKey] || modelKey;
  }

  // Update item selection state
  const contentEl = document.getElementById('shadcn-tel-model-content');
  if (contentEl) {
    contentEl.querySelectorAll('.shadcn-select-item').forEach(item => {
      item.classList.toggle('selected', item.getAttribute('data-val') === modelKey);
    });
  }

  // Synchronize hidden select
  const nativeSelect = document.getElementById('tel-model-select');
  if (nativeSelect) nativeSelect.value = modelKey;

  // Close dropdown
  const wrapper = document.getElementById('shadcn-tel-model-wrapper');
  if (wrapper) wrapper.classList.remove('open');

  changeTelemetryModel(modelKey);
}

function selectTelemetrySession(sessionId) {
  selectedTelemetrySessionId = sessionId;

  // Update trigger display text
  const labelEl = document.getElementById('shadcn-tel-session-value');
  if (labelEl) {
    if (!sessionId) {
      labelEl.innerHTML = '<span class="status-indicator-dot active" style="width:6px;height:6px;background:#2ea043;display:inline-block;border-radius:50%;margin-right:4px;"></span> Latest Active Session';
    } else {
      labelEl.innerHTML = `<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;">${sessionId.substring(0, 8)}...</span>`;
    }
  }

  // Update item selection state
  const contentEl = document.getElementById('shadcn-tel-session-content');
  if (contentEl) {
    contentEl.querySelectorAll('.shadcn-select-item').forEach(item => {
      item.classList.toggle('selected', (item.getAttribute('data-val') || '') === (sessionId || ''));
    });
  }

  // Synchronize hidden select
  const nativeSelect = document.getElementById('tel-session-select');
  if (nativeSelect) nativeSelect.value = sessionId;

  // Close dropdown
  const wrapper = document.getElementById('shadcn-tel-session-wrapper');
  if (wrapper) wrapper.classList.remove('open');

  changeTelemetrySession(sessionId);
}

// Global outside click & Escape listeners for shadcn selects
if (!window.__shadcn_telemetry_listeners_bound) {
  window.__shadcn_telemetry_listeners_bound = true;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.shadcn-select-wrapper')) {
      document.querySelectorAll('.shadcn-select-wrapper.open').forEach(w => w.classList.remove('open'));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.shadcn-select-wrapper.open').forEach(w => w.classList.remove('open'));
    }
  });
}

function setTelemetryCurrency(curr) {
  activeTelemetryCurrency = curr;
  const btnInr = document.getElementById('curr-toggle-inr');
  const btnUsd = document.getElementById('curr-toggle-usd');

  if (curr === 'INR') {
    if (btnInr) {
      btnInr.className = 'btn-gh btn-gh-sm';
      btnInr.style.cssText = 'background:var(--accent-green);color:#fff;font-weight:700;border:none;';
    }
    if (btnUsd) {
      btnUsd.className = 'btn-gh btn-gh-sm btn-gh-ghost';
      btnUsd.style.cssText = '';
    }
  } else {
    if (btnUsd) {
      btnUsd.className = 'btn-gh btn-gh-sm';
      btnUsd.style.cssText = 'background:var(--accent-blue);color:#fff;font-weight:700;border:none;';
    }
    if (btnInr) {
      btnInr.className = 'btn-gh btn-gh-sm btn-gh-ghost';
      btnInr.style.cssText = '';
    }
  }

  if (currentTelemetryData) {
    renderTelemetryUI(currentTelemetryData);
    updateGlobalTelemetryBadges(currentTelemetryData);
  }
}

function changeTelemetryModel(modelKey) {
  selectedTelemetryModel = modelKey;
  fetchSessionTelemetry(false);
}

function changeTelemetrySession(sessionId) {
  selectedTelemetrySessionId = sessionId;
  fetchSessionTelemetry(false);
}

function getTelemetryApiBase() {
  if (window.location.protocol.startsWith('http') && window.location.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }
  return localStorage.getItem('tm_custom_api_base') || 'http://localhost:7891';
}

async function fetchSessionTelemetry(isSilent = false) {
  const refreshBtn = document.getElementById('tel-refresh-btn');
  if (refreshBtn && !isSilent) {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<span class="status-indicator-dot active" style="background:var(--accent-blue);width:6px;height:6px;display:inline-block;border-radius:50%;margin-right:4px;"></span> Syncing...';
  }

  try {
    const params = new URLSearchParams();
    if (selectedTelemetryModel) params.append('model', selectedTelemetryModel);
    if (selectedTelemetrySessionId) params.append('sessionId', selectedTelemetrySessionId);

    const apiBase = getTelemetryApiBase();
    const res = await fetch(`${apiBase}/session-telemetry?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      currentTelemetryData = data;
      renderTelemetryUI(data);
      updateGlobalTelemetryBadges(data);
      syncSessionDropdown(data.sessions_list, data.session_id);
    } else {
      if (!isSilent) showToast('Telemetry service unreachable');
    }
  } catch (err) {
    // Offline / standalone HTML mode graceful handling
    if (!isSilent) showToast('Start server to enable live telemetry');
  } finally {
    if (refreshBtn && !isSilent) {
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path></svg> Refresh';
    }
    const syncTimeEl = document.getElementById('tel-last-sync-time');
    if (syncTimeEl) {
      syncTimeEl.textContent = 'Last Synced: ' + new Date().toLocaleTimeString();
    }
  }
}

function syncSessionDropdown(sessionsList, activeId) {
  if (!sessionsList) return;

  // 1. Sync hidden native select
  const nativeSelect = document.getElementById('tel-session-select');
  if (nativeSelect) {
    const currentVal = nativeSelect.value;
    let opts = '<option value="">Latest Active Session</option>';
    sessionsList.forEach(s => {
      const isSelected = (currentVal === s.id || (!currentVal && s.id === activeId));
      opts += `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${s.id.substring(0, 8)}... (${s.size_kb} KB)</option>`;
    });
    nativeSelect.innerHTML = opts;
  }

  // 2. Sync custom shadcn Select content
  const shadcnContent = document.getElementById('shadcn-tel-session-content');
  if (shadcnContent) {
    const curVal = selectedTelemetrySessionId || '';
    let html = `
      <div class="shadcn-select-item ${!curVal ? 'selected' : ''}" onclick="selectTelemetrySession('')" data-val="">
        <div class="shadcn-select-item-left">
          <span class="status-indicator-dot active" style="width:6px;height:6px;background:#2ea043;display:inline-block;border-radius:50%;margin-right:2px;"></span>
          <span>Latest Active Session</span>
        </div>
        <div class="shadcn-select-item-right">
          <svg class="octicon shadcn-select-check" viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
        </div>
      </div>
      <div class="shadcn-select-group-title">Historical Sessions</div>
    `;

    sessionsList.forEach(s => {
      const isSelected = (curVal === s.id);
      html += `
        <div class="shadcn-select-item ${isSelected ? 'selected' : ''}" onclick="selectTelemetrySession('${s.id}')" data-val="${s.id}">
          <div class="shadcn-select-item-left">
            <span class="status-indicator-dot ${s.id === activeId ? 'active' : ''}" style="width:6px;height:6px;background:${s.id === activeId ? '#2ea043' : 'var(--fg-muted)'};display:inline-block;border-radius:50%;margin-right:2px;"></span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:11px;">${s.id.substring(0, 8)}...</span>
          </div>
          <div class="shadcn-select-item-right">
            <span class="shadcn-select-badge">${s.size_kb} KB</span>
            <svg class="octicon shadcn-select-check" viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
          </div>
        </div>
      `;
    });
    shadcnContent.innerHTML = html;
  }
}

function renderTelemetryUI(data) {
  if (!data || !data.ok) return;

  const costInr = typeof data.cost_inr === 'number' ? data.cost_inr : 0;
  const costUsd = typeof data.cost_usd === 'number' ? data.cost_usd : 0;
  const inTokens = data.input_tokens || 0;
  const outTokens = data.output_tokens || 0;
  const totalTokens = data.total_tokens || (inTokens + outTokens);
  const steps = data.step_count || 0;

  // Hero Card
  const heroInrEl = document.getElementById('tel-hero-cost-inr');
  const heroUsdEl = document.getElementById('tel-hero-cost-usd');
  if (heroInrEl) {
    if (activeTelemetryCurrency === 'INR') {
      heroInrEl.textContent = '₹' + costInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      heroInrEl.textContent = '$' + costUsd.toFixed(4) + ' USD';
    }
  }
  if (heroUsdEl) {
    if (activeTelemetryCurrency === 'INR') {
      heroUsdEl.textContent = `≈ $${costUsd.toFixed(4)} USD (Exchange Benchmark: ₹86.50/USD)`;
    } else {
      heroUsdEl.textContent = `≈ ₹${costInr.toFixed(2)} INR (Exchange Benchmark: ₹86.50/USD)`;
    }
  }

  // 4 Stats Grid
  const statInputEl = document.getElementById('tel-stat-input');
  const statInputCharsEl = document.getElementById('tel-stat-input-chars');
  const statOutputEl = document.getElementById('tel-stat-output');
  const statOutputCharsEl = document.getElementById('tel-stat-output-chars');
  const statTotalEl = document.getElementById('tel-stat-total');
  const statStepsEl = document.getElementById('tel-stat-steps');
  const statCostEl = document.getElementById('tel-stat-cost');
  const statCostUsdEl = document.getElementById('tel-stat-cost-usd');

  if (statInputEl) statInputEl.textContent = inTokens.toLocaleString();
  if (statInputCharsEl) statInputCharsEl.textContent = `${Math.round((data.input_chars || 0) / 1024)} KB system & user context`;

  if (statOutputEl) statOutputEl.textContent = outTokens.toLocaleString();
  if (statOutputCharsEl) statOutputCharsEl.textContent = `${Math.round((data.output_chars || 0) / 1024)} KB agent thoughts & code`;

  if (statTotalEl) statTotalEl.textContent = totalTokens.toLocaleString();
  if (statStepsEl) statStepsEl.textContent = `${steps} trajectory steps logged`;

  if (statCostEl) statCostEl.textContent = '₹' + costInr.toFixed(2);
  if (statCostUsdEl) statCostUsdEl.textContent = '$' + costUsd.toFixed(4) + ' USD';

  // Live Pill
  const pillEl = document.getElementById('tel-live-pill');
  if (pillEl) {
    if (data.is_active) {
      pillEl.className = 'gh-pill green';
      pillEl.innerHTML = '<span class="status-indicator-dot active" style="width:6px;height:6px;background:#2ea043;display:inline-block;border-radius:50%;margin-right:4px;"></span> Active Session';
    } else {
      pillEl.className = 'gh-pill';
      pillEl.innerHTML = '<span class="status-indicator-dot" style="width:6px;height:6px;background:var(--fg-muted);display:inline-block;border-radius:50%;margin-right:4px;"></span> Completed';
    }
  }

  // Tools Matrix Breakdown with Visual Frequency Progress Bars
  const tbody = document.getElementById('tel-tools-tbody');
  const badge = document.getElementById('tel-tools-total-badge');
  const tools = data.tools_breakdown || {};
  const toolEntries = Object.entries(tools).sort((a, b) => b[1] - a[1]);
  let totalCalls = 0;
  toolEntries.forEach(([, count]) => totalCalls += count);

  if (tbody) {
    if (toolEntries.length === 0) {
      tbody.innerHTML = '<div style="padding:16px;text-align:center;color:var(--fg-muted);font-size:11px;">No tool calls recorded in this session.</div>';
    } else {
      let html = '';
      toolEntries.forEach(([tool, count]) => {
        const pct = totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0;

        // Select tool icon
        let toolIcon = '<svg class="octicon" width="13" height="13" viewBox="0 0 16 16" style="color:var(--accent-blue);flex-shrink:0;"><path d="M11 2.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 2.5 12V5A2.5 2.5 0 0 1 5 2.5h6Zm0 1.5H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"/></svg>';
        if (tool.includes('command') || tool.includes('terminal')) {
          toolIcon = '<svg class="octicon" width="13" height="13" viewBox="0 0 16 16" style="color:#d29922;flex-shrink:0;"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM3.22 5.22a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06-1.06L5.19 8 3.22 6.03a.75.75 0 0 1 0-1.06Zm4.53 5.53h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Z"/></svg>';
        } else if (tool.includes('file') || tool.includes('replace') || tool.includes('write')) {
          toolIcon = '<svg class="octicon" width="13" height="13" viewBox="0 0 16 16" style="color:var(--accent-purple,#8250df);flex-shrink:0;"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25a1.75 1.75 0 0 1 .445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/></svg>';
        } else if (tool.includes('dir') || tool.includes('list')) {
          toolIcon = '<svg class="octicon" width="13" height="13" viewBox="0 0 16 16" style="color:var(--accent-blue);flex-shrink:0;"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"/></svg>';
        } else if (tool.includes('browser')) {
          toolIcon = '<svg class="octicon" width="13" height="13" viewBox="0 0 16 16" style="color:#2ea043;flex-shrink:0;"><path d="m8.5.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM1.5 8a6.5 6.5 0 0 1 1.05-3.523l3.2 3.201a.75.75 0 0 0 1.06 0l1.47-1.47a.75.75 0 0 0 0-1.06L5.342 2.21A6.5 6.5 0 0 1 8 1.5c1.47 0 2.827.487 3.924 1.312l-1.84 1.84a.75.75 0 0 0-.214.53V6.5a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75v-.862c0-.199-.079-.39-.22-.53l.97-.97A6.47 6.47 0 0 1 14.5 8a6.47 6.47 0 0 1-.884 3.25l-2.078-2.079A.75.75 0 0 0 11 9H9.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h.586l1.247 1.247A6.476 6.476 0 0 1 8 14.5a6.478 6.478 0 0 1-5.69-3.37l2.87-2.87a.75.75 0 0 0 0-1.06l-1.47-1.47a.75.75 0 0 0-1.06 0L1.71 6.67A6.47 6.47 0 0 1 1.5 8Z"/></svg>';
        }

        html += `
          <div class="tel-tool-row">
            <div style="display:flex;align-items:center;gap:7px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              ${toolIcon}
              <span style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--fg-default);overflow:hidden;text-overflow:ellipsis;" title="${tool}">${tool}</span>
            </div>
            <div style="text-align:right;font-weight:700;color:var(--accent-blue);font-family:'JetBrains Mono',monospace;">
              ${count.toLocaleString()}
            </div>
            <div class="tel-tool-freq-bar-bg" title="${pct}% of total tool calls">
              <div class="tel-tool-freq-bar-fill" style="width:${Math.max(pct, 5)}%;"></div>
            </div>
            <div style="text-align:right;font-size:10px;color:var(--fg-muted);font-family:'JetBrains Mono',monospace;">
              ${pct}%
            </div>
          </div>
        `;
      });
      tbody.innerHTML = html;
    }
  }
  if (badge) badge.textContent = `${totalCalls.toLocaleString()} calls`;

  // Recent Trajectory Stream
  const feedEl = document.getElementById('tel-recent-feed');
  const turns = data.recent_turns || [];
  if (feedEl) {
    if (turns.length === 0) {
      feedEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--fg-muted);font-size:11px;">No trajectory entries yet.</div>';
    } else {
      feedEl.innerHTML = turns.map(t => {
        const isModel = t.source === 'MODEL' || t.type === 'PLANNER_RESPONSE';
        const isUser = t.source === 'USER_EXPLICIT' || t.type === 'USER_INPUT';

        let roleBadge = '<span class="gh-pill" style="color:#d29922;border-color:rgba(210,153,34,0.3);font-size:9.5px;padding:0 5px;">Tool Action</span>';
        if (isModel) {
          roleBadge = '<span class="gh-pill" style="color:var(--accent-purple,#8250df);border-color:rgba(130,80,223,0.3);font-size:9.5px;padding:0 5px;">Assistant</span>';
        } else if (isUser) {
          roleBadge = '<span class="gh-pill blue" style="font-size:9.5px;padding:0 5px;">User Prompt</span>';
        }

        const rawSnippet = (t.preview || '')
          .replace(/Created At:\s*[\d\-:T+]+/g, '')
          .replace(/Completed At:\s*[\d\-:T+]+/g, '')
          .trim();
        const safeSnippet = rawSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return `
          <div class="tel-turn-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:8px;">
              <div style="display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;">
                ${roleBadge}
                <span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:600;color:var(--fg-default);white-space:nowrap;">#${t.step_index || 0}</span>
                <span style="font-size:10px;color:var(--fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.type || 'STEP'}</span>
              </div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--fg-muted);white-space:nowrap;flex-shrink:0;">${(t.tokens || 0).toLocaleString()} tok</span>
            </div>
            <div style="color:var(--fg-default);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'JetBrains Mono',monospace;font-size:10.5px;max-width:100%;" title="${safeSnippet || 'Tool execution result'}">${safeSnippet || 'Tool execution result'}</div>
          </div>
        `;
      }).reverse().join('');
    }
  }
}

function updateGlobalTelemetryBadges(data) {
  if (!data || !data.ok) return;

  const costInr = typeof data.cost_inr === 'number' ? data.cost_inr : 0;
  const costUsd = typeof data.cost_usd === 'number' ? data.cost_usd : 0;

  // Header Nav button label
  const navLabel = document.getElementById('nav-telemetry-label');
  if (navLabel) {
    if (activeTelemetryCurrency === 'INR') {
      navLabel.textContent = `Live Agent: ₹${costInr.toFixed(2)}`;
    } else {
      navLabel.textContent = `Live Agent: $${costUsd.toFixed(3)}`;
    }
  }

  // Sidebar "About Active Context" live cost badge
  const sidebarCost = document.getElementById('sidebar-live-cost');
  if (sidebarCost) {
    sidebarCost.textContent = `₹${costInr.toFixed(2)}`;
    sidebarCost.title = `Estimated Session Cost: ₹${costInr.toFixed(2)} INR ($${costUsd.toFixed(4)} USD). Click to inspect token telemetry.`;
  }
}