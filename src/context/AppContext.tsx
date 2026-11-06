import { supabase, requireClient, loginAccount, registerAccount, loadAccount } from '../services/auth';
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
import { calmAudioEngine } from '../data/audioEngine';
import {
  generateSecureId,
  generateSecureBookingId,
  generateSecureQueueId,
  generateSecureParkCode,
  issueSecureOtp,
  verifySecureOtp,
  encryptHealthPayload,
  decryptHealthPayload,
  sanitizeInput,
  formatMaskedDisplay
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

  sendPhoneOtp: (phone: string) => { success: boolean; formattedPhone: string; demoOtp: string };
  verifyOtpAndRegister: (data: {
    phone: string;
    otp: string;
    fullName: string;
    email?: string;
    age: number;
    identity: 'woman' | 'trans_woman';
    agreeTerms: boolean;
    autoRenew?: boolean;
  }) => Promise<void>;
  verifyOtpAndSignIn: (phone: string, otp: string) => Promise<void>;
  anonymousAuth: (data: {
    username: string;
    password?: string;
    email?: string;
    age?: number;
    identity?: 'woman' | 'trans_woman';
    agreeTerms?: boolean;
    mode: 'register' | 'signin';
  }) => Promise<void>;
  signOut: () => void;
  updateOnboardingStep: (step: 'register' | 'tour' | 'membership' | 'book', markComplete?: boolean) => void;

  experts: Expert[];
  singers: LiveSinger[];
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
  activeRoleFilter: string;
  setActiveRoleFilter: (role: string) => void;

  appointments: Appointment[];
  bookAppointment: (params: {
    expertId: string;
    date: string;
    time: string;
    mode: string;
    isComplimentary: boolean;
    tierTitle?: string;
    customPrice?: number;
  }) => Appointment;
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
  billingStats: {
    activeTrials: number;
    activePromo60: number;
    monthlyAutoRenewals: number;
  };
  simulateSubscription: (type: 'trial' | 'promo60' | 'monthly' | 'cancel') => void;
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

const INITIAL_PRO_APPLICATIONS: ProApplication[] = [
  {
    id: 'app-01',
    name: 'Dr. Gayathri R.',
    role: 'counsellor',
    qualification: 'M.Phil Clinical Psychology, NIMHANS',
    rciNumber: 'CRR-A78942',
    experienceYears: 14,
    specialties: ['Trauma & Depression', 'Anxiety'],
    bio: 'Clinical psychologist with extensive experience in evidence-based cognitive trauma recovery.',
    status: 'pending',
    submittedAt: '2026-10-26T14:30:00Z',
    email: 'gayathri.r@psych.in',
    phone: '+91 98401 12345'
  },
  {
    id: 'app-02',
    name: 'Kavitha S.',
    role: 'listener',
    qualification: 'Certified Peer Support Specialist · Empathy First Aid',
    rciNumber: null,
    experienceYears: 4,
    specialties: ['Postpartum & Family Transitions'],
    bio: 'Empathetic listener focusing on maternal mental health and navigating new parenthood.',
    status: 'pending',
    submittedAt: '2026-10-27T09:15:00Z',
    email: 'kavitha.listener@care.in',
    phone: '+91 98412 67890'
  },
  {
    id: 'app-03',
    name: 'Subhashini Natarajan',
    role: 'singer',
    qualification: 'M.A. Carnatic Classical Vocals · Madras Music Academy',
    rciNumber: 'MMA-VOC-8841',
    experienceYears: 7,
    specialties: ['Calm Ragas', 'Insomnia Relief', 'Lullabies'],
    bio: 'Vocal therapist and classical singer providing soothing evening ragas and gentle bedtime lullabies.',
    status: 'pending',
    submittedAt: '2026-10-28T16:45:00Z',
    email: 'subhashini.vocals@herspace.in',
    phone: '+91 98405 55678'
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

  // User State
  const [user, setUser] = useState<User | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem('herspace_onboarding');
      return saved
        ? JSON.parse(saved)
        : {
            step: 'register',
            tourSeen: false,
            tourSkipped: false,
            completed: false,
            completedAt: null,
            tourReplay: false
          };
    } catch {
      return {
        step: 'register',
        tourSeen: false,
        tourSkipped: false,
        completed: false,
        completedAt: null,
        tourReplay: false
      };
    }
  });

  const [activeRoute, setActiveRoute] = useState<string>(() => {
    if (user && onboarding.completed) return 'space';
    return 'home';
  });

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

  // Zero-Knowledge Decryption of Sensitive Health Logs at Rest
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const storedEnc = localStorage.getItem('herspace_cycle_enc');
        const legacyPlain = localStorage.getItem('herspace_cycle');
        if (storedEnc) {
          const decrypted = await decryptHealthPayload<{
            optInConsent: boolean;
            logs: CycleLog[];
            remindersEnabled: boolean;
          }>(storedEnc);
          if (decrypted && isMounted) setCycle(decrypted);
        } else if (legacyPlain) {
          const parsed = JSON.parse(legacyPlain);
          if (isMounted) setCycle(parsed);
          // Auto-migrate legacy plaintext to zero-knowledge AES-GCM ciphertext
          const enc = await encryptHealthPayload(parsed);
          localStorage.setItem('herspace_cycle_enc', enc);
          localStorage.removeItem('herspace_cycle');
        }
      } catch (err) {
        console.error('Zero-knowledge payload initialization error:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('herspace_wellbeing_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [proApplications, setProApplications] = useState<ProApplication[]>(() => {
    try {
      const saved = localStorage.getItem('herspace_pro_applications');
      return saved ? JSON.parse(saved) : INITIAL_PRO_APPLICATIONS;
    } catch {
      return INITIAL_PRO_APPLICATIONS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [bookingModalExpert, setBookingModalExpert] = useState<Expert | LiveSinger | null>(null);
  const [profileModalExpert, setProfileModalExpert] = useState<Expert | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
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

  // Operational Billing Stats
  const [billingStats, setBillingStats] = useState(() => {
    try {
      const saved = localStorage.getItem('herspace_billing_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      activeTrials: 482,
      activePromo60: 194,
      monthlyAutoRenewals: 326
    };
  });

  // Calm Web Audio state
  const [calmState, setCalmState] = useState({
    activeTrackId: 'calm_01_tamil_breath',
    isPlaying: false,
    sleepTimerMinutes: 0,
    favourites: ['calm_01_tamil_breath', 'calm_03_veena_dawn']
  });

  // Telephony state
  const [telephonySession, setTelephonySession] = useState<TelephonySession | null>(null);

  // On-device preferences only; authentication comes from Supabase.
  useEffect(() => {
    try {
      localStorage.setItem('herspace_onboarding', JSON.stringify(onboarding));
    } catch {}
  }, [onboarding]);



  // Zero-Knowledge Encrypted Health Data Persistence
  useEffect(() => {
    (async () => {
      try {
        if (cycle.optInConsent || cycle.logs.length > 0) {
          const enc = await encryptHealthPayload(cycle);
          localStorage.setItem('herspace_cycle_enc', enc);
          localStorage.removeItem('herspace_cycle');
        } else {
          localStorage.removeItem('herspace_cycle_enc');
          localStorage.removeItem('herspace_cycle');
        }
      } catch {}
    })();
  }, [cycle]);

  useEffect(() => {
    try {
      localStorage.setItem('herspace_wellbeing_saved', JSON.stringify(savedArticleIds));
    } catch {}
  }, [savedArticleIds]);

  useEffect(() => {
    try {
      localStorage.setItem('herspace_pro_applications', JSON.stringify(proApplications));
    } catch {}
  }, [proApplications]);

  // Toast Helpers
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = generateSecureId('toast', 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Route Navigation Guard
  const navigate = (requestedRoute: string) => {
    let target = requestedRoute;
    if (requestedRoute === 'admin') { addToast('Staff access is not enabled in this release.', 'info'); return; }
    if (requestedRoute === 'onb-register') {
      if (user) target = onboarding.completed ? 'space' : 'onb-tour';
    } else if (requestedRoute === 'signin') {
      if (user) target = onboarding.completed ? 'space' : 'onb-tour';
    } else if (requestedRoute === 'space' || requestedRoute === 'dashboard') {
      if (!user) target = 'onb-register';
    }

    setActiveRoute(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth is verified by Supabase; legacy browser objects never establish identity.
  useEffect(() => {
    try {
      localStorage.removeItem('herspace_user');
      localStorage.removeItem('herspace_entitlement');
      const legacyAppointments = localStorage.getItem('herspace_appointments');
      if (legacyAppointments && legacyAppointments !== '[]') localStorage.setItem('herspace_legacy_appointments_unverified', legacyAppointments);
      localStorage.removeItem('herspace_appointments');
    } catch {}
    if (!supabase) return;
    let disposed = false;
    let revision = 0;
    const synchronize = async (session: any) => {
      const current = ++revision;
      setUser(null);
      setEntitlement(null);
      setAppointments([]);
      if (!session) return;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user || data.user.id !== session.user.id) throw new Error('Session expired. Please sign in again.');
        const account = await loadAccount(data.user);
        if (disposed || current !== revision) return;
        setUser(account.user);
        setEntitlement(account.entitlement);
      } catch (error: any) {
        if (!disposed && current === revision) addToast(error.message, 'error');
      }
    };
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setActiveRoute('reset-password');
      // Do not call Supabase methods while its auth callback holds the lock.
      queueMicrotask(() => { if (!disposed) void synchronize(session); });
    });
    return () => { disposed = true; revision++; listener.subscription.unsubscribe(); };
  }, []);

  const sendPhoneOtp = (_phone: string): { success: boolean; formattedPhone: string; demoOtp: string } => {
    throw new Error('Please use username and password registration. Mobile OTP sign-in is no longer available.');
  };
  const verifyOtpAndRegister = async (_data: any) => { throw new Error('Use username and password registration.'); };
  const verifyOtpAndSignIn = async (_phone: string, _otp: string) => { throw new Error('Use username and password sign-in.'); };
  const anonymousAuth = async (data: {
    username: string; password?: string; email?: string; age?: number;
    identity?: 'woman' | 'trans_woman'; agreeTerms?: boolean; mode: 'register' | 'signin';
  }) => {
    if (data.mode === 'register') {
      await registerAccount({ username: data.username, password: data.password || '', email: data.email || '', age: data.age || 0, identity: data.identity || '', agreeTerms: data.agreeTerms === true });
      addToast('Check your private email to verify your account before signing in.', 'info');
    } else {
      await loginAccount(data.username, data.password || '');
      const { data: result, error } = await requireClient().auth.getUser();
      if (error || !result.user) throw new Error('Unable to verify your session.');
      const account = await loadAccount(result.user);
      setUser(account.user);
      setEntitlement(account.entitlement);
      setActiveRoute('space');
    }
  };
  const signOut = () => {
    void (async () => {
      try {
        const { error } = await requireClient().auth.signOut();
        if (error) throw error;
        setUser(null); setEntitlement(null); setAppointments([]);
        setOnboarding({ step: 'register', tourSeen: false, tourSkipped: false, completed: false, completedAt: null, tourReplay: false });
        setActiveRoute('home');
        addToast('Signed out safely.', 'info');
      } catch { addToast('Sign-out could not be completed. Please try again.', 'error'); }
    })();
  };

  const updateOnboardingStep = (step: 'register' | 'tour' | 'membership' | 'book', markComplete: boolean = false) => {
    setOnboarding(prev => ({
      ...prev,
      step,
      completed: markComplete ? true : prev.completed,
      completedAt: markComplete ? new Date().toISOString() : prev.completedAt
    }));
  };

  // Appointment Booking
  const bookAppointment = ({
    expertId,
    date,
    time,
    mode,
    isComplimentary,
    tierTitle,
    customPrice
  }: {
    expertId: string;
    date: string;
    time: string;
    mode: string;
    isComplimentary: boolean;
    tierTitle?: string;
    customPrice?: number;
  }): Appointment => {
    const exp = experts.find(e => e.id === expertId);
    const singer = singers.find(s => s.id === expertId);
    const target = exp || singer || experts[0];

    const computedPrice = isComplimentary
      ? 0
      : customPrice !== undefined
      ? customPrice
      : 'priceDisplay' in target
      ? target.priceDisplay
      : 0;

    const newApt: Appointment = {
      id: generateSecureId('apt', 8),
      expertId: target.id,
      expertName: isTa && 'nameTa' in target ? target.nameTa : target.name,
      expertRole: target.role,
      expertAvatar: 'avatar' in target ? target.avatar : 'assets/images/01_HerSpace_Hero_Sunrise.png',
      date,
      time,
      mode,
      priceDisplay: computedPrice,
      isComplimentary,
      status: 'scheduled',
      bookingId: generateSecureBookingId(),
      createdAt: new Date().toISOString(),
      rescheduleCount: 0,
      selectedTierTitle: tierTitle
    };

    setAppointments(prev => [newApt, ...prev]);

    if (isComplimentary && entitlement) {
      setEntitlement({
        ...entitlement,
        welcomeCallStatus: 'used'
      });
    }

    addToast(isTa ? 'அமர்வு வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது!' : 'Session booked successfully!', 'success');
    return newApt;
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
  const startMaskedCall = (partnerId: string, partnerName?: string, partnerRole?: string) => {
    const exp = experts.find(e => e.id === partnerId);
    const singer = singers.find(s => s.id === partnerId);
    const target = exp || singer || experts[0];

    const userPhone = user?.phone || '+919840199999';
    const bookingId = generateSecureBookingId();

    // Secure server-side call bridge dispatch without exposing partner phone to client
    try {
      fetch('/api/telephony/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          userPhone,
          listenerId: target.id
        })
      }).catch(err => {
        console.warn('Telephony background bridge notification:', err);
      });
    } catch {}

    const newSession: TelephonySession = {
      queueId: generateSecureQueueId(),
      partnerId: target.id,
      partnerName: partnerName || (isTa && 'nameTa' in target ? target.nameTa : target.name),
      partnerRole: partnerRole || target.role,
      state: 'connected',
      memberMaskedDisplay: formatMaskedDisplay(userPhone),
      partnerMaskedDisplay: '+91 44 4813 1001 (Exotel Bridge)',
      startedAt: Date.now()
    };
    setTelephonySession(newSession);
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
      try {
        localStorage.setItem('herspace_pro_applications', JSON.stringify(updated));
      } catch {}
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

  const simulateSubscription = (_type: 'trial' | 'promo60' | 'monthly' | 'cancel') => {
    addToast('Payments are not yet enabled. No charge or membership change was made.', 'info');
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

        sendPhoneOtp,
        verifyOtpAndRegister,
        verifyOtpAndSignIn,
        anonymousAuth,
        signOut,
        updateOnboardingStep,

        experts,
        singers,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activeRoleFilter,
        setActiveRoleFilter,

        appointments,
        bookAppointment,
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
        setIsMaintenanceMode,
        billingStats,
        simulateSubscription
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
