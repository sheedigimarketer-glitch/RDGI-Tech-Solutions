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
            <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', marginBottom: '8px' }}>
              🎁 COMPLIMENTARY VOUCHER
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
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
          onClick={() => navigate('support')}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>👥</div>
          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{t('spaceActionBook')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
          onClick={() => navigate('singers')}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🎤</div>
          <strong style={{ fontSize: '0.9rem', display: 'block' }}>Live Melodies</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
          onClick={() => navigate('calm')}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🎵</div>
          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{t('spaceActionCalm')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
          onClick={() => navigate('cycle')}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🌸</div>
          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{t('spaceActionCycle')}</strong>
        </button>

        <button
          className="card"
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
          onClick={() => navigate('wellbeing')}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>📖</div>
          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{t('spaceActionWellbeing')}</strong>
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                    📅 {apt.date} at {apt.time} ({apt.mode})
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
                  style={{ cursor: 'pointer', padding: '8px 10px', background: 'var(--color-warm-white)', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}
                  onClick={() => navigate('wellbeing')}
                >
                  ⭐ {isTa ? a.title.ta : a.title.en}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
