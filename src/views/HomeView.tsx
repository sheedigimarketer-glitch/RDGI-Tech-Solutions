import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';
import { HeroAuthCard } from '../components/HeroAuthCard';
import { HowItWorksModal } from '../components/HowItWorksModal';

export const HomeView: React.FC = () => {
  const {
    t,
    user,
    navigate,
    setIsCrisisModalOpen
  } = useApp();

  const [isHowModalOpen, setIsHowModalOpen] = useState(false);

  return (
    <div className="home-portal-view" style={{ width: '100%', overflow: 'hidden' }}>
      {/* 1. SERENE FIXED-VIEWPORT HERO GATEWAY (85vh on Desktop) */}
      <section
        className="hero-portal-section"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#FDFBF7'
        }}
      >
        {/* Background Scenic Photographic Canvas: Meditating Woman Prominent on Right Side */}
        <img
          src={HERSPACE_CONFIG.images.heroSunrise}
          alt={t('heroBannerAlt')}
          className="hero-portal-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Delicate Atmospheric Ambient Gradient over Open Sky for Optimal Contrast */}
        <div
          className="hero-portal-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(253, 251, 247, 0.5) 0%, rgba(253, 251, 247, 0.2) 48%, rgba(253, 251, 247, 0) 80%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Foreground Content: Auth in the Open Sky Area (Left / Center-Left) */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(24px, 4vh, 48px)',
            paddingBottom: 'clamp(24px, 4vh, 48px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '85vh'
          }}
        >
          <div
            className="hero-sky-panel"
            style={{
              width: '100%',
              maxWidth: '390px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* The Frosted Glass Auth Card */}
            <HeroAuthCard />

            {/* Compact Quick-Action Pills directly beneath */}
            <div
              className="quick-action-pills-row"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <button
                type="button"
                className="quick-pill-btn"
                onClick={() => setIsCrisisModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#991B1B',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🆘 Need Urgent Help?</span>
              </button>

              <button
                type="button"
                className="quick-pill-btn"
                onClick={() => navigate('singers')}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(94, 39, 80, 0.2)',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#5E2750',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🎵 Explore Melodies</span>
              </button>

              <button
                type="button"
                className="quick-pill-btn"
                onClick={() => navigate('support')}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(94, 39, 80, 0.2)',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#5E2750',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🩺 View Care Directory</span>
              </button>
            </div>

            {/* Subtle "How It Works" Trigger */}
            <div style={{ textAlign: 'left', paddingLeft: '4px' }}>
              <button
                type="button"
                onClick={() => setIsHowModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4A3245',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px'
                }}
              >
                <span>How HerSpace Works</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal for "How HerSpace Works" (Off Home Feed) */}
      <HowItWorksModal
        isOpen={isHowModalOpen}
        onClose={() => setIsHowModalOpen(false)}
      />
    </div>
  );
};
