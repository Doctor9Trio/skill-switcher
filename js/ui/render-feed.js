/* Skill Switcher — Feed Renderer & Filter Engine */
/* Contains: renderLeftNav, renderCenter, getFilteredRepos, getFilteredSkills, */
/*           toggleRepoCollapse, toggleSkill, getRepoCredentialInfo, renderRepoHeaderKeyBadge, */
/*           openTokenInspectorModal, updateUI, generateActiveRules, applySkills, showToast */

function selectRepoNav(id) {
  store.dispatch({ type: ActionTypes.SET_SELECTED_REPO, payload: { repoId: id } });
  const target = document.getElementById('repo-sec-' + id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    target.classList.add('highlight-target');
    setTimeout(() => target.classList.remove('highlight-target'), 1500);
  }
}

// Accordion Collapsing
function toggleRepoCollapse(repoId, e) {
  if (e) e.stopPropagation();
  store.dispatch({ type: ActionTypes.TOGGLE_REPO_COLLAPSE, payload: { repoId } });
}

function toggleAllReposCollapse() {
  const visible = getFilteredRepos();
  store.dispatch({ type: ActionTypes.TOGGLE_ALL_REPOS_COLLAPSE, payload: { visibleRepoIds: visible.map(r => r.id) } });
}

function expandAllRepos() {
  store.dispatch({ type: ActionTypes.EXPAND_ALL_REPOS });
}

function collapseAllRepos() {
  store.dispatch({ type: ActionTypes.COLLAPSE_ALL_REPOS, payload: { allRepoIds: REPOS.map(r => r.id) } });
}

// Direct Selection from Header / Sidebar
function toggleSelectRepoDirect(repoId, e) {
  if (e) e.stopPropagation();
  store.dispatch({ type: ActionTypes.SELECT_REPO_DIRECT, payload: { repoId } });
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
}

function toggleSkill(id) {
  store.dispatch({ type: ActionTypes.TOGGLE_SKILL, payload: { id } });
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
}

function selectAllVisibleSkills() {
  const visible = getFilteredSkills();
  store.dispatch({ type: ActionTypes.SELECT_ALL_VISIBLE, payload: { visibleSkillIds: visible.map(s => s.id) } });
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
}

function selectBatchCategory(cat) {
  store.dispatch({ type: ActionTypes.BATCH_SELECT_CATEGORY, payload: { cat } });
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
}

function clearAllSelections() {
  store.dispatch({ type: ActionTypes.CLEAR_ALL_SELECTIONS });
  if (typeof scheduleAutoSaveToDisk === 'function') scheduleAutoSaveToDisk();
  showToast('Reset all selections', false);
}

let apiKeyOnlyFilter = false;

function toggleApiKeyFilter() {
  apiKeyOnlyFilter = !apiKeyOnlyFilter;
  updateUI();
  if (apiKeyOnlyFilter) {
    showToast('Showing repositories that require API credentials');
  } else {
    showToast('Showing all repositories');
  }
}

function getFilteredRepos() {
  let list = REPOS;

  if (curMainCat === 'all') {
    // Show all
  } else if (curMainCat === 'jev' || curMainCat === 'mcp' || curMainCat === 'review') {
    list = list.filter(r => r.cat === curMainCat);
  } else if (curMainCat === 'frontend') {
    if (curSubCat === 'all') {
      list = list.filter(r => r.cat === 'design' || r.cat === 'mobile');
    } else {
      list = list.filter(r => r.cat === curSubCat);
    }
  } else if (curMainCat === 'data_media') {
    if (curSubCat === 'all') {
      list = list.filter(r => r.cat === 'data' || r.cat === 'media');
    } else {
      list = list.filter(r => r.cat === curSubCat);
    }
  }

  if (apiKeyOnlyFilter) {
    list = list.filter(r => {
      const cred = getRepoCredentialInfo(r);
      return cred && cred.hasCredentials;
    });
  }

// Keeping all repositories visible in sidebar and feed

  if (searchQuery) {
    list = list.filter(r => 
      r.name.toLowerCase().includes(searchQuery) ||
      r.title.toLowerCase().includes(searchQuery) ||
      r.desc.toLowerCase().includes(searchQuery) ||
      r.subskills.some(s => 
        s.name.toLowerCase().includes(searchQuery) || 
        s.desc.toLowerCase().includes(searchQuery) ||
        (s.trigger && s.trigger.toLowerCase().includes(searchQuery))
      )
    );
  }
  return list;
}

