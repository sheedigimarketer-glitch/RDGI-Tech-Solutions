import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { requestPasswordReset } from '../services/auth';

export const HeroAuthCard: React.FC<{initialMode?: 'register' | 'signin'}> = ({initialMode = 'register'}) => {
  const { user, anonymousAuth, navigate, signOut, isTa, openPolicyModal } = useApp();
  const [mode, setMode] = useState<'register' | 'signin' | 'recovery'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [identity, setIdentity] = useState<'woman' | 'trans_woman'>('woman');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const input = 'w-full min-h-[44px] px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#5E2750]';
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true);
    try {
      if (mode === 'recovery') {
        await requestPasswordReset(email);
        setMessage(isTa ? 'கணக்கு இருந்தால், மீட்பு இணைப்பு அனுப்பப்படும்.' : 'If an account exists for that email, a recovery link will be sent.');
      } else {
        await anonymousAuth({ username, password, email, age: Number(age), identity, agreeTerms, mode });
        if (mode === 'register') { setPassword(''); setMessage(isTa ? 'உங்கள் மின்னஞ்சலைச் சரிபார்த்து, பின்னர் உள்நுழையவும்.' : 'Check your email to verify your account, then sign in.'); }
      }
    } catch (err: any) { setError(err.message || 'Unable to complete this request.'); }
    finally { setBusy(false); }
  };
  if (user) return <div className="hero-auth-card rounded-2xl bg-white/90 p-6 border border-slate-200"><h2 className="text-xl font-bold">{isTa ? 'வரவேற்கிறோம்' : 'Welcome'}, @{user.username || user.fullName}</h2><button className={input} onClick={() => navigate('space')}>{isTa ? 'எனது தனிப்பட்ட இடம்' : 'Enter My Personal Space'}</button><button onClick={signOut}>{isTa ? 'வெளியேறு' : 'Sign out'}</button></div>;
  return <div className="hero-auth-card w-full max-w-[400px] rounded-2xl backdrop-blur-xl bg-white/90 border border-white/40 p-6 shadow-sm">
    <h2 className="text-xl font-bold text-slate-900 mb-3">HerSpace</h2>
    <div className="flex gap-3 mb-4">{(['register','signin'] as const).map(value => <button key={value} type="button" disabled={busy} aria-pressed={mode === value} className="min-h-[44px] underline text-[#5E2750]" onClick={() => {setMode(value);setError('');setMessage('');setPassword('');}}>{value === 'register' ? (isTa ? 'பதிவு' : 'Register') : (isTa ? 'உள்நுழை' : 'Sign in')}</button>)}</div>
    {error && <p role="alert" className="text-red-700 text-sm mb-3">{error}</p>}
    {message && <p role="status" className="text-sm text-[#5E2750] mb-3">{message}</p>}
    <form onSubmit={submit} className="space-y-3">
      {mode !== 'recovery' && <label className="block text-sm">{isTa ? 'பயனர் பெயர்' : 'Username'}<input className={input} required name="username" autoComplete="username" pattern="[A-Za-z][A-Za-z0-9_]{2,31}" minLength={3} maxLength={32} value={username} onChange={e => setUsername(e.target.value)} placeholder="Maya_92" /></label>}
      {mode !== 'signin' && <label className="block text-sm">{isTa ? 'தனிப்பட்ட மீட்பு மின்னஞ்சல்' : 'Private recovery email'}<input className={input} required type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /><small>{isTa ? 'உங்கள் மின்னஞ்சல் பொதுவில் காட்டப்படாது.' : 'Your email is never displayed publicly.'}</small></label>}
      {mode !== 'recovery' && <label className="block text-sm">{isTa ? 'கடவுச்சொல்' : 'Password'}<input className={input} required type="password" name="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 12 : 1} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} />{mode === 'register' && <small>{isTa ? 'குறைந்தது 12 எழுத்துக்கள்.' : 'At least 12 characters.'}</small>}</label>}
      {mode === 'register' && <>
        <label className="block text-sm">{isTa ? 'வயது' : 'Age'}<input className={input} required type="number" min={18} max={120} step={1} value={age} onChange={e => setAge(e.target.value)} /></label>
        <label className="block text-sm">{isTa ? 'பாலினம்' : 'Eligibility'}<select className={input} value={identity} onChange={e => setIdentity(e.target.value as typeof identity)}><option value="woman">{isTa ? 'பெண்' : 'Woman'}</option><option value="trans_woman">{isTa ? 'திருநங்கை' : 'Transgender woman'}</option></select></label>
        <label className="flex gap-2 text-xs"><input required type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />{isTa ? 'எனக்கு 18 வயது நிறைவடைந்தது; விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்.' : 'I am eligible, aged 18+, and accept the Terms and Privacy Policy.'}</label>
        <button type="button" className="underline text-xs min-h-[44px]" onClick={() => openPolicyModal('terms')}>{isTa ? 'விதிமுறைகள்' : 'Read Terms'}</button><button type="button" className="underline text-xs min-h-[44px]" onClick={() => openPolicyModal('privacy')}>{isTa ? 'தனியுரிமைக் கொள்கை' : 'Read Privacy Policy'}</button>
      </>}
      <button disabled={busy} className="w-full min-h-[44px] rounded-lg bg-[#5E2750] text-white disabled:opacity-60" type="submit">{busy ? (isTa ? 'காத்திருக்கவும்…' : 'Please wait…') : mode === 'register' ? (isTa ? 'இலவசமாகப் பதிவு செய்' : 'Create free account') : mode === 'signin' ? (isTa ? 'உள்நுழை' : 'Sign in') : (isTa ? 'மீட்பு இணைப்பை அனுப்பு' : 'Send recovery link')}</button>
      {mode === 'signin' && <button type="button" className="underline text-sm min-h-[44px]" onClick={() => {setMode('recovery');setPassword('');setError('');setMessage('');}}>{isTa ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot password?'}</button>}
    </form>
  </div>;
};
