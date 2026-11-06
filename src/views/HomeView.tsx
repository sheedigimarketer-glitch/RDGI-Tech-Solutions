import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';
import { HeroAuthCard } from '../components/HeroAuthCard';

export const HomeView: React.FC = () => {
  const { t, isTa, navigate } = useApp();

  return (
    <div className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)] w-full bg-[#FAF7F5] flex flex-col font-sans antialiased text-slate-900 pb-20 lg:pb-6">
      {/* MAIN SPLIT-SCREEN CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full p-6 lg:p-12 gap-8 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: App Description & Visitor Value Proposition */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5E2750]/10 text-[#5E2750] text-xs font-semibold w-fit">
            {isTa ? 'HerSpace-க்கு வரவேற்கிறோம் · RDGI Tech' : 'Welcome to HerSpace · RDGI Tech'}
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900">
            {isTa
              ? 'ஒவ்வொரு பெண்ணிற்கும் பாதுகாப்பான, இரகசியமான புகலிடம்'
              : 'A Safe, Confidential Space For Every Woman'}
          </h1>

          <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
            {isTa
              ? 'பயிற்சி பெற்ற கவனிப்பாளர்கள், சான்றளிக்கப்பட்ட ஆலோசகர்கள், நேரடி இசை மற்றும் தனிப்பட்ட நாட்குறிப்பு மூலம் பெண்களின் மனநலனைப் பாதுகாக்கும் 100% இரகசியமான தளம்.'
              : 'Discover how our platform simplifies confidential emotional support, trained peer listening, certified counselling, and calming live melodies — designed to help women navigate wellbeing effortlessly.'}
          </p>

          {/* Feature Highlights */}
          <ul className="space-y-3 pt-2 text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#5E2750] shrink-0"></span>
              <span>
                {isTa
                  ? '100% இரகசியமான & அடையாளம் மறைக்கப்பட்ட பாதுகாப்பு (18+)'
                  : '100% anonymous, role-based confidential authentication (18+)'}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#5E2750] shrink-0"></span>
              <span>
                {isTa
                  ? 'பயிற்சி பெற்ற கவனிப்பாளர்கள், ஆலோசகர்கள் & நேரடி இசை'
                  : 'Instant access to Trained Listeners, Counsellors & Live Melodies'}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#5E2750] shrink-0"></span>
              <span>
                {isTa
                  ? '7-நாள் இலவச சோதனை (₹0) + 1 இலவச 30-நிமிட அமர்வு'
                  : '7-Day Free Trial (₹0) + 1 complimentary 30-min Listener session'}
              </span>
            </li>
          </ul>

          {/* Quick Visitor Exploration Links */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => navigate('support')}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#5E2750] hover:text-[#5E2750] transition-colors cursor-pointer shadow-xs"
            >
              {isTa ? 'கவனிப்பாளர்கள் & ஆலோசகர்கள் →' : 'Explore Listeners & Counsellors →'}
            </button>
            <button
              type="button"
              onClick={() => navigate('singers')}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#5E2750] hover:text-[#5E2750] transition-colors cursor-pointer shadow-xs"
            >
              {isTa ? 'நேரடி இசை →' : 'Live Melodies →'}
            </button>
            <button
              type="button"
              onClick={() => navigate('pricing')}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#5E2750] hover:text-[#5E2750] transition-colors cursor-pointer shadow-xs"
            >
              {isTa ? 'உறுப்பினர் திட்டங்கள் →' : '7-Day Free Trial Plans →'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Fully Visible Lady Image + Login Form Below */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto lg:max-w-none">
          
          {/* Lady Image Container (Uncropped / Fully Visible) */}
          <div className="w-full flex justify-center bg-white/80 rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <img
              src={HERSPACE_CONFIG.images.heroSunrise}
              srcSet="/hero-1x.jpg 1x, /hero.jpg 2x"
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt={t('heroBannerAlt')}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full max-h-[320px] object-contain rounded-xl drop-shadow-md"
            />
          </div>

          {/* Login / Register Card Positioned Directly Below the Image */}
          <HeroAuthCard />

        </div>

      </div>
    </div>
  );
};

