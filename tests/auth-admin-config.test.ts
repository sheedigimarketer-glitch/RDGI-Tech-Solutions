import { expect, it } from 'vitest';
import { readSupabaseConfig } from '../src/services/supabaseConfig';

const good = {
  VITE_SUPABASE_URL: 'https://fixture.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic',
};

it('accepts an explicitly configured public project', () => {
  expect(readSupabaseConfig(good)).toEqual({
    url: good.VITE_SUPABASE_URL,
    key: good.VITE_SUPABASE_PUBLISHABLE_KEY,
  });
});

it.each([
  {},
  { ...good, VITE_SUPABASE_URL: 'not-a-valid-url' },
  { ...good, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_synthetic' },
])('rejects missing, malformed or privileged configuration', config => {
  expect(() => readSupabaseConfig(config)).toThrow('Configure a valid');
});
