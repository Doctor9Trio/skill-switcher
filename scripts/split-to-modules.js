/**
 * split-to-modules.js
 * Splits the monolithic index.html into a clean modular structure:
 *   css/primer-tokens.css
 *   css/layout.css
 *   css/components.css
 *   js/data/repos-catalog.js
 *   js/data/presets.js
 *   js/state/store.js
 *   js/services/key-vault.js
 *   js/services/api-client.js
 *   js/services/telemetry.js
 *   js/ui/render-feed.js
 *   js/ui/render-modals.js
 *   js/ui/app.js
 *
 * Run from Skills-Switcher directory:
 *   node scripts/split-to-modules.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Always read from the original monolith backup (index.html.bak)
// If backup doesn't exist, fall back to index.html (only works if it's still the monolith)
const BAK  = path.join(ROOT, 'index.html.bak');
const SRC  = fs.existsSync(BAK) ? BAK : path.join(ROOT, 'index.html');

console.log('Reading index.html...');
const raw   = fs.readFileSync(SRC, 'utf8');
const lines = raw.split('\n');
const total = lines.length;
console.log(`Total lines: ${total}`);

// ─── Helper ────────────────────────────────────────────────────────────────
function mkdir(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  return p;
}
function write(rel, content) {
  const p = path.join(ROOT, rel);
  fs.writeFileSync(p, content, 'utf8');
  const kb = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
  console.log(`  ✓  ${rel}  (${content.split('\n').length} lines, ${kb} KB)`);
}
// Extract lines [start..end] (1-based, inclusive)
function extract(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

// ─── Known line boundaries (from analysis) ─────────────────────────────────
// Line 1-10:   HTML head (before <style>)
// Line 11:     <style>
// Line 12-2279: CSS content
// Line 2280:   </style>
// Line 2281-3159: HTML body markup
// Line 3160:   <script>
// Line 3161-8399: JS content
// Line 8400:   </script>
// Line 8401-8465: closing html tags

const CSS_START   = 12;     // first CSS line after <style>
const CSS_END     = 2279;   // last CSS line before </style>
const HTML_START  = 2281;   // first HTML body line
const HTML_END    = 3159;   // last HTML body line (before <script>)
const JS_START    = 3161;   // first JS line after <script>
const JS_END      = 8399;   // last JS line before </script>

// CSS sub-sections (by visual section names found in comments)
// Tokens/base: L12-L145 (GITHUB PRIMER DESIGN SYSTEM + SCROLLBARS)
// Layout:      L146-L831 (NAVBAR, KEY VAULT, SUBNAV, THREE-COLUMN, LEFT SIDEBAR)
// Components:  L832-L2279 (CENTER FEED, SKILL CARDS, RIGHT SIDEBAR, DOCK, MODALS, TELEMETRY, TYPOGRAPHY)

const CSS_TOKENS_END   = 145;
const CSS_LAYOUT_END   = 831;
const CSS_COMP_END     = CSS_END;

// JS sub-sections (function mapping from analysis)
// Data:        L3161-L5272 (REPOS array, WORKFLOW_PRESETS, CATEGORIES, SUB_CATEGORIES)
// State:       L5273-L5899 (Redux factory, rootReducer, helpers, persistence)
// Key-vault:   L5900-L6619 (getSkillCredentialInfo thru deleteCustomVaultKey + copyAllEnvSnippet)
// API-client:  L6620-L7900 (server sync, initServerSync, applySkills, clearDiskMemory, presets, loadSkillContent, laya, health)
// Telemetry:   L7901-L8380 (openTelemetryModal thru updateGlobalTelemetryBadges)
// App entry:   L8381-L8399 (window.addEventListener, keyboard shortcut)

// Render-feed: L6800-L7010 (renderLeftNav, renderCenter, filter helpers)
// BUT — these overlap with key-vault range above. Let's use the actual function list:
//
// key-vault.js:   getSkillCredentialInfo(5912)..deleteCustomVaultKey(6491)+copyAllEnvSnippet(6501)+saveSkillApiKey(6522)..updateModalApiKeySection(6594)
// render-feed.js: openJevGuide(6594)+closeJevGuide..selectRepoNav..renderLeftNav(6733)..renderCenter(6800)..countBpeTokens(7001)..openTokenInspectorModal(7027)..renderTokenInspectorContent(7043)..updateUI(7080)..generateActiveRules(7111)..applySkills(7128)..copyActivePrompt(7157)..copySnippetText..copyLungyPrompt..showToast(7191)
// render-modals.js: openInspect(7206)..closeModal..updateModalBtn..toggleModalActiveSkill..findSkillById..scoreIntentText..toggleIrHowDrawer..irFillChip..irUpdateCharCount..runIntentRouter..irToggleCollapse..copyContextPrompt..clearIntentRouter..formatMarkdown(7713)
// api-client.js:  initServerSync(7735)..updateDiskStatusBadge..syncFromDiskMemory..clearDiskMemory..applyPreset(7830)..saveCustomPreset..loadCustomPreset..switchModalTab..loadSkillContent..copySkillManualText..openLayaPlayground..closeLayaPlaygroundDirect..closeLayaPlayground..setLayaTestText..executeLayaPlayground..openHealthModal..closeHealthModalDirect..closeHealthModal..renderHealthTable (to 8115)
// telemetry.js:   openTelemetryModal(8116)..closeTelemetryModal..closeTelemetryModalOnBackdrop..setTelemetryCurrency..changeTelemetryModel..changeTelemetrySession..fetchSessionTelemetry..syncSessionDropdown..renderTelemetryUI..updateGlobalTelemetryBadges (to 8380)
// app.js:         window.addEventListener('focus'...) and closing (8381-8399)

// Precise JS boundaries
const JS_DATA_START   = JS_START;
const JS_DATA_END     = 5272;

const JS_STATE_START  = 5273;
const JS_STATE_END    = 5911;

const JS_KV_START     = 5912;
const JS_KV_END       = 6616;

const JS_FEED_START   = 6617;
const JS_FEED_END     = 7205;

const JS_MOD_START    = 7206;
const JS_MOD_END      = 7734;

const JS_API_START    = 7735;
const JS_API_END      = 8115;

const JS_TEL_START    = 8116;
const JS_TEL_END      = 8380;

const JS_APP_START    = 8381;
const JS_APP_END      = JS_END;

// ─── Create directories ────────────────────────────────────────────────────
mkdir('css');
mkdir('js/data');
mkdir('js/state');
mkdir('js/services');
mkdir('js/ui');
mkdir('pages');
mkdir('scripts');

// ─── CSS Files ─────────────────────────────────────────────────────────────
write('css/primer-tokens.css',
  '/* Skill Switcher — Design Tokens & Base Styles */\n/* GitHub Primer Color System, Typography, Dark Mode */\n\n' +
  extract(CSS_START, CSS_TOKENS_END)
);

