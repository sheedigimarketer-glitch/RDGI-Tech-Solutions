import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { memberResetPath, supabase, validatePassword } from '../services/auth';
import { createMemberProfile, memberCallback, memberConfirmPath } from '../services/member';

type Mode = 'register' | 'signin' | 'recover' | 'reset' | 'confirm' | 'profile' | 'loading' | 'error';

const accountExistsCodes = ['user_already_exists', 'email_exists'];

export function MemberAccessView({ mode }: { mode: Mode }) {
  const { t, isTa, lang, navigate, memberSession, openPolicyModal, signOut } = useApp();
  const copy = (en: string, ta: string) => isTa ? ta : en;
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isProfile = mode === 'profile';
  const isRegister = mode === 'register';
  const isSignin = mode === 'signin';
  const isReset = mode === 'reset';
  const canReset = isReset && memberSession.recovery;
  const showEmail = isRegister || isSignin || mode === 'recover';
  const showPassword = isRegister || isSignin || canReset;
  const showForm = isProfile || showEmail || canReset;
  const verificationNotice = copy(
    'If this email can be registered, you’ll receive a verification link. Already registered? Sign in or reset your password.',
    'இந்த மின்னஞ்சலைப் பதிவு செய்ய முடிந்தால், சரிபார்ப்பு இணைப்பு வரும். ஏற்கனவே பதிவு செய்திருந்தால் உள்நுழையுங்கள் அல்லது கடவுச்சொல்லை மீட்டமைக்கவும்.'
  );
  const titles: Record<Mode, string> = {
    register: t('regTitle'),
    signin: t('signinTitle'),
    recover: copy('Recover your account', 'உங்கள் கணக்கை மீட்டெடுக்கவும்'),
    reset: copy('Set a new password', 'புதிய கடவுச்சொல்லை அமைக்கவும்'),
    confirm: copy('Verify your email', 'மின்னஞ்சலைச் சரிபார்க்கவும்'),
    profile: copy('Complete your member profile', 'உறுப்பினர் சுயவிவரத்தை நிறைவு செய்யவும்'),
    loading: copy('Checking your session…', 'உங்கள் அமர்வைச் சரிபார்க்கிறோம்…'),
    error: copy('Could not load your account', 'உங்கள் கணக்கை ஏற்ற முடியவில்லை')
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = String(fields.get('password') || '');
    const address = email.trim().toLowerCase();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (isProfile && memberSession.accountId) {
        if (!fields.has('consent')) throw new Error('invalid_profile');
        await createMemberProfile(memberSession.accountId, {
          name: String(fields.get('name') || ''),
          birthDate: String(fields.get('birthDate') || ''),
          identity: String(fields.get('identity') || ''),
          lang
        });
        memberSession.refresh();
        navigate('onb-register');
      } else if (isRegister) {
        validatePassword(password);
        if (!fields.has('consent')) throw new Error('invalid_profile');
        const { data, error } = await supabase.auth.signUp({
          email: address, password,
          options: { emailRedirectTo: memberCallback(memberConfirmPath) }
        });
        if (error && !accountExistsCodes.includes(error.code || '')) throw error;
        if (!data?.session) setNotice(verificationNotice);
      } else if (isSignin) {
        const { error } = await supabase.auth.signInWithPassword({ email: address, password });
        if (error) throw error;
      } else if (mode === 'recover') {
        const { error } = await supabase.auth.resetPasswordForEmail(address, {
          redirectTo: memberCallback(memberResetPath)
        });
        if (error && !['user_not_found', 'email_not_confirmed'].includes(error.code || '')) throw error;
        setNotice(copy('If the email belongs to an eligible account, a reset link will be sent.', 'தகுதியான கணக்குடன் மின்னஞ்சல் இணைந்திருந்தால், மீட்டமைப்பு இணைப்பு அனுப்பப்படும்.'));
      } else if (canReset) {
        validatePassword(password);
        if (password !== fields.get('confirmation')) throw new Error('password_mismatch');
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setNotice(copy('Password updated. Use “Return to sign in” to close the recovery session.', 'கடவுச்சொல் புதுப்பிக்கப்பட்டது. மீட்டெடுப்பு அமர்வை முடித்து மீண்டும் உள்நுழையுங்கள்.'));
      }
    } catch (cause) {
      const code = typeof cause === 'object' && cause !== null && 'code' in cause ? cause.code : '';
      const message = cause instanceof Error ? cause.message : '';
      if (message === 'invalid_profile') {
        setError(copy('Check your details, age eligibility and consent.', 'உங்கள் விவரங்கள், வயதுத் தகுதி மற்றும் ஒப்புதலைச் சரிபார்க்கவும்.'));
      } else if (message === 'password_mismatch') {
        setError(copy('Passwords must match.', 'கடவுச்சொற்கள் ஒன்றாக இருக்க வேண்டும்.'));
      } else if (showPassword && !isSignin && (password.length < 12 || password.length > 128 || code === 'weak_password')) {
        setError(copy('Choose a strong password of 12–128 characters.', '12–128 எழுத்துகள் கொண்ட வலுவான கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும்.'));
      } else if (isSignin && (code === 'invalid_credentials' || code === 'email_not_confirmed')) {
        setError(copy('Check your email and password, and verify your email before signing in.', 'மின்னஞ்சல், கடவுச்சொல் மற்றும் மின்னஞ்சல் சரிபார்ப்பைச் சரிபார்க்கவும்.'));
      } else if (typeof code === 'string' && code.startsWith('over_')) {
        setError(copy('Too many attempts. Wait a few minutes and try again.', 'அதிக முயற்சிகள். சில நிமிடங்கள் கழித்து மீண்டும் முயலுங்கள்.'));
      } else {
        setError(copy('We couldn’t complete that request. Try again or contact HerSpace support.', 'கோரிக்கையை நிறைவு செய்ய முடியவில்லை. மீண்டும் முயலுங்கள் அல்லது HerSpace உதவியை அணுகுங்கள்.'));
      }
    } finally {
      for (const input of form.querySelectorAll<HTMLInputElement>('input[type=password]')) input.value = '';
      setBusy(false);
    }
  };

  const minimumBirthYear = new Date().getFullYear() - 18;
  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{titles[mode]}</h1>
        {isRegister && <p className="onb-sub">{t('regSub')}</p>}
        {isSignin && <p className="onb-sub">{copy('Sign in with your registered email address.', 'பதிவு செய்த மின்னஞ்சல் முகவரியுடன் உள்நுழையுங்கள்.')}</p>}
        {mode === 'confirm' && <p className="onb-sub">{copy('If your link has expired, return to sign in or request password recovery.', 'இணைப்பு காலாவதியானால் மீண்டும் உள்நுழையுங்கள் அல்லது கடவுச்சொல்லை மீட்டமைக்கவும்.')}</p>}
        {isReset && !memberSession.loading && !canReset && <p className="onb-sub">{copy('Request a fresh reset link to continue.', 'தொடர புதிய மீட்டமைப்பு இணைப்பைக் கோருங்கள்.')}</p>}
        {mode === 'error' && <div className="onb-actions">
          <button type="button" className="btn btn-primary" onClick={memberSession.refresh}>{copy('Try again', 'மீண்டும் முயலுங்கள்')}</button>
          <button type="button" className="btn btn-outline" onClick={() => void signOut()}>{t('navSignOut')}</button>
        </div>}
        {showForm && <form className="onb-card onb-form" onSubmit={submit}>
          {showEmail && <div className="form-group">
            <label className="form-label" htmlFor="member-email">{copy('Email address', 'மின்னஞ்சல் முகவரி')}</label>
            <input id="member-email" name="email" className="form-control" type="email" autoComplete="username"
              value={email} onChange={event => setEmail(event.target.value)} maxLength={254} required />
          </div>}
          {showPassword && <div className="form-group">
            <label className="form-label" htmlFor="member-password">{copy(isSignin ? 'Password' : 'Password (12–128 characters)', isSignin ? 'கடவுச்சொல்' : 'கடவுச்சொல் (12–128 எழுத்துகள்)')}</label>
            <input id="member-password" name="password" className="form-control" type="password"
              autoComplete={isSignin ? 'current-password' : 'new-password'} minLength={isSignin ? undefined : 12}
              maxLength={isSignin ? undefined : 128} required />
          </div>}
          {canReset && <div className="form-group">
            <label className="form-label" htmlFor="member-confirm-password">{copy('Confirm new password', 'புதிய கடவுச்சொல்லை உறுதிசெய்யுங்கள்')}</label>
            <input id="member-confirm-password" name="confirmation" className="form-control" type="password" autoComplete="new-password" required />
          </div>}
          {isProfile && <>
            <div className="form-group">
              <label className="form-label" htmlFor="member-name">{t('fldName')}</label>
              <input id="member-name" name="name" className="form-control" autoComplete="nickname" minLength={2} maxLength={100} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="member-birth">{copy('Date of birth (18+)', 'பிறந்த தேதி (18+)')}</label>
              <input id="member-birth" name="birthDate" className="form-control" type="date" max={minimumBirthYear + '-12-31'} autoComplete="bday" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="member-identity">{t('fldIdentity')}</label>
              <select id="member-identity" name="identity" className="form-control" defaultValue="" required>
                <option value="" disabled>{copy('Select an option', 'ஒன்றைத் தேர்ந்தெடுக்கவும்')}</option>
                <option value="woman">{t('optWomanLabel')}</option>
                <option value="transgender_woman">{t('optTransWomanLabel')}</option>
              </select>
            </div>
          </>}
          {(isProfile || isRegister) && <>
            <div className="form-check">
              <input id="member-consent" name="consent" type="checkbox" required />
              <label htmlFor="member-consent">{t('regConsent')}</label>
            </div>
            <div className="onb-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => openPolicyModal('terms')}>{copy('Terms of Use', 'பயன்பாட்டு விதிமுறைகள்')}</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => openPolicyModal('privacy')}>{copy('Privacy Policy', 'தனியுரிமைக் கொள்கை')}</button>
            </div>
          </>}
          <button className="btn btn-primary btn-block" disabled={busy || (canReset && Boolean(notice))} type="submit">
            {busy ? copy('Please wait…', 'காத்திருக்கவும்…') : isRegister ? copy('Create account', 'கணக்கை உருவாக்கவும்') :
              isSignin ? t('signinSubmit') : isProfile ? copy('Continue to the tour', 'சுற்றுப்பயணத்திற்குச் செல்லவும்') :
              canReset ? copy('Save new password', 'புதிய கடவுச்சொல்லைச் சேமிக்கவும்') : copy('Send reset link', 'மீட்டமைப்பு இணைப்பை அனுப்பவும்')}
          </button>
        </form>}
        {error && <p className="onb-sub" role="alert">{error}</p>}
        {notice && <p className="onb-sub" role="status">{notice}</p>}
        {mode !== 'loading' && <div className="onb-actions">
          {isSignin && <>
            <button className="btn btn-outline" onClick={() => navigate('member-recover')}>{copy('Forgot password?', 'கடவுச்சொல் மறந்துவிட்டதா?')}</button>
            <button className="btn btn-outline" onClick={() => navigate('onb-register')}>{copy('Create an account', 'கணக்கை உருவாக்குங்கள்')}</button>
          </>}
          {isProfile && <button className="btn btn-outline" onClick={() => void signOut()}>{t('navSignOut')}</button>}
          {isReset && <button className="btn btn-outline" onClick={() => void signOut('signin')}>{copy('Return to sign in', 'உள்நுழைவிற்குத் திரும்பு')}</button>}
          {(isRegister || mode === 'recover' || mode === 'confirm') &&
            <button className="btn btn-outline" onClick={() => navigate('signin')}>{t('signinSubmit')}</button>}
          {!isReset && <button className="btn btn-outline" onClick={() => navigate('home')}>{copy('Return to home', 'முகப்புக்குச் செல்லவும்')}</button>}
        </div>}
      </div>
    </section>
  );
}
