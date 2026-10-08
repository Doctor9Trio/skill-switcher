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
    if (openTarget || categoryTarget || presetTarget || filterTarget) {
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