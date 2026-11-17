export function readSupabaseConfig(env: Record<string, unknown>) {
  const url = typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : '';
  const key = typeof env.VITE_SUPABASE_PUBLISHABLE_KEY === 'string' ? env.VITE_SUPABASE_PUBLISHABLE_KEY.trim() : '';
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error('Configure a valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for this environment.');
  }
  return { url, key };
}
