// Safe fallback default Supabase credentials for preview and local development
const envMeta = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

window.HERSPACE_SUPABASE = {
  url: envMeta.VITE_SUPABASE_URL || '',
  publishableKey: envMeta.VITE_SUPABASE_ANON_KEY || ''
};
