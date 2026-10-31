import React from 'react';
import { useApp } from '../context/AppContext';

export const MaskedCallModal: React.FC = () => {
  const {
    t,
    telephonySession,
    holdCall,
    resumeCall,
    parkCall,
    retrieveCall,
    transferCall,
    reconnectCall,
    endCall
  } = useApp();

  if (!telephonySession) return null;

  const sess = telephonySession;

  let statusLabel = t('callStatusConnected');
  if (sess.state === 'ringing') statusLabel = t('callStatusQueued');
  if (sess.state === 'on_hold') statusLabel = t('callStatusOnHold');
  if (sess.state === 'parked') statusLabel = `${t('callStatusParked')} (Slot: ${sess.parkCode || 'P12'})`;
  if (sess.state === 'transferred') statusLabel = 'Transferring to Counsellor...';

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
          maxWidth: '520px',
          background: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={endCall}
          aria-label={t('btnClose')}
        >
          ✕
        </button>

        <div className="eyebrow" style={{ color: 'var(--color-success)' }}>
          🔒 {t('callModalBadge')}
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{t('callModalTitle')}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginBottom: '14px' }}>
          {t('callPrivacyGuarantee')}
        </p>

        {/* Bridge Status Card */}
        <div style={{ background: 'linear-gradient(135deg,#2B184C 0%,#4E3282 100%)', color: '#FFF', padding: '18px', borderRadius: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>
              Queue: {sess.queueId}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#A5D6A7', fontWeight: 700 }}>
              ● {sess.state.toUpperCase()}
            </span>
          </div>
          <h3 style={{ color: '#FFF', fontSize: '1.25rem', marginBottom: '4px' }}>{sess.partnerName}</h3>
          <div style={{ fontSize: '0.84rem', opacity: 0.9, marginBottom: '10px' }}>{statusLabel}</div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', lineHeight: 1.6 }}>
            <div>📱 <strong>Your Number:</strong> {sess.memberMaskedDisplay}</div>
            <div>🌉 <strong>Virtual Bridge:</strong> {sess.partnerMaskedDisplay}</div>
            <div>🛡️ <strong>Recording Policy:</strong> {t('callNoRecordingBadge')}</div>
          </div>
        </div>

        {/* Call Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {sess.state !== 'on_hold' ? (
            <button className="btn btn-secondary btn-sm" onClick={holdCall}>
              ⏸ {t('callBtnHold')}
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={resumeCall}>
              ▶ {t('callBtnResume')}
            </button>
          )}

          {sess.state !== 'parked' ? (
            <button className="btn btn-secondary btn-sm" onClick={parkCall}>
              🅿️ {t('callBtnPark')}
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => retrieveCall(sess.parkCode || 'P12')}
            >
              🔓 {t('callBtnRetrievePark')} ({sess.parkCode || 'P12'})
            </button>
          )}

          <button className="btn btn-outline btn-sm" onClick={transferCall}>
            ↗️ {t('callBtnTransfer')}
          </button>

          <button className="btn btn-outline btn-sm" onClick={reconnectCall}>
            🔄 {t('callBtnSimulateDrop')}
          </button>
        </div>

        <button className="btn btn-danger btn-block" onClick={endCall}>
          📴 {t('callBtnEnd')}
        </button>
      </div>
    </div>
  );
};
