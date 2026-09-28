/* Skill Switcher — Redux State Engine */
/* Contains: createReduxStore factory, rootReducer, localStorage persistence */


// ========================================================
// REDUX STATE MANAGEMENT & LOCALSTORAGE PERSISTENCE ENGINE
// ========================================================

const REDUX_PERSIST_KEY = 'SKILL_SWITCHER_REDUX_STATE_V1';

// Standalone Redux Store Factory (Works 100% offline & without external CDN)
const createReduxStore = (typeof Redux !== 'undefined' && Redux.createStore)
  ? Redux.createStore
  : function(reducer, preloadedState) {
      let currentReducer = reducer;
      let currentState = preloadedState !== undefined ? preloadedState : currentReducer(undefined, { type: '@@redux/INIT' });
      let currentListeners = [];
      let nextListeners = currentListeners;

      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }

      return {
        getState: () => currentState,
        dispatch: (action) => {
          if (!action || typeof action.type !== 'string') {
            throw new Error('Actions must have a string type property');
          }
          currentState = currentReducer(currentState, action);
          const listeners = (currentListeners = nextListeners);
          for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
          }
          return action;
        },
        subscribe: (listener) => {
          if (typeof listener !== 'function') {
            throw new Error('Expected the listener to be a function');
          }
          let isSubscribed = true;
          ensureCanMutateNextListeners();
          nextListeners.push(listener);
          return function unsubscribe() {
            if (!isSubscribed) return;
            isSubscribed = false;
            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
          };
        }
      };
    };

// Action Types
const ActionTypes = {
  TOGGLE_SKILL: 'skills/toggleSkill',
  SELECT_REPO_DIRECT: 'skills/selectRepoDirect',
  BATCH_SELECT_CATEGORY: 'skills/batchSelectCategory',
  SELECT_ALL_VISIBLE: 'skills/selectAllVisible',
  CLEAR_ALL_SELECTIONS: 'skills/clearAllSelections',

  SET_CATEGORY: 'navigation/setCategory',
  SET_SELECTED_REPO: 'navigation/setSelectedRepo',
  TOGGLE_REPO_COLLAPSE: 'navigation/toggleRepoCollapse',
  TOGGLE_ALL_REPOS_COLLAPSE: 'navigation/toggleAllReposCollapse',
  EXPAND_ALL_REPOS: 'navigation/expandAllRepos',
  COLLAPSE_ALL_REPOS: 'navigation/collapseAllRepos',

  SET_SEARCH_QUERY: 'search/setSearchQuery',
  SET_REPO_FILTER_QUERY: 'search/setRepoFilterQuery',

  HYDRATE_STATE: 'system/hydrateState',
  RESET_PERSISTENCE: 'system/resetPersistence'
};

// Initial Redux State
const initialReduxState = {
  skills: {
    selectedIds: []
  },
  navigation: {
    mainCat: 'all',
    subCat: 'all',
    selectedRepoId: null,
    collapsedRepoIds: REPOS.map(r => r.id)
  },
  search: {
    searchQuery: '',
    repoFilterQuery: ''
  }
};

