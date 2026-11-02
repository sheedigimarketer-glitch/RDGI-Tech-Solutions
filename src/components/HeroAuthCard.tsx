import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const HeroAuthCard: React.FC = () => {
  const { user, anonymousAuth, navigate, signOut, isTa } = useApp();

  const [mode, setMode] = useState<'register' | 'signin'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = username.trim();
    if (!clean) {
      setError(isTa ? 'தயவுசெய்து புனைப்பெயரை உள்ளிடவும்.' : 'Please enter an anonymous username or handle.');
      return;
    }
    if (clean.length < 3) {
      setError(isTa ? 'குறைந்தது 3 எழுத்துக்கள் தேவை.' : 'Handle must be at least 3 characters (e.g. Maya_92).');
      return;
    }

    if (password && password.length < 6) {
      setError(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await anonymousAuth({
        username: clean,
        password: password.trim(),
        mode
      });
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return (
      <div className="hero-auth-card w-full max-w-[380px] rounded-2xl backdrop-blur-xl bg-white/80 border border-white/40 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#5E2750]">
            Confidential Sanctuary Active
          </span>
          <button
            type="button"
            onClick={signOut}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 underline cursor-pointer min-h-[32px] px-1"
          >
            Sign Out
          </button>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
          Welcome, @{user.username || (user.fullName ? user.fullName.split(' ')[0] : 'Member')}
        </h2>

        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Your private HerSpace sanctuary is ready whenever you need support.
        </p>

        <button
          type="button"
          onClick={() => navigate('space')}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer flex items-center justify-center"
        >
          Enter Safe Space →
        </button>

        <div className="text-xs text-slate-500 text-center mt-3">
          100% Anonymous & Confidential · 18+
        </div>
      </div>
    );
  }

  return (
    <div className="hero-auth-card w-full max-w-[380px] rounded-2xl backdrop-blur-xl bg-white/80 border border-white/40 p-6 shadow-sm">
      {/* Header Inside Card */}
      <div className="text-left mb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
          HerSpace
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          A Safe, Confidential Space For Every Woman
        </p>
      </div>

      {/* Apple HIG Segmented Control: [ Register ] | [ Sign In ] */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/5 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
          }}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'signin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-50/90 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs font-medium mb-3 flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {/* Username / Anonymous Handle Input */}
        <div>
          <label
            htmlFor="heroUsername"
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Username / Anonymous Handle
          </label>
          <input
            id="heroUsername"
            type="text"
            required
            value={username}
            onChange={e => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Choose an anonymous handle, e.g., Maya_92"
            className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-300/80 bg-white/95 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5E2750] focus:ring-2 focus:ring-[#5E2750]/15 transition-colors"
          />
        </div>

        {/* Password Input with 44x44pt Eye Visibility Toggle */}
        <div>
          <label
            htmlFor="heroPassword"
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="heroPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter password"
              className="w-full min-h-[44px] pl-3.5 pr-11 py-2 text-sm rounded-xl border border-slate-300/80 bg-white/95 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5E2750] focus:ring-2 focus:ring-[#5E2750]/15 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-0 w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer rounded-r-xl"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Primary Action Button (#5E2750) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[44px] mt-1 px-4 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] disabled:opacity-70 text-white text-sm font-semibold transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
        >
          {isSubmitting ? 'Securing Session...' : 'Enter Safe Space →'}
        </button>
      </form>

      {/* Reassuring Privacy Label */}
      <div className="text-xs text-slate-500 text-center mt-3">
        100% Anonymous & Confidential · 18+
      </div>
    </div>
  );
};
