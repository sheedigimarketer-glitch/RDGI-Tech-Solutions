import { ENV_CONFIG } from '../config';

export const HERSPACE_CONFIG = {
  appName: ENV_CONFIG.VITE_APP_TITLE,
  version: '4.1.0',
  tagline: 'SHARE · LISTEN · HEAL · GROW',
  wellbeingTagline: 'Every question deserves a safe answer.',
  targetMarket: 'Tamil Nadu, India',
  targetAudience: 'Women and transgender women aged 18+',
  minAge: 18,
  currencyCode: 'INR',
  currencySymbol: '₹',

  env: ENV_CONFIG,
  supabase: {
    url: ENV_CONFIG.VITE_SUPABASE_URL,
    publishableKey: ENV_CONFIG.VITE_SUPABASE_ANON_KEY
  },
  payments: {
    razorpayKeyId: ENV_CONFIG.VITE_RAZORPAY_KEY_ID
  },
  telephony: {
    bridgeUrl: ENV_CONFIG.VITE_TELEPHONY_BRIDGE
  },

  support: {
    phone: '+91 44 4813 1000',
    displayPhone: '+91 44 4813 1000',
    email: 'support@herspace.in',
    hours: '9:00 AM – 9:00 PM IST (Monday to Sunday)'
  },

  images: {
    heroSunrise: 'assets/images/03_HerSpace_Reflection_Outdoor.png',
    heroSunsetHill: 'assets/images/03_HerSpace_Reflection_Outdoor.png',
    calmCup: 'assets/images/02_HerSpace_Calm_Cup.png',
    reflectionOutdoor: 'assets/images/03_HerSpace_Reflection_Outdoor.png',
    hopePortrait: 'assets/images/04_HerSpace_Hope_Portrait.png',
    logo: 'assets/herspace-client-logo.webp'
  },

  pricing: {
    currency: 'INR',
    firstTimeRegistrationFee: 0,
    freeTrialDays: 7, // 7 days free trial @ ₹0
    firstPeriodValidityDays: 60, // Followed by ₹149 for the first 60 days
    firstPeriodFeeINR: 149,
    monthlyRenewalFeeINR: 149, // Followed by monthly auto-renewal @ ₹149
    trainedListenerPerSession: 399, // 60 mins
    professionalCounsellorPerSession: 999, // 60 mins
    loveMelodyPerSession: 99, // Love melody at 15 mins ₹99
    
    complimentarySession: {
      count: 1,
      durationMinutes: 30,
      validityDays: 7,
      price: 0,
      lifetimeLimit: 1
    }
  },

  policies: {
    rescheduling: 'Only one reschedule allowed',
    rescheduleCutoffHours: 4,
    cancellation: 'Appointments are non-refundable; one reschedule is permitted up to 4 hours prior.',
    providerNoShow: '100% full refund guaranteed if your care provider fails to join.'
  },

  crisisHelplines: [
    {
      name: 'KIRAN Mental Health Helpline',
      nameTa: 'கிரண் (KIRAN) மனநல உதவி எண்',
      number: '1800-599-0019',
      tollFree: '1800-599-0019',
      description: 'Govt. of India 24/7 National Mental Health Toll-Free Line (Tamil, English & Hindi).',
      descriptionTa: 'இந்திய அரசின் 24/7 இலவச தேசிய மனநல உதவி எண் (தமிழ், ஆங்கிலம்).'
    },
    {
      name: 'Vandrevala Foundation',
      nameTa: 'வாந்த்ரேவாலா அறக்கட்டளை',
      number: '+91 9999 666 555',
      tollFree: null,
      description: '24/7 Crisis & Psychological Counselling Support across India.',
      descriptionTa: '24 மணி நேர இலவச மனநல ஆலோசனை மற்றும் ஆதரவு.'
    },
    {
      name: 'Tele-MANAS (Govt of Tamil Nadu)',
      nameTa: 'டெலி-மானஸ் (தமிழ்நாடு அரசு)',
      number: '14416',
      tollFree: '1800-891-4416',
      description: 'Comprehensive Tamil Nadu mental health support hotline with certified psychologists.',
      descriptionTa: 'தமிழ்நாடு அரசின் 24/7 விரிவான மனநல ஆலோசனை சேவை.'
    },
    {
      name: 'Sneha India Suicide Prevention (Chennai)',
      nameTa: 'சினேகா இந்தியா (சென்னை)',
      number: '044-2464 0050',
      tollFree: null,
      description: 'Confidential unconditional emotional support helpline based in Chennai.',
      descriptionTa: 'சென்னையைத் தளமாகக் கொண்ட ரகசியமான, தீர்ப்புகளற்ற உணர்வு ஆதரவு.'
    },
    {
      name: 'Women Helpline (National)',
      nameTa: 'பெண்கள் உதவி மையம் (தேசிய எண்)',
      number: '181',
      tollFree: '181',
      description: '24/7 emergency response, distress management, and safety guidance for women.',
      descriptionTa: 'பெண்களுக்கான 24 மணி நேர அவசர உதவி மற்றும் பாதுகாப்பு வழிகாட்டல்.'
    }
  ]
};

export function formatINR(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '₹0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0';
  if (num === 0) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}