// Root Reducer
function rootReducer(state = initialReduxState, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_SKILL: {
      const id = action.payload.id;
      const exists = state.skills.selectedIds.includes(id);
      const newSelected = exists
        ? state.skills.selectedIds.filter(x => x !== id)
        : [...state.skills.selectedIds, id];
      return {
        ...state,
        skills: { ...state.skills, selectedIds: newSelected }
      };
    }

    case ActionTypes.SELECT_REPO_DIRECT: {
      const repoId = action.payload.repoId;
      const repo = REPOS.find(r => r.id === repoId);
      if (!repo) return state;
      const subIds = repo.subskills.map(s => s.id);
      const allSelected = subIds.length > 0 && subIds.every(id => state.skills.selectedIds.includes(id));
      
      let newSelected;
      if (allSelected) {
        newSelected = state.skills.selectedIds.filter(id => !subIds.includes(id));
      } else {
        const toAdd = subIds.filter(id => !state.skills.selectedIds.includes(id));
        newSelected = [...state.skills.selectedIds, ...toAdd];
      }
      return {
        ...state,
        skills: { ...state.skills, selectedIds: newSelected }
      };
    }

    case ActionTypes.BATCH_SELECT_CATEGORY: {
      const cat = action.payload.cat;
      const matchingIds = ALL_SKILLS.filter(s => s.cat === cat).map(s => s.id);
      const allSelected = matchingIds.length > 0 && matchingIds.every(id => state.skills.selectedIds.includes(id));

      let newSelected;
      if (allSelected) {
        newSelected = state.skills.selectedIds.filter(id => !matchingIds.includes(id));
      } else {
        const toAdd = matchingIds.filter(id => !state.skills.selectedIds.includes(id));
        newSelected = [...state.skills.selectedIds, ...toAdd];
      }
      return {
        ...state,
        skills: { ...state.skills, selectedIds: newSelected }
      };
    }

    case ActionTypes.SELECT_ALL_VISIBLE: {
      const visibleIds = action.payload.visibleSkillIds || [];
      const allSelected = visibleIds.length > 0 && visibleIds.every(id => state.skills.selectedIds.includes(id));

      let newSelected;
      if (allSelected) {
        newSelected = state.skills.selectedIds.filter(id => !visibleIds.includes(id));
      } else {
        const toAdd = visibleIds.filter(id => !state.skills.selectedIds.includes(id));
        newSelected = [...state.skills.selectedIds, ...toAdd];
      }
      return {
        ...state,
        skills: { ...state.skills, selectedIds: newSelected }
      };
    }

    case ActionTypes.CLEAR_ALL_SELECTIONS: {
      return {
        ...state,
        skills: { ...state.skills, selectedIds: [] }
      };
    }

    case ActionTypes.SET_CATEGORY: {
      const { mainCat, subCat } = action.payload;
      return {
        ...state,
        navigation: {
          ...state.navigation,
          mainCat: mainCat || 'all',
          subCat: subCat || 'all',
          selectedRepoId: null
        }
      };
    }

    case ActionTypes.SET_SELECTED_REPO: {
      const repoId = action.payload.repoId;
      const newCollapsed = state.navigation.collapsedRepoIds.filter(id => id !== repoId);
      return {
        ...state,
        navigation: {
          ...state.navigation,
          selectedRepoId: repoId,
          collapsedRepoIds: newCollapsed
        }
      };
    }

    case ActionTypes.TOGGLE_REPO_COLLAPSE: {
      const repoId = action.payload.repoId;
      const isCollapsed = state.navigation.collapsedRepoIds.includes(repoId);
      const newCollapsed = isCollapsed
        ? state.navigation.collapsedRepoIds.filter(id => id !== repoId)
        : [...state.navigation.collapsedRepoIds, repoId];
      return {
        ...state,
        navigation: {
          ...state.navigation,
          collapsedRepoIds: newCollapsed
        }
      };
    }

    case ActionTypes.TOGGLE_ALL_REPOS_COLLAPSE: {
      const visibleRepoIds = action.payload.visibleRepoIds || [];
      const allExpanded = visibleRepoIds.length > 0 && visibleRepoIds.every(id => !state.navigation.collapsedRepoIds.includes(id));
      
      let newCollapsed;
      if (allExpanded) {
        const toAdd = visibleRepoIds.filter(id => !state.navigation.collapsedRepoIds.includes(id));
        newCollapsed = [...state.navigation.collapsedRepoIds, ...toAdd];
      } else {
        newCollapsed = state.navigation.collapsedRepoIds.filter(id => !visibleRepoIds.includes(id));
      }
      return {
        ...state,
        navigation: {
          ...state.navigation,
          collapsedRepoIds: newCollapsed
        }
      };
    }

    case ActionTypes.EXPAND_ALL_REPOS: {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          collapsedRepoIds: []
        }
      };
    }

    case ActionTypes.COLLAPSE_ALL_REPOS: {
      const allIds = action.payload.allRepoIds || REPOS.map(r => r.id);
      return {
        ...state,
        navigation: {
          ...state.navigation,
          collapsedRepoIds: [...allIds]
        }
      };
    }

    case ActionTypes.SET_SEARCH_QUERY: {
      const q = action.payload.query;
      return {
        ...state,
        search: {
          ...state.search,
          searchQuery: q
        },
        navigation: {
          ...state.navigation,
          collapsedRepoIds: q ? [] : state.navigation.collapsedRepoIds
        }
      };
    }

    case ActionTypes.SET_REPO_FILTER_QUERY: {
      return {
        ...state,
        search: {
          ...state.search,
          repoFilterQuery: action.payload.query
        }
      };
    }

    case ActionTypes.HYDRATE_STATE: {
      const saved = action.payload.savedState;
      if (!saved) return state;
      return {
        skills: {
          selectedIds: Array.isArray(saved.skills?.selectedIds) ? saved.skills.selectedIds : state.skills.selectedIds
        },
        navigation: {
          mainCat: saved.navigation?.mainCat || state.navigation.mainCat,
          subCat: saved.navigation?.subCat || state.navigation.subCat,
          selectedRepoId: saved.navigation?.selectedRepoId !== undefined ? saved.navigation.selectedRepoId : state.navigation.selectedRepoId,
          collapsedRepoIds: Array.isArray(saved.navigation?.collapsedRepoIds) ? saved.navigation.collapsedRepoIds : state.navigation.collapsedRepoIds
        },
        search: {
          searchQuery: saved.search?.searchQuery || '',
          repoFilterQuery: saved.search?.repoFilterQuery || ''
        }
      };
    }

    case ActionTypes.RESET_PERSISTENCE: {
      return { ...initialReduxState };
    }

    default:
      return state;
  }
}

