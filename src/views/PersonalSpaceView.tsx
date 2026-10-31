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
    <div className="container space-page" style={{ maxWidth: '960px' }}>
      {/* Hero Welcome */}
      <div className="space-hero">
        <div>
          <span className="badge badge-verified" style={{ marginBottom: '6px' }}>
            {t('spaceTrialActive')} · {daysRemaining} {t('spaceTrialDaysRemaining')}
          </span>
          <h1 className="space-hello">
            {isTa ? `வணக்கம், ${user?.fullName?.split(' ')[0] || 'தோழி'}!` : `Welcome, ${user?.fullName?.split(' ')[0] || 'Friend'}!`}
          </h1>
          <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>
            {t('spaceSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('dashboard')}>
            {t('navBookings')} ({upcoming.length})
          </button>
        </div>
      </div>

      {/* Complimentary Voucher Banner */}
      {voucherAvailable ? (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #7C5CBF 0%, #D86C9B 100%)',
            color: '#FFF',
            padding: '24px',
            marginBottom: '24px',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
              <span>COMPLIMENTARY VOUCHER</span>
            </span>
            <h3 style={{ color: '#FFF', fontSize: '1.4rem', margin: '4px 0 6px' }}>
              {t('spaceVoucherHeading')}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem' }}>
              {t('spaceVoucherValid')}
            </p>
          </div>

          <button
            className="btn btn-primary"
            style={{ background: '#FFF', color: 'var(--color-primary-dark)', fontWeight: 800 }}
            onClick={() => setBookingModalExpert(defaultListener)}
          >
            {t('spaceBtnRedeemVoucher')} →
          </button>
        </div>
      ) : null}

      {/* Quick Action Grid */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{t('spaceQuickActions')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '28px' }}>
        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('support')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(94, 39, 80, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E2750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-primary-dark)' }}>{t('spaceActionBook')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('singers')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(94, 39, 80, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E2750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-primary-dark)' }}>Live Melodies</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('calm')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(94, 39, 80, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E2750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-primary-dark)' }}>{t('spaceActionCalm')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('cycle')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(94, 39, 80, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E2750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-primary-dark)' }}>{t('spaceActionCycle')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('wellbeing')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(94, 39, 80, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E2750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-primary-dark)' }}>{t('spaceActionWellbeing')}</strong>
        </button>
      </div>

      {/* Grid: Upcoming Sessions & Saved Bookmarks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
        {/* Bookings */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{t('spaceUpcomingBookings')}</h3>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('dashboard')}>View All</button>
          </div>

          {upcoming.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>{t('spaceNoBookings')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcoming.map(apt => (
                <div key={apt.id} style={{ background: 'var(--color-warm-white)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{apt.expertName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{apt.date} at {apt.time} ({apt.mode})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Articles */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Saved Wellbeing Topics ({savedArticles.length})</h3>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('wellbeing')}>Browse Hub</button>
          </div>

          {savedArticles.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
              No articles bookmarked yet. Bookmark any topic in the Life & Wellbeing Hub for quick access.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedArticles.map(a => (
                <div
                  key={a.id}
                  style={{ cursor: 'pointer', padding: '10px 12px', background: 'var(--color-warm-white)', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => navigate('wellbeing')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D86C9B" strokeWidth="2" width="16" height="16">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{isTa ? a.title.ta : a.title.en}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
