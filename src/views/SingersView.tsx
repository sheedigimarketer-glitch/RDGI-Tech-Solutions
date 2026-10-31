import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/config';

export const SingersView: React.FC = () => {
  const {
    isTa,
    singers,
    setBookingModalExpert,
    startMaskedCall,
    playCalmTrack,
    pauseCalmTrack,
    calmState
  } = useApp();

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '1040px' }}>
      <div className="section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
        <div className="eyebrow">DEDICATED VOCAL THERAPY & LIVE SINGERS</div>
        <h2 style={{ fontSize: '2.1rem', letterSpacing: '-0.025em', margin: '8px 0 12px' }}>
          {isTa ? 'நேரலைப் பாடகர்கள் — அமைதி மெல்லிசை' : 'HerSpace Live Melodies'}
        </h2>
        <p style={{ fontSize: '1.02rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          {isTa
            ? 'தனிமை, தூக்கமின்மை அல்லது மனச்சோர்விலிருந்து விடுபட எண் மறைக்கப்பட்ட தொலைபேசி வழியே தாலாட்டு மற்றும் மெல்லிசைப் பாடும் கலைஞர்கள்.'
            : 'Scheduled private telephone vocal music sessions to help women unwind from insomnia, grief, or loneliness. Featuring Love melody at 15 mins ₹99.'}
        </p>
      </div>

      {/* Love Melody Special Spotlight Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
          border: '1px solid rgba(216, 108, 155, 0.3)',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C5CBF, #D86C9B)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            🎵
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-pink">NEW TIER ADDED</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>
                Love Melody — 15 Mins @ ₹99
              </strong>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
              A soothing 15-minute one-on-one telephone vocal comfort session designed to alleviate immediate anxiety and soothe racing thoughts.
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setBookingModalExpert(singers[0])}
        >
          Book Love Melody (₹99) →
        </button>
      </div>

      {/* Singers Listing Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {singers.map(s => {
          const displayName = isTa && s.nameTa ? s.nameTa : s.name;
          const displayRole = isTa && s.roleLabelTa ? s.roleLabelTa : s.roleLabelEn;
          const displayStyles = isTa && s.stylesTa ? s.stylesTa : s.stylesEn;
          const displayBio = isTa && s.bioTa ? s.bioTa : s.bioEn;
          const displaySlot = isTa && s.nextAvailableTa ? s.nextAvailableTa : s.nextAvailable;

          return (
            <div
              key={s.id}
              className="expert-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <div>
                <div className="expert-header">
                  <div
                    className="singer-avatar"
                    style={{ background: s.avatarColor || '#D86C9B' }}
                  >
                    {displayName.charAt(0)}
                  </div>
                  <div className="expert-info">
                    <span className="badge badge-verified">{displayRole}</span>
                    <h3 className="expert-name" style={{ marginTop: '4px', fontSize: '1.25rem' }}>{displayName}</h3>
                    <div className="expert-qual">
                      {isTa && s.qualificationTa ? s.qualificationTa : s.qualification}
                    </div>
                  </div>
                </div>

                <p className="expert-bio" style={{ margin: '14px 0', minHeight: '64px' }}>{displayBio}</p>

                <div className="expert-tags">
                  {displayStyles.map(style => (
                    <span key={style} className="expert-tag">🎵 {style}</span>
                  ))}
                </div>

                {/* Available Tiers */}
                <div style={{ margin: '16px 0', padding: '12px', background: 'var(--color-warm-white)', borderRadius: '12px', border: '0.5px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-ink-muted)', marginBottom: '8px' }}>
                    Available Melody Tiers:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                      <span style={{ fontWeight: 600 }}>💖 Love melody (15 mins)</span>
                      <strong style={{ color: 'var(--color-primary)' }}>₹99</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                      <span>🌙 Soothing Lullaby (20 mins)</span>
                      <strong style={{ color: 'var(--color-primary)' }}>₹149</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                      <span>🪕 Deep Calm Raga (30 mins)</span>
                      <strong style={{ color: 'var(--color-primary)' }}>₹199</strong>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
                  <div>★ <strong>{s.rating}</strong> ({s.sessionsCompleted} melodies sung) · <strong>{s.experienceYears}+</strong> yrs vocal experience</div>
                  <div>🕒 Next Session: <strong>{displaySlot}</strong></div>
                  <div>🗣 Languages: <strong>{s.languages.join(', ')}</strong></div>
                </div>
              </div>

              <div className="expert-footer" style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    From ₹99
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>Love melody tier</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      if (calmState.isPlaying) pauseCalmTrack();
                      else playCalmTrack('calm_03_veena_dawn');
                    }}
                    title="Audio sample"
                  >
                    {calmState.isPlaying ? '⏸ Mute' : '🔊 Sample'}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setBookingModalExpert(s)}
                  >
                    Schedule Melody
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
