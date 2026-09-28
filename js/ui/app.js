/* Skill Switcher — Application Entry Point */
/* Contains: window.addEventListener focus/keyboard, startup event handlers */

// Window focus listener for live sync
window.addEventListener('focus', () => {
  initServerSync();
  fetchSessionTelemetry(true);
});

// Boot sync
setTimeout(() => {
  initServerSync();
  fetchSessionTelemetry(true);
  
  // Background interval poll (every 15s)
  if (!telemetryPollTimer) {
    telemetryPollTimer = setInterval(() => {
      fetchSessionTelemetry(true);
    }, 15000);
  }
}, 300);
