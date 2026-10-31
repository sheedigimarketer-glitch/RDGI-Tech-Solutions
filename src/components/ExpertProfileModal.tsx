import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/config';

export const ExpertProfileModal: React.FC = () => {
  const {
    t,
    isTa,
    profileModalExpert,
    setProfileModalExpert,
    setBookingModalExpert,
    startMaskedCall
  } = useApp();

  if (!profileModalExpert) return null;

  const exp = profileModalExpert;
  const displayName = isTa && exp.nameTa ? exp.nameTa : exp.name;
  const displayQual = isTa && exp.qualificationTa ? exp.qualificationTa : exp.qualification;
  const displayBio = isTa && exp.bioTa ? exp.bioTa : exp.bio;
  const displaySpecs = isTa && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties;

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-dialog"
        style={{
          background: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setProfileModalExpert(null)}
          aria-label={t('btnClose')}
        >
          ✕
        </button>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <img
            src={exp.avatar}
            alt={displayName}
            style={{ width: '78px', height: '78px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-lavender)' }}
          />
          <div>
            <span className={`badge ${exp.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}`}>
              {exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
            </span>
            <h2 style={{ margin: '6px 0 2px', fontSize: '1.45rem' }}>{displayName}</h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>{displayQual}</div>
          </div>
        </div>

        <p style={{ fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '16px' }}>{displayBio}</p>

        <div style={{ background: 'var(--color-warm-white)', padding: '16px', borderRadius: 'var(--radius-md)', margin: '16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.86rem' }}>
            <div><strong>Experience:</strong> {exp.experienceYears}+ Years</div>
            <div><strong>Rating:</strong> ★ {exp.rating} ({exp.reviewsCount} reviews)</div>
            <div><strong>Languages:</strong> {exp.languages.join(', ')}</div>
            <div><strong>Session Fee:</strong> {formatINR(exp.priceDisplay)} / 60 mins</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Focus Areas:</strong>
          <div className="expert-tags">
            {displaySpecs.map(s => (
              <span key={s} className="expert-tag">{s}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => {
              setProfileModalExpert(null);
              startMaskedCall(exp.id, displayName, exp.role);
            }}
          >
            📞 Masked Call
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => {
              setProfileModalExpert(null);
              setBookingModalExpert(exp);
            }}
          >
            {t('btnBookNow')} ({formatINR(exp.priceDisplay)}) →
          </button>
        </div>
      </div>
    </div>
  );
};
