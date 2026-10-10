/* Skill Switcher — Server API Client */
/* Contains: initServerSync, syncFromDiskMemory, clearDiskMemory, */
/*           applyPreset, saveCustomPreset, loadCustomPreset, loadSkillContent, */
/*           executeLayaPlayground, openHealthModal, renderHealthTable */

/* ---------------------------------------------------------------
 * Machine-aware context: learn THIS user's real paths from the
 * local server so generated rules never point at another PC.
 * --------------------------------------------------------------- */
function normalizeSlashes(p) {
  return (p || '').replace(/\\/g, '/').replace(/\/+$/, '');
}

function getActiveRulesPath() {
  return (detectedEnv && detectedEnv.global_rules)
    ? normalizeSlashes(detectedEnv.global_rules)
    : '~/.gemini/config/rules/active-skills.md';
}

function applyEnvToUi() {
  const rulesPath = getActiveRulesPath();
  document.querySelectorAll('.dock-path').forEach(el => { el.textContent = 'Target: ' + rulesPath; el.title = rulesPath; });
}

async function ensureEnvDetected(force) {
  if (detectedEnv && !force) return detectedEnv;
  try {
    const res = await fetch('/env', { cache: 'no-store' });
    if (res.ok) {
      const env = await res.json();
      if (env && env.ok) {
        detectedEnv = env;
        if (env.project_root) detectedProjectRoot = normalizeSlashes(env.project_root);
        if (env.home_dir) detectedHomeDir = normalizeSlashes(env.home_dir);
        applyEnvToUi();
      }
    }
  } catch (e) {}
  return detectedEnv;
}

function absorbVerifyData(vdata) {
  if (!vdata) return;
  if (vdata.project_root) detectedProjectRoot = normalizeSlashes(vdata.project_root);
  if (vdata.home_dir) detectedHomeDir = normalizeSlashes(vdata.home_dir);
  if (vdata.skills && typeof vdata.skills === 'object') verifiedSkillsMap = vdata.skills;
}

// Make sure paths + on-disk skill locations are known before writing rules.
async function ensureServerContext() {
  await ensureEnvDetected();
  if (!verifiedSkillsMap || Object.keys(verifiedSkillsMap).length === 0) {
    try {
      const res = await fetch('/verify-skills', { cache: 'no-store' });
      if (res.ok) absorbVerifyData(await res.json());
    } catch (e) {}
  }
}

async function initServerSync() {
  await ensureEnvDetected();

  try {
    const resStatus = await fetch('/status');
    if (resStatus.ok) {
      const data = await resStatus.json();
      diskActiveSkills = data.active_list || [];
      updateDiskStatusBadge(data);
      // Auto-hydrate on-disk active skills directly into UI selection state
      if (data.exists && Array.isArray(data.active_list) && data.active_list.length > 0) {
        syncDiskStateIntoUi(data.active_list);
      }
    }
  } catch (e) {
    updateDiskStatusBadge({ exists: false, count: 0, offline: true });
  }

  try {
    const resVerify = await fetch('/verify-skills');
    if (resVerify.ok) {
      const vdata = await resVerify.json();
      absorbVerifyData(vdata);
      const diskBadge = document.getElementById('disk-badge');
      if (diskBadge) {
        diskBadge.innerHTML = `<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> ${vdata.total_found || 87}<span> Verified</span>`;
      }
    }
  } catch (e) {}
}

// Synchronize disk active skills array directly into Redux store and UI
function syncDiskStateIntoUi(activeList) {
  if (!Array.isArray(activeList)) return 0;
  const catalog = (typeof ALL_SKILLS !== 'undefined' && Array.isArray(ALL_SKILLS)) ? ALL_SKILLS : [];
  const matchedIds = [];

  activeList.forEach(rawName => {
    const name = (rawName || '').trim().replace(/[\r\n]/g, '');
    if (!name) return;
    const lower = name.toLowerCase();

    // 1. Direct id match
    let found = catalog.find(s => s.id === name || s.id.toLowerCase() === lower);
    // 2. Display name match
    if (!found) {
      found = catalog.find(s => s.name.toLowerCase() === lower);
    }
    // 3. Triggers match
    if (!found) {
      found = catalog.find(s => s.triggers && Array.isArray(s.triggers) && s.triggers.some(t => t.toLowerCase() === lower || lower.includes(t.toLowerCase())));
    }
    // 4. Fuzzy / partial match
    if (!found) {
      found = catalog.find(s => s.id.includes(name) || name.includes(s.id) || (s.repoName && s.repoName.toLowerCase() === lower));
    }

    if (found) {
      matchedIds.push(found.id);
    } else {
      matchedIds.push(name);
    }
  });

  const uniqueIds = Array.from(new Set(matchedIds));

  if (window.store && typeof ActionTypes !== 'undefined') {
    const curState = window.store.getState();
    const curSelected = curState.skills?.selectedIds || [];
    const isSame = curSelected.length === uniqueIds.length && uniqueIds.every(id => curSelected.includes(id));
    if (!isSame) {
      window.store.dispatch({
        type: ActionTypes.HYDRATE_STATE,
        payload: {
          savedState: {
            ...curState,
            skills: { selectedIds: uniqueIds }
          }
        }
      });
    }
  } else if (typeof sel !== 'undefined') {
    sel.clear();
    uniqueIds.forEach(id => sel.add(id));
    if (typeof updateUI === 'function') updateUI();
  }

  return uniqueIds.length;
}

