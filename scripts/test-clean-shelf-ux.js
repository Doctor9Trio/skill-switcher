const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9227;

  console.log('🚀 Launching headless Edge on port ' + port + '...');
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1600,1100',
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

    console.log('Navigating to http://localhost:7891/index.html...');
    await send('Page.navigate', { url: 'http://localhost:7891/index.html' });
    await sleep(2500);

    // Call openShelfView explicitly to activate Discovery Library
    console.log('Opening Discovery Library view...');
    await send('Runtime.evaluate', { expression: 'if (typeof openShelfView === "function") openShelfView();' });
    await sleep(1500);

    // Evaluate checks
    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const addResourceBtn = document.getElementById('shelf-add-resource-btn');
        const quickCapture = document.querySelector('.discovery-quick-strip');
        const cards = document.querySelectorAll('.shelf-card');
        const firstCard = cards[0];
        
        let firstCardInfo = null;
        if (firstCard) {
          const domainLink = firstCard.querySelector('.shelf-card-domain-link');
          const titleLink = firstCard.querySelector('.shelf-card-title a');
          const directBtn = firstCard.querySelector('.shelf-card-direct-link-btn');
          const desc = firstCard.querySelector('.shelf-card-description');
          const primaryVisitBtn = firstCard.querySelector('.shelf-action-btn.primary-visit-btn');
          const editBtn = firstCard.querySelector('button[title*="Edit"]');
          const deleteBtn = firstCard.querySelector('.delete-btn');
          const computed = window.getComputedStyle(firstCard);

          firstCardInfo = {
            title: titleLink ? titleLink.textContent.trim() : null,
            hasDomainLink: Boolean(domainLink && domainLink.href),
            domainText: domainLink ? domainLink.textContent.trim() : null,
            domainLinkHref: domainLink ? domainLink.href : null,
            hasDirectVisitBtn: Boolean(directBtn && directBtn.href),
            hasDescription: Boolean(desc && desc.textContent.trim().length > 10),
            descPreview: desc ? desc.textContent.trim().slice(0, 90) : null,
            hasPrimaryVisitBtn: Boolean(primaryVisitBtn && primaryVisitBtn.href),
            primaryVisitHref: primaryVisitBtn ? primaryVisitBtn.href : null,
            hasEditBtn: Boolean(editBtn),
            hasDeleteBtn: Boolean(deleteBtn),
            borderTopWidth: computed.borderTopWidth,
            borderTopColor: computed.borderTopColor
          };
        }

        const activeTab = document.querySelector('.subnav-tab.active');
        const activeTabStyle = activeTab ? window.getComputedStyle(activeTab) : null;

        return {
          totalCards: cards.length,
          addResourceBtnExists: Boolean(addResourceBtn),
          quickCaptureExists: Boolean(quickCapture),
          activeTabLabel: activeTab ? activeTab.textContent.trim().replace(/\\s+/g, ' ') : null,
          activeTabBorderColor: activeTabStyle ? activeTabStyle.borderBottomColor : null,
          firstCardInfo
        };
      })()`
    });

    const testOutput = (evalRes && evalRes.result && evalRes.result.value) ? evalRes.result.value : (evalRes ? evalRes.value : null);
    console.log('✅ TEST RESULTS:');
    console.log(JSON.stringify(testOutput, null, 2));

    const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = path.join(__dirname, 'clean-shelf-verified.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log('📸 Screenshot saved to: ' + screenshotPath);

    cleanup();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    cleanup();
    process.exit(1);
  }
}

run();
