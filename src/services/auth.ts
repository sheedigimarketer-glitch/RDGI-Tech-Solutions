import { createClient } from '@supabase/supabase-js';

// Public client configuration is pinned to the verified HerSpace project.
// Existing hosting environment values may be malformed; never let them crash app startup.
const url = 'https://tzbkjvvkhxxobqsbtsdq.supabase.co';
const key = 'sb_publishable__xiHD48MLs4E3qokCYlBRQ_BVxegOCk';
export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
export function requireClient() {
  if (!supabase) throw new Error('Account service is not configured. Please contact HerSpace support.');
  return supabase;
}
export function validatePassword(value: string) {
  if (value.length < 12 || value.length > 128) throw new Error('Use a password between 12 and 128 characters.');
  return value;
}
