import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { user, activeRoute, navigate } = useApp();

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
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  );

  const plansIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
  );

  const spaceIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary Mobile Navigation">
      {/* 1. Home Tab */}
      <button
        className={`bottom-nav-item ${activeRoute === 'home' ? 'active' : ''}`}
        onClick={() => navigate('home')}
      >
        <span className="nav-svg-icon">{homeIcon}</span>
        <span>Home</span>
      </button>

      {/* 2. Support Tab (Care Directory) */}
      <button
        className={`bottom-nav-item ${activeRoute === 'support' ? 'active' : ''}`}
        onClick={() => navigate('support')}
      >
        <span className="nav-svg-icon">{supportIcon}</span>
        <span>Support</span>
      </button>

      {/* 3. Melodies Tab */}
      <button
        className={`bottom-nav-item ${activeRoute === 'singers' || activeRoute === 'calm' ? 'active' : ''}`}
        onClick={() => navigate('singers')}
      >
        <span className="nav-svg-icon">{melodiesIcon}</span>
        <span>Melodies</span>
      </button>

      {/* 4. Plans Tab */}
      <button
        className={`bottom-nav-item ${activeRoute === 'pricing' ? 'active' : ''}`}
        onClick={() => navigate('pricing')}
      >
        <span className="nav-svg-icon">{plansIcon}</span>
        <span>Plans</span>
      </button>

      {/* 5. My Space Tab */}
      <button
        className={`bottom-nav-item ${activeRoute === 'space' || activeRoute === 'dashboard' || activeRoute === 'cycle' ? 'active' : ''}`}
        onClick={() => navigate(user ? 'space' : 'onb-register')}
      >
        <span className="nav-svg-icon">{spaceIcon}</span>
        <span>My Space</span>
      </button>
    </nav>
  );
};