// LocalStorage Persistence Helpers
function saveReduxStateToStorage(state) {
  try {
    const toSave = {
      skills: {
        selectedIds: state.skills.selectedIds
      },
      navigation: {
        mainCat: state.navigation.mainCat,
        subCat: state.navigation.subCat,
        selectedRepoId: state.navigation.selectedRepoId,
        collapsedRepoIds: state.navigation.collapsedRepoIds
      },
      search: {
        searchQuery: state.search.searchQuery,
        repoFilterQuery: state.search.repoFilterQuery
      }
    };
    localStorage.setItem(REDUX_PERSIST_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('Could not persist Redux state to localStorage:', err);
  }
}

function loadReduxStateFromStorage() {
  try {
    const raw = localStorage.getItem(REDUX_PERSIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.skills && Array.isArray(parsed.skills.selectedIds)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read Redux state from localStorage:', err);
  }
  return null;
}

// Global state references kept in sync with Redux store
let sel = new Set();
let curMainCat = 'all';
let curSubCat = 'all';
let curCat = 'all';
let searchQuery = '';
let repoFilterQuery = '';
let selectedRepoId = null;
let activeModalId = null;
let collapsedRepos = new Set(REPOS.map(r => r.id));

// Instantiate Redux Store
const store = createReduxStore(rootReducer);
window.store = store;
window.__REDUX_STORE__ = store;

// Synchronize Redux Store with Global Variables & DOM
store.subscribe(() => {
  const state = store.getState();
  
  sel = new Set(state.skills.selectedIds);
  curMainCat = state.navigation.mainCat;
  curSubCat = state.navigation.subCat;
  selectedRepoId = state.navigation.selectedRepoId;
  collapsedRepos = new Set(state.navigation.collapsedRepoIds);
  searchQuery = state.search.searchQuery;
  repoFilterQuery = state.search.repoFilterQuery;

  if (curMainCat === 'frontend') {
    curCat = curSubCat === 'all' ? 'design' : curSubCat;
  } else if (curMainCat === 'data_media') {
    curCat = curSubCat === 'all' ? 'data' : curSubCat;
  } else {
    curCat = curMainCat;
  }

  saveReduxStateToStorage(state);

  // Sync Subnav Tabs
  document.querySelectorAll('.cat-pill, .subnav-tab[id^="tab-"]').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById(curMainCat === 'data_media' ? 'tab-data-media' : 'tab-' + curMainCat);
  if (tabEl) tabEl.classList.add('active');

  updateUI();
});

// Category SVG Icons mapping (Professional GitHub SVGs, ZERO emojis)
function getCategoryIcon(cat) {
  if (cat === 'mcp') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M11.25 1.75a.75.75 0 0 0-1.5 0V3H6.25V1.75a.75.75 0 0 0-1.5 0V3H4.5A2.5 2.5 0 0 0 2 5.5v5A2.5 2.5 0 0 0 4.5 13H6v1.25a.75.75 0 0 0 1.5 0V13h1.75v1.25a.75.75 0 0 0 1.5 0V13h.25a2.5 2.5 0 0 0 2.5-2.5v-5a2.5 2.5 0 0 0-2.5-2.5H11V1.75ZM3.5 5.5A1 1 0 0 1 4.5 4.5h7a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-5Z"></path></svg>`;
  }
  if (cat === 'jev') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M6 1.75a.75.75 0 0 1 .75.75v1h2.5v-1a.75.75 0 0 1 1.5 0v1h.5A2.75 2.75 0 0 1 14 6.25v.5h1a.75.75 0 0 1 0 1.5h-1v2.5h1a.75.75 0 0 1 0 1.5h-1v.5A2.75 2.75 0 0 1 11.25 14h-.5v1a.75.75 0 0 1-1.5 0v-1h-2.5v1a.75.75 0 0 1-1.5 0v-1h-.5A2.75 2.75 0 0 1 2 11.25v-.5H1a.75.75 0 0 1 0-1.5h1v-2.5H1a.75.75 0 0 1 0-1.5h1v-.5A2.75 2.75 0 0 1 4.75 3.5h.5v-1A.75.75 0 0 1 6 1.75Zm-2.5 3A1.25 1.25 0 0 0 2.25 6v4A1.25 1.25 0 0 0 3.5 11.25h9A1.25 1.25 0 0 0 13.75 10V6A1.25 1.25 0 0 0 12.5 4.75Zm2 2a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm3 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z"></path></svg>`;
  }
  if (cat === 'design') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25a1.75 1.75 0 0 1 .445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086ZM9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064L11.19 6.25 9.75 4.81Z"></path></svg>`;
  }
  if (cat === 'mobile') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25V1.75C2 .784 2.784 0 3.75 0ZM3.5 1.75v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM8 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path></svg>`;
  }
  if (cat === 'media') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M1.75 2.5A.75.75 0 0 0 1 3.25v9.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-9.5a.75.75 0 0 0-.75-.75h-9.5Zm12.5 2.75 1.47-1.103a.75.75 0 0 1 1.28.6v6.506a.75.75 0 0 1-1.28.6L14.25 10.75V5.25Z"></path></svg>`;
  }
  if (cat === 'data') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M1.5 2.5A2.5 2.5 0 0 1 4 0h8a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 12 16H4a2.5 2.5 0 0 1-2.5-2.5v-11Zm2.5-1A1 1 0 0 0 3 2.5v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1H4Zm1.5 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"></path></svg>`;
  }
  if (cat === 'review') {
    return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>`;
  }
  return `<svg class="octicon" width="16" height="16" viewBox="0 0 16 16"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM1.5 6.5h13V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM14.5 8h-13v6.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Z"></path></svg>`;
}


