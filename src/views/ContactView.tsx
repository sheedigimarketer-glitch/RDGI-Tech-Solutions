import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

export const ContactView: React.FC = () => {
  const { t, isTa, startMaskedCall, openPolicyModal } = useApp();

  const rawPhone = HERSPACE_CONFIG.support.phone.replace(/[^0-9]/g, '');
  const displayPhone = HERSPACE_CONFIG.support.phone;
  const supportEmail = HERSPACE_CONFIG.support.email;
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent('Hello HerSpace Support, I would like assistance with my account and services.')}`;

  return (
    <div className="container" style={{ padding: '48px 16px 80px', maxWidth: '960px' }}>
      {/* 1. Header */}
      <div className="section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div className="eyebrow">HELP & SUPPORT DESK</div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', margin: '10px 0 14px', color: 'var(--color-primary-dark)' }}>
          {isTa ? 'வாடிக்கையாளர் ஆதரவு மையம்' : 'Customer Support & Enquiry'}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
          {isTa
            ? 'முன்பதிவு, 7 நாள் இலவச சோதனை அல்லது தொழில்நுட்ப உதவிக்கு எங்கள் சென்னைக் குழுவைத் தொடர்பு கொள்ளுங்கள்.'
            : 'Have questions regarding your 7-day free trial, booking a counsellor, or 2-way masked calling? We are here to support you 7 days a week.'}
        </p>
      </div>

      {/* 2. Main Helpline Card - Phone & WhatsApp */}
      <div
        className="card"
        style={{
          padding: '40px 36px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
          border: '0.5px solid rgba(124, 92, 191, 0.3)',
          boxShadow: '0 12px 32px -4px rgba(62, 29, 101, 0.08)',
          marginBottom: '40px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '580px' }}>
            <span className="badge badge-verified" style={{ marginBottom: '12px', fontWeight: 700 }}>
              DIRECT CUSTOMER CARE HELPLINE
            </span>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-dark)', margin: '4px 0 12px' }}>
              We&apos;re Always By Your Side
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Connect directly with our care coordinators for immediate help with booking confirmation, rescheduling assistance, or audio troubleshooting.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {/* Phone Block */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '0.5px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Support Telephone
                </div>
                <a
                  href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '4px'
                  }}
                >
                  {displayPhone}
                </a>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '4px' }}>
                  Mon – Sun · 9:00 AM – 9:00 PM IST
                </div>
              </div>

              {/* WhatsApp Block */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '0.5px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#15803D', fontWeight: 700, letterSpacing: '0.04em' }}>
                  WhatsApp Quick Desk
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#15803D',
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '4px'
                  }}
                >
                  Chat on WhatsApp
                </a>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '4px' }}>
                  Fast responses within ~15 minutes
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
            <a
              href={`tel:${displayPhone.replace(/\s+/g, '')}`}
              className="btn btn-primary btn-lg"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Call Helpline</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ textDecoration: 'none', textAlign: 'center', borderColor: '#BBF7D0', color: '#15803D' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>WhatsApp Us</span>
            </a>

            <button
              className="btn btn-outline"
              onClick={() => startMaskedCall('exp-anita', 'Customer Care Simulator', 'counsellor')}
            >
              <span>Test Masked Telephony</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Official Email & Registered Address Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Official Email</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>Response within 24 hours</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
            For privacy inquiries, professional onboarding verification, or policy questions:
          </p>
          <a
            href={`mailto:${supportEmail}`}
            style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            {supportEmail}
          </a>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-accent-pink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9D174D' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Registered Presence</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>Chennai, Tamil Nadu, India</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
            Operated under strict Indian data privacy compliance and clinical psychology ethics.
          </p>
          <button className="btn btn-sm btn-outline" onClick={() => openPolicyModal('privacy')}>
            View Privacy & Compliance
          </button>
        </div>
      </div>
    </div>
  );
};