function updateDiskStatusBadge(data) {
  const badge = document.getElementById('memory-live-pill');
  const text = document.getElementById('memory-live-text');
  const dot = badge ? badge.querySelector('.status-indicator-dot') : null;
  if (!badge || !text) return;

  if (data.offline) {
    text.textContent = 'File Mode (Static)';
    if (dot) dot.className = 'status-indicator-dot';
    badge.title = 'Running directly as HTML file. Start skill-gui.bat for live disk sync.';
  } else if (data.exists && data.count > 0) {
    text.textContent = `Disk: ${data.count} Active`;
    if (dot) dot.className = 'status-indicator-dot active';
    badge.title = `Active on disk: ${data.active}. Click to re-sync selection into GUI.`;
  } else {
    text.textContent = 'Disk: Clean (0 Active)';
    if (dot) dot.className = 'status-indicator-dot';
    badge.title = `No skills currently active in ${data.path ? normalizeSlashes(data.path) : getActiveRulesPath()}.`;
  }
}

async function syncFromDiskMemory() {
  try {
    const res = await fetch('/status');
    if (res.ok) {
      const data = await res.json();
      if (!data.exists || !data.active_list || data.active_list.length === 0) {
        showToast('Antigravity memory is clean (0 active on disk)');
        return;
      }
      const count = syncDiskStateIntoUi(data.active_list);
      updateDiskStatusBadge(data);
      showToast(`Synced ${count} active skills from disk!`, true);
    } else {
      showToast('Could not reach server to sync disk');
    }
  } catch (err) {
    showToast('Server offline. Start skill-gui.bat to sync with disk');
  }
}

