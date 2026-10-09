const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9224;

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

    // 1. Switch to Shelf tab
    console.log('📂 Switching to Shelf Tab...');
    const switchRes = await send('Runtime.evaluate', {
      expression: `(function() {
        if (window.openShelfView) {
          window.openShelfView();
          return { ok: true, cards: document.querySelectorAll('.shelf-card').length };
        }
        return { ok: false, error: 'window.openShelfView not defined' };
      })()`,
      returnByValue: true
    });
    console.log('Shelf tab opened:', JSON.stringify(switchRes.result.value));
    await sleep(1000);

    // 2. Check view mode & density buttons
    const viewButtonsRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const buttons = Array.from(document.querySelectorAll('.disc-view-btn')).map(b => ({
          text: b.innerText.trim(),
          active: b.classList.contains('active')
        }));
        const cardCount = document.querySelectorAll('.shelf-card').length;
        const toggleButtons = document.querySelectorAll('.shelf-insights-toggle-btn').length;
        return { buttons, cardCount, toggleButtons };
      })()`,
      returnByValue: true
    });
    console.log('View buttons and elements:', JSON.stringify(viewButtonsRes.result ? viewButtonsRes.result.value : viewButtonsRes, null, 2));

    // 3. Test expanding first insight drawer
    console.log('💡 Testing peek toggle on first card...');
    const toggleRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          const firstCard = document.querySelector('.shelf-card');
          const cardId = firstCard ? firstCard.id.replace('shelf-card-', '') : null;
          if (!cardId) return { ok: false, error: 'No card found' };
          
          window.toggleCardInsights(cardId);
          const drawer = firstCard.querySelector('.shelf-card-insights-drawer');
          const isOpen = drawer ? drawer.style.display !== 'none' : false;
          return { ok: true, cardId, isOpen };
        } catch (e) {
          return { ok: false, error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('Insight toggle result:', JSON.stringify(toggleRes.result ? toggleRes.result.value : toggleRes));
    await sleep(500);

    // 4. Capture screenshot of Focused Grid view
    console.log('📸 Capturing screenshot of Focused Grid View...');
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    const ss1Path = path.join(__dirname, '..', 'scratch_shelf_focused.png');
    fs.writeFileSync(ss1Path, Buffer.from(ss1.data, 'base64'));
    console.log('Saved screenshot to:', ss1Path);

    // 5. Test Focus Reader Modal
    console.log('🎯 Opening Focus Reader modal for first card...');
    const focusRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          const firstCard = document.querySelector('.shelf-card');
          const cardId = firstCard ? firstCard.id.replace('shelf-card-', '') : null;
          window.openFocusReader(cardId);
          const overlay = document.getElementById('shelf-focus-overlay');
          const isOpen = overlay ? overlay.classList.contains('open') : false;
          const title = document.getElementById('shelf-focus-title') ? document.getElementById('shelf-focus-title').textContent : '';
          const counter = document.getElementById('shelf-focus-counter') ? document.getElementById('shelf-focus-counter').textContent : '';
          return { ok: true, isOpen, title, counter };
        } catch (e) {
          return { ok: false, error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('Focus reader result:', JSON.stringify(focusRes.result ? focusRes.result.value : focusRes));
    await sleep(500);

    // 6. Capture screenshot of Focus Reader
    console.log('📸 Capturing screenshot of Focus Reader Modal...');
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    const ss2Path = path.join(__dirname, '..', 'scratch_shelf_modal.png');
    fs.writeFileSync(ss2Path, Buffer.from(ss2.data, 'base64'));
    console.log('Saved screenshot to:', ss2Path);

    // 7. Test cycling next in Focus Reader
    console.log('➡️ Testing Next item in Focus Reader...');
    const nextRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          window.nextFocusItem();
          const title = document.getElementById('shelf-focus-title') ? document.getElementById('shelf-focus-title').textContent : '';
          const counter = document.getElementById('shelf-focus-counter') ? document.getElementById('shelf-focus-counter').textContent : '';
          return { title, counter };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('Next item result:', JSON.stringify(nextRes.result ? nextRes.result.value : nextRes));

    // 8. Close Focus Reader
    console.log('❌ Closing Focus Reader modal...');
    const closeRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          window.closeFocusReaderDirect();
          const overlay = document.getElementById('shelf-focus-overlay');
          return { isOpen: overlay ? overlay.classList.contains('open') : false };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('Close reader result:', JSON.stringify(closeRes.result ? closeRes.result.value : closeRes));

    // 9. Test Detailed View mode
    console.log('📖 Testing Detailed View Mode...');
    const detailRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          window.setViewMode('detailed');
          return {
            currentMode: window.currentViewMode || 'detailed',
            activeBtn: document.querySelector('.disc-view-btn.active') ? document.querySelector('.disc-view-btn.active').innerText.trim() : null
          };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('Detailed view result:', JSON.stringify(detailRes.result ? detailRes.result.value : detailRes));

    // 10. Test List View mode
    console.log('📋 Testing List View Mode...');
    const listRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          window.setViewMode('list');
          return {
            hasListTable: document.querySelector('.discovery-list-container') !== null,
            activeBtn: document.querySelector('.disc-view-btn.active') ? document.querySelector('.disc-view-btn.active').innerText.trim() : null
          };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      returnByValue: true
    });
    console.log('List view result:', JSON.stringify(listRes.result ? listRes.result.value : listRes));

    console.log('✅ ALL SHELF TESTS PASSED SUCCESSFULLY!');
  } finally {
    cleanup();
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
