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
    setIsCrisisModalOpen,
    signOut
  } = useApp();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const notifCount = notifications.filter(n => !n.read).length;
  const isMember = Boolean(user && (onboarding.completed || user.isAuthenticated));

  return (
    <header className="app-header h-16 md:h-18 px-4 flex items-center justify-between">
      <div className="container header-inner flex items-center justify-between">
        <a
          className="brand-logo flex items-center shrink-0"
          href="#home"
          onClick={e => {
            e.preventDefault();
            navigate('home');
          }}
        >
          <img
            src="/logo.png"
            alt="HerSpace Logo"
            className="h-11 md:h-13 w-auto object-contain"
            style={{
              height: '48px',
              maxHeight: '52px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
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

        <div className="nav-actions flex items-center gap-2.5 shrink-0">
          {/* Dongle / Theme / Mode Switcher */}
          <button
            id="dongle-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle Mode"
            className="px-3 py-1.5 min-h-[38px] text-xs font-medium border border-slate-300 bg-white text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>{lang === 'en' ? 'தமிழ்' : 'Toggle · EN'}</span>
          </button>

          {/* Top Line Sign Up Button (Always Visible when signed out) */}
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate('space')}
                className="px-4 py-2 min-h-[38px] text-xs sm:text-sm font-semibold bg-[#5E2750] text-white rounded-full shadow-sm hover:bg-[#4c1f40] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                @{user.username || (user.fullName ? user.fullName.split(' ')[0] : 'Member')}
              </button>
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn btn-sm btn-outline btn-desktop-only min-h-[38px] rounded-full text-xs"
              >
                {t('navSignOut')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('onb-register')}
              className="px-4 py-2 min-h-[38px] text-xs sm:text-sm font-semibold bg-[#5E2750] text-white rounded-full shadow-sm hover:bg-[#4c1f40] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {lang === 'en' ? 'Sign Up' : 'பதிவு செய்க'}
            </button>
          )}

          {/* Crisis Helpline Shortcut */}
          <button
            type="button"
            onClick={() => setIsCrisisModalOpen(true)}
            aria-label="24/7 Crisis Helpline"
            title="24/7 Crisis Helpline"
            className="hidden sm:inline-flex min-h-[38px] px-3 py-1.5 rounded-full border border-red-200 bg-red-50/90 hover:bg-red-100/80 text-red-700 text-xs font-semibold items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{lang === 'en' ? 'Helpline' : 'உதவி எண்'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn w-10 h-10 rounded-xl"
            aria-label="Open navigation menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22">
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
