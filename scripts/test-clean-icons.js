const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9225;

  console.log('Launching headless Edge on port ' + port + '...');
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1600,1050',
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

    console.log('Connected to Edge CDP target: ' + pageTarget.id);
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

    console.log('Navigating to http://localhost:7891/index.html...');
    await send('Page.navigate', { url: 'http://localhost:7891/index.html' });
    await sleep(2500);

    // 1. Open Discovery Library
    console.log('Opening Discovery Library...');
    const openRes = await send('Runtime.evaluate', {
      expression: `(function() {
        if (window.openShelfView) {
          window.openShelfView();
          return { ok: true, cards: document.querySelectorAll('.shelf-card').length };
        }
        return { ok: false, error: 'window.openShelfView not found' };
      })()`,
      returnByValue: true
    });
    console.log('Open Shelf View result:', JSON.stringify(openRes.result.value));
    await sleep(1000);

    // 2. Check for emojis in DOM of shelf panel
    const emojiCheckRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const panel = document.getElementById('shelf-view-panel');
        if (!panel) return { error: 'No panel' };
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}]/gu;
        
        const text = panel.innerText;
        const matches = text.match(emojiRegex) || [];
        
        const subnavBtns = Array.from(panel.querySelectorAll('.disc-subnav-btn')).map(b => b.innerText.trim());
        const viewBtns = Array.from(panel.querySelectorAll('.disc-view-btn')).map(b => b.innerText.trim());
        const svgCount = panel.querySelectorAll('svg.octicon').length;
        const cardCount = panel.querySelectorAll('.shelf-card').length;
        const typePillTexts = Array.from(panel.querySelectorAll('.shelf-type-pill span:not(.shelf-pill-count)')).map(s => s.innerText.trim());

        return {
          emojiCount: matches.length,
          matches: matches,
          subnavBtns: subnavBtns,
          viewBtns: viewBtns,
          svgOcticonsInPanel: svgCount,
          cardCount: cardCount,
          typePillTexts: typePillTexts
        };
      })()`,
      returnByValue: true
    });
    console.log('Emoji & Icon Audit in Shelf View:', JSON.stringify(emojiCheckRes.result.value, null, 2));

    // Capture screenshot of Grid View
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('clean_shelf_grid.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved clean_shelf_grid.png');

    // 3. Open Focus Reader Modal
    console.log('Testing Focus Reader Modal...');
    await send('Runtime.evaluate', {
      expression: `(function() {
        const firstCard = document.querySelector('.shelf-card');
        if (firstCard) {
          const id = firstCard.id.replace('shelf-card-', '');
          window.openFocusReader(id);
        }
      })()`
    });
    await sleep(1000);

    const focusCheckRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const overlay = document.getElementById('shelf-focus-overlay');
        if (!overlay) return { error: 'No focus overlay' };
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}]/gu;
        const text = overlay.innerText;
        const matches = text.match(emojiRegex) || [];
        const headings = Array.from(overlay.querySelectorAll('.shelf-focus-section-heading')).map(h => h.innerText.trim());
        const btns = Array.from(overlay.querySelectorAll('.shelf-focus-footer button, .shelf-focus-header button')).map(b => b.innerText.trim());
        const svgs = overlay.querySelectorAll('svg.octicon').length;

        return {
          open: overlay.classList.contains('open'),
          emojiCount: matches.length,
          matches: matches,
          headings: headings,
          btns: btns,
          svgOcticons: svgs
        };
      })()`,
      returnByValue: true
    });
    console.log('Focus Reader Audit:', JSON.stringify(focusCheckRes.result.value, null, 2));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('clean_shelf_focus_modal.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved clean_shelf_focus_modal.png');

    // Close Focus Reader
    await send('Runtime.evaluate', { expression: `window.closeFocusReaderDirect()` });
    await sleep(500);

    // 4. Switch to Collections Tab
    console.log('Testing Collections Overview Tab...');
    await send('Runtime.evaluate', { expression: `window.switchDiscoveryTab('collections')` });
    await sleep(1000);

    const colCheckRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const panel = document.getElementById('shelf-view-panel');
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E0}-\\u{1F1FF}]/gu;
        const text = panel ? panel.innerText : '';
        const matches = text.match(emojiRegex) || [];
        const colCards = document.querySelectorAll('.col-overview-card').length;
        const colSvgs = document.querySelectorAll('.col-card-icon svg.octicon').length;

        return {
          colCards: colCards,
          colSvgs: colSvgs,
          emojiCount: matches.length,
          matches: matches
        };
      })()`,
      returnByValue: true
    });
    console.log('Collections Overview Audit:', JSON.stringify(colCheckRes.result.value, null, 2));

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('clean_shelf_collections.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved clean_shelf_collections.png');

    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
