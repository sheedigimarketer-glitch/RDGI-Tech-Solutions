import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';
import { HeroAuthCard } from '../components/HeroAuthCard';

export const HomeView: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="home-portal-view relative w-full h-[calc(100dvh-64px)] md:h-[calc(100dvh-72px)] overflow-hidden flex flex-col bg-[#FAF7F5]">
      <section className="hero-portal-section relative w-full flex-1 h-full flex items-center overflow-hidden bg-[#FAF7F5]">
        {/* Scenic Meditation Photograph: High-DPI Crisp Rendering with Woman Prominently on the Right */}
        <img
          src={HERSPACE_CONFIG.images.heroSunrise}
          srcSet="/hero-1x.jpg 1x, /hero.jpg 2x"
          sizes="100vw"
          alt={t('heroBannerAlt')}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="hero-portal-bg absolute inset-0 w-full h-full object-cover object-[82%_center] z-[1] pointer-events-none select-none"
        />

        {/* Localized Left Sky Scrim — Preserves 100% Photographic Clarity on the Subject */}
        <div
          className="hero-portal-vignette absolute inset-0 z-[2] pointer-events-none"
        />

        {/* Sky Section Registration/Login (Left / Upper-Middle Area) */}
        <div className="container relative z-[3] w-full px-4 pb-16 md:pb-6 flex flex-col justify-center">
          <div className="hero-sky-panel w-full max-w-[380px] flex flex-col">
            <HeroAuthCard />
          </div>
        </div>
      </section>
    </div>
  );
};
