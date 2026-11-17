/**
 * HerSpace Environment Configuration & Safe Fallback Engine
 * Provides resilient fallback defaults for preview and local development.
 */

export const ENV_CONFIG = {
  VITE_APP_TITLE: (import.meta.env && import.meta.env.VITE_APP_TITLE) || 'HerSpace',
  VITE_RAZORPAY_KEY_ID: (import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) || '',
  VITE_TELEPHONY_BRIDGE: (import.meta.env && import.meta.env.VITE_TELEPHONY_BRIDGE) || 'https://api.herspace.local/telephony',
  VITE_SUPABASE_URL: (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '',
  VITE_SUPABASE_ANON_KEY: (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || ''
};

export default ENV_CONFIG;
