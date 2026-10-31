/**
 * HerSpace Premium 2.0 - Automated Business Rules & Logic Test Suite
 * Executed with Node.js
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('../js/config.js');
const config = global.window.HERSPACE_CONFIG;

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n=== HERSPACE PREMIUM 2.0 BUSINESS RULES TEST SUITE ===\n');

// 1. Pricing & Trial Rules
it('First-time registration fee must be exactly ₹0', () => {
  assert.strictEqual(config.pricing.firstTimeRegistrationFee, 0);
});

it('Free trial must be exactly 3 months', () => {
  assert.strictEqual(config.pricing.freeTrialMonths, 3);
});

it('Monthly membership after trial must be exactly ₹149', () => {
  assert.strictEqual(config.pricing.monthlyMembershipAfterTrial, 149);
});

it('Trained listener session fee must be exactly ₹399 for 60 minutes', () => {
  assert.strictEqual(config.pricing.trainedListenerPerSession, 399);
});

it('Professional counsellor session fee must be exactly ₹999 for 60 minutes', () => {
  assert.strictEqual(config.pricing.professionalCounsellorPerSession, 999);
});

// 2. Complimentary Session Rules
it('Complimentary session count must be exactly 1', () => {
  assert.strictEqual(config.pricing.complimentarySession.count, 1);
});

it('Complimentary session duration must be exactly 30 minutes', () => {
  assert.strictEqual(config.pricing.complimentarySession.durationMinutes, 30);
});

it('Complimentary session validity must be exactly 7 days (168 hours)', () => {
  assert.strictEqual(config.pricing.complimentarySession.validityDays, 7);
  assert.strictEqual(config.pricing.complimentarySession.validityHours, 168);
});

it('Complimentary session price must be ₹0', () => {
  assert.strictEqual(config.pricing.complimentarySession.price, 0);
});

it('Complimentary session lifetime limit must be 1', () => {
  assert.strictEqual(config.pricing.complimentarySession.lifetimeLimit, 1);
});

// 3. Eligibility & Audience Rules
it('Minimum eligibility age must be at least 18', () => {
  assert.strictEqual(config.minAge, 18);
});

it('Target audience must include women and transgender women aged 18+', () => {
  assert(config.targetAudience.includes('women'));
  assert(config.targetAudience.includes('transgender women'));
  assert(config.targetAudience.includes('18+'));
});

// 4. Appointment & Rescheduling Policies
it('Standard cancellation must NOT be allowed', () => {
  assert.strictEqual(config.appointments.cancellationAllowed, false);
});

it('Reschedule cutoff must be exactly 4 hours prior', () => {
  assert.strictEqual(config.appointments.rescheduleCutoffHours, 4);
});

it('100% refund must apply when provider fails to attend (no-show)', () => {
  assert.strictEqual(config.appointments.refundOnProviderNoShow, true);
});

// 5. Date & Expiry Calculation Logic
it('Calculates 3-calendar-month trial expiry accurately', () => {
  const start = new Date('2026-10-27T10:00:00Z');
  const trialEnd = new Date(start);
  trialEnd.setMonth(trialEnd.getMonth() + config.pricing.freeTrialMonths);
  
  assert.strictEqual(trialEnd.toISOString(), '2027-01-27T10:00:00.000Z');
});

it('Calculates 7-day complimentary session expiry accurately', () => {
  const start = new Date('2026-10-27T10:00:00Z');
  const welcomeEnd = new Date(start.getTime() + config.pricing.complimentarySession.validityHours * 3600000);
  
  assert.strictEqual(welcomeEnd.toISOString(), '2026-11-03T10:00:00.000Z');
});

// 6. Rescheduling Window Threshold Verification
it('Permits rescheduling when more than 4 hours remain before session', () => {
  const now = Date.now();
  const sessionTime = now + (5 * 3600000); // 5 hours away
  const cutoff = sessionTime - (config.appointments.rescheduleCutoffHours * 3600000);
  
  assert(now < cutoff, 'Rescheduling should be permitted');
});

it('Locks rescheduling when less than 4 hours remain before session', () => {
  const now = Date.now();
  const sessionTime = now + (2 * 3600000); // 2 hours away
  const cutoff = sessionTime - (config.appointments.rescheduleCutoffHours * 3600000);
  
  assert(now > cutoff, 'Rescheduling should be locked within 4 hours');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
