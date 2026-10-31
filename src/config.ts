/**
 * HerSpace Environment Configuration & Safe Fallback Engine
 * Provides resilient fallback defaults for preview and local development.
 */

export const ENV_CONFIG = {
  VITE_APP_TITLE: (import.meta.env && import.meta.env.VITE_APP_TITLE) || 'HerSpace',
  VITE_RAZORPAY_KEY_ID: (import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) || 'rzp_test_1DP5mmOlF5G5ag',
  VITE_TELEPHONY_BRIDGE: (import.meta.env && import.meta.env.VITE_TELEPHONY_BRIDGE) || 'https://api.herspace.local/telephony',
  VITE_SUPABASE_URL: (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://placeholder-herspace.supabase.co',
  VITE_SUPABASE_ANON_KEY: (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-anon-key-herspace'
};

export default ENV_CONFIG;
