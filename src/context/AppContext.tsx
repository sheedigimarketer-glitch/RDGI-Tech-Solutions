import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  User,
  Entitlement,
  OnboardingState,
  Expert,
  LiveSinger,
  Appointment,
  CycleLog,
  ProApplication,
  Toast,
  NotificationItem,
  TelephonySession
} from '../types';
import { DEFAULT_EXPERTS } from '../data/experts';
import { LIVE_SINGERS } from '../data/singers';
import { TRANSLATIONS } from '../data/translations';
import { memberResetPath, memberSigninPath, supabase } from '../services/auth';
import { memberConfirmPath } from '../services/member';
import { useMemberSession } from './useMemberSession';
import { calmAudioEngine } from '../data/audioEngine';
import {
  generateSecureId,
  generateSecureParkCode,
  sanitizeInput
} from '../utils/security';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isTa: boolean;

  user: User | null;
  entitlement: Entitlement | null;
  onboarding: OnboardingState;
  activeRoute: string;
  navigate: (route: string) => void;

  signOut: (returnTo?: 'signin' | 'home') => Promise<void>;
  memberSession: ReturnType<typeof useMemberSession>;
  updateOnboardingStep: (step: 'register' | 'tour' | 'membership' | 'book', markComplete?: boolean) => void;

  experts: Expert[];
  singers: LiveSinger[];
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
  activeRoleFilter: string;
  setActiveRoleFilter: (role: string) => void;

  appointments: Appointment[];
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;

  cycle: {
    optInConsent: boolean;
    logs: CycleLog[];
    remindersEnabled: boolean;
  };
  enableCycleTracker: (loadDemo?: boolean) => void;
  addCycleLog: (log: Omit<CycleLog, 'id' | 'createdAt'>) => void;
  deleteCycleLog: (id: string) => void;
  wipeCycleData: () => void;
  toggleCycleReminders: (enabled: boolean) => void;

  savedArticleIds: string[];
  toggleSaveArticle: (articleId: string) => void;
  submitPrivateQuestion: (categoryId: string, question: string) => void;

  calmState: {
    activeTrackId: string;
    isPlaying: boolean;
    sleepTimerMinutes: number;
    favourites: string[];
  };
  playCalmTrack: (trackId?: string) => void;
  pauseCalmTrack: () => void;
  setSleepTimer: (minutes: number) => void;
  toggleCalmFavourite: (trackId: string) => void;

  telephonySession: TelephonySession | null;
  startMaskedCall: (partnerId: string, partnerName?: string, partnerRole?: string) => void;
  holdCall: () => void;
  resumeCall: () => void;
  parkCall: () => void;
  retrieveCall: (code: string) => void;
  transferCall: () => void;
  reconnectCall: () => void;
  endCall: () => void;

  proApplications: ProApplication[];
  submitProApplication: (data: Omit<ProApplication, 'id' | 'status' | 'submittedAt'>) => void;
  updateProApplicationStatus: (id: string, status: 'approved' | 'rejected') => void;

  notifications: NotificationItem[];

  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  bookingModalExpert: Expert | LiveSinger | null;
  setBookingModalExpert: (e: Expert | LiveSinger | null) => void;
  profileModalExpert: Expert | null;
  setProfileModalExpert: (e: Expert | null) => void;
  isCrisisModalOpen: boolean;
  setIsCrisisModalOpen: (open: boolean) => void;
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  policyModalType: 'privacy' | 'terms' | 'cancellation' | null;
  openPolicyModal: (type: 'privacy' | 'terms' | 'cancellation') => void;
  closePolicyModal: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (val: boolean) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
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
    bodyEn: 'First-time members enjoy a 7-Day Free Trial (₹0) followed by ₹149 for the first 60 days validity, plus 1 complimentary 30-minute Trained Listener session valid for 7 days.',
    bodyTa: 'புதிய உறுப்பினர்களுக்கு 7 நாள் இலவச சோதனை (₹0) மற்றும் 7 நாட்களுக்குச் செல்லுபடியாகும் 1 இலவச 30-நிமிட கவனிப்பாளர் அமர்வு வழங்கப்படுகிறது.',
    time: 'Today',
    read: false
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('herspace_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const isTa = lang === 'ta';

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    try {
      localStorage.setItem('herspace_lang', nextLang);
    } catch {}
    document.documentElement.lang = nextLang;
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    addToast(next === 'ta' ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது' : 'Language switched to English', 'info');
  };

  const memberSession = useMemberSession();
  const user = memberSession.member?.user || null;
  const entitlement = memberSession.member?.entitlement || null;
  const [progress, setProgress] = useState<OnboardingState>({
    step: 'register', tourSeen: false, tourSkipped: false,
    completed: false, completedAt: null, tourReplay: false
  });
  const [localCompletion, setLocalCompletion] = useState<{ id: string; date: string } | null>(null);
  let completedAt = memberSession.member?.completedAt || null;
  if (user && !completedAt) {
    try {
      completedAt = localCompletion?.id === user.id ? localCompletion.date :
        localStorage.getItem('herspace_onboarding_completed:' + user.id);
    } catch {}
  }
  const onboarding = { ...progress, completed: Boolean(completedAt), completedAt };
  const [requestedRoute, setActiveRoute] = useState(() => {
    if (window.location.pathname === memberResetPath) return 'member-reset';
    if (window.location.pathname === memberConfirmPath) return 'member-confirm';
    if (window.location.pathname === memberSigninPath) return 'signin';
    if (window.location.pathname === '/dashboard') return 'dashboard';
    if (window.location.pathname === '/space') return 'space';
    if (window.location.pathname === '/cycle') return 'cycle';
    return 'home';
  });
  const protectedRoutes = ['cycle', 'space', 'dashboard', 'onb-tour', 'onb-membership', 'onb-book'];
  const accountEntry = ['signin', 'onb-register', 'member-confirm'].includes(requestedRoute);
  let activeRoute = requestedRoute;
  if ((accountEntry || protectedRoutes.includes(requestedRoute)) && memberSession.loading) {
    activeRoute = 'member-loading';
  } else if ((accountEntry || protectedRoutes.includes(requestedRoute)) && memberSession.error) {
    activeRoute = 'member-error';
  } else if (user && (accountEntry || (requestedRoute === 'space' && !onboarding.completed))) {
    activeRoute = onboarding.completed ? 'space' : 'onb-tour';
  } else if (!user && (accountEntry || protectedRoutes.includes(requestedRoute))) {
    if (memberSession.accountId) activeRoute = 'member-profile';
    else if (protectedRoutes.includes(requestedRoute)) activeRoute = 'signin';
  }

  const [experts, setExperts] = useState<Expert[]>(DEFAULT_EXPERTS);
  const [singers, setSingers] = useState<LiveSinger[]>(LIVE_SINGERS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [cycle, setCycle] = useState<{
    optInConsent: boolean;
    logs: CycleLog[];
    remindersEnabled: boolean;
  }>({ optInConsent: false, logs: [], remindersEnabled: false });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('herspace_wellbeing_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [proApplications, setProApplications] = useState<ProApplication[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [bookingModalExpert, setBookingModalExpertState] = useState<Expert | LiveSinger | null>(null);
  const [profileModalExpert, setProfileModalExpert] = useState<Expert | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const isProModalOpen = false;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  // System Maintenance Mode
  const [isMaintenanceMode, setIsMaintenanceModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('herspace_maintenance_mode') === 'true';
    } catch {
      return false;
    }
  });

  const setIsMaintenanceMode = (val: boolean) => {
    setIsMaintenanceModeState(val);
    try {
      localStorage.setItem('herspace_maintenance_mode', String(val));
    } catch {}
    addToast(
      val ? 'Emergency Maintenance Mode switched ON.' : 'Emergency Maintenance Mode switched OFF.',
      val ? 'warning' : 'success'
    );
  };

  // Calm Web Audio state
  const [calmState, setCalmState] = useState({
    activeTrackId: 'calm_01_tamil_breath',
    isPlaying: false,
    sleepTimerMinutes: 0,
    favourites: ['calm_01_tamil_breath', 'calm_03_veena_dawn']
  });

  // Telephony state
  const [telephonySession, setTelephonySession] = useState<TelephonySession | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('herspace_wellbeing_saved', JSON.stringify(savedArticleIds));
    } catch {}
  }, [savedArticleIds]);

  // Toast Helpers
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = generateSecureId('toast', 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const setBookingModalExpert = (expert: Expert | LiveSinger | null) => {
    if (expert && !user) {
      addToast(isTa ? 'முன்பதிவு தற்போது கிடைக்கவில்லை.' : 'Session booking is currently unavailable.', 'info');
      return;
    }
    setBookingModalExpertState(expert);
  };

  const setIsProModalOpen = (open: boolean) => {
    if (open) {
      addToast(isTa ? 'தொழில்முறை விண்ணப்பங்கள் தற்போது கிடைக்கவில்லை.' : 'Professional applications are currently unavailable.', 'info');
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    setAppointments([]);
    setCycle({ optInConsent: false, logs: [], remindersEnabled: false });
    setBookingModalExpertState(null);
    setTelephonySession(null);
  }, [user?.id]);

  const navigate = (route: string) => {
    if (route === 'admin') { window.location.assign('/admin/login'); return; }
    if (window.location.pathname === memberResetPath && route !== 'member-reset') return;
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signOut = async (returnTo: 'signin' | 'home' = 'home') => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
      if (window.location.pathname === memberResetPath) {
        window.location.replace(memberSigninPath);
        return;
      }
      if (window.location.pathname === memberConfirmPath) window.history.replaceState(null, '', '/');
      addToast(isTa ? 'கணக்கிலிருந்து வெளியேறிவிட்டீர்கள்.' : 'Signed out safely.', 'info');
      navigate(returnTo);
    } catch {
      addToast(isTa ? 'வெளியேற முடியவில்லை. மீண்டும் முயலுங்கள்.' : 'Sign-out failed. Please try again.', 'error');
    }
  };

  const updateOnboardingStep = (step: 'register' | 'tour' | 'membership' | 'book', markComplete = false) => {
    setProgress(previous => ({ ...previous, step }));
    if (!user || !markComplete) return;
    const date = new Date().toISOString();
    setLocalCompletion({ id: user.id, date });
    try { localStorage.setItem('herspace_onboarding_completed:' + user.id, date); } catch {}
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    let alreadyRescheduled = false;
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          if ((apt.rescheduleCount || 0) >= 1) {
            alreadyRescheduled = true;
            return apt;
          }
          return {
            ...apt,
            date: newDate,
            time: newTime,
            rescheduleCount: (apt.rescheduleCount || 0) + 1
          };
        }
        return apt;
      })
    );
    if (alreadyRescheduled) {
      addToast(
        isTa ? 'ஒரு முறை மட்டுமே மாற்ற முடியும் (Only one reschedule allowed).' : 'Policy notice: Only one reschedule allowed for this booking.',
        'error'
      );
    } else {
      addToast(
        isTa ? 'அமர்வு நேரம் மாற்றப்பட்டது (ஒரு முறை மட்டுமே அனுமதி).' : 'Appointment rescheduled. Note: Only one reschedule allowed.',
        'success'
      );
    }
  };

  // Cycle Operations
  const enableCycleTracker = (loadDemo: boolean = false) => {
    const demoLogs: CycleLog[] = loadDemo
      ? [
          {
            id: 'cyc-1',
            startDate: '2026-10-01',
            endDate: '2026-10-05',
            flow: 'Medium',
            symptoms: ['Mild cramps', 'Backache'],
            mood: 'Calm',
            notes: 'Drank warm ginger tea, felt better by day 3.',
            createdAt: new Date().toISOString()
          },
          {
            id: 'cyc-2',
            startDate: '2026-09-03',
            endDate: '2026-09-07',
            flow: 'Heavy',
            symptoms: ['Headache', 'Fatigue'],
            mood: 'Tired',
            notes: 'Took adequate rest and iron-rich lentils.',
            createdAt: new Date().toISOString()
          }
        ]
      : [];

    setCycle({
      optInConsent: true,
      logs: demoLogs,
      remindersEnabled: true
    });
    addToast(
      loadDemo
        ? (isTa ? 'மாதிரி மாதவிடாய் தகவல்கள் ஏற்றப்பட்டன.' : 'Demonstration cycle entries loaded.')
        : (isTa ? 'My Cycle பாதுகாப்பாக இயக்கப்பட்டது.' : 'My Cycle enabled privately.'),
      'success'
    );
  };

  const addCycleLog = (log: Omit<CycleLog, 'id' | 'createdAt'>) => {
    const newLog: CycleLog = {
      id: generateSecureId('cyc', 8),
      ...log,
      notes: sanitizeInput(log.notes || '', 500),
      createdAt: new Date().toISOString()
    };
    setCycle(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs]
    }));
    addToast(isTa ? 'குறிப்பு சாதனத்தில் பாதுகாப்பாகச் சேமிக்கப்பட்டது.' : 'Cycle log saved securely on your device.');
  };

  const deleteCycleLog = (id: string) => {
    setCycle(prev => ({
      ...prev,
      logs: prev.logs.filter(l => l.id !== id)
    }));
    addToast(isTa ? 'பதிவு நீக்கப்பட்டது.' : 'Entry deleted.');
  };

  const wipeCycleData = () => {
    setCycle({
      optInConsent: false,
      logs: [],
      remindersEnabled: false
    });
    addToast(isTa ? 'அனைத்து தகவல்களும் நிரந்தரமாக அழிக்கப்பட்டன.' : 'All cycle data permanently wiped.');
  };

  const toggleCycleReminders = (enabled: boolean) => {
    setCycle(prev => ({ ...prev, remindersEnabled: enabled }));
    addToast(
      enabled
        ? (isTa ? 'மறைமுக நினைவூட்டல் இயக்கப்பட்டது.' : 'Discreet lock-screen redacted reminders enabled.')
        : (isTa ? 'நினைவூட்டல் முடக்கப்பட்டது.' : 'Cycle reminders disabled.')
    );
  };

  // Wellbeing Articles Bookmarks
  const toggleSaveArticle = (articleId: string) => {
    setSavedArticleIds(prev => {
      const exists = prev.includes(articleId);
      const next = exists ? prev.filter(id => id !== articleId) : [...prev, articleId];
      addToast(
        exists
          ? (isTa ? 'கட்டுரை நீக்கப்பட்டது.' : 'Article removed from saved.')
          : (isTa ? 'கட்டுரை சேமிக்கப்பட்டது.' : 'Article bookmarked in your Personal Space.')
      );
      return next;
    });
  };

  const submitPrivateQuestion = (_categoryId: string, question: string) => {
    const clean = sanitizeInput(question || '', 800);
    if (!clean) return;
    addToast(
      isTa
        ? 'உங்கள் கேள்வி ரகசியமாகப் பெறப்பட்டது. விரைவில் பதிலளிக்கப்படும்.'
        : 'Your question was submitted privately. Our team will review it.',
      'success'
    );
  };

  // Calm Audio
  const playCalmTrack = (trackId?: string) => {
    const id = trackId || calmState.activeTrackId;
    calmAudioEngine.play(id);
    setCalmState(prev => ({
      ...prev,
      activeTrackId: id,
      isPlaying: true
    }));
  };

  const pauseCalmTrack = () => {
    calmAudioEngine.stop();
    setCalmState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const setSleepTimer = (minutes: number) => {
    setCalmState(prev => ({ ...prev, sleepTimerMinutes: minutes }));
    if (minutes > 0) {
      setTimeout(() => {
        pauseCalmTrack();
        addToast(isTa ? 'ஸ்லீப் டைமர் முடிந்தது.' : 'Sleep timer ended playback.', 'info');
      }, minutes * 60 * 1000);
      addToast(isTa ? `${minutes} நிமிட ஸ்லீப் டைமர் அமைக்கப்பட்டது.` : `Sleep timer set for ${minutes} minutes.`);
    }
  };

  const toggleCalmFavourite = (trackId: string) => {
    setCalmState(prev => {
      const isFav = prev.favourites.includes(trackId);
      return {
        ...prev,
        favourites: isFav ? prev.favourites.filter(id => id !== trackId) : [...prev.favourites, trackId]
      };
    });
  };

  // Telephony Engine
  const startMaskedCall = () => {
    addToast(isTa ? 'மறைக்கப்பட்ட அழைப்புகள் தற்போது கிடைக்கவில்லை.' : 'Masked calling is currently unavailable.', 'info');
  };

  const holdCall = () => {
    if (telephonySession) {
      setTelephonySession({ ...telephonySession, state: 'on_hold' });
      addToast(isTa ? 'அழைப்பு நிறுத்தி வைக்கப்பட்டது.' : 'Call put on hold.', 'info');
    }
  };

  const resumeCall = () => {
    if (telephonySession) {
      setTelephonySession({ ...telephonySession, state: 'connected' });
      addToast(isTa ? 'அழைப்பு தொடர்கிறது.' : 'Call resumed.', 'info');
    }
  };

  const parkCall = () => {
    if (telephonySession) {
      const code = generateSecureParkCode();
      setTelephonySession({ ...telephonySession, state: 'parked', parkCode: code });
      addToast(isTa ? `அழைப்பு பாதுகாப்பாக நிறுத்தப்பட்டது. ஸ்லாட்: ${code}` : `Call parked in secure slot ${code}.`, 'info');
    }
  };

  const retrieveCall = (_code: string) => {
    if (telephonySession) {
      setTelephonySession({ ...telephonySession, state: 'connected', parkCode: undefined });
      addToast(isTa ? 'அழைப்பு மீட்டெடுக்கப்பட்டது.' : 'Parked call retrieved.', 'success');
    }
  };

  const transferCall = () => {
    if (telephonySession) {
      setTelephonySession({
        ...telephonySession,
        partnerName: 'Dr. Anita Sundaram',
        partnerRole: 'counsellor',
        state: 'transferred'
      });
      addToast(isTa ? 'அழைப்பு ஆலோசகருக்கு மாற்றப்பட்டது.' : 'Call transferred to Professional Counsellor.', 'success');
      setTimeout(() => {
        if (telephonySession) {
          setTelephonySession(prev => (prev ? { ...prev, state: 'connected' } : null));
        }
      }, 1200);
    }
  };

  const reconnectCall = () => {
    if (telephonySession) {
      setTelephonySession({ ...telephonySession, state: 'ringing' });
      setTimeout(() => {
        setTelephonySession(prev => (prev ? { ...prev, state: 'connected' } : null));
        addToast(isTa ? 'அழைப்பு மீண்டும் வெற்றிகரமாக இணைக்கப்பட்டது.' : 'Call reconnected successfully.', 'success');
      }, 1500);
    }
  };

  const endCall = () => {
    setTelephonySession(null);
    addToast(isTa ? 'அழைப்பு முடிவடைந்தது.' : 'Call ended safely.');
  };

  // Professional Applications
  const submitProApplication = (data: Omit<ProApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: ProApplication = {
      id: generateSecureId('app', 8),
      name: sanitizeInput(data.name, 100),
      email: sanitizeInput(data.email, 100),
      phone: sanitizeInput(data.phone, 20),
      role: data.role,
      qualification: sanitizeInput(data.qualification, 200),
      rciNumber: data.rciNumber ? sanitizeInput(data.rciNumber, 50) : null,
      experienceYears: Number(data.experienceYears) || 0,
      specialties: (data.specialties || []).map(s => sanitizeInput(s, 50)),
      bio: sanitizeInput(data.bio, 500),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setProApplications(prev => [newApp, ...prev]);
    setIsProModalOpen(false);
    addToast(
      isTa
        ? 'விண்ணப்பம் பெறப்பட்டது. எங்கள் குழு விரைவில் சரிபார்க்கும்.'
        : 'Application submitted for panel verification.',
      'success'
    );
  };

  const updateProApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    let targetApp: ProApplication | undefined;
    setProApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          targetApp = { ...app, status };
          return targetApp;
        }
        return app;
      });
      return updated;
    });

    if (status === 'approved' && targetApp) {
      const appData = targetApp as ProApplication;
      if (appData.role === 'singer') {
        const newSinger: LiveSinger = {
          id: 'singer-' + appData.id,
          name: appData.name,
          nameTa: appData.name,
          role: 'singer',
          roleLabelEn: 'Live Musician & Vocalist',
          roleLabelTa: 'நேரலை பாடகர்',
          stylesEn: ['Classical Carnatic', 'Soothing Melodies', 'Devotional & Healing'],
          stylesTa: ['கர்நாடக சங்கீதம்', 'மெல்லிசை', 'பக்தி & அமைதி'],
          languages: ['Tamil', 'Sanskrit', 'English'],
          experienceYears: appData.experienceYears,
          rating: 5.0,
          sessionsCompleted: 1,
          qualification: appData.qualification,
          qualificationTa: appData.qualification,
          priceStatus: 'from_199',
          demoFeeINR: 199,
          nextAvailable: 'Tonight at 8:00 PM',
          nextAvailableTa: 'இன்று இரவு 8:00',
          avatarColor: '#5E2750',
          verified: true,
          bioEn: appData.bio || 'Vocalist trained in acoustic therapeutic ragas for emotional equilibrium.',
          bioTa: 'மன அமைதிக்கான சிகிச்சை ராகங்களில் பயிற்சி பெற்ற பாடகர்.'
        };
        setSingers(prev => [newSinger, ...prev]);
      } else {
        const isCounsellor = appData.role === 'counsellor';
        const newExpert: Expert = {
          id: 'exp-' + appData.id,
          name: appData.name,
          nameTa: appData.name,
          role: isCounsellor ? 'counsellor' : 'listener',
          qualification: appData.qualification + (appData.rciNumber ? ` (RCI: ${appData.rciNumber})` : ''),
          qualificationTa: appData.qualification + (appData.rciNumber ? ` (RCI: ${appData.rciNumber})` : ''),
          experienceYears: appData.experienceYears,
          pricePaise: isCounsellor ? 99900 : 39900,
          priceDisplay: isCounsellor ? 999 : 399,
          durationMinutes: isCounsellor ? 45 : 30,
          avatar: isCounsellor
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
          specialties: appData.specialties && appData.specialties.length > 0 ? appData.specialties : ['Emotional Wellbeing', 'Life Transitions'],
          specialtiesTa: ['மன அமைதி', 'வாழ்க்கை மாற்றம்'],
          languages: ['Tamil', 'English'],
          modes: ['call'],
          rating: 5.0,
          reviewsCount: 1,
          nextSlot: 'Today at 6:00 PM',
          nextSlotTa: 'இன்று மாலை 6:00',
          bio: appData.bio || 'Verified professional practitioner on HerSpace panel.',
          bioTa: 'சரிபார்க்கப்பட்ட சிறப்பு நிபுணர்.',
          verified: true
        };
        setExperts(prev => [newExpert, ...prev]);
      }
      addToast(
        `Staff Approved: ${appData.name} is now active in the public directory!`,
        'success'
      );
    } else {
      addToast('Application rejected.', 'info');
    }
  };

  // Policies Modal
  const openPolicyModal = (type: 'privacy' | 'terms' | 'cancellation') => {
    setPolicyModalType(type);
  };

  const closePolicyModal = () => {
    setPolicyModalType(null);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        isTa,

        user,
        entitlement,
        onboarding,
        activeRoute,
        navigate,

        signOut,
        memberSession,
        updateOnboardingStep,

        experts,
        singers,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activeRoleFilter,
        setActiveRoleFilter,

        appointments,
        rescheduleAppointment,

        cycle,
        enableCycleTracker,
        addCycleLog,
        deleteCycleLog,
        wipeCycleData,
        toggleCycleReminders,

        savedArticleIds,
        toggleSaveArticle,
        submitPrivateQuestion,

        calmState,
        playCalmTrack,
        pauseCalmTrack,
        setSleepTimer,
        toggleCalmFavourite,

        telephonySession,
        startMaskedCall,
        holdCall,
        resumeCall,
        parkCall,
        retrieveCall,
        transferCall,
        reconnectCall,
        endCall,

        proApplications,
        submitProApplication,
        updateProApplicationStatus,

        notifications,

        toasts,
        addToast,
        removeToast,

        bookingModalExpert,
        setBookingModalExpert,
        profileModalExpert,
        setProfileModalExpert,
        isCrisisModalOpen,
        setIsCrisisModalOpen,
        isProModalOpen,
        setIsProModalOpen,
        policyModalType,
        openPolicyModal,
        closePolicyModal,
        isDrawerOpen,
        setIsDrawerOpen,
        isMaintenanceMode,
        setIsMaintenanceMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
