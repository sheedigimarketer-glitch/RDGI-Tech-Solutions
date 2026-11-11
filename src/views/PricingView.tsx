import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

const PLANS_FAQS = [
  {
    q: 'How does the Three-Month Free Trial work?',
    qTa: 'மூன்று மாத இலவச சோதனை எப்படி செயல்படுகிறது?',
    a: 'Eligible first-time members receive three free months. The one-time 30-minute listener session has a separate seven-day redemption window from registration once bookings are available.',
    aTa: 'தகுதியுள்ள புதிய உறுப்பினர்களுக்கு மூன்று மாதங்கள் இலவசம். முன்பதிவு வசதி தொடங்கியதும், ஒருமுறை கிடைக்கும் 30 நிமிட இலவச அமர்வைப் பதிவு செய்த நாளிலிருந்து ஏழு நாட்களுக்குள் பயன்படுத்த வேண்டும்.'
  },
  {
    q: 'What happens after my three-month free trial?',
    qTa: 'மூன்று மாத இலவச சோதனைக்குப் பிறகு என்ன நடக்கும்?',
    a: 'After the trial, the membership price is ₹149 per month. Auto-renewal requires your consent. Paid membership is currently unavailable.',
    aTa: 'இலவச காலத்திற்குப் பிறகு சந்தா மாதம் ₹149. தானாகப் புதுப்பிக்க உங்கள் ஒப்புதல் தேவை. கட்டணச் சந்தா தற்போது கிடைக்கவில்லை.'
  },
  {
    q: 'Is my phone number really hidden during calls?',
    qTa: 'அழைப்பின் போது எனது தொலைபேசி எண் உண்மையிலேயே மறைக்கப்படுமா?',
    a: 'Masked calling is currently unavailable.',
    aTa: 'எண்ணை மறைத்து அழைக்கும் வசதி தற்போது கிடைக்கவில்லை.'
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
    a: 'Appointments can be rescheduled once booking is available. Confirmed appointments cannot be cancelled. A refund applies only if the counsellor fails to attend.',
    aTa: 'முன்பதிவு வசதி தொடங்கியதும் அமர்வு நேரத்தை மாற்றலாம். உறுதி செய்த அமர்வை ரத்து செய்ய முடியாது. ஆலோசகர் வரவில்லை என்றால் மட்டுமே பணம் திரும்ப வழங்கப்படும்.'
  }
];

