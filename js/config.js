/**
 * HerSpace Premium 4.0 - Configuration, INR Currency Engine & Source of Truth Business Rules
 * RDGI Tech Solutions
 */

window.HERSPACE_CONFIG = {
  // Brand & Market
  appName: 'HerSpace',
  version: '4.0.0',
  tagline: 'SHARE · LISTEN · HEAL · GROW',
  wellbeingTagline: 'Every question deserves a safe answer.',
  targetMarket: 'Tamil Nadu, India',
  targetAudience: 'Women and transgender women aged 18+',
  minAge: 18,
  currencyCode: 'INR',
  currencySymbol: '₹',

  // Official Client Image Package (HerSpace 4.0)
  images: {
    heroSunrise: 'assets/images/01_HerSpace_Hero_Sunrise.png',
    calmCup: 'assets/images/02_HerSpace_Calm_Cup.png',
    reflectionOutdoor: 'assets/images/03_HerSpace_Reflection_Outdoor.png',
    hopePortrait: 'assets/images/04_HerSpace_Hope_Portrait.png',
    logo: 'assets/images/herspace-client-logo.webp'
  },

  // Supabase Configuration
  supabase: {
    url: (window.HERSPACE_SUPABASE && window.HERSPACE_SUPABASE.url) || 'https://tzbkjvvkhxxobqsbtsdq.supabase.co',
    publishableKey: (window.HERSPACE_SUPABASE && window.HERSPACE_SUPABASE.publishableKey) || 'sb_publishable__xiHD48MLs4E3qokCYlBRQ_BVxegOCk'
  },

  // Verification providers. A provider of null means NOT CONNECTED: the UI must say so
  // and must never present the demo code as live verification.
  verification: {
    phone: { provider: null },                 // e.g. 'exotel-sms' / 'msg91' once an SMS provider is configured
    email: { provider: 'supabase-auth' }       // Supabase Auth confirmation email (used when Supabase is live)
  },

  // App tour. Set videoUrl to an APPROVED media file when the client supplies one.
  // While null, no video is shown or mentioned to members.
  tour: {
    videoUrl: null,
    minSlidesBeforeSkip: 3
  },

  // Confirmed Business Pricing (Strictly in INR — never convert to USD)
  pricing: {
    currency: 'INR',
    firstTimeRegistrationFee: 0,
    freeTrialMonths: 3,
    monthlyMembershipAfterTrial: 149,
    trainedListenerPerSession: 399, // 60 minutes
    professionalCounsellorPerSession: 999, // 60 minutes
    liveSingerSessionStatus: 'Pending Client Approval', // Never invent singer prices
    
    // Complimentary first-time listener session rules
    complimentarySession: {
      count: 1,
      durationMinutes: 30,
      validityDays: 7,
      validityHours: 168,
      price: 0,
      lifetimeLimit: 1
    }
  },

  // Appointment & Rescheduling Policies
  appointments: {
    cancellationAllowed: false, // No standard cancellation
    rescheduleCutoffHours: 4,   // Reschedule permitted up to 4 hrs prior
    refundOnProviderNoShow: true // 100% refund if provider fails to attend
  },

  // Cloud Telephony & Two-Way Masked Calling Architecture (Exotel India)
  telephony: {
    provider: 'Exotel Cloud Telephony (Configured Bridge)',
    region: 'India (Chennai / Mumbai Edge)',
    twoWayMaskingEnabled: true,
    exposeRealNumbers: false,
    defaultCallRecording: false, // Never record calls by default
    bookingWindowBeforeMinutes: 10,
    bookingWindowAfterMinutes: 15,
    queues: {
      listener: {
        id: 'queue_listener_tn',
        nameKey: 'queue_listener_name',
        virtualNumber: '+91-44-4813-1001',
        role: 'listener',
        maxWaitSeconds: 180
      },
      counsellor: {
        id: 'queue_counsellor_tn',
        nameKey: 'queue_counsellor_name',
        virtualNumber: '+91-44-4813-1002',
        role: 'counsellor',
        maxWaitSeconds: 180
      },
      singer: {
        id: 'queue_singer_tn',
        nameKey: 'queue_singer_name',
        virtualNumber: '+91-44-4813-1003',
        role: 'singer',
        maxWaitSeconds: 240
      },
      admin_escalation: {
        id: 'queue_admin_escalation',
        nameKey: 'queue_admin_name',
        virtualNumber: '+91-44-4813-1009',
        role: 'admin',
        maxWaitSeconds: 60
      }
    }
  },

  // Crisis & Safeguarding Helplines (India)
  crisisHelplines: [
    { name: 'National Emergency', nameTa: 'தேசிய அவசர உதவி', number: '112', description: 'Immediate emergency, police & medical assistance', descriptionTa: 'உடனடி அவசரநிலை, காவல்துறை மற்றும் மருத்துவ உதவி' },
    { name: 'Tele-MANAS', nameTa: 'டெலி-மனஸ் (Tele-MANAS)', number: '14416', tollFree: '1800-891-4416', description: 'Government 24/7 mental health tele-counselling', descriptionTa: 'அரசின் 24/7 மனநல தொலைபேசி ஆலோசனை' },
    { name: 'Vandrevala Foundation', nameTa: 'வந்த்ரேவாலா அறக்கட்டளை', number: '9999 666 555', description: '24/7 free emotional distress helpline', descriptionTa: '24/7 இலவச மன அழுத்த உதவி எண்' },
    { name: 'KIRAN Mental Health', nameTa: 'கிரண் மனநல உதவி', number: '1800-599-0019', description: 'National toll-free mental health support', descriptionTa: 'தேசிய கட்டணமில்லா மனநல ஆதரவு' }
  ]
};

/**
 * Absolute INR Currency Formatter
 * Formats any numeric amount in Indian Rupees (₹) using en-IN / ta-IN Indian digit grouping.
 * Preserves exact numeric values and never converts to USD or displays $.
 *
 * Examples:
 *   herSpaceFormatINR(0) -> "₹0"
 *   herSpaceFormatINR(149) -> "₹149"
 *   herSpaceFormatINR(399) -> "₹399"
 *   herSpaceFormatINR(999) -> "₹999"
 *   herSpaceFormatINR(1499) -> "₹1,499"
 *   herSpaceFormatINR(399.50, { showDecimals: true }) -> "₹399.50"
 *   herSpaceFormatINR(-399) -> "-₹399"
 */
window.herSpaceFormatINR = function(amount, options) {
  const opts = options || {};
  const num = Number(amount);
  if (Number.isNaN(num)) {
    return '₹0';
  }
  const hasDecimals = opts.showDecimals || (Math.abs(num) % 1 !== 0);
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0
  });
  // Ensure the symbol is always '₹' even on older engines that might output 'INR'
  return formatter.format(num).replace(/INR\s*/g, '₹').replace(/\$/g, '₹');
};

/**
 * Helper to scan any rendered HTML or text string for accidental US dollar currency displays.
 * Used by automated QA checks and runtime assertions.
 */
window.herSpaceCheckZeroDollarCurrency = function(visibleText) {
  if (!visibleText || typeof visibleText !== 'string') return { valid: true, matches: [] };
  // Match $ followed by digits, or US$, or USD
  const regex = /(\$\s*\d+|US\$\s*\d+|\bUSD\b)/g;
  const matches = visibleText.match(regex) || [];
  return {
    valid: matches.length === 0,
    matches: matches
  };
};
