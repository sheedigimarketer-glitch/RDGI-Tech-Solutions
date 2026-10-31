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
    setBookingModalExpert
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
    {
      id: 'mental',
      title: t('catMental'),
      desc: t('catMentalDesc'),
      color: '#5B8BD9',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 3"></path>
        </svg>
      )
    },
    {
      id: 'relationships',
      title: t('catRelationships'),
      desc: t('catRelationshipsDesc'),
      color: '#C85A8E',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'career',
      title: t('catCareer'),
      desc: t('catCareerDesc'),
      color: '#5C6BC0',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      id: 'grief',
      title: t('catGrief'),
      desc: t('catGriefDesc'),
      color: '#7C5CBF',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
          <line x1="16" y1="8" x2="2" y2="22"></line>
        </svg>
      )
    },
    {
      id: 'motherhood',
      title: t('catMotherhood'),
      desc: t('catMotherhoodDesc'),
      color: '#D86C9B',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
      )
    },
    {
      id: 'wellness',
      title: t('catWellness'),
      desc: t('catWellnessDesc'),
      color: '#4EA898',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 7-7c4.5 0 9 2 9 7 0 5-4.5 7-9 7z"></path>
          <path d="M11 20V6"></path>
        </svg>
      )
    }
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

            <h1 className="hero-title" style={{ paddingTop: '28px', lineHeight: 1.25, overflow: 'visible' }}>
              {formattedHeroTitle}
            </h1>

            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            <div className="hero-cta-group">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate(user ? 'space' : 'onb-register')}
              >
                <span>Go to My Personal Space →</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('support')}
              >
                <span>Browse Directory</span>
              </button>
            </div>
          </div>

          <div className="hero-visual-col" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'stretch' }}>
            <div
              className="hero-image-frame"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '480px',
                overflow: 'hidden',
                borderRadius: '24px',
                display: 'block',
                position: 'relative',
                border: 'none',
                boxShadow: '0 16px 36px -6px rgba(45, 22, 66, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
              }}
            >
              <img
                src={HERSPACE_CONFIG.images.heroSunrise}
                alt={t('heroBannerAlt')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '24px',
                  aspectRatio: '4/3',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ECOSYSTEM SPOTLIGHTS - Equalized 24px Gap Grid */}
      <section className="section" style={{ paddingTop: '36px', paddingBottom: '36px' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">HERSPACE 4.0 ECOSYSTEM</div>
            <h2>{t('spotlightSectionTitle')}</h2>
            <p>{t('spotlightSectionSub')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* Card 1: Life & Wellbeing */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(124, 92, 191, 0.22)', height: '100%' }}>
              <div>
                <img src={HERSPACE_CONFIG.images.reflectionOutdoor} alt={t('spotlightWellbeingTitle')} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <span className="badge badge-verified" style={{ marginBottom: '10px' }}>11 Topics · EN & தமிழ்</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{t('spotlightWellbeingTitle')}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{t('spotlightWellbeingSub')}</p>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <button className="btn btn-primary btn-block" onClick={() => navigate('wellbeing')}>
                  {t('spotlightWellbeingCTA')} →
                </button>
              </div>
            </div>

            {/* Card 2: My Cycle */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(216, 108, 155, 0.28)', height: '100%' }}>
              <div>
                <img src={HERSPACE_CONFIG.images.hopePortrait} alt={t('spotlightCycleTitle')} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <span className="badge badge-listener" style={{ marginBottom: '10px' }}>Opt-In & Private</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{t('spotlightCycleTitle')}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{t('spotlightCycleSub')}</p>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('cycle')}>
                  {t('spotlightCycleCTA')} →
                </button>
              </div>
            </div>

            {/* Card 3: Calm Audio Sanctuary */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(91, 139, 217, 0.28)', height: '100%' }}>
              <div>
                <img src={HERSPACE_CONFIG.images.calmCup} alt={t('spotlightCalmTitle')} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <span className="badge badge-counsellor" style={{ marginBottom: '10px' }}>Meditation & Sleep</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{t('spotlightCalmTitle')}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{t('spotlightCalmSub')}</p>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('calm')}>
                  {t('spotlightCalmCTA')} →
                </button>
              </div>
            </div>

            {/* Card 4: Live Melodies */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(78, 168, 152, 0.28)', height: '100%' }}>
              <div>
                <img src={HERSPACE_CONFIG.images.heroSunrise} alt={t('spotlightSingersTitle')} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <span className="badge badge-verified" style={{ marginBottom: '10px' }}>Masked Telephone Melodies</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{t('spotlightSingersTitle')}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{t('spotlightSingersSub')}</p>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <button className="btn btn-secondary btn-block" onClick={() => navigate('singers')}>
                  {t('spotlightSingersCTA')} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION - Clean Minimalist Icons (No Cartoon Emojis) */}
      <section className="section" style={{ background: 'var(--color-bg-lavender)' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">TAILORED SUPPORT AREAS</div>
            <h2>{t('categoriesTitle')}</h2>
            <p>{t('categoriesSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {categories.map(c => (
              <div
                key={c.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  borderLeft: `4px solid ${c.color}`,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
                onClick={() => {
                  setActiveCategoryFilter(c.id);
                  navigate('support');
                }}
              >
                <div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: '0.5px solid rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: c.color,
                      marginBottom: '14px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {c.renderIcon()}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-primary-dark)' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.55 }}>{c.desc}</p>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: c.color, marginTop: '16px' }}>
                  Explore Care →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DUAL-TIER SECTION - Equalized 24px Gap Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">TWO DISTINCT TIERS</div>
            <h2>{t('dualTierTitle')}</h2>
            <p>{t('dualTierSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* Listener Tier */}
            <div
              className="card"
              style={{
                border: '1.5px solid var(--color-primary-soft)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px',
                height: '100%'
              }}
            >
              <div>
                <span className="badge badge-listener" style={{ marginBottom: '14px', fontWeight: 700 }}>
                  PEER SUPPORT · EMOTIONAL FIRST AID
                </span>
                <h3 style={{ fontSize: '1.65rem', marginBottom: '6px' }}>{t('tierListenerTitle')}</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                  {t('tierListenerPrice')} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>/ {t('tierListenerDuration')}</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: '10px 0 18px', lineHeight: 1.55 }}>
                  {t('tierListenerDesc')}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span> {t('tierListenerF1')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span> {t('tierListenerF2')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span> {t('tierListenerF3')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span> <strong>{t('tierListenerF4')}</strong></li>
                </ul>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                  {t('tierListenerBoundary')}
                </div>
                <button
                  className="btn btn-secondary btn-block btn-lg"
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
            <div
              className="card"
              style={{
                border: '1.5px solid var(--color-accent-blue)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px',
                height: '100%'
              }}
            >
              <div>
                <span className="badge badge-counsellor" style={{ marginBottom: '14px', fontWeight: 700 }}>
                  LICENSED CLINICAL THERAPY · RCI
                </span>
                <h3 style={{ fontSize: '1.65rem', marginBottom: '6px' }}>{t('tierCounsellorTitle')}</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3B6AB8', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                  {t('tierCounsellorPrice')} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>/ {t('tierCounsellorDuration')}</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: '10px 0 18px', lineHeight: 1.55 }}>
                  {t('tierCounsellorDesc')}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B6AB8', fontWeight: 700 }}>✓</span> {t('tierCounsellorF1')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B6AB8', fontWeight: 700 }}>✓</span> {t('tierCounsellorF2')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B6AB8', fontWeight: 700 }}>✓</span> {t('tierCounsellorF3')}</li>
                  <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B6AB8', fontWeight: 700 }}>✓</span> {t('tierCounsellorF4')}</li>
                </ul>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                  {t('tierCounsellorBoundary')}
                </div>
                <button
                  className="btn btn-primary btn-block btn-lg"
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

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '24px 0 32px 0', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '10px 22px', borderRadius: '9999px' }}
              onClick={() => setActiveRoleFilter('all')}
            >
              {t('filterAll')}
            </button>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'listener' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '10px 22px', borderRadius: '9999px' }}
              onClick={() => setActiveRoleFilter('listener')}
            >
              {t('filterListeners')}
            </button>
            <button
              className={`btn btn-sm ${activeRoleFilter === 'counsellor' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '10px 22px', borderRadius: '9999px' }}
              onClick={() => setActiveRoleFilter('counsellor')}
            >
              {t('filterCounsellors')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {filteredExperts.map(exp => (
              <div key={exp.id} className="expert-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
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

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', margin: '10px 0' }}>
                    ★ <strong>{exp.rating}</strong> ({exp.reviewsCount} reviews) · <strong>{exp.experienceYears}+</strong> yrs exp · 🕒 {isTa && exp.nextSlotTa ? exp.nextSlotTa : exp.nextSlot}
                  </div>
                </div>

                <div className="expert-footer" style={{ marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {formatINR(exp.priceDisplay)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>/ 60 mins</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
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

      {/* 6. HOW IT WORKS - Minimalist Apple Line Icons (Zero Cartoon Emojis) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">SIMPLE & RESPECTFUL</div>
            <h2>{t('howTitle')}</h2>
            <p>{t('howSubtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '20px' }}>
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step1Title')}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>{t('step1Desc')}</p>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '16px', fontWeight: 600 }}>Step 01</div>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '20px' }}>
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--color-accent-pink-soft)',
                    color: '#9D174D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step2Title')}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>{t('step2Desc')}</p>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '16px', fontWeight: 600 }}>Step 02</div>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '20px' }}>
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--color-accent-blue-soft)',
                    color: '#1E40AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t('step3Title')}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>{t('step3Desc')}</p>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '16px', fontWeight: 600 }}>Step 03</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING TEASER CARD (De-duplicated Single Teaser Card) */}
      <section className="section" style={{ background: 'var(--color-bg-lavender)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div
            className="card"
            style={{
              padding: '44px 36px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7FE 100%)',
              border: '0.5px solid rgba(124, 92, 191, 0.28)',
              boxShadow: '0 12px 32px -4px rgba(62, 29, 101, 0.08)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '18px'
            }}
          >
            <span className="badge badge-lavender" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
              HERSPACE MEMBERSHIP
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)',
                margin: 0,
                color: 'var(--color-primary-dark)',
                letterSpacing: '-0.025em',
                lineHeight: 1.25
              }}
            >
              Experience HerSpace free for 7 days. Plans start at ₹149/mo
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-ink-muted)',
                maxWidth: '600px',
                margin: 0,
                lineHeight: 1.65
              }}
            >
              Begin your journey with 7 days completely free at ₹0, including 1 complimentary 30-minute Trained Listener session. Then continue with ₹149 for your first 60 days validity, followed by auto-renewal at ₹149/month with 1-tap cancellation.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('pricing')}>
                <span>View Full Pricing & Plans</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate(user ? 'space' : 'onb-register')}>
                <span>{user ? t('spaceTitle') : 'Start 7-Day Free Trial (₹0)'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