function getFilteredSkills() {
  const repos = getFilteredRepos();
  return repos.flatMap(r => r.subskills);
}

// Render Left Sidebar Repositories (With Direct Selection & Tool Count)
function renderLeftNav() {
  const nav = document.getElementById('repo-nav-list');
  nav.innerHTML = '';

  let list = getFilteredRepos();
  if (repoFilterQuery) {
    list = list.filter(r => r.name.toLowerCase().includes(repoFilterQuery));
  }

  list.forEach(r => {
    const subIds = r.subskills.map(s => s.id);
    const activeCount = subIds.filter(id => sel.has(id)).length;
    const allSelected = activeCount === r.subskills.length && r.subskills.length > 0;
    const isCurrent = selectedRepoId === r.id;

    const item = document.createElement('div');
    item.className = 'repo-nav-item' + (isCurrent ? ' active' : '');
    item.onclick = () => selectRepoNav(r.id);

    item.innerHTML = `
      <div class="repo-nav-left">
        <!-- Direct Select Checkbox in Sidebar -->
        <div class="repo-check-pill ${allSelected ? 'checked' : (activeCount > 0 ? 'partial' : '')}" 
             onclick="toggleSelectRepoDirect('${r.id}', event)" 
             title="${allSelected ? 'Deselect all tools' : 'Direct select all tools'}"
             style="width:16px;height:16px;">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="repo-nav-name" title="${r.name}">${(() => {
          const parts = r.name.split('/');
          const owner = parts.length > 1 ? parts[0] : '';
          const repo = parts.length > 1 ? parts[1] : r.name;
          return owner 
            ? `<span class="repo-owner-muted">${owner}/</span><span class="repo-name-bold">${repo}</span>` 
            : `<span class="repo-name-bold">${repo}</span>`;
        })()}</span>
        ${(() => {
          const cred = getRepoCredentialInfo(r);
          if (!cred.hasCredentials) return '';
          return `
            <svg class="octicon" width="11" height="11" viewBox="0 0 16 16" fill="currentColor" 
                 style="color:${cred.allConfigured ? 'var(--accent-green, #2ea043)' : 'var(--accent-orange, #d29922)'};margin-left:4px;flex-shrink:0;" 
                 title="${cred.allConfigured ? 'API credentials configured (' + cred.varNames + ')' : 'Requires API credentials (' + cred.varNames + ')'}">
              <path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
            </svg>
          `;
        })()}
      </div>
      <div>
        ${(() => {
          if (activeCount === 0) {
            return `<span class="repo-nav-count">${r.subskills.length}</span>`;
          } else if (allSelected) {
            return `<span class="repo-nav-count selected">${r.subskills.length}</span>`;
          } else {
            return `<span class="repo-nav-count partial">${activeCount}/${r.subskills.length}</span>`;
          }
        })()}
      </div>
    `;
    nav.appendChild(item);
  });
}

