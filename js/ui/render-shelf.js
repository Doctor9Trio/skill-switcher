/* Skill Switcher — Discovery Library UI Renderer & Controller */
/* Personal Technology Discovery & Inspiration Graph */
/* Implements: Zero-Friction Inbox, Dual-Context (Why & Potential Use), Project Graph, Rediscover Engine & Grid/List Views */

(function (root) {
  'use strict';

  // Navigation & View state
  let currentTab = 'all'; // 'all' | 'inbox' | 'collections' | 'projects' | 'intentions' | 'starred'
  let currentProject = null;
  let currentCollection = null;
  let currentTag = null;
  let currentIntent = 'all';
  let currentType = 'all';
  let currentSearch = '';
  let currentSort = 'newest';
  let currentViewMode = 'grid'; // 'grid' | 'list'
  let isLibraryActive = false;
  let isTagCloudOpen = false;
  let editingDiscoveryId = null;
  let currentRediscoverId = null;

  // Metadata mappings
  const TYPE_META = {
    all: { label: 'All Types', icon: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Z' },
    design: { label: 'Design & Inspo', icon: 'M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25a1.75 1.75 0 0 1 .445-.758l8.61-8.61Z' },
    repo: { label: 'GitHub Repos', icon: 'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z' },
    tool: { label: 'Tools & Modules', icon: 'M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H11v1.75a.75.75 0 0 1-1.5 0V4.5H7.75a.75.75 0 0 1 0-1.5H9.5V1.75a.75.75 0 0 1 1.5 0ZM4.5 6.5A2.5 2.5 0 0 0 2 9v4.5A2.5 2.5 0 0 0 4.5 16h7a2.5 2.5 0 0 0 2.5-2.5V9a2.5 2.5 0 0 0-2.5-2.5h-7Z' },
    ai: { label: 'AI & Models', icon: 'M6 1.75a.75.75 0 0 1 .75.75v1h2.5v-1a.75.75 0 0 1 1.5 0v1h.5A2.75 2.75 0 0 1 14 6.25v.5h1a.75.75 0 0 1 0 1.5h-1v2.5h1a.75.75 0 0 1 0 1.5h-1v.5A2.75 2.75 0 0 1 11.25 14h-.5v1a.75.75 0 0 1-1.5 0v-1h-2.5v1a.75.75 0 0 1-1.5 0v-1h-.5A2.75 2.75 0 0 1 2 11.25v-.5H1a.75.75 0 0 1 0-1.5h1v-2.5H1a.75.75 0 0 1 0-1.5h1v-.5A2.75 2.75 0 0 1 4.75 3.5h.5v-1A.75.75 0 0 1 6 1.75Z' },
    article: { label: 'Articles & Guides', icon: 'M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.003 1H15.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.247a3.75 3.75 0 0 0-3.003 1.501A3.75 3.75 0 0 0 5.003 13H.75a.75.75 0 0 1-.75-.75V1.75Z' },
    video: { label: 'Videos & Motion', icon: 'M0 3.75C0 2.784.784 2 1.75 2h9.5c.966 0 1.75.784 1.75 1.75v1.88l3.18-1.59A.75.75 0 0 1 17 4.71v6.58a.75.75 0 0 1-.82.67.747.747 0 0 1-.25-.06L13 10.37v1.88c0 .966-.784 1.75-1.75 1.75h-9.5A1.75 1.75 0 0 1 0 12.25v-8.5Z' },
    other: { label: 'Other', icon: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z' }
  };

  const INTENT_META = {
    all: { label: 'All Intentions', emoji: '✨' },
    inspiration: { label: 'Inspiration', emoji: '💡', desc: 'Design, aesthetics & visual ideas' },
    might_use: { label: 'Might Use', emoji: '🔧', desc: 'Libraries & packages for future features' },
    experiment: { label: 'Experiment', emoji: '🧪', desc: 'Cutting-edge modules & POC ideas' },
    learn: { label: 'Learn', emoji: '📚', desc: 'Case studies, architecture & deep dives' },
    concept: { label: 'Concept', emoji: '🧩', desc: 'Unusual patterns & creative mechanisms' }
  };

  const STATUS_META = {
    inbox: { label: 'Inbox', badgeClass: 'status-inbox', icon: '📥' },
    active: { label: 'Active', badgeClass: 'status-active', icon: '📌' },
    in_use: { label: 'In Use', badgeClass: 'status-in-use', icon: '🔨' },
    archived: { label: 'Archived', badgeClass: 'status-archived', icon: '📦' }
  };

  const COLLECTION_THEMES = {
    'Design & Visual Identity': { icon: '🎨', emoji: '🎨', color: 'rgba(163, 113, 247, 0.15)', border: 'rgba(163, 113, 247, 0.4)' },
    'React & Animation Engines': { icon: '⚡', emoji: '⚡', color: 'rgba(88, 166, 255, 0.15)', border: 'rgba(88, 166, 255, 0.4)' },
    'Typography & Monospace Lab': { icon: '🧪', emoji: '🧪', color: 'rgba(57, 211, 83, 0.15)', border: 'rgba(57, 211, 83, 0.4)' },
    'CRO & Growth Psychology': { icon: '📈', emoji: '📈', color: 'rgba(240, 136, 62, 0.15)', border: 'rgba(240, 136, 62, 0.4)' },
    'AI Tools & Architectures': { icon: '🧠', emoji: '🧠', color: 'rgba(187, 128, 179, 0.15)', border: 'rgba(187, 128, 179, 0.4)' },
    'Developer Tools': { icon: '🛠️', emoji: '🛠️', color: 'rgba(139, 148, 158, 0.15)', border: 'rgba(139, 148, 158, 0.4)' }
  };

  // Open the Discovery Library View
  function openShelfView() {
    isLibraryActive = true;

    // Highlight subnav tab
    document.querySelectorAll('.subnav-tab').forEach(t => t.classList.remove('active'));
    const navTab = document.getElementById('shelf-nav-tab');
    if (navTab) navTab.classList.add('active');

    // Hide Skills-Switcher catalog elements
    const catStrip = document.querySelector('.category-filter-strip');
    const subnavSubstrip = document.getElementById('subnav-substrip');
    const presetStrip = document.querySelector('.preset-strip-container');
    const appContainer = document.querySelector('.app-container');
    const actionDock = document.querySelector('.action-dock');

    if (catStrip) catStrip.style.display = 'none';
    if (subnavSubstrip) subnavSubstrip.style.display = 'none';
    if (presetStrip) presetStrip.style.display = 'none';
    if (appContainer) appContainer.style.display = 'none';
    if (actionDock) actionDock.style.display = 'none';

    // Show or create panel
    let panel = document.getElementById('shelf-view-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'shelf-view-panel';
      panel.className = 'shelf-view-panel';
      const subnavStrip = document.querySelector('.subnav-strip');
      if (subnavStrip) {
        subnavStrip.parentNode.insertBefore(panel, subnavStrip.nextSibling);
      } else {
        document.body.appendChild(panel);
      }
    }
    panel.style.display = 'block';

    renderDiscoveryUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch back to Skills & Packs Catalog
  function closeShelfView() {
    isLibraryActive = false;

    const navTab = document.getElementById('shelf-nav-tab');
    if (navTab) navTab.classList.remove('active');

    const panel = document.getElementById('shelf-view-panel');
    if (panel) panel.style.display = 'none';

    // Restore Skills-Switcher catalog
    const catStrip = document.querySelector('.category-filter-strip');
    const presetStrip = document.querySelector('.preset-strip-container');
    const appContainer = document.querySelector('.app-container');
    const actionDock = document.querySelector('.action-dock');

    if (catStrip) catStrip.style.display = '';
    if (presetStrip) presetStrip.style.display = '';
    if (appContainer) appContainer.style.display = '';
    if (actionDock) actionDock.style.display = '';

    const firstTab = document.querySelector('.subnav-tab:first-child');
    if (firstTab) firstTab.classList.add('active');

    updateShelfNavCounter();
  }

  // Update navbar counter bubble
  function updateShelfNavCounter() {
    const badge = document.getElementById('shelf-nav-count');
    if (badge && window.ShelfStore) {
      const stats = window.ShelfStore.getStats();
      badge.textContent = stats.total;
    }
  }

  // Filter discoveries
  function getFilteredDiscoveries() {
    if (!window.ShelfStore) return [];
    let list = window.ShelfStore.getAll();

    // Primary tab filtering
    if (currentTab === 'inbox') {
      list = list.filter(i => i.status === 'inbox');
    } else if (currentTab === 'starred') {
      list = list.filter(i => i.starred);
    } else if (currentTab === 'collections' && currentCollection) {
      list = list.filter(i => i.collection && i.collection.toLowerCase() === currentCollection.toLowerCase());
    } else if (currentTab === 'projects' && currentProject) {
      list = list.filter(i => i.project && i.project.toLowerCase() === currentProject.toLowerCase());
    } else if (currentTab === 'intentions' && currentIntent !== 'all') {
      list = list.filter(i => i.intent === currentIntent);
    }

    // Secondary Collection filtering
    if (currentCollection && currentTab !== 'collections') {
      list = list.filter(i => i.collection && i.collection.toLowerCase() === currentCollection.toLowerCase());
    }

    // Secondary Tag filtering
    if (currentTag) {
      list = list.filter(i => Array.isArray(i.tags) && i.tags.some(t => t.toLowerCase() === currentTag.toLowerCase()));
    }

    // Secondary Type filtering
    if (currentType !== 'all') {
      list = list.filter(i => i.type === currentType);
    }

    // Text search query
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(i => {
        return (
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.url && i.url.toLowerCase().includes(q)) ||
          (i.whySaved && i.whySaved.toLowerCase().includes(q)) ||
          (i.potentialUse && i.potentialUse.toLowerCase().includes(q)) ||
          (i.project && i.project.toLowerCase().includes(q)) ||
          (i.collection && i.collection.toLowerCase().includes(q)) ||
          (Array.isArray(i.tags) && i.tags.some(t => t.toLowerCase().includes(q))) ||
          (i.githubMeta && (
            (i.githubMeta.description && i.githubMeta.description.toLowerCase().includes(q)) ||
            (i.githubMeta.language && i.githubMeta.language.toLowerCase().includes(q))
          ))
        );
      });
    }

    // Sort order
    list.sort((a, b) => {
      if (currentSort === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (currentSort === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (currentSort === 'alpha') return (a.title || '').localeCompare(b.title || '');
      if (currentSort === 'starred') {
        if (a.starred === b.starred) return (b.createdAt || 0) - (a.createdAt || 0);
        return a.starred ? -1 : 1;
      }
      return 0;
    });

    return list;
  }

  // Render Collections / Topic Folders Grid
  function renderCollectionsOverview(stats) {
    if (!window.ShelfStore) return '';
    const collections = window.ShelfStore.getCollections();

    const collectionInfo = {
      'Design & Visual Identity': {
        desc: 'Curated design archives, brutalist typography labs, visual craft and creative web references.',
        icon: '🎨'
      },
      'React & Animation Engines': {
        desc: 'Fluid springs, motion primitives, interactive physics, gesture libraries, and modern React components.',
        icon: '⚡'
      },
      'Typography & Monospace Lab': {
        desc: 'Variable fonts, experimental monospace typefaces, typographic specimens, and font pairing tools.',
        icon: '🧪'
      },
      'CRO & Growth Psychology': {
        desc: 'Behavioral economics, onboarding tear-downs, growth psychology loops, and high-converting UX experiments.',
        icon: '📈'
      },
      'AI Tools & Architectures': {
        desc: 'Autonomous agent frameworks, LLM memory systems, embeddings, and generative media models.',
        icon: '🧠'
      },
      'Developer Tools': {
        desc: 'Terminal CLIs, performance monitors, debugging suites, build systems, and local automation scripts.',
        icon: '🛠️'
      }
    };

    if (!collections.length) {
      return `
        <div class="shelf-empty-state">
          <div class="shelf-empty-icon">🏷️</div>
          <h3 class="shelf-empty-title">No Collections Yet</h3>
          <p class="shelf-empty-text">Organize your discoveries by adding a Collection name when saving or editing resources.</p>
          <button class="btn-gh btn-gh-primary" onclick="openShelfModal()">+ Create Discovery</button>
        </div>
      `;
    }

    return `
      <div class="collections-overview-wrap">
        <div class="collections-head-bar">
          <div>
            <h2 class="collections-title">Curated Topic Collections</h2>
            <p class="collections-sub">Thematic knowledge silos connected to your active engineering domains.</p>
          </div>
          <button class="btn-gh btn-gh-sm" onclick="openShelfModal()">+ New Discovery</button>
        </div>
        <div class="collections-grid">
          ${collections.map(col => {
            const theme = COLLECTION_THEMES[col.name] || { icon: '🏷️', color: 'rgba(88, 166, 255, 0.1)', border: 'rgba(88, 166, 255, 0.3)' };
            const info = collectionInfo[col.name] || { desc: 'Thematic resource bucket and design inspiration.', icon: theme.icon };
            return `
              <div class="collection-folder-card" onclick="selectCollectionFilter('${escapeHtml(col.name)}', event)">
                <div class="col-card-head">
                  <div class="col-card-icon-wrap" style="background:${theme.color}; border-color:${theme.border};">
                    <span class="col-card-icon">${theme.icon}</span>
                  </div>
                  <div class="col-card-badge">${col.count} ${col.count === 1 ? 'item' : 'items'}</div>
                </div>
                <h3 class="col-card-title">${escapeHtml(col.name)}</h3>
                <p class="col-card-desc">${escapeHtml(info.desc)}</p>
                
                ${col.sampleItems && col.sampleItems.length ? `
                  <div class="col-card-samples">
                    <span class="col-card-samples-label">RECENT IN THIS TOPIC:</span>
                    ${col.sampleItems.slice(0, 3).map(s => `
                      <div class="col-sample-row">
                        <span class="col-sample-bullet">•</span>
                        <span class="col-sample-title">${escapeHtml(s.title)}</span>
                        <span class="col-sample-domain">${escapeHtml(window.ShelfStore.extractDomain(s.url))}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <div class="col-card-footer">
                  <span class="col-card-explore-btn">Explore Collection &rarr;</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Collection filter handlers
  function selectCollectionFilter(colName, event) {
    if (event) event.stopPropagation();
    currentCollection = colName;
    currentTab = 'collections';
    renderDiscoveryUI();
  }

  function clearCollectionFilter() {
    currentCollection = null;
    renderDiscoveryUI();
  }

  // Tag filter handlers
  function selectTagFilter(tag, event) {
    if (event) event.stopPropagation();
    currentTag = (currentTag === tag) ? null : tag;
    if (currentTag && currentTab === 'collections') {
      currentTab = 'all';
    }
    renderDiscoveryUI();
  }

  function clearTagFilter() {
    currentTag = null;
    renderDiscoveryUI();
  }

  function toggleTagCloud() {
    isTagCloudOpen = !isTagCloudOpen;
    renderDiscoveryUI();
  }

  // Markdown copy handlers
  function copyShelfMarkdown(id, event) {
    if (event) event.stopPropagation();
    if (!window.ShelfStore) return;
    const snippet = window.ShelfStore.formatMarkdownSnippet(id);
    if (!snippet) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(snippet).then(() => {
        if (typeof showToast === 'function') showToast('Copied Markdown snippet! 📋');
      });
    } else if (typeof copySnippetText === 'function') {
      copySnippetText(snippet, 'Copied Markdown snippet! 📋');
    }
  }

  function copyAllFilteredMarkdown() {
    if (!window.ShelfStore) return;
    const items = getFilteredDiscoveries();
    if (!items.length) {
      if (typeof showToast === 'function') showToast('No discoveries to copy.');
      return;
    }
    const md = window.ShelfStore.formatAllFilteredMarkdown(items);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(() => {
        if (typeof showToast === 'function') showToast(`Copied ${items.length} discoveries as Markdown! 📋`);
      });
    } else if (typeof copySnippetText === 'function') {
      copySnippetText(md, `Copied ${items.length} discoveries as Markdown! 📋`);
    }
  }

  // Bookmarklet modal handlers
  function openBookmarkletModal() {
    const modal = document.getElementById('shelf-bookmarklet-modal');
    if (!modal) return;
    const origin = window.location.origin || 'http://localhost:7891';
    const code = `javascript:(function(){var u=encodeURIComponent(window.location.href);var t=encodeURIComponent(document.title||'');window.open('${origin}/index.html?quickSaveUrl='+u+'&title='+t,'_blank');})();`;
    
    const codeInput = document.getElementById('bookmarklet-code-input');
    if (codeInput) codeInput.value = code;

    const dragBtn = modal.querySelector('a[href^="javascript:"]');
    if (dragBtn) dragBtn.setAttribute('href', code);

    modal.classList.add('open');
  }

  function closeBookmarkletModal(event) {
    if (event && event.target && event.target.id !== 'shelf-bookmarklet-modal') return;
    closeBookmarkletModalDirect();
  }

  function closeBookmarkletModalDirect() {
    const modal = document.getElementById('shelf-bookmarklet-modal');
    if (modal) modal.classList.remove('open');
  }

  function copyBookmarkletCode() {
    const codeInput = document.getElementById('bookmarklet-code-input');
    if (!codeInput) return;
    codeInput.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeInput.value).then(() => {
        if (typeof showToast === 'function') showToast('Bookmarklet code copied to clipboard! 📋');
      });
    } else {
      document.execCommand('copy');
      if (typeof showToast === 'function') showToast('Bookmarklet code copied to clipboard! 📋');
    }
  }

  // Render main Discovery Library UI
  function renderDiscoveryUI() {
    const panel = document.getElementById('shelf-view-panel');
    if (!panel || !window.ShelfStore) return;

    updateShelfNavCounter();
    const stats = window.ShelfStore.getStats();
    const items = getFilteredDiscoveries();

    // Select rediscovery item if not set
    if (!currentRediscoverId) {
      const redis = window.ShelfStore.getRediscoverItem();
      if (redis) currentRediscoverId = redis.id;
    }
    const rediscoverItem = currentRediscoverId ? window.ShelfStore.getById(currentRediscoverId) : null;

    panel.innerHTML = `
      <div class="shelf-wrapper">
        <!-- Hero Header -->
        <div class="shelf-header-box">
          <div class="shelf-header-main">
            <div class="shelf-header-titles">
              <div class="shelf-badge-row">
                <span class="shelf-badge">
                  <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M7.53 1.282a.5.5 0 0 1 .94 0l.732 2.253a4.5 4.5 0 0 0 2.893 2.893l2.253.732a.5.5 0 0 1 0 .94l-2.253.732a4.5 4.5 0 0 0-2.893 2.893l-.732 2.253a.5.5 0 0 1-.94 0l-.732-2.253a4.5 4.5 0 0 0-2.893-2.893L.655 8.16a.5.5 0 0 1 0-.94l2.253-.732a4.5 4.5 0 0 0 2.893-2.893L7.53 1.282Z"></path>
                  </svg>
                  Discovery Graph
                </span>
                <span class="shelf-stat-pill">${stats.total} Total</span>
                <span class="shelf-stat-pill ${stats.inbox > 0 ? 'amber' : ''}">📥 ${stats.inbox} Inbox</span>
                <span class="shelf-stat-pill">📌 ${stats.active} Active</span>
                <span class="shelf-stat-pill">★ ${stats.starred} Starred</span>
              </div>
              <h1 class="shelf-title">Technology Discovery Library</h1>
              <p class="shelf-desc">
                Capture repos, designs, and tools in 5 seconds. Connect what you discover directly to your active engineering projects.
              </p>
            </div>

            <!-- Global Action Buttons -->
            <div class="shelf-header-actions">
              <button class="btn-gh btn-gh-primary shelf-add-btn" id="shelf-add-resource-btn" onclick="openShelfModal()" title="+ Add Resource">
                <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                </svg>
                <span>+ Add Resource</span>
              </button>

              <button class="btn-gh" onclick="openBookmarkletModal()" title="1-Click Browser Bookmarklet to save links from any tab">
                <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="m3.5 1.75.006-.016a2.001 2.001 0 0 1 1.744-1.234H10.75a2 2 0 0 1 2 2v12.25a.75.75 0 0 1-1.22.586L8 12.336l-3.53 2.95A.75.75 0 0 1 3.25 14.7V1.75h.25Zm1.25.25a.5.5 0 0 0-.5.5v11.196l3.28-2.74a.75.75 0 0 1 .94 0l3.28 2.74V2.5a.5.5 0 0 0-.5-.5H4.75Z"></path>
                </svg>
                <span>Bookmarklet</span>
              </button>

              <button class="btn-gh" onclick="exportShelfMD()" title="Download as clean Markdown reference graph">
                <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.75C0 .784.784 0 1.75 0h7.5C9.716 0 10.5.784 10.5 1.75v3.5a.75.75 0 0 1-1.5 0V1.75a.25.25 0 0 0-.25-.25h-7.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25V9.75a.75.75 0 0 1 1.5 0v4.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm12.03 3.47a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L13.19 9H7.75a.75.75 0 0 1 0-1.5h5.44l-1.16-1.16a.75.75 0 0 1 0-1.06Z"></path>
                </svg>
                <span>Export MD</span>
              </button>

              <button class="btn-gh" onclick="exportShelfJSON()" title="Export JSON backup">
                <span>Backup JSON</span>
              </button>

              <button class="btn-gh" onclick="triggerImportJSON()" title="Import discoveries">
                <span>Import</span>
              </button>

              <button class="btn-gh btn-gh-ghost" onclick="closeShelfView()" title="Back to Skills Switcher catalog">
                <span>&larr; Skills</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 5-Second Zero-Friction Quick-Capture Strip -->
        <div class="discovery-quick-strip">
          <div class="discovery-quick-input-wrap">
            <svg class="octicon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="color:var(--fg-subtle);">
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
            </svg>
            <input
              type="url"
              id="quick-capture-url"
              class="discovery-quick-input"
              placeholder="Instant Capture: Paste any URL to save to Inbox in 5 seconds (Press Enter)..."
              onkeydown="if(event.key==='Enter'){handleQuickCapture();}"
            />
          </div>
          <button class="btn-gh btn-gh-primary" onclick="handleQuickCapture()" title="Quick save directly to Inbox">
            <span>+ Save to Inbox</span>
          </button>
        </div>

        <!-- Rediscover System Banner (Keeping saved things alive) -->
        ${rediscoverItem ? renderRediscoverBanner(rediscoverItem) : ''}

        <!-- Sub-Navigation Strip (Inbox, Explore, Collections, Projects, Intentions, Starred) -->
        <div class="discovery-subnav-strip">
          <div class="discovery-subnav-tabs">
            <button class="disc-subnav-btn ${currentTab === 'all' ? 'active' : ''}" onclick="switchDiscoveryTab('all')">
              <span>All Discoveries</span>
              <span class="disc-pill-bubble">${stats.total}</span>
            </button>

            <button class="disc-subnav-btn ${currentTab === 'inbox' ? 'active' : ''}" onclick="switchDiscoveryTab('inbox')">
              <span>📥 Inbox</span>
              <span class="disc-pill-bubble ${stats.inbox > 0 ? 'highlight' : ''}">${stats.inbox}</span>
            </button>

            <button class="disc-subnav-btn ${currentTab === 'collections' ? 'active' : ''}" onclick="switchDiscoveryTab('collections')">
              <span>🏷️ Collections</span>
              <span class="disc-pill-bubble">${Object.keys(stats.collections || {}).length}</span>
            </button>

            <button class="disc-subnav-btn ${currentTab === 'projects' ? 'active' : ''}" onclick="switchDiscoveryTab('projects')">
              <span>📁 Projects</span>
              <span class="disc-pill-bubble">${Object.keys(stats.projects).length}</span>
            </button>

            <button class="disc-subnav-btn ${currentTab === 'intentions' ? 'active' : ''}" onclick="switchDiscoveryTab('intentions')">
              <span>💡 Intentions</span>
            </button>

            <button class="disc-subnav-btn ${currentTab === 'starred' ? 'active' : ''}" onclick="switchDiscoveryTab('starred')">
              <span>★ Starred</span>
              <span class="disc-pill-bubble">${stats.starred}</span>
            </button>
          </div>

          <!-- View Mode Switcher: Grid vs Dense List -->
          <div class="disc-view-switcher">
            <button
              class="disc-view-btn ${currentViewMode === 'grid' ? 'active' : ''}"
              onclick="setViewMode('grid')"
              title="Masonry visual cards view"
            >
              <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 2.75C1 1.784 1.784 1 2.75 1h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 8 8H2.75A1.75 1.75 0 0 1 1 6.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-3.5ZM9 2.75C9 1.784 9.784 1 10.75 1h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 14.25 8h-3.5A1.75 1.75 0 0 1 9 6.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-3.5ZM1 10.75C1 9.784 1.784 9 2.75 9h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 8 16H2.75A1.75 1.75 0 0 1 1 14.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-3.5ZM9 10.75c0-.966.784-1.75 1.75-1.75h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 14.25 16h-3.5A1.75 1.75 0 0 1 9 14.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-3.5Z"></path>
              </svg>
              <span>Grid</span>
            </button>

            <button
              class="disc-view-btn ${currentViewMode === 'list' ? 'active' : ''}"
              onclick="setViewMode('list')"
              title="Dense list view"
            >
              <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75Zm0 4A.75.75 0 0 1 2.75 7h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.75Zm0 4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"></path>
              </svg>
              <span>List</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Context Bar (Collections, Projects, or Intentions) -->
        ${renderDynamicContextBar(stats)}

        <!-- Search & Filter Bar -->
        <div class="shelf-controls-bar">
          <div class="shelf-search-wrap">
            <svg class="octicon shelf-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"></path>
            </svg>
            <input
              type="text"
              id="shelf-search-input"
              class="shelf-search-input"
              placeholder="Search title, URL, Why I saved, Potential use, tags, collection or project..."
              value="${escapeHtml(currentSearch)}"
              oninput="handleShelfSearch(this.value)"
            />
            ${currentSearch ? `<button class="shelf-search-clear" onclick="clearShelfSearch()">&times;</button>` : ''}
          </div>

          <div class="shelf-filter-group">
            <button class="shelf-star-toggle ${isTagCloudOpen ? 'active' : ''}" onclick="toggleTagCloud()" title="Toggle interactive tag cloud">
              <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.753 1.753 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25v5.025ZM6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path>
              </svg>
              <span>Tags (${stats.tags ? stats.tags.length : 0})</span>
            </button>

            <button class="shelf-star-toggle" onclick="copyAllFilteredMarkdown()" title="Copy all matching discoveries as Markdown list">
              <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
              </svg>
              <span>Copy List</span>
            </button>

            <select class="shelf-sort-select" onchange="handleShelfSortChange(this.value)">
              <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Newest Added</option>
              <option value="oldest" ${currentSort === 'oldest' ? 'selected' : ''}>Oldest Added</option>
              <option value="alpha" ${currentSort === 'alpha' ? 'selected' : ''}>Alphabetical (A-Z)</option>
              <option value="starred" ${currentSort === 'starred' ? 'selected' : ''}>Starred First</option>
            </select>
          </div>
        </div>

        <!-- Tag Cloud Drawer (Expandable) -->
        ${isTagCloudOpen ? `
          <div class="shelf-tag-cloud-drawer">
            <div class="shelf-tag-cloud-head">
              <span class="shelf-tag-cloud-title">TOP TOPIC TAGS (${(stats.tagsWithCounts || []).length})</span>
              ${currentTag ? `<button class="shelf-tag-clear-btn" onclick="clearTagFilter()">Clear Tag Filter &times;</button>` : ''}
            </div>
            <div class="shelf-tag-chips-wrap">
              ${(stats.tagsWithCounts || []).map(tc => `
                <button class="shelf-tag-chip ${currentTag === tc.tag ? 'active' : ''}" onclick="selectTagFilter('${escapeHtml(tc.tag)}')">
                  #${escapeHtml(tc.tag)} <span class="tag-chip-count">${tc.count}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Content Type Pills Strip -->
        <div class="shelf-type-pills-strip">
          <div class="shelf-pills-scroll">
            ${renderTypePills(stats)}
          </div>
        </div>

        <!-- Active Filter Indicator Banner -->
        ${(currentCollection || currentTag || currentProject || currentIntent !== 'all' || currentSearch) ? `
          <div class="shelf-active-tag-banner">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              ${currentCollection ? `<span class="shelf-filter-chip">Collection: <strong>${escapeHtml(currentCollection)}</strong> <button onclick="clearCollectionFilter()">&times;</button></span>` : ''}
              ${currentTag ? `<span class="shelf-filter-chip">Tag: <strong>#${escapeHtml(currentTag)}</strong> <button onclick="clearTagFilter()">&times;</button></span>` : ''}
              ${currentProject ? `<span class="shelf-filter-chip">Project: <strong>${escapeHtml(currentProject)}</strong> <button onclick="selectProjectFilter(null)">&times;</button></span>` : ''}
              ${currentIntent !== 'all' ? `<span class="shelf-filter-chip">Intent: <strong>${escapeHtml(currentIntent)}</strong> <button onclick="selectIntentFilter('all')">&times;</button></span>` : ''}
              ${currentSearch ? `<span class="shelf-filter-chip">Search: <strong>"${escapeHtml(currentSearch)}"</strong> <button onclick="clearShelfSearch()">&times;</button></span>` : ''}
            </div>
            <button class="shelf-tag-clear-btn" onclick="resetAllShelfFilters()">Reset All Filters &times;</button>
          </div>
        ` : ''}

        <!-- Main Discoveries Display (Grid, List or Collections Overview) -->
        <div class="shelf-grid-container">
          ${currentTab === 'collections' && !currentCollection
            ? renderCollectionsOverview(stats)
            : (items.length > 0
                ? (currentViewMode === 'grid' ? renderDiscoveryGrid(items) : renderDiscoveryList(items))
                : renderEmptyState())}
        </div>
      </div>
    `;
  }

  // Render Rediscover Banner
  function renderRediscoverBanner(item) {
    const domain = window.ShelfStore ? window.ShelfStore.extractDomain(item.url) : item.url;
    const projectBadge = item.project ? `<span class="rediscover-proj">📁 ${escapeHtml(item.project)}</span>` : '';
    const dateSaved = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `
      <div class="rediscover-banner">
        <div class="rediscover-head">
          <div class="rediscover-title-row">
            <span class="rediscover-sparkle">✨ REDISCOVER</span>
            <span class="rediscover-saved-date">Saved ${dateSaved}</span>
            ${projectBadge}
          </div>
          <button class="rediscover-next-btn" onclick="cycleRediscoverItem()" title="Show another saved discovery">
            ↻ Next Discovery
          </button>
        </div>

        <div class="rediscover-body">
          <div class="rediscover-main-info">
            <h3 class="rediscover-item-title">
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
              <span class="rediscover-domain">${escapeHtml(domain)}</span>
            </h3>

            ${item.whySaved ? `
              <div class="rediscover-field">
                <span class="rediscover-label">💭 Why you saved this:</span>
                <span class="rediscover-text">${escapeHtml(item.whySaved)}</span>
              </div>
            ` : ''}

            ${item.potentialUse ? `
              <div class="rediscover-field">
                <span class="rediscover-label">🚀 Potential use:</span>
                <span class="rediscover-text highlight">${escapeHtml(item.potentialUse)}</span>
              </div>
            ` : ''}
          </div>

          <div class="rediscover-actions">
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-gh btn-gh-primary btn-gh-sm">
              Open Resource ↗
            </a>
            ${item.status !== 'in_use' ? `
              <button class="btn-gh btn-gh-sm" onclick="setDiscoveryStatus('${item.id}', 'in_use')">
                Mark as In-Use 🔨
              </button>
            ` : `
              <span class="rediscover-in-use-tag">Currently In-Use</span>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // Cycle rediscovery item
  function cycleRediscoverItem() {
    if (!window.ShelfStore) return;
    const next = window.ShelfStore.getRediscoverItem();
    if (next) {
      currentRediscoverId = next.id;
      renderDiscoveryUI();
    }
  }

  // Render Dynamic Context Bar for Projects or Intentions
  function renderDynamicContextBar(stats) {
    if (currentTab === 'projects') {
      const projects = Object.keys(stats.projects);
      return `
        <div class="discovery-context-strip">
          <span class="disc-context-label">Projects:</span>
          <button class="disc-context-pill ${currentProject === null ? 'active' : ''}" onclick="selectProjectFilter(null)">
            All Projects
          </button>
          ${projects.map(p => `
            <button class="disc-context-pill ${currentProject === p ? 'active' : ''}" onclick="selectProjectFilter('${escapeHtml(p)}')">
              📁 ${escapeHtml(p)} <span class="disc-pill-bubble">${stats.projects[p]}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (currentTab === 'intentions') {
      return `
        <div class="discovery-context-strip">
          <span class="disc-context-label">Intention:</span>
          ${Object.keys(INTENT_META).map(key => {
            const meta = INTENT_META[key];
            const isActive = currentIntent === key;
            return `
              <button class="disc-context-pill ${isActive ? 'active' : ''}" onclick="selectIntentFilter('${key}')" title="${meta.desc || ''}">
                ${meta.emoji} ${meta.label}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    return '';
  }

  // Helper to render type pills
  function renderTypePills(stats) {
    const types = ['all', 'design', 'repo', 'tool', 'ai', 'article', 'video', 'other'];

    return types.map(t => {
      const meta = TYPE_META[t] || { label: t, icon: '' };
      const isActive = currentType === t;
      const count = t === 'all' ? stats.total : (stats[t] || 0);

      return `
        <button
          class="shelf-type-pill ${isActive ? 'active' : ''}"
          onclick="handleShelfTypeFilter('${t}')"
        >
          <svg class="octicon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="${meta.icon}"></path>
          </svg>
          <span>${meta.label}</span>
          <span class="shelf-pill-count">${count}</span>
        </button>
      `;
    }).join('');
  }

  // Render Grid View
  function renderDiscoveryGrid(items) {
    return `
      <div class="shelf-cards-grid">
        ${items.map(item => renderDiscoveryCard(item)).join('')}
      </div>
    `;
  }

  // Render List View (Dense Table-like)
  function renderDiscoveryList(items) {
    return `
      <div class="discovery-list-container">
        <div class="discovery-list-head">
          <div>Discovery / URL</div>
          <div>Project / Context</div>
          <div>Why Saved / Potential Use</div>
          <div style="text-align:right;">Actions</div>
        </div>
        ${items.map(item => renderDiscoveryListRow(item)).join('')}
      </div>
    `;
  }

  // Individual Card Component
  function renderDiscoveryCard(item) {
    const domain = window.ShelfStore ? window.ShelfStore.extractDomain(item.url) : item.url;
    const isStarred = Boolean(item.starred);
    const intent = INTENT_META[item.intent] || { label: item.intent, emoji: '📌' };
    const status = STATUS_META[item.status] || { label: item.status, badgeClass: '', icon: '📌' };

    const dateFormatted = new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return `
      <div class="shelf-card ${isStarred ? 'is-starred' : ''} ${item.status === 'inbox' ? 'is-inbox' : ''}" id="shelf-card-${item.id}">
        <!-- Top bar: Source, Domain, Badges, Star -->
        <div class="shelf-card-top">
          <div class="shelf-card-source">
            <div class="shelf-card-favicon-wrap">
              ${item.favicon ? `
                <img
                  src="${escapeHtml(item.favicon)}"
                  alt="${escapeHtml(domain)}"
                  class="shelf-card-favicon"
                  onerror="this.style.display='none';"
                />
              ` : ''}
            </div>
            <span class="shelf-card-domain" title="${escapeHtml(item.url)}">${escapeHtml(domain)}</span>
          </div>

          <div class="shelf-card-top-right">
            <!-- Status Badge -->
            <button
              class="disc-status-tag ${status.badgeClass}"
              onclick="cycleDiscoveryStatus('${item.id}', event)"
              title="Click to cycle status: Inbox -> Active -> In Use -> Archived"
            >
              ${status.icon} ${status.label}
            </button>

            <!-- Star button -->
            <button
              class="shelf-card-star-btn ${isStarred ? 'starred' : ''}"
              onclick="toggleShelfCardStar('${item.id}', event)"
              title="${isStarred ? 'Unstar discovery' : 'Star discovery'}"
            >
              ★
            </button>
          </div>
        </div>

        <!-- Body: Title, Monospace URL, GitHub Metadata -->
        <div class="shelf-card-body">
          <div class="shelf-card-header-row">
            <h3 class="shelf-card-title">
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(item.title)}">
                ${escapeHtml(item.title)}
              </a>
            </h3>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              ${item.collection ? `
                <button class="disc-collection-tag" onclick="selectCollectionFilter('${escapeHtml(item.collection)}', event)" title="Filter collection: ${escapeHtml(item.collection)}">
                  🏷️ ${escapeHtml(item.collection)}
                </button>
              ` : ''}
              <span class="disc-intent-tag" title="Intention: ${intent.label}">
                ${intent.emoji} ${intent.label}
              </span>
            </div>
          </div>

          <div class="shelf-card-url-mono" title="${escapeHtml(item.url)}">
            <span>${escapeHtml(item.url)}</span>
            <svg class="octicon" width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.5-.25a.75.75 0 0 1 .75-.75h4.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0V3.56l-5.72 5.72a.75.75 0 0 1-1.06-1.06l5.72-5.72H11a.75.75 0 0 1-.75-.75Z"></path>
            </svg>
          </div>

          <!-- GitHub Intelligence Pill (if repo) -->
          ${item.githubMeta ? `
            <div class="disc-github-bar">
              <div class="disc-gh-stat">
                <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                <span>${item.githubMeta.stars}</span>
              </div>
              ${item.githubMeta.language ? `<span class="disc-gh-lang">${escapeHtml(item.githubMeta.language)}</span>` : ''}
              ${item.githubMeta.description ? `<span class="disc-gh-desc" title="${escapeHtml(item.githubMeta.description)}">${escapeHtml(item.githubMeta.description)}</span>` : ''}
            </div>
          ` : ''}

          <!-- The Two Magic Questions: "Why I saved this" & "Potential use" -->
          ${item.whySaved ? `
            <div class="disc-context-box why-box">
              <span class="disc-context-heading">💭 Why I saved this:</span>
              <p class="disc-context-content">${escapeHtml(item.whySaved)}</p>
            </div>
          ` : ''}

          ${item.potentialUse ? `
            <div class="disc-context-box use-box">
              <span class="disc-context-heading">🚀 Potential use:</span>
              <p class="disc-context-content">${escapeHtml(item.potentialUse)}</p>
            </div>
          ` : ''}

          <!-- Project Context Badge -->
          ${item.project ? `
            <div class="shelf-card-project">
              <span class="shelf-project-label">Project:</span>
              <button class="shelf-project-value" onclick="selectProjectFilter('${escapeHtml(item.project)}', event)">
                📁 ${escapeHtml(item.project)}
              </button>
            </div>
          ` : ''}

          <!-- Tags -->
          ${Array.isArray(item.tags) && item.tags.length > 0 ? `
            <div class="shelf-card-tags">
              ${item.tags.map(t => `
                <span class="shelf-tag-pill">#${escapeHtml(t)}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Card Footer Actions Strip -->
        <div class="shelf-card-footer">
          <span class="shelf-card-date">${dateFormatted}</span>

          <div class="shelf-card-actions">
            <button class="shelf-action-btn" onclick="copyShelfMarkdown('${item.id}', event)" title="Copy Markdown reference snippet">
              <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 1.75C0 .784.784 0 1.75 0h7.5C9.716 0 10.5.784 10.5 1.75v3.5a.75.75 0 0 1-1.5 0V1.75a.25.25 0 0 0-.25-.25h-7.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25V9.75a.75.75 0 0 1 1.5 0v4.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm12.03 3.47a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L13.19 9H7.75a.75.75 0 0 1 0-1.5h5.44l-1.16-1.16a.75.75 0 0 1 0-1.06Z"></path>
              </svg>
              <span>📋 MD</span>
            </button>

            <button class="shelf-action-btn" onclick="copyShelfUrl('${escapeHtml(item.url)}', event)" title="Copy URL">
              <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
              </svg>
              <span>Copy</span>
            </button>

            <button class="shelf-action-btn" onclick="openShelfModal('${item.id}', event)" title="Edit context & details">
              <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25a1.75 1.75 0 0 1 .445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086ZM9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064L11.19 6.25 9.75 4.81Z"></path>
              </svg>
              <span>Edit</span>
            </button>

            <button class="shelf-action-btn delete-btn" onclick="deleteShelfCard('${item.id}', event)" title="Remove discovery">
              <svg class="octicon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.15l-.66 6.6A1.75 1.75 0 0 1 10.595 15H5.405a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.5h3a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Dense List Row Component
  function renderDiscoveryListRow(item) {
    const domain = window.ShelfStore ? window.ShelfStore.extractDomain(item.url) : item.url;
    const isStarred = Boolean(item.starred);
    const intent = INTENT_META[item.intent] || { label: item.intent, emoji: '📌' };

    return `
      <div class="discovery-list-row ${isStarred ? 'is-starred' : ''}">
        <div class="disc-list-col-main">
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="shelf-card-star-btn ${isStarred ? 'starred' : ''}" onclick="toggleShelfCardStar('${item.id}', event)">★</button>
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="disc-list-title">
              ${escapeHtml(item.title)}
            </a>
          </div>
          <div class="disc-list-url">${escapeHtml(domain)} · ${intent.emoji} ${intent.label}</div>
        </div>

        <div class="disc-list-col-proj">
          ${item.project ? `<span class="disc-list-proj-tag">📁 ${escapeHtml(item.project)}</span>` : '<span style="color:var(--fg-subtle);">-</span>'}
        </div>

        <div class="disc-list-col-notes">
          ${item.potentialUse ? `<div class="disc-list-note-use"><strong>Use:</strong> ${escapeHtml(item.potentialUse)}</div>` : ''}
          ${item.whySaved ? `<div class="disc-list-note-why"><strong>Why:</strong> ${escapeHtml(item.whySaved)}</div>` : ''}
        </div>

        <div class="disc-list-col-actions">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-gh btn-gh-sm">Open ↗</a>
          <button class="btn-gh btn-gh-sm" onclick="openShelfModal('${item.id}', event)">Edit</button>
        </div>
      </div>
    `;
  }

  // Empty state
  function renderEmptyState() {
    return `
      <div class="shelf-empty-state">
        <div class="shelf-empty-icon">
          <svg class="octicon" width="36" height="36" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.53 1.282a.5.5 0 0 1 .94 0l.732 2.253a4.5 4.5 0 0 0 2.893 2.893l2.253.732a.5.5 0 0 1 0 .94l-2.253.732a4.5 4.5 0 0 0-2.893 2.893l-.732 2.253a.5.5 0 0 1-.94 0l-.732-2.253a4.5 4.5 0 0 0-2.893-2.893L.655 8.16a.5.5 0 0 1 0-.94l2.253-.732a4.5 4.5 0 0 0 2.893-2.893L7.53 1.282Z"></path>
          </svg>
        </div>
        <h3 class="shelf-empty-title">No discoveries found in this view</h3>
        <p class="shelf-empty-text">
          ${currentSearch || currentProject || currentIntent !== 'all' || currentTab !== 'all'
            ? 'Try clearing active search or project filters.'
            : 'Use the 5-second Quick Capture bar at the top to save your first repo or design.'}
        </p>
        <div class="shelf-empty-actions">
          <button class="btn-gh" onclick="resetAllShelfFilters()">Show All Discoveries</button>
        </div>
      </div>
    `;
  }

  // Quick Capture in 5 seconds
  function handleQuickCapture() {
    const input = document.getElementById('quick-capture-url');
    if (!input) return;
    const url = input.value.trim();
    if (!url) return;

    if (!window.ShelfStore) return;
    window.ShelfStore.addQuick(url);
    input.value = '';
    renderDiscoveryUI();
    if (typeof showToast === 'function') showToast('Saved to Inbox in 5 seconds! 📥');
  }

  // Tab switching
  function switchDiscoveryTab(tab) {
    currentTab = tab;
    if (tab !== 'projects') currentProject = null;
    if (tab !== 'intentions') currentIntent = 'all';
    renderDiscoveryUI();
  }

  function selectProjectFilter(project, event) {
    if (event) event.stopPropagation();
    currentProject = project;
    currentTab = 'projects';
    renderDiscoveryUI();
  }

  function selectIntentFilter(intent) {
    currentIntent = intent;
    currentTab = 'intentions';
    renderDiscoveryUI();
  }

  function setViewMode(mode) {
    currentViewMode = mode;
    renderDiscoveryUI();
  }

  function handleShelfTypeFilter(type) {
    currentType = type;
    renderDiscoveryUI();
  }

  function handleShelfSearch(q) {
    currentSearch = q;
    renderDiscoveryUI();
  }

  function clearShelfSearch() {
    currentSearch = '';
    renderDiscoveryUI();
  }

  function handleShelfSortChange(sort) {
    currentSort = sort;
    renderDiscoveryUI();
  }

  function resetAllShelfFilters() {
    currentTab = 'all';
    currentProject = null;
    currentIntent = 'all';
    currentType = 'all';
    currentSearch = '';
    currentSort = 'newest';
    renderDiscoveryUI();
  }

  // Card Actions
  function toggleShelfCardStar(id, event) {
    if (event) event.stopPropagation();
    if (!window.ShelfStore) return;
    const isStarred = window.ShelfStore.toggleStar(id);
    renderDiscoveryUI();
    if (typeof showToast === 'function') {
      showToast(isStarred ? 'Saved to Starred! ⭐' : 'Removed from Starred');
    }
  }

  function setDiscoveryStatus(id, newStatus) {
    if (!window.ShelfStore) return;
    window.ShelfStore.updateStatus(id, newStatus);
    renderDiscoveryUI();
    if (typeof showToast === 'function') showToast(`Status updated to ${newStatus}`);
  }

  function cycleDiscoveryStatus(id, event) {
    if (event) event.stopPropagation();
    if (!window.ShelfStore) return;
    const item = window.ShelfStore.getById(id);
    if (!item) return;

    const cycle = ['inbox', 'active', 'in_use', 'archived'];
    const nextIdx = (cycle.indexOf(item.status) + 1) % cycle.length;
    setDiscoveryStatus(id, cycle[nextIdx]);
  }

  function copyShelfUrl(url, event) {
    if (event) event.stopPropagation();
    if (typeof copySnippetText === 'function') {
      copySnippetText(url, 'Discovery link copied!');
    } else {
      navigator.clipboard.writeText(url).then(() => {
        if (typeof showToast === 'function') showToast('Copied to clipboard!');
      });
    }
  }

  function deleteShelfCard(id, event) {
    if (event) event.stopPropagation();
    if (!window.ShelfStore) return;
    const item = window.ShelfStore.getById(id);
    if (confirm(`Remove "${item ? item.title : 'this discovery'}"?`)) {
      window.ShelfStore.delete(id);
      renderDiscoveryUI();
      if (typeof showToast === 'function') showToast('Discovery removed');
    }
  }

  // Add / Edit Modal Logic
  function openShelfModal(id) {
    editingDiscoveryId = id || null;
    const overlay = document.getElementById('shelf-modal-overlay');
    if (!overlay) return;

    const modalTitle = document.getElementById('shelf-modal-title');
    const inputUrl = document.getElementById('shelf-input-url');
    const inputTitle = document.getElementById('shelf-input-title');
    const selectType = document.getElementById('shelf-select-type');
    const selectIntent = document.getElementById('shelf-select-intent');
    const selectStatus = document.getElementById('shelf-select-status');
    const inputProject = document.getElementById('shelf-input-project');
    const inputCollection = document.getElementById('shelf-input-collection');
    const inputWhy = document.getElementById('shelf-input-why');
    const inputUse = document.getElementById('shelf-input-use');
    const inputTags = document.getElementById('shelf-input-tags');
    const saveBtn = document.getElementById('shelf-modal-submit-btn');

    if (editingDiscoveryId && window.ShelfStore) {
      const item = window.ShelfStore.getById(editingDiscoveryId);
      if (item) {
        if (modalTitle) modalTitle.textContent = 'Edit Discovery';
        if (inputUrl) inputUrl.value = item.url || '';
        if (inputTitle) inputTitle.value = item.title || '';
        if (selectType) selectType.value = item.type || 'tool';
        if (selectIntent) selectIntent.value = item.intent || 'might_use';
        if (selectStatus) selectStatus.value = item.status || 'active';
        if (inputProject) inputProject.value = item.project || '';
        if (inputCollection) inputCollection.value = item.collection || '';
        if (inputWhy) inputWhy.value = item.whySaved || '';
        if (inputUse) inputUse.value = item.potentialUse || '';
        if (inputTags) inputTags.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
        if (saveBtn) saveBtn.textContent = 'Save Changes';
      }
    } else {
      if (modalTitle) modalTitle.textContent = 'Add Resource / Discovery';
      if (inputUrl) inputUrl.value = '';
      if (inputTitle) inputTitle.value = '';
      if (selectType) selectType.value = 'repo';
      if (selectIntent) selectIntent.value = 'might_use';
      if (selectStatus) selectStatus.value = 'active';
      if (inputProject) inputProject.value = currentProject || '';
      if (inputCollection) inputCollection.value = currentCollection || '';
      if (inputWhy) inputWhy.value = '';
      if (inputUse) inputUse.value = '';
      if (inputTags) inputTags.value = currentTag ? currentTag : '';
      if (saveBtn) saveBtn.textContent = 'Add to Shelf';
    }

    overlay.classList.add('open');
    if (inputUrl) setTimeout(() => inputUrl.focus(), 80);
  }

  function closeShelfModal(event) {
    if (event && event.target && event.target.id !== 'shelf-modal-overlay') return;
    closeShelfModalDirect();
  }

  function closeShelfModalDirect() {
    const overlay = document.getElementById('shelf-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    editingDiscoveryId = null;
  }

  // URL input handler with auto-detection
  function handleShelfUrlInput(url) {
    if (!url || !window.ShelfStore) return;
    const clean = url.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) return;

    const selectType = document.getElementById('shelf-select-type');
    const inputTitle = document.getElementById('shelf-input-title');

    // Auto-detect type
    const detected = window.ShelfStore.detectTypeFromUrl(clean);
    if (selectType && selectType.value === 'tool') selectType.value = detected;

    // Auto-fetch GitHub data if repo
    if (clean.includes('github.com')) {
      window.ShelfStore.fetchGitHubMeta(clean).then(meta => {
        if (meta) {
          if (inputTitle && !inputTitle.value) inputTitle.value = `${meta.owner}/${meta.repo}`;
          const inputUse = document.getElementById('shelf-input-use');
          if (inputUse && !inputUse.value && meta.description) {
            inputUse.placeholder = `GitHub: ${meta.description}`;
          }
        }
      });
    }
  }

  // Submit Modal
  function submitShelfModal() {
    if (!window.ShelfStore) return;

    const inputUrl = document.getElementById('shelf-input-url');
    const inputTitle = document.getElementById('shelf-input-title');
    const selectType = document.getElementById('shelf-select-type');
    const selectIntent = document.getElementById('shelf-select-intent');
    const selectStatus = document.getElementById('shelf-select-status');
    const inputProject = document.getElementById('shelf-input-project');
    const inputCollection = document.getElementById('shelf-input-collection');
    const inputWhy = document.getElementById('shelf-input-why');
    const inputUse = document.getElementById('shelf-input-use');
    const inputTags = document.getElementById('shelf-input-tags');

    const url = inputUrl ? inputUrl.value.trim() : '';
    if (!url) {
      alert('Please enter a URL');
      if (inputUrl) inputUrl.focus();
      return;
    }

    const payload = {
      url: url,
      title: inputTitle ? inputTitle.value.trim() : '',
      type: selectType ? selectType.value : 'tool',
      intent: selectIntent ? selectIntent.value : 'might_use',
      status: selectStatus ? selectStatus.value : 'active',
      project: inputProject ? inputProject.value.trim() : '',
      collection: inputCollection ? inputCollection.value.trim() : '',
      whySaved: inputWhy ? inputWhy.value.trim() : '',
      potentialUse: inputUse ? inputUse.value.trim() : '',
      tags: inputTags ? inputTags.value : ''
    };

    if (editingDiscoveryId) {
      window.ShelfStore.update(editingDiscoveryId, payload);
      if (typeof showToast === 'function') showToast('Discovery updated!');
    } else {
      window.ShelfStore.add(payload);
      if (typeof showToast === 'function') showToast('Added to Discovery Library! ✨');
    }

    closeShelfModalDirect();
    renderDiscoveryUI();
  }

  // Export / Import
  function exportShelfMD() {
    if (!window.ShelfStore) return;
    window.ShelfStore.exportMarkdown();
    if (typeof showToast === 'function') showToast('Exported DISCOVERY-LIBRARY.md');
  }

  function exportShelfJSON() {
    if (!window.ShelfStore) return;
    window.ShelfStore.exportJSON();
    if (typeof showToast === 'function') showToast('Backup downloaded');
  }

  function triggerImportJSON() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        if (!window.ShelfStore) return;
        const res = window.ShelfStore.importJSON(evt.target.result, 'merge');
        if (res.success) {
          renderDiscoveryUI();
          if (typeof showToast === 'function') showToast(`Imported ${res.count} new discoveries! Total: ${res.total}`);
        } else {
          alert('Failed to import JSON: ' + (res.error || 'Unknown error'));
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Global Event Listeners & Shortcuts
  document.addEventListener('click', function (e) {
    if (!isLibraryActive) return;
    const navBtn = e.target.closest('.subnav-tab, .cat-pill');
    if (navBtn && navBtn.id !== 'shelf-nav-tab') {
      closeShelfView();
    }
  });

  document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('shelf-modal-overlay');
    const isModalOpen = modal && modal.classList.contains('open');

    const bookmarkletModal = document.getElementById('shelf-bookmarklet-modal');
    const isBookmarkletOpen = bookmarkletModal && bookmarkletModal.classList.contains('open');

    if (isModalOpen) {
      if (e.key === 'Escape') {
        closeShelfModalDirect();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitShelfModal();
      }
      return;
    }

    if (isBookmarkletOpen) {
      if (e.key === 'Escape') {
        closeBookmarkletModalDirect();
      }
      return;
    }

    if (isLibraryActive) {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        if (e.key === '/') {
          e.preventDefault();
          const searchInput = document.getElementById('shelf-search-input');
          if (searchInput) searchInput.focus();
        } else if (e.key === 'n' || e.key === '+') {
          e.preventDefault();
          openShelfModal();
        } else if (e.key === 'm') {
          e.preventDefault();
          exportShelfMD();
        } else if (e.key === 'b') {
          e.preventDefault();
          exportShelfJSON();
        } else if (e.key === '1') {
          setViewMode('grid');
        } else if (e.key === '2') {
          setViewMode('list');
        } else if (e.key === 'Escape') {
          if (currentTag) clearTagFilter();
          else if (currentCollection) clearCollectionFilter();
          else if (currentSearch) clearShelfSearch();
          else if (isTagCloudOpen) toggleTagCloud();
        }
      }
    }
  });

  // Expose to window
  root.openShelfView = openShelfView;
  root.closeShelfView = closeShelfView;
  root.renderShelfUI = renderDiscoveryUI;
  root.renderDiscoveryUI = renderDiscoveryUI;
  root.renderCollectionsOverview = renderCollectionsOverview;
  root.selectCollectionFilter = selectCollectionFilter;
  root.clearCollectionFilter = clearCollectionFilter;
  root.selectTagFilter = selectTagFilter;
  root.clearTagFilter = clearTagFilter;
  root.toggleTagCloud = toggleTagCloud;
  root.copyShelfMarkdown = copyShelfMarkdown;
  root.copyAllFilteredMarkdown = copyAllFilteredMarkdown;
  root.openBookmarkletModal = openBookmarkletModal;
  root.closeBookmarkletModal = closeBookmarkletModal;
  root.closeBookmarkletModalDirect = closeBookmarkletModalDirect;
  root.copyBookmarkletCode = copyBookmarkletCode;
  root.openShelfModal = openShelfModal;
  root.closeShelfModal = closeShelfModal;
  root.closeShelfModalDirect = closeShelfModalDirect;
  root.submitShelfModal = submitShelfModal;
  root.handleQuickCapture = handleQuickCapture;
  root.handleShelfUrlInput = handleShelfUrlInput;
  root.handleShelfSearch = handleShelfSearch;
  root.clearShelfSearch = clearShelfSearch;
  root.handleShelfTypeFilter = handleShelfTypeFilter;
  root.switchDiscoveryTab = switchDiscoveryTab;
  root.selectProjectFilter = selectProjectFilter;
  root.selectIntentFilter = selectIntentFilter;
  root.setViewMode = setViewMode;
  root.handleShelfSortChange = handleShelfSortChange;
  root.resetAllShelfFilters = resetAllShelfFilters;
  root.toggleShelfCardStar = toggleShelfCardStar;
  root.setDiscoveryStatus = setDiscoveryStatus;
  root.cycleDiscoveryStatus = cycleDiscoveryStatus;
  root.cycleRediscoverItem = cycleRediscoverItem;
  root.copyShelfUrl = copyShelfUrl;
  root.deleteShelfCard = deleteShelfCard;
  root.exportShelfMD = exportShelfMD;
  root.exportShelfJSON = exportShelfJSON;
  root.triggerImportJSON = triggerImportJSON;
  root.updateShelfNavCounter = updateShelfNavCounter;

})(typeof window !== 'undefined' ? window : this);