// Prism Syntax Formatter for Triggers
function formatPrismTrigger(t) {
  if (!t) return '';
  let safe = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (safe.startsWith('tool:')) {
    return `<span class="prism-kw">tool:</span> <span class="prism-fn">${safe.slice(5)}</span>`;
  }
  if (safe.startsWith('/')) {
    const spaceIdx = safe.indexOf(' ');
    if (spaceIdx === -1) {
      return `<span class="prism-kw">/</span><span class="prism-fn">${safe.slice(1)}</span>`;
    }
    const cmd = safe.slice(1, spaceIdx);
    const args = safe.slice(spaceIdx + 1);
    return `<span class="prism-kw">/</span><span class="prism-fn">${cmd}</span> <span class="prism-str">${args}</span>`;
  }
  if (safe.startsWith('@')) {
    return `<span class="prism-kw">@</span><span class="prism-fn">${safe.slice(1)}</span>`;
  }
  if (safe.includes('|')) {
    return safe.replace(/\|/g, '<span class="prism-op">|</span>');
  }
  if (safe.includes(':')) {
    const idx = safe.indexOf(':');
    return `<span class="prism-kw">${safe.slice(0, idx+1)}</span> <span class="prism-str">${safe.slice(idx+1)}</span>`;
  }
  return `<span class="prism-str">${safe}</span>`;
}

