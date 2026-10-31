import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, navigate, openPolicyModal } = useApp();

  // Mobile accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  return (
    <footer
      className="app-footer"
      style={{
        background: '#2B1233',
        color: 'rgba(255, 255, 255, 0.85)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '36px',
        paddingBottom: 'calc(var(--bottom-bar-height, 64px) + 32px)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Top Brand & Mission Summary */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            paddingBottom: '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ maxWidth: '380px' }}>
            <img
              src="/logo.png"
              alt="HerSpace Logo"
              style={{ height: '34px', width: 'auto', marginBottom: '10px' }}
            />
            <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#D86C9B', marginBottom: '6px' }}>
              SHARE · LISTEN · HEAL · GROW
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, margin: 0 }}>
              A safe, confidential emotional sanctuary exclusively for women and transgender women aged 18+.
            </p>
          </div>

          {/* Quick Direct Chips (Horizontal Wrap) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="footer-chip-btn"
              onClick={() => navigate('support')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Care Directory (₹399 / ₹999)
            </button>
            <button
              type="button"
              className="footer-chip-btn"
              onClick={() => navigate('singers')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Live Melodies
            </button>
            <button
              type="button"
              className="footer-chip-btn"
              onClick={() => navigate('pricing')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Plans (7-Day Trial)
            </button>
          </div>
        </div>

        {/* Desktop Multi-Column / Mobile Compact Accordion */}
        <div className="footer-links-container" style={{ padding: '24px 0 16px 0' }}>
          {/* Section 1: Care & Support */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('care')}
            >
              <span>Care & Support</span>
              <span className={`footer-chevron ${openSection === 'care' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`footer-accordion-body ${openSection === 'care' ? 'open' : ''}`}>
              <ul className="footer-link-list">
                <li><button className="footer-link-btn" onClick={() => navigate('support')}>Trained Listeners (₹399)</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('support')}>Professional Counsellors (₹999)</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('singers')}>Live Vocal Melodies</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('calm')}>Calm Audio Sanctuary</button></li>
              </ul>
            </div>
          </div>

          {/* Section 2: Wellbeing */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('wellbeing')}
            >
              <span>Wellbeing</span>
              <span className={`footer-chevron ${openSection === 'wellbeing' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`footer-accordion-body ${openSection === 'wellbeing' ? 'open' : ''}`}>
              <ul className="footer-link-list">
                <li><button className="footer-link-btn" onClick={() => navigate('wellbeing')}>11 Wellbeing Topics (EN & தமிழ்)</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('cycle')}>My Cycle Period Tracker</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('how')}>How It Works</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('pricing')}>7-Day Trial & ₹149 Plans</button></li>
              </ul>
            </div>
          </div>

          {/* Section 3: Trust & Governance */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('policies')}
            >
              <span>Trust & Governance</span>
              <span className={`footer-chevron ${openSection === 'policies' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`footer-accordion-body ${openSection === 'policies' ? 'open' : ''}`}>
              <ul className="footer-link-list">
                <li><button className="footer-link-btn" onClick={() => navigate('contact')}>Support & Contact Desk</button></li>
                <li><button className="footer-link-btn" onClick={() => openPolicyModal('privacy')}>Privacy & 2-Way Phone Masking</button></li>
                <li><button className="footer-link-btn" onClick={() => openPolicyModal('terms')}>Terms of Service (18+)</button></li>
                <li><button className="footer-link-btn" onClick={() => openPolicyModal('cancellation')}>Reschedule & Refund Policy</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('admin')}>Staff Governance Portal</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div>
            © {new Date().getFullYear()} HerSpace. All rights reserved. 100% Confidential.
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => openPolicyModal('privacy')}
              style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}
            >
              {t('navPolicies')}
            </button>
            <span>•</span>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate('contact')}
              style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
