const fs = require('fs');

function addTokenMonitorTab(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const target = `<button class="subnav-tab" id="tab-review" onclick="filterMainCategory('review')">
      <svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>
      Code Review <span class="counter-bubble" id="count-review">6</span>
    </button>`;

  const replacement = `<button class="subnav-tab" id="tab-review" onclick="filterMainCategory('review')">
      <svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>
      Code Review <span class="counter-bubble" id="count-review">6</span>
    </button>
    <a href="pages/token-monitor.html" class="subnav-tab" style="text-decoration:none;" title="Live Token & Cost Telemetry Monitor">
      <svg class="octicon" width="14" height="14" viewBox="0 0 16 16"><path d="M1.5 14.25a.75.75 0 0 1 0-1.5H2v-6.25a.75.75 0 0 1 1.5 0V12.75h2V8a.75.75 0 0 1 1.5 0v4.75h2V5a.75.75 0 0 1 1.5 0v7.75h2V3a.75.75 0 0 1 1.5 0v9.75h.5a.75.75 0 0 1 0 1.5Z"/></svg>
      Token Monitor <span class="counter-bubble" style="background:var(--accent-blue-bg);color:var(--accent-blue);">Live</span>
    </a>`;

  if (content.includes('href="pages/token-monitor.html" class="subnav-tab"')) {
    console.log(`Subnav tab already exists in ${filePath}`);
    return;
  }

  // Handle both CRLF and LF
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedContent = content.replace(/\r\n/g, '\n');

  if (normalizedContent.includes(normalizedTarget)) {
    const updated = normalizedContent.replace(normalizedTarget, replacement.replace(/\r\n/g, '\n'));
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Successfully added Token Monitor subnav tab to ${filePath}`);
  } else {
    console.log(`Could not find target in ${filePath}`);
  }
}

addTokenMonitorTab('index.html');
if (fs.existsSync('skill-gui.html')) {
  addTokenMonitorTab('skill-gui.html');
}
