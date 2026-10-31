import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CycleView: React.FC = () => {
  const {
    isTa,
    cycle,
    enableCycleTracker,
    addCycleLog,
    deleteCycleLog,
    wipeCycleData,
    toggleCycleReminders
  } = useApp();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 4);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [flow, setFlow] = useState<'Light' | 'Medium' | 'Heavy' | 'Spotting'>('Medium');
  const [symptomsInput, setSymptomsInput] = useState('Mild cramps, Fatigue');
  const [mood, setMood] = useState('Calm');
  const [notes, setNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const symptoms = symptomsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addCycleLog({
      startDate,
      endDate,
      flow,
      symptoms: symptoms.length > 0 ? symptoms : ['Logged'],
      mood,
      notes
    });
    setNotes('');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(cycle, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HerSpace-My-Cycle-Private-Export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!cycle.optInConsent) {
    return (
      <div className="container" style={{ padding: '36px 16px', maxWidth: '640px' }}>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌸</div>
          <span className="badge badge-listener" style={{ marginBottom: '12px' }}>
            100% OPT-IN & STRICTLY PRIVATE
          </span>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
            {isTa ? 'My Cycle — மாதவிடாய் நாட்காட்டி' : 'My Cycle — Optional Period Tracker'}
          </h2>
          <p style={{ fontSize: '0.94rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            {isTa
              ? 'உங்கள் மாதவிடாய் தகவல்கள் உங்கள் சாதனத்தில் மட்டுமே ரகசியமாகச் சேமிக்கப்படும். விளம்பரங்களுக்கோ பிற நிறுவனங்களுக்கோ ஒருபோதும் பகிரப்படாது.'
              : 'HerSpace respects your reproductive privacy. Your logs remain isolated on this device only, never uploaded to advertiser trackers.'}
          </p>

          <div style={{ background: 'var(--color-bg-lavender)', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', fontSize: '0.86rem', lineHeight: 1.6 }}>
            <div>🔒 <strong>Zero Third-Party Sharing:</strong> Not accessible to listeners or counsellors.</div>
            <div>🛡️ <strong>Total Ownership:</strong> Export as JSON or permanently wipe with one click anytime.</div>
            <div>🔔 <strong>Discreet Notifications:</strong> Lock-screen alerts contain zero sensitive health keywords.</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button className="btn btn-primary btn-block" onClick={() => enableCycleTracker(false)}>
              {isTa ? 'தனியுரிமையுடன் தொடங்கு' : 'Enable My Cycle Privately'} →
            </button>
            <button className="btn btn-secondary btn-block" onClick={() => enableCycleTracker(true)}>
              {isTa ? 'மாதிரித் தகவல்களுடன் சோதிக்கவும்' : 'Load Demonstration Cycle Records'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: '900px' }}>
      <div className="section-header">
        <div className="eyebrow">DEVICE-ISOLATED LOG</div>
        <h2>{isTa ? 'My Cycle நாட்காட்டி' : 'My Cycle — Private Log'}</h2>
        <p>
          {isTa
            ? 'உங்கள் சாதனத்தில் மட்டுமே சேமிக்கப்பட்ட பாதுகாப்பான மாதவிடாய் குறிப்புகள்.'
            : 'Private, device-only menstrual tracking and symptom log.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '24px' }}>
        {/* Form Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
            {isTa ? 'புதிய குறிப்பைச் சேர்' : 'Log Period or Symptoms'}
          </h3>

          <form onSubmit={handleAddLog}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="cycleStartDate">{isTa ? 'துவக்க தேதி' : 'Start Date'}</label>
                <input
                  id="cycleStartDate"
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cycleEndDate">{isTa ? 'முடிவு தேதி' : 'End Date'}</label>
                <input
                  id="cycleEndDate"
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="cycleFlow">{isTa ? 'உதிரப்போக்கு' : 'Flow'}</label>
                <select
                  id="cycleFlow"
                  className="form-control"
                  value={flow}
                  onChange={e => setFlow(e.target.value as any)}
                >
                  <option value="Light">Light</option>
                  <option value="Medium">Medium</option>
                  <option value="Heavy">Heavy</option>
                  <option value="Spotting">Spotting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cycleMood">{isTa ? 'மனநிலை' : 'Mood'}</label>
                <select
                  id="cycleMood"
                  className="form-control"
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                >
                  <option value="Calm">Calm</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Anxious">Anxious</option>
                  <option value="Low Energy">Low Energy</option>
                  <option value="Joyful">Joyful</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cycleSymptoms">{isTa ? 'அறிகுறிகள் (கமாவுடன்)' : 'Symptoms'}</label>
              <input
                id="cycleSymptoms"
                type="text"
                className="form-control"
                placeholder="Cramps, Headache, Bloating"
                value={symptomsInput}
                onChange={e => setSymptomsInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cycleNotes">{isTa ? 'தனிப்பட்ட குறிப்புகள்' : 'Private Notes'}</label>
              <textarea
                id="cycleNotes"
                className="form-control"
                rows={2}
                placeholder={isTa ? 'உணவு, உடற்பயிற்சி அல்லது உணர்வுகள்...' : 'Herbal tea, warm rest, walked in park...'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {isTa ? 'குறிப்பைச் சேமி' : 'Save Log Entry'}
            </button>
          </form>
        </div>

        {/* History & Settings Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {isTa ? 'பதிவு வரலாறு' : 'Cycle History'} ({cycle.logs.length})
              </h3>
              <button className="btn btn-sm btn-outline" onClick={handleExport}>
                ⬇️ Export JSON
              </button>
            </div>

            {cycle.logs.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
                {isTa ? 'இன்னும் பதிவுகள் எதுவும் இல்லை.' : 'No period logs entered yet.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cycle.logs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      background: 'var(--color-warm-white)',
                      padding: '12px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        📅 {log.startDate} to {log.endDate}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                        Flow: <strong>{log.flow}</strong> · Mood: <strong>{log.mood}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                        {log.symptoms.join(', ')}
                      </div>
                    </div>
                    <button
                      className="modal-close-btn"
                      style={{ position: 'static', width: '28px', height: '28px', fontSize: '12px' }}
                      onClick={() => deleteCycleLog(log.id)}
                      title="Delete log"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Privacy & Reminders</h4>
            <div className="form-check" style={{ marginTop: 0 }}>
              <input
                id="cycleRemindersCheck"
                type="checkbox"
                checked={cycle.remindersEnabled}
                onChange={e => toggleCycleReminders(e.target.checked)}
              />
              <label htmlFor="cycleRemindersCheck" style={{ fontSize: '0.85rem' }}>
                {isTa
                  ? 'மறைமுக அறிவிப்புகள் (லாக் ஸ்கிரீனில் மருத்துவ வார்த்தைகள் இன்றி)'
                  : 'Discreet lock-screen reminders (redacted from health keywords)'}
              </label>
            </div>

            <button
              className="btn btn-outline btn-sm btn-block"
              style={{ marginTop: '16px', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)' }}
              onClick={wipeCycleData}
            >
              🗑️ {isTa ? 'அனைத்து தகவல்களையும் அழி' : 'Permanently Wipe All Cycle Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
