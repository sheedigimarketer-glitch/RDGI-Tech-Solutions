// Safe fallback default Supabase credentials for preview and local development
const envMeta = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

window.HERSPACE_SUPABASE = {
  url: envMeta.VITE_SUPABASE_URL || 'https://placeholder-herspace.supabase.co',
  publishableKey: envMeta.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-anon-key-herspace'
};
