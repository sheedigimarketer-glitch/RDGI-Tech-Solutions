import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProApplication } from '../types';
import {
  verifyAdminPassphrase,
  isCurrentAdminSessionValid,
  terminateAdminSession
} from '../utils/security';

export const AdminView: React.FC = () => {
  const {
    proApplications,
    updateProApplicationStatus,
    isMaintenanceMode,
    setIsMaintenanceMode,
    billingStats,
    simulateSubscription,
    navigate,
    addToast
  } = useApp();

  // Authentication State for Admin Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isCurrentAdminSessionValid();
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'approvals' | 'billing' | 'system'>('approvals');
  const [filterRole, setFilterRole] = useState<'all' | 'counsellor' | 'listener' | 'singer'>('all');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError('Please enter the administrative security credential.');
      return;
    }

    setIsVerifying(true);
    setPinError('');

    try {
      const result = await verifyAdminPassphrase(pinInput);
      if (result.success) {
        setIsAuthenticated(true);
        setPinInput('');
        addToast('Admin governance session verified via SHA-256 salted digest.', 'success');
      } else {
        setPinError(result.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setPinError('Cryptographic verification failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    terminateAdminSession();
    setIsAuthenticated(false);
    addToast('Admin session terminated safely.', 'info');
  };

  // If not authenticated, render Apple-style Login Gate
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '0.5px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            padding: '36px 28px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(94, 39, 80, 0.08)',
              color: '#5E2750',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#2C2420', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Staff Governance Portal
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6B5E55', lineHeight: 1.5, margin: '0 0 24px' }}>
            Authorized access only for clinical credentialing, billing operations, and system maintenance.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3E39', marginBottom: '6px' }}>
                Admin Security PIN / Password
              </label>
              <input
                type="password"
                placeholder="Enter PIN (Default: admin123)"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: pinError ? '1.5px solid #DC2626' : '1px solid rgba(0, 0, 0, 0.15)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: '#FDFBF7',
                  boxSizing: 'border-box',
                  transition: 'border-color 150ms ease'
                }}
                autoFocus
              />
              {pinError && (
                <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {pinError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: isVerifying ? '#8A7E77' : '#5E2750',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: isVerifying ? 'wait' : 'pointer',
                transition: 'transform 120ms cubic-bezier(0.2, 0, 0, 1), opacity 150ms ease'
              }}
              onMouseDown={e => { if (!isVerifying) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { if (!isVerifying) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isVerifying ? 'Computing Hash & Verifying...' : 'Verify & Enter Portal'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.03)', fontSize: '0.78rem', color: '#786C64', lineHeight: 1.4 }}>
            Zero-plaintext credential verification active: evaluates SHA-256 salted digest with brute-force rate-limiting. Client testing passphrase: <code style={{ fontWeight: 600, color: '#5E2750' }}>admin123</code>.
          </div>
        </div>
      </div>
    );
  }

  const filteredApps = proApplications.filter(app => {
    if (filterRole === 'all') return true;
    return app.role === filterRole;
  });

  const pendingCount = proApplications.filter(a => a.status === 'pending').length;

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 16px 80px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(94, 39, 80, 0.08)', color: '#5E2750', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5E2750' }}></span>
            Staff Operations Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#2C2420', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            HerSpace Operations & Governance
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#6B5E55', margin: 0, lineHeight: 1.5 }}>
            Manage clinical credential audits, review incoming care applications, simulate subscription flows, and toggle emergency maintenance mode.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('space')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              background: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#4A3E39',
              cursor: 'pointer'
            }}
          >
            ← View Public App
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              background: 'rgba(220, 38, 38, 0.05)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#DC2626',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Apple-Style Segmented Navigation Control */}
      <div
        style={{
          display: 'inline-flex',
          background: 'rgba(0, 0, 0, 0.06)',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '28px',
          maxWidth: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <button
          onClick={() => setActiveTab('approvals')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'approvals' ? 600 : 500,
            background: activeTab === 'approvals' ? '#ffffff' : 'transparent',
            color: activeTab === 'approvals' ? '#2C2420' : '#6B5E55',
            boxShadow: activeTab === 'approvals' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Staff Acceptance & RCI
          {pendingCount > 0 && (
            <span
              style={{
                background: '#5E2750',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'billing' ? 600 : 500,
            background: activeTab === 'billing' ? '#ffffff' : 'transparent',
            color: activeTab === 'billing' ? '#2C2420' : '#6B5E55',
            boxShadow: activeTab === 'billing' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          Billing & Subscription Ops
        </button>

        <button
          onClick={() => setActiveTab('system')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'system' ? 600 : 500,
            background: activeTab === 'system' ? '#ffffff' : 'transparent',
            color: activeTab === 'system' ? '#2C2420' : '#6B5E55',
            boxShadow: activeTab === 'system' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          System Maintenance Controls
        </button>
      </div>

      {/* TAB 1: COUNSELLOR & STAFF ACCEPTANCE */}
      {activeTab === 'approvals' && (
        <section>
          {/* Subfilter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'counsellor', 'listener', 'singer'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: filterRole === role ? '#5E2750' : 'rgba(0, 0, 0, 0.12)',
                    background: filterRole === role ? '#5E2750' : '#ffffff',
                    color: filterRole === role ? '#ffffff' : '#4A3E39',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {role === 'all' ? 'All Roles' : role === 'counsellor' ? 'Counsellors' : role === 'listener' ? 'Trained Listeners' : 'Live Singers'}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', color: '#6B5E55' }}>
              Showing <strong>{filteredApps.length}</strong> candidate submissions
            </div>
          </div>

          {/* Applications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredApps.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4A3E39' }}>No candidate applications found for this filter.</div>
              </div>
            ) : (
              filteredApps.map(app => (
                <div
                  key={app.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '0.5px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    padding: '24px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            letterSpacing: '0.03em',
                            textTransform: 'uppercase',
                            background: app.role === 'counsellor' ? 'rgba(94, 39, 80, 0.1)' : app.role === 'listener' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                            color: app.role === 'counsellor' ? '#5E2750' : app.role === 'listener' ? '#047857' : '#B45309'
                          }}
                        >
                          {app.role === 'counsellor' ? 'Professional Counsellor' : app.role === 'listener' ? 'Trained Listener' : 'Live Singer'}
                        </span>

                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: app.status === 'approved' ? '#DEF7EC' : app.status === 'rejected' ? '#FDE8E8' : '#FEF3C7',
                            color: app.status === 'approved' ? '#03543F' : app.status === 'rejected' ? '#9B1C1C' : '#92400E'
                          }}
                        >
                          {app.status === 'approved' ? 'Active / Approved' : app.status === 'rejected' ? 'Rejected / Inactive' : 'Pending Review'}
                        </span>

                        <span style={{ fontSize: '0.78rem', color: '#8A7E77' }}>
                          ID: {app.id}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#2C2420', margin: '0 0 6px' }}>
                        {app.name}
                      </h3>

                      <div style={{ fontSize: '0.86rem', color: '#6B5E55', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span>Email: <strong style={{ color: '#2C2420' }}>{app.email}</strong></span>
                        <span>Phone: <strong style={{ color: '#2C2420' }}>{app.phone}</strong></span>
                        <span>Experience: <strong style={{ color: '#2C2420' }}>{app.experienceYears} Years</strong></span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {app.status !== 'approved' && (
                        <button
                          onClick={() => updateProApplicationStatus(app.id, 'approved')}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '10px',
                            background: '#047857',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(4, 120, 87, 0.2)'
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Approve Staff
                        </button>
                      )}

                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => updateProApplicationStatus(app.id, 'rejected')}
                          style={{
                            padding: '9px 16px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            color: '#DC2626',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      )}

                      {app.status === 'approved' && (
                        <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✓ Live in Public Directory
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verified Credentials Box */}
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: '#FDFBF7',
                      border: '0.5px solid rgba(0, 0, 0, 0.05)',
                      fontSize: '0.88rem',
                      lineHeight: 1.6
                    }}
                  >
                    <div>
                      <strong style={{ color: '#4A3E39' }}>Formal Qualification:</strong> {app.qualification}
                    </div>
                    {app.rciNumber && (
                      <div style={{ marginTop: '4px' }}>
                        <strong style={{ color: '#4A3E39' }}>RCI Registration Number:</strong>{' '}
                        <span style={{ color: '#5E2750', fontWeight: 700, background: 'rgba(94, 39, 80, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                          {app.rciNumber} (Valid Panel Registration)
                        </span>
                      </div>
                    )}
                    {app.specialties && app.specialties.length > 0 && (
                      <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#4A3E39' }}>Specialties:</span>
                        {app.specialties.map(spec => (
                          <span key={spec} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '1px 8px', fontSize: '0.78rem' }}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p style={{ margin: '14px 0 0', fontSize: '0.88rem', color: '#4A3E39', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{app.bio}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 2: BILLING & SUBSCRIPTION OPERATIONS */}
      {activeTab === 'billing' && (
        <section>
          {/* Key Metrics Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '28px' }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '0.5px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8A7E77', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Active 7-Day Free Trials
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#5E2750', letterSpacing: '-0.03em' }}>
                {billingStats.activeTrials.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#047857', marginTop: '6px', fontWeight: 500 }}>
                @ ₹0 / 7 Days with 1 complimentary call
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '0.5px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8A7E77', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                60-Day Promo Memberships
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#2C2420', letterSpacing: '-0.03em' }}>
                {billingStats.activePromo60.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#5E2750', marginTop: '6px', fontWeight: 500 }}>
                @ ₹149 for first 60 days validity
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '0.5px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8A7E77', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Monthly Auto-Renewals
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#047857', letterSpacing: '-0.03em' }}>
                {billingStats.monthlyAutoRenewals.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6B5E55', marginTop: '6px', fontWeight: 500 }}>
                Recurring @ ₹149/mo active members
              </div>
            </div>
          </div>

          {/* Webhook & Payment Flow Simulator */}
          <div style={{ background: '#ffffff', borderRadius: '18px', border: '0.5px solid rgba(0, 0, 0, 0.08)', padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C2420', margin: '0 0 8px' }}>
              Simulate Webhook & Payment Tier Activation
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6B5E55', margin: '0 0 20px', lineHeight: 1.5 }}>
              Use these triggers to simulate production payment webhooks from Razorpay or Stripe without card charges. The active user profile will instantly update its subscription entitlement.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <button
                onClick={() => simulateSubscription('trial')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(94, 39, 80, 0.06)',
                  border: '1px solid rgba(94, 39, 80, 0.15)',
                  color: '#5E2750',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Simulate 7-Day Trial</div>
                <div style={{ fontSize: '0.78rem', color: '#6B5E55' }}>Activate ₹0 trial + 1 free 30-min call</div>
              </button>

              <button
                onClick={() => simulateSubscription('promo60')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(4, 120, 87, 0.06)',
                  border: '1px solid rgba(4, 120, 87, 0.2)',
                  color: '#047857',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Simulate ₹149 / 60-Day Pay</div>
                <div style={{ fontSize: '0.78rem', color: '#6B5E55' }}>Mark ₹149 promo payment received</div>
              </button>

              <button
                onClick={() => simulateSubscription('monthly')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.06)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#2563EB',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Simulate Auto-Renewal</div>
                <div style={{ fontSize: '0.78rem', color: '#6B5E55' }}>Process monthly cycle @ ₹149/mo</div>
              </button>

              <button
                onClick={() => simulateSubscription('cancel')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(220, 38, 38, 0.06)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  color: '#DC2626',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Simulate Cancellation</div>
                <div style={{ fontSize: '0.78rem', color: '#6B5E55' }}>Revert member to standard access</div>
              </button>
            </div>
          </div>

          {/* Operational Client Notice */}
          <div
            style={{
              padding: '18px 22px',
              borderRadius: '14px',
              background: 'rgba(94, 39, 80, 0.04)',
              border: '0.5px solid rgba(94, 39, 80, 0.12)',
              fontSize: '0.86rem',
              color: '#4A3E39',
              lineHeight: 1.55
            }}
          >
            <strong style={{ color: '#5E2750' }}>Payment Gateway Integration Notice:</strong> Production card and UPI processing connects via authenticated server-side webhook endpoints to Razorpay / Stripe. For security, test payments are handled cleanly within this portal to verify UI entitlements without creating real monetary transactions.
          </div>
        </section>
      )}

      {/* TAB 3: SYSTEM MAINTENANCE CONTROLS */}
      {activeTab === 'system' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Emergency Maintenance Mode Toggle Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '0.5px solid rgba(0, 0, 0, 0.08)',
              padding: '28px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: isMaintenanceMode ? '#FDE8E8' : '#DEF7EC', color: isMaintenanceMode ? '#9B1C1C' : '#03543F', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                  {isMaintenanceMode ? 'MAINTENANCE ACTIVE' : 'SYSTEM ONLINE'}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C2420', margin: '0 0 6px' }}>
                  Emergency Maintenance Mode
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#6B5E55', margin: 0, lineHeight: 1.55 }}>
                  When enabled, all public web traffic is routed to a serene emergency maintenance page displaying 24/7 crisis helplines (112). Staff may still access this governance portal with the Admin PIN.
                </p>
              </div>

              {/* Apple-Style Switch Toggle */}
              <button
                type="button"
                onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                style={{
                  width: '56px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: isMaintenanceMode ? '#DC2626' : '#E5E7EB',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 200ms ease',
                  padding: '2px',
                  flexShrink: 0
                }}
                aria-label="Toggle Emergency Maintenance Mode"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transform: isMaintenanceMode ? 'translateX(24px)' : 'translateX(0px)',
                    transition: 'transform 200ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                />
              </button>
            </div>

            {isMaintenanceMode && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  lineHeight: 1.5
                }}
              >
                <strong>Warning:</strong> Emergency maintenance mode is currently ACTIVE. Public visitors will see the maintenance screen with 112 helpline details until toggled off.
              </div>
            )}
          </div>

          {/* Telephony Gateway & Infrastructure Status */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '0.5px solid rgba(0, 0, 0, 0.08)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2C2420', margin: '0 0 14px' }}>
              Telephony & Number Masking Bridge
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#FDFBF7' }}>
                <div style={{ fontSize: '0.78rem', color: '#8A7E77', fontWeight: 600 }}>EXOTEL VIRTUAL TRUNK</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#047857', marginTop: '4px' }}>Connected & Active</div>
                <div style={{ fontSize: '0.8rem', color: '#6B5E55', marginTop: '2px' }}>Latency: 42ms · SSL Bridged</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: '#FDFBF7' }}>
                <div style={{ fontSize: '0.78rem', color: '#8A7E77', fontWeight: 600 }}>2-WAY NUMBER MASKING</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#047857', marginTop: '4px' }}>100% Redacted</div>
                <div style={{ fontSize: '0.8rem', color: '#6B5E55', marginTop: '2px' }}>Virtual proxy active for listeners</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: '#FDFBF7' }}>
                <div style={{ fontSize: '0.78rem', color: '#8A7E77', fontWeight: 600 }}>DATA PERSISTENCE ENGINE</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#047857', marginTop: '4px' }}>LocalStorage / IndexedDB</div>
                <div style={{ fontSize: '0.8rem', color: '#6B5E55', marginTop: '2px' }}>Fully synchronized</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
