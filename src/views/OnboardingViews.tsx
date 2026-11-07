import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

// -----------------------------------------------------------------------------------------------
// 1. REGISTRATION VIEW ('onb-register')
// -----------------------------------------------------------------------------------------------
export const RegisterView: React.FC = () => {
  const { isTa, navigate } = useApp();
  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{isTa ? 'உறுப்பினர் அணுகல்' : 'Member access'}</h1>
        <p className="onb-sub" role="status">
          {isTa ? 'உறுப்பினர் பதிவு மற்றும் உள்நுழைவு தற்போது கிடைக்கவில்லை.' : 'Member registration and sign-in are currently unavailable.'}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('home')}>
          {isTa ? 'முகப்புக்குச் செல்லவும்' : 'Return to home'}
        </button>
      </div>
    </section>
  );
};

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
  const { t, updateOnboardingStep, navigate } = useApp();
  const [autoRenew, setAutoRenew] = useState(false);

  const trialEndFormatted = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleContinue = () => {
    updateOnboardingStep('book');
    navigate('onb-book');
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{t('memTitle')}</h1>
        <p className="onb-sub">{t('memSub')}</p>

        <div className="onb-card onb-mem">
          <div className="onb-mem-hero">
            <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', marginBottom: '8px' }}>
              ENROLMENT BENEFIT
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 6px', color: '#FFF' }}>{t('memCard1Title')}</h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.95)', marginBottom: '8px' }}>{t('memCard1Desc')}</p>
            <div style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block' }}>
              🗓️ Free trial valid through: <strong>{trialEndFormatted}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-lavender)', border: '1px solid var(--color-lavender-soft)', padding: '16px', borderRadius: '12px' }}>
            <span className="badge badge-pink" style={{ marginBottom: '6px' }}>VALID FOR 7 DAYS</span>
            <h3 style={{ fontSize: '1.2rem', margin: '4px 0 4px', color: 'var(--color-primary-dark)' }}>{t('memCard2Title')}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0 }}>{t('memCard2Desc')}</p>
          </div>

          <div className="form-check" style={{ marginTop: '8px' }}>
            <input
              id="chkAutoRenew"
              type="checkbox"
              checked={autoRenew}
              onChange={e => setAutoRenew(e.target.checked)}
            />
            <label htmlFor="chkAutoRenew" style={{ fontSize: '0.82rem' }}>
              {t('memToggleAutoRenew')}
            </label>
          </div>

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
  const { t, isTa, experts, singers, updateOnboardingStep, navigate, setBookingModalExpert } = useApp();
  const [hubTab, setHubTab] = useState<'listener' | 'counsellor' | 'singer'>('listener');

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
            {isTa ? 'உங்கள் தேவைகளுக்கு ஏற்ற ஆதரவைத் தேர்வு செய்யவும்.' : 'Your free trial includes 1 complimentary 30-min Trained Listener call.'}
          </p>

          <div className="service-tabs" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
            <button
              className={`service-tab ${hubTab === 'listener' ? 'active' : ''}`}
              onClick={() => setHubTab('listener')}
            >
              Trained Listeners (₹399)
            </button>
            <button
              className={`service-tab ${hubTab === 'counsellor' ? 'active' : ''}`}
              onClick={() => setHubTab('counsellor')}
            >
              Counsellors (₹999)
            </button>
            <button
              className={`service-tab ${hubTab === 'singer' ? 'active' : ''}`}
              onClick={() => setHubTab('singer')}
            >
              Live Melodies
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
                    Schedule Melody →
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
                    {exp.role === 'listener' ? 'Book with Free Voucher (₹0)' : 'Book Session →'}
                  </button>
                </div>
              ))}
        </div>

        <div className="onb-later">
          <button className="btn btn-outline" onClick={finishToSpace}>
            I’ll book later — Go to My Personal Space →
          </button>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 5. SIGN IN VIEW ('signin')
// -----------------------------------------------------------------------------------------------
export const SigninView = RegisterView;
