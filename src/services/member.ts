import { supabase } from './auth';
import type { Entitlement, Language, User } from '../types';
import type { User as AuthUser } from '@supabase/supabase-js';

export const memberConfirmPath = '/member/confirm';
export const memberCallback = (path: string) => window.location.origin + path;

const profileColumns = 'full_name, date_of_birth, eligibility_category, preferred_language, onboarding_completed_at';

export function ageAt(date: string, today = new Date()) {
  const [year, month, day] = date.split('-').map(Number);
  const birthdayPending = today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day);
  return today.getFullYear() - year - Number(birthdayPending);
}

export async function readMember(account: AuthUser) {
  const [profile, benefits] = await Promise.all([
    supabase.from('member_profiles').select(profileColumns).eq('user_id', account.id).maybeSingle(),
    supabase.from('member_entitlements')
      .select('trial_started_at, trial_ends_at, welcome_call_expires_at, welcome_call_used_at')
      .eq('user_id', account.id).maybeSingle()
  ]);
  if (profile.error || benefits.error) throw new Error('Member data could not be loaded.');
  if (!profile.data) return null;

  const row = profile.data;
  const user: User = {
    id: account.id,
    fullName: row.full_name,
    email: account.email || '',
    phone: account.phone_confirmed_at ? account.phone || '' : '',
    age: row.date_of_birth ? ageAt(row.date_of_birth) : null,
    identity: row.eligibility_category === 'transgender_woman' ? 'trans_woman' :
      row.eligibility_category === 'woman' ? 'woman' : null,
    role: 'member',
    createdAt: account.created_at,
    isAuthenticated: true
  };
  const benefit = benefits.data;
  const entitlement: Entitlement | null = benefit ? {
    trialStartedAt: benefit.trial_started_at,
    trialEndsAt: benefit.trial_ends_at,
    welcomeCallExpiresAt: benefit.welcome_call_expires_at,
    welcomeCallStatus: benefit.welcome_call_used_at ? 'used' :
      Date.parse(benefit.welcome_call_expires_at) > Date.now() ? 'available' : 'expired',
    paidThrough: null,
    autoRenew: false,
    isReturning: Boolean(row.onboarding_completed_at)
  } : null;
  return { user, entitlement, completedAt: row.onboarding_completed_at as string | null };
}

export async function createMemberProfile(accountId: string, fields: {
  name: string;
  birthDate: string;
  identity: string;
  lang: Language;
}) {
  const name = fields.name.trim();
  const date = new Date(fields.birthDate + 'T00:00:00Z');
  if (name.length < 2 || name.length > 100 || !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== fields.birthDate || ageAt(fields.birthDate) < 18 ||
    !['woman', 'transgender_woman'].includes(fields.identity)) {
    throw new Error('invalid_profile');
  }
  const { error } = await supabase.from('member_profiles').insert({
    user_id: accountId,
    full_name: name,
    date_of_birth: fields.birthDate,
    eligibility_category: fields.identity,
    preferred_language: fields.lang
  });
  // A retry after a completed insert, or another tab, can already own this primary key.
  if (error && error.code !== '23505') throw error;
}