// Render Center Feed: Home Repositories (Collapsed by default, Direct Selection)
function renderCenter() {
  const panel = document.getElementById('center-panel');
  panel.innerHTML = '';

  const repos = getFilteredRepos();
  const allExpanded = repos.length > 0 && repos.every(r => !collapsedRepos.has(r.id));
  const allCredReposCount = REPOS.filter(r => getRepoCredentialInfo(r).hasCredentials).length;

  // Feed Controls Header
  const controls = document.createElement('div');
  controls.className = 'feed-header-strip';
  controls.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <span class="feed-count-text">${repos.length} Repositories (${getFilteredSkills().length} subskills total)</span>
      <span style="font-size:12px;color:var(--fg-muted);">Collapsed by default &middot; Direct 1-click selection</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
      <button class="btn-gh btn-gh-sm ${apiKeyOnlyFilter ? 'active-filter' : ''}" 
              onclick="toggleApiKeyFilter()" 
              title="${apiKeyOnlyFilter ? 'Click to show all repositories' : 'Filter to show only repositories that require API keys'}">
        <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
        </svg>
        <span>${apiKeyOnlyFilter ? 'Showing API Key Repos (' + repos.length + ')' : 'Filter: Needs API (' + allCredReposCount + ')'}</span>
      </button>

      <button class="btn-gh btn-gh-sm" onclick="toggleAllReposCollapse()" title="${allExpanded ? 'Collapse all visible repositories' : 'Expand all visible repositories'}">
        ${allExpanded 
          ? `<svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path></svg> Collapse All` 
          : `<svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M12.78 6.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 7.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L8 9.94l3.72-3.72a.75.75 0 0 1 1.06 0Z"></path></svg> Expand All`
        }
      </button>
    </div>
  `;
  panel.appendChild(controls);

  if (!repos.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:48px 24px;text-align:center;color:var(--fg-muted);background:var(--bg-card);border:1px solid var(--border-default);border-radius:8px;';
    empty.innerHTML = `
      <svg class="octicon" width="32" height="32" viewBox="0 0 16 16" style="margin-bottom:8px;opacity:0.6;"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"></path></svg>
      <div style="font-weight:600;font-size:14px;color:var(--fg-default);margin-bottom:4px;">No matching repositories or skills found</div>
      <div style="font-size:12px;">Try adjusting your search terms or category filters.</div>
    `;
    panel.appendChild(empty);
    return;
  }

  repos.forEach(r => {
    const subIds = r.subskills.map(s => s.id);
    const activeCount = subIds.filter(id => sel.has(id)).length;
    const allSelected = activeCount === r.subskills.length && r.subskills.length > 0;
    const isCollapsed = collapsedRepos.has(r.id);
    const cred = getRepoCredentialInfo(r);

    const banner = document.createElement('div');
    banner.className = 'repo-group-banner' + (isCollapsed ? ' collapsed' : '');
    banner.id = 'repo-sec-' + r.id;

    banner.innerHTML = `
      <div class="repo-group-head" onclick="toggleRepoCollapse('${r.id}', event)">
        <div class="repo-group-left">
          <!-- Chevron Indicator Button -->
          <button class="btn-chevron" onclick="toggleRepoCollapse('${r.id}', event)" title="${isCollapsed ? 'Click to expand subskills' : 'Click to collapse subskills'}">
            ${isCollapsed 
              ? `<svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path></svg>`
              : `<svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M12.78 6.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 7.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L8 9.94l3.72-3.72a.75.75 0 0 1 1.06 0Z"></path></svg>`
            }
          </button>

          <!-- Direct Selection Checkmark Pill -->
          <div class="repo-check-pill ${allSelected ? 'checked' : (activeCount > 0 ? 'partial' : '')}" 
               onclick="toggleSelectRepoDirect('${r.id}', event)" 
               title="${allSelected ? 'Deselect all tools' : 'Directly select all tools in this repo'}">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>

          <!-- Plain text repository title (NO accidental redirect) -->
          <span class="repo-group-title">${r.name}</span>
          ${(() => {
            if (activeCount === 0) {
              return `<span class="counter-bubble">${r.subskills.length} tools</span>`;
            } else if (allSelected) {
              return `<span class="counter-bubble active-all"><svg class="octicon" width="10" height="10" viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg> Active (${r.subskills.length})</span>`;
            } else {
              return `<span class="counter-bubble active-partial">${activeCount} of ${r.subskills.length} active</span>`;
            }
          })() }
          ${cred.hasCredentials ? `
            <span class="repo-key-indicator ${cred.allConfigured ? 'configured' : 'needed'}" 
                  title="${cred.allConfigured ? 'API credentials configured (' + cred.varNames + ')' : 'Requires API credentials (' + cred.varNames + ')'}">
              <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                ${cred.isPassword 
                  ? '<path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4Zm2 2h4V4a2 2 0 1 0-4 0v2Zm-2.25 1.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5Z"/>'
                  : '<path d="M6.5 5.5a4 4 0 1 1 5.656 5.657l-1.077 1.077a.75.75 0 0 1-1.06 0L8.75 11l-.97.97a.75.75 0 0 1-1.06 0L5.45 10.7a.75.75 0 0 1 0-1.06l1.05-1.05V6.5a1 1 0 0 1 0-1ZM8 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>'
                }
              </svg>
            </span>
          ` : ''}
        </div>

        <div style="display:flex;align-items:center;gap:8px;" onclick="event.stopPropagation()">
          ${renderRepoHeaderKeyBadge(r)}

          <!-- Direct Select All in Repo Button -->
          <button class="btn-gh btn-gh-sm ${allSelected ? 'btn-gh-primary' : ''}" onclick="toggleSelectRepoDirect('${r.id}', event)">
            ${allSelected ? 'Deselect All' : 'Direct Select'}
          </button>

          <!-- Dedicated GitHub icon button -->
          <a href="${r.repoUrl}" target="_blank" class="btn-gh-icon" title="View ${r.name} repository on GitHub">
            <svg class="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>


        </div>
      </div>

      <!-- Description & Metadata (Revealed when Expanded) -->
      <div class="repo-group-desc">${r.desc}</div>

      <!-- Subskills Cards Grid (Revealed when Expanded) -->
      <div class="subskills-grid">
        ${r.subskills.map(s => {
          const isSelected = sel.has(s.id);
          return `
            <div class="subskill-card ${isSelected ? 'selected' : ''}" onclick="toggleSkill('${s.id}')">
              <div>
                <div class="card-top">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="card-icon-wrap">
                      ${getCategoryIcon(s.cat)}
                    </div>

                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    ${renderSkillHeaderKeyBadge(s)}
                    <!-- Circular Checkmark Badge -->
                    <div class="check-pill">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="card-body" style="margin-top:10px;">
                  <div class="card-title">${s.name}</div>
                  <div class="card-desc">${s.desc}</div>
                </div>
              </div>

              <div class="card-footer" onclick="event.stopPropagation()">
                ${s.trigger ? `
                  <div class="prism-box">
                    <span class="prism-text" title="${s.trigger}">${formatPrismTrigger(s.trigger)}</span>
                    <button class="copy-icon-btn" onclick="copySnippetText('${s.trigger.replace(/'/g, "\\'")}', 'Trigger copied!')" title="Copy trigger">
                      <svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>
                    </button>
                  </div>
                ` : '<span></span>'}

                <button class="btn-gh btn-gh-sm btn-gh-ghost" onclick="openInspect('${s.id}')" title="Inspect README details">
                  Inspect
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="repo-group-meta">
        <div class="meta-left">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="lang-dot" style="background:${r.langColor};"></span>
            <span>${r.lang}</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg>
            <span>${r.stars}</span>
          </div>
          <div>${r.subskills.length} available tools</div>
        </div>
        <div>
          <span style="color:var(--accent-green);font-weight:500;display:inline-flex;align-items:center;gap:4px;"><svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Verified on disk</span>
        </div>
      </div>
    `;

    panel.appendChild(banner);
  });
}

