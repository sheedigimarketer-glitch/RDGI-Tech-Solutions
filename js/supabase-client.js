/**
 * HerSpace Premium 2.0 - Supabase Client & Database Gateway
 * Robust client with fallback mock support for offline/local previews
 */

(function() {
  'use strict';

  const cfg = (window.HERSPACE_CONFIG && window.HERSPACE_CONFIG.supabase) || {
    url: (window.HERSPACE_SUPABASE && window.HERSPACE_SUPABASE.url) || '',
    publishableKey: (window.HERSPACE_SUPABASE && window.HERSPACE_SUPABASE.publishableKey) || ''
  };
  let client = null;
  let isLive = false;

  // Test/QA switch: force local mode so automated tests never create real auth users or send emails.
  let forceOffline = false;
  try { forceOffline = localStorage.getItem('herspace_force_offline') === '1'; } catch (e) {}

  // Check if credentials are placeholders or dummy
  const isPlaceholder = !cfg.url || cfg.url.includes('placeholder') || !cfg.publishableKey || cfg.publishableKey.includes('dummy');

  try {
    if (!forceOffline && !isPlaceholder && window.supabase && typeof window.supabase.createClient === 'function') {
      client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      isLive = true;
      console.log('HerSpace Supabase initialized in LIVE mode:', cfg.url);
    } else {
      isLive = false;
      // Seamless simulated mock mode for UI preview
    }
  } catch (err) {
    isLive = false;
    client = null;
    console.info('Supabase using simulated fallback mode for preview/development.');
  }

  window.herSpaceSupabase = {
    isLive: () => isLive,
    getClient: () => client,

    // Auth: Sign Up with Email
    async signUp(email, password, metadata = {}) {
      if (isLive && client) {
        return await client.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: metadata,
            emailRedirectTo: window.location.origin + window.location.pathname
          }
        });
      }
      let mockUserId = 'usr-' + Date.now().toString(36);
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const bytes = new Uint8Array(8);
        window.crypto.getRandomValues(bytes);
        mockUserId = 'usr-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      }
      const mockUser = {
        id: mockUserId,
        email: email.trim().toLowerCase(),
        user_metadata: metadata,
        email_confirmed_at: new Date().toISOString()
      };
      return { data: { user: mockUser, session: { access_token: 'mock-token' } }, error: null };
    },

    // Auth: Sign In
    async signIn(email, password) {
      if (isLive && client) {
        return await client.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
      }
      const mockUser = {
        id: 'usr-demo-001',
        email: email.trim().toLowerCase(),
        user_metadata: { full_name: 'Member Preview' },
        email_confirmed_at: new Date().toISOString()
      };
      return { data: { user: mockUser, session: { access_token: 'mock-token' } }, error: null };
    },

    // Auth: Sign Out
    async signOut() {
      if (isLive && client) {
        return await client.auth.signOut();
      }
      return { error: null };
    },

    // Auth: Reset Password
    async resetPassword(email) {
      if (isLive && client) {
        return await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: window.location.origin + window.location.pathname + '#reset-password'
        });
      }
      return { data: {}, error: null };
    },

    // Auth: resend the email confirmation message
    async resendEmailConfirmation(email) {
      if (isLive && client) {
        return await client.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
      }
      return { data: null, error: { message: 'Email delivery is not connected in local mode.' } };
    },

    // Reads the signed-in member's server records (RLS: own rows only). Returns null when unavailable.
    async fetchMemberRecord() {
      if (!(isLive && client)) return null;
      try {
        const { data: sess } = await client.auth.getSession();
        const user = sess && sess.session && sess.session.user;
        if (!user) return null;
        const identity = await client.from('member_identity').select('*').eq('user_id', user.id).maybeSingle();
        const ent = await client.from('member_entitlement').select('*').eq('user_id', user.id).maybeSingle();
        return {
          authUser: user,
          identity: identity && !identity.error ? identity.data : null,
          entitlement: ent && !ent.error ? ent.data : null
        };
      } catch (e) {
        console.warn('fetchMemberRecord failed:', e);
        return null;
      }
    },

    // Best-effort upsert of onboarding state (table added by migration 005 once approved/applied).
    async saveOnboardingState(state) {
      if (!(isLive && client)) return { ok: false, reason: 'offline' };
      try {
        const { data: sess } = await client.auth.getSession();
        const user = sess && sess.session && sess.session.user;
        if (!user) return { ok: false, reason: 'no-session' };
        const { error } = await client.from('member_onboarding').upsert({
          user_id: user.id,
          tour_completed: !!state.tourSeen,
          tour_skipped: !!state.tourSkipped,
          onboarding_completed: !!state.completed,
          preferred_lang: state.lang || 'en',
          updated_at: new Date().toISOString()
        });
        return error ? { ok: false, reason: error.message } : { ok: true };
      } catch (e) {
        return { ok: false, reason: String(e && e.message || e) };
      }
    },

    // Entitlement: Atomic Claim First Trial
    async claimFirstTrial(phone, email) {
      const now = new Date();
      // 3 Calendar Months Trial
      const trialEndsAt = new Date(now);
      trialEndsAt.setMonth(trialEndsAt.getMonth() + 3);

      // 7 Days (168 Hours) Complimentary Listener Session Expiry
      const welcomeCallExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (isLive && client) {
        try {
          const { data, error } = await client.rpc('claim_first_trial');
          if (!error && data) {
            const row = Array.isArray(data) ? data[0] : data;
            return {
              data: {
                trialStartedAt: now.toISOString(),
                trialEndsAt: row.trial_ends_at,
                welcomeCallExpiresAt: row.welcome_expires_at,
                welcomeCallStatus: 'available',
                paidThrough: null,
                autoRenew: false,
                source: 'server'
              },
              error: null
            };
          }
        } catch (e) {
          console.warn('Live RPC claim_first_trial failed, using client calculated entitlement:', e);
        }
      }

      // Calculated Client Return (NOT server-enforced: duplicates are only prevented locally)
      return {
        data: {
          trialStartedAt: now.toISOString(),
          trialEndsAt: trialEndsAt.toISOString(),
          welcomeCallExpiresAt: welcomeCallExpiresAt.toISOString(),
          welcomeCallStatus: 'available',
          paidThrough: null,
          autoRenew: false,
          source: 'local'
        },
        error: null
      };
    }
  };
})();
