import React, { useState } from 'react';
import { requireClient } from '../services/auth';

type Channel = 'call' | 'whatsapp';

export function AdminCommunicationsPilot() {
  const [selected, setSelected] = useState<Channel | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');

  async function runTest(channel: Channel) {
    setBusy(true);
    setResult('');
    try {
      const { data: { session } } = await requireClient().auth.getSession();
      if (!session) throw new Error('Sign in again to run a test.');
      const response = await fetch('/api/communications/pilot', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The test request failed.');
      setResult(data.message);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Check the provider dashboard for the test result.');
    } finally {
      setBusy(false);
      setSelected(null);
    }
  }

  return (
    <section className="admin-card">
      <h2>Communications pilot</h2>
      <p>Run one masked call and one WhatsApp message to the approved test phones.</p>
      <button className="admin-secondary" disabled={busy} onClick={() => setSelected('call')}>Test masked call</button>{' '}
      <button className="admin-secondary" disabled={busy} onClick={() => setSelected('whatsapp')}>Test WhatsApp</button>
      {selected && (
        <div>
          <p>{selected === 'call' ? 'Place the test call now?' : 'Send the test WhatsApp message now?'}</p>
          <button className="admin-secondary" disabled={busy} onClick={() => void runTest(selected)}>Confirm test</button>{' '}
          <button className="admin-link" disabled={busy} onClick={() => setSelected(null)}>Cancel</button>
        </div>
      )}
      {busy && <p role="status">Requesting test…</p>}
      {result && <p role="status">{result}</p>}
    </section>
  );
}
