import { createClient } from '@supabase/supabase-js';

export const memberResetPath = '/member/reset';
export const memberSigninPath = '/member/sign-in';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const configuredKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
const validConfig = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(configuredUrl || '') &&
  /^sb_publishable_[A-Za-z0-9_-]+$/.test(configuredKey || '');

// These defaults are public browser credentials for the existing HerSpace project.
const url = validConfig ? configuredUrl! : 'https://tzbkjvvkhxxobqsbtsdq.supabase.co';
const key = validConfig ? configuredKey! : 'sb_publishable__xiHD48MLs4E3qokCYlBRQ_BVxegOCk';
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
