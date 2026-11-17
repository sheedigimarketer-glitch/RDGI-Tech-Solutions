import { useState } from 'react';
import { supabase } from '../services/auth';

type ReadySession = { member_id: string; member_name: string; starts_at: string };

const indiaTime = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
});

export function AdminWelcomeSessions({ onRedeemed }: { onRedeemed: () => void }) {
  const [sessions, setSessions] = useState<ReadySession[] | null>(null);
  const [selected, setSelected] = useState<ReadySession | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const load = async () => {
    setSelected(null);
    setBusy(true);
    setStatus('');
    try {
      const { data, error } = await supabase.rpc('herspace_welcome_redemption_queue');
      if (error || !Array.isArray(data)) throw new Error('Queue unavailable');
      setSessions(data);
    } catch {
      setSessions(null);
      setStatus('Unable to load welcome sessions. Check staff access and try again.');
    } finally {
      setBusy(false);
    }
  };

  const redeem = async () => {
    if (!selected) return;
    setBusy(true);
    setStatus('');
    try {
      const { error } = await supabase.rpc('herspace_complete_welcome_session', {
        member_id_to_complete: selected.member_id
      });
      if (error) throw error;
      setSessions(previous => previous?.filter(session => session.member_id !== selected.member_id) ?? null);
      setSelected(null);
      setStatus('Welcome session marked complete.');
      onRedeemed();
    } catch {
      setStatus('Unable to complete the welcome session. Reload the list and try again.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="admin-card">
    <h2>Welcome sessions</h2>
    <p>Mark a session complete after confirming the listener met with the member.</p>
    <button className="admin-secondary" disabled={busy} onClick={() => void load()}>Load sessions ready for review</button>
    {status && <p role="status">{status}</p>}
    {sessions?.length === 0 && <p>No welcome sessions are ready for review.</p>}
    {sessions && sessions.length > 0 && <div className="admin-table-wrap"><table>
      <thead><tr><th>Member</th><th>Session time (IST)</th><th>Action</th></tr></thead>
      <tbody>{sessions.map(session => <tr key={session.member_id}>
        <td>{session.member_name}</td><td>{indiaTime.format(new Date(session.starts_at))}</td>
        <td><button className="admin-secondary" disabled={busy} onClick={() => setSelected(session)}>Review</button></td>
      </tr>)}</tbody>
    </table></div>}
    {selected && <div>
      <p>Confirm that the welcome session for <strong>{selected.member_name}</strong> took place.</p>
      <button className="admin-secondary" disabled={busy} onClick={() => void redeem()}>Confirm completion</button>
      <button className="admin-secondary" disabled={busy} onClick={() => setSelected(null)}>Back</button>
    </div>}
  </section>;
}
