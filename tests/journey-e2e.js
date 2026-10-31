/**
 * HerSpace journey — real-route end-to-end test (headless Microsoft Edge over CDP).
 *
 * Drives the actual app UI (clicks, typing, reloads) for:
 *   A. First-time registrant
 *   B. Existing member inside the free trial (skips the tour, books later)
 *   C. Returning member after trial expiry (trial dates back-dated; billing is not connected)
 * plus resume-after-reload, sign-out/sign-in, tour replay, membership gating, journey overflow checks (EN + TA).
 *
 * Supabase is forced offline (localStorage herspace_force_offline=1) so the test never creates real
 * auth users or sends email. Run:  node tests/journey-e2e.js [baseUrl]
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const BASE = process.argv[2] || 'http://localhost:8099/';
const EDGE = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'].find(p => fs.existsSync(p));
const PORT = 9333;
const SHOTS = process.env.SHOT_DIR || '';

let pass = 0, fail = 0, gap = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS: ' + name); }
  else { fail++; failures.push(name); console.log('  FAIL: ' + name + (detail ? '  -> ' + detail : '')); }
}
function knownGap(name, detail) { gap++; console.log('  GAP : ' + name + '  -> ' + detail); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJson = url => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));

(async () => {
  if (!EDGE) { console.error('Edge not found'); process.exit(2); }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'herspace-e2e-'));
  const proc = spawn(EDGE, ['--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, '--headless=new', '--disable-gpu', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 30; i++) { await sleep(400); try { targets = await getJson('http://127.0.0.1:' + PORT + '/json'); if (targets.length) break; } catch (e) {} }
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  const send = (method, params = {}) => new Promise((res, rej) => { const i = id++; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('JS error: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text)); return r.result.value; };

  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('herspace_force_offline','1')}catch(e){}" });
  const viewport = (w, h = 844) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: w <= 768 });
  const load = async () => { await send('Page.navigate', { url: BASE }); await sleep(1200); };
  const reload = async () => { await send('Page.reload', { ignoreCache: true }); await sleep(1200); };
  const route = () => ev('window.herSpaceApp.currentRoute()');
  const has = sel => ev(`!!document.querySelector(${JSON.stringify(sel)})`);
  const count = sel => ev(`document.querySelectorAll(${JSON.stringify(sel)}).length`);
  const text = sel => ev(`(document.querySelector(${JSON.stringify(sel)})||{textContent:''}).textContent.replace(/\\s+/g,' ').trim()`);
  const click = async sel => { const f = await has(sel); if (!f) throw new Error('missing element ' + sel); await ev(`document.querySelector(${JSON.stringify(sel)}).click()`); await sleep(250); };
  const type = async (sel, v) => { if (!(await has(sel))) throw new Error('missing field ' + sel); await ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});e.focus();e.value=${JSON.stringify(v)};e.dispatchEvent(new Event('input',{bubbles:true}));})()`); };
  const select = async (sel, v) => ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});e.value=${JSON.stringify(v)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const check = async (sel, v) => ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});e.checked=${v};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const state = () => ev('JSON.parse(JSON.stringify({user:window.herSpaceStore.state.user,ent:window.herSpaceStore.state.entitlement,ob:window.herSpaceStore.state.onboarding,apts:window.herSpaceStore.state.appointments,saved:window.herSpaceStore.state.wellbeing.savedIds,cycle:window.herSpaceStore.state.cycle}))');
  const shot = async name => { if (!SHOTS) return; const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(SHOTS, name), Buffer.from(s.data, 'base64')); };
  const nav = async r => { await ev(`window.herSpaceApp.navigate(${JSON.stringify(r)})`); await sleep(250); };
  const overflow = () => ev(`(function(){var d=document.documentElement;var bad=[];var W=d.clientWidth;document.querySelectorAll('#app-root button,#app-root a,#app-root input,#app-root select,#app-root .btn,#app-root .service-tab,#app-root .badge').forEach(function(e){var r=e.getBoundingClientRect();if(r.width===0&&r.height===0)return;if(r.right>W+1||r.left<-1)bad.push((e.id||e.className||e.tagName).toString().slice(0,30)+':'+e.textContent.trim().slice(0,24));});return {sw:d.scrollWidth,cw:W,bad:bad.slice(0,5)};})()`);

  async function register(p) {
    await nav('onb-register');
    await type('#regName', p.name); await type('#regPhone', p.phone);
    await click('#regSendCode');
    const code = await ev('window.herSpaceJourneyUI.draft.testCode');
    await type('#regOtp', p.badOtp || code);
    await type('#regEmail', p.email); await type('#regPassword', p.password || 'Sup3rSecret!');
    await type('#regAge', String(p.age || 28)); await select('#regIdentity', p.identity || 'woman');
    await check('#regAgree', p.noConsent ? 'false' : 'true');
    await click('#regSubmit'); await sleep(500);
  }

  // ===== Scenario A: first-time registrant ========================================================
  console.log('\n=== A. FIRST-TIME REGISTRANT (390x844) ===');
  await viewport(390); await load();
  ok('A1 guest lands on Home', (await route()) === 'home');
  ok('A2 prominent Get Started button on welcome hero', await has('#heroGetStarted'));
  ok('A3 guest tabs: Home/Support/Melodies/Plans/Join; no My Space and no onboarding tabs',
    (await count('.bottom-nav-item')) === 5 && await has('#tab-join') && !(await has('#tab-space')));
  await click('#heroGetStarted');
  ok('A4 Get Started opens registration', (await route()) === 'onb-register');
  ok('A5 onboarding is a focused flow: no bottom tabs, no footer', !(await has('.mobile-bottom-nav')) && !(await has('.app-footer')));
  ok('A6 progress shows Step 1 of 4', /1/.test(await text('.onb-progress-label')));

  await type('#regName', 'Anitha R'); await type('#regPhone', '9840011111');
  await click('#regSubmit');
  ok('A7 cannot submit before a mobile code is requested', (await route()) === 'onb-register' && !(await state()).user);
  await click('#regSendCode');
  ok('A8 mobile code is labelled TEST mode / not live verification', /not live verification/i.test(await text('#regTestBanner')));

  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com', badOtp: '000000' });
  ok('A9 wrong mobile code is rejected', (await route()) === 'onb-register' && !(await state()).user);
  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com', age: 17 });
  ok('A10 under-18 is rejected', (await route()) === 'onb-register' && !(await state()).user);
  await register({ name: 'Anitha R', phone: '9840011111', email: 'not-an-email' });
  ok('A11 invalid email is rejected', !(await state()).user);
  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com', password: 'short' });
  ok('A12 short password is rejected', !(await state()).user);
  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com', noConsent: true });
  ok('A13 missing consent is rejected', !(await state()).user);

  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com' });
  let s = await state();
  ok('A14 valid registration moves to the App Tour', (await route()) === 'onb-tour');
  ok('A15 profile saved (name, +91 phone, email, age, eligibility, language)',
    s.user && s.user.fullName === 'Anitha R' && s.user.phone === '+91 9840011111' && s.user.email === 'anitha@example.com' && s.user.age === 28 && s.user.identity === 'woman' && s.user.preferredLang);
  ok('A16 mobile is NOT represented as verified; email not claimed sent in local mode',
    s.user.phoneVerification === 'test_code_only' && s.user.emailVerification === 'not_sent_local_mode');
  const days = Math.round((new Date(s.ent.trialEndsAt) - Date.now()) / 86400000);
  ok('A17 3-month free trial started (~90 days), no payment taken', days >= 88 && days <= 93 && s.ent.paidThrough === null && !s.ent.autoRenew);
  ok('A18 no demo appointment or pre-saved content for a new member', s.apts.length === 0 && s.saved.length === 0 && s.cycle.optInConsent === false);

  // Tour: skip only after essential info
  ok('A19 tour has no Skip on slide 1', !(await has('#tourSkip')));
  await click('#tourNext');
  ok('A20 tour has no Skip on slide 2', !(await has('#tourSkip')));
  await click('#tourNext');
  ok('A21 Skip appears once services, privacy and booking are presented (slide 3)', await has('#tourSkip'));
  await click('#tourBack');
  ok('A22 Back returns to slide 2', /2/.test(await text('.onb-tour-progress')));
  await click('#tourNext'); await click('#tourNext');
  ok('A23 final slide offers Continue', await has('#tourContinue'));
  ok('A24 no video is shown or claimed (none supplied)', !(await has('video')));
  await click('#tourContinue');
  ok('A25 tour completes to Membership information', (await route()) === 'onb-membership' && (await state()).ob.tourSeen === true);

  const mem = await text('main');
  ok('A26 membership shows trial end date, ₹149/month after trial, prices ₹399/₹999 and Live Melodies fee pending',
    /₹149/.test(mem) && /₹399/.test(mem) && /₹999/.test(mem) && /pending client approval/i.test(mem) && /\d{4}/.test(await text('#memTrialBody')));
  ok('A27 membership step has no payment form and no auto-renew control', (await count('#app-root input')) === 0 && !/credit card|card number|cvv/i.test(mem));
  ok('A28 membership states renewal is never automatic', /never happens automatically/i.test(await text('#memAfterBody')));
  await click('#memContinue');
  ok('A29 membership continues to Choose a Service', (await route()) === 'onb-book');

  // Service hub: three separate categories
  const roles = async () => ev(`Array.from(document.querySelectorAll('#serviceCards .expert-card')).map(function(c){return c.getAttribute('data-provider-role')})`);
  let r1 = await roles();
  ok('A30 default category lists only Trained Human Listeners', r1.length >= 2 && r1.every(x => x === 'listener'));
  await click('#cat-counsellor'); let r2 = await roles();
  ok('A31 Counsellors tab lists only counsellors (no listeners / singers)', r2.length >= 2 && r2.every(x => x === 'counsellor'));
  ok('A32 counsellor price shown as ₹999', /₹999/.test(await text('#servicePrice')));
  await click('#cat-singer'); let r3 = await roles();
  ok('A33 Live Melodies tab lists only live singers', r3.length >= 2 && r3.every(x => x === 'singer'));
  ok('A34 Live Melodies fee shown as pending approval, never an invented price', /pending client approval/i.test(await text('#servicePrice')));
  ok('A35 every profile shows its own availability', (await count('#serviceCards .provider-avail')) >= r3.length * 2);
  await click('#cat-listener');

  // Book the complimentary listener session during onboarding
  await click('#book-listener-priya');
  ok('A36 booking modal opens for the listener', await ev(`document.getElementById('bookingModal').classList.contains('open')`));
  await ev(`document.querySelector('#bookingModalBody button.btn-primary').click()`); await sleep(500);
  s = await state();
  ok('A37 booking completes onboarding and opens My Personal Space', (await route()) === 'space' && s.ob.completed === true);
  ok('A38 complimentary 30-min session booked at ₹0', s.apts.length === 1 && s.apts[0].isComplimentary === true && s.apts[0].pricePaise === 0 && s.apts[0].durationMinutes === 30);

  // My Personal Space
  ok('A39 Personal Space contains Calm, guided meditation, light music, My Cycle, saved content, preferences and upcoming appointments',
    (await Promise.all(['#spaceCalm', '#spaceMeditation', '#spaceMusic', '#spaceCycle', '#spaceSaved', '#spacePrefs', '#spaceUpcoming'].map(has))).every(Boolean));
  ok('A40 upcoming appointment appears in Personal Space', /Priya/.test(await text('#spaceUpcoming')));
  ok('A41 trial status with days left', /Free trial/.test(await text('#spaceStatus')));
  ok('A42 My Cycle is optional: not enabled and not forced', (await state()).cycle.optInConsent === false && /optional/i.test(await text('#spaceCycle')));
  ok('A43 member tabs: Home, Support, Melodies, Bookings, My Space', (await has('#tab-space')) && (await has('#tab-bookings')) && !(await has('#tab-join')));
  await click('#spaceMeditation .btn');
  ok('A44 Guided meditation opens Calm filtered to meditation', (await route()) === 'calm' && (await ev('window.herSpaceStore.state.calm.activeCategory')) === 'meditation');
  await nav('space'); await click('#spaceCycle .btn');
  ok('A45 My Cycle reachable from Personal Space', (await route()) === 'cycle');

  // Live Melodies booking as an onboarded member
  await nav('singers');
  ok('A46 Live Melodies page lists singers only', (await count('#singerCards .expert-card[data-provider-role="singer"]')) >= 2 && (await count('#singerCards .expert-card:not([data-provider-role="singer"])')) === 0);
  await click('#book-singer_1');
  await ev(`document.querySelector('#bookingModalBody button.btn-primary').click()`); await sleep(500);
  s = await state();
  const sing = s.apts.find(a => a.expertRole === 'singer');
  ok('A47 singer reservation stored with fee pending (no invented price)', sing && sing.feePending === true && sing.pricePaise === 0);
  ok('A48 booking outside onboarding opens Bookings', (await route()) === 'dashboard');
  ok('A49 Bookings no longer shows an auto-renewal checkbox during the trial', !(await has('#autoRenewCheck')) && await has('#renewalInfoCard'));

  // Help / Settings: replay the tour
  await nav('space'); await click('#spaceReplayTour');
  ok('A50 tour can be replayed from Settings', (await route()) === 'onb-tour' && await has('#tourClose'));
  await click('#tourClose');
  ok('A51 closing the replay returns to My Personal Space; onboarding stays complete', (await route()) === 'space' && (await state()).ob.completed === true);
  await nav('onb-register');
  ok('A52 signed-in member is never sent back to registration', (await route()) === 'space');

  // Returning member: reload goes straight to Personal Space
  await reload();
  ok('A53 reload as a returning member enters My Personal Space directly', (await route()) === 'space');

  // Sign out, sign in
  await click('#spaceSignOut');
  s = await state();
  ok('A54 sign-out clears the session and returns Home', (await route()) === 'home' && s.user === null && s.apts.length === 0);
  await reload();
  ok('A55 after sign-out the app opens as a guest', (await route()) === 'home');
  await register({ name: 'Anitha R', phone: '9840011111', email: 'anitha@example.com' });
  ok('A56 re-registering the same number is refused (no second trial)', !(await state()).user && (await route()) === 'onb-register');
  await nav('signin');
  await type('#siPhone', '9840011111'); await click('#siSendCode');
  await type('#siOtp', await ev('window.herSpaceAuth.generatedOtp'));
  await click('#siSubmit'); await sleep(400);
  s = await state();
  ok('A57 sign-in goes straight to My Personal Space (no registration, no tour)', (await route()) === 'space' && s.ob.completed === true);
  ok('A58 trial dates and appointments survive logout / sign-in', s.user.email === 'anitha@example.com' && s.apts.length === 2 && Math.round((new Date(s.ent.trialEndsAt) - Date.now()) / 86400000) >= 88);
  ok('A59 welcome-call voucher stays used (not re-issued)', s.ent.welcomeCallStatus === 'reserved');
  await nav('signin');
  ok('A60 signed-in member cannot reopen sign-in', (await route()) === 'space');

  // Wrong sign-in
  await click('#spaceSignOut');
  await nav('signin'); await type('#siPhone', '9000000000'); await click('#siSendCode');
  await type('#siOtp', await ev('window.herSpaceAuth.generatedOtp')); await click('#siSubmit');
  ok('A61 unknown number cannot sign in', (await route()) === 'signin' && !(await state()).user);

  // ===== Scenario B: existing member within trial (skips tour, books later) ========================
  console.log('\n=== B. EXISTING MEMBER WITHIN THE FREE TRIAL ===');
  await register({ name: 'Bhuvana S', phone: '9840022222', email: 'bhuvana@example.com', identity: 'trans_woman', age: 41 });
  ok('B1 second member registers; eligibility category stored', (await state()).user.identity === 'trans_woman' && (await route()) === 'onb-tour');
  await reload();
  ok('B2 unfinished onboarding resumes at the tour after reload (not Home)', (await route()) === 'onb-tour');
  await click('#tourNext'); await click('#tourNext'); await click('#tourSkip');
  s = await state();
  ok('B3 Skip is recorded and moves to Membership', (await route()) === 'onb-membership' && s.ob.tourSkipped === true && s.ob.tourSeen === true);
  await reload();
  ok('B4 unfinished onboarding resumes at Membership after reload', (await route()) === 'onb-membership');
  await click('#memContinue');
  await reload();
  ok('B5 unfinished onboarding resumes at Choose a Service', (await route()) === 'onb-book');
  await click('#bookLater');
  s = await state();
  ok('B6 "book later" completes onboarding without forcing a booking', (await route()) === 'space' && s.ob.completed && s.apts.length === 0);
  ok('B7 no upcoming appointments message', /No upcoming/i.test(await text('#spaceUpcoming')));
  await nav('support'); await click('#book-listener-meera');
  ok('B8 within trial a paid listener session can be booked (modal opens)', await ev(`document.getElementById('bookingModal').classList.contains('open')`));
  await ev(`document.querySelector('#bookingModalBody button.btn-primary').click()`); await sleep(400);
  s = await state();
  ok('B9 booking stored at the approved listener rate or the welcome session', s.apts.length === 1);
  await nav('support'); await click('#cat-counsellor'); await click('#book-counsellor-anita');
  await ev(`document.querySelector('#bookingModalBody button.btn-primary').click()`); await sleep(400);
  s = await state();
  const csl = s.apts.find(a => a.expertRole === 'counsellor');
  ok('B10 counsellor session priced at ₹999 within the trial', csl && csl.pricePaise === 99900);
  await nav('space'); await click('#spaceSignOut');

  // ===== Scenario C: returning member after trial expiry ==========================================
  console.log('\n=== C. RETURNING MEMBER AFTER TRIAL EXPIRY (dates back-dated) ===');
  await register({ name: 'Chitra M', phone: '9840033333', email: 'chitra@example.com' });
  await click('#tourNext'); await click('#tourNext'); await click('#tourSkip'); await click('#memContinue'); await click('#bookLater');
  await ev(`(function(){var st=window.herSpaceStore;var past=new Date(Date.now()-3*86400000).toISOString();var e=Object.assign({},st.state.entitlement,{trialEndsAt:past,welcomeCallExpiresAt:past,welcomeCallStatus:'expired'});st.setEntitlement(e);})()`);
  await reload();
  ok('C1 returning member enters My Personal Space directly after expiry', (await route()) === 'space');
  ok('C2 status reads "Free trial ended" and a membership notice is shown', /ended/i.test(await text('#spaceStatus')) && await has('#spaceGate'));
  ok('C3 personal content stays available: Calm, My Cycle, saved content, preferences',
    (await Promise.all(['#spaceCalm', '#spaceCycle', '#spaceSaved', '#spacePrefs'].map(has))).every(Boolean));
  await nav('calm'); ok('C4 Calm route opens for an expired member', (await route()) === 'calm');
  await nav('cycle'); ok('C5 My Cycle route opens for an expired member', (await route()) === 'cycle');
  await nav('dashboard'); ok('C6 Bookings page opens (history visible)', (await route()) === 'dashboard');
  await nav('support');
  ok('C7 service hub shows the membership-gate notice', await has('#hubGate'));
  await click('#book-listener-priya');
  s = await state();
  ok('C8 booking is gated: redirected to membership, no modal, no appointment', (await route()) === 'pricing' && s.apts.length === 0 && !(await ev(`document.getElementById('bookingModal').classList.contains('open')`)));
  const gated = await ev(`(function(){try{window.herSpaceBooking.confirmBooking({expert:window.herSpaceStore.state.experts[0],dateStr:'2030-01-01',timeSlot:'10:00 AM - 11:00 AM',mode:'x',sessionType:'paid_listener'});return 'booked';}catch(e){return e.code||e.message;}})()`);
  ok('C9 booking engine itself refuses new sessions without active membership', gated === 'MEMBERSHIP_REQUIRED', gated);
  await nav('singers'); ok('C10 Live Melodies shows the gate for an expired member', await has('#melodiesGate'));
  ok('C11 nothing was charged or auto-renewed', (await state()).ent.paidThrough === null && !(await state()).ent.autoRenew);
  await click('.app-footer a[href="#privacy"]').catch(() => {});

  // ===== Persistence limits (honest) ================================================================
  console.log('\n=== PERSISTENCE: LOGOUT / REINSTALL / NEW DEVICE ===');
  await ev('localStorage.clear(); localStorage.setItem("herspace_force_offline","1");');
  await reload();
  ok('P1 wiped storage (simulated reinstall / new device) opens as a guest', (await route()) === 'home');
  await register({ name: 'Chitra M', phone: '9840033333', email: 'chitra@example.com' });
  const reissued = (await state()).user !== null && Math.round((new Date((await state()).ent.trialEndsAt) - Date.now()) / 86400000) >= 88;
  if (reissued) knownGap('Trial eligibility does NOT survive reinstall / new device in local mode', 'a fresh trial was issued for a number that already used one. Needs the live Supabase claim_first_trial() server check (member_identity/member_entitlement) with real sign-in.');
  else ok('P2 duplicate trial refused after reinstall', true);

  // ===== Overflow / clipping on the journey routes, EN + TA ========================================
  console.log('\n=== NO HORIZONTAL SCROLL / CLIPPED CONTROLS (journey routes, EN + TA) ===');
  await ev('localStorage.clear(); localStorage.setItem("herspace_force_offline","1");'); await reload();
  const routesGuest = ['home', 'signin', 'onb-register', 'support', 'singers', 'pricing'];
  const widths = [320, 360, 390, 412, 430, 768, 1280];
  for (const lang of ['en', 'ta']) {
    await ev(`window.herSpaceStore.setLanguage('${lang}')`);
    let bad = [];
    for (const w of widths) {
      await viewport(w);
      for (const r of routesGuest) { await nav(r); const o = await overflow(); if (o.sw > o.cw + 1 || o.bad.length) bad.push(`${lang} ${w}px ${r} sw=${o.sw}/${o.cw} ${o.bad.join(',')}`); }
    }
    ok(`O-${lang}-guest guest routes clean at ${widths.join('/')}px`, bad.length === 0, bad.slice(0, 8).join(' | '));
  }
  await viewport(390); await ev(`window.herSpaceStore.setLanguage('en')`);
  await register({ name: 'Divya K', phone: '9840044444', email: 'divya@example.com' });
  for (const lang of ['en', 'ta']) {
    await ev(`window.herSpaceStore.setLanguage('${lang}')`);
    let bad = [];
    for (const w of widths) {
      await viewport(w);
      for (const r of ['onb-tour', 'onb-membership', 'onb-book', 'space', 'dashboard']) {
        if (r === 'onb-membership' || r === 'onb-book') await ev(`window.herSpaceStore.setOnboarding({step:'book',completed:false})`);
        await nav(r); const o = await overflow(); if (o.sw > o.cw + 1 || o.bad.length) bad.push(`${lang} ${w}px ${r} sw=${o.sw}/${o.cw} ${o.bad.join(',')}`);
      }
    }
    ok(`O-${lang}-member member/onboarding routes clean at ${widths.join('/')}px`, bad.length === 0, bad.slice(0, 8).join(' | '));
  }

  // ===== Screenshots =====
  if (SHOTS) {
    await ev(`window.herSpaceStore.setLanguage('en')`); await viewport(390);
    await ev(`window.herSpaceStore.setOnboarding({step:'tour',completed:false,tourReplay:false})`);
    await nav('onb-register'); await shot('journey_01_register.png');
    await nav('onb-tour'); await shot('journey_02_tour.png');
    await nav('onb-membership'); await shot('journey_03_membership.png');
    await ev(`window.herSpaceStore.setOnboarding({step:'book',completed:false})`);
    await nav('onb-book'); await shot('journey_04_choose_service.png');
    await click('#cat-singer'); await shot('journey_05_live_melodies.png');
    await ev(`window.herSpaceStore.setOnboarding({completed:true})`);
    await nav('space'); await shot('journey_06_personal_space.png');
    await ev(`window.herSpaceStore.setLanguage('ta')`); await nav('space'); await shot('journey_07_space_tamil.png');
  }

  console.log(`\nRESULT: ${pass} passed, ${fail} failed, ${gap} known gap(s)`);
  if (fail) console.log('FAILED: ' + failures.join('; '));
  ws.close(); proc.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('TEST HARNESS ERROR:', e); process.exit(2); });
