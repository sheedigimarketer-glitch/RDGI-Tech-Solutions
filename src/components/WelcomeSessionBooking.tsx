import React, { useState } from 'react';
import { supabase } from '../services/auth';

type Slot = { id: string; starts_at: string };
type WelcomeSchedule = { booking: { starts_at: string } | null; slots: Slot[] };

export function WelcomeSessionBooking({ isTa }: { isTa: boolean }) {
  const [schedule, setSchedule] = useState<WelcomeSchedule | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const copy = (en: string, ta: string) => isTa ? ta : en;
  const formatTime = (value: string) => new Intl.DateTimeFormat(isTa ? 'ta-IN' : 'en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value)) + ' IST';

  async function loadSchedule() {
    setError(false);
    setBusy(true);
    try {
      const result = await supabase.rpc('herspace_welcome_schedule');
      if (result.error) throw result.error;
      setSchedule(result.data as WelcomeSchedule);
      setSelectedSlot('');
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function reserve() {
    setError(false);
    setBusy(true);
    try {
      const result = await supabase.rpc('herspace_book_welcome_session', { requested_slot: selectedSlot });
      if (result.error) throw result.error;
      setSchedule({ booking: { starts_at: result.data as string }, slots: [] });
      setSelectedSlot('');
    } catch {
      setError(true);
      setSchedule(null);
    } finally {
      setBusy(false);
    }
  }

  const buttonClass = 'min-h-[44px] px-5 py-2.5 rounded-xl bg-[#5E2750] hover:bg-[#4c1f40] text-white text-sm font-semibold disabled:opacity-60';
  return (
    <div className="min-w-0 flex flex-col items-start gap-2">
      {error && <p role="alert" className="text-sm text-red-700">
        {copy('Unable to load or book a time. Refresh the available times and try again.', 'நேரங்களைப் பெறவோ முன்பதிவு செய்யவோ முடியவில்லை. மீண்டும் முயற்சிக்கவும்.')}
      </p>}
      {schedule?.booking ? <p role="status" className="text-sm font-semibold">
        {copy('Booked for', 'முன்பதிவு செய்யப்பட்ட நேரம்')} {formatTime(schedule.booking.starts_at)}
      </p> : schedule?.slots.length ? (
        <>
          <label className="text-sm font-medium" htmlFor="welcome-slot">{copy('Choose a 30-minute session', '30 நிமிட அமர்வைத் தேர்ந்தெடுக்கவும்')}</label>
          <select id="welcome-slot" className="max-w-full min-h-[44px] border border-slate-300 rounded-lg px-2"
            value={selectedSlot} disabled={busy} onChange={event => setSelectedSlot(event.target.value)}>
            <option value="">{copy('Select a time', 'நேரத்தைத் தேர்ந்தெடுக்கவும்')}</option>
            {schedule.slots.map(slot => <option key={slot.id} value={slot.id}>{formatTime(slot.starts_at)}</option>)}
          </select>
          <button type="button" className={buttonClass} disabled={busy || !selectedSlot} onClick={() => void reserve()}>
            {copy('Confirm free booking', 'இலவச முன்பதிவை உறுதிசெய்யவும்')}
          </button>
        </>
      ) : (
        <>
          {schedule && <p role="status" className="text-sm">{copy('No times are available within your welcome-session window.', 'உங்கள் இலவச அமர்வு காலத்திற்குள் நேரங்கள் கிடைக்கவில்லை.')}</p>}
          <button type="button" className={buttonClass} disabled={busy} onClick={() => void loadSchedule()}>
            {busy ? copy('Loading…', 'ஏற்றுகிறது…') : copy('Check available times', 'கிடைக்கும் நேரங்களைப் பார்க்கவும்')}
          </button>
        </>
      )}
    </div>
  );
}