write('css/layout.css',
  '/* Skill Switcher — Layout & Navigation */\n/* Navbar, Sidebar, Three-Column Grid, Subnav */\n\n' +
  extract(CSS_TOKENS_END + 1, CSS_LAYOUT_END)
);

write('css/components.css',
  '/* Skill Switcher — UI Components */\n/* Cards, Modals, Badges, Telemetry, Animations, Typography */\n\n' +
  extract(CSS_LAYOUT_END + 1, CSS_COMP_END)
);

// ─── JS Data Files ─────────────────────────────────────────────────────────
// REPOS, WORKFLOW_PRESETS, CATEGORIES etc
const dataBlock = extract(JS_DATA_START, JS_DATA_END);

// Split data block: presets file = everything before "const REPOS" in the block? 
// Actually REPOS is declared FIRST, then CATEGORIES and SUB_CATEGORIES come after.
// Let's find where SUB_CATEGORIES ends
const dataLines = dataBlock.split('\n');
let presetsStart = -1;
for (let i = 0; i < dataLines.length; i++) {
  if (dataLines[i].trim().startsWith('const WORKFLOW_PRESETS')) {
    presetsStart = i;
    break;
  }
}
if (presetsStart === -1) {
  // Write all data to one file
  write('js/data/repos-catalog.js', '/* Skill Switcher — Repository Catalog & Global Vars */\n\n' + dataBlock);
  write('js/data/presets.js', '/* Skill Switcher — Workflow Presets & Categories */\n// (merged into repos-catalog.js)\n');
} else {
  // repos-catalog.js gets: global var declarations + REPOS array (everything AFTER WORKFLOW_PRESETS)
  const reposPart    = dataLines.slice(0, presetsStart).join('\n');
  const presetsPart  = dataLines.slice(presetsStart).join('\n');
  
  // Find where REPOS array starts inside presetsBlock (it comes after WORKFLOW_PRESETS)
  const presetLines  = presetsPart.split('\n');
  let reposIdx = -1;
  for (let i = 0; i < presetLines.length; i++) {
    if (presetLines[i].trim().startsWith('const REPOS')) { reposIdx = i; break; }
  }
  
  if (reposIdx === -1) {
    // REPOS not found in presets block — write everything as presets
    write('js/data/repos-catalog.js',
      '/* Skill Switcher — Repository Catalog (Global Vars) */\n/* Contains: global var declarations */\n\n' + reposPart);
    write('js/data/presets.js',
      '/* Skill Switcher — Workflow Presets, Categories & Repository Catalog */\n/* Contains: WORKFLOW_PRESETS, REPOS array, CATEGORIES, SUB_CATEGORIES */\n\n' + presetsPart);
  } else {
    // Split: presets.js gets WORKFLOW_PRESETS block, repos-catalog.js gets REPOS + the global vars
    const workflowPart = presetLines.slice(0, reposIdx).join('\n');
    const reposOnlyPart = presetLines.slice(reposIdx).join('\n');
    write('js/data/repos-catalog.js',
      '/* Skill Switcher — Repository Catalog & Global Vars */\n/* Contains: global var declarations + REPOS array (62+ skill repos) */\n\n' +
      reposPart + '\n\n' + reposOnlyPart
    );
    write('js/data/presets.js',
      '/* Skill Switcher — Workflow Presets & Category Filters */\n/* Contains: WORKFLOW_PRESETS, CATEGORIES, SUB_CATEGORIES */\n\n' +
      workflowPart
    );
  }
}