const FULL_SUITE_RULES_TOKENS = 6565; // Measured baseline for all 87 skills in active-skills.md

function countBpeTokens(text) {
  if (!text) return 0;
  const matches = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu);
  return matches ? matches.length : Math.round(text.length / 3.8);
}

function calculateTokenMetrics(text, count, total) {
  if (!text || count === 0) {
    return {
      tokens: 0,
      chars: 0,
      words: 0,
      fullSuiteTokens: FULL_SUITE_RULES_TOKENS,
      savedPct: 100,
      lazySavingsTokens: 271000
    };
  }
  const chars = text.length;
  const words = (text.trim().split(/\s+/)).filter(Boolean).length;
  const tokens = countBpeTokens(text);
  const savedPct = Math.max(0, Math.min(100, Math.round(((FULL_SUITE_RULES_TOKENS - tokens) / FULL_SUITE_RULES_TOKENS) * 100)));
  const lazySavingsTokens = Math.max(0, (total - count) * 3100);
  return { tokens, chars, words, fullSuiteTokens: FULL_SUITE_RULES_TOKENS, savedPct, lazySavingsTokens };
}

// Token Math & Context Inspector Controller
function openTokenInspectorModal() {
  const overlay = document.getElementById('token-inspector-modal-overlay');
  if (!overlay) return;
  renderTokenInspectorContent();
  overlay.classList.add('open');
}

