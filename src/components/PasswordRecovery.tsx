import React, { useState } from 'react';
import { requireClient, validatePassword } from '../services/auth';
import { useApp } from '../context/AppContext';
export const PasswordRecovery: React.FC = () => {
  const { isTa, navigate, signOut } = useApp();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return <form className="max-w-md mx-auto p-6 space-y-4" onSubmit={async event => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      validatePassword(password);
      if (password !== confirmation) throw new Error('Passwords must match.');
      const { error } = await requireClient().auth.updateUser({ password });
      if (error) throw new Error('Unable to change your password. Request a fresh recovery link.');
      setPassword(''); setConfirmation(''); signOut(); navigate('signin');
    } catch (error: any) { setError(error.message); } finally { setBusy(false); }
  }}><h1>{isTa ? 'புதிய கடவுச்சொல்' : 'Set a new password'}</h1>{error && <p role="alert">{error}</p>}<label className="block">{isTa ? 'புதிய கடவுச்சொல்' : 'New password'}<input className="block border rounded p-3" required type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label><label className="block">{isTa ? 'கடவுச்சொல்லை உறுதிசெய்' : 'Confirm password'}<input className="block border rounded p-3" required type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label><button className="rounded bg-[#5E2750] text-white p-3" disabled={busy}>{busy ? 'Please wait…' : (isTa ? 'கடவுச்சொல்லைச் சேமி' : 'Save new password')}</button></form>;
};
