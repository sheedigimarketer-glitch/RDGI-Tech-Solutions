const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9339;

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'debug-edge-'));
  const proc = spawn(EDGE, ['--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, '--headless=new', 'about:blank'], { stdio: 'ignore' });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getJson = url => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
  let targets;
  for (let i = 0; i < 30; i++) { await sleep(300); try { targets = await getJson('http://127.0.0.1:' + PORT + '/json'); if (targets.length) break; } catch (e) {} }
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  const send = (method, params = {}) => new Promise((res, rej) => { const i = id++; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result.value; };

  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:8099/' });
  await sleep(1500);
  await ev("window.herSpaceStore.setLanguage('ta')");
  await ev("window.herSpaceApp.navigate('home')");
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(500);

  const debug = await ev(`(function() {
    var banner = document.querySelector('.pricing-banner');
    var p = banner.querySelector('div[style*="z-index:2"]');
    p.style.width = '100%';
    p.style.minWidth = '0';
    p.style.maxWidth = '100%';

    var grid = p.children[3];
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))';

    var W = document.documentElement.clientWidth;
    var bad = [];
    document.querySelectorAll('#app-root .badge, #app-root .btn').forEach(function(e) {
      var r = e.getBoundingClientRect();
      if (r.right > W + 0.5) bad.push({ tag: e.tagName, text: e.textContent.trim().slice(0, 30), r: r.right, W: W });
    });
    return { bad: bad, banner_ow: banner.offsetWidth, p_ow: p.offsetWidth, sw: document.documentElement.scrollWidth };
  })()`);

  console.log('TEST MINMAX FIX:', JSON.stringify(debug, null, 2));
  ws.close(); proc.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
})();