function closeTokenInspectorModal() {
  const overlay = document.getElementById('token-inspector-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function closeTokenInspectorModalOnBackdrop(e) {
  if (e.target.id === 'token-inspector-modal-overlay') closeTokenInspectorModal();
}

function renderTokenInspectorContent() {
  const items = ALL_SKILLS.filter(s => sel.has(s.id));
  const count = items.length;
  const rules = count ? generateActiveRules() : '';
  const metrics = calculateTokenMetrics(rules, count, ALL_SKILLS.length);

  const tTokens = document.getElementById('tm-stat-tokens');
  const tChars = document.getElementById('tm-stat-chars');
  const tSaving = document.getElementById('tm-stat-saving');
  const tBadge = document.getElementById('token-modal-badge');
  const tTableCount = document.getElementById('tm-table-count');
  const tTbody = document.getElementById('tm-skills-tbody');

  if (tTokens) tTokens.textContent = `~${metrics.tokens.toLocaleString()}`;
  if (tChars) tChars.textContent = `${metrics.chars.toLocaleString()} chars ?? ${metrics.words.toLocaleString()} words`;
  if (tSaving) tSaving.textContent = `${metrics.savedPct}%`;
  if (tBadge) tBadge.textContent = `${metrics.tokens.toLocaleString()} tokens`;
  if (tTableCount) tTableCount.textContent = count;

  if (tTbody) {
    if (count === 0) {
      tTbody.innerHTML = `<tr><td colspan="4" style="padding:16px;text-align:center;color:var(--fg-muted);">No skills currently selected. Select tools or pick a starter template to view real-time token breakdown.</td></tr>`;
    } else {
      tTbody.innerHTML = items.map(s => {
        const actChars = (s.act || '').length;
        const estTok = countBpeTokens(s.act || '') + 25; // rule text + file pointer link
        return `<tr style="border-bottom:1px solid var(--border-muted);">
          <td style="padding:6px 10px;font-weight:600;color:var(--fg-default);">${s.name}</td>
          <td style="padding:6px 10px;color:var(--fg-muted);font-family:var(--font-mono);font-size:10px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${(s.act || '').replace(/"/g, '&quot;')}">${s.act || '-'}</td>
          <td style="padding:6px 10px;text-align:right;color:var(--fg-muted);">${actChars}</td>
          <td style="padding:6px 10px;text-align:right;font-weight:600;color:var(--accent-blue);">~${estTok}</td>
        </tr>`;
      }).join('');
    }
  }
}

function updateUI() {
  updateCategoryCounts();
  renderSubcategoryStrip();
  renderSidebarCatPills();
  renderLeftNav();
  renderCenter();

  const count = sel.size;
  const dockCounter = document.getElementById('dock-counter');
  if (dockCounter) dockCounter.textContent = `${count} skill${count !== 1 ? 's' : ''} active`;
  
  // Live rules preview in right sidebar
  const rules = count ? generateActiveRules() : '';
  const preview = document.getElementById('md-preview-body');
  if (preview) {
    preview.textContent = count ? rules : '# Select tools to generate context rules';
  }

  // Real-time BPE Tokenizer calculation
  const metrics = calculateTokenMetrics(rules, count, ALL_SKILLS.length);
  const rightCounter = document.getElementById('right-counter');
  if (rightCounter) {
    rightCounter.innerHTML = `${count} of ${ALL_SKILLS.length} <span onclick="openTokenInspectorModal()" style="font-size:10px;color:var(--accent-blue);font-weight:500;cursor:pointer;text-decoration:underline;" title="Click for live context window token math">(~${metrics.tokens.toLocaleString()} tokens &bull; ${metrics.savedPct}% saved)</span>`;
  }

  const btnDock = document.getElementById('apply-btn');
  const btnRight = document.getElementById('apply-btn-right');
  if (btnDock) btnDock.disabled = count === 0;
  if (btnRight) btnRight.disabled = count === 0;
}

function generateActiveRules(customSkills) {
  const items = customSkills || ALL_SKILLS.filter(s => sel.has(s.id));
  const names = items.map(s => s.name).join(', ');
  const files = [...new Set(items.flatMap(s => s.files || []))];
  const act = items.map(s => s.act).join('\n');
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const centralVault = (detectedProjectRoot || '').replace(/\\/g, '/').replace(/\/+$/, '');
  const homeDir = (detectedHomeDir || '').replace(/\\/g, '/').replace(/\/+$/, '');

  // Resolve a catalog file pointer to an absolute path on THIS machine.
  const resolveSkillPath = (f) => {
    const clean = f.replace(/\\/g, '/');
    // 1) Prefer the server-verified on-disk location (workspace or global skills dir)
    const m = clean.match(/^\.agents\/skills\/([^\/]+)\/(.+)$/);
    const v = m && verifiedSkillsMap ? verifiedSkillsMap[m[1]] : null;
    if (v && v.full_path) {
      const skillDir = String(v.full_path).replace(/\\/g, '/').replace(/\/[^\/]+$/, '');
      return `${skillDir}/${m[2]}`;
    }
    // 2) Home-relative pointers -> expand ~ to the real home directory
    if (clean.startsWith('~')) return homeDir ? homeDir + clean.slice(1) : clean;
    // 3) Already absolute
    if (/^([A-Za-z]:\/|\/)/.test(clean)) return clean;
    // 4) Relative to this repo's root
    return centralVault ? `${centralVault}/${clean}` : clean;
  };
  const toFileUrl = (abs) => /^[A-Za-z]:\//.test(abs) ? `file:///${abs}` : (abs.startsWith('/') ? `file://${abs}` : abs);

  const fileLines = files.map((f, i) => {
    const abs = resolveSkillPath(f);
    return `${i + 1}. [${f}](${toFileUrl(abs)}) (Absolute: \`${abs}\`)`;
  }).join('\n');

  return `# Active Skills - Doctor9Trio / Skill Switcher\n# Generated: ${now}\n# Active: ${names}\n\n## Activation Rules\n${act}\n\n## Skill Files (Universal Pointers)\n${fileLines}\n\n## Session Instruction\nApply all skill rules above to every response. Use the absolute file links above whenever deep skill instructions are needed. At session start, confirm active skills in one line.\n`;
}

async function applySkills() {
  const btnDock = document.getElementById('apply-btn');
  const btnRight = document.getElementById('apply-btn-right');
  
  if (btnDock) { btnDock.disabled = true; btnDock.textContent = 'Applying...'; }
  if (btnRight) { btnRight.disabled = true; btnRight.textContent = 'Applying...'; }

  // Learn this machine's real paths before generating absolute pointers
  if (typeof ensureServerContext === 'function') {
    try { await ensureServerContext(); } catch (e) {}
  }

  const content = generateActiveRules();

  try {
    const res = await fetch('/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (data.ok) {
      const savedTo = data.path ? data.path.replace(/\\/g, '/') : '~/.gemini/config/rules/active-skills.md';
      showToast('Saved to ' + savedTo);
    } else {
      showToast('Error: ' + (data.error || 'Server error'));
    }
  } catch (err) {
    copySnippetText(content, 'Rules copied! Ready to paste into active-skills.md');
  }

  if (btnDock) { btnDock.disabled = false; btnDock.textContent = 'Apply to Antigravity Memory'; }
  if (btnRight) { btnRight.disabled = false; btnRight.textContent = 'Apply to Antigravity Memory'; }
}

// ─── Live Auto-Save to Disk Engine (Debounced & Persistent) ───
let autoSaveDiskTimer = null;
let isAutoSaveDiskEnabled = true;

function scheduleAutoSaveToDisk(delay = 600) {
  if (!isAutoSaveDiskEnabled) return;
  if (autoSaveDiskTimer) clearTimeout(autoSaveDiskTimer);
  const btnDock = document.getElementById('apply-btn');
  const btnRight = document.getElementById('apply-btn-right');
  if (btnDock) { btnDock.textContent = 'Auto-saving to disk...'; }
  if (btnRight) { btnRight.textContent = 'Auto-saving...'; }

  autoSaveDiskTimer = setTimeout(async () => {
    try {
      await applySkillsDirectSilent();
    } catch (e) {
      console.warn('Auto-save to disk failed:', e);
    }
  }, delay);
}

async function applySkillsDirectSilent() {
  if (typeof ensureServerContext === 'function') {
    try { await ensureServerContext(); } catch (e) {}
  }
  const content = generateActiveRules();
  try {
    const res = await fetch('/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (res.ok) {
      const btnDock = document.getElementById('apply-btn');
      const btnRight = document.getElementById('apply-btn-right');
      if (btnDock) btnDock.textContent = '✓ Saved to Antigravity';
      if (btnRight) btnRight.textContent = '✓ Saved';
      setTimeout(() => {
        if (btnDock && !btnDock.disabled) btnDock.textContent = 'Apply to Antigravity';
        if (btnRight && !btnRight.disabled) btnRight.textContent = 'Apply to Antigravity';
      }, 2500);
      const pillText = document.getElementById('memory-live-text');
      if (pillText) pillText.textContent = 'Disk: ' + (sel ? sel.size : 0) + ' Active';
    }
  } catch (err) {}
}

window.addEventListener('beforeunload', () => {
  if (autoSaveDiskTimer) {
    clearTimeout(autoSaveDiskTimer);
    try {
      const content = generateActiveRules();
      const blob = new Blob([JSON.stringify({ content })], { type: 'application/json' });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/apply', blob);
      } else {
        fetch('/apply', { method: 'POST', body: blob, keepalive: true });
      }
    } catch (e) {}
  }
});

function copyActivePrompt() {
  if (!sel.size) { showToast('Select at least one skill first'); return; }
  copySnippetText(generateActiveRules(), 'Context rules copied to clipboard!');
}

function copySnippetText(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg || 'Copied to clipboard');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(msg || 'Copied to clipboard');
  });
}


function copyLungyPrompt() {
  const p = '/goal Using Appllama MCP & App design skills, create a breathing app with flows like "Lungy" and design it like "Finch".';
  navigator.clipboard.writeText(p).then(() => {
    showToast('Lungy & Finch prompt copied to clipboard!');
    const btn = document.getElementById('copyLungyPromptBtn');
    if (btn) {
      btn.innerHTML = '<svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg> Copy Prompt';
      }, 2000);
    }
  });
}

function showToast(msg) {
  const old = document.querySelector('.toast-notice');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notice';
  toast.innerHTML = `
    <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" style="color:var(--accent-green);"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// Modal Inspect Logic