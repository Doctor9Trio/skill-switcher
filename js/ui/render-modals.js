/* Skill Switcher — Modal & Intent Router UI */
/* Contains: openInspect, closeModal, updateModalBtn, toggleModalActiveSkill, */
/*           findSkillById, scoreIntentText, runIntentRouter, formatMarkdown */

function openInspect(id) {
  const s = ALL_SKILLS.find(x => x.id === id);
  if (!s) return;
  activeModalId = id;

  document.getElementById('modal-skill-title').textContent = s.name;
  document.getElementById('modal-repo-info').textContent = (s.repoName || 'Local Workspace') + ' &middot; ' + (s.files ? s.files[0] : '');
  document.getElementById('modal-desc').textContent = s.desc;
  document.getElementById('modal-purpose').textContent = s.purpose || s.desc;
  document.getElementById('modal-trigger').textContent = s.trigger || 'No trigger defined';
  document.getElementById('modal-prompt').textContent = s.example_prompt || s.act;
  document.getElementById('modal-file').textContent = s.files ? s.files.join(', ') : '';

  if (s.clone_cmd) {
    document.getElementById('modal-clone-row').style.display = 'block';
    document.getElementById('modal-clone').textContent = s.clone_cmd;
  } else {
    document.getElementById('modal-clone-row').style.display = 'none';
  }

  if (s.repoUrl) {
    document.getElementById('modal-gh-link').style.display = 'inline-flex';
    document.getElementById('modal-gh-link').href = s.repoUrl;
  } else {
    document.getElementById('modal-gh-link').style.display = 'none';
  }

  updateModalApiKeySection(s);
  updateModalBtn();
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'modal-overlay') closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal-overlay').classList.remove('open');
  activeModalId = null;
}

function updateModalBtn() {
  if (!activeModalId) return;
  const isSel = sel.has(activeModalId);
  const btn = document.getElementById('modal-toggle-btn');
  btn.textContent = isSel ? 'Remove from Active Context' : 'Select This Skill';
}

function toggleModalActiveSkill() {
  if (!activeModalId) return;
  toggleSkill(activeModalId);
  updateModalBtn();
}

// Initial Boot: Hydrate Redux state from localStorage or perform initial render
const persistedState = loadReduxStateFromStorage();
if (persistedState) {
  store.dispatch({ type: ActionTypes.HYDRATE_STATE, payload: { savedState: persistedState } });
} else {
  updateUI();
}

// -----------------------------------------------------------------------------
// SMART SKILL PICKER - Premium Intent Engine
// -----------------------------------------------------------------------------

// Category color palette (maps to colored dots in results)
const IR_COLORS = {
  decision:  '#8250df',
  automation:'#e36209',
  context:   '#0969da',
  review:    '#1a7f37',
  mcp:       '#0550ae',
  gsap:      '#cf222e',
  react:     '#61dafb',
  threejs:   '#ff6b35',
  mobile:    '#1f883d',
  design:    '#8250df',
  video:     '#bc4c00',
  graph:     '#0969da',
  scaffold:  '#656d76',
  codex:     '#6e40c9',
  trading:   '#116329',
  taste:     '#9a6700',
  lottie:    '#e36209',
  pixel:     '#1a7f37',
};

