import { createClient } from '@supabase/supabase-js';
import { readSupabaseConfig } from './supabaseConfig';

export const memberResetPath = '/member/reset';
export const memberSigninPath = '/member/sign-in';

const { url, key } = readSupabaseConfig(import.meta.env);
const isMemberReset = typeof window !== 'undefined' && window.location.pathname === memberResetPath;
export const supabase = createClient(url, key, {
  auth: { persistSession: !isMemberReset, autoRefreshToken: !isMemberReset, detectSessionInUrl: true }
});
export function requireClient() {
  if (!supabase) throw new Error('Account service is not configured. Please contact HerSpace support.');
  return supabase;
}
export function validatePassword(value: string) {
  if (value.length < 12 || value.length > 128) throw new Error('Use a password between 12 and 128 characters.');
  return value;
}
