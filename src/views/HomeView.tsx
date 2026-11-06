import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

export const HomeView: React.FC = () => {
  const { t, isTa, user, navigate } = useApp();

  return (
    <div className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)] w-full bg-[#FAF7F5] flex flex-col font-sans antialiased text-slate-900 pb-20 md:pb-10">
      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col items-center justify-center">
        
        {/* 2. NEXT: App Description Section */}
        <section className="w-full text-center max-w-2xl mx-auto mb-8 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#5E2750]/10 text-[#5E2750] text-xs font-semibold tracking-wide">
            {isTa ? '100% இரகசியமான பெண்கள் நலத் தளம் · 18+' : 'Platform Overview · 100% Anonymous & Confidential'}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
            {isTa
              ? 'HerSpace பெண்கள் மனநல மற்றும் ஆதரவுத் தளத்திற்கு வரவேற்கிறோம்'
              : 'Welcome to HerSpace Peer Support Platform'}
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {isTa
              ? 'பயிற்சி பெற்ற கவனிப்பாளர்கள், சான்றளிக்கப்பட்ட ஆலோசகர்கள் மற்றும் நேரடி இசை மூலம் பெண்களின் மனநலனைப் பாதுகாக்கும் 100% இரகசியமான மற்றும் பாதுகாப்பான தளம்.'
              : 'Connect, heal, and access confidential peer-driven support, certified counsellors, and calming live melodies in a safe digital sanctuary designed to help every woman thrive.'}
          </p>
        </section>

        {/* 3. THEN: Photo + Three Buttons Stack */}
        <section className="w-full max-w-md flex flex-col items-center space-y-6">
          
          {/* Lady Photo (Full View, No Cropping) */}
          <div className="w-full flex justify-center bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <img
              src={HERSPACE_CONFIG.images.heroSunrise}
              srcSet="/hero-1x.jpg 1x, /hero.jpg 2x"
              sizes="(max-width: 768px) 100vw, 448px"
              alt={t('heroBannerAlt')}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full max-h-[300px] object-contain rounded-xl"
            />
          </div>

          {/* Three Buttons Below Photo */}
          <div className="w-full flex flex-col gap-3">
            {/* Button 1: Sign In (or Enter Safe Space if already signed in) */}
            <button
              type="button"
              onClick={() => navigate(user ? 'space' : 'signin')}
              className="w-full min-h-[46px] py-3 px-4 bg-[#5E2750] text-white font-semibold text-sm rounded-xl shadow hover:bg-[#4c1f40] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
              {user
                ? isTa
                  ? 'எனது பாதுகாப்பான இடத்திற்குச் செல்லவும் →'
                  : 'Enter My Safe Space →'
                : isTa
                ? 'உள்நுழைய (Sign In)'
                : 'Sign In'}
            </button>

            {/* Button 2: Explore Community / Listeners & Counsellors */}
            <button
              type="button"
              onClick={() => navigate('support')}
              className="w-full min-h-[46px] py-3 px-4 bg-white text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
              {isTa ? 'கவனிப்பாளர்கள் & சமூகத்தை ஆராயுங்கள்' : 'Explore Community'}
            </button>

            {/* Button 3: Contact Support / Help */}
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="w-full min-h-[46px] py-3 px-4 bg-[#5E2750]/10 text-[#5E2750] font-semibold text-sm rounded-xl border border-[#5E2750]/20 hover:bg-[#5E2750]/15 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
              {isTa ? 'ஆதரவு மற்றும் உதவி (Contact Support / Help)' : 'Contact Support / Help'}
            </button>
          </div>

        </section>

      </div>
    </div>
  );
};


