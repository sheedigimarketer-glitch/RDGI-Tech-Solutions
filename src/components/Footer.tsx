import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, navigate, openPolicyModal } = useApp();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <img
              src="assets/herspace-client-logo.webp"
              alt="HerSpace Logo"
              style={{ height: '38px', width: 'auto', marginBottom: '12px' }}
            />
            <p className="footer-tagline">
              SHARE · LISTEN · HEAL · GROW
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              A safe, confidential emotional sanctuary exclusively for women and transgender women aged 18+.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Care & Support</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => navigate('support')}>Trained Listeners (₹399)</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('support')}>Professional Counsellors (₹999)</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('singers')}>HerSpace Live Melodies</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('calm')}>Calm Audio Sanctuary</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Wellbeing</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => navigate('wellbeing')}>11 Wellbeing Topics</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('cycle')}>My Cycle Period Tracker</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('how')}>How It Works & FAQs</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('pricing')}>Membership & Pricing (₹)</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Trust & Policies</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => openPolicyModal('privacy')}>Privacy & Masked Calling</button></li>
              <li><button className="footer-link-btn" onClick={() => openPolicyModal('terms')}>Terms of Service (18+)</button></li>
              <li><button className="footer-link-btn" onClick={() => openPolicyModal('cancellation')}>Reschedule & Refund Policy</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('admin')}>Staff Governance</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} HerSpace. All rights reserved. Exclusively for women and transgender women aged 18+. All amounts in Indian Rupees (₹).
          </div>
          <div className="footer-bottom-links">
            <button className="footer-link-btn" onClick={() => openPolicyModal('privacy')}>{t('navPolicies')}</button>
            <span>·</span>
            <button className="footer-link-btn" onClick={() => navigate('admin')}>Staff Governance Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
