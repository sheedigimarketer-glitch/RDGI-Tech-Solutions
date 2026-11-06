import React from 'react';
import { useApp } from './context/AppContext';
import { CrisisBanner } from './components/CrisisBanner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileDrawer } from './components/MobileDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { BookingModal } from './components/BookingModal';
import { ExpertProfileModal } from './components/ExpertProfileModal';
import { MaskedCallModal } from './components/MaskedCallModal';
import { ProApplyModal } from './components/ProApplyModal';
import { PolicyModal } from './components/PolicyModal';

import { HomeView } from './views/HomeView';
import { SupportView } from './views/SupportView';
import { WellbeingView } from './views/WellbeingView';
import { CycleView } from './views/CycleView';
import { CalmView } from './views/CalmView';
import { SingersView } from './views/SingersView';
import { DashboardView } from './views/DashboardView';
import { PersonalSpaceView } from './views/PersonalSpaceView';
import { PricingView } from './views/PricingView';
import { ContactView } from './views/ContactView';
import {
  RegisterView,
  TourView,
  MembershipView,
  BookStepView,
  SigninView
} from './views/OnboardingViews';
import { AdminPortal } from './views/AdminPortal';

export const App: React.FC = () => {
  const { activeRoute, navigate, lang, toggleLanguage, isMaintenanceMode, setIsMaintenanceMode } = useApp();

  if (/^\/admin(?:\/|$)/.test(window.location.pathname)) return <AdminPortal />;

  const isOnboardingRoute = [
    'onb-register',
    'onb-tour',
    'onb-membership',
    'onb-book',
    'signin'
  ].includes(activeRoute);

  const getStepNumber = () => {
    switch (activeRoute) {
      case 'onb-register': return 1;
      case 'onb-tour': return 2;
      case 'onb-membership': return 3;
      case 'onb-book': return 4;
      default: return 0;
    }
  };

  const renderMainView = () => {
    switch (activeRoute) {
      case 'onb-register':
        return <RegisterView />;
      case 'onb-tour':
        return <TourView />;
      case 'onb-membership':
        return <MembershipView />;
      case 'onb-book':
        return <BookStepView />;
      case 'signin':
        return <SigninView />;
      case 'space':
        return <PersonalSpaceView />;
      case 'support':
        return <SupportView />;
      case 'wellbeing':
        return <WellbeingView />;
      case 'cycle':
        return <CycleView />;
      case 'calm':
        return <CalmView />;
      case 'singers':
        return <SingersView />;
      case 'pricing':
      case 'plans':
      case 'how':
        return <PricingView />;
      case 'contact':
        return <ContactView />;
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
        return <AdminPortal />;
      case 'policies':
      case 'home':
      default:
        return <HomeView />;
    }
  };

  // Full-screen serene banner if Emergency Maintenance Mode is active
  if (isMaintenanceMode && activeRoute !== 'admin') {
    return (
      <div id="app" style={{ minHeight: '100vh', background: '#FDFBF7', color: '#2C2420', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 16px' }}>
        <div style={{ maxWidth: '580px', margin: 'auto', textAlign: 'center', padding: '40px 24px', background: '#ffffff', borderRadius: '24px', border: '0.5px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 12px 36px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(94, 39, 80, 0.08)', color: '#5E2750', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#2C2420', margin: '0 0 12px' }}>
            Scheduled System Maintenance
          </h1>
          <p style={{ fontSize: '0.96rem', color: '#6B5E55', lineHeight: 1.6, margin: '0 0 24px' }}>
            HerSpace is briefly undergoing scheduled maintenance. For immediate mental health support or crisis intervention, please contact the 24/7 Helpline: 112.
          </p>

          <div style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)', textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#DC2626', marginBottom: '6px' }}>
              Immediate Mental Health & Crisis Support
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4A3E39', lineHeight: 1.5, margin: '0 0 10px' }}>
              If you or someone you know requires urgent assistance or crisis intervention, please reach out directly:
            </p>
            <a
              href="tel:112"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 700, color: '#DC2626', textDecoration: 'none' }}
            >
              📞 112 (Toll-Free, 24/7 All-India)
            </a>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsMaintenanceMode(false)}
              style={{
                background: '#5E2750',
                color: '#ffffff',
                border: 'none',
                padding: '11px 22px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(94, 39, 80, 0.25)',
                transition: 'transform 120ms ease'
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Dismiss & Enter HerSpace Preview →
            </button>
            <button
              onClick={() => navigate('admin')}
              style={{
                background: 'none',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                color: '#4A3E39',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.86rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Staff Governance Portal
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#A0938A', padding: '16px' }}>
          HerSpace Secure Infrastructure · 256-Bit Masked Telephony
        </div>
        <ToastContainer />
      </div>
    );
  }

  const isHomeRoute = activeRoute === 'home' || !activeRoute;

  return (
    <div id="app">
      {/* Top Crisis Banner & Modal (Banner hidden on single-screen Home view since Header has Helpline shortcut; Modal always mounted) */}
      <CrisisBanner hideBannerBar={isHomeRoute} />

      {isOnboardingRoute ? (
        <>
          <header className="onb-header">
            <div className="container onb-header-inner">
              <a
                className="onb-logo"
                href="#home"
                onClick={e => {
                  e.preventDefault();
                  navigate('home');
                }}
              >
                <img src="/logo.png" alt="HerSpace" />
              </a>

              {getStepNumber() > 0 && (
                <div className="onb-progress">
                  <div className="onb-progress-label">Step {getStepNumber()} of 4</div>
                  <div className="onb-progress-track">
                    <span style={{ width: `${(getStepNumber() / 4) * 100}%` }}></span>
                  </div>
                </div>
              )}

              <button
                className="lang-toggle-btn"
                onClick={toggleLanguage}
                aria-label="Switch Language"
              >
                <span>{lang === 'en' ? 'தமிழ்' : 'EN'}</span>
              </button>
            </div>
          </header>

          <main id="main-content" className="onb-main">
            {renderMainView()}
          </main>
        </>
      ) : (
        <>
          <Header />
          <main id="main-content">
            {renderMainView()}
          </main>
          {!isHomeRoute && <Footer />}
          <MobileBottomNav />
        </>
      )}

      {/* Global Modals & Notifications */}
      <BookingModal />
      <ExpertProfileModal />
      <MaskedCallModal />
      <ProApplyModal />
      <PolicyModal />
      <MobileDrawer />
      <ToastContainer />
    </div>
  );
};
