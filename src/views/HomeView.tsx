import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG, formatINR } from '../data/config';

export const HomeView: React.FC = () => {
  const {
    t,
    isTa,
    user,
    experts,
    activeCategoryFilter,
    setActiveCategoryFilter,
    activeRoleFilter,
    setActiveRoleFilter,
    navigate,
    setProfileModalExpert,
    setBookingModalExpert,
    openPolicyModal
  } = useApp();

  const formattedHeroTitle = t('heroTitle').split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < t('heroTitle').split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  const filteredExperts = experts.filter(exp => {
    if (activeRoleFilter !== 'all' && exp.role !== activeRoleFilter) return false;
    if (activeCategoryFilter !== 'all') {
      const matchSpecialty = exp.specialties.some(s =>
        s.toLowerCase().includes(activeCategoryFilter.toLowerCase())
      );
      if (!matchSpecialty) return false;
    }
    return true;
  });

  const categories = [
    { id: 'mental', title: t('catMental'), desc: t('catMentalDesc'), icon: '🧠', color: '#5B8BD9' },
    { id: 'relationships', title: t('catRelationships'), desc: t('catRelationshipsDesc'), icon: '🤝', color: '#C85A8E' },
    { id: 'career', title: t('catCareer'), desc: t('catCareerDesc'), icon: '💼', color: '#5C6BC0' },
    { id: 'grief', title: t('catGrief'), desc: t('catGriefDesc'), icon: '🕊️', color: '#7C5CBF' },
    { id: 'motherhood', title: t('catMotherhood'), desc: t('catMotherhoodDesc'), icon: '🌸', color: '#D86C9B' },
    { id: 'wellness', title: t('catWellness'), desc: t('catWellnessDesc'), icon: '🌱', color: '#4EA898' }
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero-wrapper">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-badge">HERSPACE</span>
              <span>{t('eyebrow')}</span>
            </div>

            <h1 className="hero-title">{formattedHeroTitle}</h1>

            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            <div className="hero-badge-row">
              <span className="badge badge-lavender">{t('heroFreeTrialChip')}</span>
              <span className="badge badge-pink">{t('heroComplimentaryChip')}</span>
            </div>

            <div className="hero-cta-group">
              {user ? (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('space')}>
                    <span>{t('heroMemberCTA')}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => navigate('support')}>
                    <span>{t('heroMemberSecondary')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('onb-register')}>
                    <span>Create Account</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => navigate('support')}>
                    <span>{t('heroCTA')}</span>
                  </button>
                </>
              )}
            </div>

            <div className="hero-trust-strip">
              <div className="hero-trust-item">
                <div className="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="hero-trust-text">
                  <strong>{t('trustSafe')}</strong>
                  <span>{isTa ? '18+ பெண்கள் & திருநங்கைகள்' : 'Women & Trans Women 18+'}</span>
                </div>
              </div>

              <div className="hero-trust-item">
                <div className="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="hero-trust-text">
                  <strong>{t('trustListeners')}</strong>
                  <span>{isTa ? 'பரிவுமிக்க மனித கவனிப்பு' : 'Empathetic Peer Listening'}</span>
                </div>
              </div>

              <div className="hero-trust-item">
                <div className="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </div>
                <div className="hero-trust-text">
                  <strong>{t('trustCounsellors')}</strong>
                  <span>{isTa ? 'பரிசீலிக்கப்பட்ட தகுதிகள்' : 'Reviewed Credentials'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual-col">
            <div className="hero-image-frame">
              <img src={HERSPACE_CONFIG.images.heroSunrise} alt={t('heroBannerAlt')} />
            </div>

            <div className="hero-caption-bar">
              <div className="hero-caption-bar-left">
                <span className="hero-caption-dot"></span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-dark)' }}>
                    {t('floatingCardText')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {t('floatingCardSub')}
                  </div>
                </div>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => navigate(user ? 'space' : 'onb-register')}>
                {user ? t('spaceTitle') : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ECOSYSTEM SPOTLIGHTS */}
      <section className="section" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">HERSPACE 4.0 ECOSYSTEM</div>
            <h2>{t('spotlightSectionTitle')}</h2>
            <p>{t('spotlightSectionSub')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(265px,1fr))', gap: '20px' }}>
            {/* Card 1: Life & Wellbeing */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(124,92,191,0.22)' }}>
              <img src={HERSPACE_CONFIG.images.reflectionOutdoor} alt={t('spotlightWellbeingTitle')} style={{ width: '100%', height: '155px', objectFit: 'cover' }} />
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-verified" style={{ marginBottom: '8px' }}>🌸 11 Topics · EN & தமிழ்</span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{t('spotlightWellbeingTitle')}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', marginBottom: '14px' }}>{t('spotlightWellbeingSub')}</p>
                </div>
                <button className="btn btn-primary btn-block" onClick={() => navigate('wellbeing')}>
                  {t('spotlightWellbeingCTA')} →
                </button>
              </div>
            </div>

            {/* Card 2: My Cycle */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(216,108,155,0.28)' }}>
              <img src={HERSPACE_CONFIG.images.hopePortrait} alt={t('spotlightCycleTitle')} style={{ width: '100%', height: '155px', objectFit: 'cover' }} />
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-listener" style={{ marginBottom: '8px' }}>📅 Opt-In & Private</span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{t('spotlightCycleTitle')}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', marginBottom: '14px' }}>{t('spotlightCycleSub')}</p>
                </div>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('cycle')}>
                  {t('spotlightCycleCTA')} →
                </button>
              </div>
            </div>

            {/* Card 3: Calm Audio Sanctuary */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(91,139,217,0.28)' }}>
              <img src={HERSPACE_CONFIG.images.calmCup} alt={t('spotlightCalmTitle')} style={{ width: '100%', height: '155px', objectFit: 'cover' }} />
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-counsellor" style={{ marginBottom: '8px' }}>🎵 Meditation & Sleep</span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{t('spotlightCalmTitle')}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', marginBottom: '14px' }}>{t('spotlightCalmSub')}</p>
                </div>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('calm')}>
                  {t('spotlightCalmCTA')} →
                </button>
              </div>
            </div>

            {/* Card 4: Live Melodies */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(78,168,152,0.28)' }}>
              <img src={HERSPACE_CONFIG.images.heroSunrise} alt={t('spotlightSingersTitle')} style={{ width: '100%', height: '155px', objectFit: 'cover' }} />
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-verified" style={{ marginBottom: '8px' }}>🎤 Masked Telephone Melodies</span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{t('spotlightSingersTitle')}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', marginBottom: '14px' }}>{t('spotlightSingersSub')}</p>
                </div>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('singers')}>
                  {t('spotlightSingersCTA')} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="section" style={{ background: 'var(--color-bg-lavender)' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">TAILORED SUPPORT AREAS</div>
            <h2>{t('categoriesTitle')}</h2>
            <p>{t('categoriesSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
            {categories.map(c => (
              <div
                key={c.id}
                className="card"
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: `4px solid ${c.color}` }}
                onClick={() => {
                  setActiveCategoryFilter(c.id);
                  navigate('support');
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{c.icon}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{c.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DUAL-TIER SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">TWO DISTINCT TIERS</div>
            <h2>{t('dualTierTitle')}</h2>
            <p>{t('dualTierSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '24px' }}>
            {/* Listener Tier */}
            <div className="card" style={{ border: '2px solid var(--color-primary-soft)', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-listener" style={{ marginBottom: '12px' }}>
                  PEER SUPPORT · EMOTIONAL FIRST AID
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{t('tierListenerTitle')}</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  {t('tierListenerPrice')} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>/ {t('tierListenerDuration')}</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: '12px 0 16px' }}>
                  {t('tierListenerDesc')}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <li>✓ {t('tierListenerF1')}</li>
                  <li>✓ {t('tierListenerF2')}</li>
                  <li>✓ {t('tierListenerF3')}</li>
                  <li>✓ <strong>{t('tierListenerF4')}</strong></li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                  {t('tierListenerBoundary')}
                </div>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setActiveRoleFilter('listener');
                    navigate('support');
                  }}
                >
                  Browse Trained Listeners (₹399) →
                </button>
              </div>
            </div>

            {/* Counsellor Tier */}
            <div className="card" style={{ border: '2px solid var(--color-accent-blue)', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-counsellor" style={{ marginBottom: '12px' }}>
                  LICENSED CLINICAL THERAPY · RCI
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{t('tierCounsellorTitle')}</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B6AB8', marginBottom: '4px' }}>
                  {t('tierCounsellorPrice')} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>/ {t('tierCounsellorDuration')}</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: '12px 0 16px' }}>
                  {t('tierCounsellorDesc')}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <li>✓ {t('tierCounsellorF1')}</li>
                  <li>✓ {t('tierCounsellorF2')}</li>
                  <li>✓ {t('tierCounsellorF3')}</li>
                  <li>✓ {t('tierCounsellorF4')}</li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                  {t('tierCounsellorBoundary')}
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    setActiveRoleFilter('counsellor');
                    navigate('support');
                  }}
                >
                  Browse Professional Counsellors (₹999) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPERTS DIRECTORY PREVIEW */}
      <section className="section" style={{ background: 'var(--color-warm-white)' }} id="experts-directory">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">VERIFIED CARE DIRECTORY</div>
            <h2>{t('directoryTitle')}</h2>
            <p>{t('directorySubtitle')}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveRoleFilter('all')}
            >
              {t('filterAll')}
            </button>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'listener' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveRoleFilter('listener')}
            >
              {t('filterListeners')}
            </button>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'counsellor' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveRoleFilter('counsellor')}
            >
              {t('filterCounsellors')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
            {filteredExperts.map(exp => (
              <div key={exp.id} className="expert-card">
                <div>
                  <div className="expert-header">
                    <div className="expert-avatar-wrap">
                      <img src={exp.avatar} alt={exp.name} className="expert-avatar" />
                      <span className="expert-verified-dot"></span>
                    </div>
                    <div className="expert-info">
                      <span className={`badge ${exp.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}`}>
                        {exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
                      </span>
                      <h3 className="expert-name" style={{ marginTop: '4px' }}>
                        {isTa && exp.nameTa ? exp.nameTa : exp.name}
                      </h3>
                      <div className="expert-qual">
                        {isTa && exp.qualificationTa ? exp.qualificationTa : exp.qualification}
                      </div>
                    </div>
                  </div>

                  <p className="expert-bio">{isTa && exp.bioTa ? exp.bioTa : exp.bio}</p>

                  <div className="expert-tags">
                    {(isTa && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties).slice(0, 3).map(s => (
                      <span key={s} className="expert-tag">{s}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', margin: '8px 0' }}>
                    ★ <strong>{exp.rating}</strong> ({exp.reviewsCount} reviews) · <strong>{exp.experienceYears}+</strong> yrs exp · 🕒 {isTa && exp.nextSlotTa ? exp.nextSlotTa : exp.nextSlot}
                  </div>
                </div>

                <div className="expert-footer">
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {formatINR(exp.priceDisplay)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>/ 60 mins</div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setProfileModalExpert(exp)}
                    >
                      {t('btnViewProfile')}
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setBookingModalExpert(exp)}
                    >
                      {t('btnBookNow')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">SIMPLE & RESPECTFUL</div>
            <h2>{t('howTitle')}</h2>
            <p>{t('howSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎁</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step1Title')}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{t('step1Desc')}</p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step2Title')}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{t('step2Desc')}</p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step3Title')}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section className="section" style={{ background: 'var(--color-bg-lavender)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
            <div className="eyebrow">TRANSPARENT INR PRICING</div>
            <h2 style={{ fontSize: '2.1rem', letterSpacing: '-0.025em', margin: '8px 0 12px' }}>{t('pricingTitle')}</h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{t('pricingSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '24px', maxWidth: '860px', margin: '0 auto' }}>
            {/* Free Trial Card */}
            <div className="card" style={{ padding: '32px', border: '1.5px solid var(--color-primary-soft)', borderRadius: '20px', background: '#FFF' }}>
              <span className="badge badge-lavender" style={{ marginBottom: '14px', fontWeight: 700 }}>
                FOR EVERY NEW MEMBER
              </span>
              <h3 style={{ fontSize: '1.65rem', marginBottom: '6px', color: 'var(--color-text-dark)' }}>{t('pricingTrialHeading')}</h3>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--color-primary)', margin: '12px 0 6px', letterSpacing: '-0.03em' }}>
                ₹0 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>/ 7 days free trial</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                7 days free trial @ ₹0, followed by ₹149 for the first 60 days validity, followed by monthly auto-renewal at ₹149.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-body)' }}>
                <li>✓ {t('pricingTrialFeature1')}</li>
                <li>✓ <strong style={{ color: 'var(--color-primary-dark)' }}>{t('pricingTrialFeature2')}</strong></li>
                <li>✓ {t('pricingTrialFeature3')}</li>
                <li>✓ {t('pricingTrialFeature4')}</li>
                <li>✓ {t('pricingTrialFeature5')}</li>
              </ul>

              <button className="btn btn-primary btn-block" style={{ marginTop: '20px' }} onClick={() => navigate(user ? 'space' : 'onb-register')}>
                {user ? t('spaceTitle') : 'Create Account (₹0 Today)'}
              </button>
            </div>

            {/* Continuation / Validity Card */}
            <div className="card" style={{ padding: '32px', border: '0.5px solid var(--color-border)', borderRadius: '20px', background: '#FFF' }}>
              <span className="badge badge-verified" style={{ marginBottom: '14px', fontWeight: 700 }}>
                EXTENDED VALIDITY PLAN
              </span>
              <h3 style={{ fontSize: '1.65rem', marginBottom: '6px', color: 'var(--color-text-dark)' }}>First 60 Days Validity</h3>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: '12px 0 6px', letterSpacing: '-0.03em' }}>
                ₹149 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>for first 60 days</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                Auto-renews monthly at ₹149 after the first 60 days. Cancel anytime with one tap in your settings.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-body)' }}>
                <li>✓ Continuous access to all 11 health categories</li>
                <li>✓ Retains private My Cycle logging on your device</li>
                <li>✓ Ongoing access to Calm Audio Sanctuary</li>
                <li>✓ Subsidized session bookings (₹399 / ₹999 / ₹99)</li>
                <li>✓ Zero hidden costs, cancel anytime</li>
              </ul>

              <button className="btn btn-outline btn-block" style={{ marginTop: '20px' }} onClick={() => openPolicyModal('cancellation')}>
                Review Policies & Terms →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
