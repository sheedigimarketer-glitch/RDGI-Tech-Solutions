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

  // If already authenticated, show welcoming active session state
  if (user) {
    return (
      <div
        className="hero-auth-card"
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '28px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          width: '100%',
          maxWidth: '380px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Safe Space Active
          </span>
        </div>

        <h2 style={{ fontWeight: 700, color: '#3b1d36', fontSize: '24px', margin: '0 0 4px 0', lineHeight: 1.2 }}>
          HerSpace
        </h2>
        <div style={{ fontSize: '17px', fontWeight: 600, color: '#5E2750', marginBottom: '14px' }}>
          @{user.username || (user.fullName ? user.fullName.split(' ')[0] : 'Member')}
        </div>

        <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
          Your anonymous session is active and secure. Trained listeners and calming melodies are ready for you.
        </p>

        <button
          type="button"
          onClick={() => navigate('space')}
          style={{
            background: '#5E2750',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.12s cubic-bezier(0.2, 0, 0, 1)',
            marginBottom: '10px',
            boxShadow: '0 4px 14px rgba(94, 39, 80, 0.25)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Enter Safe Space →
        </button>

        <button
          type="button"
          onClick={() => navigate('support')}
          style={{
            background: 'transparent',
            color: '#5E2750',
            padding: '10px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '13px',
            width: '100%',
            border: '1px solid rgba(94, 39, 80, 0.25)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginBottom: '14px'
          }}
        >
          View Care Directory
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={signOut}
            style={{
              background: 'none',
              border: 'none',
              color: '#777',
              fontSize: '12px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Switch Account / Sign Out
          </button>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#777',
            textAlign: 'center',
            marginTop: '14px',
            letterSpacing: '-0.01em',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '10px'
          }}
        >
          100% Anonymous & Confidential • 18+ Only
        </div>
      </div>
    );
  }

  return (
    <div
      className="hero-auth-card"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '28px 24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        width: '100%',
        maxWidth: '380px',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Inside Card */}
      <div style={{ textAlign: 'left', marginBottom: '18px' }}>
        <h2
          style={{
            fontWeight: 700,
            color: '#3b1d36',
            fontSize: '26px',
            margin: '0 0 4px 0',
            lineHeight: 1.15,
            letterSpacing: '-0.02em'
          }}
        >
          HerSpace
        </h2>
        <p
          style={{
            color: '#666',
            fontSize: '13px',
            margin: 0,
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          A Safe, Confidential Space For Every Woman
        </p>
      </div>

      {/* Clean Tab Toggle: [ Register ] | [ Sign In ] */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(94, 39, 80, 0.08)',
          borderRadius: '9999px',
          padding: '3px',
          marginBottom: '18px'
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: '9999px',
            background: mode === 'register' ? '#FFFFFF' : 'transparent',
            color: mode === 'register' ? '#3b1d36' : '#777',
            fontWeight: mode === 'register' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: mode === 'register' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: '9999px',
            background: mode === 'signin' ? '#FFFFFF' : 'transparent',
            color: mode === 'signin' ? '#3b1d36' : '#777',
            fontWeight: mode === 'signin' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: mode === 'signin' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          Sign In
        </button>
      </div>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Username / Handle Input */}
        <div style={{ marginBottom: '14px' }}>
          <label
            htmlFor="heroUsername"
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#4B364A',
              marginBottom: '5px'
            }}
          >
            Username / Handle
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
            style={{
              width: '100%',
              padding: '11px 14px',
              fontSize: '13px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.14)',
              background: '#FFFFFF',
              color: '#1F2937',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s, box-shadow 0.15s'
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#5E2750';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(94, 39, 80, 0.12)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.14)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Password Input with Eye Visibility Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="heroPassword"
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#4B364A',
              marginBottom: '5px'
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="heroPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '11px 38px 11px 14px',
                fontSize: '13px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.14)',
                background: '#FFFFFF',
                color: '#1F2937',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#5E2750';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(94, 39, 80, 0.12)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.14)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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

        {/* Primary Action Button (Mauve #5E2750) */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: '#5E2750',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            width: '100%',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.8 : 1,
            transition: 'opacity 0.2s, transform 0.12s cubic-bezier(0.2, 0, 0, 1)',
            boxShadow: '0 4px 14px rgba(94, 39, 80, 0.28)'
          }}
          onMouseDown={e => { if (!isSubmitting) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { if (!isSubmitting) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isSubmitting ? 'Securing Session...' : 'Enter Safe Space →'}
        </button>
      </form>

      {/* Micro-tag */}
      <div
        style={{
          fontSize: '11px',
          color: '#777',
          textAlign: 'center',
          marginTop: '14px',
          letterSpacing: '-0.01em',
          lineHeight: 1.4
        }}
      >
        100% Anonymous & Confidential • 18+ Only
      </div>
    </div>
  );
};
