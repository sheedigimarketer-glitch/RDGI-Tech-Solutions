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

export async function signInMember(identifier: string, password: string) {
  if (identifier.includes('@')) {
    // Accounts created before usernames can still enter to claim one.
    const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
    if (error) throw error;
    return;
  }
  const response = await fetch(url + '/functions/v1/member-username-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify({ username: identifier, password }),
    cache: 'no-store',
    redirect: 'error'
  });
  if (response.status === 401) throw Object.assign(new Error('Invalid sign-in'), { code: 'invalid_credentials' });
  if (response.status === 429) throw Object.assign(new Error('Sign-in rate limited'), { code: 'over_sign_in_rate_limit' });
  if (!response.ok) throw new Error('Sign-in unavailable');
  const { access_token, refresh_token } = await response.json();
  if (typeof access_token !== 'string' || typeof refresh_token !== 'string') throw new Error('Invalid sign-in response');
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
}
