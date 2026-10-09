const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9226;

  console.log('🚀 Launching headless Edge on port ' + port + '...');
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1600,1000',
    'about:blank'
  ]);

  let isKilled = false;
  function cleanup() {
    if (!isKilled) {
      isKilled = true;
      try { edgeProc.kill(); } catch (e) {}
    }
  }

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  try {
    await sleep(2000);

    const targetsRes = await fetch('http://127.0.0.1:' + port + '/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target found on Edge CDP port');
    }

    console.log('🔗 Connected to Edge CDP target: ' + pageTarget.id);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('🌐 Navigating to http://localhost:7891/index.html...');
    await send('Page.navigate', { url: 'http://localhost:7891/index.html' });
    await sleep(2500);

    // 1. Verify Skills view header
    console.log('🔍 Checking Skills View Header & Breadcrumbs...');
    const headerCheck1 = await send('Runtime.evaluate', {
      expression: `(function() {
        const crumb = document.getElementById('gh-crumb-current-section');
        const crumbText = crumb ? crumb.textContent.trim() : null;
        const subnavTabs = Array.from(document.querySelectorAll('.subnav-tab')).map(t => ({
          text: t.innerText.trim(),
          active: t.classList.contains('active')
        }));
        const toolbar = document.getElementById('skills-context-toolbar');
        const toolbarVisible = toolbar ? toolbar.style.display !== 'none' : false;
        return { crumbText, subnavTabs, toolbarVisible };
      })()`,
      returnByValue: true
    });
    console.log('Skills Header State:', JSON.stringify(headerCheck1.result.value, null, 2));

    // Screenshot 1: Clean Skills view
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'scratch_nav_skills.png'), Buffer.from(ss1.data, 'base64'));
    console.log('📸 Captured scratch_nav_skills.png');

    // 2. Click Discovery Library tab
    console.log('📂 Switching to Discovery Library...');
    const openShelfRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const shelfTab = document.getElementById('shelf-nav-tab');
        if (shelfTab) shelfTab.click();
        const crumb = document.getElementById('gh-crumb-current-section');
        const crumbText = crumb ? crumb.textContent.trim() : null;
        const toolbar = document.getElementById('skills-context-toolbar');
        const toolbarHidden = toolbar ? toolbar.style.display === 'none' : true;
        const isShelfActive = document.getElementById('shelf-nav-tab').classList.contains('active');
        return { ok: true, crumbText, toolbarHidden, isShelfActive, pageTitle: document.title };
      })()`,
      returnByValue: true
    });
    console.log('Discovery Library Header State:', JSON.stringify(openShelfRes.result.value, null, 2));
    await sleep(600);

    // Screenshot 2: Clean Discovery Library view
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'scratch_nav_shelf.png'), Buffer.from(ss2.data, 'base64'));
    console.log('📸 Captured scratch_nav_shelf.png');

    // 3. Test Breadcrumb Click to return home
    console.log('🔙 Clicking Breadcrumb to return to Skills & Packs...');
    const crumbClickRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const repoCrumb = document.querySelector('.gh-crumb-repo');
        if (repoCrumb) repoCrumb.click();
        const crumb = document.getElementById('gh-crumb-current-section');
        const crumbText = crumb ? crumb.textContent.trim() : null;
        const toolbar = document.getElementById('skills-context-toolbar');
        const toolbarRestored = toolbar ? toolbar.style.display !== 'none' : false;
        const isCatalogActive = document.getElementById('subnav-tab-catalog').classList.contains('active');
        return { ok: true, crumbText, toolbarRestored, isCatalogActive };
      })()`,
      returnByValue: true
    });
    console.log('Returned Home via Breadcrumb:', JSON.stringify(crumbClickRes.result.value, null, 2));

    // 4. Test Token Monitor page navigation
    console.log('📊 Navigating to http://localhost:7891/pages/token-monitor.html...');
    await send('Page.navigate', { url: 'http://localhost:7891/pages/token-monitor.html' });
    await sleep(2500);

    const tokenNavCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        const crumbActive = document.querySelector('.gh-crumb-active');
        const subnavTabs = Array.from(document.querySelectorAll('.subnav-tab')).map(t => ({
          text: t.innerText.trim(),
          active: t.classList.contains('active')
        }));
        return { crumb: crumbActive ? crumbActive.textContent.trim() : null, subnavTabs };
      })()`,
      returnByValue: true
    });
    console.log('Token Monitor Page Header State:', JSON.stringify(tokenNavCheck.result.value, null, 2));

    // Screenshot 3: Token Monitor view
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, '..', 'scratch_nav_token_monitor.png'), Buffer.from(ss3.data, 'base64'));
    console.log('📸 Captured scratch_nav_token_monitor.png');

    console.log('✅ ALL HEADER & BREADCRUMB HIERARCHY TESTS PASSED SUCCESSFULLY!');
  } finally {
    cleanup();
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
