import React from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

export const PricingView: React.FC = () => {
  const { t, isTa, user, navigate, openPolicyModal } = useApp();

  // Dynamically compute validity dates
  const today = new Date();
  const trialEndDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const extendedValidityDate = new Date(today.getTime() + 67 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="container" style={{ padding: '48px 16px 80px', maxWidth: '1080px' }}>
      {/* 1. Header & Value Proposition */}
      <div className="section-header" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
        <div className="eyebrow">TRANSPARENT INR PRICING</div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', margin: '10px 0 14px', color: 'var(--color-primary-dark)' }}>
          {isTa ? 'எளிய, வெளிப்படையான சந்தா திட்டங்கள்' : 'Fair, Transparent Care for Every Woman'}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
          {isTa
            ? 'மறைமுக கட்டணங்கள் இன்றி, 7 நாட்கள் இலவச சோதனையுடன் தொடங்குங்கள். உங்கள் தனியுரிமை மற்றும் பாதுகாப்பே எங்கள் முதன்மை நோக்கம்.'
            : 'Begin with 7 days completely free at ₹0. Continue with ₹149 for your first 60 days validity, followed by simple monthly auto-renewal. Cancel anytime in one tap.'}
        </p>
      </div>

      {/* 2. Primary Subscription Plans - 24px Equalized Flex Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
          marginBottom: '56px'
        }}
      >
        {/* Tier 1: 7-Day Free Trial */}
        <div
          className="card"
          style={{
            padding: '36px 32px',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF9FE 100%)',
            border: '1.5px solid var(--color-primary-soft)',
            boxShadow: '0 12px 32px -4px rgba(62, 29, 101, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-lavender" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                FOR EVERY NEW MEMBER
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Valid until {trialEndDate}
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-dark)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              7 Days Free Trial
            </h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '16px 0 12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                ₹0
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
                / first 7 days
              </span>
            </div>

            <p style={{ fontSize: '0.94rem', color: 'var(--color-ink-muted)', lineHeight: 1.55, marginBottom: '24px' }}>
              Instant zero-commitment trial to experience HerSpace emotional sanctuary, explore expert directories, and verify caller masking.
            </p>

            <div style={{ height: '0.5px', background: 'rgba(0, 0, 0, 0.08)', margin: '20px 0' }}></div>

            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary-dark)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '14px' }}>
              What&apos;s Included Free:
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>1 Complimentary 30-Min Session</strong> with a Trained Listener (₹399 value)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Private My Cycle Tracker</strong> with local device encryption</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>All 11 Life & Wellbeing Categories</strong> in English & தமிழ்</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Calm Audio Sanctuary</strong> (Guided breathing & ambient ragas)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>2-Way Masked Calling</strong>: your phone number is 100% private</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => navigate(user ? 'space' : 'onb-register')}
            >
              <span>{user ? 'Open My Personal Space' : 'Start 7-Day Trial @ ₹0'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '10px' }}>
              No credit card required for initial activation.
            </div>
          </div>
        </div>

        {/* Tier 2: First 60 Days Validity Plan */}
        <div
          className="card"
          style={{
            padding: '36px 32px',
            borderRadius: '24px',
            background: '#FFFFFF',
            border: '0.5px solid rgba(124, 92, 191, 0.28)',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-verified" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                EXTENDED VALIDITY PLAN
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Valid through {extendedValidityDate}
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-text-dark)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              First 60 Days Validity
            </h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '16px 0 12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text-dark)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                ₹149
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
                / 60 days validity
              </span>
            </div>

            <p style={{ fontSize: '0.94rem', color: 'var(--color-ink-muted)', lineHeight: 1.55, marginBottom: '24px' }}>
              Followed by monthly auto-renewal at ₹149/month after the initial 60 days. Cancel anytime with a single tap in your account.
            </p>

            <div style={{ height: '0.5px', background: 'rgba(0, 0, 0, 0.08)', margin: '20px 0' }}></div>

            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-dark)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '14px' }}>
              Continued Member Privileges:
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Uninterrupted Sanctuary Access</strong> to all 11 health categories</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Subsidized Booking Rates</strong> on all verified professionals</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Dedicated Live Melodies</strong> booking at only ₹99 for 15 mins</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>Permanent Cycle History</strong> stored encrypted on your browser</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span><strong>One-Tap Reschedule</strong> up to 4 hours before session</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              className="btn btn-outline btn-block btn-lg"
              onClick={() => openPolicyModal('cancellation')}
            >
              <span>Review Cancellation & Reschedule Terms</span>
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '10px' }}>
              Zero penalty, instant online cancellation anytime.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Session Rates Breakdown Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '0.5px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          marginBottom: '56px'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>
            PER-SESSION RATES
          </span>
          <h3 style={{ fontSize: '1.45rem', margin: '4px 0 8px', color: 'var(--color-primary-dark)' }}>
            Transparent Session Fees
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: 0 }}>
            Every session takes place over our secure two-way masked phone bridge. No video cameras, no personal contact sharing.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '540px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid rgba(0, 0, 0, 0.08)' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Service Tier</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Scope of Care</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Duration</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Fee (INR)</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '0.5px solid rgba(0, 0, 0, 0.06)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Trained Human Listener
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                  Empathetic listening, emotional first-aid & stress venting
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem' }}>60 mins</td>
                <td style={{ padding: '16px', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹399</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate('support')}>
                    Book Listener
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '0.5px solid rgba(0, 0, 0, 0.06)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Licensed Counsellor
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                  RCI/clinical psychotherapy, anxiety, trauma & cognitive care
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem' }}>60 mins</td>
                <td style={{ padding: '16px', fontSize: '1.15rem', fontWeight: 800, color: '#3B6AB8' }}>₹999</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => navigate('support')}>
                    Book Counsellor
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '0.5px solid rgba(0, 0, 0, 0.06)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  HerSpace Live Melodies
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                  Live soothing vocal therapy, acoustic lullabies & comfort songs
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem' }}>15 mins</td>
                <td style={{ padding: '16px', fontSize: '1.15rem', fontWeight: 800, color: '#D86C9B' }}>₹99</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate('singers')}>
                    Book Singer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Rescheduling Policy & Help Callout */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7FD 0%, #FFFFFF 100%)',
          borderRadius: '20px',
          border: '0.5px solid rgba(124, 92, 191, 0.25)',
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <span className="badge badge-pink" style={{ marginBottom: '8px' }}>
            APPOINTMENT POLICIES
          </span>
          <h3 style={{ fontSize: '1.45rem', margin: '4px 0 8px', color: 'var(--color-primary-dark)' }}>
            Fair Scheduling & Reschedule Guarantee
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
            <strong>Only one reschedule allowed</strong> per session, valid up to 4 hours prior to appointment time. If an expert is unable to attend, you receive a guaranteed 100% full refund to your original payment method.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => openPolicyModal('cancellation')}>
            Read Full Policy
          </button>
          <a
            href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Call Support ({HERSPACE_CONFIG.support.phone})
          </a>
        </div>
      </div>
    </div>
  );
};
