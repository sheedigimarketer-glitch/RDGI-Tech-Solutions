/**
 * HerSpace Premium 4.0 — Master UI Application Orchestrator
 * Complete Mobile Application: Women's Life & Wellbeing, Optional My Cycle Tracker,
 * HerSpace Calm Audio Sanctuary, Live Melodies (Singers), Exotel 2-Way Masked Calling,
 * Strict INR (₹) Currency Formatting & 100% Tamil–English Localization
 */

(function() {
  'use strict';

  const store = window.herSpaceStore;
  const config = window.HERSPACE_CONFIG;
  const auth = window.herSpaceAuth;
  const booking = window.herSpaceBooking;
  const admin = window.herSpaceAdmin;
  const formatINR = window.herSpaceFormatINR;

  let activeRoute = 'home';
  let bookingModalState = {
    expert: null,
    selectedDate: null,
    selectedSlot: null,
    selectedMode: '2-Way Masked Phone Call',
    sessionType: 'paid',
    isComplimentary: false
  };

  // Translation helper
  function t(key, vars) {
    return window.herSpaceTranslate(key, vars);
  }

  function isTa() {
    return store.state.lang === 'ta';
  }

  function formatCountdown(targetDateIso) {
    if (!targetDateIso) return '';
    const diff = new Date(targetDateIso).getTime() - Date.now();
    if (diff <= 0) return isTa() ? 'காலாவதியானது' : 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return isTa()
      ? `${days} நாட்கள் ${hours} மணிநேரம் மீதமுள்ளது`
      : `${days}d ${hours}h remaining`;
  }

  // Top Crisis Banner
  function renderCrisisBanner() {
    return `
      <div class="crisis-top-banner" role="alert">
        <span>${t('crisisAlert')}</span>
        <button class="btn btn-sm btn-outline" style="color:#FFF;border-color:rgba(255,255,255,0.5);padding:3px 12px;font-size:0.76rem;min-height:30px;" onclick="window.herSpaceApp.openCrisisModal()">
          ${t('crisisBannerBtn')}
        </button>
      </div>
    `;
  }

  // App Header (Desktop: Logo, Home, Explore, Life & Wellbeing, Calm, Membership, More Dropdown, Get Started / Account)
  // Mobile: Compact Logo, Notification Icon, Language Pill, Menu Button
  function renderHeader() {
    const { user, lang, notifications } = store.state;
    const notifCount = (notifications || []).length;
    const isMember = window.herSpaceJourney.isOnboarded();
    const isMoreActive = activeRoute === 'cycle' || activeRoute === 'singers' || activeRoute === 'dashboard' || activeRoute === 'how' || activeRoute === 'policies';

    return `
      <header class="app-header">
        <div class="container header-inner">
          <a class="brand-logo" href="#home" onclick="window.herSpaceApp.navigate('home'); return false;">
            <img src="assets/herspace-client-logo.webp" alt="HerSpace Logo" />
          </a>

          ${isMember ? renderMemberDesktopNav() : `<nav class="desktop-nav" aria-label="Main Navigation">
            <button class="nav-item ${activeRoute === 'home' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('home')">
              ${t('navHome')}
            </button>
            <button class="nav-item ${activeRoute === 'support' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('support')">
              ${t('navExplore')}
            </button>
            <button class="nav-item ${activeRoute === 'wellbeing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('wellbeing')">
              ${t('navWellbeing')}
            </button>
            <button class="nav-item ${activeRoute === 'calm' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('calm')">
              ${t('navCalm')}
            </button>
            <button class="nav-item ${activeRoute === 'pricing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('pricing')">
              ${t('navPricing')}
            </button>

            <!-- Secondary Navigation in Clean "More" Dropdown -->
            <div class="nav-dropdown" id="desktopMoreDropdown">
              <button type="button" class="nav-item nav-dropdown-trigger ${isMoreActive ? 'active' : ''}" onclick="document.getElementById('desktopMoreDropdown').classList.toggle('open')">
                <span>${t('navMore')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="nav-dropdown-menu" role="menu">
                <button class="nav-dropdown-item ${activeRoute === 'cycle' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('cycle')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>${t('navMyCycle')}</span>
                </button>
                <button class="nav-dropdown-item ${activeRoute === 'singers' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('singers')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  <span>${t('navSingers')}</span>
                </button>
                <button class="nav-dropdown-item ${activeRoute === 'dashboard' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('dashboard')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>${t('navBookings')}</span>
                </button>
                <button class="nav-dropdown-item ${activeRoute === 'how' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('how')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <span>${t('navFAQs')}</span>
                </button>
                <button class="nav-dropdown-item" onclick="window.herSpaceApp.openProApplyModal()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  <span>${t('drawerJoinProfessional')}</span>
                </button>
              </div>
            </div>
          </nav>`}

          <div class="nav-actions">
            <!-- Notification Bell Button -->
            <button class="header-icon-btn" onclick="window.herSpaceApp.navigate('dashboard')" aria-label="${t('navNotifications')}" title="${t('navNotifications')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              ${notifCount > 0 ? `<span class="notif-badge">${notifCount}</span>` : ''}
            </button>

            <!-- Language Switcher Pill -->
            <button class="lang-toggle-btn" id="headerLangSwitchBtn" onclick="window.herSpaceApp.toggleLanguage()" aria-label="Switch Language">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span>${lang === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            ${user ? `
              <button class="btn btn-sm btn-secondary btn-desktop-only" id="headerAccountBtn" onclick="window.herSpaceApp.navigate('${isMember ? 'space' : window.herSpaceJourney.entryRoute()}')">
                <span>${user.fullName ? user.fullName.split(' ')[0] : t('navDashboard')}</span>
              </button>
              <button class="btn btn-sm btn-outline btn-desktop-only" onclick="window.herSpaceAuth.signOut()">${t('navSignOut')}</button>
            ` : `
              <button class="btn btn-sm btn-ghost btn-desktop-only" id="headerSignIn" onclick="window.herSpaceApp.navigate('signin')">
                <span>${t('btnSignInShort')}</span>
              </button>
              <button class="btn btn-sm btn-primary btn-desktop-only" id="headerGetStarted" onclick="window.herSpaceApp.openGetStartedModal()">
                <span>${t('navGetStarted')}</span>
              </button>
            `}

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" aria-label="Open navigation menu" onclick="window.herSpaceApp.toggleMobileDrawer(true)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Authenticated member navigation (desktop): Home, Support, Live Melodies, Bookings, My Personal Space
  function renderMemberDesktopNav() {
    const isMoreActive = ['wellbeing', 'calm', 'cycle', 'pricing', 'how'].indexOf(activeRoute) !== -1;
    const item = (route, label) => `
      <button class="nav-item ${activeRoute === route ? 'active' : ''}" onclick="window.herSpaceApp.navigate('${route}')">${label}</button>`;
    return `
      <nav class="desktop-nav" aria-label="Main Navigation">
        ${item('home', t('navHome'))}
        ${item('support', t('navSupport'))}
        ${item('singers', t('navSingers'))}
        ${item('dashboard', t('navBookings'))}
        ${item('space', t('spaceTitle'))}
        <div class="nav-dropdown" id="desktopMoreDropdown">
          <button type="button" class="nav-item nav-dropdown-trigger ${isMoreActive ? 'active' : ''}" onclick="document.getElementById('desktopMoreDropdown').classList.toggle('open')">
            <span>${t('navMore')}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="nav-dropdown-menu" role="menu">
            <button class="nav-dropdown-item ${activeRoute === 'wellbeing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('wellbeing')"><span>${t('navWellbeing')}</span></button>
            <button class="nav-dropdown-item ${activeRoute === 'calm' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('calm')"><span>${t('navCalm')}</span></button>
            <button class="nav-dropdown-item ${activeRoute === 'cycle' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('cycle')"><span>${t('navMyCycle')}</span></button>
            <button class="nav-dropdown-item ${activeRoute === 'pricing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('pricing')"><span>${t('navPricing')}</span></button>
            <button class="nav-dropdown-item ${activeRoute === 'how' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('how')"><span>${t('navFAQs')}</span></button>
            <button class="nav-dropdown-item" id="menuReplayTour" onclick="window.herSpaceJourneyUI.replayTour()"><span>${t('navHelpTour')}</span></button>
          </div>
        </div>
      </nav>
    `;
  }

  // Mobile bottom bar. Members: Home, Support, Melodies, Bookings, My Space.
  // Guests: Home, Support, Melodies, Membership, Join. The onboarding sequence is never shown as tabs.
  function renderMobileBottomBar() {
    const isMember = window.herSpaceJourney.isOnboarded();
    const icons = {
      home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      support: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
      melodies: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line>',
      bookings: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
      space: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
      membership: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>',
      join: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>'
    };
    const tab = (id, route, label, active) => `
      <button class="bottom-nav-item ${active ? 'active' : ''}" id="tab-${id}" onclick="window.herSpaceApp.navigate('${route}')">
        <span class="nav-svg-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[id]}</svg></span>
        <span>${label}</span>
      </button>`;
    const homeActive = ['home', 'wellbeing'].indexOf(activeRoute) !== -1;
    const spaceActive = ['space', 'calm', 'cycle'].indexOf(activeRoute) !== -1;
    return `
      <nav class="mobile-bottom-nav" aria-label="Primary Mobile Navigation">
        ${tab('home', 'home', t('navHome'), homeActive)}
        ${tab('support', 'support', t('navSupport'), activeRoute === 'support')}
        ${tab('melodies', 'singers', t('navMelodies'), activeRoute === 'singers')}
        ${isMember
          ? tab('bookings', 'dashboard', t('navBookings'), activeRoute === 'dashboard') + tab('space', 'space', t('navSpace'), spaceActive)
          : tab('membership', 'pricing', t('navPlans'), activeRoute === 'pricing') + tab('join', 'onb-register', t('navJoin'), activeRoute === 'signin')}
      </nav>
    `;
  }

  // Sync Static Modals & Mobile Drawer into Active Language (en / ta)
  function syncStaticModalsAndDrawer() {
    const lang = store.state.lang;
    const drawerEl = document.getElementById('mobileDrawerDynamic');
    if (drawerEl) {
      drawerEl.innerHTML = `
        <div class="drawer-header">
          <div>
            <img src="assets/herspace-client-logo.webp" alt="HerSpace" style="height:32px;width:auto;" />
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-top:4px;">${t('drawerSubTitle')}</div>
          </div>
          <button class="modal-close-btn" style="position:static;" onclick="window.herSpaceApp.toggleMobileDrawer(false)" aria-label="${t('btnClose')}">✕</button>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--color-bg-lavender);padding:10px 14px;border-radius:12px;margin-bottom:16px;">
          <span style="font-size:0.85rem;font-weight:700;color:var(--color-primary-dark);">${t('drawerLanguageTitle')}</span>
          <button class="btn btn-sm btn-secondary" onclick="window.herSpaceApp.toggleLanguage()">
            ${lang === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>

        ${window.herSpaceJourney.isOnboarded() ? `
          <nav class="drawer-links" style="margin-bottom:16px;">
            <a href="#space" class="drawer-link ${activeRoute === 'space' ? 'active' : ''}" id="drawerSpace" onclick="window.herSpaceApp.navigate('space');window.herSpaceApp.toggleMobileDrawer(false);return false;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              <span>${t('spaceTitle')}</span>
            </a>
            <a href="#tour" class="drawer-link" id="drawerReplayTour" onclick="window.herSpaceApp.toggleMobileDrawer(false);window.herSpaceJourneyUI.replayTour();return false;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>${t('navHelpTour')}</span>
            </a>
          </nav>
        ` : ''}

        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--color-text-muted);margin-bottom:6px;">
          ${t('drawerQuickFeatures')}
        </div>
        <nav class="drawer-links" style="margin-bottom:16px;">
          <a href="#wellbeing" class="drawer-link ${activeRoute === 'wellbeing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('wellbeing');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
            <span>${t('navWellbeing')}</span>
          </a>
          <a href="#cycle" class="drawer-link ${activeRoute === 'cycle' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('cycle');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${t('navMyCycle')}</span>
          </a>
          <a href="#calm" class="drawer-link ${activeRoute === 'calm' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('calm');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            <span>${t('navCalm')}</span>
          </a>
          <a href="#singers" class="drawer-link ${activeRoute === 'singers' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('singers');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>
            <span>${t('navSingers')}</span>
          </a>
        </nav>

        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--color-text-muted);margin-bottom:6px;">
          ${t('drawerSupportNavigation')}
        </div>
        <nav class="drawer-links" style="margin-bottom:16px;">
          <a href="#home" class="drawer-link ${activeRoute === 'home' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('home');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <span>${t('navHome')}</span>
          </a>
          <a href="#support" class="drawer-link ${activeRoute === 'support' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('support');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <span>${t('navChooseSupport')}</span>
          </a>
          <a href="#pricing" class="drawer-link ${activeRoute === 'pricing' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('pricing');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <span>${t('navPricing')} (₹)</span>
          </a>
          <a href="#dashboard" class="drawer-link ${activeRoute === 'dashboard' ? 'active' : ''}" onclick="window.herSpaceApp.navigate('dashboard');window.herSpaceApp.toggleMobileDrawer(false);return false;">
            <span>${t('navDashboard')}</span>
          </a>
        </nav>

        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--color-border);display:flex;flex-direction:column;gap:10px;">
          ${window.herSpaceJourney.isAuthenticated() ? `
            <button class="btn btn-outline btn-sm btn-block" onclick="window.herSpaceApp.toggleMobileDrawer(false);window.herSpaceAuth.signOut();">
              ${t('navSignOut')}
            </button>
          ` : `
            <button class="btn btn-primary btn-block" onclick="window.herSpaceApp.openGetStartedModal();window.herSpaceApp.toggleMobileDrawer(false);">
              ${t('navGetStarted')}
            </button>
            <button class="btn btn-outline btn-sm btn-block" onclick="window.herSpaceApp.navigate('signin');window.herSpaceApp.toggleMobileDrawer(false);">
              ${t('btnSignInShort')}
            </button>
          `}
          <button class="btn btn-outline btn-sm btn-block" onclick="window.herSpaceApp.openProApplyModal();window.herSpaceApp.toggleMobileDrawer(false);">
            ${t('drawerJoinProfessional')}
          </button>
          <button class="btn btn-danger btn-sm btn-block" onclick="window.herSpaceApp.openCrisisModal();window.herSpaceApp.toggleMobileDrawer(false);">
            ${t('drawerCrisisBtn')}
          </button>
        </div>
      `;
    }

    // Crisis Modal Localization
    const crisisEl = document.getElementById('crisisModalDynamic');
    if (crisisEl) {
      crisisEl.innerHTML = `
        <div class="eyebrow" style="color:var(--color-danger);">${isTa() ? 'அவசர உதவி எண்கள்' : 'EMERGENCY ASSISTANCE'}</div>
        <h2 style="color:var(--color-danger);font-size:1.65rem;margin-bottom:8px;">
          ${isTa() ? '24/7 அவசர மற்றும் மனநல உதவி எண்கள்' : '24/7 Crisis Support Helplines'}
        </h2>
        <p style="font-size:0.9rem;">
          ${t('crisisAlert')}
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;margin:18px 0;">
          ${config.crisisHelplines.map(h => `
            <div class="card" style="border-left:4px solid var(--color-danger);padding:14px;">
              <h4 style="margin-bottom:4px;">${isTa() ? h.nameTa : h.name}</h4>
              <div style="font-size:1.3rem;font-weight:800;color:var(--color-danger);">📞 ${h.number} ${h.tollFree ? ' / ' + h.tollFree : ''}</div>
              <div style="font-size:0.82rem;color:var(--color-ink-muted);">${isTa() ? h.descriptionTa : h.description}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-secondary btn-block" onclick="window.herSpaceApp.closeCrisisModal()">${t('btnClose')}</button>
      `;
    }

    // Auth Modal Localization
    const setTxt = function(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setTxt('getStartedTitle', t('authModalTitle'));
    setTxt('lblAuthPhone', t('authPhoneLabel'));
    setTxt('lblAuthName', t('authNameLabel'));
    setTxt('lblAuthEmail', t('authEmailLabel'));
    setTxt('lblAuthAgree', t('authPrivacyConfirm'));
    setTxt('btnAuthSubmit', t('authRegisterSubmit'));
    setTxt('proApplyHeading', t('proApplyTitle'));
    setTxt('proApplyDesc', t('proApplySubtitle'));
    setTxt('lblProRole', t('proRoleLabel'));
    setTxt('optRoleListener', t('proRoleListener'));
    setTxt('optRoleCounsellor', t('proRoleCounsellor'));
    setTxt('optRoleSinger', t('proRoleSinger'));
    setTxt('lblProRci', t('proRciLabel'));
    setTxt('lblProQual', t('proQualLabel'));
    setTxt('lblProExp', t('proExpLabel'));
    setTxt('lblProBio', t('proBioLabel'));
    setTxt('lblProConduct', t('proConductAgree'));
    setTxt('btnProSubmit', t('btnSubmit'));
    setTxt('btnPolicyClose', t('btnClose'));
  }

  // Hero Section (Uses Official Image 01_HerSpace_Hero_Sunrise.png & Strict INR Formatting)
  // Woman's face remains completely uncovered on both desktop and mobile.
  function renderHeroSection() {
    const formattedHeroTitle = t('heroTitle').replace(/\n/g, '<br/>');
    return `
      <section class="hero-wrapper">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="eyebrow">
              <span class="eyebrow-badge">HERSPACE</span>
              <span>${t('eyebrow')}</span>
            </div>

            <h1 class="hero-title">
              ${formattedHeroTitle}
            </h1>

            <p class="hero-subtitle">
              ${t('heroSubtitle')}
            </p>

            <div class="hero-badge-row">
              <span class="badge badge-lavender">${t('heroFreeTrialChip')}</span>
              <span class="badge badge-pink">${t('heroComplimentaryChip')}</span>
            </div>

            <div class="hero-cta-group">
              ${window.herSpaceJourney.isAuthenticated() ? `
                <button class="btn btn-primary btn-lg" id="heroMemberCta" onclick="window.herSpaceApp.navigate('${window.herSpaceJourney.entryRoute()}')">
                  <span>${t('heroMemberCTA')}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <button class="btn btn-secondary btn-lg" onclick="window.herSpaceApp.navigate('support')">
                  <span>${t('heroMemberSecondary')}</span>
                </button>
              ` : `
                <button class="btn btn-primary btn-lg" id="heroGetStarted" onclick="window.herSpaceApp.openGetStartedModal()">
                  <span>${t('btnGetStartedHero')}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <button class="btn btn-secondary btn-lg" onclick="window.herSpaceApp.navigate('support')">
                  <span>${t('heroCTA')}</span>
                </button>
              `}
            </div>

            <div class="hero-trust-strip">
              <div class="hero-trust-item">
                <div class="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div class="hero-trust-text">
                  <strong>${t('trustSafe')}</strong>
                  <span>${isTa() ? '18+ பெண்கள் & திருநங்கைகள்' : 'Women & Trans Women 18+'}</span>
                </div>
              </div>
              <div class="hero-trust-item">
                <div class="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div class="hero-trust-text">
                  <strong>${t('trustListeners')}</strong>
                  <span>${isTa() ? 'பரிவுமிக்க மனித கவனிப்பு' : 'Empathetic Peer Listening'}</span>
                </div>
              </div>
              <div class="hero-trust-item">
                <div class="hero-trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                </div>
                <div class="hero-trust-text">
                  <strong>${t('trustCounsellors')}</strong>
                  <span>${isTa() ? 'பரிசீலிக்கப்பட்ட தகுதிகள்' : 'Reviewed Credentials'}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-visual-col">
            <div class="hero-image-frame">
              <img src="${config.images.heroSunrise}" alt="${t('heroBannerAlt')}" />
            </div>

            <div class="hero-caption-bar">
              <div class="hero-caption-bar-left">
                <span class="hero-caption-dot"></span>
                <div>
                  <div style="font-weight:700;font-size:0.88rem;color:var(--color-text-dark);">${t('floatingCardText')}</div>
                  <div style="font-size:0.78rem;color:var(--color-text-muted);">${t('floatingCardSub')}</div>
                </div>
              </div>
              <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.openGetStartedModal()">
                ${t('navGetStarted')}
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Holistic Feature Spotlight Cards on Home (Life & Wellbeing, My Cycle, Calm, Live Melodies)
  function renderFeatureSpotlights() {
    return `
      <section class="section" style="padding-top:24px;padding-bottom:24px;">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">HERSPACE 4.0 ECOSYSTEM</div>
            <h2>${t('spotlightSectionTitle')}</h2>
            <p>${t('spotlightSectionSub')}</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(265px,1fr));gap:20px;">
            <!-- Card 1: HerSpace Life & Wellbeing (03_HerSpace_Reflection_Outdoor.png) -->
            <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(124,92,191,0.22);">
              <img src="${config.images.reflectionOutdoor}" alt="${t('spotlightWellbeingTitle')}" style="width:100%;height:155px;object-fit:cover;" />
              <div style="padding:18px;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
                <div>
                  <span class="badge badge-verified" style="margin-bottom:8px;">🌸 11 Topics · EN & தமிழ்</span>
                  <h3 style="font-size:1.2rem;margin-bottom:6px;">${t('spotlightWellbeingTitle')}</h3>
                  <p style="font-size:0.86rem;color:var(--color-ink-muted);margin-bottom:14px;">${t('spotlightWellbeingSub')}</p>
                </div>
                <button class="btn btn-primary btn-block" onclick="window.herSpaceApp.navigate('wellbeing')">
                  ${t('spotlightWellbeingCTA')} →
                </button>
              </div>
            </div>

            <!-- Card 2: My Cycle Optional Period Tracker -->
            <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(216,108,155,0.28);">
              <img src="${config.images.hopePortrait}" alt="${t('spotlightCycleTitle')}" style="width:100%;height:155px;object-fit:cover;" />
              <div style="padding:18px;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
                <div>
                  <span class="badge badge-listener" style="margin-bottom:8px;">📅 100% Opt-In & Private</span>
                  <h3 style="font-size:1.2rem;margin-bottom:6px;">${t('spotlightCycleTitle')}</h3>
                  <p style="font-size:0.86rem;color:var(--color-ink-muted);margin-bottom:14px;">${t('spotlightCycleSub')}</p>
                </div>
                <button class="btn btn-secondary btn-block" onclick="window.herSpaceApp.navigate('cycle')">
                  ${t('spotlightCycleCTA')} →
                </button>
              </div>
            </div>

            <!-- Card 3: HerSpace Calm Audio Sanctuary (02_HerSpace_Calm_Cup.png) -->
            <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(91,139,217,0.28);">
              <img src="${config.images.calmCup}" alt="${t('spotlightCalmTitle')}" style="width:100%;height:155px;object-fit:cover;" />
              <div style="padding:18px;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
                <div>
                  <span class="badge badge-counsellor" style="margin-bottom:8px;">🎵 Meditation & Sleep</span>
                  <h3 style="font-size:1.2rem;margin-bottom:6px;">${t('spotlightCalmTitle')}</h3>
                  <p style="font-size:0.86rem;color:var(--color-ink-muted);margin-bottom:14px;">${t('spotlightCalmSub')}</p>
                </div>
                <button class="btn btn-secondary btn-block" onclick="window.herSpaceApp.navigate('calm')">
                  ${t('spotlightCalmCTA')} →
                </button>
              </div>
            </div>

            <!-- Card 4: HerSpace Live Melodies (Singers) -->
            <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(78,168,152,0.28);">
              <img src="${config.images.heroSunrise}" alt="${t('spotlightSingersTitle')}" style="width:100%;height:155px;object-fit:cover;" />
              <div style="padding:18px;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
                <div>
                  <span class="badge badge-verified" style="margin-bottom:8px;">🎤 Masked Telephone Melodies</span>
                  <h3 style="font-size:1.2rem;margin-bottom:6px;">${t('spotlightSingersTitle')}</h3>
                  <p style="font-size:0.86rem;color:var(--color-ink-muted);margin-bottom:14px;">${t('spotlightSingersSub')}</p>
                </div>
                <button class="btn btn-secondary btn-block" onclick="window.herSpaceApp.navigate('singers')">
                  ${t('spotlightSingersCTA')} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Categories Section (Fixed Action-Oriented Support icon — Replaced $ SVG with Compass/Target icon!)
  function renderCategoriesSection() {
    const categories = [
      {
        id: 'mental',
        title: t('catMental'),
        desc: t('catMentalDesc'),
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
      },
      {
        id: 'physical',
        title: t('catPhysical'),
        desc: t('catPhysicalDesc'),
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`
      },
      {
        id: 'relationships',
        title: t('catRelationships'),
        desc: t('catRelationshipsDesc'),
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
      },
      {
        id: 'guidance',
        title: t('catGuidance'),
        desc: t('catGuidanceDesc'),
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`
      },
      {
        id: 'action',
        title: t('catAction'),
        desc: t('catActionDesc'),
        // Replaced dollar sign SVG with an empowering Target / Rising Arrow icon
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
      }
    ];

    return `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">HOLISTIC EMOTIONAL CARE</div>
            <h2>${t('categoriesTitle')}</h2>
            <p>${t('categoriesSubtitle')}</p>
          </div>

          <div class="categories-grid">
            ${categories.map(cat => `
              <div class="category-card" onclick="window.herSpaceApp.filterByCategory('${cat.id}')">
                <div class="category-icon-box">${cat.icon}</div>
                <h3>${cat.title}</h3>
                <p style="font-size:0.88rem;margin-bottom:0;">${cat.desc}</p>
                <div style="margin-top:auto;padding-top:12px;font-size:0.82rem;font-weight:700;color:var(--color-primary);display:flex;align-items:center;gap:4px;">
                  <span>${t('catExplorePrompt')}</span> →
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Dual-Tier Comparison (Listeners ₹399 vs Counsellors ₹999)
  function renderDualTierSection() {
    const listenerFee = formatINR(config.pricing.trainedListenerPerSession);
    const counsellorFee = formatINR(config.pricing.professionalCounsellorPerSession);

    return `
      <section class="section section-alt" id="support-comparison">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">${t('dualTierEyebrow')}</div>
            <h2>${t('dualTierTitle')}</h2>
            <p>${t('dualTierSubtitle')}</p>
          </div>

          <div class="support-tier-grid">
            <!-- Tier 1: Trained Human Listener -->
            <div class="tier-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <span class="badge badge-listener">${t('tierListenerBadge')}</span>
                <span class="badge badge-verified">✓ ${t('badgeTwoWayMasked')}</span>
              </div>

              <h3>${t('tierListenerTitle')}</h3>
              <p style="font-size:0.92rem;">${t('tierListenerDesc')}</p>

              <div class="tier-price-box">
                <div style="display:flex;align-items:baseline;gap:8px;">
                  <span class="tier-price-amount">${listenerFee}</span>
                  <span class="tier-price-unit">${t('tierListenerDuration')}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--color-success);font-weight:700;margin-top:4px;">
                  🎁 ${t('tierListenerF4')}
                </div>
              </div>

              <ul class="tier-feature-list">
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierListenerF1')}</span>
                </li>
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierListenerF2')}</span>
                </li>
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierListenerF3')}</span>
                </li>
              </ul>

              <div class="tier-boundary-notice">
                <strong>ℹ️</strong> ${t('tierListenerBoundary')}
              </div>

              <button class="btn btn-secondary btn-block" onclick="window.herSpaceApp.setRoleFilter('listener')">
                ${t('tierListenerCTA')} (${listenerFee}) →
              </button>
            </div>

            <!-- Tier 2: Professional Counsellor -->
            <div class="tier-card featured">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:6px;">
                <span class="badge badge-counsellor">${t('tierCounsellorBadge')}</span>
                <span class="badge badge-verified">✓ ${t('badgeVerified')}</span>
              </div>

              <h3>${t('tierCounsellorTitle')}</h3>
              <p style="font-size:0.92rem;">${t('tierCounsellorDesc')}</p>

              <div class="tier-price-box">
                <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                  <span class="tier-price-amount">${counsellorFee}</span>
                  <span class="tier-price-unit">${t('tierCounsellorDuration')}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--color-primary);font-weight:700;margin-top:4px;width:100%;">
                  M.Sc / M.Phil Clinical Psychology · Credentials Reviewed
                </div>
              </div>

              <ul class="tier-feature-list">
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierCounsellorF1')}</span>
                </li>
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierCounsellorF2')}</span>
                </li>
                <li>
                  <svg class="tier-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${t('tierCounsellorF3')}</span>
                </li>
              </ul>

              <div class="tier-boundary-notice">
                <strong>ℹ️</strong> ${t('tierCounsellorBoundary')}
              </div>

              <button class="btn btn-primary btn-block" onclick="window.herSpaceApp.setRoleFilter('counsellor')">
                ${t('tierCounsellorCTA')} (${counsellorFee}) →
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Provider cards -------------------------------------------------------------------------------
  function availabilityLine(provider) {
    const a = booking.availabilitySummary(provider);
    return `<div class="provider-avail"><strong>${t('catAvailable')}:</strong> ${a.days}</div>`;
  }

  function renderExpertCard(exp, canRedeemFree) {
    const displayName = isTa() && exp.nameTa ? exp.nameTa : exp.name;
    const displayQual = isTa() && exp.qualificationTa ? exp.qualificationTa : exp.qualification;
    const displayBio = isTa() && exp.bioTa ? exp.bioTa : exp.bio;
    const displaySpecs = isTa() && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties;
    const displayNext = isTa() && exp.nextSlotTa ? exp.nextSlotTa : (exp.nextSlot || 'Today, 5:00 PM');

    return `
      <div class="expert-card" data-provider-role="${exp.role}" data-provider-id="${exp.id}">
        <div class="expert-header">
          <div class="expert-avatar-wrap">
            <img class="expert-avatar" src="${exp.avatar}" alt="${displayName}" />
            <span class="expert-verified-dot" title="${t('badgeVerified')}"></span>
          </div>
          <div class="expert-info">
            <div class="expert-meta-row">
              <span class="badge ${exp.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}">
                ${exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
              </span>
              <span class="expert-rating">★ ${exp.rating} (${exp.reviewsCount})</span>
            </div>
            <h3 class="expert-name">${displayName}</h3>
            <div class="expert-qual">${displayQual}</div>
          </div>
        </div>

        <p class="expert-bio">${displayBio}</p>

        <div class="expert-tags">
          ${displaySpecs.map(s => `<span class="expert-tag">${s}</span>`).join('')}
        </div>

        ${availabilityLine(exp)}
        <div class="provider-avail"><strong>${t('cardLanguages')}</strong> ${exp.languages.join(', ')} · ${t('cardNextSlot')} ${displayNext}</div>

        <div class="expert-footer">
          <div>
            <div class="expert-price">
              ${formatINR(exp.priceDisplay)} <span class="expert-price-unit">${t('cardPer60Min')}</span>
            </div>
            ${exp.role === 'listener' && canRedeemFree ? `
              <div class="expert-free-note">✓ ${t('cardFreeEligible')} (${formatINR(0)})</div>
            ` : ''}
          </div>
          <div class="expert-actions">
            <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.openExpertProfileModal('${exp.id}')">${t('btnViewProfile')}</button>
            <button class="btn btn-sm btn-primary" id="book-${exp.id}" onclick="window.herSpaceApp.openBookingModal('${exp.id}')">${t('btnBookNow')}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderSingerCard(s) {
    return `
      <div class="expert-card" data-provider-role="singer" data-provider-id="${s.id}">
        <div class="expert-header">
          <div class="singer-avatar" style="background:${s.avatarColor};" aria-hidden="true">♪</div>
          <div class="expert-info">
            <div class="expert-meta-row">
              <span class="badge badge-verified">✓ ${isTa() ? s.roleLabelTa : s.roleLabelEn}</span>
              <span class="expert-rating">★ ${s.rating} (${s.sessionsCompleted})</span>
            </div>
            <h3 class="expert-name">${isTa() ? s.nameTa : s.name}</h3>
            <div class="expert-qual">${isTa() ? s.qualificationTa : s.qualification}</div>
          </div>
        </div>

        <p class="expert-bio">${isTa() ? s.bioTa : s.bioEn}</p>

        <div class="expert-tags">
          ${(isTa() ? s.stylesTa : s.stylesEn).map(st => `<span class="expert-tag">${st}</span>`).join('')}
        </div>

        ${availabilityLine(s)}
        <div class="provider-avail"><strong>${t('cardLanguages')}</strong> ${s.languages.join(', ')} · ${t('cardNextSlot')} ${isTa() ? s.nextAvailableTa : s.nextAvailable}</div>

        <div class="expert-footer">
          <div>
            <span class="badge badge-listener">${t('currencyPendingApproval')}</span>
            <div class="expert-free-note">${t('catFeePending')}</div>
          </div>
          <div class="expert-actions">
            <button class="btn btn-sm btn-primary" id="book-${s.id}" onclick="window.herSpaceApp.openBookingModal('${s.id}')">${t('btnReserveMelody')}</button>
          </div>
        </div>
      </div>
    `;
  }

  // Service hub: three clearly separate categories, each with its own profiles, availability and booking.
  function currentServiceCategory() {
    const raw = store.state.activeRoleFilter;
    return (raw === 'counsellor' || raw === 'singer') ? raw : 'listener';
  }

  function renderServiceHub() {
    const cat = currentServiceCategory();
    const status = window.herSpaceJourney.status();
    const canRedeemFree = booking.isWelcomeCallEligible(store.state.entitlement);
    const tabs = [['listener', 'catListener'], ['counsellor', 'catCounsellor'], ['singer', 'catSinger']];
    const p = config.pricing;

    const blurb = cat === 'listener' ? t('catListenerBlurb') : (cat === 'counsellor' ? t('catCounsellorBlurb') : t('catSingerBlurb'));
    const priceLine = cat === 'listener'
      ? `${formatINR(p.trainedListenerPerSession)} · ${t('tierListenerDuration')}`
      : (cat === 'counsellor' ? `${formatINR(p.professionalCounsellorPerSession)} · ${t('tierCounsellorDuration')}` : t('catFeePending'));
    const boundary = cat === 'listener' ? t('tierListenerBoundary') : (cat === 'counsellor' ? t('tierCounsellorBoundary') : t('singersRoleNotice'));

    let cards = '';
    if (cat === 'singer') {
      cards = (window.HERSPACE_LIVE_SINGERS || []).map(renderSingerCard).join('');
    } else {
      cards = store.state.experts.filter(e => e.role === cat).map(e => renderExpertCard(e, canRedeemFree)).join('');
    }

    return `
      <div class="service-hub" id="serviceHub" data-category="${cat}">
        ${status === 'expired' ? `
          <div class="onb-notice onb-notice-warn" id="hubGate">
            <strong>${t('gateTitle')}</strong> ${t('gateBody')}
            <div style="margin-top:10px;"><button class="btn btn-sm btn-primary" onclick="window.herSpaceApp.navigate('pricing')">${t('gateBtn')}</button></div>
          </div>` : ''}

        <div class="service-tabs" role="tablist">
          ${tabs.map(([id, key]) => `
            <button role="tab" id="cat-${id}" aria-selected="${cat === id}" class="service-tab ${cat === id ? 'active' : ''}"
              onclick="window.herSpaceApp.setServiceCategory('${id}')">${t(key)}</button>
          `).join('')}
        </div>

        <div class="service-panel">
          <p class="service-blurb">${blurb}</p>
          <div class="service-price" id="servicePrice">${priceLine}</div>
          <div class="service-boundary">${boundary}</div>
        </div>

        <div class="experts-grid" id="serviceCards">${cards}</div>
      </div>
    `;
  }

  // Verified Care Directory (Support route): the hub plus the partner-application banner
  function renderExpertsDirectory() {
    return `
      <section class="section" id="experts-directory">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">${t('dirEyebrow')}</div>
            <h2>${t('dirTitle')}</h2>
            <p>${t('dirSubtitle')}</p>
          </div>

          ${renderServiceHub()}

          <div class="apply-banner">
            <h4>${t('applyPartnerBannerTitle')}</h4>
            <button class="btn btn-outline btn-sm" onclick="window.herSpaceApp.openProApplyModal()">
              ${t('applyPartnerBannerBtn')} →
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // How It Works Section
  function renderHowItWorksSection() {
    return `
      <section class="section section-alt">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">EFFORTLESS & CONFIDENTIAL</div>
            <h2>${t('howTitle')}</h2>
            <p>${t('howSubtitle')}</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
            <div class="card">
              <div style="width:44px;height:44px;border-radius:50%;background:var(--gradient-brand);color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:16px;">1</div>
              <h3>${t('howStep1Title')}</h3>
              <p style="font-size:0.9rem;margin-bottom:0;">${t('howStep1Desc')}</p>
            </div>
            <div class="card">
              <div style="width:44px;height:44px;border-radius:50%;background:var(--gradient-brand);color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:16px;">2</div>
              <h3>${t('howStep2Title')}</h3>
              <p style="font-size:0.9rem;margin-bottom:0;">${t('howStep2Desc')}</p>
            </div>
            <div class="card">
              <div style="width:44px;height:44px;border-radius:50%;background:var(--gradient-brand);color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:16px;">3</div>
              <h3>${t('howStep3Title')}</h3>
              <p style="font-size:0.9rem;margin-bottom:0;">${t('howStep3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Membership & Pricing Section (Strict INR formatting via formatINR)
  function renderPricingSection() {
    const regFee = formatINR(config.pricing.firstTimeRegistrationFee);
    const monthlyFee = formatINR(config.pricing.monthlyMembershipAfterTrial);
    const listenerFee = formatINR(config.pricing.trainedListenerPerSession);
    const counsellorFee = formatINR(config.pricing.professionalCounsellorPerSession);

    return `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">${t('pricingEyebrow')}</div>
            <h2>${t('pricingTitle')}</h2>
            <p>${t('pricingSubtitle')}</p>
          </div>

          <div class="pricing-banner">
            <div style="position:relative;z-index:2;max-width:720px;width:100%;min-width:0;">
              <span class="badge" style="background:rgba(255,255,255,0.2);color:#FFF;margin-bottom:14px;">
                🎁 ${t('complimentarySessionBadge')}
              </span>
              <h2 style="font-size:2.1rem;margin-bottom:10px;">
                ${t('membershipOffer')} · ${t('membershipOfferSub')}
              </h2>
              <p style="font-size:1.02rem;margin-bottom:20px;">
                ${t('complimentarySessionDesc')}
              </p>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:14px;margin-bottom:24px;">
                <div style="background:rgba(255,255,255,0.12);padding:14px;border-radius:12px;">
                  <div style="font-size:0.76rem;opacity:0.85;">${t('priceRowReg')}</div>
                  <div style="font-size:1.5rem;font-weight:800;">${regFee} (${t('currencyFree')})</div>
                  <div style="font-size:0.75rem;opacity:0.8;">${t('priceRowRegDur')}</div>
                </div>
                <div style="background:rgba(255,255,255,0.12);padding:14px;border-radius:12px;">
                  <div style="font-size:0.76rem;opacity:0.85;">${t('priceRowMembership')}</div>
                  <div style="font-size:1.5rem;font-weight:800;">${monthlyFee}<span style="font-size:0.85rem;">/mo</span></div>
                  <div style="font-size:0.75rem;opacity:0.8;">${t('priceRowMembershipDur')}</div>
                </div>
                <div style="background:rgba(255,255,255,0.12);padding:14px;border-radius:12px;">
                  <div style="font-size:0.76rem;opacity:0.85;">${t('tierListenerTitle')}</div>
                  <div style="font-size:1.5rem;font-weight:800;">${listenerFee}</div>
                  <div style="font-size:0.75rem;opacity:0.8;">1st 30-min call ${regFee} (7 days)</div>
                </div>
                <div style="background:rgba(255,255,255,0.12);padding:14px;border-radius:12px;">
                  <div style="font-size:0.76rem;opacity:0.85;">${t('tierCounsellorTitle')}</div>
                  <div style="font-size:1.5rem;font-weight:800;">${counsellorFee}</div>
                  <div style="font-size:0.75rem;opacity:0.8;">${t('priceRowCounsellorDur')}</div>
                </div>
              </div>

              <button class="btn btn-lg" style="background:#FFF;color:var(--color-primary-dark);font-weight:800;" onclick="window.herSpaceApp.openGetStartedModal()">
                ${t('heroCTA')} →
              </button>
              <div style="font-size:0.78rem;opacity:0.85;margin-top:12px;">
                🔒 ${t('membershipMandateNote')}
              </div>
            </div>
          </div>

          <!-- Official INR Schedule Table -->
          <div class="card" style="margin-top:28px;overflow-x:auto;">
            <h3 style="margin-bottom:12px;">🇮🇳 ${t('pricingTitle')} (INR ₹)</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t('priceTableHeaderService')}</th>
                  <th>${t('priceTableHeaderDuration')}</th>
                  <th>${t('priceTableHeaderFee')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${t('priceRowReg')}</strong></td>
                  <td>${t('priceRowRegDur')}</td>
                  <td><strong style="color:var(--color-success);">${regFee} (${t('currencyFree')})</strong></td>
                </tr>
                <tr>
                  <td><strong>${t('priceRowComp')}</strong></td>
                  <td>${t('priceRowCompDur')}</td>
                  <td><strong style="color:var(--color-success);">${regFee} (${t('currencyFree')})</strong></td>
                </tr>
                <tr>
                  <td><strong>${t('priceRowMembership')}</strong></td>
                  <td>${t('priceRowMembershipDur')}</td>
                  <td><strong>${monthlyFee}</strong></td>
                </tr>
                <tr>
                  <td><strong>${t('priceRowListener')}</strong></td>
                  <td>${t('priceRowListenerDur')}</td>
                  <td><strong>${listenerFee}</strong></td>
                </tr>
                <tr>
                  <td><strong>${t('priceRowCounsellor')}</strong></td>
                  <td>${t('priceRowCounsellorDur')}</td>
                  <td><strong>${counsellorFee}</strong></td>
                </tr>
                <tr>
                  <td><strong>${t('priceRowSinger')}</strong></td>
                  <td>${t('priceRowSingerDur')}</td>
                  <td><span class="badge badge-listener">${t('currencyPendingApproval')}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // Policies & Safety Section
  function renderPoliciesSection() {
    return `
      <section class="section section-alt">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">ETHICS, SAFETY & TRANSPARENCY</div>
            <h2>${t('safetyTitle')}</h2>
            <p>${t('eligibilityText')}</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">
            <div class="card">
              <h3>🛡️ ${t('safetyTitle')}</h3>
              <ul class="tier-feature-list" style="margin-top:14px;">
                <li><span class="tier-check-icon">✓</span> <span>${t('safetyP1')}</span></li>
                <li><span class="tier-check-icon">✓</span> <span>${t('safetyP2')}</span></li>
                <li><span class="tier-check-icon">✓</span> <span>${t('safetyP3')}</span></li>
              </ul>
            </div>

            <div class="card">
              <h3>📅 ${t('policyTitle')}</h3>
              <ul class="tier-feature-list" style="margin-top:14px;">
                <li><span style="color:var(--color-danger);font-weight:800;">•</span> <span>${t('policyCancel')}</span></li>
                <li><span class="tier-check-icon">✓</span> <span>${t('policyReschedule')}</span></li>
                <li><span class="tier-check-icon">✓</span> <span>${t('policyNoShow')}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // NEW PAGE: HerSpace Life & Wellbeing (Separate Route: 'wellbeing')
  function renderWellbeingPage() {
    const wbState = store.state.wellbeing;
    const categories = window.HerSpaceWellbeingEngine.getCategories();
    const articles = window.HerSpaceWellbeingEngine.search(wbState.searchQuery, wbState.activeCategory);
    const savedList = window.HERSPACE_WELLBEING_ARTICLES.filter(a => (wbState.savedIds || []).indexOf(a.id) !== -1);
    const selectedArticle = wbState.selectedArticleId
      ? window.HerSpaceWellbeingEngine.getArticleById(wbState.selectedArticleId)
      : null;

    return `
      <section class="section" style="padding-top:24px;">
        <div class="container">
          <!-- Hero Banner using 03_HerSpace_Reflection_Outdoor.png -->
          <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px;background:linear-gradient(135deg,#3E1D65 0%,#6B3FA0 100%);color:#FFF;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:center;">
              <div style="padding:28px;">
                <span class="badge" style="background:rgba(255,255,255,0.2);color:#FFF;margin-bottom:10px;">🌸 ${t('wbHeroBadge')}</span>
                <h1 style="color:#FFF;font-size:2rem;margin-bottom:10px;">${t('wbHeroTitle')}</h1>
                <p style="color:rgba(255,255,255,0.92);font-size:0.95rem;margin-bottom:18px;">${t('wbHeroSubtitle')}</p>

                <!-- Prominent Search Bar -->
                <div style="display:flex;gap:8px;background:#FFF;padding:6px;border-radius:14px;">
                  <input
                    id="wbSearchInput"
                    type="text"
                    class="form-control"
                    style="border:none;box-shadow:none;color:var(--color-ink);"
                    placeholder="${t('wbSearchPlaceholder')}"
                    value="${wbState.searchQuery || ''}"
                    oninput="window.herSpaceApp.onWellbeingSearchInput(this.value)"
                  />
                  ${wbState.searchQuery ? `
                    <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.onWellbeingSearchInput('')">${t('wbSearchClear')}</button>
                  ` : ''}
                  <button class="btn btn-primary btn-sm" onclick="window.herSpaceApp.onWellbeingSearchInput(document.getElementById('wbSearchInput').value)">
                    🔍 ${t('wbSearchBtn')}
                  </button>
                </div>

                <!-- Popular Quick Questions -->
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;align-items:center;">
                  <span style="font-size:0.76rem;opacity:0.85;">${t('wbPopularQuestions')}</span>
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;padding:3px 10px;font-size:0.75rem;" onclick="window.herSpaceApp.openWellbeingArticle('wb_01_late_period')">
                    ${isTa() ? 'மாதவிடாய் தாமதம்?' : 'Why is my period late?'}
                  </button>
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;padding:3px 10px;font-size:0.75rem;" onclick="window.herSpaceApp.openWellbeingArticle('wb_04_intimate_cleaning')">
                    ${isTa() ? 'அந்தரங்க சுகாதாரம்' : 'Intimate hygiene care'}
                  </button>
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;padding:3px 10px;font-size:0.75rem;" onclick="window.herSpaceApp.openWellbeingArticle('wb_12_iron_foods')">
                    ${isTa() ? 'இரும்புச்சத்து உணவுகள்' : 'Iron-rich Indian foods'}
                  </button>
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;padding:3px 10px;font-size:0.75rem;" onclick="window.herSpaceApp.openWellbeingArticle('wb_16_transgender_wellbeing')">
                    ${isTa() ? 'திருநங்கைகள் நலம்' : 'Transgender wellbeing'}
                  </button>
                </div>
              </div>
              <div style="height:100%;min-height:240px;">
                <img src="${config.images.reflectionOutdoor}" alt="HerSpace Life & Wellbeing" style="width:100%;height:100%;max-height:310px;object-fit:cover;display:block;" />
              </div>
            </div>
          </div>

          <!-- Medical & Educational Disclaimer Banner -->
          <div style="background:var(--color-warm-white);border-left:4px solid var(--color-primary);padding:12px 16px;border-radius:10px;margin-bottom:20px;font-size:0.84rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <span>🩺 ${t('wbDisclaimerBanner')}</span>
            <label style="display:flex;align-items:center;gap:6px;font-weight:700;color:var(--color-primary);cursor:pointer;">
              <input type="checkbox" ${wbState.privateSearchMode ? 'checked' : ''} onchange="window.herSpaceApp.toggleWellbeingPrivateSearch(this.checked)" />
              🔒 ${t('wbPrivateSearchLabel')}
            </label>
          </div>

          <!-- Sub-Navigation Tabs inside HerSpace Life & Wellbeing -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
            <button class="btn btn-sm ${wbState.activeSubTab === 'browse' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setWellbeingSubTab('browse')">
              📚 ${t('wbTabBrowse')}
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.navigate('cycle')">
              📅 ${t('wbTabCycle')}
            </button>
            <button class="btn btn-sm ${wbState.activeSubTab === 'saved' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setWellbeingSubTab('saved')">
              🔖 ${t('wbTabSaved')} (${savedList.length})
            </button>
            <button class="btn btn-sm ${wbState.activeSubTab === 'ask' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setWellbeingSubTab('ask')">
              ✉️ ${t('wbTabAskPrivately')}
            </button>
            <button class="btn btn-sm btn-secondary" onclick="window.herSpaceApp.navigate('support')">
              👩🏽‍⚕️ ${t('wbTabSpeakPro')}
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.herSpaceApp.openCrisisModal()">
              🚑 ${t('wbTabSafety')}
            </button>
          </div>

          ${selectedArticle ? renderWellbeingArticleDetail(selectedArticle) : ''}

          ${wbState.activeSubTab === 'browse' ? `
            <!-- 11 Categories Filter Grid (A through K) -->
            <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;margin-bottom:20px;">
              <button class="btn btn-sm ${wbState.activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setWellbeingCategory('all')">
                ${t('wbAllTopicsFilter')} (${window.HERSPACE_WELLBEING_ARTICLES.length})
              </button>
              ${categories.map(cat => `
                <button class="btn btn-sm ${wbState.activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}" style="white-space:nowrap;" onclick="window.herSpaceApp.setWellbeingCategory('${cat.id}')">
                  ${isTa() ? cat.ta : cat.en}
                </button>
              `).join('')}
            </div>

            <!-- Category Overview Cards (when viewing all and no search query) -->
            ${wbState.activeCategory === 'all' && !wbState.searchQuery ? `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:14px;margin-bottom:28px;">
                ${categories.map(cat => `
                  <div class="card" style="padding:16px;cursor:pointer;border-top:3px solid ${cat.color};" onclick="window.herSpaceApp.setWellbeingCategory('${cat.id}')">
                    <div style="font-weight:800;font-size:0.96rem;color:var(--color-primary-dark);margin-bottom:4px;">
                      ${isTa() ? cat.ta : cat.en}
                    </div>
                    <p style="font-size:0.8rem;color:var(--color-ink-muted);margin-bottom:0;">
                      ${isTa() ? cat.descTa : cat.descEn}
                    </p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Question & Answer Cards -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px;">
              ${articles.map(art => {
                const isSaved = (wbState.savedIds || []).indexOf(art.id) !== -1;
                return `
                  <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
                        <span class="badge badge-verified" style="font-size:0.72rem;">✓ ${isTa() ? art.reviewBadgeTa : art.reviewBadgeEn}</span>
                        <span style="font-size:0.74rem;color:var(--color-ink-muted);">${art.categoryCode}</span>
                      </div>
                      <h3 style="font-size:1.15rem;margin-bottom:8px;color:var(--color-primary-dark);">
                        ${isTa() ? art.title.ta : art.title.en}
                      </h3>
                      <p style="font-size:0.88rem;color:var(--color-ink);margin-bottom:12px;">
                        ${isTa() ? art.shortAnswer.ta : art.shortAnswer.en}
                      </p>
                    </div>
                    <div>
                      <div style="font-size:0.75rem;color:var(--color-ink-muted);margin-bottom:10px;">
                        📚 ${art.sources.join(' · ')}
                      </div>
                      <div style="display:flex;gap:8px;">
                        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.herSpaceApp.openWellbeingArticle('${art.id}')">
                          ${isTa() ? 'முழு விளக்கம் காண்க →' : 'Read Full Safe Answer →'}
                        </button>
                        <button class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'} btn-sm" onclick="window.herSpaceApp.toggleSaveArticle('${art.id}')">
                          ${isSaved ? '🔖 ' + t('wbSavedArticleBtn') : '☆ ' + t('wbSaveArticleBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

          ${wbState.activeSubTab === 'saved' ? `
            <div class="card">
              <h3 style="margin-bottom:14px;">🔖 ${t('wbTabSaved')} (${savedList.length})</h3>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
                ${savedList.map(art => `
                  <div class="card" style="background:var(--color-warm-white);">
                    <h4>${isTa() ? art.title.ta : art.title.en}</h4>
                    <p style="font-size:0.86rem;">${isTa() ? art.shortAnswer.ta : art.shortAnswer.en}</p>
                    <button class="btn btn-primary btn-sm" onclick="window.herSpaceApp.openWellbeingArticle('${art.id}')">
                      ${isTa() ? 'திறக்க' : 'Open Answer'} →
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${wbState.activeSubTab === 'ask' ? `
            <div class="card" style="max-width:680px;margin:0 auto;">
              <h3>✉️ ${t('wbAskFormTitle')}</h3>
              <p style="font-size:0.88rem;color:var(--color-ink-muted);margin-bottom:16px;">${t('wbAskFormSub')}</p>
              <form onsubmit="window.herSpaceApp.submitPrivateWellbeingQuestion(event)">
                <div class="form-group">
                  <label class="form-label">${t('wbAskCategoryLabel')}</label>
                  <select id="wbAskCategorySelect" class="form-control">
                    ${categories.map(c => `<option value="${c.id}">${isTa() ? c.ta : c.en}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">${t('wbAskQuestionLabel')}</label>
                  <textarea id="wbAskQuestionInput" class="form-control" rows="4" placeholder="${t('wbAskQuestionPlaceholder')}" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('wbAskSubmitBtn')} →</button>
              </form>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  function renderWellbeingArticleDetail(art) {
    const isSaved = (store.state.wellbeing.savedIds || []).indexOf(art.id) !== -1;
    const selfCareList = isTa() ? art.selfCare.ta : art.selfCare.en;
    const redFlagsList = isTa() ? art.redFlags.ta : art.redFlags.en;

    return `
      <div class="card" style="border:2px solid var(--color-primary);margin-bottom:28px;background:#FFF;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
          <span class="badge badge-verified">✓ ${isTa() ? art.reviewBadgeTa : art.reviewBadgeEn}</span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm ${isSaved ? 'btn-secondary' : 'btn-outline'}" onclick="window.herSpaceApp.toggleSaveArticle('${art.id}')">
              🔖 ${isSaved ? t('wbSavedArticleBtn') : t('wbSaveArticleBtn')}
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.closeWellbeingArticle()">✕ ${t('btnClose')}</button>
          </div>
        </div>

        <h2 style="font-size:1.65rem;margin-bottom:10px;color:var(--color-primary-dark);">
          ${isTa() ? art.title.ta : art.title.en}
        </h2>

        <div style="background:var(--color-warm-white);padding:14px 16px;border-radius:12px;margin-bottom:16px;">
          <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;color:var(--color-primary);margin-bottom:4px;">
            ${t('wbShortAnswerLabel')}
          </div>
          <div style="font-size:0.96rem;font-weight:600;">
            ${isTa() ? art.shortAnswer.ta : art.shortAnswer.en}
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <h4 style="margin-bottom:6px;">${t('wbExplanationLabel')}</h4>
          <p style="font-size:0.92rem;line-height:1.7;">${isTa() ? art.explanation.ta : art.explanation.en}</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:16px;">
          <div style="background:rgba(46,125,50,0.06);border:1px solid rgba(46,125,50,0.2);padding:14px;border-radius:12px;">
            <h4 style="color:var(--color-success);margin-bottom:8px;">🌿 ${t('wbSelfCareLabel')}</h4>
            <ul style="padding-left:18px;margin:0;font-size:0.88rem;line-height:1.6;">
              ${selfCareList.map(item => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
            </ul>
          </div>

          <div style="background:rgba(198,40,40,0.06);border:1px solid rgba(198,40,40,0.22);padding:14px;border-radius:12px;">
            <h4 style="color:var(--color-danger);margin-bottom:8px;">🚨 ${t('wbRedFlagsLabel')}</h4>
            <ul style="padding-left:18px;margin:0;font-size:0.88rem;line-height:1.6;">
              ${redFlagsList.map(item => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="background:var(--color-warm-white);padding:14px;border-radius:12px;margin-bottom:14px;font-size:0.88rem;">
          <strong>🩺 ${t('wbWhenToSeeDoctorLabel')}:</strong> ${isTa() ? art.whenToSeekCare.ta : art.whenToSeekCare.en}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;font-size:0.78rem;color:var(--color-ink-muted);border-top:1px solid var(--color-border);padding-top:12px;">
          <span>📚 <strong>${t('wbSourcesLabel')}:</strong> ${art.sources.join(', ')}</span>
          <span>🕒 <strong>${t('wbLastReviewed')}</strong> ${art.lastReviewedDate}</span>
        </div>
      </div>
    `;
  }

  // NEW PAGE: My Cycle — Optional Menstrual & Symptom Tracker (Route: 'cycle')
  function renderCyclePage() {
    const cyc = store.state.cycle;
    const summary = window.HerSpaceCycleEngine.calculateSummary(cyc.logs);

    return `
      <section class="section" style="padding-top:24px;">
        <div class="container">
          <div class="section-header" style="max-width:780px;">
            <div class="eyebrow">${t('cycleHeroBadge')}</div>
            <h2>📅 ${t('cycleHeroTitle')}</h2>
            <p>${t('cycleHeroSubtitle')}</p>
          </div>

          <!-- Inclusive Care Notice (Respectful of transgender women & postmenopausal users) -->
          <div class="card" style="background:var(--color-warm-white);border-left:4px solid var(--color-primary);margin-bottom:20px;padding:14px 18px;">
            <div style="font-size:0.88rem;color:var(--color-ink);">
              💜 <strong>${t('cycleInclusiveNotice')}</strong>
            </div>
          </div>

          ${!cyc.optInConsent ? `
            <!-- Strictly Opt-In Consent Gate -->
            <div class="card" style="max-width:680px;margin:0 auto;text-align:center;padding:32px 24px;">
              <div style="font-size:2.4rem;margin-bottom:10px;">🔒</div>
              <h3 style="margin-bottom:10px;">${t('cycleConsentTitle')}</h3>
              <p style="font-size:0.92rem;color:var(--color-ink-muted);margin-bottom:22px;">
                ${t('cycleConsentDesc')}
              </p>
              <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="window.herSpaceApp.enableCycleTracker(true)">
                  📊 ${t('cycleDemoDataBtn')}
                </button>
                <button class="btn btn-secondary" onclick="window.herSpaceApp.enableCycleTracker(false)">
                  ✓ ${t('cycleEnableBtn')}
                </button>
                <button class="btn btn-outline" onclick="window.herSpaceApp.navigate('wellbeing')">
                  ← ${t('btnBack')}
                </button>
              </div>
            </div>
          ` : `
            <!-- Active Cycle Overview & Logger -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-bottom:24px;">
              <div class="card" style="background:linear-gradient(135deg,#D86C9B 0%,#7C5CBF 100%);color:#FFF;">
                <div style="font-size:0.78rem;opacity:0.9;">${t('cycleNextEstimate')}</div>
                <div style="font-size:1.65rem;font-weight:800;margin:6px 0;">
                  ${summary.nextPeriodEstimate || (isTa() ? 'பதிவு தேவை' : 'Log 1st Date')}
                </div>
                <div style="font-size:0.75rem;opacity:0.88;">
                  ${t('cycleAvgInterval')}: ${summary.avgIntervalDays ? summary.avgIntervalDays + (isTa() ? ' நாட்கள்' : ' days') : '28 days'}
                </div>
              </div>

              <div class="card">
                <div style="font-size:0.78rem;color:var(--color-ink-muted);">${t('cycleAvgDuration')}</div>
                <div style="font-size:1.6rem;font-weight:800;color:var(--color-primary);margin:6px 0;">
                  ${summary.avgDurationDays ? summary.avgDurationDays + (isTa() ? ' நாட்கள்' : ' Days') : '5 Days'}
                </div>
                <div style="font-size:0.78rem;color:var(--color-success);font-weight:600;">
                  🔒 Isolated & Encrypted (RLS Protected)
                </div>
              </div>

              <div class="card">
                <div style="font-size:0.78rem;color:var(--color-ink-muted);">${t('cycleRemindersLabel')}</div>
                <div style="margin-top:10px;">
                  <label style="display:flex;align-items:center;gap:8px;font-size:0.86rem;font-weight:600;cursor:pointer;">
                    <input type="checkbox" ${cyc.remindersEnabled ? 'checked' : ''} onchange="window.herSpaceApp.toggleCycleReminders(this.checked)" />
                    <span>${isTa() ? 'பூட்டுத் திரையில் ரகசிய அறிவிப்பு' : 'Private Wellness Notification'}</span>
                  </label>
                </div>
                <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.enableCycleTracker(true)">
                    ${t('cycleDemoDataBtn')}
                  </button>
                </div>
              </div>
            </div>

            <div style="background:var(--color-warm-white);padding:10px 14px;border-radius:10px;font-size:0.8rem;color:var(--color-ink-muted);margin-bottom:24px;">
              ℹ️ ${t('cycleEstimateDisclaimer')}
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:24px;">
              <!-- Log Entry Form -->
              <div class="card">
                <h3 style="margin-bottom:14px;">➕ ${t('cycleLogPeriodTitle')}</h3>
                <form onsubmit="window.herSpaceApp.submitCycleEntry(event)">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                      <label class="form-label">${t('cycleStartDateLabel')}</label>
                      <input type="date" id="cycStartInput" class="form-control" value="${new Date().toISOString().split('T')[0]}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">${t('cycleEndDateLabel')}</label>
                      <input type="date" id="cycEndInput" class="form-control" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">${t('cycleFlowLabel')}</label>
                    <select id="cycFlowInput" class="form-control">
                      <option value="spotting">${t('cycleFlowSpotting')}</option>
                      <option value="light">${t('cycleFlowLight')}</option>
                      <option value="medium" selected>${t('cycleFlowMedium')}</option>
                      <option value="heavy">${t('cycleFlowHeavy')}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">${t('cycleSymptomsLabel')}</label>
                    <input type="text" id="cycSymptomsInput" class="form-control" placeholder="${isTa() ? 'எ.கா: மிதமான வயிற்று வலி, சோர்வு' : 'e.g. Mild Cramps, Fatigue, Back Ache'}" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">${t('cycleMoodLabel')}</label>
                    <input type="text" id="cycMoodInput" class="form-control" placeholder="${isTa() ? 'எ.கா: அமைதி, உணர்ச்சிவசப்படுதல்' : 'e.g. Calm, Sensitive, Tired'}" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">${t('cycleNotesLabel')}</label>
                    <textarea id="cycNotesInput" class="form-control" rows="2"></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary btn-block">${t('cycleSaveEntryBtn')} →</button>
                </form>
              </div>

              <!-- Logged History & Data Control -->
              <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                  <h3 style="margin:0;">📋 ${t('cycleHistoryTitle')} (${cyc.logs.length})</h3>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.exportCycleData()">⬇️ ${t('cycleExportBtn')}</button>
                    <button class="btn btn-sm btn-danger" onclick="window.herSpaceApp.wipeCycleData()">🗑️ ${t('cycleDeleteAllBtn')}</button>
                  </div>
                </div>

                ${cyc.logs.length === 0 ? `
                  <p style="color:var(--color-ink-muted);font-size:0.9rem;">No entries logged yet. Click "${t('cycleDemoDataBtn')}" above to preview sample cycle calculations.</p>
                ` : `
                  <div style="display:flex;flex-direction:column;gap:12px;">
                    ${cyc.logs.map(entry => `
                      <div style="padding:12px 14px;border-radius:12px;background:var(--color-warm-white);border:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                        <div>
                          <div style="font-weight:800;color:var(--color-primary-dark);">
                            📅 ${entry.startDate} ${entry.endDate ? ' → ' + entry.endDate : ''}
                            <span class="badge badge-listener" style="margin-left:6px;">${entry.flow}</span>
                          </div>
                          <div style="font-size:0.82rem;color:var(--color-ink-muted);margin-top:4px;">
                            ${(entry.symptoms || []).join(', ')} · Mood: ${entry.mood || 'Calm'}
                          </div>
                          ${entry.notes ? `<div style="font-size:0.82rem;margin-top:4px;">📝 ${entry.notes}</div>` : ''}
                        </div>
                        <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.deleteCycleEntry('${entry.id}')">✕</button>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  }

  // NEW PAGE: HerSpace Calm — Music & Meditation Sanctuary (Route: 'calm')
  function renderCalmPage() {
    const calmState = store.state.calm;
    const engine = window.HerSpaceCalmEngine;
    const activeTrack = engine.getTrackById(engine.activeTrackId);
    const allTracks = window.HERSPACE_CALM_TRACKS;
    const filteredTracks = calmState.activeCategory === 'all'
      ? allTracks
      : calmState.activeCategory === 'favourites'
        ? allTracks.filter(tr => (calmState.favourites || []).indexOf(tr.id) !== -1)
        : allTracks.filter(tr => tr.category === calmState.activeCategory);

    return `
      <section class="section" style="padding-top:24px;">
        <div class="container">
          <!-- Calm Hero Player Card using 02_HerSpace_Calm_Cup.png -->
          <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px;background:linear-gradient(135deg,#2B184C 0%,#4E3282 100%);color:#FFF;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:center;">
              <div style="padding:28px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                  <span class="badge" style="background:rgba(255,255,255,0.2);color:#FFF;" id="calmPlayStatusBadge">
                    ${engine.isPlaying ? '🔊 ' + t('calmNowPlaying') : '🎵 ' + t('calmPaused')}
                  </span>
                  <span style="font-size:0.78rem;opacity:0.85;">${activeTrack.language}</span>
                </div>

                <h1 style="color:#FFF;font-size:1.75rem;margin-bottom:6px;">
                  ${isTa() ? activeTrack.title.ta : activeTrack.title.en}
                </h1>
                <div style="font-size:0.88rem;opacity:0.88;margin-bottom:10px;">
                  ${isTa() ? activeTrack.artist.ta : activeTrack.artist.en} · <span style="opacity:0.75;">${activeTrack.licence}</span>
                </div>
                <p style="color:rgba(255,255,255,0.9);font-size:0.9rem;margin-bottom:18px;">
                  ${isTa() ? activeTrack.description.ta : activeTrack.description.en}
                </p>

                <!-- Audio Progress & Seek Bar -->
                <div style="margin-bottom:16px;">
                  <input
                    id="calmSeekSlider"
                    type="range"
                    min="0"
                    max="100"
                    value="${activeTrack.durationSeconds > 0 ? Math.round((engine.currentTimeSeconds / activeTrack.durationSeconds) * 100) : 0}"
                    style="width:100%;accent-color:#F3C6DF;cursor:pointer;"
                    oninput="window.HerSpaceCalmEngine.seekToPercent(this.value)"
                  />
                  <div style="display:flex;justify-content:space-between;font-size:0.78rem;opacity:0.85;margin-top:4px;">
                    <span id="calmCurrentTime">${engine.formatSeconds(engine.currentTimeSeconds)} / ${activeTrack.durationLabel}</span>
                    <span>🎧 ${t('calmSynthesizerNote')}</span>
                  </div>
                </div>

                <!-- Transport Controls & Sleep Timer -->
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;" onclick="window.HerSpaceCalmEngine.prevTrack()">⏮ Prev</button>
                  <button class="btn btn-lg" style="background:#FFF;color:var(--color-primary-dark);font-weight:800;min-width:130px;" onclick="window.herSpaceApp.toggleCalmPlayback('${activeTrack.id}')">
                    ▶ <span id="calmMainPlayBtnText">${engine.isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button class="btn btn-sm" style="background:rgba(255,255,255,0.16);color:#FFF;" onclick="window.HerSpaceCalmEngine.nextTrack()">Next ⏭</button>

                  <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">
                    <span style="font-size:0.78rem;">🌙 ${t('calmSleepTimerLabel')}</span>
                    <select class="form-control" style="padding:4px 8px;font-size:0.8rem;width:auto;" onchange="window.HerSpaceCalmEngine.setSleepTimer(this.value)">
                      <option value="0" ${engine.sleepTimerMinutes === 0 ? 'selected' : ''}>${t('calmTimerOff')}</option>
                      <option value="10" ${engine.sleepTimerMinutes === 10 ? 'selected' : ''}>10 min</option>
                      <option value="20" ${engine.sleepTimerMinutes === 20 ? 'selected' : ''}>20 min</option>
                      <option value="30" ${engine.sleepTimerMinutes === 30 ? 'selected' : ''}>30 min</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style="height:100%;min-height:240px;">
                <img src="${config.images.calmCup}" alt="HerSpace Calm Sanctuary" style="width:100%;height:100%;max-height:320px;object-fit:cover;display:block;" />
              </div>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
            <button class="btn btn-sm ${calmState.activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setCalmCategory('all')">${t('calmFilterAll')}</button>
            <button class="btn btn-sm ${calmState.activeCategory === 'meditation' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setCalmCategory('meditation')">${t('calmFilterMeditation')}</button>
            <button class="btn btn-sm ${calmState.activeCategory === 'instrumental' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setCalmCategory('instrumental')">${t('calmFilterInstrumental')}</button>
            <button class="btn btn-sm ${calmState.activeCategory === 'nature' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setCalmCategory('nature')">${t('calmFilterNature')}</button>
            <button class="btn btn-sm ${calmState.activeCategory === 'sleep' ? 'btn-primary' : 'btn-outline'}" onclick="window.herSpaceApp.setCalmCategory('sleep')">${t('calmFilterSleep')}</button>
          </div>

          <!-- Track Library List -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
            ${filteredTracks.map(tr => {
              const isCurr = engine.activeTrackId === tr.id && engine.isPlaying;
              return `
                <div class="card" style="display:flex;gap:14px;align-items:center;border:${isCurr ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'};">
                  <img src="${tr.artwork}" alt="${tr.title.en}" style="width:68px;height:68px;border-radius:12px;object-fit:cover;flex-shrink:0;" />
                  <div style="flex:1;">
                    <div style="font-size:0.74rem;font-weight:700;color:var(--color-primary);">${tr.language} · ${tr.durationLabel}</div>
                    <h4 style="font-size:1rem;margin:2px 0;">${isTa() ? tr.title.ta : tr.title.en}</h4>
                    <div style="font-size:0.8rem;color:var(--color-ink-muted);">${isTa() ? tr.description.ta : tr.description.en}</div>
                  </div>
                  <button class="btn ${isCurr ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.herSpaceApp.toggleCalmPlayback('${tr.id}')">
                    ${isCurr ? '⏸ Pause' : '▶ Play'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Live Melodies: its own page, profiles, availability and booking (never mixed into listener/counsellor lists)
  function renderSingersPage() {
    const singers = window.HERSPACE_LIVE_SINGERS || [];
    const status = window.herSpaceJourney.status();

    return `
      <section class="section" style="padding-top:24px;">
        <div class="container">
          <div class="section-header">
            <div class="eyebrow">${t('singersHeroBadge')}</div>
            <h2>${t('singersHeroTitle')}</h2>
            <p>${t('singersHeroSubtitle')}</p>
          </div>

          ${status === 'expired' ? `
            <div class="onb-notice onb-notice-warn" id="melodiesGate">
              <strong>${t('gateTitle')}</strong> ${t('gateBody')}
              <div style="margin-top:10px;"><button class="btn btn-sm btn-primary" onclick="window.herSpaceApp.navigate('pricing')">${t('gateBtn')}</button></div>
            </div>` : ''}

          <div class="service-panel service-panel-boxed">
            <p class="service-blurb">${t('singersRoleNotice')}</p>
            <div class="service-price">${t('catFeePending')}</div>
          </div>

          <div class="experts-grid" id="singerCards">
            ${singers.map(renderSingerCard).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Member Dashboard (Uses Official Image 04_HerSpace_Hope_Portrait.png & Strict INR Formatting)
  function renderMemberDashboard() {
    const { user, entitlement, appointments, notifications } = store.state;
    if (!user) {
      return `
        <section class="section">
          <div class="container" style="text-align:center;max-width:540px;">
            <img src="${config.images.hopePortrait}" alt="HerSpace Member" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 16px;" />
            <h2>${t('navDashboard')}</h2>
            <p>${isTa() ? 'உங்கள் 3-மாத இலவச உறுப்பினர் கணக்கு மற்றும் முன்பதிவுகளைக் காண உள்நுழையவும்.' : 'Sign in or register for free (₹0) to view your 3-month trial entitlement, complimentary 30-min listener call, and scheduled appointments.'}</p>
            <button class="btn btn-primary" onclick="window.herSpaceApp.openGetStartedModal()">
              ${t('heroCTA')} →
            </button>
          </div>
        </section>
      `;
    }

    const canRedeemWelcome = booking.isWelcomeCallEligible(entitlement);
    const trialCountdown = entitlement ? formatCountdown(entitlement.trialEndsAt) : '90d remaining';
    const welcomeCountdown = entitlement ? formatCountdown(entitlement.welcomeCallExpiresAt) : '7d remaining';

    return `
      <section class="section">
        <div class="container">
          <!-- Hope Portrait Header Card -->
          <div class="card" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;background:var(--color-warm-white);">
            <div style="display:flex;align-items:center;gap:16px;">
              <img src="${config.images.hopePortrait}" alt="Member" style="width:68px;height:68px;border-radius:50%;object-fit:cover;border:2px solid var(--color-primary);" />
              <div>
                <div class="eyebrow" style="margin-bottom:2px;">MEMBER SANCTUARY</div>
                <h2 style="margin-bottom:2px;font-size:1.5rem;">${t('dashWelcomePrefix')} ${user.fullName}</h2>
                <div style="font-size:0.82rem;color:var(--color-ink-muted);">
                  📞 ${window.HerSpaceTelephonyEngine.maskPhoneNumber(user.phone)} · ✓ ${t('badgeTwoWayMasked')}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="window.herSpaceApp.navigate('wellbeing')">🌸 ${t('navWellbeing')}</button>
              <button class="btn btn-secondary btn-sm" onclick="window.herSpaceApp.navigate('cycle')">📅 ${t('navMyCycle')}</button>
              <button class="btn btn-primary btn-sm" onclick="window.herSpaceApp.navigate('support')">+ ${t('btnBookNow')}</button>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="card" style="background:var(--gradient-brand);color:#FFF;">
              <span class="badge" style="background:rgba(255,255,255,0.2);color:#FFF;width:fit-content;margin-bottom:10px;">
                ✓ ${t('dashTrialActiveBadge')}
              </span>
              <h3 style="color:#FFF;margin-bottom:4px;">${t('membershipPlanTitle')}</h3>
              <p style="color:rgba(255,255,255,0.88);font-size:0.86rem;">
                ${t('dashPostTrialInfo')}
              </p>
              <div class="countdown-pill" style="margin-top:8px;">
                ⏳ ${trialCountdown} (${formatINR(0)})
              </div>
            </div>

            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="badge badge-listener">30-Min Welcome Call</span>
                <span style="font-size:0.78rem;font-weight:700;color:${canRedeemWelcome ? 'var(--color-success)' : 'var(--color-ink-muted)'};">
                  ${canRedeemWelcome ? '✓ ' + t('dashCompAvailable') : (entitlement && entitlement.welcomeCallStatus ? entitlement.welcomeCallStatus.toUpperCase() : 'AVAILABLE')}
                </span>
              </div>
              <h4>${t('dashCompCardTitle')}</h4>
              <p style="font-size:0.85rem;">
                ${canRedeemWelcome
                  ? `Valid for 7 days from registration (${welcomeCountdown}). Fee: ${formatINR(0)}.`
                  : t('complimentarySessionDesc')}
              </p>
              ${canRedeemWelcome ? `
                <button class="btn btn-secondary btn-sm" onclick="window.herSpaceApp.redeemComplimentarySession()">
                  ${t('dashCompBookBtn')} →
                </button>
              ` : ''}
            </div>

            <div class="card" id="renewalInfoCard">
              <h4>${t('memAfterTitle')} (${formatINR(149)}/mo)</h4>
              <p style="font-size:0.85rem;">
                ${t('memAfterBody')}
              </p>
              <p style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0;">${t('memPayNote')}</p>
            </div>
          </div>

          <!-- Appointments & Exotel Masked Call Bridge -->
          <div class="card" style="margin-bottom:24px;">
            <h3 style="margin-bottom:16px;">📅 ${t('dashUpcomingTitle')}</h3>
            ${appointments.length === 0 ? `
              <p style="color:var(--color-ink-muted);">${t('dashNoBookings')}</p>
            ` : `
              <div style="overflow-x:auto;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Care Partner</th>
                      <th>Date & Time</th>
                      <th>Bridge / Mode</th>
                      <th>Fee (INR)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${appointments.map(apt => `
                      <tr>
                        <td>
                          <div style="font-weight:700;">${isTa() && apt.expertNameTa ? apt.expertNameTa : apt.expertName}</div>
                          <span class="badge ${apt.expertRole === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}">
                            ${apt.expertRole === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
                          </span>
                        </td>
                        <td>
                          <div style="font-weight:600;">${apt.date}</div>
                          <div style="font-size:0.8rem;color:var(--color-ink-muted);">${apt.time}</div>
                        </td>
                        <td>
                          <div>${apt.mode}</div>
                          <div style="font-size:0.75rem;color:var(--color-success);font-weight:700;">🔒 Exotel Masked</div>
                        </td>
                        <td style="font-weight:800;color:var(--color-primary);">
                          ${apt.pricePaise === 0 ? `${formatINR(0)} (${t('currencyFree')})` : formatINR((apt.pricePaise || 39900) / 100)}
                        </td>
                        <td>
                          <span class="badge badge-verified">${apt.status}</span>
                        </td>
                        <td>
                          <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            ${apt.status === 'scheduled' || apt.status === 'rescheduled' ? `
                              <button class="btn btn-sm btn-primary" onclick="window.herSpaceApp.openMaskedCallModal('${apt.expertId}', '${apt.expertRole}', '${apt.expertName}')">
                                📞 ${t('dashStartMaskedCallBtn')}
                              </button>
                              <button class="btn btn-sm btn-outline" onclick="window.herSpaceApp.openRescheduleModal('${apt.id}')">
                                ${t('dashRescheduleBtn')}
                              </button>
                            ` : `<span style="font-size:0.8rem;color:var(--color-ink-muted);">—</span>`}
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Localized Security & Wellness Notifications -->
          <div class="card">
            <h3 style="margin-bottom:12px;">🔔 ${t('navNotifications')}</h3>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${(notifications || []).map(n => `
                <div style="padding:12px 14px;border-radius:10px;background:var(--color-warm-white);border-left:4px solid var(--color-primary);">
                  <div style="font-weight:700;font-size:0.92rem;">${isTa() ? n.titleTa : n.titleEn}</div>
                  <div style="font-size:0.84rem;color:var(--color-ink-muted);margin-top:2px;">${isTa() ? n.bodyTa : n.bodyEn}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Admin Governance Portal (Includes Professional Verification, Editorial Queue & Refund Guarantee)
  function renderAdminPortal() {
    const applications = admin.getApplications();
    const { appointments } = store.state;
    const audit = window.herSpaceTranslationAudit();

    return `
      <section class="section">
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
            <div>
              <div class="eyebrow">CLINICAL, EDITORIAL & TELEPHONY GOVERNANCE</div>
              <h2 style="margin-bottom:4px;">${t('navAdmin')}</h2>
              <p style="margin-bottom:0;font-size:0.9rem;">Verify Listeners (${formatINR(399)}), Counsellors (${formatINR(999)}), Live Singers, Wellbeing Articles, and 100% INR Refund Guarantees.</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.herSpaceApp.openProApplyModal()">
              + Submit Test Application
            </button>
          </div>

          <div class="dashboard-grid" style="margin-bottom:24px;">
            <div class="card">
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">Localization Parity (EN / TA)</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--color-success);margin:4px 0;">
                ${audit.parityPercentage}% (${audit.totalEnKeys}/${audit.totalTaKeys} Keys)
              </div>
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">Glossary: ${audit.glossaryCount} Approved Terms</div>
            </div>
            <div class="card">
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">Published Wellbeing Articles</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--color-primary);margin:4px 0;">
                ${window.HERSPACE_WELLBEING_ARTICLES.length} Bilingual Q&As
              </div>
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">11 Categories (A–K) · WHO/ICMR/FOGSI</div>
            </div>
            <div class="card">
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">Exotel Masked Queues</div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--color-primary);margin:4px 0;">
                4 Virtual Bridges
              </div>
              <div style="font-size:0.78rem;color:var(--color-success);font-weight:700;">✓ 2-Way Number Masking Active</div>
            </div>
          </div>

          <div class="card" style="margin-bottom:28px;">
            <h3 style="margin-bottom:14px;">1. Professional Credential & Qualification Queue</h3>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role Track</th>
                    <th>Qualification & RCI</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  ${applications.map(app => `
                    <tr>
                      <td>
                        <div style="font-weight:700;">${app.name}</div>
                        <div style="font-size:0.78rem;color:var(--color-ink-muted);">${app.email}</div>
                      </td>
                      <td>
                        <span class="badge ${app.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}">
                          ${app.role === 'counsellor' ? `Counsellor (${formatINR(999)})` : app.role === 'singer' ? 'Live Singer' : `Listener (${formatINR(399)})`}
                        </span>
                      </td>
                      <td>
                        <div style="font-weight:600;">${app.qualification}</div>
                        <div style="font-size:0.78rem;color:var(--color-ink-muted);">RCI: ${app.rciNumber || 'N/A'}</div>
                      </td>
                      <td>${app.experienceYears} yrs</td>
                      <td><span class="badge badge-verified">${app.status.toUpperCase()}</span></td>
                      <td>
                        ${app.status === 'pending' ? `
                          <div style="display:flex;gap:6px;">
                            <button class="btn btn-sm btn-primary" onclick="window.herSpaceAdmin.approveApplication('${app.id}');window.herSpaceApp.render();">Approve</button>
                            <button class="btn btn-sm btn-danger" onclick="window.herSpaceAdmin.rejectApplication('${app.id}');window.herSpaceApp.render();">Reject</button>
                          </div>
                        ` : `<span style="font-size:0.8rem;color:var(--color-ink-muted);">Reviewed</span>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <h3 style="margin-bottom:8px;">2. Provider No-Show & 100% INR Refund Guarantee</h3>
            <p style="font-size:0.86rem;margin-bottom:14px;">
              Triggering a provider no-show below automatically credits a 100% full refund in INR (${formatINR(399)} / ${formatINR(999)}).
            </p>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Expert</th>
                    <th>Date & Time</th>
                    <th>Amount (INR)</th>
                    <th>Status</th>
                    <th>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${appointments.map(apt => `
                    <tr>
                      <td style="font-family:monospace;font-size:0.82rem;">${apt.id}</td>
                      <td><strong>${apt.expertName}</strong></td>
                      <td>${apt.date} · ${apt.time}</td>
                      <td><strong>${formatINR((apt.pricePaise || 0) / 100)}</strong></td>
                      <td><span class="badge badge-verified">${apt.status}</span></td>
                      <td>
                        ${apt.status !== 'refunded_provider_no_show' ? `
                          <button class="btn btn-sm btn-danger" onclick="window.herSpaceBooking.processProviderNoShowRefund('${apt.id}')">
                            Mark Provider No-Show & Issue 100% INR Refund
                          </button>
                        ` : `<span style="color:var(--color-success);font-weight:700;">✓ 100% INR Refund Issued</span>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Footer — Exact 4-Column Desktop / Compact Vertically Stacked Mobile Structure
  function renderFooter() {
    return `
      <footer class="app-footer">
        <div class="container">
          <div class="footer-grid">
            <!-- Column 1: HerSpace Logo and Short Description -->
            <div class="footer-brand-col">
              <img class="footer-brand-logo" src="assets/herspace-client-logo.webp" alt="HerSpace Logo" />
              <p class="footer-brand-desc">
                ${t('heroSubtitle')}
              </p>
              <div class="footer-eligibility-pill">
                <span>${t('brandTagline')}</span>
              </div>
            </div>

            <!-- Column 2: Explore -->
            <div class="footer-col">
              <h4 class="footer-heading">${isTa() ? 'தேடுக' : 'Explore'}</h4>
              <ul class="footer-links">
                <li><a href="#home" onclick="window.herSpaceApp.navigate('home'); return false;">${t('navHome')}</a></li>
                <li><a href="#support" onclick="window.herSpaceApp.navigate('support'); return false;">${isTa() ? 'ஆதரவைத் தேடுக' : 'Find Support'}</a></li>
                <li><a href="#wellbeing" onclick="window.herSpaceApp.navigate('wellbeing'); return false;">${t('navWellbeing')}</a></li>
                <li><a href="#calm" onclick="window.herSpaceApp.navigate('calm'); return false;">${isTa() ? 'HerSpace அமைதி இசை' : 'HerSpace Calm'}</a></li>
                <li><a href="#singers" onclick="window.herSpaceApp.navigate('singers'); return false;">${t('navSingers')}</a></li>
              </ul>
            </div>

            <!-- Column 3: Support -->
            <div class="footer-col">
              <h4 class="footer-heading">${isTa() ? 'ஆதரவு' : 'Support'}</h4>
              <ul class="footer-links">
                <li><a href="#how" onclick="window.herSpaceApp.navigate('how'); return false;">${isTa() ? 'கேள்விகள் (FAQs)' : 'FAQs'}</a></li>
                <li><a href="#apply" onclick="window.herSpaceApp.openProApplyModal(); return false;">${isTa() ? 'தொடர்பு & இணைய' : 'Contact'}</a></li>
                <li><a href="#pricing" onclick="window.herSpaceApp.navigate('pricing'); return false;">${t('navPricing')}</a></li>
                <li><a href="#dashboard" onclick="window.herSpaceApp.navigate('dashboard'); return false;">${t('navBookings')}</a></li>
                <li><a href="#cycle" onclick="window.herSpaceApp.navigate('cycle'); return false;">${t('navMyCycle')}</a></li>
              </ul>
            </div>

            <!-- Column 4: Legal & Safety -->
            <div class="footer-col">
              <h4 class="footer-heading">${isTa() ? 'சட்டம் & பாதுகாப்பு' : 'Legal & Safety'}</h4>
              <ul class="footer-links">
                <li><a href="#privacy" onclick="window.herSpaceApp.openPolicyModal('privacy'); return false;">${isTa() ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}</a></li>
                <li><a href="#terms" onclick="window.herSpaceApp.openPolicyModal('terms'); return false;">${isTa() ? 'பயன்பாட்டு விதிமுறைகள்' : 'Terms of Use'}</a></li>
                <li><a href="#refund" onclick="window.herSpaceApp.openPolicyModal('refund'); return false;">${isTa() ? 'கட்டணத் திரும்பப்பெறுதல் கொள்கை' : 'Refund Policy'}</a></li>
                <li><a href="#eligibility" onclick="window.herSpaceApp.openPolicyModal('terms'); return false;">${isTa() ? 'தகுதி (18+ பெண்கள்)' : 'Eligibility'}</a></li>
                <li><a href="#safety" onclick="window.herSpaceApp.openCrisisModal(); return false;">${isTa() ? 'பாதுகாப்புத் தகவல் (112 / 14416)' : 'Safety Information'}</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© 2026 HerSpace. Developed by RDGI Tech Solutions.</p>
            <div class="footer-bottom-links">
              <span>All amounts in INR (₹) · Women & Transgender Women 18+</span>
              <a href="#admin" onclick="window.herSpaceApp.navigate('admin'); return false;" title="Authorized Staff Governance">Staff Governance</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // Render Toast Notifications
  function renderToasts() {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    container.innerHTML = store.state.toasts.map(item => `
      <div class="toast toast-${item.type}">
        <span>${item.type === 'error' ? '⚠️' : '✨'}</span>
        <span>${item.message}</span>
      </div>
    `).join('');
  }

  // Main View Switcher
  function renderMainContent() {
    const ui = window.herSpaceJourneyUI;
    if (activeRoute === 'onb-register') return ui.renderRegister();
    if (activeRoute === 'signin') return ui.renderSignin();
    if (activeRoute === 'onb-tour') return ui.renderTour();
    if (activeRoute === 'onb-membership') return ui.renderMembership();
    if (activeRoute === 'onb-book') return ui.renderBookStep(renderServiceHub());
    if (activeRoute === 'space') return ui.renderPersonalSpace();
    if (activeRoute === 'wellbeing') {
      return renderWellbeingPage();
    }
    if (activeRoute === 'cycle') {
      return renderCyclePage();
    }
    if (activeRoute === 'calm') {
      return renderCalmPage();
    }
    if (activeRoute === 'singers') {
      return renderSingersPage();
    }
    if (activeRoute === 'dashboard') {
      return renderMemberDashboard();
    }
    if (activeRoute === 'admin') {
      return renderAdminPortal();
    }
    if (activeRoute === 'support') {
      return renderDualTierSection() + renderExpertsDirectory();
    }
    if (activeRoute === 'how') {
      return renderHowItWorksSection() + renderPoliciesSection();
    }
    if (activeRoute === 'pricing' || activeRoute === 'profile') {
      return renderPricingSection() + renderPoliciesSection();
    }
    if (activeRoute === 'policies') {
      return renderPoliciesSection();
    }

    // Default: Home View
    return (
      renderHeroSection() +
      renderFeatureSpotlights() +
      renderCategoriesSection() +
      renderDualTierSection() +
      renderExpertsDirectory() +
      renderHowItWorksSection() +
      renderPricingSection() +
      renderPoliciesSection()
    );
  }

  // Public Controller API
  window.herSpaceApp = {
    init() {
      store.subscribe((state, meta) => {
        // Toasts update only the toast layer so forms being typed in are never re-rendered.
        if (!(meta && meta.toastOnly)) this.render();
        renderToasts();
      });
      // Returning members enter My Personal Space directly; an unfinished onboarding resumes where it stopped.
      activeRoute = window.herSpaceJourney.entryRoute();
      this.render();
    },

    render() {
      const root = document.getElementById('app-root');
      if (!root) return;
      document.documentElement.lang = store.state.lang;

      // Preserve focus and caret across a re-render
      const active = document.activeElement;
      const focusId = active && active.id ? active.id : null;
      let selStart = null, selEnd = null;
      if (focusId && typeof active.selectionStart === 'number') {
        try { selStart = active.selectionStart; selEnd = active.selectionEnd; } catch (e) {}
      }

      if (window.herSpaceJourney.ONBOARDING_ROUTES.indexOf(activeRoute) !== -1) {
        // First-time onboarding: a focused flow with no tabs, no footer and no bottom bar.
        const step = activeRoute === 'signin' ? 0 : ({ 'onb-register': 1, 'onb-tour': 2, 'onb-membership': 3, 'onb-book': 4 })[activeRoute];
        const replay = activeRoute === 'onb-tour' && store.state.onboarding.completed;
        root.innerHTML = `
          ${renderCrisisBanner()}
          ${window.herSpaceJourneyUI.renderOnboardingHeader({ step: replay ? 0 : step })}
          <main id="main-content" class="onb-main">
            ${renderMainContent()}
          </main>
        `;
      } else {
        root.innerHTML = `
          ${renderCrisisBanner()}
          ${renderHeader()}
          <main id="main-content">
            ${renderMainContent()}
          </main>
          ${renderFooter()}
          ${renderMobileBottomBar()}
        `;
      }
      syncStaticModalsAndDrawer();

      if (focusId) {
        const el = document.getElementById(focusId);
        if (el && el !== document.activeElement) {
          el.focus();
          if (selStart !== null) { try { el.setSelectionRange(selStart, selEnd); } catch (e) {} }
        }
      }
    },

    renderActiveView() {
      this.render();
    },

    showToast(msg, type) {
      store.toast(msg, type || 'success');
    },

    currentRoute() {
      return activeRoute;
    },

    navigate(route) {
      const allowed = window.herSpaceJourney.guard(route);
      activeRoute = allowed;
      if (window.herSpaceJourneyUI.onEnter) window.herSpaceJourneyUI.onEnter(allowed);
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Switches the booking category (listener / counsellor / singer) without leaving the current page.
    setServiceCategory(cat) {
      store.state.activeRoleFilter = cat;
      this.render();
    },

    toggleLanguage() {
      const next = store.state.lang === 'en' ? 'ta' : 'en';
      store.setLanguage(next);
      store.toast(next === 'ta' ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது' : 'Language switched to English');
    },

    toggleMobileDrawer(open) {
      const drawer = document.getElementById('mobileDrawer');
      const overlay = document.getElementById('mobileDrawerOverlay');
      if (drawer && overlay) {
        drawer.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
      }
    },

    setRoleFilter(role) {
      store.state.activeRoleFilter = role;
      activeRoute = 'support';
      this.render();
      const dir = document.getElementById('experts-directory');
      if (dir) dir.scrollIntoView({ behavior: 'smooth' });
    },

    filterByCategory(categoryId) {
      store.state.activeCategory = categoryId;
      activeRoute = 'support';
      this.render();
      const dir = document.getElementById('experts-directory');
      if (dir) dir.scrollIntoView({ behavior: 'smooth' });
    },

    // Life & Wellbeing Handlers
    setWellbeingSubTab(tab) {
      store.state.wellbeing.activeSubTab = tab;
      store.state.wellbeing.selectedArticleId = null;
      this.render();
    },

    setWellbeingCategory(catId) {
      store.state.wellbeing.activeCategory = catId;
      store.state.wellbeing.selectedArticleId = null;
      this.render();
    },

    onWellbeingSearchInput(query) {
      store.state.wellbeing.searchQuery = query;
      store.state.wellbeing.activeSubTab = 'browse';
      this.render();
      const input = document.getElementById('wbSearchInput');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    },

    openWellbeingArticle(articleId) {
      store.state.wellbeing.selectedArticleId = articleId;
      this.render();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    },

    closeWellbeingArticle() {
      store.state.wellbeing.selectedArticleId = null;
      this.render();
    },

    toggleSaveArticle(articleId) {
      store.toggleSavedArticle(articleId);
    },

    toggleWellbeingPrivateSearch(checked) {
      store.state.wellbeing.privateSearchMode = Boolean(checked);
      store.toast(checked ? 'Private Search Mode Enabled' : 'Search History Enabled');
    },

    submitPrivateWellbeingQuestion(e) {
      if (e) e.preventDefault();
      const catEl = document.getElementById('wbAskCategorySelect');
      const qEl = document.getElementById('wbAskQuestionInput');
      if (!qEl || !qEl.value.trim()) return;
      store.submitPrivateQuestion(catEl ? catEl.value : 'cat_periods', qEl.value.trim());
      qEl.value = '';
      store.toast(t('wbAskSuccessToast'), 'success');
      store.state.wellbeing.activeSubTab = 'browse';
      this.render();
    },

    // My Cycle Handlers
    enableCycleTracker(loadDemo) {
      store.setCycleConsent(true, Boolean(loadDemo));
      store.toast(loadDemo ? 'Demonstration Cycle Data Loaded' : 'My Cycle Enabled Privately');
    },

    submitCycleEntry(e) {
      if (e) e.preventDefault();
      const startDate = document.getElementById('cycStartInput').value;
      const endDate = document.getElementById('cycEndInput').value;
      const flow = document.getElementById('cycFlowInput').value;
      const symptomsRaw = document.getElementById('cycSymptomsInput').value;
      const mood = document.getElementById('cycMoodInput').value;
      const notes = document.getElementById('cycNotesInput').value;

      store.addCycleLog({
        startDate: startDate,
        endDate: endDate,
        flow: flow,
        symptoms: symptomsRaw ? symptomsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Logged'],
        mood: mood || 'Calm',
        notes: notes || ''
      });
      store.toast(isTa() ? 'மாதவிடாய் குறிப்பு பாதுகாப்பாகச் சேமிக்கப்பட்டது' : 'Cycle log saved privately.');
    },

    deleteCycleEntry(id) {
      store.deleteCycleLog(id);
      store.toast('Entry deleted.');
    },

    wipeCycleData() {
      store.wipeAllCycleData();
      store.toast('All cycle data permanently wiped.');
    },

    exportCycleData() {
      const dataStr = JSON.stringify(store.state.cycle, null, 2);
      try {
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'HerSpace-My-Cycle-Private-Export.json';
        a.click();
      } catch (e) {}
      store.toast('Cycle data exported as JSON.');
    },

    toggleCycleReminders(enabled) {
      store.state.cycle.remindersEnabled = Boolean(enabled);
      store.persist();
      store.toast(enabled ? 'Discreet lock-screen redacted reminders enabled.' : 'Cycle reminders disabled.');
    },

    // Calm Audio Sanctuary Handlers
    setCalmCategory(cat) {
      store.state.calm.activeCategory = cat;
      this.render();
    },

    toggleCalmPlayback(trackId) {
      window.HerSpaceCalmEngine.togglePlay(trackId);
      this.render();
    },

    // Exotel 2-Way Masked Telephone Bridge Modal
    openMaskedCallModal(partnerId, roleOverride, nameOverride) {
      const exp = store.state.experts.find(e => e.id === partnerId) || store.state.experts[0];
      const partnerRole = roleOverride || (exp ? exp.role : 'listener');
      const partnerName = nameOverride || (exp ? (isTa() && exp.nameTa ? exp.nameTa : exp.name) : 'Priya Madhavan');

      window.HerSpaceTelephonyEngine.initiateMaskedCall({
        partnerId: partnerId || exp.id,
        partnerName: partnerName,
        partnerRole: partnerRole
      });
      window.HerSpaceTelephonyEngine.connectBridge();

      const modal = document.getElementById('maskedCallModal');
      if (modal) {
        this.renderMaskedCallModalContent();
        modal.classList.add('open');
      }
    },

    renderMaskedCallModalContent() {
      const body = document.getElementById('maskedCallModalBody');
      const sess = window.HerSpaceTelephonyEngine.activeSession;
      if (!body || !sess) return;

      let statusLabel = t('callStatusConnected');
      if (sess.state === 'queued') statusLabel = t('callStatusQueued');
      if (sess.state === 'on_hold') statusLabel = t('callStatusOnHold');
      if (sess.state === 'parked') statusLabel = `${t('callStatusParked')} (Slot: ${sess.parkCode})`;

      body.innerHTML = `
        <div class="eyebrow" style="color:var(--color-success);">🔒 ${t('callModalBadge')}</div>
        <h2 style="font-size:1.5rem;margin-bottom:6px;">${t('callModalTitle')}</h2>
        <p style="font-size:0.85rem;color:var(--color-ink-muted);margin-bottom:14px;">
          ${t('callPrivacyGuarantee')}
        </p>

        <div style="background:linear-gradient(135deg,#2B184C 0%,#4E3282 100%);color:#FFF;padding:18px;border-radius:14px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="badge" style="background:rgba(255,255,255,0.2);color:#FFF;">Queue: ${sess.queueId}</span>
            <span style="font-size:0.78rem;color:#A5D6A7;font-weight:700;">● ${sess.state.toUpperCase()}</span>
          </div>
          <h3 style="color:#FFF;font-size:1.25rem;margin-bottom:4px;">${sess.partnerName}</h3>
          <div style="font-size:0.84rem;opacity:0.9;margin-bottom:10px;">${statusLabel}</div>

          <div style="background:rgba(0,0,0,0.25);padding:10px 12px;border-radius:10px;font-size:0.8rem;line-height:1.6;">
            <div>📱 <strong>Your Number:</strong> ${sess.memberMaskedDisplay}</div>
            <div>🌉 <strong>Virtual Bridge:</strong> ${sess.partnerMaskedDisplay}</div>
            <div>🛡️ <strong>Recording Policy:</strong> ${t('callNoRecordingBadge')}</div>
          </div>
        </div>

        <!-- Call Controls: Waiting, Hold, Call Parking & Retrieval, Transfer, End -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
          ${sess.state !== 'on_hold' ? `
            <button class="btn btn-secondary btn-sm" onclick="window.HerSpaceTelephonyEngine.holdCall();window.herSpaceApp.renderMaskedCallModalContent();">
              ⏸ ${t('callBtnHold')}
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="window.HerSpaceTelephonyEngine.resumeCall();window.herSpaceApp.renderMaskedCallModalContent();">
              ▶ ${t('callBtnResume')}
            </button>
          `}

          ${sess.state !== 'parked' ? `
            <button class="btn btn-secondary btn-sm" onclick="window.HerSpaceTelephonyEngine.parkCall();window.herSpaceApp.renderMaskedCallModalContent();">
              🅿️ ${t('callBtnPark')}
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="window.HerSpaceTelephonyEngine.retrieveParkedCall('${sess.parkCode}');window.herSpaceApp.renderMaskedCallModalContent();">
              🔓 ${t('callBtnRetrievePark')} (${sess.parkCode})
            </button>
          `}

          <button class="btn btn-outline btn-sm" onclick="window.HerSpaceTelephonyEngine.transferCall('counsellor');window.herSpaceApp.renderMaskedCallModalContent();">
            ↗️ ${t('callBtnTransfer')}
          </button>

          <button class="btn btn-outline btn-sm" onclick="window.HerSpaceTelephonyEngine.reconnectCall();window.herSpaceApp.renderMaskedCallModalContent();">
            🔄 ${t('callBtnSimulateDrop')}
          </button>
        </div>

        <button class="btn btn-danger btn-block" onclick="window.herSpaceApp.closeMaskedCallModal()">
          📴 ${t('callBtnEnd')}
        </button>
      `;
    },

    closeMaskedCallModal() {
      window.HerSpaceTelephonyEngine.endCall();
      const modal = document.getElementById('maskedCallModal');
      if (modal) modal.classList.remove('open');
    },

    // Modals: Get Started / Auth
    // "Get Started" opens the first-time journey (registration page), not a pop-up.
    openGetStartedModal() {
      this.navigate(window.herSpaceJourney.isAuthenticated() ? window.herSpaceJourney.entryRoute() : 'onb-register');
    },

    closeGetStartedModal() {
      const modal = document.getElementById('getStartedModal');
      if (modal) modal.classList.remove('open');
    },

    // Expert Profile Modal
    openExpertProfileModal(expertId) {
      const exp = store.state.experts.find(e => e.id === expertId);
      if (!exp) return;

      const displayName = isTa() && exp.nameTa ? exp.nameTa : exp.name;
      const displayQual = isTa() && exp.qualificationTa ? exp.qualificationTa : exp.qualification;
      const displayBio = isTa() && exp.bioTa ? exp.bioTa : exp.bio;
      const displaySpecs = isTa() && exp.specialtiesTa ? exp.specialtiesTa : exp.specialties;

      const modal = document.getElementById('expertProfileModal');
      const body = document.getElementById('expertProfileModalBody');
      if (modal && body) {
        body.innerHTML = `
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px;">
            <img src="${exp.avatar}" alt="${displayName}" style="width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid var(--color-lavender);" />
            <div>
              <span class="badge ${exp.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}">
                ${exp.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
              </span>
              <h2 style="margin:6px 0 2px;font-size:1.5rem;">${displayName}</h2>
              <div style="font-size:0.86rem;color:var(--color-ink-muted);font-weight:600;">${displayQual}</div>
            </div>
          </div>

          <p style="font-size:0.94rem;">${displayBio}</p>

          <div style="background:var(--color-warm-white);padding:16px;border-radius:var(--radius-md);margin:16px 0;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.86rem;">
              <div><strong>Experience:</strong> ${exp.experienceYears}+ Years</div>
              <div><strong>Rating:</strong> ★ ${exp.rating} (${exp.reviewsCount} reviews)</div>
              <div><strong>Languages:</strong> ${exp.languages.join(', ')}</div>
              <div><strong>Session Fee:</strong> ${formatINR(exp.priceDisplay)} / 60 mins</div>
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <strong style="font-size:0.85rem;display:block;margin-bottom:8px;">Focus Areas:</strong>
            <div class="expert-tags">
              ${displaySpecs.map(s => `<span class="expert-tag">${s}</span>`).join('')}
            </div>
          </div>

          <div style="display:flex;gap:10px;">
            <button class="btn btn-secondary" style="flex:1;" onclick="window.herSpaceApp.closeExpertProfileModal();window.herSpaceApp.openMaskedCallModal('${exp.id}')">
              📞 Masked Call
            </button>
            <button class="btn btn-primary" style="flex:1;" onclick="window.herSpaceApp.closeExpertProfileModal();window.herSpaceApp.openBookingModal('${exp.id}')">
              ${t('btnBookNow')} (${formatINR(exp.priceDisplay)}) →
            </button>
          </div>
        `;
        modal.classList.add('open');
      }
    },

    closeExpertProfileModal() {
      const modal = document.getElementById('expertProfileModal');
      if (modal) modal.classList.remove('open');
    },

    // Professional Onboarding Modal
    openProApplyModal() {
      syncStaticModalsAndDrawer();
      const modal = document.getElementById('proApplyModal');
      if (modal) modal.classList.add('open');
    },

    closeProApplyModal() {
      const modal = document.getElementById('proApplyModal');
      if (modal) modal.classList.remove('open');
    },

    // Booking Modal
    openBookingModal(expertId, forceComplimentary = false) {
      const singer = (window.HERSPACE_LIVE_SINGERS || []).find(s => s.id === expertId);
      const exp = store.state.experts.find(e => e.id === expertId) || singer || store.state.experts.find(e => e.role === 'listener');
      if (!exp) return;

      if (!store.state.user) {
        store.toast(isTa() ? 'முதலில் கணக்கை உருவாக்குங்கள்' : 'Please create your free account first.', 'warning');
        this.navigate('onb-register');
        return;
      }
      if (!booking.canBookNewSession()) {
        store.toast(t('gateTitle'), 'warning');
        this.navigate('pricing');
        return;
      }

      const dates = booking.getAvailableDates(exp);
      const slots = booking.getAvailableTimeSlots(exp.id, dates[0].dateStr);
      const canUseWelcome = exp.role === 'listener' && booking.isWelcomeCallEligible(store.state.entitlement);

      bookingModalState = {
        expert: exp,
        selectedDate: dates[0].dateStr,
        selectedSlot: (slots.find(s => s.available) || slots[0]).time,
        selectedMode: (exp.modes && exp.modes[0]) || '2-Way Masked Phone Call',
        isComplimentary: forceComplimentary || canUseWelcome
      };

      this.renderBookingModalContent();
      const modal = document.getElementById('bookingModal');
      if (modal) modal.classList.add('open');
    },

    closeBookingModal() {
      const modal = document.getElementById('bookingModal');
      if (modal) modal.classList.remove('open');
    },

    redeemComplimentarySession() {
      const firstListener = store.state.experts.find(e => e.role === 'listener');
      if (firstListener) {
        this.openBookingModal(firstListener.id, true);
      }
    },

    renderBookingModalContent() {
      const { expert, selectedDate, selectedSlot, selectedMode, isComplimentary } = bookingModalState;
      const body = document.getElementById('bookingModalBody');
      if (!body || !expert) return;

      const dates = booking.getAvailableDates(expert);
      const slots = booking.getAvailableTimeSlots(expert.id, selectedDate);
      const isSinger = expert.role === 'singer';
      const price = (isComplimentary || isSinger) ? 0 : expert.priceDisplay;
      const duration = isComplimentary ? 30 : (isSinger ? 20 : 60);
      const displayName = isTa() && expert.nameTa ? expert.nameTa : expert.name;

      body.innerHTML = `
        <div style="background:var(--color-warm-white);padding:14px;border-radius:var(--radius-md);margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="badge ${expert.role === 'counsellor' ? 'badge-counsellor' : 'badge-listener'}">
              ${expert.role === 'counsellor' ? t('tierCounsellorTitle') : t('tierListenerTitle')}
            </span>
            <h4 style="margin:4px 0 0;">${displayName}</h4>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.35rem;font-weight:800;color:var(--color-primary);">
              ${price === 0 ? `${formatINR(0)} (${t('currencyFree')})` : formatINR(price)}
            </div>
            <div style="font-size:0.75rem;color:var(--color-ink-muted);">${duration} mins · 2-Way Masked</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">1. Select Date</label>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            ${dates.slice(0, 4).map(d => `
              <button type="button" class="slot-btn ${selectedDate === d.dateStr ? 'selected' : ''}" onclick="window.herSpaceApp.setBookingDate('${d.dateStr}')">
                <div style="font-size:0.72rem;opacity:0.8;">${d.dayName}</div>
                <div style="font-size:1rem;font-weight:800;">${d.dayNum} ${d.monthName}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">2. Select Time Slot</label>
          <div class="slot-grid">
            ${slots.map(s => `
              <button
                type="button"
                class="slot-btn ${selectedSlot === s.time ? 'selected' : ''}"
                ${!s.available ? 'disabled' : ''}
                onclick="window.herSpaceApp.setBookingSlot('${s.time}')"
              >
                ${s.time}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">3. Preferred Session Mode</label>
          <select class="form-control" onchange="window.herSpaceApp.setBookingMode(this.value)">
            <option value="2-Way Masked Phone Call" ${selectedMode === '2-Way Masked Phone Call' ? 'selected' : ''}>2-Way Masked Regular Telephone Call (Exotel Bridge)</option>
            <option value="Encrypted Audio" ${selectedMode === 'Encrypted Audio' ? 'selected' : ''}>Encrypted In-App Audio</option>
            <option value="Private Chat" ${selectedMode === 'Private Chat' ? 'selected' : ''}>Private Text Chat</option>
          </select>
        </div>

        <div style="background:var(--color-warm-white);border-radius:var(--radius-md);padding:16px;margin:20px 0;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.85rem;color:var(--color-ink-muted);">${isSinger ? t('catFeePending') : 'Total Payable (INR)'}</div>
            <div style="font-size:1.45rem;font-weight:800;color:var(--color-primary);">${formatINR(price)}</div>
          </div>
          <button class="btn btn-primary" onclick="window.herSpaceApp.completeBooking()">
            ${t('btnBookNow')} (${formatINR(price)}) →
          </button>
        </div>
      `;
    },

    setBookingDate(dateStr) {
      bookingModalState.selectedDate = dateStr;
      this.renderBookingModalContent();
    },

    setBookingSlot(slot) {
      bookingModalState.selectedSlot = slot;
      this.renderBookingModalContent();
    },

    setBookingMode(mode) {
      bookingModalState.selectedMode = mode;
    },

    completeBooking() {
      const { user } = store.state;
      if (!user) {
        this.closeBookingModal();
        this.navigate('onb-register');
        return;
      }

      try {
        const { expert, selectedDate, selectedSlot, selectedMode, isComplimentary } = bookingModalState;
        booking.confirmBooking({
          expert,
          dateStr: selectedDate,
          timeSlot: selectedSlot,
          mode: selectedMode,
          sessionType: isComplimentary ? 'welcome_listener'
            : (expert.role === 'singer' ? 'singer_demo_reservation'
              : (expert.role === 'listener' ? 'paid_listener' : 'certified_counsellor'))
        });
        this.closeBookingModal();
        // Finishing a booking during onboarding completes it and opens My Personal Space.
        if (window.herSpaceJourney.isOnboarding()) {
          this.navigate(window.herSpaceJourney.completeOnboarding());
        } else {
          this.navigate('dashboard');
        }
      } catch (err) {
        if (err.code === 'MEMBERSHIP_REQUIRED') {
          this.closeBookingModal();
          this.navigate('pricing');
        }
        store.toast(err.message, 'error');
      }
    },

    // Reschedule Modal
    openRescheduleModal(appointmentId) {
      const apt = store.state.appointments.find(a => a.id === appointmentId);
      if (!apt) return;

      const dates = booking.getAvailableDates();
      const modal = document.getElementById('rescheduleModal');
      const body = document.getElementById('rescheduleModalBody');

      if (modal && body) {
        body.innerHTML = `
          <h3 style="margin-bottom:8px;">${t('dashRescheduleBtn')}</h3>
          <p style="font-size:0.88rem;color:var(--color-ink-muted);">
            Session with <strong>${apt.expertName}</strong> currently on ${apt.date} at ${apt.time}.
          </p>
          <div class="form-group">
            <label class="form-label">Select New Date</label>
            <select id="rescheduleDateSelect" class="form-control">
              ${dates.map(d => `<option value="${d.dateStr}">${d.dayName}, ${d.dayNum} ${d.monthName}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Select New Time</label>
            <select id="rescheduleTimeSelect" class="form-control">
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
            </select>
          </div>
          <div style="font-size:0.82rem;color:var(--color-warning);margin:14px 0;">
            ⚠️ ${t('policyReschedule')}
          </div>
          <button class="btn btn-primary btn-block" onclick="window.herSpaceApp.submitReschedule('${apt.id}')">
            ${t('dashRescheduleBtn')}
          </button>
        `;
        modal.classList.add('open');
      }
    },

    closeRescheduleModal() {
      const modal = document.getElementById('rescheduleModal');
      if (modal) modal.classList.remove('open');
    },

    submitReschedule(appointmentId) {
      const dateSelect = document.getElementById('rescheduleDateSelect');
      const timeSelect = document.getElementById('rescheduleTimeSelect');
      if (dateSelect && timeSelect) {
        try {
          booking.rescheduleAppointment(appointmentId, dateSelect.value, timeSelect.value);
          this.closeRescheduleModal();
        } catch (err) {
          store.toast(err.message, 'error');
        }
      }
    },

    simulateJoinCall(appointmentId) {
      const apt = store.state.appointments.find(a => a.id === appointmentId);
      if (apt) {
        this.openMaskedCallModal(apt.expertId, apt.expertRole, apt.expertName);
      } else {
        this.openMaskedCallModal('listener-priya', 'listener', 'Priya Madhavan');
      }
    },

    openCrisisModal() {
      syncStaticModalsAndDrawer();
      const modal = document.getElementById('crisisModal');
      if (modal) modal.classList.add('open');
    },

    closeCrisisModal() {
      const modal = document.getElementById('crisisModal');
      if (modal) modal.classList.remove('open');
    },

    openPolicyModal(type) {
      const modal = document.getElementById('policyModal');
      const title = document.getElementById('policyModalTitle');
      const content = document.getElementById('policyModalContent');

      if (modal && title && content) {
        if (type === 'privacy') {
          title.textContent = isTa() ? 'தனியுரிமை & இருவழி எண் மறைப்பு பாதுகாப்பு' : 'Privacy & 2-Way Number Masking Notice';
          content.innerHTML = `
            <p>${t('safetyP1')}</p>
            <ul>
              <li><strong>2-Way Masked Telephone Bridge:</strong> Neither members nor professionals can view each other's real mobile numbers.</li>
              <li><strong>Zero Health Disclosure:</strong> Period logs (My Cycle) and private wellbeing questions are strictly isolated to your account.</li>
              <li><strong>Zero Default Recording:</strong> ${t('safetyP2')}</li>
            </ul>
          `;
        } else if (type === 'terms') {
          title.textContent = isTa() ? 'பயன்பாட்டு விதிமுறைகள் (18+)' : 'Terms of Service (18+ Women & Transgender Women)';
          content.innerHTML = `
            <p>1. ${t('eligibilityText')}</p>
            <p>2. ${t('tierListenerBoundary')}</p>
            <p>3. ${t('tierCounsellorBoundary')}</p>
            <p>4. ${t('safetyP3')}</p>
          `;
        } else {
          title.textContent = t('policyTitle');
          content.innerHTML = `
            <p><strong>${t('policyCancel')}</strong></p>
            <p><strong>${t('policyReschedule')}</strong></p>
            <p><strong>${t('policyNoShow')}</strong></p>
          `;
        }
        modal.classList.add('open');
      }
    },

    closePolicyModal() {
      const modal = document.getElementById('policyModal');
      if (modal) modal.classList.remove('open');
    }
  };

  window.HerSpaceApp = window.herSpaceApp;

  // Bind Form Submissions
  window.addEventListener('DOMContentLoaded', () => {
    window.herSpaceApp.init();

    const otpRequestBtn = document.getElementById('btnRequestOtp');
    if (otpRequestBtn) {
      otpRequestBtn.addEventListener('click', () => {
        const phoneInput = document.getElementById('authPhoneInput');
        try {
          const res = auth.sendPhoneOtp(phoneInput.value);
          document.getElementById('otpInputGroup').style.display = 'block';
          document.getElementById('otpHint').textContent = `Demo OTP sent: ${res.demoOtp} (Auto-filled)`;
          const otpField = document.getElementById('authOtpInput');
          if (otpField) otpField.value = res.demoOtp;
          store.toast(`Demo OTP generated: ${res.demoOtp}`, 'success');
        } catch (err) {
          store.toast(err.message, 'error');
        }
      });
    }

    const authForm = document.getElementById('authRegisterForm');
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('authPhoneInput').value;
        const otp = document.getElementById('authOtpInput').value;
        const fullName = document.getElementById('authNameInput').value;
        const email = document.getElementById('authEmailInput').value;
        const age = document.getElementById('authAgeInput').value;
        const identity = document.getElementById('authIdentitySelect').value;
        const agreeTerms = document.getElementById('authAgreeTerms').checked;

        try {
          await auth.verifyPhoneOtpAndRegister({
            phone,
            otp,
            fullName,
            email,
            age,
            identity,
            agreeTerms
          });
          window.herSpaceApp.closeGetStartedModal();
          window.herSpaceApp.navigate('dashboard');
        } catch (err) {
          store.toast(err.message, 'error');
        }
      });
    }

    const proForm = document.getElementById('proApplyForm');
    if (proForm) {
      proForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('proNameInput').value;
        const email = document.getElementById('proEmailInput').value;
        const phone = document.getElementById('proPhoneInput').value;
        const role = document.getElementById('proRoleSelect').value;
        const qualification = document.getElementById('proQualInput').value;
        const rciNumber = document.getElementById('proRciInput').value;
        const experienceYears = document.getElementById('proExpInput').value;
        const bio = document.getElementById('proBioInput').value;

        try {
          admin.submitApplication({
            name,
            email,
            phone,
            role,
            qualification,
            rciNumber,
            experienceYears,
            bio
          });
          window.herSpaceApp.closeProApplyModal();
          window.herSpaceApp.navigate('admin');
        } catch (err) {
          store.toast(err.message, 'error');
        }
      });
    }
  });
})();
