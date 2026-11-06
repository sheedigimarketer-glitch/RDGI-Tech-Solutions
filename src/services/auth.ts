import { createClient, type User as AuthUser } from '@supabase/supabase-js';
import type { User, Entitlement } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key && !url.includes('placeholder') && !key.includes('dummy')
  ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
export function requireClient() {
  if (!supabase) throw new Error('Account service is not configured. Please contact HerSpace support.');
  return supabase;
}
export function normalizeUsername(value: string) {
  const username = value.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{2,31}$/.test(username)) throw new Error('Use 3–32 letters, numbers or underscores, starting with a letter.');
  return username;
}
export function validatePassword(value: string) {
  if (value.length < 12 || value.length > 128) throw new Error('Use a password between 12 and 128 characters.');
  return value;
}
export async function registerAccount(data: {username: string; password: string; email: string; age: number; identity: string; agreeTerms: boolean}) {
  const username = normalizeUsername(data.username);
  validatePassword(data.password);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) throw new Error('Enter a valid private recovery email.');
  if (!Number.isInteger(data.age) || data.age < 18 || data.age > 120 || !['woman', 'trans_woman'].includes(data.identity) || !data.agreeTerms) throw new Error('Confirm age 18+, eligibility and the Terms and Privacy Policy.');
  const { data: result, error } = await requireClient().auth.signUp({
    email: data.email.trim().toLowerCase(), password: data.password,
    options: { emailRedirectTo: window.location.origin + '/', data: { username, age: data.age, identity: data.identity, terms_accepted: true } }
  });
  if (error) throw new Error('Registration could not be completed. Check your details or use account recovery.');
  // A verified email is mandatory even if project settings were accidentally weakened.
  if (result.session && !result.user?.email_confirmed_at) await requireClient().auth.signOut();
  return result;
}
export async function loginAccount(username: string, password: string) {
  username = normalizeUsername(username);
  if (!password) throw new Error('Enter your password.');
  const client = requireClient();
  const { data, error } = await client.functions.invoke('username-login', { body: { username, password } });
  if (error || !data?.access_token || !data?.refresh_token) throw new Error('Unable to sign in. Check your username, password and email verification, or try again later.');
  const { error: sessionError } = await client.auth.setSession(data);
  if (sessionError) throw new Error('Unable to establish your session. Please try again.');
}
export async function loadAccount(authUser: AuthUser): Promise<{user: User; entitlement: Entitlement | null}> {
  if (!authUser.email_confirmed_at) throw new Error('Verify your recovery email before signing in.');
  const client = requireClient();
  const [profileResult, entitlementResult] = await Promise.all([
    client.from('member_profiles').select('*').eq('user_id', authUser.id).single(),
    client.from('member_entitlements').select('*').eq('user_id', authUser.id).maybeSingle()
  ]);
  if (profileResult.error || entitlementResult.error) throw new Error('Unable to load your account securely. Please try signing in again.');
  const p = profileResult.data;
  const e = entitlementResult.data;
  return { user: { id: authUser.id, username: p.username, fullName: p.full_name, phone: authUser.phone || '', email: authUser.email || '', age: Number(authUser.user_metadata.age || 0), identity: p.eligibility_category === 'transgender_woman' ? 'trans_woman' : 'woman', role: 'member', isAuthenticated: true, createdAt: authUser.created_at },
    entitlement: e ? { trialStartedAt: e.trial_started_at, trialEndsAt: e.trial_ends_at, welcomeCallExpiresAt: e.welcome_call_expires_at, welcomeCallStatus: e.welcome_call_used_at ? 'used' : new Date(e.welcome_call_expires_at).getTime() > Date.now() ? 'available' : 'expired', paidThrough: null, autoRenew: false, isReturning: false } : null };
}
export async function requestPasswordReset(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter your recovery email.');
  const { error } = await requireClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + '/' });
  if (error) throw new Error('Recovery is temporarily unavailable. Please try again later.');
}
