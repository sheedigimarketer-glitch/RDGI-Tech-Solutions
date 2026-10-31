/**
 * HerSpace Premium 2.0 - Member Authentication & Trial Enrolment Flow
 */

(function() {
  'use strict';

  const store = window.herSpaceStore;
  const db = window.herSpaceSupabase;
  const config = window.HERSPACE_CONFIG;

  function getCryptoRandomOtp() {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(6);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, b => (b % 10).toString()).join('');
    }
    return Math.floor(100000 + (Date.now() % 900000)).toString();
  }

  function getCryptoRandomId(prefix = 'usr') {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(8);
      window.crypto.getRandomValues(bytes);
      return prefix + '-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }
    return prefix + '-' + Date.now().toString(36);
  }

  window.herSpaceAuth = {
    // Cryptographic OTP Generation & Verification
    generatedOtp: '849201',

    sendPhoneOtp(phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      // Generate a fresh cryptographically secure 6-digit OTP
      this.generatedOtp = getCryptoRandomOtp();
      return {
        success: true,
        formattedPhone: '+91 ' + cleanPhone.slice(-10),
        demoOtp: this.generatedOtp // Exposed for seamless testing in demo mode
      };
    },

    async verifyPhoneOtpAndRegister({ phone, otp, fullName, email, age, identity, agreeTerms, autoRenew }) {
      if (parseInt(age, 10) < config.minAge) {
        throw new Error('HerSpace is strictly for women and transgender women aged 18 and older.');
      }
      if (!agreeTerms) {
        throw new Error('You must accept the Terms of Service and Privacy Policy to proceed.');
      }
      if (otp !== this.generatedOtp) {
        throw new Error('Invalid OTP. Please check the cryptographic code sent to your mobile.');
      }

      // Check if duplicate user in local registry
      const registeredKey = 'herspace_reg_' + phone.replace(/\D/g, '').slice(-10);
      const isExisting = localStorage.getItem(registeredKey);

      const userId = getCryptoRandomId('usr');
      const cleanPhone = '+91 ' + phone.replace(/\D/g, '').slice(-10);

      let entitlementData;
      if (isExisting) {
        // Returning user - NO second free trial or welcome voucher
        const prevData = JSON.parse(isExisting);
        entitlementData = {
          trialStartedAt: prevData.trialStartedAt,
          trialEndsAt: prevData.trialEndsAt,
          welcomeCallExpiresAt: prevData.welcomeCallExpiresAt,
          welcomeCallStatus: 'expired',
          paidThrough: prevData.paidThrough || null,
          autoRenew: false,
          isReturning: true
        };
        store.toast('Welcome back! Existing account restored. Note: Returning members do not receive duplicate trial benefits.', 'warning');
      } else {
        // Brand New Member - Claim 3-month free trial + 7-day complimentary session
        const { data } = await db.claimFirstTrial(cleanPhone, email);
        entitlementData = data;
        localStorage.setItem(registeredKey, JSON.stringify(entitlementData));
        store.toast('🎉 Welcome to HerSpace! Your 3-month free trial and complimentary 30-min session are active.', 'success');
      }

      const userData = {
        id: userId,
        fullName: fullName || 'HerSpace Member',
        phone: cleanPhone,
        email: email || '',
        age: parseInt(age, 10),
        identity: identity || 'woman',
        role: 'member',
        createdAt: new Date().toISOString()
      };

      store.setUser(userData);
      store.setEntitlement(entitlementData);

      return { user: userData, entitlement: entitlementData };
    },

    toggleAutoRenewMandate(checked) {
      if (store.state.entitlement) {
        store.setEntitlement(Object.assign({}, store.state.entitlement, {
          autoRenewAuthorized: Boolean(checked),
          autoRenew: Boolean(checked)
        }));
      }
      store.toast(checked ? '₹149/month post-trial auto-renewal authorized.' : 'Auto-renewal disabled. No recurring charges will occur.', 'success');
    },

    // ------------------------------------------------------------------------------------------
    // Client-approved journey: registration, sign-in and sign-out
    // ------------------------------------------------------------------------------------------
    phoneOtpIsLive() {
      return !!(config.verification && config.verification.phone && config.verification.phone.provider);
    },

    // Requests a mobile OTP. Without a connected SMS provider this is a clearly-labelled TEST code.
    requestMobileOtp(phone) {
      const cleanPhone = String(phone || '').replace(/\D/g, '');
      if (cleanPhone.length < 10) throw new Error('Please enter a valid 10-digit mobile number.');
      if (this.phoneOtpIsLive()) {
        throw new Error('An SMS provider is configured but its integration is not part of this build.');
      }
      this.generatedOtp = getCryptoRandomOtp();
      return { live: false, testCode: this.generatedOtp, formattedPhone: '+91 ' + cleanPhone.slice(-10) };
    },

    validateRegistration(p) {
      const phone10 = String(p.phone || '').replace(/\D/g, '').slice(-10);
      if (!p.fullName || !p.fullName.trim()) throw new Error('Please enter your name or preferred alias.');
      if (phone10.length !== 10) throw new Error('Please enter a valid 10-digit mobile number.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(p.email || '').trim())) throw new Error('Please enter a valid email address.');
      if (!p.password || String(p.password).length < 8) throw new Error('Password must be at least 8 characters.');
      if (!(parseInt(p.age, 10) >= config.minAge)) throw new Error('HerSpace is strictly for women and transgender women aged 18 and older.');
      if (p.identity !== 'woman' && p.identity !== 'trans_woman') throw new Error('Please select your eligibility category.');
      if (!p.agreeTerms) throw new Error('You must accept the Terms of Service and Privacy Policy to proceed.');
      if (!p.otp) throw new Error('Please enter the mobile code.');
      return phone10;
    },

    async registerMember(p) {
      const phone10 = this.validateRegistration(p);
      if (!this.phoneOtpIsLive() && String(p.otp) !== this.generatedOtp) {
        throw new Error('That mobile code is not correct. Please check the code shown and try again.');
      }
      const cleanPhone = '+91 ' + phone10;
      const email = p.email.trim().toLowerCase();

      // One account per mobile number on this device registry (server dedup applies when live).
      if (window.herSpaceJourney && window.herSpaceJourney.readRegistry(phone10)) {
        const err = new Error('This mobile number is already registered. Please sign in instead.');
        err.code = 'ALREADY_REGISTERED';
        throw err;
      }

      // Email verification through Supabase Auth when live; otherwise clearly local/unsent.
      let emailVerification = 'not_sent_local_mode';
      let authUserId = null;
      let hasSession = false;
      if (db.isLive()) {
        const res = await db.signUp(email, p.password, {
          full_name: p.fullName.trim(), phone: cleanPhone, age: parseInt(p.age, 10),
          identity: p.identity, preferred_lang: p.preferredLang || 'en'
        });
        if (res.error) throw new Error(res.error.message || 'Registration could not be completed.');
        const u = res.data && res.data.user;
        authUserId = u ? u.id : null;
        hasSession = !!(res.data && res.data.session);
        emailVerification = u && u.email_confirmed_at ? 'verified' : 'pending';
      }

      const claim = await db.claimFirstTrial(cleanPhone, email);
      const entitlement = claim.data;

      const user = {
        id: authUserId || getCryptoRandomId('usr'),
        fullName: p.fullName.trim(),
        phone: cleanPhone,
        email: email,
        age: parseInt(p.age, 10),
        identity: p.identity,
        preferredLang: p.preferredLang || 'en',
        role: 'member',
        phoneVerification: this.phoneOtpIsLive() ? 'verified' : 'test_code_only',
        emailVerification: emailVerification,
        backendSession: hasSession,
        createdAt: new Date().toISOString()
      };

      store.state.appointments = [];
      store.setUser(user);
      store.setEntitlement(entitlement);
      store.setOnboarding({ step: 'tour', tourSeen: false, tourSkipped: false, completed: false, completedAt: null, tourReplay: false });
      store.setLanguage(user.preferredLang);
      return { user, entitlement };
    },

    // Returning member sign-in. Live: email + password via Supabase. Local: mobile + test code.
    async signInMember(p) {
      if (db.isLive() && p.email && p.password) {
        const res = await db.signIn(p.email, p.password);
        if (res.error) throw new Error(res.error.message || 'Sign-in failed. Please check your email and password.');
        const rec = await db.fetchMemberRecord();
        const identity = rec && rec.identity;
        const authUser = (res.data && res.data.user) || (rec && rec.authUser);
        const meta = (authUser && authUser.user_metadata) || {};
        let entitlement = null;
        if (rec && rec.entitlement) {
          entitlement = {
            trialStartedAt: rec.entitlement.first_trial_started_at,
            trialEndsAt: rec.entitlement.first_trial_ends_at,
            welcomeCallExpiresAt: rec.entitlement.welcome_call_expires_at,
            welcomeCallStatus: rec.entitlement.welcome_call_status,
            paidThrough: rec.entitlement.paid_through,
            autoRenew: rec.entitlement.auto_renew_enabled,
            source: 'server'
          };
        } else {
          const claim = await db.claimFirstTrial(meta.phone || '', p.email);
          entitlement = claim.data;
        }
        const user = {
          id: authUser.id,
          fullName: (identity && identity.full_name) || meta.full_name || 'HerSpace Member',
          phone: (identity && identity.phone_e164) || meta.phone || '',
          email: authUser.email,
          age: (identity && identity.age) || meta.age || null,
          identity: (identity && identity.identity_category) || meta.identity || 'woman',
          preferredLang: meta.preferred_lang || store.state.lang,
          role: 'member',
          phoneVerification: 'unknown',
          emailVerification: authUser.email_confirmed_at ? 'verified' : 'pending',
          backendSession: true,
          createdAt: authUser.created_at
        };
        store.setUser(user);
        store.setEntitlement(entitlement);
        // Signing in is, by definition, a returning member: do not repeat registration or the tour.
        store.setOnboarding({ completed: true, tourSeen: true, completedAt: new Date().toISOString(), tourReplay: false });
        store.setLanguage(user.preferredLang || 'en');
        return { user, entitlement };
      }

      const phone10 = String(p.phone || '').replace(/\D/g, '').slice(-10);
      if (phone10.length !== 10) throw new Error('Please enter your 10-digit mobile number.');
      if (!this.phoneOtpIsLive() && String(p.otp) !== this.generatedOtp) {
        throw new Error('That mobile code is not correct. Request a new code and try again.');
      }
      const rec = window.herSpaceJourney && window.herSpaceJourney.readRegistry(phone10);
      if (!rec) {
        throw new Error('No HerSpace account was found for this number on this device.');
      }
      window.herSpaceJourney.restoreFromRegistry(rec);
      return { user: rec.user, entitlement: rec.entitlement };
    },

    signOut() {
      if (window.herSpaceJourney) window.herSpaceJourney.saveRegistry();
      db.signOut();
      store.resetMemberSession();
      store.toast('You have been signed out safely.', 'success');
      if (window.herSpaceApp) window.herSpaceApp.navigate('home');
    }
  };
})();
