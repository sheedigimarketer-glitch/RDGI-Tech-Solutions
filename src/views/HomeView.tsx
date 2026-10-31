import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';
import { HeroAuthCard } from '../components/HeroAuthCard';

export const HomeView: React.FC = () => {
  const { t } = useApp();

  return (
    <div
      className="home-portal-view"
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* SINGLE-SCREEN FULL VIEWPORT HERO GATEWAY */}
      <section
        className="hero-portal-section"
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#FDFBF7'
        }}
      >
        {/* Scenic Meditation Photograph: Woman Positioned Prominently & Clearly Visible on the Right */}
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
            objectPosition: '82% center',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Subtle Atmospheric Sky Gradient on Left for Frosted Card Legibility */}
        <div
          className="hero-portal-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(253, 251, 247, 0.42) 0%, rgba(253, 251, 247, 0.16) 44%, rgba(253, 251, 247, 0) 75%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Sky Section Registration/Login (Left / Upper-Middle Area) */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: '20px',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <div
            className="hero-sky-panel"
            style={{
              width: '100%',
              maxWidth: '370px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <HeroAuthCard />
          </div>
        </div>
      </section>
    </div>
  );
};
