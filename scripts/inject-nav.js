const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

const navHtml = [
  '    <a class="btn-gh" href="pages/token-monitor.html" target="_blank" title="Live Token Monitor" style="text-decoration:none;">\r',
  '      <svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M1.5 14.25a.75.75 0 0 1 0-1.5H2v-6.25a.75.75 0 0 1 1.5 0V12.75h2V8a.75.75 0 0 1 1.5 0v4.75h2V5a.75.75 0 0 1 1.5 0v7.75h2V3a.75.75 0 0 1 1.5 0v9.75h.5a.75.75 0 0 1 0 1.5Z"/></svg>\r',
  '      Token Monitor\r',
  '    </a>\r'
];

// Insert after line 73 (0-indexed: 72) which is the closing </button> tag
lines.splice(73, 0, ...navHtml);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done. Lines now:', lines.length);
// Verify
const verify = fs.readFileSync(file, 'utf8');
const vLines = verify.split('\n');
console.log('L73-80:');
vLines.slice(72, 80).forEach((l, i) => console.log((73+i) + ':', l.slice(0, 90)));
