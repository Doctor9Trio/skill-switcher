/* Skill Switcher — Application Entry Point */
/* Contains: window.addEventListener focus/keyboard, startup event handlers, and Deep Linking Router */

// Deep Linking Router (Handles ?open=laya, ?open=keys, ?open=health, ?open=telemetry, ?category=XYZ)
function handleDeepLinking() {
  try {
    const params = new URLSearchParams(window.location.search);
    const openTarget = params.get('open');
    const categoryTarget = params.get('category');
    const presetTarget = params.get('preset');
    const filterTarget = params.get('filter');

    if (openTarget) {
      setTimeout(() => {
        switch (openTarget.toLowerCase()) {
          case 'laya':
            if (typeof openLayaPlayground === 'function') openLayaPlayground();
            break;
          case 'keys':
          case 'keyvault':
            if (typeof openKeyVaultModal === 'function') openKeyVaultModal();
            break;
          case 'health':
          case 'matrix':
            if (typeof openHealthModal === 'function') openHealthModal();
            break;
          case 'telemetry':
            if (typeof openTelemetryModal === 'function') openTelemetryModal();
            break;
          case 'guide':
          case 'jev':
            if (typeof openJevGuide === 'function') openJevGuide();
            break;
          case 'shelf':
          case 'archive':
          case 'library':
            if (typeof openShelfView === 'function') openShelfView();
            break;
          case 'token-monitor':
          case 'tokenmonitor':
            window.location.href = 'pages/token-monitor.html';
            return;
        }
      }, 120);
    }

    const quickSaveUrl = params.get('quickSaveUrl') || params.get('addUrl');
    const quickSaveTitle = params.get('quickSaveTitle') || params.get('title');

    if (quickSaveUrl) {
      setTimeout(() => {
        if (typeof openShelfView === 'function') openShelfView();
        if (window.ShelfStore) {
          window.ShelfStore.addQuick(quickSaveUrl, '', '', '');
          if (typeof renderDiscoveryUI === 'function') renderDiscoveryUI();
          if (typeof showToast === 'function') {
            showToast('Saved resource to Shelf Inbox! 📥');
          }
        }
      }, 150);
    }

    if (categoryTarget && typeof filterMainCategory === 'function') {
      setTimeout(() => filterMainCategory(categoryTarget), 250);
    }

    if (presetTarget && typeof applyPreset === 'function') {
      setTimeout(() => applyPreset(presetTarget), 400);
    }

    if (filterTarget) {
      setTimeout(() => {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
          searchInput.value = filterTarget;
          if (typeof handleSearch === 'function') handleSearch(filterTarget);
        }
      }, 300);
    }

    // Clean query parameters from URL bar without reloading
    if (openTarget || categoryTarget || presetTarget || filterTarget || quickSaveUrl) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (err) {
    console.warn('[SkillSwitcher] Deep linking router warning:', err);
  }
}

// Window focus listener for live sync
window.addEventListener('focus', () => {
  if (typeof initServerSync === 'function') initServerSync();
  if (typeof fetchSessionTelemetry === 'function') fetchSessionTelemetry(true);
});

// Boot sync & startup
setTimeout(() => {
  if (typeof initServerSync === 'function') initServerSync();
  if (typeof fetchSessionTelemetry === 'function') fetchSessionTelemetry(true);
  if (typeof updateShelfNavCounter === 'function') updateShelfNavCounter();
  handleDeepLinking();
  
  // Background interval poll (every 15s)
  if (!telemetryPollTimer) {
    telemetryPollTimer = setInterval(() => {
      if (typeof fetchSessionTelemetry === 'function') fetchSessionTelemetry(true);
    }, 15000);
  }
}, 300);

// --- Navigation Breadcrumb & Header Hierarchy Controller ---
function setNavBreadcrumb(sectionId, customLabel) {
  const crumbEl = document.getElementById('gh-crumb-current-section');
  if (!crumbEl) return;

  const SECTION_MAP = {
    'skills': { id: 'skills', label: 'skills', title: 'Doctor9Trio / skill-switcher · Skills & Packs' },
    'shelf': { id: 'discovery-library', label: 'discovery-library', title: 'Doctor9Trio / skill-switcher · Discovery Library' },
    'discovery-library': { id: 'discovery-library', label: 'discovery-library', title: 'Doctor9Trio / skill-switcher · Discovery Library' },
    'token-monitor': { id: 'token-monitor', label: 'token-monitor', title: 'Doctor9Trio / skill-switcher · Live Token Monitor' },
    'laya': { id: 'laya-playground', label: 'laya-playground', title: 'Doctor9Trio / skill-switcher · Laya Playground' },
    'laya-playground': { id: 'laya-playground', label: 'laya-playground', title: 'Doctor9Trio / skill-switcher · Laya Playground' },
    'keys': { id: 'key-vault', label: 'key-vault', title: 'Doctor9Trio / skill-switcher · API Key Vault' },
    'key-vault': { id: 'key-vault', label: 'key-vault', title: 'Doctor9Trio / skill-switcher · API Key Vault' },
    'health': { id: 'verification-matrix', label: 'verification-matrix', title: 'Doctor9Trio / skill-switcher · Verification Matrix' },
    'verification-matrix': { id: 'verification-matrix', label: 'verification-matrix', title: 'Doctor9Trio / skill-switcher · Verification Matrix' }
  };

  const info = SECTION_MAP[sectionId] || { id: sectionId, label: customLabel || sectionId, title: 'Doctor9Trio / skill-switcher · ' + (customLabel || sectionId) };
  crumbEl.textContent = info.label;
  crumbEl.setAttribute('data-section', info.id);
  document.title = info.title;
}

function navigateHome() {
  if (typeof closeShelfView === 'function') closeShelfView();
  if (typeof filterMainCategory === 'function') filterMainCategory('all');
  setNavBreadcrumb('skills');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleCrumbClick() {
  const crumbEl = document.getElementById('gh-crumb-current-section');
  const section = crumbEl ? crumbEl.getAttribute('data-section') : 'skills';
  if (section === 'discovery-library' || section === 'shelf') {
    if (typeof openShelfView === 'function') openShelfView();
  } else if (section === 'token-monitor') {
    window.location.href = 'pages/token-monitor.html';
  } else {
    navigateHome();
  }
}

window.setNavBreadcrumb = setNavBreadcrumb;
window.navigateHome = navigateHome;
window.handleCrumbClick = handleCrumbClick;
