import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, HERSPACE_CONFIG } from '../data/config';

export const SupportView: React.FC = () => {
  const {
    t,
    isTa,
    experts,
    activeRoleFilter,
    setActiveRoleFilter,
    setProfileModalExpert,
    setBookingModalExpert,
    startMaskedCall,
    navigate
  } = useApp();

  const filtered = experts.filter(e => {
    if (activeRoleFilter !== 'all' && e.role !== activeRoleFilter) return false;
    return true;
  });

  return (
    <div className="min-h-dvh bg-[#FAF7F5] text-slate-900 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-6">
          <p className="text-xs font-semibold text-[#5E2750] mb-2">
            Confidential Care Directory
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
            {t('dualTierTitle')}
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {t('dualTierSubtitle')}
          </p>
        </div>

        {/* 2. Filter Tabs — Apple HIG Segmented Control (44x44pt min touch targets) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-900/5 rounded-2xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setActiveRoleFilter('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap tabular-nums ${
                activeRoleFilter === 'all'
                  ? 'bg-[#5E2750] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterAll')} ({experts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleFilter('listener')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeRoleFilter === 'listener'
                  ? 'bg-[#5E2750] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterListeners')}
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleFilter('counsellor')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeRoleFilter === 'counsellor'
                  ? 'bg-[#5E2750] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterCounsellors')}
            </button>
          </div>
        </div>

        {/* 3. Live Melodies Dedicated Sanctuary Callout */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-4 md:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#5E2750]/10 text-[#5E2750] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Looking for Live Singers & Vocal Comfort?
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                Explore our dedicated Live Melodies sanctuary for 15-minute telephone vocal comfort sessions at ₹99.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('singers')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs md:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Visit Live Melodies →
          </button>
        </div>

        {/* 4. Experts Directory Grid (Single-Elevation Cards, Unboxed Metadata) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {filtered.map(exp => {
            const name = isTa && exp.nameTa ? exp.nameTa : exp.name;
            const qual = isTa && exp.qualificationTa ? exp.qualificationTa : exp.qualification;
            const bio = isTa && exp.bioTa ? exp.bioTa : exp.bio;
            const specs = isTa && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties;
            const nextSlot = isTa && exp.nextSlotTa ? exp.nextSlotTa : exp.nextSlot;
            const roleLabel = exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle');

            return (
              <article
                key={exp.id}
                className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={exp.avatar}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200/80"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#5E2750] truncate">
                        {roleLabel}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate mt-0.5">
                        {name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {qual}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {bio}
                  </p>

                  {/* Unboxed Specialties Metadata */}
                  <div className="text-xs text-slate-500 leading-relaxed mb-4">
                    {specs.join(' · ')}
                  </div>

                  {/* Hairline Divider + Unboxed Telemetry Metadata */}
                  <div className="border-t border-slate-200/70 pt-3 mb-4 flex flex-col gap-1.5 text-xs text-slate-500 tabular-nums">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-semibold text-slate-800">{exp.rating} rating</span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.reviewsCount} reviews</span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.experienceYears}+ yrs experience</span>
                    </div>
                    <div>
                      <span>Next available: </span>
                      <span className="font-medium text-slate-800">{nextSlot}</span>
                    </div>
                    <div>
                      <span>Languages: </span>
                      <span className="font-medium text-slate-800">{exp.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-slate-200/70 pt-4 mt-auto flex items-center justify-between gap-3">
                  <div className="tabular-nums">
                    <div className="text-xl font-bold text-slate-900">
                      {formatINR(exp.priceDisplay)}
                    </div>
                    <div className="text-xs text-slate-500">
                      per 60 min session
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileModalExpert(exp)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t('btnViewProfile')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingModalExpert(exp)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      {t('btnBookNow')}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 5. Dedicated Customer Support Enquiry Block */}
        <div className="mt-10 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold text-[#5E2750] mb-1">
                Direct Customer Care & Enquiries
              </p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                {t('supportEnquiryTitle')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Need assistance with your booking, 7-day free trial, or number-masked telephony? Our Chennai support desk is ready to assist you confidentially.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 mb-0.5">Customer Support Telephone</div>
                  <a
                    href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
                    className="text-base font-bold text-slate-900 hover:text-[#5E2750] tabular-nums"
                  >
                    {HERSPACE_CONFIG.support.phone}
                  </a>
                </div>

                <div>
                  <div className="text-slate-500 mb-0.5">WhatsApp Desk</div>
                  <a
                    href={`https://wa.me/${HERSPACE_CONFIG.support.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HerSpace Support, I would like assistance.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-900 hover:text-[#5E2750] underline"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                <div>
                  <div className="text-slate-500 mb-0.5">Working Hours</div>
                  <div className="text-sm font-medium text-slate-800">
                    {t('supportEnquiryHours')}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 mb-0.5">Official Email</div>
                  <div className="text-sm font-medium text-slate-800">
                    {HERSPACE_CONFIG.support.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-sm font-semibold flex items-center justify-center transition-colors whitespace-nowrap"
              >
                Call Support Now
              </a>
              <a
                href={`https://wa.me/${HERSPACE_CONFIG.support.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HerSpace Support, I need assistance with my session.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center transition-colors whitespace-nowrap"
              >
                WhatsApp Support
              </a>
              <button
                type="button"
                onClick={() => startMaskedCall('exp-anita', 'Customer Support Desk', 'counsellor')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                Test Masked Bridge Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
