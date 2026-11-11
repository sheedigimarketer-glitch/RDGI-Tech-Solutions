import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/auth';
import { staffStatus, signInAdmin, adminOverview, verifiedFactor, enrollAdminFactor, verifyAdminFactor, recoverAdmin, resetAdminPassword, signOutAdmin, type AdminOverview } from '../services/admin';
import './admin-portal.css';
type Stage = 'loading' | 'signin' | 'denied' | 'mfa' | 'dashboard' | 'recovery' | 'reset';
export const AdminPortal: React.FC = () => {
  const [stage,setStage] = useState<Stage>('loading');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirm,setConfirm] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  const [code,setCode] = useState('');
  const [factor,setFactor] = useState<string | null>(null);
  const [qr,setQr] = useState('');
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [busy,setBusy] = useState(false);
  const [overview,setOverview] = useState<AdminOverview | null>(null);
  const [tab,setTab] = useState<'overview'|'members'>('overview');
  const revision = useRef(0);
  const staffUser = useRef<string | null>(null);
  const pendingEnrollment = useRef<{ userId: string; id: string; qr: string } | null>(null);
  const activation = useRef(window.location.pathname === '/admin/setup');
  const recovery = useRef(false);
  const mounted = useRef(true);
  const refresh = async () => {
    const current = ++revision.current;
    setOverview(null);setStage('loading');
    try {
      const status = await staffStatus();
      if (!mounted.current || current !== revision.current) return;
      const userId = status?.is_staff ? status.user_id : null;
      if (staffUser.current !== userId || !userId) pendingEnrollment.current = null;
      staffUser.current = userId;
      if (!status) { setStage('signin');setQr('');setFactor(null);return; }
      if (!status.is_staff) {
        setQr('');
        // An invited account may set its own password, but receives no admin data or role.
        setStage(activation.current ? 'reset' : 'denied');return;
      }
      if (!status.has_admin_access) {
        const id=await verifiedFactor();
        if (!mounted.current || current !== revision.current) return;
        if (id) pendingEnrollment.current = null;
        const pending = pendingEnrollment.current;
        setFactor(id ?? pending?.id ?? null);
        setQr(pending?.qr ?? '');
        setStage('mfa');return;
      }
      pendingEnrollment.current = null;
      setQr('');setCode('');
      if (recovery.current || activation.current) { setStage('reset');return; }
      const data=await adminOverview();
      if (!mounted.current || current !== revision.current) return;
      setOverview(data);setStage('dashboard');setError('');
    } catch (err:any) {
      if (mounted.current && current === revision.current) { setStage('signin');setError(err.message || 'Account service unavailable.'); }
    }
  };
  useEffect(() => {
    mounted.current=true;
    if (!supabase) {setStage('signin');setError('Staff login is not configured. Contact the platform owner.');return;}
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') recovery.current=true;
      if (event === 'SIGNED_OUT') {
        pendingEnrollment.current=null;staffUser.current=null;
        revision.current++; recovery.current=false;activation.current=false;setOverview(null);setQr('');setFactor(null);setStage('signin');setPassword('');setCode('');return;
      }
      // Never perform nested auth calls while the Supabase callback lock is held.
      queueMicrotask(() => { if(mounted.current) void refresh(); });
    });
    void refresh();
    return () => {mounted.current=false;revision.current++;subscription.unsubscribe();};
  },[]);
  const action = async (work:()=>Promise<void>) => {
    setError('');setNotice('');setBusy(true);
    try {await work();} catch(err:any) {setError(err.message || 'Please try again.');} finally {setBusy(false);}
  };
  const setupAuthenticator = () => action(async () => {
    const userId = staffUser.current;
    if (!userId) return;
    const enrollment = await enrollAdminFactor();
    if (!mounted.current || staffUser.current !== userId) return;
    pendingEnrollment.current = { userId, ...enrollment };
    setFactor(enrollment.id);
    setQr(enrollment.qr);
  });
  const logout=()=>action(async()=>{await signOutAdmin();setOverview(null);setStage('signin');});
  const logo=<a href="/" className="admin-brand" aria-label="HerSpace home"><img src="/logo.png" alt="HerSpace Logo" /></a>;
  if(stage === 'dashboard' && overview) return <div className="admin-shell">
    <aside className="admin-sidebar">{logo}<p className="admin-eyebrow">ADMIN WORKSPACE</p><nav aria-label="Admin navigation"><button aria-current={tab==='overview'?'page':undefined} onClick={()=>setTab('overview')}>Overview</button><button aria-current={tab==='members'?'page':undefined} onClick={()=>setTab('members')}>Members</button></nav><div className="admin-sidebar-foot">Private staff workspace<button onClick={logout} disabled={busy}>Sign out</button></div></aside>
    <main className="admin-dashboard"><header className="admin-dashboard-head"><div><p className="admin-eyebrow">HERSPACE ADMIN</p><h1>{tab==='overview'?'Your care workspace':'Members'}</h1><p>Manage your platform with care and confidence.</p></div><button className="admin-secondary" onClick={()=>action(refresh)} disabled={busy}>Refresh</button></header>
    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-stats"><article><p>Registered members</p><strong>{overview.member_count}</strong></article><article><p>Active free trials</p><strong>{overview.active_trial_count}</strong></article><article><p>Welcome calls used</p><strong>{overview.welcome_calls_used}</strong></article></div>
    <section className="admin-card"><h2>{tab==='overview'?'Recently joined members':'Member directory'}</h2><p>Latest 100 registrations. Private emails and health records are not displayed here.</p>{overview.members.length === 0 ? <div className="admin-empty">No members have registered yet.</div> : <div className="admin-table-wrap"><table><thead><tr><th>Member</th><th>Joined</th><th>Trial ends</th></tr></thead><tbody>{overview.members.map(member=><tr key={member.user_id}><td>{member.display_name}</td><td>{new Date(member.joined_at).toLocaleDateString()}</td><td>{member.trial_ends_at ? new Date(member.trial_ends_at).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div>}</section>
    <section className="admin-card"><h2>Service management</h2><div className="admin-service-list">{['Professional approvals','Bookings','Payments','Calls & notifications'].map(label=><div key={label}><span>{label}</span><span className="admin-badge">Not enabled yet</span></div>)}</div></section></main></div>;
  return <main className="admin-login-page"><section className="admin-story">{logo}<div><p className="admin-eyebrow">A SPACE BUILT WITH CARE</p><h1>Care begins<br/>with trust.</h1><p>A private workspace for your care team.</p></div><span className="admin-story-foot">HerSpace · Emotional wellbeing</span></section>
    <section className="admin-form-panel"><div className="admin-login-card">{logo}<p className="admin-eyebrow">ADMIN PORTAL</p>
      <h1>{stage==='mfa'?'Verify it’s you':stage==='recovery'?'Recover your account':stage==='reset'?'Set a new password':stage==='denied'?'Access restricted':'Welcome back'}</h1>
      <p className="admin-subtitle">{stage==='mfa'?'Use your authenticator app to continue.':stage==='recovery'?'We’ll send a recovery link to your private staff email.':stage==='reset'?'Choose a unique password with at least 12 characters.':stage==='denied'?'This account has not been authorised for staff access.':'Sign in to manage HerSpace securely.'}</p>
      {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice" role="status">{notice}</p>}
      {stage==='loading' && <p role="status">Checking your session…</p>}
      {stage==='signin' && <form onSubmit={e=>{e.preventDefault();void action(async()=>{await signInAdmin(email,password);setPassword('');await refresh();});}}>
        <label htmlFor="admin-email">Email address</label><input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your admin email" />
        <label htmlFor="admin-password">Password</label><div className="admin-password"><input id="admin-password" name="password" type={showPassword?'text':'password'} autoComplete="current-password" required maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?'Hide':'Show'}</button></div>
        <button type="button" className="admin-link admin-forgot" onClick={()=>{setStage('recovery');setPassword('');setError('');}}>Forgot password?</button><button className="admin-primary" disabled={busy} type="submit">{busy?'Signing in…':'Sign in'}</button><p className="admin-security">◇ Two-step verification follows sign-in</p>
      </form>}
      {stage==='mfa' && <>{!factor && <><p>First time here? Set up an authenticator app to protect your admin account.</p><button className="admin-primary" disabled={busy} onClick={setupAuthenticator}>Set up authenticator</button></>}{qr && <div className="admin-qr"><img src={qr} alt="Scan this QR code using your authenticator app"/><p>Scan this code using your authenticator app. Keep it private.</p></div>}{factor && <form onSubmit={e=>{e.preventDefault();void action(async()=>{await verifyAdminFactor(factor,code);setCode('');setQr('');await refresh();});}}><label htmlFor="admin-code">Authenticator code</label><input id="admin-code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))}/><button className="admin-primary" disabled={busy}>{busy?'Verifying…':'Verify and continue'}</button></form>}<button className="admin-link" disabled={busy} onClick={logout}>Sign out</button></>}
      {stage==='recovery' && <form onSubmit={e=>{e.preventDefault();void action(async()=>{await recoverAdmin(email);setNotice('If an account exists for that email, a recovery link will be sent.');});}}><label htmlFor="recovery-email">Private staff email</label><input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/><button className="admin-primary" disabled={busy}>{busy?'Please wait…':'Send recovery link'}</button><button className="admin-link" type="button" onClick={()=>{setStage('signin');setError('');setNotice('');}}>Back to sign in</button></form>}
      {stage==='reset' && <form onSubmit={e=>{e.preventDefault();void action(async()=>{await resetAdminPassword(password,confirm);recovery.current=false;activation.current=false;setPassword('');setConfirm('');setStage('signin');setNotice('Password changed. Sign in with your new password.');});}}><label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/><button className="admin-primary" disabled={busy}>Save new password</button></form>}
      {stage==='denied' && <button className="admin-primary" disabled={busy} onClick={logout}>Sign out and use another account</button>}
      <footer className="admin-login-footer">Authorised staff only · <a href="/">Back to HerSpace</a></footer>
    </div></section></main>;
};
