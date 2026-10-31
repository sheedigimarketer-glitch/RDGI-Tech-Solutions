/**
 * HerSpace — Client-approved user journey (state machine, routing guard & member registry)
 *
 *   Welcome/Home → Registration → App Tour → Membership info → Choose & Book a Service → My Personal Space
 *
 * First-time onboarding is kept apart from authenticated member navigation. Members who
 * completed onboarding land directly in My Personal Space and never repeat registration or the tour.
 */
(function() {
  'use strict';

  const store = window.herSpaceStore;
  const config = window.HERSPACE_CONFIG;

  const STEPS = ['register', 'tour', 'membership', 'book'];
  const ROUTE_OF = { register: 'onb-register', tour: 'onb-tour', membership: 'onb-membership', book: 'onb-book' };
  const ONBOARDING_ROUTES = ['onb-register', 'onb-tour', 'onb-membership', 'onb-book', 'signin'];
  const MEMBER_ONLY_ROUTES = ['space', 'dashboard'];

  function regKey(phone) {
    return 'herspace_reg_' + String(phone || '').replace(/\D/g, '').slice(-10);
  }

  const journey = {
    STEPS: STEPS,
    ONBOARDING_ROUTES: ONBOARDING_ROUTES,

    // ---- Derived member status ----------------------------------------------------------------
    // 'guest' | 'onboarding' | 'trial' | 'paid' | 'expired'
    status() {
      const { user, entitlement, onboarding } = store.state;
      if (!user) return 'guest';
      if (!onboarding.completed) return 'onboarding';
      const s = window.herSpaceBooking ? window.herSpaceBooking.entitlementStatus(entitlement) : 'none';
      return s === 'none' ? 'expired' : s;
    },

    isAuthenticated() { return !!store.state.user; },
    isOnboarded() { return !!(store.state.user && store.state.onboarding.completed); },
    isOnboarding() { return !!(store.state.user && !store.state.onboarding.completed); },

    stepNumber() {
      const i = STEPS.indexOf(store.state.onboarding.step);
      return i === -1 ? 1 : i + 1;
    },

    // ---- Routing ------------------------------------------------------------------------------
    entryRoute() {
      if (!store.state.user) return 'home';
      if (!store.state.onboarding.completed) return ROUTE_OF[store.state.onboarding.step] || 'onb-tour';
      return 'space';
    },

    // Applies the journey guard to a requested route and returns the route that is actually allowed.
    guard(route) {
      const { user, onboarding } = store.state;

      if (route === 'onb-register') {
        if (!user) return route;
        return onboarding.completed ? 'space' : (ROUTE_OF[onboarding.step] || 'onb-tour');
      }
      if (route === 'signin') {
        return user ? (onboarding.completed ? 'space' : (ROUTE_OF[onboarding.step] || 'onb-tour')) : route;
      }
      if (route === 'onb-tour') {
        if (!user) return 'onb-register';
        return route; // first-time flow, or replay from Help / Settings
      }
      if (route === 'onb-membership' || route === 'onb-book') {
        if (!user) return 'onb-register';
        if (onboarding.completed) return 'space';
        // Cannot jump ahead of the tour
        const idx = STEPS.indexOf(onboarding.step);
        const want = STEPS.indexOf(route === 'onb-membership' ? 'membership' : 'book');
        return want > idx ? ROUTE_OF[onboarding.step] : route;
      }
      if (MEMBER_ONLY_ROUTES.indexOf(route) !== -1 && !user) {
        return 'onb-register';
      }
      return route;
    },

    // ---- Step transitions ---------------------------------------------------------------------
    finishTour(skipped) {
      const ob = store.state.onboarding;
      if (ob.completed || ob.tourReplay) {
        store.setOnboarding({ tourSeen: true, tourSkipped: !!skipped, tourReplay: false });
        return 'space';
      }
      store.setOnboarding({ step: 'membership', tourSeen: true, tourSkipped: !!skipped });
      return 'onb-membership';
    },

    replayTour() {
      store.setOnboarding({ tourReplay: true });
      return 'onb-tour';
    },

    acknowledgeMembership() {
      store.setOnboarding({ step: 'book' });
      return 'onb-book';
    },

    completeOnboarding() {
      if (!store.state.onboarding.completed) {
        store.setOnboarding({ completed: true, completedAt: new Date().toISOString() });
        if (window.herSpaceSupabase) {
          window.herSpaceSupabase.saveOnboardingState(Object.assign({}, store.state.onboarding, { lang: store.state.lang }));
        }
      }
      return 'space';
    },

    // ---- Member registry (local record; the server is the source of truth when Supabase is live) ----
    readRegistry(phone) {
      try {
        const raw = localStorage.getItem(regKey(phone));
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },

    saveRegistry() {
      const s = store.state;
      if (!s.user || !s.user.phone) return;
      try {
        localStorage.setItem(regKey(s.user.phone), JSON.stringify({
          user: s.user,
          entitlement: s.entitlement,
          onboarding: s.onboarding,
          appointments: s.appointments,
          cycle: s.cycle,
          savedIds: s.wellbeing.savedIds,
          savedAt: new Date().toISOString()
        }));
      } catch (e) {}
    },

    restoreFromRegistry(rec) {
      store.state.appointments = rec.appointments || [];
      store.state.cycle = rec.cycle || store.state.cycle;
      store.state.wellbeing.savedIds = rec.savedIds || [];
      store.state.user = rec.user;
      store.state.entitlement = rec.entitlement;
      // A returning member who finished onboarding never repeats it; an unfinished one resumes.
      store.state.onboarding = Object.assign({}, rec.onboarding, { tourReplay: false });
      if (rec.user && rec.user.preferredLang) store.state.lang = rec.user.preferredLang;
      store.notify();
    },

    // Whole days left in the trial (0 when ended)
    trialDaysLeft() {
      const ent = store.state.entitlement;
      if (!ent || !ent.trialEndsAt) return 0;
      return Math.max(0, Math.ceil((new Date(ent.trialEndsAt).getTime() - Date.now()) / 86400000));
    }
  };

  // Keep the member's record current on every state change.
  store.subscribe(() => journey.saveRegistry());

  window.herSpaceJourney = journey;
})();
