import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

const PLANS_FAQS = [
  {
    q: 'How does the 7-Day Free Trial work?',
    qTa: '7 நாள் இலவச சோதனை எப்படி செயல்படுகிறது?',
    a: 'Every new member receives 7 days of full sanctuary access at ₹0, including 1 complimentary 30-minute session with a Trained Listener, the encrypted My Cycle tracker, and the Calm Audio Sanctuary.',
    aTa: 'ஒவ்வொரு புதிய உறுப்பினரும் ₹0 கட்டணத்தில் 7 நாட்கள் முழு அணுகலைப் பெறுவார்கள், இதில் பயிற்சி பெற்ற கேட்பவருடன் 1 இலவச 30 நிமிட அமர்வும் அடங்கும்.'
  },
  {
    q: 'What happens after my 7-day free trial?',
    qTa: '7 நாள் இலவச சோதனைக்குப் பிறகு என்ன நடக்கும்?',
    a: 'You can continue with our Extended Validity Plan at ₹149 for your first 60 days of validity, followed by ₹149/month auto-renewal. You can cancel anytime in one tap with zero penalty.',
    aTa: 'முதல் 60 நாட்களுக்கு ₹149 கட்டணத்தில் தொடரலாம், அதைத் தொடர்ந்து மாதம் ₹149 மட்டுமே. எப்போது வேண்டுமானாலும் ஒரே கிளிக்கில் ரத்து செய்யலாம்.'
  },
  {
    q: 'Is my phone number really hidden during calls?',
    qTa: 'அழைப்பின் போது எனது தொலைபேசி எண் உண்மையிலேயே மறைக்கப்படுமா?',
    a: 'Yes, 100%. All sessions connect through our 2-way Exotel virtual telephony bridge. Neither you nor the listener/counsellor ever sees each other’s personal phone number.',
    aTa: 'ஆம், 100%. அனைத்து அழைப்புகளும் எங்கள் இருவழி மறைக்கப்பட்ட தொலைபேசி பாலம் வழியாக இணைக்கப்படுகின்றன. உங்கள் எண் யாருக்கும் தெரியாது.'
  },
  {
    q: 'What is the difference between a Trained Listener (₹399) and a Counsellor (₹999)?',
    qTa: 'பயிற்சி பெற்ற கேட்பவருக்கும் (₹399) ஆலோசகருக்கும் (₹999) என்ன வித்தியாசம்?',
    a: 'Trained Listeners provide empathetic, non-judgmental emotional venting and comfort for 60 minutes (₹399). Licensed Counsellors are RCI/postgraduate psychologists offering structured clinical therapy for 60 minutes (₹999).',
    aTa: 'பயிற்சி பெற்ற கேட்பவர்கள் 60 நிமிடங்கள் (₹399) ஆறுதல் மற்றும் உணர்வுபூர்வமான ஆதரவை வழங்குகிறார்கள். ஆலோசகர்கள் 60 நிமிடங்கள் (₹999) உளவியல் சிகிச்சை வழங்குகிறார்கள்.'
  },
  {
    q: 'Can I reschedule or cancel a booked session?',
    qTa: 'முன்பதிவு செய்த அமர்வை மாற்றியமைக்க முடியுமா?',
    a: 'One reschedule is permitted per booking up to 4 hours prior to the appointment start time. If your care provider fails to join, you receive a 100% full refund automatically.',
    aTa: 'அமர்வு தொடங்குவதற்கு 4 மணி நேரத்திற்கு முன்பு வரை ஒரு முறை நேரத்தை மாற்றிக்கொள்ளலாம். நிபுணர் வரவில்லை என்றால் 100% முழு பணமும் திரும்பப் பெறப்படும்.'
  }
];

