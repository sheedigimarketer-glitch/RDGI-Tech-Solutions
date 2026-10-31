import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, HERSPACE_CONFIG } from '../data/config';

export const SupportView: React.FC = () => {
  const {
    t,
    isTa,
    experts,
    activeRoleFilter,
    setActiveRoleFilter,
    setProfileModalExpert,
    setBookingModalExpert,
    startMaskedCall,
    navigate
  } = useApp();

  const filtered = experts.filter(e => {
    if (activeRoleFilter !== 'all' && e.role !== activeRoleFilter) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '1080px' }}>
      {/* 1. Centered Section Header */}
      <div className="section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
        <div className="eyebrow">CHOOSE YOUR SUPPORT</div>
        <h2 style={{ fontSize: '2.1rem', letterSpacing: '-0.025em', margin: '8px 0 12px' }}>
          {t('dualTierTitle')}
        </h2>
        <p style={{ fontSize: '1.02rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          {t('dualTierSubtitle')}
        </p>
      </div>

      {/* 2. Filter Tabs - Clean Apple HIG Segmented Control */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          margin: '24px 0 32px 0',
          flexWrap: 'wrap'
        }}
      >
        <button
          className={`btn btn-sm ${activeRoleFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 22px', borderRadius: '9999px' }}
          onClick={() => setActiveRoleFilter('all')}
        >
          {t('filterAll')} ({experts.length})
        </button>
        <button
          className={`btn btn-sm ${activeRoleFilter === 'listener' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 22px', borderRadius: '9999px' }}
          onClick={() => setActiveRoleFilter('listener')}
        >
          {t('filterListeners')}
        </button>
        <button
          className={`btn btn-sm ${activeRoleFilter === 'counsellor' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 22px', borderRadius: '9999px' }}
          onClick={() => setActiveRoleFilter('counsellor')}
        >
          {t('filterCounsellors')}
        </button>
      </div>

      {/* 3. Live Melodies Dedicated Banner Link (Isolated section) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124, 92, 191, 0.08) 0%, rgba(216, 108, 155, 0.08) 100%)',
          border: '0.5px solid rgba(124, 92, 191, 0.2)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
          <div>
            <strong style={{ fontSize: '0.98rem', color: 'var(--color-primary-dark)' }}>
              Looking for Live Singers & Vocal Comfort?
            </strong>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-ink-muted)' }}>
              Live Melodies is now in its own dedicated section. Book Love melody (15 mins @ ₹99) or lullabies.
            </p>
          </div>
        </div>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => navigate('singers')}
        >
          Visit Live Melodies →
        </button>
      </div>

      {/* 4. Balanced & Centered Experts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {filtered.map(exp => (
          <div
            key={exp.id}
            className="expert-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              margin: 0
            }}
          >
            <div>
              <div className="expert-header" style={{ alignItems: 'flex-start' }}>
                <div className="expert-avatar-wrap">
                  <img src={exp.avatar} alt={exp.name} className="expert-avatar" />
                  <span className="expert-verified-dot" title="Reviewed & Approved"></span>
                </div>
                <div className="expert-info" style={{ flex: 1 }}>
                  <span className={`badge ${exp.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}`}>
                    {exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
                  </span>
                  <h3 className="expert-name" style={{ marginTop: '6px', fontSize: '1.25rem' }}>
                    {isTa && exp.nameTa ? exp.nameTa : exp.name}
                  </h3>
                  <div className="expert-qual">
                    {isTa && exp.qualificationTa ? exp.qualificationTa : exp.qualification}
                  </div>
                </div>
              </div>

              <p className="expert-bio" style={{ margin: '14px 0', minHeight: '64px' }}>
                {isTa && exp.bioTa ? exp.bioTa : exp.bio}
              </p>

              <div className="expert-tags" style={{ marginBottom: '14px' }}>
                {(isTa && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties).map(s => (
                  <span key={s} className="expert-tag">{s}</span>
                ))}
              </div>

              <div
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-ink-muted)',
                  background: 'var(--color-warm-white)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  lineHeight: 1.6,
                  marginBottom: '16px'
                }}
              >
                <div>★ <strong>{exp.rating}</strong> ({exp.reviewsCount} reviews) · <strong>{exp.experienceYears}+</strong> yrs exp</div>
                <div>🕒 Next Slot: <strong>{isTa && exp.nextSlotTa ? exp.nextSlotTa : exp.nextSlot}</strong></div>
                <div>🗣 Languages: <strong>{exp.languages.join(', ')}</strong></div>
              </div>
            </div>

            <div className="expert-footer" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '0.5px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {formatINR(exp.priceDisplay)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)' }}>/ 60 mins session</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setProfileModalExpert(exp)}
                >
                  {t('btnViewProfile')}
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setBookingModalExpert(exp)}
                >
                  {t('btnBookNow')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. DEDICATED CUSTOMER SUPPORT ENQUIRY TELEPHONE BLOCK */}
      <div
        className="card"
        style={{
          marginTop: '48px',
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FAF7FD 0%, #FFFFFF 100%)',
          border: '0.5px solid rgba(124, 92, 191, 0.25)',
          boxShadow: '0 8px 24px -4px rgba(124, 92, 191, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '580px' }}>
            <span className="badge badge-verified" style={{ marginBottom: '8px' }}>
              DIRECT CUSTOMER CARE & ENQUIRIES
            </span>
            <h3 style={{ fontSize: '1.65rem', margin: '6px 0 10px', color: 'var(--color-text-dark)' }}>
              {t('supportEnquiryTitle')}
            </h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
              Need assistance with your booking, 7-day free trial, or number-masked telephony? Our dedicated Chennai support desk is here for you.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '18px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                  Customer Support Telephone
                </div>
                <a
                  href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px'
                  }}
                >
                  {HERSPACE_CONFIG.support.phone}
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#15803D', fontWeight: 600 }}>
                  WhatsApp Desk
                </div>
                <a
                  href={`https://wa.me/${HERSPACE_CONFIG.support.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HerSpace Support, I would like assistance.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#15803D',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                  Working Hours
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-text-dark)', marginTop: '4px' }}>
                  {t('supportEnquiryHours')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                  Official Email
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '4px' }}>
                  {HERSPACE_CONFIG.support.email}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`tel:${HERSPACE_CONFIG.support.phone.replace(/\s+/g, '')}`}
              className="btn btn-primary btn-lg"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              Call Support Now
            </a>
            <a
              href={`https://wa.me/${HERSPACE_CONFIG.support.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HerSpace Support, I need assistance with my session.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ textDecoration: 'none', textAlign: 'center', borderColor: '#BBF7D0', color: '#15803D' }}
            >
              WhatsApp Support
            </a>
            <button
              className="btn btn-outline"
              onClick={() => startMaskedCall('exp-anita', 'Customer Support Desk', 'counsellor')}
            >
              Test Masked Bridge Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
