/**
 * HerSpace Premium 4.0 — Comprehensive Automated Test Suite
 * Tests:
 *  1. Absolute INR Currency Rule & Zero Dollar-Sign UI Scan
 *  2. 100% Tamil–English Translation Parity & Terminology Glossary
 *  3. HerSpace Life & Wellbeing (11 Categories A–K, EN/TA/Transliteration Search, Sources & Red Flags)
 *  4. My Cycle Optional Period Tracker (Opt-In Consent, Interval/Next-Period Math, Wipe)
 *  5. HerSpace Calm Audio Sanctuary & Live Melodies (Singers)
 *  6. Exotel Two-Way Masked Telephone Calling (Queues, Waiting, Hold, Call Parking & Authorized Retrieval)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Setup simulated browser globals
global.window = global;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};
global.document = {
  documentElement: { lang: 'en' },
  getElementById() { return null; }
};
global.window.addEventListener = function() {};

// Load HerSpace 4.0 modules
require('../js/config.js');
require('../js/translations.js');
require('../js/wellbeing-data.js');
require('../js/calm-singers-telephony.js');
require('../js/store.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}\n     ${err.message}`);
    failed++;
  }
}

console.log('\n================================================================');
console.log(' HERSPACE PREMIUM 4.0 — AUTOMATED VERIFICATION SUITE');
console.log('================================================================\n');

// ---------------------------------------------------------------------------
// 1. CURRENCY TESTS (INR ONLY & ZERO DOLLAR SIGNS)
// ---------------------------------------------------------------------------
console.log('--- 1. INR Currency Formatting & Zero Dollar-Sign Tests ---');

test('Formats 0 as ₹0', () => {
  assert.strictEqual(window.herSpaceFormatINR(0), '₹0');
});

test('Formats 149 as ₹149', () => {
  assert.strictEqual(window.herSpaceFormatINR(149), '₹149');
});

test('Formats 399 as ₹399', () => {
  assert.strictEqual(window.herSpaceFormatINR(399), '₹399');
});

test('Formats 999 as ₹999', () => {
  assert.strictEqual(window.herSpaceFormatINR(999), '₹999');
});

test('Formats 1499 with Indian digit grouping as ₹1,499', () => {
  assert.strictEqual(window.herSpaceFormatINR(1499), '₹1,499');
});

test('Formats decimal amount 399.50 as ₹399.50', () => {
  assert.strictEqual(window.herSpaceFormatINR(399.5, { showDecimals: true }), '₹399.50');
});

test('Formats negative/refund adjustment -399 as -₹399', () => {
  assert.strictEqual(window.herSpaceFormatINR(-399), '-₹399');
});

test('Scans index.html, js/app.js, and js/translations.js for zero US-dollar icons or $ currency strings', () => {
  const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  // Verify the Feather dollar-sign SVG path is completely removed
  assert.strictEqual(
    appJs.includes('M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),
    false,
    'Feather dollar-sign SVG icon must not exist in js/app.js'
  );

  // Verify no $ followed by digits appears in translations (en or ta)
  const allTranslations = JSON.stringify(window.HERSPACE_I18N);
  const check = window.herSpaceCheckZeroDollarCurrency(allTranslations);
  assert.strictEqual(check.valid, true, 'Found unexpected dollar currency in translations: ' + check.matches.join(', '));

  const htmlCheck = window.herSpaceCheckZeroDollarCurrency(indexHtml);
  assert.strictEqual(htmlCheck.valid, true, 'Found unexpected dollar currency in index.html: ' + htmlCheck.matches.join(', '));
});

// ---------------------------------------------------------------------------
// 2. TAMIL–ENGLISH LOCALIZATION & GLOSSARY TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 2. Tamil–English Localization & Glossary Completeness Tests ---');

test('Verifies 100% key parity between English (en) and Tamil (ta)', () => {
  const audit = window.herSpaceTranslationAudit();
  assert.strictEqual(audit.isComplete, true, `Missing in TA: ${audit.missingInTa.join(', ')} | Missing in EN: ${audit.missingInEn.join(', ')}`);
  assert.strictEqual(audit.parityPercentage, 100);
  assert.ok(audit.totalEnKeys >= 180, `Expected at least 180 localized keys, got ${audit.totalEnKeys}`);
});

test('Verifies all 18 approved Terminology Glossary items are defined', () => {
  assert.strictEqual(window.HERSPACE_GLOSSARY.length, 18);
  const requiredTerms = [
    'Trained Human Listener', 'Professional Counsellor', 'Live Singer', 'Membership',
    'Free Trial', 'Appointment', 'Reschedule', 'Refund', 'Menstrual Cycle', 'Period Tracker',
    'Personal Hygiene', 'Intimate Health', 'Emotional Wellbeing', 'Privacy', 'Consent',
    'Call Waiting', 'Call Hold', 'Call Parking'
  ];
  requiredTerms.forEach(term => {
    const found = window.HERSPACE_GLOSSARY.find(g => g.term === term);
    assert.ok(found && found.ta && found.en, `Glossary missing ${term}`);
  });
});

test('Switches language EN -> TA -> EN dynamically and updates translations', () => {
  window.herSpaceStore.setLanguage('ta');
  assert.strictEqual(window.herSpaceStore.state.lang, 'ta');
  assert.strictEqual(window.herSpaceTranslate('navHome'), 'முகப்பு');
  assert.strictEqual(window.herSpaceTranslate('wbHeroTitle'), 'ஒவ்வொரு கேள்விக்கும் பாதுகாப்பான பதில் உண்டு.');

  window.herSpaceStore.setLanguage('en');
  assert.strictEqual(window.herSpaceStore.state.lang, 'en');
  assert.strictEqual(window.herSpaceTranslate('navHome'), 'Home');
  assert.strictEqual(window.herSpaceTranslate('wbHeroTitle'), 'Every question deserves a safe answer.');
});

// ---------------------------------------------------------------------------
// 3. HERSPACE LIFE & WELLBEING TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 3. HerSpace Life & Wellbeing Knowledge Base Tests ---');

test('Defines all 11 Women’s Wellbeing Categories (A through K)', () => {
  const cats = window.HerSpaceWellbeingEngine.getCategories();
  assert.strictEqual(cats.length, 11);
  const codes = cats.map(c => c.code).join('');
  assert.strictEqual(codes, 'ABCDEFGHIJK');
});

test('Searches articles by English keyword, Tamil Unicode keyword, and Tamil transliteration', () => {
  const enResults = window.HerSpaceWellbeingEngine.search('late period', 'all');
  assert.ok(enResults.length >= 1 && enResults[0].id === 'wb_01_late_period');

  const taResults = window.HerSpaceWellbeingEngine.search('இரும்புச்சத்து', 'all');
  assert.ok(taResults.length >= 1 && taResults[0].id === 'wb_12_iron_foods');

  const transResults = window.HerSpaceWellbeingEngine.search('mudi kottuthal', 'all');
  assert.ok(transResults.length >= 1 && transResults[0].id === 'wb_06_hair_loss');

  const transgResults = window.HerSpaceWellbeingEngine.search('திருநங்கை', 'cat_transgender');
  assert.strictEqual(transgResults.length, 1);
  assert.strictEqual(transgResults[0].id, 'wb_16_transgender_wellbeing');
});

test('Every Wellbeing article has bilingual EN/TA text, red flags, self-care, and public health sources', () => {
  assert.ok(window.HERSPACE_WELLBEING_ARTICLES.length >= 16);
  window.HERSPACE_WELLBEING_ARTICLES.forEach(art => {
    assert.ok(art.title.en && art.title.ta, `Missing bilingual title in ${art.id}`);
    assert.ok(art.shortAnswer.en && art.shortAnswer.ta, `Missing shortAnswer in ${art.id}`);
    assert.ok(art.explanation.en && art.explanation.ta, `Missing explanation in ${art.id}`);
    assert.ok(art.selfCare.en.length > 0 && art.selfCare.ta.length > 0, `Missing selfCare in ${art.id}`);
    assert.ok(art.redFlags.en.length > 0 && art.redFlags.ta.length > 0, `Missing redFlags in ${art.id}`);
    assert.ok(art.sources && art.sources.length > 0, `Missing sources in ${art.id}`);
  });
});

test('Submits private anonymous question to moderation queue', () => {
  const req = window.herSpaceStore.submitPrivateQuestion('cat_hygiene', 'Is daily panty liner use safe?');
  assert.ok(req.id.startsWith('pq_'));
  assert.strictEqual(window.herSpaceStore.state.wellbeing.privateRequests[0].question, 'Is daily panty liner use safe?');
});

// ---------------------------------------------------------------------------
// 4. MY CYCLE (OPTIONAL MENSTRUAL TRACKER) TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 4. My Cycle (Opt-In Menstrual & Symptom Tracker) Tests ---');

test('My Cycle is strictly opt-in (disabled by default)', () => {
  window.herSpaceStore.wipeAllCycleData();
  assert.strictEqual(window.herSpaceStore.state.cycle.optInConsent, false);
  assert.strictEqual(window.herSpaceStore.state.cycle.logs.length, 0);
});

test('Loads demonstration cycle data and computes observed cycle interval & next-period estimate', () => {
  window.herSpaceStore.setCycleConsent(true, true);
  assert.strictEqual(window.herSpaceStore.state.cycle.optInConsent, true);
  assert.strictEqual(window.herSpaceStore.state.cycle.logs.length, 3);

  const summary = window.HerSpaceCycleEngine.calculateSummary(window.herSpaceStore.state.cycle.logs);
  assert.strictEqual(summary.totalLogged, 3);
  assert.ok(summary.avgIntervalDays >= 27 && summary.avgIntervalDays <= 30, `Unexpected interval: ${summary.avgIntervalDays}`);
  assert.ok(summary.nextPeriodEstimate, 'Expected nextPeriodEstimate ISO date');
});

test('Logs custom cycle entry, deletes entry, and wipes all cycle data cleanly', () => {
  const added = window.herSpaceStore.addCycleLog({
    startDate: '2026-10-20',
    endDate: '2026-10-24',
    flow: 'light',
    symptoms: ['Mild Cramps'],
    mood: 'Peaceful'
  });
  assert.strictEqual(window.herSpaceStore.state.cycle.logs.length, 4);

  window.herSpaceStore.deleteCycleLog(added.id);
  assert.strictEqual(window.herSpaceStore.state.cycle.logs.length, 3);

  window.herSpaceStore.wipeAllCycleData();
  assert.strictEqual(window.herSpaceStore.state.cycle.optInConsent, false);
  assert.strictEqual(window.herSpaceStore.state.cycle.logs.length, 0);
});

// ---------------------------------------------------------------------------
// 5. HERSPACE CALM & LIVE MELODIES (SINGERS) TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 5. HerSpace Calm Audio & Live Singers Tests ---');

test('HerSpace Calm never autoplays on boot and supports play, pause, seek, and sleep timer', () => {
  assert.strictEqual(window.HerSpaceCalmEngine.isPlaying, false);
  const track = window.HerSpaceCalmEngine.playTrack('calm_03_veena_dawn');
  assert.strictEqual(window.HerSpaceCalmEngine.isPlaying, true);
  assert.strictEqual(track.id, 'calm_03_veena_dawn');

  window.HerSpaceCalmEngine.seekToPercent(50);
  assert.strictEqual(window.HerSpaceCalmEngine.currentTimeSeconds, 360);

  window.HerSpaceCalmEngine.setSleepTimer(15);
  assert.strictEqual(window.HerSpaceCalmEngine.sleepTimerMinutes, 15);
  window.HerSpaceCalmEngine.setSleepTimer(0);

  window.HerSpaceCalmEngine.pauseTrack();
  assert.strictEqual(window.HerSpaceCalmEngine.isPlaying, false);
});

test('Live Singers have verified profiles and Pending Client Approval fee status', () => {
  assert.strictEqual(window.HERSPACE_LIVE_SINGERS.length, 3);
  window.HERSPACE_LIVE_SINGERS.forEach(s => {
    assert.strictEqual(s.role, 'singer');
    assert.strictEqual(s.priceStatus, 'Pending Client Approval');
    assert.strictEqual(s.verified, true);
  });
});

// ---------------------------------------------------------------------------
// 6. EXOTEL TWO-WAY MASKED CALLING TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 6. Exotel Two-Way Masked Telephone Calling Tests ---');

test('Two-way number masking hides personal mobile numbers and routes to role-specific virtual bridge', () => {
  const masked = window.HerSpaceTelephonyEngine.maskPhoneNumber('9840123456');
  assert.strictEqual(masked.includes('9840123456'), false);
  assert.strictEqual(masked, '+91-98XXXXXX56 (Masked)');

  const sess = window.HerSpaceTelephonyEngine.initiateMaskedCall({
    partnerId: 'counsellor-anita',
    partnerName: 'Dr. Anita Sundaram',
    partnerRole: 'counsellor'
  });
  assert.strictEqual(sess.queueId, 'queue_counsellor_tn');
  assert.strictEqual(sess.virtualBridgeNumber, '+91-44-4813-1002');
  assert.strictEqual(sess.realNumbersExposed, false);
  assert.strictEqual(sess.audioRecordingActive, false);
});

test('Supports Call Waiting, Call Hold, Call Parking with authorized retrieval code, Transfer, and End Call', () => {
  window.HerSpaceTelephonyEngine.enterQueue();
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'queued');

  window.HerSpaceTelephonyEngine.connectBridge();
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'connected');

  window.HerSpaceTelephonyEngine.holdCall();
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'on_hold');

  window.HerSpaceTelephonyEngine.resumeCall();
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'connected');

  // Park Call
  const parked = window.HerSpaceTelephonyEngine.parkCall('counsellor');
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'parked');
  assert.ok(parked.parkCode.startsWith('PARK-'));

  // Unauthorized role cannot retrieve parked call
  const unauthAttempt = window.HerSpaceTelephonyEngine.retrieveParkedCall(parked.parkCode, 'singer');
  assert.strictEqual(unauthAttempt.success, false);

  // Authorized role retrieves parked call
  const authAttempt = window.HerSpaceTelephonyEngine.retrieveParkedCall(parked.parkCode, 'counsellor');
  assert.strictEqual(authAttempt.success, true);
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.state, 'connected');

  // Controlled Transfer
  window.HerSpaceTelephonyEngine.transferCall('admin');
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession.queueId, 'queue_admin_escalation');

  // Terminate Call
  const ended = window.HerSpaceTelephonyEngine.endCall();
  assert.strictEqual(ended.state, 'ended');
  assert.strictEqual(window.HerSpaceTelephonyEngine.activeSession, null);
});

console.log('\n================================================================');
console.log(` TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
