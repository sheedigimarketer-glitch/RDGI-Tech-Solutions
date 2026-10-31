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
import {
  RegisterView,
  TourView,
  MembershipView,
  BookStepView,
  SigninView
} from './views/OnboardingViews';
import { AdminView } from './views/AdminView';

export const App: React.FC = () => {
  const { activeRoute, navigate, lang, toggleLanguage } = useApp();

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
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
        return <AdminView />;
      case 'how':
      case 'pricing':
      case 'policies':
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div id="app">
      {/* Top Crisis Notification Banner */}
      <CrisisBanner />

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
                <img src="assets/herspace-client-logo.webp" alt="HerSpace" />
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
          <Footer />
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
