import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    t,
    lang,
    toggleLanguage,
    user,
    onboarding,
    activeRoute,
    navigate,
    notifications,
    setIsDrawerOpen,
    setIsProModalOpen,
    signOut
  } = useApp();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const notifCount = notifications.filter(n => !n.read).length;
  const isMember = Boolean(user && (onboarding.completed || user.isAuthenticated));

  return (
    <header className="app-header">
      <div className="container header-inner">
        <a
          className="brand-logo"
          href="#home"
          onClick={e => {
            e.preventDefault();
            navigate('home');
          }}
        >
          <img src="assets/herspace-client-logo.webp" alt="HerSpace Logo" />
        </a>

        {isMember ? (
          <nav className="desktop-nav" aria-label="Main Navigation">
            <button
              className={`nav-item ${activeRoute === 'home' ? 'active' : ''}`}
              onClick={() => navigate('home')}
            >
              {t('navHome')}
            </button>
            <button
              className={`nav-item ${activeRoute === 'support' ? 'active' : ''}`}
              onClick={() => navigate('support')}
            >
              {t('navSupport')}
            </button>
            <button
              className={`nav-item ${activeRoute === 'singers' ? 'active' : ''}`}
              onClick={() => navigate('singers')}
            >
              Melodies
            </button>
            <button
              className={`nav-item ${activeRoute === 'pricing' ? 'active' : ''}`}
              onClick={() => navigate('pricing')}
            >
              Plans
            </button>
            <button
              className={`nav-item ${activeRoute === 'space' ? 'active' : ''}`}
              onClick={() => navigate('space')}
            >
              My Space
            </button>

            <div className={`nav-dropdown ${isMoreOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="nav-item nav-dropdown-trigger"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                <span>{t('navMore')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="nav-dropdown-menu" role="menu">
                <button
                  className={`nav-dropdown-item ${activeRoute === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('dashboard');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navBookings')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'wellbeing' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('wellbeing');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navWellbeing')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'calm' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('calm');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navCalm')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'cycle' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('cycle');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navMyCycle')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'contact' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('contact');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>Support & Contact</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'how' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('how');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>How It Works & FAQs</span>
                </button>
              </div>
            </div>
          </nav>
        ) : (
          <nav className="desktop-nav" aria-label="Main Navigation">
            <button
              className={`nav-item ${activeRoute === 'home' ? 'active' : ''}`}
              onClick={() => navigate('home')}
            >
              {t('navHome')}
            </button>
            <button
              className={`nav-item ${activeRoute === 'support' ? 'active' : ''}`}
              onClick={() => navigate('support')}
            >
              {t('navSupport')}
            </button>
            <button
              className={`nav-item ${activeRoute === 'singers' ? 'active' : ''}`}
              onClick={() => navigate('singers')}
            >
              Melodies
            </button>
            <button
              className={`nav-item ${activeRoute === 'pricing' ? 'active' : ''}`}
              onClick={() => navigate('pricing')}
            >
              Plans
            </button>
            <button
              className={`nav-item ${activeRoute === 'space' ? 'active' : ''}`}
              onClick={() => navigate(user ? 'space' : 'onb-register')}
            >
              My Space
            </button>

            <div className={`nav-dropdown ${isMoreOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="nav-item nav-dropdown-trigger"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                <span>{t('navMore')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="nav-dropdown-menu" role="menu">
                <button
                  className={`nav-dropdown-item ${activeRoute === 'calm' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('calm');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navCalm')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'cycle' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('cycle');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navMyCycle')}</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'contact' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('contact');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>Support & Contact</span>
                </button>
                <button
                  className={`nav-dropdown-item ${activeRoute === 'how' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('how');
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('navFAQs')}</span>
                </button>
                <button
                  className="nav-dropdown-item"
                  onClick={() => {
                    setIsProModalOpen(true);
                    setIsMoreOpen(false);
                  }}
                >
                  <span>{t('drawerJoinProfessional')}</span>
                </button>
              </div>
            </div>
          </nav>
        )}

        <div className="nav-actions">
          {/* Notification Bell */}
          <button
            className="header-icon-btn"
            onClick={() => navigate('dashboard')}
            aria-label={t('navNotifications')}
            title={t('navNotifications')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </button>

          {/* Language Switcher */}
          <button
            className="lang-toggle-btn"
            id="headerLangSwitchBtn"
            onClick={toggleLanguage}
            aria-label="Switch Language"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>{lang === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>

          {user ? (
            <>
              <button
                className="btn btn-sm btn-secondary btn-desktop-only"
                onClick={() => navigate('space')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'rgba(94, 39, 80, 0.08)',
                  borderColor: 'rgba(94, 39, 80, 0.22)',
                  color: '#5E2750',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '6px 14px'
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                <span>@{user.username || (user.fullName ? user.fullName.split(' ')[0] : 'Member')}</span>
              </button>
              <button className="btn btn-sm btn-outline btn-desktop-only" onClick={signOut}>
                {t('navSignOut')}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-ghost btn-desktop-only"
                onClick={() => navigate('signin')}
              >
                <span>{t('btnSignInShort')}</span>
              </button>
              <button
                className="btn btn-sm btn-primary btn-desktop-only"
                onClick={() => navigate('onb-register')}
              >
                <span>Create Account</span>
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
