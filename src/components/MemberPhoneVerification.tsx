import { useState, type FormEvent } from 'react';
import { supabase } from '../services/auth';

export function MemberPhoneVerification({ isTa, verifiedPhone, onClaim }: {
  isTa: boolean;
  verifiedPhone: string;
  onClaim: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');
  const [confirmed, setConfirmed] = useState(Boolean(verifiedPhone));
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const copy = (en: string, ta: string) => isTa ? ta : en;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (!confirmed && !pendingPhone) {
        const normalizedPhone = phone.replace(/[\s-]/g, '');
        if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
          setMessage(copy('Enter your mobile number with the country code.', 'நாட்டுக் குறியீட்டுடன் உங்கள் கைபேசி எண்ணை உள்ளிடவும்.'));
          return;
        }
        const { error } = await supabase.auth.updateUser({ phone: normalizedPhone });
        if (error) throw error;
        setPendingPhone(normalizedPhone);
        return;
      }

      if (!confirmed) {
        const { error } = await supabase.auth.verifyOtp({
          phone: pendingPhone,
          token: token.trim(),
          type: 'phone_change'
        });
        if (error) throw error;
        setConfirmed(true);
        setToken('');
      }

      const { data, error } = await supabase.rpc('herspace_claim_member_entitlements');
      if (error) throw error;
      if (data === true) {
        onClaim();
      } else {
        setMessage(copy(
          'These benefits are unavailable for this account. Contact support if you need help.',
          'இந்தக் கணக்கிற்கு இந்தச் சலுகைகள் கிடைக்கவில்லை. உதவி தேவைப்பட்டால் ஆதரவுக் குழுவை அணுகவும்.'
        ));
      }
    } catch {
      setMessage(copy(
        'We could not complete that step. Check the details and try again.',
        'இந்தப் படியை முடிக்க முடியவில்லை. விவரங்களைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
      ));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white/80 border border-[#5E2750]/25 p-6 mb-6 grid gap-3">
      <h2 className="text-lg font-bold">{copy('Verify your mobile number', 'உங்கள் கைபேசி எண்ணைச் சரிபார்க்கவும்')}</h2>
      <p className="text-sm text-slate-600">
        {copy(
          'Verify your mobile number to check eligibility for first-time member benefits.',
          'புதிய உறுப்பினர் சலுகைகளுக்கான தகுதியைச் சரிபார்க்க உங்கள் கைபேசி எண்ணை உறுதிப்படுத்தவும்.'
        )}
      </p>
      {!confirmed && (pendingPhone ? (
        <label className="grid gap-1 text-sm font-medium">
          {copy('SMS verification code', 'குறுஞ்செய்திச் சரிபார்ப்புக் குறியீடு')}
          <input className="min-h-[44px] w-full rounded-lg border border-slate-300 px-3"
            inputMode="numeric" autoComplete="one-time-code" value={token}
            onChange={event => setToken(event.target.value)} required />
        </label>
      ) : (
        <label className="grid gap-1 text-sm font-medium">
          {copy('Mobile number with country code', 'நாட்டுக் குறியீட்டுடன் கைபேசி எண்')}
          <input className="min-h-[44px] w-full rounded-lg border border-slate-300 px-3"
            type="tel" autoComplete="tel" placeholder="+91" value={phone}
            onChange={event => setPhone(event.target.value)} required />
        </label>
      ))}
      {message && <p role="status" className="text-sm">{message}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy}
          className="min-h-[44px] rounded-xl bg-[#5E2750] px-4 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? copy('Please wait…', 'காத்திருக்கவும்…') : confirmed
            ? copy('Check eligibility', 'தகுதியைச் சரிபார்க்கவும்')
            : pendingPhone ? copy('Verify code', 'குறியீட்டைச் சரிபார்க்கவும்') : copy('Send SMS code', 'குறுஞ்செய்திக் குறியீட்டை அனுப்பவும்')}
        </button>
        {!confirmed && pendingPhone && (
          <button type="button" disabled={busy} className="min-h-[44px] px-3 text-sm font-semibold"
            onClick={() => { setPendingPhone(''); setToken(''); setMessage(''); }}>
            {copy('Start again', 'மீண்டும் தொடங்கவும்')}
          </button>
        )}
      </div>
    </form>
  );
}
