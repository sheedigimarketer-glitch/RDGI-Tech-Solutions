import { it, expect, vi } from 'vitest';
it('initialises the verified public client even when hosting contains a malformed URL', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'VITE_SUPABASE_URL=not-a-valid-url');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_secret_must_never_be_used');
  const {supabase} = await import('../src/services/auth');
  expect(new URL(supabase.supabaseUrl).origin).toBe('https://tzbkjvvkhxxobqsbtsdq.supabase.co');
  expect(supabase.supabaseKey.startsWith('sb_publishable_')).toBe(true);
  supabase.auth.stopAutoRefresh();
  vi.unstubAllEnvs();
});
