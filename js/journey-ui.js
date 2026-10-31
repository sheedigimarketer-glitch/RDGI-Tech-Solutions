/**
 * HerSpace — Journey UI: registration, sign-in, app tour, membership info, booking step and My Personal Space.
 * Rendered into the existing app shell by js/app.js.
 */
(function() {
  'use strict';

  const store = window.herSpaceStore;
  const config = window.HERSPACE_CONFIG;
  const formatINR = window.herSpaceFormatINR;

  function t(key, vars) { return window.herSpaceTranslate(key, vars); }
  function isTa() { return store.state.lang === 'ta'; }
  function esc(v) {
    return String(v === undefined || v === null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function app() { return window.herSpaceApp; }
  function journey() { return window.herSpaceJourney; }
  function auth() { return window.herSpaceAuth; }
  function db() { return window.herSpaceSupabase; }

  // Form drafts survive re-renders (e.g. a language switch) without being lost.
  const draft = {
    fullName: '', phone: '', email: '', password: '', age: '', identity: 'woman',
    preferredLang: null, otp: '', agree: false, codeSent: false, testCode: ''
  };
  const signinDraft = { email: '', password: '', phone: '', otp: '', codeSent: false, testCode: '' };
  let tourIndex = 0;

  const TOUR_SLIDES = [
    { key: 'tourS1', image: () => config.images.heroSunrise },
    { key: 'tourS2', image: () => config.images.reflectionOutdoor },
    { key: 'tourS3', image: () => config.images.calmCup },
    { key: 'tourS4', image: () => config.images.hopePortrait }
  ];

  function logoImg() {
    return '<img src="assets/herspace-client-logo.webp" alt="HerSpace" />';
  }

  // Minimal header used only while onboarding: no tabs, so the sequence is never permanent navigation.
  function renderOnboardingHeader(opts) {
    const o = opts || {};
    const lang = store.state.lang;
    const progress = o.step ? `
      <div class="onb-progress" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${o.step}">
        <div class="onb-progress-label">${t('stepOf', { n: o.step })}</div>
        <div class="onb-progress-track"><span style="width:${o.step * 25}%"></span></div>
      </div>` : '';
    return `
      <header class="onb-header">
        <div class="container onb-header-inner">
          <a class="onb-logo" href="#home" onclick="window.herSpaceApp.navigate('home'); return false;">${logoImg()}</a>
          ${progress}
          <button class="lang-toggle-btn" onclick="window.herSpaceApp.toggleLanguage()" aria-label="Switch Language">
            <span>${lang === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </header>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------------------------------
  function renderRegister() {
    const lang = draft.preferredLang || store.state.lang;
    const live = db().isLive();
    return `
      <section class="onb-page">
        <div class="container onb-narrow">
          <h1 class="onb-title">${t('regTitle')}</h1>
          <p class="onb-sub">${t('regSub')}</p>

          <form class="onb-card" id="registerForm" onsubmit="window.herSpaceJourneyUI.submitRegister(event)" novalidate>
            <div class="form-group">
              <label class="form-label" for="regName">${t('fldName')}</label>
              <input id="regName" class="form-control" type="text" autocomplete="name" value="${esc(draft.fullName)}"
                oninput="window.herSpaceJourneyUI.setField('fullName', this.value)" required />
              ${draft.errors && draft.errors.fullName ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.fullName)}</span></div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="regPhone">${t('fldPhone')}</label>
              <div class="onb-inline">
                <input id="regPhone" class="form-control" type="tel" inputmode="numeric" autocomplete="tel-national" value="${esc(draft.phone)}"
                  oninput="window.herSpaceJourneyUI.setField('phone', this.value)" required />
                <button type="button" class="btn btn-secondary" id="regSendCode" onclick="window.herSpaceJourneyUI.sendCode()">${t('btnSendCode')}</button>
              </div>
              ${draft.errors && draft.errors.phone ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.phone)}</span></div>` : ''}
              ${draft.codeSent ? `
                <div class="onb-notice onb-notice-warn" id="regTestBanner">${t('otpTestBanner')} <strong>${t('otpTestCode', { code: esc(draft.testCode) })}</strong></div>
                <label class="form-label" for="regOtp" style="margin-top:12px;">${t('fldOtp')}</label>
                <input id="regOtp" class="form-control" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" value="${esc(draft.otp)}"
                  oninput="window.herSpaceJourneyUI.setField('otp', this.value)" />
                ${draft.errors && draft.errors.otp ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.otp)}</span></div>` : ''}
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" for="regEmail">${t('fldEmail')}</label>
              <input id="regEmail" class="form-control" type="email" autocomplete="email" value="${esc(draft.email)}"
                oninput="window.herSpaceJourneyUI.setField('email', this.value)" required />
              ${draft.errors && draft.errors.email ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.email)}</span></div>` : `<div class="form-hint">${live ? t('emailLiveNote') : t('emailLocalNote')}</div>`}
            </div>

            <div class="form-group">
              <label class="form-label" for="regPassword">${t('fldPassword')}</label>
              <input id="regPassword" class="form-control" type="password" autocomplete="new-password" minlength="8" value="${esc(draft.password)}"
                oninput="window.herSpaceJourneyUI.setField('password', this.value)" required />
              ${draft.errors && draft.errors.password ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.password)}</span></div>` : ''}
            </div>

            <div class="onb-two">
              <div class="form-group">
                <label class="form-label" for="regAge">${t('fldAge')}</label>
                <input id="regAge" class="form-control" type="number" min="18" max="100" inputmode="numeric" value="${esc(draft.age)}"
                  oninput="window.herSpaceJourneyUI.setField('age', this.value)" required />
                ${draft.errors && draft.errors.age ? `<div class="form-field-error"><span class="error-icon">⚠️</span><span>${esc(draft.errors.age)}</span></div>` : ''}
              </div>
              <div class="form-group">
                <label class="form-label" for="regIdentity">${t('fldIdentity')}</label>
                <select id="regIdentity" class="form-control" onchange="window.herSpaceJourneyUI.setField('identity', this.value)">
                  <option value="woman" ${draft.identity === 'woman' ? 'selected' : ''}>${t('optWomanLabel')}</option>
                  <option value="trans_woman" ${draft.identity === 'trans_woman' ? 'selected' : ''}>${t('optTransWomanLabel')}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="regLang">${t('fldLang')}</label>
              <select id="regLang" class="form-control" onchange="window.herSpaceJourneyUI.setPreferredLang(this.value)">
                <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                <option value="ta" ${lang === 'ta' ? 'selected' : ''}>தமிழ்</option>
              </select>
            </div>

            <label class="form-check onb-consent">
              <input id="regAgree" type="checkbox" ${draft.agree ? 'checked' : ''} onchange="window.herSpaceJourneyUI.setField('agree', this.checked)" />
              <span>${t('regConsent')}</span>
            </label>
            ${draft.errors && draft.errors.agree ? `<div class="form-field-error" style="margin-bottom:14px;"><span class="error-icon">⚠️</span><span>${esc(draft.errors.agree)}</span></div>` : ''}

            <button type="submit" class="btn btn-primary btn-lg btn-block" id="regSubmit">Create Account</button>
          </form>

          <p class="onb-alt">${t('regHaveAccount')}
            <a href="#signin" onclick="window.herSpaceApp.navigate('signin'); return false;">${t('btnSignInShort')}</a></p>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Sign in (returning members)
  // ---------------------------------------------------------------------------------------------
  function renderSignin() {
    const live = db().isLive();
    return `
      <section class="onb-page">
        <div class="container onb-narrow">
          <h1 class="onb-title">${t('signinTitle')}</h1>
          <p class="onb-sub">${t('signinSub')}</p>
          <form class="onb-card" id="signinForm" onsubmit="window.herSpaceJourneyUI.submitSignin(event)" novalidate>
            ${live ? `
              <div class="form-group">
                <label class="form-label" for="siEmail">${t('fldEmail')}</label>
                <input id="siEmail" class="form-control" type="email" autocomplete="email" value="${esc(signinDraft.email)}"
                  oninput="window.herSpaceJourneyUI.setSigninField('email', this.value)" />
              </div>
              <div class="form-group">
                <label class="form-label" for="siPassword">${t('fldPassword')}</label>
                <input id="siPassword" class="form-control" type="password" autocomplete="current-password" value="${esc(signinDraft.password)}"
                  oninput="window.herSpaceJourneyUI.setSigninField('password', this.value)" />
              </div>
            ` : `
              <div class="onb-notice">${t('signinLocalNote')}</div>
              <div class="form-group">
                <label class="form-label" for="siPhone">${t('fldPhone')}</label>
                <div class="onb-inline">
                  <input id="siPhone" class="form-control" type="tel" inputmode="numeric" value="${esc(signinDraft.phone)}"
                    oninput="window.herSpaceJourneyUI.setSigninField('phone', this.value)" />
                  <button type="button" class="btn btn-secondary" id="siSendCode" onclick="window.herSpaceJourneyUI.sendSigninCode()">${t('btnSendCode')}</button>
                </div>
                ${signinDraft.codeSent ? `
                  <div class="onb-notice onb-notice-warn">${t('otpTestBanner')} <strong>${t('otpTestCode', { code: esc(signinDraft.testCode) })}</strong></div>
                  <label class="form-label" for="siOtp" style="margin-top:12px;">${t('fldOtp')}</label>
                  <input id="siOtp" class="form-control" type="text" inputmode="numeric" maxlength="6" value="${esc(signinDraft.otp)}"
                    oninput="window.herSpaceJourneyUI.setSigninField('otp', this.value)" />
                ` : ''}
              </div>
            `}
            <button type="submit" class="btn btn-primary btn-lg btn-block" id="siSubmit">${t('signinSubmit')}</button>
          </form>
          <p class="onb-alt">${t('signinNew')}
            <a href="#register" onclick="window.herSpaceApp.navigate('onb-register'); return false;">${t('btnGetStartedHero')}</a></p>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // App tour (slides; an approved video is shown only when config.tour.videoUrl is supplied)
  // ---------------------------------------------------------------------------------------------
  function renderTour() {
    const total = TOUR_SLIDES.length;
    if (tourIndex > total - 1) tourIndex = total - 1;
    const slide = TOUR_SLIDES[tourIndex];
    const last = tourIndex === total - 1;
    const replay = store.state.onboarding.completed || store.state.onboarding.tourReplay;
    const canSkip = (tourIndex + 1) >= config.tour.minSlidesBeforeSkip && !last;
    const video = config.tour.videoUrl ? `
      <video class="onb-video" controls preload="metadata" src="${esc(config.tour.videoUrl)}"></video>` : '';
    return `
      <section class="onb-page">
        <div class="container onb-narrow">
          ${video}
          <div class="onb-card onb-tour">
            <div class="onb-tour-image"><img src="${slide.image()}" alt="" /></div>
            <div class="onb-tour-progress">${t('tourProgress', { n: tourIndex + 1, total: total })}</div>
            <h1 class="onb-title onb-title-sm" id="tourTitle">${t(slide.key + 'Title')}</h1>
            <p class="onb-sub" id="tourBody">${t(slide.key + 'Body')}</p>
            <div class="onb-dots" aria-hidden="true">
              ${TOUR_SLIDES.map((s, i) => `<span class="${i === tourIndex ? 'on' : ''}"></span>`).join('')}
            </div>
            <div class="onb-actions">
              ${tourIndex > 0 ? `<button class="btn btn-secondary" id="tourBack" onclick="window.herSpaceJourneyUI.tourStep(-1)">${t('tourBack')}</button>` : '<span></span>'}
              ${last
                ? `<button class="btn btn-primary" id="tourContinue" onclick="window.herSpaceJourneyUI.finishTour(false)">${t('tourContinue')}</button>`
                : `<button class="btn btn-primary" id="tourNext" onclick="window.herSpaceJourneyUI.tourStep(1)">${t('tourNext')}</button>`}
            </div>
            <div class="onb-links">
              ${canSkip ? `<button class="onb-link" id="tourSkip" onclick="window.herSpaceJourneyUI.finishTour(true)">${t('tourSkip')}</button>` : ''}
              ${replay ? `<button class="onb-link" id="tourClose" onclick="window.herSpaceJourneyUI.closeTour()">${t('tourClose')}</button>` : ''}
            </div>
          </div>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Membership information (information only; never forces payment or auto-renewal)
  // ---------------------------------------------------------------------------------------------
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(isTa() ? 'ta-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return String(iso || ''); }
  }

  function renderMembership() {
    const ent = store.state.entitlement || {};
    const p = config.pricing;
    return `
      <section class="onb-page">
        <div class="container onb-narrow">
          <h1 class="onb-title">${t('memTitle')}</h1>
          <div class="onb-card onb-mem">
            <div class="onb-mem-block onb-mem-hero">
              <h2>${t('memTrialTitle')}</h2>
              <p id="memTrialBody">${t('memTrialBody', { date: fmtDate(ent.trialEndsAt) })}</p>
            </div>
            <div class="onb-mem-block">
              <h2>${t('memAfterTitle')}</h2>
              <p id="memAfterBody">${t('memAfterBody')}</p>
            </div>
            <div class="onb-mem-block">
              <h2>${t('memWelcomeTitle')}</h2>
              <p>${t('memWelcomeBody')}</p>
            </div>
            <div class="onb-mem-block">
              <h2>${t('memPricesTitle')}</h2>
              <ul class="onb-price-list">
                <li><span>${t('catListener')}</span><strong>${formatINR(p.trainedListenerPerSession)}</strong></li>
                <li><span>${t('catCounsellor')}</span><strong>${formatINR(p.professionalCounsellorPerSession)}</strong></li>
                <li><span>${t('catSinger')}</span><strong>${t('memPriceMelody')}</strong></li>
              </ul>
            </div>
            <div class="onb-notice">${t('memPayNote')}</div>
            <button class="btn btn-primary btn-lg btn-block" id="memContinue" onclick="window.herSpaceJourneyUI.acknowledgeMembership()">${t('memContinue')}</button>
          </div>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Book a service (onboarding step) — the hub itself is rendered by app.js
  // ---------------------------------------------------------------------------------------------
  function renderBookStep(hubHtml) {
    return `
      <section class="onb-page onb-page-wide">
        <div class="container">
          <h1 class="onb-title">${t('bookStepTitle')}</h1>
          <p class="onb-sub">${t('bookStepSub')}</p>
          ${hubHtml}
          <div class="onb-later">
            <button class="btn btn-secondary btn-lg" id="bookLater" onclick="window.herSpaceJourneyUI.bookLater()">${t('bookLater')}</button>
          </div>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // My Personal Space
  // ---------------------------------------------------------------------------------------------
  function renderPersonalSpace() {
    const s = store.state;
    const user = s.user;
    const status = journey().status();
    const days = journey().trialDaysLeft();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = (s.appointments || [])
      .filter(a => (a.status === 'scheduled' || a.status === 'rescheduled') && a.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 3);
    const articles = (window.HERSPACE_WELLBEING_ARTICLES || []).filter(a => (s.wellbeing.savedIds || []).indexOf(a.id) !== -1);
    const statusLabel = status === 'paid' ? t('spaceStatusPaid')
      : (status === 'expired' ? t('spaceStatusExpired') : t('spaceStatusTrial', { days: days }));
    const chip = status === 'expired' ? 'badge-pink' : 'badge-verified';
    const emailV = user.emailVerification === 'verified' ? t('verEmailVerified')
      : (user.emailVerification === 'pending' ? t('verEmailPending') : t('verEmailLocal'));
    const mobileV = user.phoneVerification === 'verified' ? t('verMobileLive') : t('verMobileTest');

    return `
      <section class="space-page">
        <div class="container">
          <div class="space-hero">
            <div>
              <div class="eyebrow">${t('spaceTitle')}</div>
              <h1 class="space-hello" id="spaceHello">${t('spaceHello', { name: esc((user.fullName || '').split(' ')[0] || user.fullName) })}</h1>
              <span class="badge ${chip}" id="spaceStatus">${statusLabel}</span>
            </div>
            <button class="btn btn-primary" id="spaceBook" onclick="window.herSpaceApp.navigate('support')">${t('spaceBookNow')}</button>
          </div>

          ${status === 'expired' ? `
            <div class="onb-notice onb-notice-warn" id="spaceGate">
              <strong>${t('gateTitle')}</strong> ${t('gateBody')}
              <div style="margin-top:10px;"><button class="btn btn-sm btn-primary" onclick="window.herSpaceApp.navigate('pricing')">${t('gateBtn')}</button></div>
            </div>` : ''}

          <div class="space-grid">
            <div class="card space-card" id="spaceUpcoming">
              <h2>${t('spaceUpcoming')}</h2>
              ${upcoming.length === 0 ? `<p>${t('spaceNoUpcoming')}</p>` : `
                <ul class="space-list">
                  ${upcoming.map(a => `
                    <li>
                      <strong>${esc(isTa() && a.expertNameTa ? a.expertNameTa : a.expertName)}</strong>
                      <span>${esc(a.date)} · ${esc(a.time)}</span>
                    </li>`).join('')}
                </ul>`}
              <button class="btn btn-sm btn-secondary" onclick="window.herSpaceApp.navigate('dashboard')">${t('navBookings')}</button>
            </div>

            <div class="card space-card" id="spaceCalm">
              <h2>${t('spaceCalmTitle')}</h2>
              <p>${t('spaceCalmSub')}</p>
              <div class="space-actions">
                <button class="btn btn-sm btn-primary" onclick="window.herSpaceJourneyUI.openCalm('all')">${t('spaceOpen')}</button>
              </div>
            </div>

            <div class="card space-card" id="spaceMeditation">
              <h2>${t('spaceMeditation')}</h2>
              <p>${t('spaceMeditationSub')}</p>
              <button class="btn btn-sm btn-secondary" onclick="window.herSpaceJourneyUI.openCalm('meditation')">${t('spaceOpen')}</button>
            </div>

            <div class="card space-card" id="spaceMusic">
              <h2>${t('spaceMusic')}</h2>
              <p>${t('spaceMusicSub')}</p>
              <div class="space-actions">
                <button class="btn btn-sm btn-secondary" onclick="window.herSpaceJourneyUI.openCalm('instrumental')">${t('calmFilterInstrumental')}</button>
                <button class="btn btn-sm btn-secondary" onclick="window.herSpaceJourneyUI.openCalm('sleep')">${t('calmFilterSleep')}</button>
              </div>
            </div>

            <div class="card space-card" id="spaceCycle">
              <h2>${t('spaceCycle')}</h2>
              <p>${t('spaceCycleSub')}</p>
              <button class="btn btn-sm btn-secondary" onclick="window.herSpaceApp.navigate('cycle')">${t('spaceOpen')}</button>
            </div>

            <div class="card space-card" id="spaceSaved">
              <h2>${t('spaceSaved')}</h2>
              ${articles.length === 0 ? `<p>${t('spaceNoSaved')}</p>` : `
                <ul class="space-list">
                  ${articles.map(a => `
                    <li>
                      <button class="onb-link" onclick="window.herSpaceJourneyUI.openSaved('${esc(a.id)}')">${esc(isTa() ? a.title.ta : a.title.en)}</button>
                    </li>`).join('')}
                </ul>`}
            </div>

            <div class="card space-card space-card-wide" id="spacePrefs">
              <h2>${t('spacePrefs')}</h2>
              <div class="space-pref-row">
                <span>${t('prefLanguage')}</span>
                <span class="space-seg">
                  <button class="${s.lang === 'en' ? 'on' : ''}" onclick="window.herSpaceJourneyUI.setLanguagePref('en')">English</button>
                  <button class="${s.lang === 'ta' ? 'on' : ''}" onclick="window.herSpaceJourneyUI.setLanguagePref('ta')">தமிழ்</button>
                </span>
              </div>
              <label class="space-pref-row">
                <span>${t('prefReminders')}</span>
                <input type="checkbox" ${s.cycle.remindersEnabled ? 'checked' : ''} onchange="window.herSpaceApp.toggleCycleReminders(this.checked)" />
              </label>
              <div class="space-pref-row">
                <span>${t('prefReplayTour')}</span>
                <button class="btn btn-sm btn-secondary" id="spaceReplayTour" onclick="window.herSpaceJourneyUI.replayTour()">${t('navHelpTour')}</button>
              </div>
              <div class="space-verify">
                <span class="badge badge-lavender">${mobileV}</span>
                <span class="badge badge-lavender">${emailV}</span>
                ${user.emailVerification === 'pending' ? `<button class="btn btn-sm btn-outline" onclick="window.herSpaceJourneyUI.resendEmail()">${t('btnResendEmail')}</button>` : ''}
              </div>
              <div class="space-pref-row">
                <span>${esc(user.email)}</span>
                <button class="btn btn-sm btn-outline" id="spaceSignOut" onclick="window.herSpaceAuth.signOut()">${t('navSignOut')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------------------------
  window.herSpaceJourneyUI = {
    renderOnboardingHeader, renderRegister, renderSignin, renderTour, renderMembership, renderBookStep, renderPersonalSpace,
    draft: draft,

    // Called by app.navigate when a route is entered
    onEnter(route) {
      if (route === 'onb-tour') tourIndex = 0;
    },

    setField(name, value) { draft[name] = value; },
    setSigninField(name, value) { signinDraft[name] = value; },

    setPreferredLang(lang) {
      draft.preferredLang = lang;
      store.setLanguage(lang);
    },

    sendCode() {
      try {
        const res = auth().requestMobileOtp(draft.phone);
        draft.codeSent = true;
        draft.testCode = res.testCode;
        app().render();
        const el = document.getElementById('regOtp');
        if (el) el.focus();
      } catch (err) {
        store.toast(err.message, 'error');
      }
    },

    sendSigninCode() {
      try {
        const res = auth().requestMobileOtp(signinDraft.phone);
        signinDraft.codeSent = true;
        signinDraft.testCode = res.testCode;
        app().render();
      } catch (err) {
        store.toast(err.message, 'error');
      }
    },

    async submitRegister(e) {
      if (e) e.preventDefault();
      draft.errors = {};
      if (!draft.fullName || !draft.fullName.trim()) draft.errors.fullName = t('fldName') + ' is required.';
      const cleanP = String(draft.phone || '').replace(/\D/g, '');
      if (cleanP.length < 10) draft.errors.phone = 'Please enter a valid 10-digit mobile number.';
      if (!draft.codeSent) {
        draft.errors.phone = t('regCodeRequired');
        app().render();
        return;
      }
      if (!draft.otp) draft.errors.otp = 'Please enter the mobile code.';
      if (!draft.agree) draft.errors.agree = 'You must accept the Terms to proceed.';

      if (Object.keys(draft.errors).length > 0) {
        app().render();
        return;
      }

      try {
        await auth().registerMember({
          fullName: draft.fullName, phone: draft.phone, email: draft.email, password: draft.password,
          age: draft.age, identity: draft.identity, preferredLang: draft.preferredLang || store.state.lang,
          otp: draft.otp, agreeTerms: draft.agree
        });
        draft.password = '';
        draft.otp = '';
        draft.codeSent = false;
        draft.errors = {};
        app().navigate('onb-tour');
      } catch (err) {
        const msg = err.message || '';
        if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code')) {
          draft.errors.otp = msg;
        } else if (msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('mobile')) {
          draft.errors.phone = msg;
        } else {
          draft.errors.fullName = msg;
        }
        app().render();
      }
    },

    async submitSignin(e) {
      if (e) e.preventDefault();
      try {
        await auth().signInMember({
          email: signinDraft.email, password: signinDraft.password, phone: signinDraft.phone, otp: signinDraft.otp
        });
        signinDraft.password = ''; signinDraft.otp = ''; signinDraft.codeSent = false;
        app().navigate(journey().entryRoute());
      } catch (err) {
        store.toast(err.message, 'error');
      }
    },

    tourStep(delta) {
      tourIndex = Math.max(0, Math.min(TOUR_SLIDES.length - 1, tourIndex + delta));
      app().render();
    },

    finishTour(skipped) {
      const next = journey().finishTour(skipped);
      app().navigate(next);
    },

    closeTour() {
      const ob = store.state.onboarding;
      store.setOnboarding({ tourReplay: false });
      app().navigate(ob.completed ? 'space' : journey().entryRoute());
    },

    acknowledgeMembership() {
      app().navigate(journey().acknowledgeMembership());
    },

    bookLater() {
      app().navigate(journey().completeOnboarding());
    },

    replayTour() {
      app().navigate(journey().replayTour());
    },

    openCalm(category) {
      store.state.calm.activeCategory = category;
      app().navigate('calm');
    },

    openSaved(articleId) {
      app().navigate('wellbeing');
      app().openWellbeingArticle(articleId);
    },

    setLanguagePref(lang) {
      if (store.state.user) {
        store.setUser(Object.assign({}, store.state.user, { preferredLang: lang }));
      }
      store.setLanguage(lang);
    },

    async resendEmail() {
      const res = await db().resendEmailConfirmation(store.state.user.email);
      store.toast(res.error ? res.error.message : 'Verification email sent.', res.error ? 'warning' : 'success');
    }
  };
})();
