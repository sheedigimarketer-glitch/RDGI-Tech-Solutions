import React from 'react';
import { useApp } from '../context/AppContext';
import { WELLBEING_ARTICLES } from '../data/wellbeingData';

export const PersonalSpaceView: React.FC = () => {
  const {
    t,
    isTa,
    user,
    entitlement,
    appointments,
    savedArticleIds,
    navigate,
    setBookingModalExpert,
    experts
  } = useApp();

  const trialEnds = entitlement?.trialEndsAt ? new Date(entitlement.trialEndsAt).getTime() : 0;
  const daysRemaining = Math.max(0, Math.ceil((trialEnds - Date.now()) / (1000 * 60 * 60 * 24)));

  const voucherAvailable =
    entitlement?.welcomeCallStatus === 'available' &&
    new Date(entitlement.welcomeCallExpiresAt).getTime() > Date.now();

  const savedArticles = WELLBEING_ARTICLES.filter(a => savedArticleIds.includes(a.id));
  const upcoming = appointments.filter(a => a.status === 'scheduled');

  const defaultListener = experts.find(e => e.role === 'listener') || experts[0];

  return (
    <div className="min-h-dvh bg-[#FAF7F5] text-slate-900 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Welcome */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#5E2750] mb-1 tabular-nums">
              {t('spaceTrialActive')} · {daysRemaining} {t('spaceTrialDaysRemaining')}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {isTa
                ? `வணக்கம், ${user?.fullName?.split(' ')[0] || user?.username || 'தோழி'}!`
                : `Welcome, ${user?.fullName?.split(' ')[0] || user?.username || 'Friend'}`}
            </h1>
            <p className="text-xs md:text-sm text-slate-500">
              {t('spaceSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
          >
            {t('navBookings')} ({upcoming.length})
          </button>
        </div>

        {/* Complimentary Voucher Banner */}
        {voucherAvailable && (
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-[#5E2750]/25 shadow-xs p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#5E2750] mb-1">
                Complimentary Sanctuary Session
              </p>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                {t('spaceVoucherHeading')}
              </h2>
              <p className="text-xs md:text-sm text-slate-600">
                {t('spaceVoucherValid')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBookingModalExpert(defaultListener)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {t('spaceBtnRedeemVoucher')} →
            </button>
          </div>
        )}

        {/* Quick Action Grid */}
        <h2 className="text-base font-bold text-slate-900 mb-3">
          {t('spaceQuickActions')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate('support')}
            className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 hover:border-[#5E2750]/30 shadow-xs p-4 flex flex-col items-center justify-center gap-2.5 min-h-[96px] transition-colors cursor-pointer text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-800">{t('spaceActionBook')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('singers')}
            className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 hover:border-[#5E2750]/30 shadow-xs p-4 flex flex-col items-center justify-center gap-2.5 min-h-[96px] transition-colors cursor-pointer text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-800">Live Melodies</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('calm')}
            className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 hover:border-[#5E2750]/30 shadow-xs p-4 flex flex-col items-center justify-center gap-2.5 min-h-[96px] transition-colors cursor-pointer text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-800">{t('spaceActionCalm')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('cycle')}
            className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 hover:border-[#5E2750]/30 shadow-xs p-4 flex flex-col items-center justify-center gap-2.5 min-h-[96px] transition-colors cursor-pointer text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-800">{t('spaceActionCycle')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('wellbeing')}
            className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 hover:border-[#5E2750]/30 shadow-xs p-4 flex flex-col items-center justify-center gap-2.5 min-h-[96px] transition-colors cursor-pointer text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-800">{t('spaceActionWellbeing')}</span>
          </button>
        </div>

        {/* Grid: Upcoming Sessions & Saved Bookmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bookings */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {t('spaceUpcomingBookings')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                View All
              </button>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500">
                {t('spaceNoBookings')}
              </p>
            ) : (
              <div className="divide-y divide-slate-200/70">
                {upcoming.map(apt => (
                  <div key={apt.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {apt.expertName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {apt.date} · {apt.time} · {apt.mode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Articles */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-slate-900 tabular-nums">
                Saved Wellbeing Topics ({savedArticles.length})
              </h3>
              <button
                type="button"
                onClick={() => navigate('wellbeing')}
                className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Browse Hub
              </button>
            </div>

            {savedArticles.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500">
                No articles bookmarked yet. Bookmark any topic in the Life & Wellbeing Hub for quick access.
              </p>
            ) : (
              <div className="divide-y divide-slate-200/70">
                {savedArticles.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => navigate('wellbeing')}
                    className="w-full min-h-[44px] py-2.5 text-left text-xs md:text-sm font-semibold text-slate-800 hover:text-[#5E2750] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>{isTa ? a.title.ta : a.title.en}</span>
                    <span className="text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
