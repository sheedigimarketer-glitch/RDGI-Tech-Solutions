import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/config';

export const BookingModal: React.FC = () => {
  const {
    t,
    isTa,
    user,
    entitlement,
    bookingModalExpert,
    setBookingModalExpert,
    bookAppointment,
    navigate
  } = useApp();

  // Dynamically compute upcoming 7 days starting from tomorrow
  const upcomingDates = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ dateStr, dayName, dayNum, monthName });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM - 11:00 AM');
  const [selectedMode, setSelectedMode] = useState<string>('2-Way Masked Phone Call');

  // Singer tier state (defaulting to Love melody 15 mins ₹99)
  const [selectedTierId, setSelectedTierId] = useState<string>('love_melody');

  if (!bookingModalExpert) return null;

  const exp = bookingModalExpert;
  const isSinger = exp.role === 'singer';

  const isComplimentaryEligible =
    exp.role === 'listener' &&
    entitlement?.welcomeCallStatus === 'available' &&
    new Date(entitlement.welcomeCallExpiresAt).getTime() > Date.now();

  const singerTiers = isSinger && 'tiers' in exp && exp.tiers && exp.tiers.length > 0
    ? exp.tiers
    : [
        { id: 'love_melody', name: 'Love melody', durationMinutes: 15, priceDisplay: 99 },
        { id: 'lullaby', name: 'Soothing Lullaby', durationMinutes: 20, priceDisplay: 149 },
        { id: 'deep_raga', name: 'Deep Calm Raga', durationMinutes: 30, priceDisplay: 199 }
      ];

  const currentSingerTier = singerTiers.find(tr => tr.id === selectedTierId) || singerTiers[0];

  const effectivePrice = isComplimentaryEligible
    ? 0
    : isSinger
    ? currentSingerTier.priceDisplay
    : 'priceDisplay' in exp
    ? exp.priceDisplay
    : 399;

  const displayName = isTa && 'nameTa' in exp ? exp.nameTa : exp.name;

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
    '08:00 PM - 09:00 PM'
  ];

  const handleBooking = () => {
    if (!user) {
      setBookingModalExpert(null);
      navigate('onb-register');
      return;
    }

    bookAppointment({
      expertId: exp.id,
      date: selectedDate,
      time: selectedSlot,
      mode: selectedMode,
      isComplimentary: isComplimentaryEligible,
      tierTitle: isSinger ? currentSingerTier.name : undefined,
      customPrice: effectivePrice
    });
    setBookingModalExpert(null);
    navigate('dashboard');
  };

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <button
          className="modal-close-btn"
          onClick={() => setBookingModalExpert(null)}
          aria-label={t('btnClose')}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Reserve Your Session</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          {'avatar' in exp ? (
            <img
              src={exp.avatar}
              alt={displayName}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: exp.avatarColor || '#D86C9B',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {displayName.charAt(0)}
            </div>
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{displayName}</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
              {exp.role === 'counsellor'
                ? t('tierCounsellorTitle')
                : exp.role === 'listener'
                ? t('tierListenerTitle')
                : 'HerSpace Live Singer'}
            </div>
          </div>
        </div>

        {/* Singer Melody Tier Selection */}
        {isSinger && (
          <div style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
              Select Melody Duration & Tier
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {singerTiers.map(tier => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: isSelected ? 'var(--color-bg-lavender)' : '#FFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--color-primary-dark)' : 'inherit' }}>
                      {tier.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                      {tier.durationMinutes} mins
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                      {formatINR(tier.priceDisplay)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isComplimentaryEligible && (
          <div
            style={{
              background: 'var(--color-bg-lavender)',
              border: '1.5px solid var(--color-primary-soft)',
              padding: '12px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.86rem',
              color: 'var(--color-primary-dark)',
              fontWeight: 600
            }}
          >
            🎁 1 Complimentary 30-Min Listening Session Applied (₹0 Today)
          </div>
        )}

        {/* Dynamic Date Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
            Select Preferred Date
          </label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {upcomingDates.map(d => (
              <button
                key={d.dateStr}
                type="button"
                className={`slot-btn ${selectedDate === d.dateStr ? 'selected' : ''}`}
                style={{ flex: '1 0 70px', padding: '8px 4px' }}
                onClick={() => setSelectedDate(d.dateStr)}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>{d.dayName}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{d.dayNum}</div>
                <div style={{ fontSize: '0.7rem' }}>{d.monthName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Grid */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
            Select Time Slot
          </label>
          <div className="slot-grid">
            {timeSlots.map(slot => (
              <button
                key={slot}
                type="button"
                className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Call Mode */}
        <div className="form-group">
          <label className="form-label" htmlFor="bookingModeSelect">Session Mode</label>
          <select
            id="bookingModeSelect"
            className="form-control"
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
          >
            <option value="2-Way Masked Phone Call">2-Way Masked Phone Call (Exotel India Bridge)</option>
            <option value="Encrypted Audio">Encrypted Web Audio</option>
            <option value="Private Chat">Private Text Chat</option>
          </select>
        </div>

        {/* Reschedule Policy Notice */}
        <div
          style={{
            background: 'rgba(216, 108, 155, 0.08)',
            border: '0.5px solid rgba(216, 108, 155, 0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: 'var(--color-text-dark)',
            marginBottom: '16px'
          }}
        >
          📌 <strong>Rescheduling Policy:</strong> Only one reschedule allowed (must be requested at least 4 hours before the session). No cancellations once confirmed.
        </div>

        {/* Summary & Price */}
        <div style={{ background: 'var(--color-warm-white)', padding: '14px', borderRadius: '10px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
              {isSinger ? `${currentSingerTier.name} (${currentSingerTier.durationMinutes} mins)` : 'Session Fee (60 mins)'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              {isComplimentaryEligible ? '₹0 (Free Trial)' : formatINR(effectivePrice)}
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', textAlign: 'right' }}>
            🔒 Masked Number Protection<br />Exotel Virtual Bridge
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={handleBooking}>
          Confirm & Schedule Session →
        </button>
      </div>
    </div>
  );
};