export const PricingView: React.FC = () => {
  const { t, isTa, user, navigate, openPolicyModal } = useApp();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const today = new Date();
  const trialEndDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const extendedValidityDate = new Date(today.getTime() + 67 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-dvh bg-[#FAF7F5] text-slate-900 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Header & Value Proposition */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold text-[#5E2750] mb-2">
            Transparent INR Membership
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
            {isTa ? 'எளிய, வெளிப்படையான சந்தா திட்டங்கள்' : 'Fair, Transparent Care for Every Woman'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {isTa
              ? 'மறைமுக கட்டணங்கள் இன்றி, 7 நாட்கள் இலவச சோதனையுடன் தொடங்குங்கள். உங்கள் தனியுரிமை மற்றும் பாதுகாப்பே எங்கள் முதன்மை நோக்கம்.'
              : 'Begin with 7 days completely free at ₹0. Continue with ₹149 for your first 60 days validity, followed by simple monthly renewal. Cancel anytime in one tap.'}
          </p>
        </div>

        {/* 2. Primary Subscription Plans — 2-Column Equalized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">
          {/* Tier 1: 7-Day Free Trial */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-[#5E2750]/25 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <span className="font-semibold text-[#5E2750]">
                  New Member Sanctuary Trial
                </span>
                <span className="text-slate-500 tabular-nums">
                  Valid until {trialEndDate}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                7 Days Free Trial
              </h2>

              <div className="flex items-baseline gap-2 my-4 tabular-nums">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ₹0
                </span>
                <span className="text-xs font-medium text-slate-500">
                  for your first 7 days
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Zero-commitment trial to experience HerSpace emotional sanctuary, explore expert directories, and verify caller masking.
              </p>

              <div className="border-t border-slate-200/70 pt-4 mb-3">
                <div className="text-xs font-semibold text-slate-800 mb-3">
                  Included in Your Free Trial
                </div>

                <ul className="flex flex-col gap-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>1 Complimentary 30-Min Session</strong> with a Trained Listener (₹399 value)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Private My Cycle Tracker</strong> with local device encryption</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>All 11 Life & Wellbeing Categories</strong> in English & தமிழ்</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Calm Audio Sanctuary</strong> (Guided breathing & ambient ragas)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>2-Way Masked Calling</strong> so your phone number stays 100% private</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => navigate(user ? 'space' : 'onb-register')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>{user ? 'Open My Personal Space' : 'Start 7-Day Trial @ ₹0'}</span>
                <span aria-hidden="true">→</span>
              </button>
              <div className="text-center text-xs text-slate-500 mt-2">
                No credit card required for initial activation.
              </div>
            </div>
          </div>

          {/* Tier 2: First 60 Days Validity Plan */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <span className="font-semibold text-slate-700">
                  Extended Validity Plan
                </span>
                <span className="text-slate-500 tabular-nums">
                  Valid through {extendedValidityDate}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                First 60 Days Validity
              </h2>

              <div className="flex items-baseline gap-2 my-4 tabular-nums">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ₹149
                </span>
                <span className="text-xs font-medium text-slate-500">
                  for 60 days validity
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Followed by simple monthly renewal at ₹149/month after the initial 60 days. Cancel anytime with a single tap in your account.
              </p>

              <div className="border-t border-slate-200/70 pt-4 mb-3">
                <div className="text-xs font-semibold text-slate-800 mb-3">
                  Continued Member Privileges
                </div>

                <ul className="flex flex-col gap-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Uninterrupted Sanctuary Access</strong> to all 11 health categories</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Subsidized Booking Rates</strong> on all verified professionals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Dedicated Live Melodies</strong> booking at ₹99 for 15 mins</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>Permanent Cycle History</strong> stored encrypted on your device</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>One-Tap Reschedule</strong> up to 4 hours before session</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => openPolicyModal('cancellation')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap"
              >
                Review Cancellation & Reschedule Terms
              </button>
              <div className="text-center text-xs text-slate-500 mt-2">
                Zero penalty, instant online cancellation anytime.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Session Rates Breakdown Table */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 mb-10">
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#5E2750] mb-1">
              Per-Session Rates
            </p>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              Transparent Session Fees
            </h3>
            <p className="text-xs md:text-sm text-slate-500">
              Every session takes place over our secure two-way masked phone bridge. No video cameras, no personal contact sharing.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px] tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4">Service Tier</th>
                  <th className="py-3 px-4">Scope of Care</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Fee (INR)</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-sm">
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    Trained Human Listener
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    Empathetic listening, emotional first-aid & stress venting
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">60 mins</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">₹399</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('support')}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Listener
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    Licensed Counsellor
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    RCI/clinical psychotherapy, anxiety, trauma & cognitive care
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">60 mins</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">₹999</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('support')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Counsellor
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    HerSpace Live Melodies
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    Live soothing vocal therapy, acoustic lullabies & comfort songs
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">15 mins</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">₹99</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('singers')}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Singer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Rescheduling Policy & Help Callout */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-[#5E2750] mb-1">
              Appointment Policies
            </p>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              Fair Scheduling & Reschedule Guarantee
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              <strong>One reschedule allowed</strong> per session up to 4 hours prior to appointment time. If an expert is unable to attend, you receive a 100% full refund automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openPolicyModal('cancellation')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Read Full Policy
            </button>
            <a
              href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-xs font-semibold flex items-center justify-center transition-colors whitespace-nowrap tabular-nums"
            >
              Call Support ({HERSPACE_CONFIG.support.phone})
            </a>
          </div>
        </div>

        {/* 5. Frequently Asked Questions */}
        <div>
          <div className="max-w-xl mx-auto text-center mb-6">
            <p className="text-xs font-semibold text-[#5E2750] mb-1">
              Frequently Asked Questions
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Membership, Privacy & Session FAQs'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {t('faqSubTitle')}
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {PLANS_FAQS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs px-5 py-3"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full min-h-[44px] flex items-center justify-between gap-4 text-left cursor-pointer text-sm md:text-base font-semibold text-slate-900"
                  >
                    <span>{isTa ? item.qTa : item.q}</span>
                    <span className="text-lg font-bold text-[#5E2750] shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-2 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                      {isTa ? item.aTa : item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
