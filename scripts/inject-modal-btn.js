const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const skillGuiPath = path.join(__dirname, '..', 'skill-gui.html');

let html = fs.readFileSync(indexPath, 'utf8');

const target = '<button class="btn-gh" onclick="fetchSessionTelemetry(false)">Refresh Now</button>';
const replacement = '<a href="pages/token-monitor.html" target="_blank" class="btn-gh" style="text-decoration:none;gap:5px;" title="Open full-screen live Token Monitor dashboard"><svg class="octicon" width="12" height="12" viewBox="0 0 16 16"><path d="M1.5 14.25a.75.75 0 0 1 0-1.5H2v-6.25a.75.75 0 0 1 1.5 0V12.75h2V8a.75.75 0 0 1 1.5 0v4.75h2V5a.75.75 0 0 1 1.5 0v7.75h2V3a.75.75 0 0 1 1.5 0v9.75h.5a.75.75 0 0 1 0 1.5Z"/></svg> Open Full Monitor ↗</a>\r\n        <button class="btn-gh" onclick="fetchSessionTelemetry(false)">Refresh Now</button>';

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync(indexPath, html, 'utf8');
  fs.writeFileSync(skillGuiPath, html, 'utf8');
  console.log('Successfully injected button into index.html and skill-gui.html');
} else {
  console.log('Target not found in index.html');
}
