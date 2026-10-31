import React from 'react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const {
    t,
    proApplications,
    updateProApplicationStatus
  } = useApp();

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: '960px' }}>
      <div className="section-header">
        <div className="eyebrow" style={{ color: '#D97706' }}>STAFF GOVERNANCE & VERIFICATION</div>
        <h2>Professional Credential Portal</h2>
        <p>Review, verify RCI registrations, and manage candidate admissions for Trained Listeners, Counsellors, and Live Singers.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {proApplications.map(app => (
          <div
            key={app.id}
            className="card"
            style={{
              padding: '22px',
              borderLeft: app.status === 'approved' ? '5px solid var(--color-success)' : app.status === 'rejected' ? '5px solid var(--color-danger)' : '5px solid #F59E0B'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`badge ${app.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}`}>
                    {app.role.toUpperCase()}
                  </span>
                  <span className="badge" style={{ background: app.status === 'approved' ? '#DEF7EC' : app.status === 'rejected' ? '#FDE8E8' : '#FEF3C7', color: app.status === 'approved' ? '#03543F' : app.status === 'rejected' ? '#9B1C1C' : '#92400E' }}>
                    {app.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                    ID: {app.id}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem' }}>{app.name}</h3>
                <div style={{ fontSize: '0.86rem', color: 'var(--color-ink-muted)' }}>
                  📧 {app.email} · 📱 {app.phone}
                </div>
              </div>

              {app.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-sm btn-outline"
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.5)' }}
                    onClick={() => updateProApplicationStatus(app.id, 'rejected')}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateProApplicationStatus(app.id, 'approved')}
                  >
                    Approve & Verify
                  </button>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--color-warm-white)', padding: '12px 14px', borderRadius: '8px', margin: '14px 0', fontSize: '0.86rem', lineHeight: 1.6 }}>
              <div>🎓 <strong>Qualification:</strong> {app.qualification}</div>
              {app.rciNumber && (
                <div>📜 <strong>RCI Registration Number:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{app.rciNumber} (Valid)</span></div>
              )}
              <div>⏳ <strong>Experience:</strong> {app.experienceYears} Years in clinical / peer practice</div>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
              "{app.bio}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
