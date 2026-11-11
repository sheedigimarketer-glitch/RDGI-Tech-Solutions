import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/auth-*.test.{ts,tsx}'], environment: 'node', env: { VITE_SUPABASE_URL: 'https://fixture.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic' } } });