// ─── JS State ──────────────────────────────────────────────────────────────
write('js/state/store.js',
  '/* Skill Switcher — Redux State Engine */\n/* Contains: createReduxStore factory, rootReducer, localStorage persistence */\n\n' +
  extract(JS_STATE_START, JS_STATE_END)
);

// ─── JS Services ───────────────────────────────────────────────────────────
write('js/services/key-vault.js',
  '/* Skill Switcher — Key Vault & Credential Service */\n/* Contains: getSkillCredentialInfo, renderSkillHeaderKeyBadge, openDirectSkillCredentialModal, */\n/*           saveSkillCredentials, getCustomVaultKeys, getAllVaultKeys, openKeyVaultModal, */\n/*           renderKeyVaultList, saveKeyVaultEntry, clearKeyVaultEntry, addCustomKeyFromVault, */\n/*           saveSkillApiKey, clearSkillApiKey, updateModalApiKeySection */\n\n' +
  extract(JS_KV_START, JS_KV_END)
);

write('js/services/api-client.js',
  '/* Skill Switcher — Server API Client */\n/* Contains: initServerSync, syncFromDiskMemory, clearDiskMemory, */\n/*           applyPreset, saveCustomPreset, loadCustomPreset, loadSkillContent, */\n/*           executeLayaPlayground, openHealthModal, renderHealthTable */\n\n' +
  extract(JS_API_START, JS_API_END)
);

write('js/services/telemetry.js',
  '/* Skill Switcher — Live Telemetry & INR Cost Engine */\n/* Contains: openTelemetryModal, fetchSessionTelemetry, renderTelemetryUI, */\n/*           updateGlobalTelemetryBadges, setTelemetryCurrency, changeTelemetryModel */\n\n' +
  extract(JS_TEL_START, JS_TEL_END)
);

