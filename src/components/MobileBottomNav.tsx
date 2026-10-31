import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { t, user, onboarding, activeRoute, navigate } = useApp();
  const isMember = user && onboarding.completed;

  // Icons SVG definitions
  const homeIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const supportIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const melodiesIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
  );

  const bookingsIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const spaceIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  );

  const membershipIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
  );

  const joinIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  );

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary Mobile Navigation">
      <button
        className={`bottom-nav-item ${activeRoute === 'home' || activeRoute === 'wellbeing' ? 'active' : ''}`}
        onClick={() => navigate('home')}
      >
        <span className="nav-svg-icon">{homeIcon}</span>
        <span>{t('navHome')}</span>
      </button>

      <button
        className={`bottom-nav-item ${activeRoute === 'support' ? 'active' : ''}`}
        onClick={() => navigate('support')}
      >
        <span className="nav-svg-icon">{supportIcon}</span>
        <span>{t('navSupport')}</span>
      </button>

      <button
        className={`bottom-nav-item ${activeRoute === 'singers' ? 'active' : ''}`}
        onClick={() => navigate('singers')}
      >
        <span className="nav-svg-icon">{melodiesIcon}</span>
        <span>{t('navMelodies')}</span>
      </button>

      {isMember ? (
        <>
          <button
            className={`bottom-nav-item ${activeRoute === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            <span className="nav-svg-icon">{bookingsIcon}</span>
            <span>{t('navBookings')}</span>
          </button>

          <button
            className={`bottom-nav-item ${activeRoute === 'space' || activeRoute === 'calm' || activeRoute === 'cycle' ? 'active' : ''}`}
            onClick={() => navigate('space')}
          >
            <span className="nav-svg-icon">{spaceIcon}</span>
            <span>{t('navSpace')}</span>
          </button>
        </>
      ) : (
        <>
          <button
            className={`bottom-nav-item ${activeRoute === 'pricing' ? 'active' : ''}`}
            onClick={() => navigate('pricing')}
          >
            <span className="nav-svg-icon">{membershipIcon}</span>
            <span>{t('navPlans')}</span>
          </button>

          <button
            className={`bottom-nav-item ${activeRoute === 'onb-register' || activeRoute === 'signin' ? 'active' : ''}`}
            onClick={() => navigate('onb-register')}
          >
            <span className="nav-svg-icon">{joinIcon}</span>
            <span>{t('navJoin')}</span>
          </button>
        </>
      )}
    </nav>
  );
};
