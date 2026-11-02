import React from 'react';
import { useApp } from '../context/AppContext';

export const SingersView: React.FC = () => {
  const {
    isTa,
    singers,
    setBookingModalExpert,
    playCalmTrack,
    pauseCalmTrack,
    calmState
  } = useApp();

  return (
    <div className="min-h-dvh bg-[#FAF7F5] text-slate-900 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold text-[#5E2750] mb-2">
            Vocal Therapy & Sound Sanctuary
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
            {isTa ? 'நேரலைப் பாடகர்கள் — அமைதி மெல்லிசை' : 'HerSpace Live Melodies'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {isTa
              ? 'தனிமை, தூக்கமின்மை அல்லது மனச்சோர்விலிருந்து விடுபட எண் மறைக்கப்பட்ட தொலைபேசி வழியே தாலாட்டு மற்றும் மெல்லிசைப் பாடும் கலைஞர்கள்.'
              : 'Scheduled private telephone vocal sessions to help women unwind from insomnia, grief, or restlessness—beginning at ₹99 for 15 minutes.'}
          </p>
        </div>

        {/* 2. Love Melody Spotlight Banner */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5E2750] mb-0.5">
                Featured Vocal Tier
              </p>
              <h2 className="text-base md:text-lg font-bold text-slate-900">
                Love Melody — 15 Mins · ₹99
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                A soothing 15-minute one-on-one telephone vocal comfort session designed to quiet racing thoughts and ease immediate anxiety.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBookingModalExpert(singers[0])}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Book Love Melody (₹99) →
          </button>
        </div>

        {/* 3. Singers Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {singers.map(s => {
            const displayName = isTa && s.nameTa ? s.nameTa : s.name;
            const displayRole = isTa && s.roleLabelTa ? s.roleLabelTa : s.roleLabelEn;
            const displayStyles = isTa && s.stylesTa ? s.stylesTa : s.stylesEn;
            const displayBio = isTa && s.bioTa ? s.bioTa : s.bioEn;
            const displaySlot = isTa && s.nextAvailableTa ? s.nextAvailableTa : s.nextAvailable;

            return (
              <article
                key={s.id}
                className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Singer Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#5E2750]/10 text-[#5E2750] font-bold text-lg flex items-center justify-center shrink-0">
                      {displayName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#5E2750] truncate">
                        {displayRole}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate mt-0.5">
                        {displayName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {isTa && s.qualificationTa ? s.qualificationTa : s.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {displayBio}
                  </p>

                  {/* Unboxed Vocal Styles */}
                  <div className="text-xs text-slate-500 leading-relaxed mb-4">
                    {displayStyles.join(' · ')}
                  </div>

                  {/* Available Melody Tiers (Hairline Dividers, Tabular Numerals) */}
                  <div className="border-t border-slate-200/70 pt-3 mb-4">
                    <div className="text-xs font-semibold text-slate-700 mb-2">
                      Available Melody Tiers
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs tabular-nums">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Love Melody · 15 mins</span>
                        <span className="font-semibold text-slate-900">₹99</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Soothing Lullaby · 20 mins</span>
                        <span className="font-semibold text-slate-900">₹149</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Deep Calm Raga · 30 mins</span>
                        <span className="font-semibold text-slate-900">₹199</span>
                      </div>
                    </div>
                  </div>

                  {/* Unboxed Metadata */}
                  <div className="border-t border-slate-200/70 pt-3 mb-4 flex flex-col gap-1 text-xs text-slate-500 tabular-nums">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-semibold text-slate-800">{s.rating} rating</span>
                      <span aria-hidden="true">·</span>
                      <span>{s.sessionsCompleted} sessions</span>
                      <span aria-hidden="true">·</span>
                      <span>{s.experienceYears}+ yrs</span>
                    </div>
                    <div>
                      <span>Next available: </span>
                      <span className="font-medium text-slate-800">{displaySlot}</span>
                    </div>
                    <div>
                      <span>Languages: </span>
                      <span className="font-medium text-slate-800">{s.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-slate-200/70 pt-4 mt-auto flex items-center justify-between gap-3">
                  <div className="tabular-nums">
                    <div className="text-xl font-bold text-slate-900">
                      ₹99
                    </div>
                    <div className="text-xs text-slate-500">
                      starting for 15 mins
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (calmState.isPlaying) pauseCalmTrack();
                        else playCalmTrack('calm_03_veena_dawn');
                      }}
                      title="Listen to audio sample"
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {calmState.isPlaying ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          <span>Sample</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingModalExpert(s)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Schedule Melody
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
