import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

export const TourView: React.FC = () => {
  const { t, isTa, updateOnboardingStep, navigate } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: t('tourS1Title'),
      body: t('tourS1Body'),
      image: HERSPACE_CONFIG.images.heroSunrise
    },
    {
      title: t('tourS2Title'),
      body: t('tourS2Body'),
      image: HERSPACE_CONFIG.images.calmCup
    },
    {
      title: t('tourS3Title'),
      body: t('tourS3Body'),
      image: HERSPACE_CONFIG.images.reflectionOutdoor
    }
  ];

  const curr = slides[slide];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      updateOnboardingStep('membership');
      navigate('onb-membership');
    }
  };

  const handleSkip = () => {
    updateOnboardingStep('membership');
    navigate('onb-membership');
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <div className="onb-tour-progress">
          {t('stepOf', { n: slide + 1 })}
        </div>
        <h1 className="onb-title onb-title-sm">{curr.title}</h1>

        <div className="onb-card" style={{ padding: '20px' }}>
          <div className="onb-tour-image">
            <img src={curr.image} alt={curr.title} />
          </div>

          <p style={{ fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--color-text-body)', marginBottom: '18px' }}>
            {curr.body}
          </p>

          <div className="onb-dots">
            {slides.map((_, i) => (
              <span key={i} className={i === slide ? 'on' : ''}></span>
            ))}
          </div>

          <div className="onb-actions">
            <button className="btn btn-outline" onClick={handleSkip}>
              {t('btnSkipTour')}
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {slide === slides.length - 1 ? t('btnFinishTour') : t('btnNext')} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 3. MEMBERSHIP CONFIRMATION VIEW ('onb-membership')
// -----------------------------------------------------------------------------------------------
export const MembershipView: React.FC = () => {
  const { t, isTa, entitlement, updateOnboardingStep, navigate } = useApp();
  const trialEnds = entitlement?.trialEndsAt ? new Date(entitlement.trialEndsAt) : null;
  const activeTrial = trialEnds && trialEnds.getTime() > Date.now();
  const voucherAvailable = entitlement?.welcomeCallStatus === 'available' &&
    Date.parse(entitlement.welcomeCallExpiresAt) > Date.now();

  const handleContinue = () => {
    updateOnboardingStep('book');
    navigate('onb-book');
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{isTa ? 'உறுப்பினர் விவரங்கள்' : 'Membership'}</h1>
        <p className="onb-sub">{isTa ? 'இலவசமாகத் தொடரலாம். கட்டண விவரங்கள் தேவையில்லை.' : 'Continue without entering payment details.'}</p>

        <div className="onb-card onb-mem">
          <div className="onb-mem-hero">
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 6px', color: '#FFF' }}>
              {activeTrial ? (isTa ? 'இலவச சோதனை செயலில் உள்ளது' : 'Free trial active') :
                (isTa ? 'உங்கள் HerSpace கணக்கு தயாராக உள்ளது' : 'Your HerSpace account is ready')}
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.95)', marginBottom: '8px' }}>
              {activeTrial ? (isTa ? 'இலவச சோதனை முடியும் நாள்' : 'Trial ends') + ' · ' +
                trialEnds.toLocaleDateString(isTa ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' }) :
                (isTa ? 'சேவைகளைப் பார்வையிடத் தொடருங்கள்.' : 'Continue to explore available services.')}
            </p>
          </div>

          {voucherAvailable && <div style={{ background: 'var(--color-bg-lavender)', border: '1px solid var(--color-lavender-soft)', padding: '16px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '4px 0', color: 'var(--color-primary-dark)' }}>{t('memCard2Title')}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              {isTa ? 'காலாவதியாகும் நாள்' : 'Expires'} · {new Date(entitlement.welcomeCallExpiresAt).toLocaleDateString(isTa ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' })}
            </p>
          </div>}

          <button className="btn btn-primary btn-lg btn-block" onClick={handleContinue}>
            {t('btnContinueToBook')}
          </button>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 4. CHOOSE SERVICE & BOOK STEP ('onb-book')
// -----------------------------------------------------------------------------------------------
export const BookStepView: React.FC = () => {
  const { isTa, experts, singers, entitlement, updateOnboardingStep, navigate, setBookingModalExpert } = useApp();
  const [hubTab, setHubTab] = useState<'listener' | 'counsellor' | 'singer'>('listener');

  const voucherAvailable = entitlement?.welcomeCallStatus === 'available' &&
    Date.parse(entitlement.welcomeCallExpiresAt) > Date.now();

  const finishToSpace = () => {
    updateOnboardingStep('book', true);
    navigate('space');
  };

  return (
    <section className="onb-page onb-page-wide">
      <div className="container">
        <div style={{ maxWidth: '640px', margin: '0 auto 20px', textAlign: 'center' }}>
          <h1 className="onb-title">{isTa ? 'ஆதரவு முறையைத் தேர்வு செய்து முன்பதிவு செய்யுங்கள்' : 'Choose Your First Care Session'}</h1>
          <p className="onb-sub">
            {isTa ? 'உங்கள் தேவைகளுக்கு ஏற்ற ஆதரவைத் தேர்வு செய்யவும்.' : 'Explore trained listeners, counsellors and live melodies.'}
          </p>

          <div className="service-tabs" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
            <button
              className={`service-tab ${hubTab === 'listener' ? 'active' : ''}`}
              onClick={() => setHubTab('listener')}
            >
              {isTa ? 'பயிற்சி பெற்ற கவனிப்பாளர்கள் (₹399)' : 'Trained Listeners (₹399)'}
            </button>
            <button
              className={`service-tab ${hubTab === 'counsellor' ? 'active' : ''}`}
              onClick={() => setHubTab('counsellor')}
            >
              {isTa ? 'ஆலோசகர்கள் (₹999)' : 'Counsellors (₹999)'}
            </button>
            <button
              className={`service-tab ${hubTab === 'singer' ? 'active' : ''}`}
              onClick={() => setHubTab('singer')}
            >
              {isTa ? 'நேரடி மெல்லிசை' : 'Live Melodies'}
            </button>
          </div>
        </div>

        {/* Directory for selected category */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px', maxWidth: '960px', margin: '0 auto 24px' }}>
          {hubTab === 'singer'
            ? singers.map(s => (
                <div key={s.id} className="expert-card">
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>{isTa && s.nameTa ? s.nameTa : s.name}</h3>
                    <div style={{ fontSize: '0.84rem', color: 'var(--color-primary)' }}>{s.qualification}</div>
                    <p className="expert-bio">{isTa && s.bioTa ? s.bioTa : s.bioEn}</p>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={() => { setBookingModalExpert(s); finishToSpace(); }}>
                    {isTa ? 'மெல்லிசை அமர்வைப் பார்க்கவும்' : 'View melody session'} →
                  </button>
                </div>
              ))
            : experts.filter(e => e.role === hubTab).map(exp => (
                <div key={exp.id} className="expert-card">
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={exp.avatar} alt={exp.name} className="expert-avatar" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{isTa && exp.nameTa ? exp.nameTa : exp.name}</h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>{exp.qualification}</div>
                      </div>
                    </div>
                    <p className="expert-bio">{isTa && exp.bioTa ? exp.bioTa : exp.bio}</p>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={() => { setBookingModalExpert(exp); finishToSpace(); }}>
                    {exp.role === 'listener' && voucherAvailable ? (isTa ? 'இலவச அமர்வைப் பார்க்கவும்' : 'View complimentary session') : (isTa ? 'அமர்வைப் பார்க்கவும்' : 'View session')} →
                  </button>
                </div>
              ))}
        </div>

        <div className="onb-later">
          <button className="btn btn-outline" onClick={finishToSpace}>
            {isTa ? 'என் தனிப்பட்ட இடத்திற்குச் செல்லவும்' : 'Go to My Personal Space'} →
          </button>
        </div>
      </div>
    </section>
  );
};