const INTENT_SKILL_MAP = [
  {
    id: 'decision',
    keywords: ['decision','route','triage','classify','guard','safety','injection','spam','filter','score','intent','router','jailbreak','ticket','support','detect'],
    skills: ['laya','laya-mcp','semdecide','decision'],
    reason: 'Decision / Routing Logic'
  },
  {
    id: 'automation',
    keywords: ['dom','navigate','scroll','click','automate','loop','fast','speed','rapid','batch','sequential','robot'],
    skills: ['jev-ultrafast','jev-drone','agent-desktop'],
    reason: 'DOM Automation / Speed Loop'
  },
  {
    id: 'context',
    keywords: ['context','token','memory','prune','compact','compress','trim','limit','budget','window','long','large','overflow'],
    skills: ['fast-jev-compaction','winnow','blink'],
    reason: 'Context / Token Management'
  },
  {
    id: 'review',
    keywords: ['review','audit','pr','pull request','diff','lint','check','quality','security','bug','vulnerability','verify','assert','test'],
    skills: ['jev-review','canny-verifier','semdecide'],
    reason: 'Code Review / Audit'
  },
  {
    id: 'mcp',
    keywords: ['mcp','model context protocol','typed','schema','tool','server','protocol','sdk','api server','plugin'],
    skills: ['typesafe-mcp','jev-mcp'],
    reason: 'MCP / Typed Tool Server'
  },
  {
    id: 'gsap',
    keywords: ['gsap','tween','timeline','scrolltrigger','animate','animation','motion','transition','scroll','parallax','framer'],
    skills: ['gsap-core','gsap-scrolltrigger','gsap-timeline','motion-dev-animations'],
    reason: 'GSAP / Animation System'
  },
  {
    id: 'react',
    keywords: ['react','nextjs','next.js','vite','jsx','tsx','component','hook','state','frontend'],
    skills: ['gsap-react','json-render','animate'],
    reason: 'React / Frontend Framework'
  },
  {
    id: 'threejs',
    keywords: ['3d','three','threejs','webgl','shader','canvas','r3f','react three','babylon','playcanvas','spline','rive'],
    skills: ['claudedesignskills-threejs-webgl','claudedesignskills-react-three-fiber','claudedesignskills-babylonjs-engine','claudedesignskills-rive-interactive'],
    reason: '3D / WebGL Engine'
  },
  {
    id: 'mobile',
    keywords: ['mobile','ios','android','swift','react native','expo','swiftui','native','app','phone','tablet'],
    skills: ['mobile-native','write-swift','animate-expo'],
    reason: 'Mobile / Native App'
  },
  {
    id: 'design',
    keywords: ['design','ui','ux','apple','hig','beautiful','premium','polish','visual','aesthetic','typography','spacing','layout'],
    skills: ['apple-design','emil-design-eng','impeccable'],
    reason: 'UI / Design Aesthetics'
  },
  {
    id: 'video',
    keywords: ['video','generate','image','higgsfield','seedance','media','thumbnail','brand','photoshoot','explainer'],
    skills: ['higgsfield-generate','higgsfield-brandkit','seedance2-skill'],
    reason: 'Generative Media / Video'
  },
  {
    id: 'graph',
    keywords: ['graph','knowledge','neo4j','node','edge','relationship','data pipeline','extract'],
    skills: ['neo4jev','json-render'],
    reason: 'Knowledge Graph / Data Pipeline'
  },
  {
    id: 'scaffold',
    keywords: ['appllama','scaffold','mobile component','screen','app design'],
    skills: ['appllama-design','appllama-mcp'],
    reason: 'App Component Scaffolding'
  },
  {
    id: 'codex',
    keywords: ['prompt','codex','route prompt','llm routing','model selection','smart model'],
    skills: ['jev-codex-router','laya'],
    reason: 'LLM Prompt Routing'
  },
  {
    id: 'trading',
    keywords: ['trading','trade','stock','finance','market','portfolio','chart','candle'],
    skills: ['jev-trader'],
    reason: 'Trading / Finance'
  },
  {
    id: 'taste',
    keywords: ['brand','brandkit','glassmorphism','brutalist','minimalist','dark mode','gradient','style','redesign','stitch'],
    skills: ['taste-skill','brandkit','prism'],
    reason: 'Design Taste / Brand System'
  },
  {
    id: 'lottie',
    keywords: ['lottie','barba','anime','animejs','locomotive','smooth scroll','page transition'],
    skills: ['claudedesignskills-lottie-animations','claudedesignskills-barba-js','claudedesignskills-animejs','claudedesignskills-locomotive-scroll'],
    reason: 'Micro-Animation / Page Transitions'
  },
  {
    id: 'pixel',
    keywords: ['pixel','pixi','2d','sprite','game','canvas 2d'],
    skills: ['claudedesignskills-pixijs-2d'],
    reason: '2D Game / Pixel Canvas'
  }
];

// Robust Skill Resolver: finds canonical skill by ID, clean ID, suffix, or name
function findSkillById(id) {
  if (!id) return null;
  let s = ALL_SKILLS.find(x => x.id === id);
  if (s) return s;
  const cleanId = id.replace(/^[a-z0-9_.-]+-skills-/, '').replace(/-skills?$/, '');
  s = ALL_SKILLS.find(x => x.id === cleanId || x.id.endsWith(cleanId) || cleanId.endsWith(x.id));
  if (s) return s;
  const lower = id.toLowerCase();
  return ALL_SKILLS.find(x => x.name.toLowerCase() === lower || (x.repoName && x.repoName.toLowerCase() === lower)) || null;
}

