import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/config';
import { Appointment } from '../types';

export const DashboardView: React.FC = () => {
  const {
    t,
    isTa,
    appointments,
    rescheduleAppointment,
    notifications,
    startMaskedCall,
    navigate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'notifications'>('upcoming');
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [rescheduleTime, setRescheduleTime] = useState('04:00 PM - 05:00 PM');

  const upcomingApts = appointments.filter(a => a.status === 'scheduled');
  const pastApts = appointments.filter(a => a.status !== 'scheduled');

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reschedulingApt) {
      rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleTime);
      setReschedulingApt(null);
    }
  };

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: '880px' }}>
      <div className="section-header">
        <div className="eyebrow">MEMBER SESSIONS & PRIVILEGES</div>
        <h2>{t('dashTitle')}</h2>
        <p>{t('dashSubtitle')}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          {t('dashTabUpcoming')} ({upcomingApts.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'past' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('past')}
        >
          {t('dashTabPast')} ({pastApts.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'notifications' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('notifications')}
        >
          {t('dashTabNotifs')} ({notifications.length})
        </button>
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <button
              className="modal-close-btn"
              onClick={() => setReschedulingApt(null)}
              aria-label={t('btnClose')}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
              {isTa ? 'அமர்வு நேரத்தை மாற்று' : 'Reschedule Appointment'}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
              {t('dashRescheduleNote')}
            </p>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="rescheduleDateInput">New Date</label>
                <input
                  id="rescheduleDateInput"
                  type="date"
                  className="form-control"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rescheduleTimeSelect">New Time Slot</label>
                <select
                  id="rescheduleTimeSelect"
                  className="form-control"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                >
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                  <option value="08:00 PM - 09:00 PM">08:00 PM - 09:00 PM</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '16px' }}>
                Confirm Reschedule →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content depending on active tab */}
      {activeTab === 'upcoming' && (
        <div>
          {upcomingApts.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
                {isTa ? 'வரவிருக்கும் முன்பதிவுகள் எதுவும் இல்லை' : 'No upcoming appointments scheduled.'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '18px' }}>
                {isTa
                  ? 'பயிற்சி பெற்ற கவனிப்பாளர் அல்லது ஆலோசகருடன் உங்கள் முதல் அமர்வை இப்போதே திட்டமிடுங்கள்.'
                  : 'Book a session with a Trained Listener (₹399) or Professional Counsellor (₹999).'}
              </p>
              <button className="btn btn-primary" onClick={() => navigate('support')}>
                {isTa ? 'ஆதரவைத் தேர்வு செய்' : 'Browse Care Directory'} →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingApts.map(apt => (
                <div key={apt.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={apt.expertAvatar}
                      alt={apt.expertName}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="badge badge-verified">ID: {apt.bookingId}</span>
                        {apt.isComplimentary && <span className="badge badge-pink">Complimentary (₹0)</span>}
                        {(apt.rescheduleCount || 0) >= 1 && <span className="badge badge-lavender">Rescheduled (1x)</span>}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{apt.expertName}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                        📅 <strong>{apt.date}</strong> at <strong>{apt.time}</strong> · {apt.mode}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(apt.rescheduleCount || 0) < 1 ? (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setReschedulingApt(apt)}
                      >
                        {t('dashBtnReschedule')}
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        title="Only one reschedule allowed"
                        disabled
                      >
                        Rescheduled (Limit 1)
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => startMaskedCall(apt.expertId, apt.expertName, apt.expertRole)}
                    >
                      📞 {t('dashBtnJoinCall')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'past' && (
        <div>
          {pastApts.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-ink-muted)' }}>
              No past sessions recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pastApts.map(apt => (
                <div key={apt.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>{apt.expertName}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
                      {apt.date} · {formatINR(apt.priceDisplay)}
                    </div>
                  </div>
                  <span className="badge badge-lavender">Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{isTa ? n.titleTa : n.titleEn}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{n.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
                {isTa ? n.bodyTa : n.bodyEn}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
