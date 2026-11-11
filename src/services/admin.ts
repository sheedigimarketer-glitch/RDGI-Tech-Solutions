import { requireClient, validatePassword } from './auth';
export interface StaffStatus { user_id: string; is_staff: boolean; has_admin_access: boolean }
export interface AdminOverview {
  member_count: number;
  active_trial_count: number;
  welcome_calls_used: number;
  members: Array<{ user_id: string; username: string | null; display_name: string; joined_at: string; trial_ends_at: string | null }>;
}
export async function staffStatus(): Promise<StaffStatus | null> {
  const client = requireClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  if (!user.email_confirmed_at) throw new Error('Verify your staff email before signing in.');
  const { data, error: roleError } = await client.rpc('herspace_staff_status');
  if (roleError || !data) throw new Error('Staff permissions could not be verified. Please contact the platform owner.');
  return { user_id: user.id, is_staff: data.is_staff === true, has_admin_access: data.has_admin_access === true };
}
export async function signInAdmin(email: string, password: string) {
  const { error } = await requireClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw new Error('Unable to sign in. Check your email, password and email verification.');
}
export async function adminOverview(): Promise<AdminOverview> {
  const { data, error } = await requireClient().rpc('herspace_admin_overview');
  if (error || !data) throw new Error('The admin dashboard could not be loaded. Verify your permissions and try again.');
  return data as AdminOverview;
}
export async function verifiedFactor(): Promise<string | null> {
  const { data, error } = await requireClient().auth.mfa.listFactors();
  if (error) throw new Error('Unable to check your authenticator. Try again.');
  return data.totp.find(f => f.status === 'verified')?.id || null;
}
export async function enrollAdminFactor() {
  const { data, error } = await requireClient().auth.mfa.enroll({ factorType: 'totp', friendlyName: 'HerSpace Admin ' + Date.now() });
  if (error) throw new Error('Unable to set up your authenticator. Contact support if you have a pending setup.');
  // The SDK already adds a data URL prefix. Encode only the SVG payload.
  const svg = data.totp.qr_code.replace(/^data:image\/svg\+xml;utf-8,/, '');
  return { id: data.id, qr: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) };
}
export async function verifyAdminFactor(factorId: string, code: string) {
  if (!/^\d{6}$/.test(code)) throw new Error('Enter the six-digit code from your authenticator app.');
  const { error } = await requireClient().auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw new Error('That verification code could not be accepted. Use the latest code and try again.');
}
export async function recoverAdmin(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter your private staff email.');
  const { error } = await requireClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + '/admin/login' });
  if (error) throw new Error('Recovery is temporarily unavailable. Please try again later.');
}
export async function resetAdminPassword(password: string, confirmation: string) {
  validatePassword(password);
  if (password !== confirmation) throw new Error('Passwords must match.');
  const { error } = await requireClient().auth.updateUser({ password });
  if (error) throw new Error('Unable to save your new password. Request a fresh recovery link or contact support.');
  await signOutAdmin();
}
export async function signOutAdmin() {
  const { error } = await requireClient().auth.signOut({ scope: 'global' });
  if (error) throw new Error('Sign-out failed. Please try again.');
}