// -----------------------------------------------------------------------------
// SEMANTIC TASK-TO-SKILL MATCHER (ENTERPRISE CONTEXT OPTIMIZER)
// -----------------------------------------------------------------------------

function scoreIntentText(text) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase().trim();
  if (!lower) return [];

  const words = lower.split(/[^a-z0-9_.-]+/).filter(Boolean);
  const wordSet = new Set(words);
  const results = [];

  for (const rule of INTENT_SKILL_MAP) {
    const hits = [];
    for (const kw of rule.keywords) {
      const lkw = kw.toLowerCase();
      if (lkw.includes(' ')) {
        if (lower.includes(lkw)) hits.push(kw);
      } else {
        if (wordSet.has(lkw) || lower.includes(lkw)) hits.push(kw);
      }
    }

    if (hits.length > 0) {
      results.push({
        id: rule.id,
        reason: rule.reason,
        skills: Array.isArray(rule.skills) ? rule.skills : [],
        hits: [...new Set(hits)],
        score: hits.length
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

function toggleIrHowDrawer() {
  const d = document.getElementById('ir-how-drawer');
  const btn = document.getElementById('ir-how-btn');
  if (!d) return;
  const isHidden = d.style.display === 'none' || !d.style.display;
  d.style.display = isHidden ? 'block' : 'none';
  if (btn) {
    btn.innerHTML = isHidden 
      ? '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg> Close guide <svg class="octicon" width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="m4.427 9.573 3.396-3.396a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427Z"/></svg>'
      : '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg> How it works <svg class="octicon" width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"/></svg>';
  }
}

function irFillChip(text, chipEl) {
  const input = document.getElementById('intent-input');
  if (!input) return;
  input.value = text;
  
  // Highlight active chip
  document.querySelectorAll('.ir-chip').forEach(c => c.classList.remove('active-chip'));
  if (chipEl) chipEl.classList.add('active-chip');

  irUpdateCharCount(input);
  input.focus();
  // Execute immediately (0ms instant response)
  runIntentRouter();
}

function irUpdateCharCount(el) {
  const countEl = document.getElementById('ir-char-count');
  const liveEl = document.getElementById('ir-live-text');
  const statusWrap = document.getElementById('ir-live-status');
  if (!countEl || !liveEl) return;

  const len = el.value.trim().length;
  if (len === 0) {
    countEl.textContent = 'Press Enter to match';
    liveEl.textContent = 'Enter project goals or pick a template';
    if (statusWrap) statusWrap.className = 'ir-live-status';
  } else {
    countEl.textContent = `${len} chars - Enter to stage`;
    // Fast real-time match evaluation
    const matches = scoreIntentText(el.value);
    if (matches.length > 0) {
      const activeIds = new Set();
      matches.forEach(m => m.skills.forEach(rawId => {
        const s = findSkillById(rawId);
        if (s) activeIds.add(s.id);
      }));
      const topReason = matches[0].reason.split('/')[0].trim();
      liveEl.textContent = `Matched: ${activeIds.size} skills in ${topReason}`;
      if (statusWrap) statusWrap.className = 'ir-live-status has-matches';
    } else {
      liveEl.textContent = 'Type tech terms (e.g. GSAP, React, PR review, MCP, Laya)';
      if (statusWrap) statusWrap.className = 'ir-live-status';
    }
  }
}

function runIntentRouter() {
  const input = document.getElementById('intent-input');
  const resultsEl = document.getElementById('intent-results');
  const thinkingEl = document.getElementById('ir-thinking');
  const analyzeBtn = document.getElementById('ir-analyze-btn');
  const text = (input ? input.value : '').trim();

  if (!text) {
    showToast('Enter your project goals first or click a template!');
    input && input.focus();
    return;
  }

  if (thinkingEl) thinkingEl.classList.remove('active');

  try {
    const matches = scoreIntentText(text);

    if (matches.length === 0) {
      resultsEl.style.display = 'block';
      resultsEl.innerHTML = `<div style="padding:12px;background:var(--bg-subtle);border:1px solid var(--border-default);border-radius:6px;font-size:11.5px;color:var(--fg-muted);text-align:center;">
        <svg class="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="color:var(--accent-orange);margin-bottom:4px;"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg><br>
        <strong>No domain patterns matched.</strong><br>
        Try adding descriptive terms like <em>GSAP, React, mobile, Swift, PR review, security audit, MCP, token compaction, trading...</em>
      </div>`;
      return;
    }

    // Collect matching skill IDs using robust resolver
    const toActivate = new Set();
    matches.forEach(m => m.skills.forEach(rawId => {
      const skill = findSkillById(rawId);
      if (skill) toActivate.add(skill.id);
    }));

    sel.clear();
    let activatedCount = 0;
    toActivate.forEach(id => {
      sel.add(id);
      activatedCount++;
    });

    updateUI();

    const stagedSkills = ALL_SKILLS.filter(s => toActivate.has(s.id));
    const stagedRules = generateActiveRules(stagedSkills);
    const stagedTokens = activatedCount > 0 ? countBpeTokens(stagedRules) : 0;
    const savingPct = activatedCount > 0 
      ? Math.max(0, Math.min(100, Math.round(((FULL_SUITE_RULES_TOKENS - stagedTokens) / FULL_SUITE_RULES_TOKENS) * 100)))
      : 0;

    // Build rich category cards showing EXACT matched skills with canonical names
    const cardsHTML = matches.map(m => {
      const color = IR_COLORS[m.id] || '#0969da';
      const skillBadges = m.skills.map(rawId => {
        const s = findSkillById(rawId);
        const id = s ? s.id : rawId;
        const name = s ? s.name : rawId;
        return `<span class="ir-skill-badge" onclick="openInspect('${id}')" title="Click to inspect ${name} full instructions">${name} <svg class="octicon" width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.5.75a.75.75 0 0 1 .75-.75h3.25a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V4.56l-4.47 4.47a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l4.47-4.47h-1.44a.75.75 0 0 1-.75-.75Z"/></svg></span>`;
      }).join('');

      return `<div class="ir-cat-card">
        <div class="ir-cat-row">
          <div class="ir-cat-dot" style="background:${color};"></div>
          <span class="ir-cat-reason">${m.reason}</span>
        </div>
        <div class="ir-cat-meta">
          Keywords: <span class="ir-cat-hits">${m.hits.join(', ')}</span>
        </div>
        <div class="ir-skill-list">
          ${skillBadges}
        </div>
      </div>`;
    }).join('');

    _irCollapsed = false;
    resultsEl.style.display = 'block';

    const statusBannerHTML = activatedCount > 0
      ? `<div class="ir-status-staged">
          <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
          <span>${activatedCount} Skills Auto-Staged in Current Selection</span>
        </div>`
      : `<div class="ir-status-staged" style="background:rgba(217,119,6,0.12);border-color:rgba(217,119,6,0.3);color:var(--accent-orange,#d97706);">
          <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
          <span>0 active skills staged ??? try broader keywords</span>
        </div>`;

    const tokenLabelHTML = activatedCount > 0
      ? `<strong>${savingPct}% leaner vs full suite</strong>`
      : `<strong>No skills staged</strong>`;

    resultsEl.innerHTML = `
      ${statusBannerHTML}

      <div class="ir-token-bar" onclick="openTokenInspectorModal()" style="cursor:pointer;" title="Click for live context window token math">
        <div class="ir-token-label">
          <span>Context Window Optimization</span>
          ${tokenLabelHTML}
        </div>
        <div class="ir-token-track">
          <div class="ir-token-fill" id="ir-token-fill" style="width:0%"></div>
        </div>
        <div style="font-size:10px;color:var(--fg-muted);margin-top:4px;display:flex;justify-content:space-between;">
          <span>Staged Rules: ~${stagedTokens.toLocaleString()} tokens</span>
          <span>Baseline Suite: ~${FULL_SUITE_RULES_TOKENS.toLocaleString()} tokens</span>
        </div>
      </div>

      <div class="ir-results-header">
        <div class="ir-results-summary">
          <span>Activated Categories (${matches.length})</span>
        </div>
        <span class="ir-results-collapse" onclick="irToggleCollapse(this)" id="ir-collapse-btn">Hide details</span>
      </div>

      <div class="ir-result-body" id="ir-result-body">
        ${cardsHTML}
      </div>

      <div class="ir-results-actions">
        <button class="btn-gh btn-gh-primary" style="flex:1;" onclick="applySkills()" id="ir-direct-apply">
          <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
          Apply to Memory
        </button>
        <button class="btn-gh" onclick="copyContextPrompt()" title="Copy active markdown context prompt to clipboard">
          Copy Prompt
        </button>
      </div>

      <div class="ir-footer-note">
        ${activatedCount} of ${ALL_SKILLS.length} skills active &middot; Target: <code>~/.gemini/config/rules/active-skills.md</code>
      </div>
    `;

    requestAnimationFrame(() => {
      const fill = document.getElementById('ir-token-fill');
      if (fill) fill.style.width = savingPct + '%';
    });

    if (activatedCount > 0) {
      showToast(`??? Staged ${activatedCount} matching skills in active workspace selection!`);
    }
  } catch (err) {
    console.error('Task-to-Skill Matcher execution error:', err);
    showToast('Matching error: ' + err.message);
  } finally {
    if (thinkingEl) thinkingEl.classList.remove('active');
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 0a6.5 6.5 0 0 1 5.31 10.25l3.22 3.22a.75.75 0 1 1-1.06 1.06l-3.22-3.22A6.5 6.5 0 1 1 6.5 0Zm0 1.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm.25 2a.75.75 0 0 1 .75.75v1.75H9.25a.75.75 0 0 1 0 1.5H7.5v1.75a.75.75 0 0 1-1.5 0V7.5H4.25a.75.75 0 0 1 0-1.5H6V3.75a.75.75 0 0 1 .75-.75Z"/></svg> Analyze & Auto-Stage';
    }
  }
}

function irToggleCollapse(btn) {
  const body = document.getElementById('ir-result-body');
  if (!body) return;
  if (body.style.display === 'none') {
    body.style.display = 'flex';
    if (btn) btn.textContent = 'Hide details';
  } else {
    body.style.display = 'none';
    if (btn) btn.textContent = 'Show details';
  }
}

function copyContextPrompt() {
  copyActivePrompt();
}

function clearIntentRouter() {
  const input = document.getElementById('intent-input');
  const resultsEl = document.getElementById('intent-results');
  const thinkingEl = document.getElementById('ir-thinking');
  const liveEl = document.getElementById('ir-live-text');
  const countEl = document.getElementById('ir-char-count');
  const statusWrap = document.getElementById('ir-live-status');

  if (input) input.value = '';
  if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }
  if (thinkingEl) thinkingEl.classList.remove('active');
  if (liveEl) liveEl.textContent = 'Enter project goals or pick a template';
  if (countEl) countEl.textContent = 'Press Enter to match';
  if (statusWrap) statusWrap.className = 'ir-live-status';

  document.querySelectorAll('.ir-chip').forEach(c => c.classList.remove('active-chip'));
  showToast('Cleared matcher input and staged results.');
}


// ========================================================
// EXTENDED PRODUCTION ENGINE: SYNC, PRESETS, LAYA & READER
// ========================================================



// --- Universal Markdown Formatter ---
function formatMarkdown(md) {
  if (!md) return '<div style="color:var(--fg-muted);padding:20px;text-align:center;">No markdown content available.</div>';
  let clean = md.replace(/^---[\s\S]*?---\s*/, '');
  clean = clean.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  clean = clean.replace(/```([a-zA-Z0-9_\-\.]*)\n([\s\S]*?)```/g, function(m, lang, code) {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });
  clean = clean.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  clean = clean.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  clean = clean.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  clean = clean.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  clean = clean.replace(/\*(.*?)\*/g, '<em>$1</em>');
  clean = clean.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  clean = clean.replace(/(<li>.*<\/li>)/gims, function(match) { return '<ul>' + match + '</ul>'; });
  clean = clean.replace(/<\/ul>\s*<ul>/g, '');
  clean = clean.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent-blue);text-decoration:underline;">$1</a>');
  clean = clean.replace(/\n\n+/g, '<br><br>');
  return clean;
}

// --- Live Server Sync ---