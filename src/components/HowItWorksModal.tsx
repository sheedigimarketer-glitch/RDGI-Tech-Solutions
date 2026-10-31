import React from 'react';
import { useApp } from '../context/AppContext';

export const HowItWorksModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { t, navigate } = useApp();

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 10, 30, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          padding: '32px 28px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#666',
            fontSize: '18px'
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: '20px' }}>
          <span className="badge badge-lavender" style={{ fontWeight: 700, marginBottom: '8px' }}>
            SIMPLE & RESPECTFUL
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#3b1d36', margin: '4px 0 6px 0' }}>
            {t('howTitle')}
          </h2>
          <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            {t('howSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Step 1 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--color-primary-soft)',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#5E2750',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              1
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: '#3b1d36' }}>
                {t('step1Title')}
              </h3>
              <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                {t('step1Desc')}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--color-accent-pink-soft)',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#9D174D',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              2
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: '#3b1d36' }}>
                {t('step2Title')}
              </h3>
              <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                {t('step2Desc')}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--color-accent-blue-soft)',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#1E40AF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              3
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: '#3b1d36' }}>
                {t('step3Title')}
              </h3>
              <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 600 }}
            onClick={() => {
              onClose();
              navigate('support');
            }}
          >
            Explore Directory →
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '12px 20px', borderRadius: '12px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
