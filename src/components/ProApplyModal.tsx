import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProApplyModal: React.FC = () => {
  const {
    t,
    isProModalOpen,
    setIsProModalOpen,
    submitProApplication
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'counsellor' | 'listener' | 'singer'>('counsellor');
  const [rciNumber, setRciNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState('');
  const [agree, setAgree] = useState(true);

  if (!isProModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProApplication({
      name,
      email,
      phone,
      role,
      rciNumber: role === 'counsellor' ? rciNumber : null,
      qualification,
      experienceYears,
      bio,
      specialties: role === 'counsellor' ? ['Clinical Therapy', 'Anxiety'] : ['Active Listening', 'Emotional Support']
    });
  };

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-dialog"
        style={{
          background: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsProModalOpen(false)}
          aria-label={t('btnClose')}
        >
          ✕
        </button>

        <div className="eyebrow">PROFESSIONAL CARE & MELODY COMMUNITY</div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{t('proApplyTitle')}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '18px' }}>
          {t('proApplySubtitle')}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="proName">Full Name</label>
            <input
              id="proName"
              type="text"
              className="form-control"
              placeholder="Dr. Sangeetha R."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="proEmail">Email</label>
              <input
                id="proEmail"
                type="email"
                className="form-control"
                placeholder="sangeetha@psych.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proPhone">Mobile Number</label>
              <input
                id="proPhone"
                type="tel"
                className="form-control"
                placeholder="98401 23456"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proRoleSelect">{t('proRoleLabel')}</label>
            <select
              id="proRoleSelect"
              className="form-control"
              value={role}
              onChange={e => setRole(e.target.value as any)}
              required
            >
              <option value="counsellor">{t('proRoleCounsellor')}</option>
              <option value="listener">{t('proRoleListener')}</option>
              <option value="singer">{t('proRoleSinger')}</option>
            </select>
          </div>

          {role === 'counsellor' && (
            <div className="form-group">
              <label className="form-label" htmlFor="proRci">{t('proRciLabel')}</label>
              <input
                id="proRci"
                type="text"
                className="form-control"
                placeholder="CRR-A12345"
                value={rciNumber}
                onChange={e => setRciNumber(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="proQual">{t('proQualLabel')}</label>
              <input
                id="proQual"
                type="text"
                className="form-control"
                placeholder="M.Sc / M.Phil / B.Mus"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proExp">{t('proExpLabel')}</label>
              <input
                id="proExp"
                type="number"
                min="0"
                max="40"
                className="form-control"
                value={experienceYears}
                onChange={e => setExperienceYears(parseInt(e.target.value, 10))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proBio">{t('proBioLabel')}</label>
            <textarea
              id="proBio"
              className="form-control"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-check">
            <input
              id="proAgree"
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="proAgree" style={{ fontSize: '0.82rem' }}>
              {t('proConductAgree')}
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '16px' }}>
            Submit Application →
          </button>
        </form>
      </div>
    </div>
  );
};
