/* Skill Switcher — Live Telemetry & INR Cost Engine */
/* Contains: openTelemetryModal, fetchSessionTelemetry, renderTelemetryUI, */
/*           updateGlobalTelemetryBadges, setTelemetryCurrency, changeTelemetryModel */

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

    const res = await fetch(`/session-telemetry?${params.toString()}`);
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
  const select = document.getElementById('tel-session-select');
  if (!select || !sessionsList) return;

  const currentVal = select.value;
  let opts = '<option value="">Latest Active Session</option>';
  sessionsList.forEach(s => {
    const isSelected = (currentVal === s.id || (!currentVal && s.id === activeId));
    opts += `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${s.id.substring(0, 8)}... (${s.size_kb} KB)</option>`;
  });
  select.innerHTML = opts;
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
      heroInrEl.textContent = '???' + costInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      heroInrEl.textContent = '$' + costUsd.toFixed(4) + ' USD';
    }
  }
  if (heroUsdEl) {
    if (activeTelemetryCurrency === 'INR') {
      heroUsdEl.textContent = `??? $${costUsd.toFixed(4)} USD (Exchange Benchmark: ???86.50/USD)`;
    } else {
      heroUsdEl.textContent = `??? ???${costInr.toFixed(2)} INR (Exchange Benchmark: ???86.50/USD)`;
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

  if (statCostEl) statCostEl.textContent = '???' + costInr.toFixed(2);
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

  // Tools Matrix Breakdown Table
  const tbody = document.getElementById('tel-tools-tbody');
  const badge = document.getElementById('tel-tools-total-badge');
  const tools = data.tools_breakdown || {};
  const toolEntries = Object.entries(tools).sort((a, b) => b[1] - a[1]);
  let totalCalls = 0;

  if (tbody) {
    if (toolEntries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="padding:10px;text-align:center;color:var(--fg-muted);">No tool calls recorded in this session.</td></tr>';
    } else {
      let html = '';
      toolEntries.forEach(([tool, count]) => {
        totalCalls += count;
        html += `
          <tr style="border-bottom:1px solid var(--border-muted);">
            <td style="padding:6px 8px;font-family:'Geist Mono',monospace;font-weight:600;color:var(--fg-default);">${tool}</td>
            <td style="padding:6px 8px;text-align:right;font-weight:700;color:var(--accent-blue);">${count.toLocaleString()}</td>
            <td style="padding:6px 8px;text-align:right;">
              <span class="gh-pill green" style="font-size:9.5px;padding:1px 5px;">Executed</span>
            </td>
          </tr>
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
      feedEl.innerHTML = '<div style="padding:10px;text-align:center;color:var(--fg-muted);font-size:11px;">No trajectory entries yet.</div>';
    } else {
      feedEl.innerHTML = turns.map(t => {
        const isModel = t.source === 'MODEL' || t.type === 'PLANNER_RESPONSE';
        const typeColor = isModel ? 'var(--accent-purple,#8250df)' : 'var(--accent-blue)';
        const safeSnippet = (t.preview || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
          <div style="background:var(--bg-subtle);border:1px solid var(--border-muted);border-radius:6px;padding:6px 8px;font-size:11px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
              <span style="font-weight:600;color:${typeColor};">#${t.step_index || 0} ${t.type || 'STEP'}</span>
              <span style="font-size:10px;color:var(--fg-muted);">${(t.tokens || 0).toLocaleString()} tok</span>
            </div>
            <div style="color:var(--fg-default);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Geist Mono',monospace;font-size:10.5px;">${safeSnippet || 'Tool execution result'}</div>
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
      navLabel.textContent = `Live Agent: ???${costInr.toFixed(2)}`;
    } else {
      navLabel.textContent = `Live Agent: $${costUsd.toFixed(3)}`;
    }
  }

  // Sidebar "About Active Context" live cost badge
  const sidebarCost = document.getElementById('sidebar-live-cost');
  if (sidebarCost) {
    sidebarCost.textContent = `???${costInr.toFixed(2)}`;
    sidebarCost.title = `Estimated Session Cost: ???${costInr.toFixed(2)} INR ($${costUsd.toFixed(4)} USD). Click to inspect token telemetry.`;
  }
}