// Default Theme: White (Light)
function initTheme() {
  const saved = localStorage.getItem('gh-theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('gh-theme', isDark ? 'dark' : 'light');
}

initTheme();

// Search keybinding
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('global-search').focus();
  }
});

function handleSearch(q) {
  store.dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: { query: (q || '').trim().toLowerCase() } });
}

function handleRepoFilter(q) {
  store.dispatch({ type: ActionTypes.SET_REPO_FILTER_QUERY, payload: { query: (q || '').trim().toLowerCase() } });
}


// --- Category Pills in Left Sidebar ---
const SIDEBAR_CATS = [
  { id: 'all', label: 'All' },
  { id: 'jev', label: 'JEV' },
  { id: 'mcp', label: 'MCP' },
  { id: 'design', label: 'Design' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'data', label: 'Data' },
  { id: 'media', label: 'Media' },
  { id: 'review', label: 'Review' }
];

function renderSidebarCatPills() {
  const container = document.getElementById('sidebar-cat-pills');
  if (!container) return;
  container.innerHTML = '';
  
  SIDEBAR_CATS.forEach(c => {
    const pill = document.createElement('div');
    let isActive = false;
    if (c.id === 'all') {
      isActive = (curMainCat === 'all');
    } else if (c.id === 'jev' || c.id === 'mcp' || c.id === 'review') {
      isActive = (curMainCat === c.id);
    } else {
      isActive = (curSubCat === c.id);
    }
    
    pill.className = 'sidebar-cat-pill' + (isActive ? ' active' : '');
    const count = c.id === 'all' 
      ? REPOS.length 
      : REPOS.filter(r => r.cat === c.id).length;
    pill.innerHTML = `<span>${c.label}</span><span class="count">${count}</span>`;
    pill.onclick = () => filterCategory(c.id);
    container.appendChild(pill);
  });
}

function updateCategoryCounts() {
  const counts = {
    all: REPOS.length,
    jev: REPOS.filter(r => r.cat === 'jev').length,
    mcp: REPOS.filter(r => r.cat === 'mcp').length,
    frontend: REPOS.filter(r => r.cat === 'design' || r.cat === 'mobile').length,
    data_media: REPOS.filter(r => r.cat === 'data' || r.cat === 'media').length,
    review: REPOS.filter(r => r.cat === 'review').length
  };
  
  const map = {
    'all': 'count-all',
    'jev': 'count-jev',
    'mcp': 'count-mcp',
    'frontend': 'count-frontend',
    'data_media': 'count-data-media',
    'review': 'count-review'
  };
  
  Object.keys(map).forEach(key => {
    const el = document.getElementById(map[key]);
    if (el) el.textContent = counts[key] || 0;
    if (key === 'all') {
      const p = document.getElementById('count-all-pill');
      if (p) p.textContent = counts['all'] || 0;
    }
  });
}

// Render dynamic subcategories strip
function renderSubcategoryStrip() {
  const strip = document.getElementById('subnav-substrip');
  const container = document.getElementById('subnav-sub-container');
  if (!strip || !container) return;

  const subs = SUBCATEGORIES[curMainCat];
  if (!subs || subs.length === 0) {
    strip.classList.remove('active');
    container.innerHTML = '';
    return;
  }

  strip.classList.add('active');
  container.innerHTML = `
    <span class="sub-pill-label">
      <svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 7.75Zm0 5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"></path></svg>
      Subcategories:
    </span>
  `;

  subs.forEach(s => {
    const pill = document.createElement('div');
    const isActive = (curSubCat === s.id);
    pill.className = 'sub-pill' + (isActive ? ' active' : '');
    const count = s.getCount(REPOS);
    pill.innerHTML = `<span>${s.label}</span><span class="sub-count">${count}</span>`;
    pill.onclick = () => filterSubCategory(s.id);
    container.appendChild(pill);
  });
}

function filterMainCategory(mainCat, subCat = 'all') {
  store.dispatch({ type: ActionTypes.SET_CATEGORY, payload: { mainCat, subCat } });
}