export const PricingView: React.FC = () => {
  const { t, isTa, user, navigate, openPolicyModal } = useApp();
  const copy = (en: string, ta: string) => isTa ? ta : en;
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <div className="min-h-dvh bg-[#FAF7F5] text-slate-900 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Header & Value Proposition */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold text-[#5E2750] mb-2">
            {copy('Transparent INR Membership', 'இந்திய ரூபாயில் வெளிப்படையான சந்தா')}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
            {isTa ? 'எளிய, வெளிப்படையான சந்தா திட்டங்கள்' : 'Fair, Transparent Care for Every Woman'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {isTa
              ? 'தகுதியுள்ள புதிய உறுப்பினர்களுக்கு மூன்று மாதங்கள் இலவசம். பதிவு செய்யக் கட்டண விவரங்கள் தேவையில்லை.'
              : 'Eligible first-time members get three months free. Registration requires no payment details.'}
          </p>
        </div>

        {/* 2. Primary Subscription Plans — 2-Column Equalized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">
          {/* Tier 1: Three-Month Free Trial */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-[#5E2750]/25 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <span className="font-semibold text-[#5E2750]">
                  {copy('New Member Sanctuary Trial', 'புதிய உறுப்பினர்களுக்கான இலவச அணுகல்')}
                </span>
                <span className="text-slate-500 tabular-nums">
                  {copy('For eligible first-time members', 'தகுதியுள்ள புதிய உறுப்பினர்களுக்கு')}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                {copy('Three Months Free', 'மூன்று மாதங்கள் இலவசம்')}
              </h2>

              <div className="flex items-baseline gap-2 my-4 tabular-nums">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ₹0
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {copy('for three months', 'மூன்று மாதங்களுக்கு')}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {copy('Explore HerSpace without entering payment details.', 'கட்டண விவரங்களை உள்ளிடாமல் HerSpace-ஐப் பயன்படுத்திப் பாருங்கள்.')}
              </p>

              <div className="border-t border-slate-200/70 pt-4 mb-3">
                <div className="text-xs font-semibold text-slate-800 mb-3">
                  {copy('Included in Your Free Trial', 'இலவச காலத்தில் கிடைப்பவை')}
                </div>

                <ul className="flex flex-col gap-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('1 Complimentary 30-Min Session', 'ஒரு இலவச 30 நிமிட அமர்வு')}</strong> {copy('with a trained listener, within seven days of registration when booking is available', 'முன்பதிவு கிடைக்கும்போது, பயிற்சி பெற்ற மனிதக் கவனிப்பாளருடன் பதிவு செய்ததிலிருந்து ஏழு நாட்களுக்குள் பயன்படுத்தலாம்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('Private My Cycle Tracker', 'தனிப்பட்ட மாதவிடாய் நாட்காட்டி')}</strong> {copy('with session-only tracking', 'தற்போதைய அமர்வில் மட்டும் பதிவுகள் சேமிக்கப்படும்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('All 11 Life & Wellbeing Categories', 'வாழ்க்கை மற்றும் நலத்தின் 11 பிரிவுகள்')}</strong> {copy('in English & தமிழ்', 'ஆங்கிலத்திலும் தமிழிலும்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('Calm Audio Sanctuary', 'மன அமைதி ஒலிகள்')}</strong> {copy('(Guided breathing & ambient ragas)', '(வழிகாட்டப்பட்ட மூச்சுப் பயிற்சி மற்றும் மென்மையான ராகங்கள்)')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('2-Way Masked Calling', 'இரு தரப்பின் எண்ணையும் மறைக்கும் அழைப்பு')}</strong> {copy('currently unavailable', 'தற்போது கிடைக்கவில்லை')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => navigate(user ? 'space' : 'onb-register')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>{user ? copy('Open My Personal Space', 'எனது தனிப்பட்ட இடத்தைத் திறக்கவும்') : copy('Register for Free', 'இலவசமாகப் பதிவு செய்யுங்கள்')}</span>
                <span aria-hidden="true">→</span>
              </button>
              <div className="text-center text-xs text-slate-500 mt-2">
                {copy('No credit card required for initial activation.', 'தொடங்கக் கடன் அட்டை தேவையில்லை.')}
              </div>
            </div>
          </div>

          {/* Tier 2: Monthly Membership */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <span className="font-semibold text-slate-700">
                  {copy('Monthly Membership', 'மாதாந்திர உறுப்பினர் சந்தா')}
                </span>
                <span className="text-slate-500 tabular-nums">
                  {copy('After the trial', 'இலவச காலத்திற்குப் பிறகு')}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                {copy('Monthly Membership', 'மாதாந்திர உறுப்பினர் சந்தா')}
              </h2>

              <div className="flex items-baseline gap-2 my-4 tabular-nums">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ₹149
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {copy('per month', 'மாதத்திற்கு')}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {copy('Auto-renewal requires your consent. Paid membership is currently unavailable.', 'தானாகப் புதுப்பிக்க உங்கள் வெளிப்படையான ஒப்புதல் தேவை. கட்டணச் சந்தா தற்போது கிடைக்கவில்லை.')}
              </p>

              <div className="border-t border-slate-200/70 pt-4 mb-3">
                <div className="text-xs font-semibold text-slate-800 mb-3">
                  {copy('Continued Member Privileges', 'உறுப்பினர்களுக்குத் தொடர்ந்து கிடைக்கும் நன்மைகள்')}
                </div>

                <ul className="flex flex-col gap-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('Uninterrupted Sanctuary Access', 'தடையற்ற அணுகல்')}</strong> {copy('to all 11 health categories', 'நலத்தின் 11 பிரிவுகளுக்கும்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('Subsidized Booking Rates', 'சலுகை முன்பதிவுக் கட்டணங்கள்')}</strong> {copy('on all verified professionals', 'சரிபார்க்கப்பட்ட அனைத்து நிபுணர்களிடமும்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('Dedicated Live Melodies', 'நேரலை இசை அமர்வுகள்')}</strong> {copy('booking currently unavailable', 'முன்பதிவு தற்போது கிடைக்கவில்லை')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('My Cycle', 'மாதவிடாய் நாட்காட்டி')}</strong> {copy('tracks entries for the current session', 'தற்போதைய அமர்வுக்கான பதிவுகளைக் காட்டும்')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#5E2750] font-bold shrink-0">✓</span>
                    <span><strong>{copy('One-Tap Reschedule', 'ஒரே தட்டலில் நேரத்தை மாற்றலாம்')}</strong> {copy('available when booking opens', 'முன்பதிவு தொடங்கியதும் கிடைக்கும்')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => openPolicyModal('cancellation')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center text-center"
              >
                {copy('Review Cancellation & Reschedule Terms', 'ரத்து மற்றும் நேரமாற்ற விதிகளைப் பார்க்கவும்')}
              </button>
              <div className="text-center text-xs text-slate-500 mt-2">
                {copy('Confirmed appointments cannot be cancelled.', 'உறுதிசெய்த அமர்வுகளை ரத்து செய்ய முடியாது.')}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Session Rates Breakdown Table */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-xs p-6 mb-10">
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#5E2750] mb-1">
              {copy('Per-Session Rates', 'ஒவ்வோர் அமர்வுக்கான கட்டணங்கள்')}
            </p>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              {copy('Transparent Session Fees', 'வெளிப்படையான அமர்வுக் கட்டணங்கள்')}
            </h3>
            <p className="text-xs md:text-sm text-slate-500">
              {copy('Booking and masked calling are currently unavailable.', 'முன்பதிவும் எண்ணை மறைக்கும் அழைப்பும் தற்போது கிடைக்கவில்லை.')}
            </p>
          </div>

          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={copy('Session rates', 'அமர்வுக் கட்டணங்கள்')}>
            <table className="w-full text-left border-collapse min-w-[520px] tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4">{copy('Service Tier', 'சேவை வகை')}</th>
                  <th className="py-3 px-4">{copy('Scope of Care', 'வழங்கப்படும் ஆதரவு')}</th>
                  <th className="py-3 px-4">{copy('Duration', 'கால அளவு')}</th>
                  <th className="py-3 px-4">{copy('Fee (INR)', 'கட்டணம் (₹)')}</th>
                  <th className="py-3 pl-4 text-right">{copy('Action', 'செயல்')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-sm">
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    {copy('Trained Human Listener', 'பயிற்சி பெற்ற மனிதக் கவனிப்பாளர்')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {copy('Empathetic listening, emotional first-aid & stress venting', 'பரிவுடன் கேட்டல், உணர்வுப்பூர்வ ஆதரவு மற்றும் மன அழுத்தத்தைப் பகிர்தல்')}
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{copy('60 mins', '60 நிமிடங்கள்')}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">₹399</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('support')}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      {copy('Book Listener', 'கவனிப்பாளரை முன்பதிவு செய்க')}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    {copy('Licensed Counsellor', 'உரிமம் பெற்ற ஆலோசகர்')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {copy('RCI/clinical psychotherapy, anxiety, trauma & cognitive care', 'RCI / மருத்துவ உளவியல் சிகிச்சை, பதற்றம், மனக்காயம் மற்றும் சிந்தனை சார்ந்த ஆதரவு')}
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{copy('60 mins', '60 நிமிடங்கள்')}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">₹999</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('support')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      {copy('Book Counsellor', 'ஆலோசகரை முன்பதிவு செய்க')}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    {copy('HerSpace Live Melodies', 'HerSpace நேரலை இசை')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {copy('Live soothing vocal therapy, acoustic lullabies & comfort songs', 'அமைதியூட்டும் நேரலைக் குரலிசை, தாலாட்டு மற்றும் ஆறுதல் பாடல்கள்')}
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{copy('To be confirmed', 'உறுதி செய்யப்பட வேண்டும்')}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">{copy('To be confirmed', 'உறுதி செய்யப்பட வேண்டும்')}</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('singers')}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      {copy('View Singers', 'பாடகர்களைப் பார்க்கவும்')}
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
              {copy('Appointment Policies', 'அமர்வு விதிமுறைகள்')}
            </p>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              {copy('Fair Scheduling & Reschedule Guarantee', 'அமர்வு நேரம் மற்றும் நேரமாற்ற விதிகள்')}
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {copy('Confirmed appointments support rescheduling. A refund applies only if the counsellor fails to attend.', 'உறுதிசெய்த அமர்வின் நேரத்தை மாற்றலாம். ஆலோசகர் கலந்துகொள்ளாவிட்டால் மட்டுமே பணம் திரும்ப வழங்கப்படும்.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openPolicyModal('cancellation')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              {copy('Read Full Policy', 'முழு விதிமுறைகளைப் படிக்கவும்')}
            </button>
            <a
              href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-xs font-semibold flex items-center justify-center transition-colors text-center tabular-nums"
            >
              {copy('Call Support', 'உதவிக்கு அழைக்கவும்')} ({HERSPACE_CONFIG.support.phone})
            </a>
          </div>
        </div>

        {/* 5. Frequently Asked Questions */}
        <div>
          <div className="max-w-xl mx-auto text-center mb-6">
            <p className="text-xs font-semibold text-[#5E2750] mb-1">
              {copy('Frequently Asked Questions', 'பொதுவான கேள்விகள்')}
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
