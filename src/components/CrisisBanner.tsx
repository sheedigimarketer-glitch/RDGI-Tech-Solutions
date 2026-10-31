import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

export const CrisisBanner: React.FC<{ hideBannerBar?: boolean }> = ({ hideBannerBar = false }) => {
  const { t, isTa, isCrisisModalOpen, setIsCrisisModalOpen } = useApp();

  return (
    <>
      {!hideBannerBar && (
        <div className="crisis-top-banner" role="alert">
          <span>{t('crisisAlert')}</span>
          <button
            className="btn btn-sm btn-outline"
            style={{
              color: '#FFF',
              borderColor: 'rgba(255,255,255,0.5)',
              padding: '3px 12px',
              fontSize: '0.76rem',
              minHeight: '30px'
            }}
            onClick={() => setIsCrisisModalOpen(true)}
          >
            {t('crisisBannerBtn')}
          </button>
        </div>
      )}

      {isCrisisModalOpen && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <button
              className="modal-close-btn"
              onClick={() => setIsCrisisModalOpen(false)}
              aria-label={t('btnClose')}
            >
              ✕
            </button>
            <div className="eyebrow" style={{ color: 'var(--color-danger)' }}>
              {isTa ? 'அவசர உதவி எண்கள்' : 'EMERGENCY ASSISTANCE'}
            </div>
            <h2 style={{ color: 'var(--color-danger)', fontSize: '1.65rem', marginBottom: '8px' }}>
              {isTa ? '24/7 அவசர மற்றும் மனநல உதவி எண்கள்' : '24/7 Crisis Support Helplines'}
            </h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              {t('crisisAlert')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '18px 0' }}>
              {HERSPACE_CONFIG.crisisHelplines.map((h, idx) => (
                <div key={idx} className="card" style={{ borderLeft: '4px solid var(--color-danger)', padding: '14px' }}>
                  <h4 style={{ marginBottom: '4px' }}>{isTa ? h.nameTa : h.name}</h4>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-danger)' }}>
                    📞 <a href={`tel:${h.number.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{h.number}</a>
                    {h.tollFree ? ` / ${h.tollFree}` : ''}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                    {isTa ? h.descriptionTa : h.description}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary btn-block" onClick={() => setIsCrisisModalOpen(false)}>
              {t('btnClose')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
