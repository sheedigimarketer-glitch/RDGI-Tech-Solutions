import React from 'react';
import { useApp } from '../context/AppContext';

export const PolicyModal: React.FC = () => {
  const {
    t,
    isTa,
    policyModalType,
    closePolicyModal
  } = useApp();

  if (!policyModalType) return null;

  let title = t('policyTitle');
  let content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ background: 'var(--color-warm-white)', padding: '14px 16px', borderRadius: '14px', border: '0.5px solid var(--color-border)' }}>
        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-primary-dark)' }}>
          🚫 Cancellation Policy
        </strong>
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
          Appointments cannot be cancelled once confirmed. Professional and listener time is reserved specifically for you.
        </p>
      </div>

      <div style={{ background: 'var(--color-warm-white)', padding: '14px 16px', borderRadius: '14px', border: '0.5px solid var(--color-border)' }}>
        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-primary-dark)' }}>
          🗓️ Rescheduling Policy (Strict)
        </strong>
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
          <strong>Only one reschedule allowed</strong> (Reschedule once). Must be submitted at least 4 hours before the scheduled session.
        </p>
      </div>

      <div style={{ background: 'var(--color-warm-white)', padding: '14px 16px', borderRadius: '14px', border: '0.5px solid var(--color-border)' }}>
        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-primary-dark)' }}>
          🛡️ Care Provider No-Show Guarantee
        </strong>
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
          If a listener or counsellor fails to join the call, a full refund or immediate rebooking session is provided.
        </p>
      </div>
    </div>
  );

  if (policyModalType === 'privacy') {
    title = isTa ? 'தனியுரிமை & இருவழி எண் மறைப்பு பாதுகாப்பு' : 'Privacy & 2-Way Number Masking Notice';
    content = (
      <div>
        <p style={{ lineHeight: 1.6 }}>{t('safetyP1')}</p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8, margin: '14px 0', fontSize: '0.9rem' }}>
          <li><strong>2-Way Masked Telephone Bridge:</strong> Neither members nor professionals can view each other's real mobile numbers.</li>
          <li><strong>Zero Health Disclosure:</strong> Period logs (My Cycle) and private wellbeing questions are strictly isolated to your device.</li>
          <li><strong>Zero Default Recording:</strong> {t('safetyP2')}</li>
        </ul>
      </div>
    );
  } else if (policyModalType === 'terms') {
    title = isTa ? 'பயன்பாட்டு விதிமுறைகள் (18+)' : 'Terms of Service (18+ Women & Transgender Women)';
    content = (
      <div style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
        <p><strong>1. Eligibility:</strong> {t('eligibilityText')}</p>
        <p><strong>2. Trained Listeners:</strong> {t('tierListenerBoundary')}</p>
        <p><strong>3. Licensed Counsellors:</strong> {t('tierCounsellorBoundary')}</p>
        <p><strong>4. Ethical Boundaries:</strong> HerSpace focuses strictly on evidence-based mental health, vocal therapy, and certified professional counselling with clear ethical boundaries.</p>
        <p><strong>5. Rescheduling:</strong> Only one reschedule allowed per booked session.</p>
      </div>
    );
  }

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
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '0.5px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={closePolicyModal}
          aria-label={t('btnClose')}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', letterSpacing: '-0.02em', color: 'var(--color-text-dark)' }}>{title}</h2>
        <div style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', marginBottom: '24px' }}>
          {content}
        </div>

        <button className="btn btn-secondary btn-block" onClick={closePolicyModal}>
          {t('btnClose')}
        </button>
      </div>
    </div>
  );
};