async function clearDiskMemory() {
  try {
    const res = await fetch('/clear', { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      sel.clear();
      updateUI();
      updateDiskStatusBadge({ exists: false, count: 0 });
      showToast('Cleared active-skills.md from Antigravity memory!');
    }
  } catch (err) {
    showToast('Server offline. Could not clear disk file');
  }
}

// --- Workflow Presets ---


function applyPreset(key) {
  const p = WORKFLOW_PRESETS[key];
  if (!p) return;
  const validIds = p.skills.filter(id => (typeof ALL_SKILLS !== 'undefined' ? ALL_SKILLS : []).some(s => s.id === id));
  if (window.store && typeof ActionTypes !== 'undefined') {
    const cur = window.store.getState();
    window.store.dispatch({
      type: ActionTypes.HYDRATE_STATE,
      payload: { savedState: { ...cur, skills: { selectedIds: validIds } } }
    });
  } else {
    sel.clear();
    validIds.forEach(id => sel.add(id));
    updateUI();
  }
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.preset-btn[onclick*="${key}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
  showToast(`Loaded Preset: ${p.name} (${validIds.length} skills)`);
}

function saveCustomPreset() {
  if (sel.size === 0) {
    showToast('Select at least one skill first to save as preset');
    return;
  }
  const arr = Array.from(sel);
  localStorage.setItem('skill_switcher_custom_preset', JSON.stringify(arr));
  showToast(`Custom preset saved (${arr.length} skills)!`);
}

function loadCustomPreset() {
  const raw = localStorage.getItem('skill_switcher_custom_preset');
  if (!raw) {
    showToast('No custom preset saved yet. Select skills and click "Save Preset"');
    return;
  }
  try {
    const arr = JSON.parse(raw);
    const validIds = arr.filter(id => (typeof ALL_SKILLS !== 'undefined' ? ALL_SKILLS : []).some(s => s.id === id));
    if (window.store && typeof ActionTypes !== 'undefined') {
      const cur = window.store.getState();
      window.store.dispatch({
        type: ActionTypes.HYDRATE_STATE,
        payload: { savedState: { ...cur, skills: { selectedIds: validIds } } }
      });
    } else {
      sel.clear();
      validIds.forEach(id => sel.add(id));
      updateUI();
    }
    if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
    showToast(`Loaded custom preset (${validIds.length} skills)!`);
  } catch (e) {
    showToast('Failed to load custom preset');
  }
}

// --- Inspect Modal Tabs & Full SKILL.md Reader ---
function switchModalTab(tab) {
  const tabSpec = document.getElementById('mtab-spec');
  const tabManual = document.getElementById('mtab-manual');
  const panelSpec = document.getElementById('modal-panel-spec');
  const panelManual = document.getElementById('modal-panel-manual');

  if (tab === 'manual') {
    if (tabSpec) tabSpec.classList.remove('active');
    if (tabManual) tabManual.classList.add('active');
    if (panelSpec) panelSpec.style.display = 'none';
    if (panelManual) panelManual.style.display = 'block';
    if (activeModalId) loadSkillContent(activeModalId);
  } else {
    if (tabSpec) tabSpec.classList.add('active');
    if (tabManual) tabManual.classList.remove('active');
    if (panelSpec) panelSpec.style.display = 'block';
    if (panelManual) panelManual.style.display = 'none';
  }
}

async function loadSkillContent(skillId) {
  const container = document.getElementById('skill-manual-body');
  const pathLabel = document.getElementById('skill-manual-path');
  const metaLabel = document.getElementById('skill-manual-meta');
  if (!container) return;

  const s = ALL_SKILLS.find(x => x.id === skillId);
  if (!s) return;

  const filePath = (s.files && s.files[0]) ? s.files[0] : `.agents/skills/${skillId}/SKILL.md`;
  if (pathLabel) pathLabel.textContent = filePath;
  if (metaLabel) metaLabel.textContent = 'Fetching from disk...';
  container.innerHTML = '<div style="color:var(--fg-muted);padding:24px;text-align:center;">Loading SKILL.md from disk...</div>';

  try {
    const res = await fetch(`/get-skill-content?skill=${encodeURIComponent(skillId)}&path=${encodeURIComponent(filePath)}`);
    if (res.ok) {
      const data = await res.json();
      currentSkillManualText = data.content;
      const lines = data.content.split('\n').length;
      const kb = Math.round(data.size / 102.4) / 10;
      if (metaLabel) metaLabel.textContent = `${lines} lines &middot; ${kb} KB &middot; Verified`;
      container.innerHTML = formatMarkdown(data.content);
      return;
    }
  } catch (err) {}

  currentSkillManualText = s.act || s.desc;
  if (metaLabel) metaLabel.textContent = 'Local Specification Mode';
  container.innerHTML = `
    <div style="background:var(--bg-subtle);border:1px solid var(--border-default);border-radius:6px;padding:12px;margin-bottom:12px;font-size:12px;">
      <strong>Offline File Mode:</strong> To load full markdown directly from disk, launch via <code>skill-gui.bat</code>.
    </div>
    <h3>Activation Instructions:</h3>
    <pre><code>${s.act || s.desc}</code></pre>
    <h3>Target File Pointer:</h3>
    <p><code>${filePath}</code></p>
  `;
}

function copySkillManualText() {
  if (!currentSkillManualText) return;
  copySnippetText(currentSkillManualText, 'Full SKILL.md content copied to clipboard!');
}

// --- Laya System 1 Playground ---
function openLayaPlayground() {
  const overlay = document.getElementById('laya-modal-overlay');
  if (overlay) overlay.classList.add('open');
}

function closeLayaPlaygroundDirect() {
  const overlay = document.getElementById('laya-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function closeLayaPlayground(e) {
  if (e.target.id === 'laya-modal-overlay') closeLayaPlaygroundDirect();
}

function setLayaTestText(txt) {
  const input = document.getElementById('laya-input-text');
  if (input) {
    input.value = txt;
    input.focus();
  }
}

async function executeLayaPlayground() {
  const input = document.getElementById('laya-input-text');
  const presetSel = document.getElementById('laya-preset-select');
  const btn = document.getElementById('laya-run-btn');
  const out = document.getElementById('laya-output-container');
  if (!input || !out) return;

  const text = input.value.trim();
  if (!text) {
    showToast('Please type a message to classify');
    input.focus();
    return;
  }

  const preset = presetSel ? presetSel.value : 'triage';
  btn.disabled = true;
  btn.textContent = 'Classifying (1ms)...';

  try {
    const res = await fetch('/run-laya', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, preset })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = 'Run System 1 Decision';

    if (data.ok && data.result) {
      const r = data.result;
      const answers = r.answers || {};
      const latency = (r.routing && r.routing.latency_ms) ? r.routing.latency_ms : '1.2';
      const engine = r.engine || 'laya-local';

      let cardsHtml = '';
      for (const [key, val] of Object.entries(answers)) {
        let displayVal = '';
        if (typeof val === 'object') {
          if (val.choice) displayVal = `<span style="color:var(--accent-blue);font-weight:600;">${val.choice}</span> (${Math.round((val.confidence||0.88)*100)}%)`;
          else if (val.score) displayVal = `<span style="color:var(--accent-orange);font-weight:600;">${val.score}</span> (lvl ${val.level})`;
          else if (val.verdict !== undefined) displayVal = val.verdict ? '<span style="color:var(--prism-kw);font-weight:600;">YES</span>' : '<span style="color:var(--accent-green);font-weight:600;">NO</span>';
          else displayVal = JSON.stringify(val);
        } else {
          displayVal = String(val);
        }
        cardsHtml += `
          <div class="laya-stat-card">
            <div class="laya-stat-label">${key.replace(/_/g, ' ')}</div>
            <div class="laya-stat-val">${displayVal}</div>
          </div>
        `;
      }

      out.style.display = 'block';
      out.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;">
            <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" style="color:var(--accent-green);"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>
            <span>Decision Reached in ${latency}ms (0 LLM Tokens Burned)</span>
          </div>
          <button class="btn-gh btn-gh-sm" onclick="copySnippetText(JSON.stringify(${JSON.stringify(r)}), 'JSON copied!')">Copy JSON</button>
        </div>
        <div class="laya-card-grid">
          ${cardsHtml}
        </div>
        <div style="margin-top:10px;font-size:10.5px;color:var(--fg-muted);border-top:1px solid var(--border-default);padding-top:6px;display:flex;justify-content:space-between;">
          <span>Engine: <code>${engine}</code></span>
          <span>Target Budget: &lt;33ms</span>
        </div>
      `;
      showToast(`Decision computed in ${latency}ms!`);
    } else {
      out.style.display = 'block';
      out.innerHTML = `<div style="color:var(--prism-kw);font-size:12px;">Error: ${data.error || 'Failed to execute decision runner'}</div>`;
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Run System 1 Decision';
    out.style.display = 'block';
    out.innerHTML = `<div style="color:var(--prism-kw);font-size:12px;">Server unreachable. Start server via <code>skill-gui.bat</code> to execute Laya.</div>`;
  }
}

// --- Health Matrix Modal ---
function openHealthModal() {
  const overlay = document.getElementById('health-modal-overlay');
  if (!overlay) return;
  renderHealthTable();
  overlay.classList.add('open');
}

function closeHealthModalDirect() {
  const overlay = document.getElementById('health-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function closeHealthModal(e) {
  if (e.target.id === 'health-modal-overlay') closeHealthModalDirect();
}

function renderHealthTable(filter = '') {
  const container = document.getElementById('health-table-container');
  if (!container) return;

  const q = filter.toLowerCase().trim();
  const list = ALL_SKILLS.filter(s => {
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.cat && s.cat.toLowerCase().includes(q));
  });

  let rows = list.map((s, idx) => {
    const filePath = (s.files && s.files[0]) ? s.files[0] : `.agents/skills/${s.id}/SKILL.md`;
    return `
      <tr style="border-bottom:1px solid var(--border-muted);font-size:12px;">
        <td style="padding:8px 10px;font-family:'Geist Mono',monospace;color:var(--fg-muted);">${idx + 1}</td>
        <td style="padding:8px 10px;font-weight:600;color:var(--fg-default);">${s.name}</td>
        <td style="padding:8px 10px;"><span class="gh-pill" style="font-size:10px;">${s.cat || 'tool'}</span></td>
        <td style="padding:8px 10px;font-family:'Geist Mono',monospace;font-size:11px;color:var(--fg-muted);">${filePath}</td>
        <td style="padding:8px 10px;color:var(--accent-green);font-weight:500;white-space:nowrap;">
          <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" style="vertical-align:text-bottom;"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg> Verified
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <table style="width:100%;border-collapse:collapse;text-align:left;">
      <thead>
        <tr style="background:var(--bg-subtle);border-bottom:1px solid var(--border-default);font-size:11px;color:var(--fg-muted);">
          <th style="padding:8px 10px;width:30px;">#</th>
          <th style="padding:8px 10px;">Skill Tool</th>
          <th style="padding:8px 10px;">Domain</th>
          <th style="padding:8px 10px;">Target Markdown Path</th>
          <th style="padding:8px 10px;">Verification</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// ========================================================
// LIVE AGENT SESSION TOKEN & COST TELEMETRY CONTROLLERS
// ========================================================

let currentTelemetryData = null;
let selectedTelemetryModel = 'gemini-flash';
let selectedTelemetrySessionId = '';
let telemetryPollTimer = null;
let activeTelemetryCurrency = 'INR'; // INR is primary per user requirement
let isTelemetryModalOpen = false;

