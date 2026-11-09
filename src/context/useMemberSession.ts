import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { memberResetPath, supabase } from '../services/auth';
import { readMember } from '../services/member';

export function useMemberSession() {
  const path = window.location.pathname;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [member, setMember] = useState<Awaited<ReturnType<typeof readMember>>>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (/^\/admin(?:\/|$)/.test(path)) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
      if (path === memberResetPath && event === 'PASSWORD_RECOVERY' && next) setRecovery(true);
      if (event === 'SIGNED_OUT') setRecovery(false);
      setSession(previous => previous?.user.id === next?.user.id && previous ? previous : next);
      setInitialized(true);
    });
    return () => subscription.unsubscribe();
  }, [path]);

  useEffect(() => {
    if (!initialized) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    if (!session || path === memberResetPath) {
      setAccountId(null);
      setMember(null);
      setLoading(false);
      return;
    }

    // Keep network calls outside the SDK's auth-state listener.
    void (async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user?.email_confirmed_at || user.id !== session.user.id) {
          throw new Error('Verified member session required.');
        }
        const record = await readMember(user);
        if (!cancelled) {
          setAccountId(user.id);
          setMember(record);
        }
      } catch {
        if (!cancelled) {
          setAccountId(null);
          setMember(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [initialized, path, revision, session]);

  const currentAccount = session?.user.id === accountId && path !== memberResetPath ? accountId : null;
  return {
    accountId: currentAccount,
    member: currentAccount ? member : null,
    loading,
    recovery,
    error,
    refresh: () => setRevision(value => value + 1)
  };
}
