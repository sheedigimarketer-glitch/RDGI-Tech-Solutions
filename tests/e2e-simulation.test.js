/**
 * HerSpace Premium 2.0 - End-to-End User Journey Simulation Tests
 * Verifies end-to-end flows: Registration, Booking, Reschedule, Pro Onboarding, Refund
 */

const assert = require('assert');

// Mock browser environment
global.window = {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

require('../js/config.js');
require('../js/translations.js');
require('../js/store.js');
require('../js/supabase-client.js');
require('../js/auth.js');
require('../js/booking.js');
require('../js/admin.js');

const store = global.window.herSpaceStore;
const auth = global.window.herSpaceAuth;
const booking = global.window.herSpaceBooking;
const admin = global.window.herSpaceAdmin;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n=== HERSPACE PREMIUM 2.0 END-TO-END WORKFLOW SIMULATION ===\n');

  // Test 1: Phone OTP Dispatch
  test('Step 1: Dispatch phone OTP to valid Indian number', () => {
    const res = auth.sendPhoneOtp('9840198401');
    assert(res.success);
    assert(res.demoOtp.length === 6);
  });

  // Test 2: Member Registration & 3-Month Free Trial Enrolment
  await (async () => {
    test('Step 2: Complete member registration with OTP & Age verification', async () => {
      const res = await auth.verifyPhoneOtpAndRegister({
        phone: '9840198401',
        otp: auth.generatedOtp,
        fullName: 'Soundarya M.',
        email: 'soundarya@example.in',
        age: '26',
        identity: 'woman',
        agreeTerms: true
      });

      assert.strictEqual(res.user.fullName, 'Soundarya M.');
      assert.strictEqual(res.user.age, 26);
      assert.strictEqual(res.entitlement.welcomeCallStatus, 'available');
      assert(res.entitlement.trialEndsAt);
      assert(res.entitlement.welcomeCallExpiresAt);
    });
  })();

  // Test 3: Deduplication Guard
  await (async () => {
    test('Step 3: Prevent duplicate free trial on repeat registration with same phone', async () => {
      const repeatRes = await auth.verifyPhoneOtpAndRegister({
        phone: '9840198401',
        otp: auth.generatedOtp,
        fullName: 'Soundarya M.',
        age: '26',
        identity: 'woman',
        agreeTerms: true
      });

      assert.strictEqual(repeatRes.entitlement.isReturning, true);
      assert.strictEqual(repeatRes.entitlement.welcomeCallStatus, 'expired');
    });
  })();

  // Reset user for booking simulation
  store.state.entitlement.welcomeCallStatus = 'available';

  // Test 4: Complimentary 30-Min Session Booking
  test('Step 4: Book 1-time complimentary 30-minute welcome listener session', () => {
    const expert = store.state.experts.find(e => e.role === 'listener');
    const apt = booking.confirmBooking({
      expert,
      dateStr: '2026-10-30',
      timeSlot: '10:00 AM - 11:00 AM',
      mode: 'Voice Call',
      sessionType: 'welcome_listener'
    });

    assert.strictEqual(apt.priceDisplay, 0);
    assert.strictEqual(apt.durationMinutes, 30);
    assert.strictEqual(apt.isComplimentary, true);
    assert.strictEqual(store.state.entitlement.welcomeCallStatus, 'reserved');
  });

  // Test 5: Re-using complimentary session is blocked
  test('Step 5: Block re-using complimentary voucher once reserved', () => {
    const expert = store.state.experts.find(e => e.role === 'listener');
    assert.throws(() => {
      booking.confirmBooking({
        expert,
        dateStr: '2026-10-31',
        timeSlot: '02:00 PM - 03:00 PM',
        mode: 'Voice Call',
        sessionType: 'welcome_listener'
      });
    }, /complimentary welcome session is expired or already used/);
  });

  // Test 6: Booking Paid Professional Counsellor Session (₹999)
  test('Step 6: Book 60-minute certified counsellor session at ₹999', () => {
    const counsellor = store.state.experts.find(e => e.role === 'counsellor');
    const apt = booking.confirmBooking({
      expert: counsellor,
      dateStr: '2026-11-01',
      timeSlot: '04:00 PM - 05:00 PM',
      mode: 'Video Call',
      sessionType: 'certified_counsellor'
    });

    assert.strictEqual(apt.priceDisplay, 999);
    assert.strictEqual(apt.durationMinutes, 60);
    assert.strictEqual(apt.mode, 'Video Call');
  });

  // Test 7: Rescheduling outside 4 hours succeeds
  test('Step 7: Reschedule session successfully when outside 4-hour threshold', () => {
    const apt = store.state.appointments[0];
    booking.rescheduleAppointment(apt.id, '2026-11-02', '06:00 PM - 07:00 PM');
    const updated = store.state.appointments.find(a => a.id === apt.id);
    assert.strictEqual(updated.date, '2026-11-02');
    assert.strictEqual(updated.time, '06:00 PM - 07:00 PM');
  });

  // Test 8: Rescheduling inside 4 hours is blocked
  test('Step 8: Lock and reject rescheduling within 4-hour threshold', () => {
    const apt = store.state.appointments[0];
    apt.rescheduleAllowedUntil = new Date(Date.now() - 3600000).toISOString(); // expired 1 hour ago
    assert.throws(() => {
      booking.rescheduleAppointment(apt.id, '2026-11-05', '10:00 AM - 11:00 AM');
    }, /Rescheduling is locked within 4 hours/);
  });

  // Test 9: Professional Application Submission & Admin Approval
  test('Step 9: Professional applicant submission and administrator approval', () => {
    const initialExpertsCount = store.state.experts.length;
    const newApp = admin.submitApplication({
      name: 'Dr. Keerthi V.',
      email: 'keerthi@chennaipsych.org',
      phone: '9840298402',
      role: 'counsellor',
      qualification: 'Ph.D. in Clinical Psychology, Madras University',
      rciNumber: 'CRR-B90234',
      experienceYears: 11,
      specialties: ['Grief & Loss', 'Postpartum Wellness'],
      bio: 'Senior clinical psychologist with 11+ years of hospital and private practice experience.'
    });

    assert.strictEqual(newApp.status, 'pending');

    // Admin approves
    admin.approveApplication(newApp.id);
    assert.strictEqual(newApp.status, 'approved');
    assert.strictEqual(store.state.experts.length, initialExpertsCount + 1);

    const addedExpert = store.state.experts.find(e => e.name === 'Dr. Keerthi V.');
    assert(addedExpert);
    assert.strictEqual(addedExpert.priceDisplay, 999);
  });

  // Test 10: Provider Absence 100% Refund Execution
  test('Step 10: Automatic 100% refund execution on provider absence', () => {
    const apt = store.state.appointments[0];
    admin.reportProviderNoShow(apt.id);
    const updated = store.state.appointments.find(a => a.id === apt.id);
    assert.strictEqual(updated.status, 'refunded_due_to_provider_absence');
    assert.strictEqual(updated.refundAmount, apt.priceDisplay);
  });

  console.log(`\nSimulation Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

run();