// ─── JS UI ─────────────────────────────────────────────────────────────────
write('js/ui/render-feed.js',
  '/* Skill Switcher — Feed Renderer & Filter Engine */\n/* Contains: renderLeftNav, renderCenter, getFilteredRepos, getFilteredSkills, */\n/*           toggleRepoCollapse, toggleSkill, getRepoCredentialInfo, renderRepoHeaderKeyBadge, */\n/*           openTokenInspectorModal, updateUI, generateActiveRules, applySkills, showToast */\n\n' +
  extract(JS_FEED_START, JS_FEED_END)
);

write('js/ui/render-modals.js',
  '/* Skill Switcher — Modal & Intent Router UI */\n/* Contains: openInspect, closeModal, updateModalBtn, toggleModalActiveSkill, */\n/*           findSkillById, scoreIntentText, runIntentRouter, formatMarkdown */\n\n' +
  extract(JS_MOD_START, JS_MOD_END)
);

write('js/ui/app.js',
  '/* Skill Switcher — Application Entry Point */\n/* Contains: window.addEventListener focus/keyboard, startup event handlers */\n\n' +
  extract(JS_APP_START, JS_APP_END)
);

// ─── Build new index.html ─────────────────────────────────────────────────
// bodyLines = HTML body content (navbars, sidebars, all inline modals from L2281 to L8399 end)
// We include EVERYTHING from the HTML body (L2281) through the old </script> (L8400) as body
// Then append our JS scripts before </body></html>
// The original file structure is: HTML body (L2281) → </style> (L2280 was end of CSS, so body is L2281) → <script>(L3160) → JS(L3161-L8399) → </script>(L8400) → more HTML modals → </body></html>
// We need to:
//   - Use the HTML that was BEFORE the <script> block as the body (L2281-L3159)
//   - Also grab any HTML AFTER </script> (L8401 onwards until </html>)
const bodyLines   = lines.slice(HTML_START - 1, HTML_END).join('\n'); // Lines 2281-3159
// After </script> tag (line 8400, index 8399) there may be more HTML modals
const afterScriptLines = lines.slice(8400).join('\n'); // Lines 8401+ (Laya modal, Health modal, </body></html>)

const newIndex = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Doctor9Trio / skill-switcher</title>
<meta name="description" content="Skill Switcher — Live Antigravity IDE skill manager with token telemetry, key vault, and INR cost monitor.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<!-- External Dependencies -->
<script src="https://unpkg.com/redux@4.2.1/dist/redux.min.js"></script>

<!-- Skill Switcher Stylesheets (load order: tokens → layout → components) -->
<link rel="stylesheet" href="css/primer-tokens.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
</head>
<body>

${bodyLines}

<!-- Skill Switcher JavaScript (load order: data → state → services → ui) -->
<!-- 1. Data: static catalog, presets, categories -->
<script src="js/data/repos-catalog.js"></script>
<script src="js/data/presets.js"></script>

<!-- 2. State: Redux store, reducers, localStorage persistence -->
<script src="js/state/store.js"></script>

<!-- 3. Services: key vault, server API, telemetry engine -->
<script src="js/services/key-vault.js"></script>
<script src="js/services/api-client.js"></script>
<script src="js/services/telemetry.js"></script>

<!-- 4. UI: feed renderer, modal handler, app entry -->
<script src="js/ui/render-feed.js"></script>
<script src="js/ui/render-modals.js"></script>
<script src="js/ui/app.js"></script>

${afterScriptLines}`;

write('index.html', newIndex);

// ─── Copy index.html → skill-gui.html ─────────────────────────────────────
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(ROOT, 'skill-gui.html'));
console.log('  ✓  skill-gui.html (mirror copy)');

console.log('\n✅ Modular split complete!');
console.log('   Open http://localhost:7891 to verify.');
console.log('\n   File structure created:');
console.log('   css/primer-tokens.css');
console.log('   css/layout.css');
console.log('   css/components.css');
console.log('   js/data/repos-catalog.js');
console.log('   js/data/presets.js');
console.log('   js/state/store.js');
console.log('   js/services/key-vault.js');
console.log('   js/services/api-client.js');
console.log('   js/services/telemetry.js');
console.log('   js/ui/render-feed.js');
console.log('   js/ui/render-modals.js');
console.log('   js/ui/app.js');
console.log('   index.html (clean shell)');
console.log('   skill-gui.html (mirror)');
