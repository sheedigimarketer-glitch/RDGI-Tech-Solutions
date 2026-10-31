import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileDrawer: React.FC = () => {
  const {
    t,
    lang,
    toggleLanguage,
    user,
    activeRoute,
    navigate,
    isDrawerOpen,
    setIsDrawerOpen,
    setIsCrisisModalOpen,
    setIsProModalOpen,
    signOut
  } = useApp();

  if (!isDrawerOpen) return null;

  const handleNav = (route: string) => {
    navigate(route);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div
        className="mobile-drawer-overlay open"
        onClick={() => setIsDrawerOpen(false)}
      ></div>
      <aside className="mobile-drawer open" aria-label="Mobile menu">
        <div className="drawer-header">
          <div>
            <img src="/logo.png" alt="HerSpace" style={{ height: '32px', width: 'auto' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {t('drawerSubTitle')}
            </div>
          </div>
          <button
            className="modal-close-btn"
            style={{ position: 'static' }}
            onClick={() => setIsDrawerOpen(false)}
            aria-label={t('btnClose')}
          >
            ✕
          </button>
        </div>

        {/* Language switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg-lavender)', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            {t('drawerLanguageTitle')}
          </span>
          <button className="btn btn-sm btn-secondary" onClick={toggleLanguage}>
            {lang === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>

        {user && (
          <nav className="drawer-links" style={{ marginBottom: '16px' }}>
            <button
              className={`drawer-link ${activeRoute === 'space' ? 'active' : ''}`}
              onClick={() => handleNav('space')}
            >
              <span>{t('spaceTitle')}</span>
            </button>
            <button
              className={`drawer-link ${activeRoute === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNav('dashboard')}
            >
              <span>{t('navBookings')}</span>
            </button>
          </nav>
        )}

        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          {t('drawerQuickFeatures')}
        </div>
        <nav className="drawer-links" style={{ marginBottom: '16px' }}>
          <button className={`drawer-link ${activeRoute === 'wellbeing' ? 'active' : ''}`} onClick={() => handleNav('wellbeing')}>
            <span>{t('navWellbeing')}</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'cycle' ? 'active' : ''}`} onClick={() => handleNav('cycle')}>
            <span>{t('navMyCycle')}</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'calm' ? 'active' : ''}`} onClick={() => handleNav('calm')}>
            <span>{t('navCalm')}</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'singers' ? 'active' : ''}`} onClick={() => handleNav('singers')}>
            <span>{t('navSingers')}</span>
          </button>
        </nav>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          {t('drawerSupportNavigation')}
        </div>
        <nav className="drawer-links" style={{ marginBottom: '16px' }}>
          <button className={`drawer-link ${activeRoute === 'home' ? 'active' : ''}`} onClick={() => handleNav('home')}>
            <span>{t('navHome')}</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'support' ? 'active' : ''}`} onClick={() => handleNav('support')}>
            <span>{t('navChooseSupport')}</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'pricing' ? 'active' : ''}`} onClick={() => handleNav('pricing')}>
            <span>{t('navPricing')} (₹)</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'contact' ? 'active' : ''}`} onClick={() => handleNav('contact')}>
            <span>Support & Contact</span>
          </button>
          <button className={`drawer-link ${activeRoute === 'how' ? 'active' : ''}`} onClick={() => handleNav('how')}>
            <span>{t('navFAQs')}</span>
          </button>
        </nav>

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <button className="btn btn-outline btn-sm btn-block" onClick={() => { setIsDrawerOpen(false); signOut(); }}>
              {t('navSignOut')}
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary btn-block"
                onClick={() => handleNav('onb-register')}
              >
                Create Account
              </button>
              <button className="btn btn-outline btn-sm btn-block" onClick={() => handleNav('signin')}>
                {t('btnSignInShort')}
              </button>
            </>
          )}

          <button
            className="btn btn-outline btn-sm btn-block"
            onClick={() => {
              setIsDrawerOpen(false);
              setIsProModalOpen(true);
            }}
          >
            {t('drawerJoinProfessional')}
          </button>
          <button
            className="btn btn-danger btn-sm btn-block"
            onClick={() => {
              setIsDrawerOpen(false);
              setIsCrisisModalOpen(true);
            }}
          >
            {t('drawerCrisisBtn')}
          </button>
        </div>
      </aside>
    </>
  );
};
