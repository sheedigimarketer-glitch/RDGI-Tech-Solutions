/**
 * HerSpace Premium 4.0 - Central Reactive State Store
 * Manages Auth, Entitlements, Bilingual Care Directory, Life & Wellbeing, My Cycle, Calm Audio, Live Singers & Notifications
 */

(function() {
  'use strict';

  const defaultExperts = [
    {
      id: 'counsellor-anita',
      name: 'Dr. Anita Sundaram',
      nameTa: 'டாக்டர். அனிதா சுந்தரம்',
      role: 'counsellor',
      qualification: 'M.Sc., M.Phil Counselling Psychology · RCI Certified',
      qualificationTa: 'M.Sc., M.Phil உளவியல் ஆலோசனை · RCI சான்றிதழ் பெற்றவர்',
      experienceYears: 12,
      pricePaise: 99900,
      priceDisplay: 999,
      durationMinutes: 60,
      avatar: 'assets/images/04_HerSpace_Hope_Portrait.png',
      specialties: ['Mental Health', 'Anxiety & Low Mood', 'Life Guidance', 'Grief & Loss'],
      specialtiesTa: ['மன நலம்', 'பதற்றம் & மனச்சோர்வு', 'வாழ்க்கை வழிகாட்டல்', 'இழப்பு & ஆறுதல்'],
      languages: ['Tamil', 'English'],
      modes: ['2-Way Masked Phone Call', 'Encrypted Audio', 'Private Chat'],
      rating: 4.96,
      reviewsCount: 142,
      nextSlot: 'Today, 5:30 PM',
      nextSlotTa: 'இன்று மாலை 5:30',
      bio: 'Specialized in compassionate cognitive and existential counselling with 12+ years helping women navigate identity, stress, and relational crossroads.',
      bioTa: '12 ஆண்டுகளுக்கும் மேலான அனுபவத்துடன் பெண்களின் மன அழுத்தம், தன்னம்பிக்கை மற்றும் உறவுச் சிக்கல்களுக்கு அறிவியல் பூர்வமான உளவியல் ஆலோசனை வழங்குபவர்.',
      verified: true
    },
    {
      id: 'listener-priya',
      name: 'Priya Madhavan',
      nameTa: 'பிரியா மாதவன்',
      role: 'listener',
      qualification: 'Certified Trained Human Listener · Emotional First Aid',
      qualificationTa: 'சான்றளிக்கப்பட்ட பயிற்சி பெற்ற கவனிப்பாளர் · மனநல முதலுதவி',
      experienceYears: 8,
      pricePaise: 39900,
      priceDisplay: 399,
      durationMinutes: 60,
      avatar: 'assets/images/02_HerSpace_Calm_Cup.png',
      specialties: ['Relationships', 'Emotional Support', 'Stress & Venting', 'Work-Life Balance'],
      specialtiesTa: ['உறவுகள்', 'உணர்வு ஆதரவு', 'மன அழுத்தம் குறைய', 'பணி-வாழ்க்கை சமநிலை'],
      languages: ['Tamil', 'English'],
      modes: ['2-Way Masked Phone Call', 'Encrypted Audio', 'Private Chat'],
      rating: 4.92,
      reviewsCount: 218,
      nextSlot: 'Today, 4:00 PM',
      nextSlotTa: 'இன்று மாலை 4:00',
      bio: 'A gentle, dedicated listener who holds non-judgmental space for your thoughts when you need an understanding ear without unsolicited advice.',
      bioTa: 'எவ்விதத் தீர்ப்புமின்றி உங்கள் மன உணர்வுகளைப் பொறுமையுடனும் கனிவுடனும் கேட்டறியும் பயிற்சி பெற்ற கவனிப்பாளர்.',
      verified: true
    },
    {
      id: 'counsellor-neha',
      name: 'Neha Rajagopal',
      nameTa: 'நேகா ராஜகோபால்',
      role: 'counsellor',
      qualification: 'M.Phil Clinical Psychology · Licensed Psychotherapist',
      qualificationTa: 'M.Phil மருத்துவ உளவியல் · உரிமம் பெற்ற உளவியலாளர்',
      experienceYears: 10,
      pricePaise: 99900,
      priceDisplay: 999,
      durationMinutes: 60,
      avatar: 'assets/images/03_HerSpace_Reflection_Outdoor.png',
      specialties: ['Career Anxiety', 'Trauma-Informed Care', 'Life Transitions', 'PCOS & Hormonal Mood'],
      specialtiesTa: ['பணிப் பதற்றம்', 'மனக் காயம் சிகிச்சை', 'வாழ்க்கை மாற்றங்கள்', 'ஹார்மோன் & மனநிலை'],
      languages: ['English', 'Tamil'],
      modes: ['2-Way Masked Phone Call', 'Encrypted Audio'],
      rating: 4.98,
      reviewsCount: 96,
      nextSlot: 'Tomorrow, 11:00 AM',
      nextSlotTa: 'நாளை காலை 11:00',
      bio: 'Evidence-based psychotherapist focusing on trauma-informed cognitive techniques and self-compassion tools for women facing demanding life pressures.',
      bioTa: 'பணி அழுத்தம் மற்றும் மனக் காயங்களிலிருந்து விடுபட சான்றுகள் அடிப்படையிலான உளவியல் சிகிச்சை (CBT/ACT) அளிக்கும் வல்லுநர்.',
      verified: true
    },
    {
      id: 'listener-meera',
      name: 'Meera Karthikeyan',
      nameTa: 'மீரா கார்த்திகேயன்',
      role: 'listener',
      qualification: 'Certified Active Listener · Women’s Peer Support Lead',
      qualificationTa: 'சான்றளிக்கப்பட்ட கவனிப்பாளர் · பெண்கள் ஆதரவு வழிகாட்டி',
      experienceYears: 6,
      pricePaise: 39900,
      priceDisplay: 399,
      durationMinutes: 60,
      avatar: 'assets/images/01_HerSpace_Hero_Sunrise.png',
      specialties: ['Motherhood & Postpartum', 'Wellness', 'Family Boundaries', 'Loneliness'],
      specialtiesTa: ['தாய்மை & மகப்பேறு', 'மன அமைதி', 'குடும்ப எல்லைகள்', 'தனிமை நீங்க'],
      languages: ['Tamil', 'English'],
      modes: ['2-Way Masked Phone Call', 'Private Chat'],
      rating: 4.90,
      reviewsCount: 164,
      nextSlot: 'Today, 7:00 PM',
      nextSlotTa: 'இன்று இரவு 7:00',
      bio: 'Warm, reassuring companion for women experiencing changes in family life, motherhood, or unexpected feelings of isolation.',
      bioTa: 'குடும்ப மாற்றங்கள், தாய்மை மற்றும் தனிமை உணர்வுகளைக் கையாளும் பெண்களுக்கு ஆறுதலும் ஆதரவும் தரும் கவனிப்பாளர்.',
      verified: true
    }
  ];

  const defaultNotifications = [
    {
      id: 'notif-1',
      type: 'security',
      titleEn: '2-Way Phone Number Masking Active',
      titleTa: 'இருவழி தொலைபேசி எண் மறைப்பு செயலில் உள்ளது',
      bodyEn: 'Your personal mobile number is strictly hidden on all Listener, Counsellor, and Live Singer calls via Exotel Virtual Bridge.',
      bodyTa: 'கவனிப்பாளர், ஆலோசகர் மற்றும் பாடகர் அழைப்புகளில் உங்கள் மொபைல் எண் 100% மறைக்கப்பட்டுப் பாதுகாக்கப்படுகிறது.',
      time: 'Just now',
      read: false
    },
    {
      id: 'notif-2',
      type: 'entitlement',
      titleEn: 'Complimentary 30-Min Listener Session (₹0)',
      titleTa: 'இலவச 30-நிமிட கவனிப்பாளர் அமர்வு (₹0)',
      bodyEn: 'First-time members enjoy a 3-Month Free Trial (₹0) plus 1 complimentary 30-minute Trained Listener session valid for 7 days.',
      bodyTa: 'புதிய உறுப்பினர்களுக்கு 3 மாத இலவச சோதனை (₹0) மற்றும் 7 நாட்களுக்குச் செல்லுபடியாகும் 1 இலவச 30-நிமிட கவனிப்பாளர் அமர்வு வழங்கப்படுகிறது.',
      time: 'Today',
      read: false
    }
  ];

  class HerSpaceStore {
    constructor() {
      let savedLang = 'en';
      try {
        savedLang = localStorage.getItem('herspace_lang') || 'en';
      } catch (e) {}

      this.state = {
        lang: savedLang,
        user: null,
        entitlement: null,
        onboarding: {
          step: 'register',      // 'register' | 'tour' | 'membership' | 'book'
          tourSeen: false,
          tourSkipped: false,
          completed: false,
          completedAt: null,
          tourReplay: false
        },
        experts: defaultExperts,
        activeCategory: 'all',
        activeRoleFilter: 'all', // 'all', 'listener', 'counsellor', 'singer'
        selectedExpert: null,
        selectedSlot: null,
        appointments: [],
        toasts: [],
        notifications: defaultNotifications,
        wellbeing: {
          activeSubTab: 'browse', // 'browse' | 'cycle' | 'saved' | 'ask' | 'safety'
          activeCategory: 'all',
          searchQuery: '',
          selectedArticleId: null,
          savedIds: [],
          privateSearchMode: true,
          searchHistory: [],
          privateRequests: []
        },
        cycle: {
          optInConsent: false,
          logs: [],
          remindersEnabled: false,
          lockScreenPrivacy: true
        },
        calm: {
          activeCategory: 'all',
          favourites: ['calm_01_tamil_breath', 'calm_03_veena_dawn']
        }
      };
      this.subscribers = new Set();
      this.initFromStorage();
    }

    initFromStorage() {
      try {
        const savedUser = localStorage.getItem('herspace_user');
        if (savedUser) this.state.user = JSON.parse(savedUser);

        const savedEntitlement = localStorage.getItem('herspace_entitlement');
        if (savedEntitlement) this.state.entitlement = JSON.parse(savedEntitlement);

        const savedCycle = localStorage.getItem('herspace_cycle');
        if (savedCycle) {
          this.state.cycle = Object.assign({}, this.state.cycle, JSON.parse(savedCycle));
        }

        const savedWb = localStorage.getItem('herspace_wellbeing_saved');
        if (savedWb) {
          this.state.wellbeing.savedIds = JSON.parse(savedWb);
        }

        const savedAppointments = localStorage.getItem('herspace_appointments');
        if (savedAppointments) {
          this.state.appointments = JSON.parse(savedAppointments);
        } else {
          // No demo appointment is seeded: a new member must start with a genuinely empty schedule.
          this.state.appointments = [];
        }

        const savedOnboarding = localStorage.getItem('herspace_onboarding');
        if (savedOnboarding) {
          this.state.onboarding = Object.assign({}, this.state.onboarding, JSON.parse(savedOnboarding));
        }
      } catch (e) {
        console.warn('Storage init failed:', e);
      }
    }

    persist() {
      try {
        if (this.state.user) localStorage.setItem('herspace_user', JSON.stringify(this.state.user));
        else localStorage.removeItem('herspace_user');

        if (this.state.entitlement) localStorage.setItem('herspace_entitlement', JSON.stringify(this.state.entitlement));
        else localStorage.removeItem('herspace_entitlement');

        localStorage.setItem('herspace_onboarding', JSON.stringify(this.state.onboarding));
        localStorage.setItem('herspace_cycle', JSON.stringify(this.state.cycle));
        localStorage.setItem('herspace_wellbeing_saved', JSON.stringify(this.state.wellbeing.savedIds));
        localStorage.setItem('herspace_appointments', JSON.stringify(this.state.appointments));
        localStorage.setItem('herspace_lang', this.state.lang);
      } catch (e) {
        console.warn('Persist failed:', e);
      }
    }

    subscribe(callback) {
      this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
    }

    notify(meta) {
      this.persist();
      for (const cb of this.subscribers) {
        try { cb(this.state, meta); } catch (e) { console.error('Store notify error:', e); }
      }
    }

    setLanguage(lang) {
      if (lang === 'en' || lang === 'ta') {
        this.state.lang = lang;
        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.lang = lang;
        }
        this.notify();
      }
    }

    setUser(user) {
      this.state.user = user;
      this.notify();
    }

    setEntitlement(entitlement) {
      this.state.entitlement = entitlement;
      this.notify();
    }

    setOnboarding(patch) {
      this.state.onboarding = Object.assign({}, this.state.onboarding, patch);
      this.notify();
    }

    // Clears per-member data from memory/storage on sign-out (the registry keeps the member's record).
    resetMemberSession() {
      this.state.user = null;
      this.state.entitlement = null;
      this.state.appointments = [];
      this.state.onboarding = { step: 'register', tourSeen: false, tourSkipped: false, completed: false, completedAt: null, tourReplay: false };
      this.state.cycle = { optInConsent: false, logs: [], remindersEnabled: false, lockScreenPrivacy: true };
      this.state.wellbeing.savedIds = [];
      this.notify();
    }

    addAppointment(apt) {
      this.state.appointments.unshift(apt);
      this.notify();
    }

    updateAppointment(id, updates) {
      this.state.appointments = this.state.appointments.map(a => a.id === id ? { ...a, ...updates } : a);
      this.notify();
    }

    // Wellbeing State Actions
    toggleSavedArticle(articleId) {
      const list = this.state.wellbeing.savedIds || [];
      const idx = list.indexOf(articleId);
      if (idx === -1) {
        list.push(articleId);
      } else {
        list.splice(idx, 1);
      }
      this.state.wellbeing.savedIds = list;
      this.notify();
    }

    submitPrivateQuestion(category, questionText) {
      const req = {
        id: 'pq_' + Date.now(),
        category: category,
        question: questionText,
        submittedAt: new Date().toISOString(),
        status: 'Queued for Editorial & Clinical Review'
      };
      this.state.wellbeing.privateRequests.unshift(req);
      this.notify();
      return req;
    }

    // Cycle Tracker State Actions
    setCycleConsent(consented, loadDemo) {
      this.state.cycle.optInConsent = Boolean(consented);
      if (consented && loadDemo && window.HerSpaceCycleEngine) {
        this.state.cycle.logs = window.HerSpaceCycleEngine.getDemoLogs();
      }
      this.notify();
    }

    addCycleLog(entry) {
      if (!this.state.cycle.optInConsent) {
        this.state.cycle.optInConsent = true;
      }
      const newEntry = Object.assign({
        id: 'cyc_' + Date.now(),
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        flow: 'medium',
        symptoms: [],
        mood: 'Calm',
        notes: ''
      }, entry);
      this.state.cycle.logs.unshift(newEntry);
      this.notify();
      return newEntry;
    }

    deleteCycleLog(id) {
      this.state.cycle.logs = this.state.cycle.logs.filter(item => item.id !== id);
      this.notify();
    }

    wipeAllCycleData() {
      this.state.cycle = {
        optInConsent: false,
        logs: [],
        remindersEnabled: false,
        lockScreenPrivacy: true
      };
      try { localStorage.removeItem('herspace_cycle'); } catch (e) {}
      this.notify();
    }

    toast(message, type = 'success') {
      const id = Date.now() + Math.random();
      const toastItem = { id, message, type };
      this.state.toasts.push(toastItem);
      // Toasts must not re-render the whole app (that would wipe forms the member is typing in).
      this.notify({ toastOnly: true });
      setTimeout(() => {
        this.state.toasts = this.state.toasts.filter(t => t.id !== id);
        this.notify({ toastOnly: true });
      }, 4000);
    }
  }

  window.herSpaceStore = new HerSpaceStore();
  window.HerSpaceStore = window.herSpaceStore;
})();