function filterSubCategory(subCat) {
  store.dispatch({ type: ActionTypes.SET_CATEGORY, payload: { mainCat: curMainCat, subCat } });
}

// Router to support 1-click calls from sidebar pills or batch buttons
function filterCategory(cat) {
  if (cat === 'all' || cat === 'jev' || cat === 'mcp' || cat === 'review') {
    filterMainCategory(cat, 'all');
  } else if (cat === 'design') {
    filterMainCategory('frontend', 'design');
  } else if (cat === 'mobile') {
    filterMainCategory('frontend', 'mobile');
  } else if (cat === 'data') {
    filterMainCategory('data_media', 'data');
  } else if (cat === 'media') {
    filterMainCategory('data_media', 'media');
  } else {
    filterMainCategory(cat, 'all');
  }
}

// ========================================================
// API KEYS & ENVIRONMENT CREDENTIALS VAULT (LOCALSTORAGE)
// ========================================================


// Strict Whitelist of Skills Genuine Cloud API / Database Requirements
const SKILL_CRED_MAP = {
  // Appllama Mobile Suite (MCP Server Token)
  'appllama-mcp': { keyVar: 'APPLAMA_TOKEN', passVar: 'APPLAMA_MCP_SECRET', keyLabel: 'Appllama API Token', passLabel: 'MCP Secret', isRequired: true },
  
  // Agent Desktop (Anthropic Computer-Use for OS automation)
  'agent-desktop': { keyVar: 'COMPUTER_USE_KEY', passVar: 'OS_DESKTOP_PASSWORD', keyLabel: 'Anthropic Computer-Use Key', passLabel: 'VNC / OS Password', isRequired: true },
  
  // Neo4J Graph Database (Database credentials)
  'neo4jev': { keyVar: 'NEO4J_URI', passVar: 'NEO4J_PASSWORD', keyLabel: 'Neo4j Bolt URL', passLabel: 'Database Password', isPasswordPrimary: true, isRequired: true },
  
  // JEV Trader (Exchange API & Secret)
  'jev-trader': { keyVar: 'EXCHANGE_API_KEY', passVar: 'EXCHANGE_SECRET', keyLabel: 'Exchange API Key', passLabel: 'Exchange Secret / Password', isRequired: true },
  
  // TypeSafe MCP Server (Remote MCP auth)
  'typesafe-mcp': { keyVar: 'TYPESAFE_MCP_KEY', passVar: 'TYPESAFE_MCP_AUTH', keyLabel: 'TypeSafe MCP Server Key', passLabel: 'Server Auth Password', isRequired: true },
  
  // GPT-4o Multi-modal Vision & Landing
  'gpt-tasteskill': { keyVar: 'OPENAI_API_KEY', passVar: 'OPENAI_ORG_ID', keyLabel: 'OpenAI API Key', passLabel: 'Organization ID', isRequired: true },
  'image-to-code-skill': { keyVar: 'OPENAI_API_KEY', passVar: 'VISION_API_KEY', keyLabel: 'GPT-4o Vision Key', passLabel: 'Vision Secret', isRequired: true },
  
  // SeeDance 2.0 Cinematic Engine (AI Video Platform)
  'seedance2-skill': { keyVar: 'SEEDANCE_API_KEY', passVar: 'SEEDANCE_SECRET', keyLabel: 'SeeDance 2.0 API Key', passLabel: 'Cinematic Secret', isRequired: true },
  
  // Higgsfield AI Media (Cloud Generation Pipelines)
  'higgsfield-brandkit': { keyVar: 'HIGGSFIELD_API_KEY', passVar: 'HIGGSFIELD_SECRET', keyLabel: 'Higgsfield AI Key', passLabel: 'Secret', isRequired: true },
  'higgsfield-generate': { keyVar: 'HIGGSFIELD_API_KEY', passVar: 'HIGGSFIELD_SECRET', keyLabel: 'Higgsfield CLI Key', passLabel: 'Secret', isRequired: true },
  
  // Prism Engine (Wallet credentials)
  'prism': { keyVar: 'PRISM_API_KEY', passVar: 'PRISM_WALLET_SECRET', keyLabel: 'Prism Persona Key', passLabel: 'Wallet Secret / Password', isRequired: true }
};

let activeSkillCredTarget = null;
