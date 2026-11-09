export type Language = 'en' | 'ta';

export type UserRole = 'member' | 'listener' | 'counsellor' | 'singer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  username?: string;
  isAuthenticated?: boolean;
  phone: string;
  email: string;
  age: number | null;
  identity: 'woman' | 'trans_woman' | null;
  role: UserRole;
  createdAt: string;
}

export interface Entitlement {
  trialStartedAt: string;
  trialEndsAt: string;
  welcomeCallExpiresAt: string;
  welcomeCallStatus: 'available' | 'used' | 'expired';
  paidThrough: string | null;
  autoRenew: boolean;
  isReturning: boolean;
}

export type OnboardingStep = 'register' | 'tour' | 'membership' | 'book';

export interface OnboardingState {
  step: OnboardingStep;
  tourSeen: boolean;
  tourSkipped: boolean;
  completed: boolean;
  completedAt: string | null;
  tourReplay: boolean;
}

export interface Expert {
  id: string;
  name: string;
  nameTa: string;
  role: 'counsellor' | 'listener' | 'singer';
  qualification: string;
  qualificationTa: string;
  experienceYears: number;
  pricePaise: number;
  priceDisplay: number;
  durationMinutes: number;
  avatar: string;
  specialties: string[];
  specialtiesTa: string[];
  languages: string[];
  modes: string[];
  rating: number;
  reviewsCount: number;
  nextSlot: string;
  nextSlotTa: string;
  bio: string;
  bioTa: string;
  verified: boolean;
}

export interface SingerTier {
  id: string;
  name: string;
  nameTa?: string;
  durationMinutes: number;
  priceDisplay: number;
}

export interface LiveSinger {
  id: string;
  name: string;
  nameTa: string;
  role: 'singer';
  roleLabelEn: string;
  roleLabelTa: string;
  stylesEn: string[];
  stylesTa: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  sessionsCompleted: number;
  qualification: string;
  qualificationTa: string;
  priceStatus: string;
  demoFeeINR: number;
  tiers?: SingerTier[];
  nextAvailable: string;
  nextAvailableTa: string;
  avatarColor: string;
  verified: boolean;
  bioEn: string;
  bioTa: string;
}

export interface CalmTrack {
  id: string;
  category: 'meditation' | 'instrumental' | 'nature' | 'sleep';
  language: string;
  durationSeconds: number;
  durationLabel: string;
  baseFreq: number;
  soundProfile: string;
  licence: string;
  artwork: string;
  title: {
    en: string;
    ta: string;
  };
  artist: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
}

export interface WellbeingCategory {
  id: string;
  code: string;
  icon: string;
  color: string;
  en: string;
  ta: string;
  descEn: string;
  descTa: string;
}

export interface WellbeingArticle {
  id: string;
  categoryId: string;
  categoryCode: string;
  synonyms: string[];
  lastReviewedDate: string;
  editorialStage: string;
  reviewBadgeEn: string;
  reviewBadgeTa: string;
  sources: string[];
  relatedIds: string[];
  title: {
    en: string;
    ta: string;
  };
  shortAnswer: {
    en: string;
    ta: string;
  };
  explanation: {
    en: string;
    ta: string;
  };
  selfCare: {
    en: string[];
    ta: string[];
  };
  redFlags: {
    en: string[];
    ta: string[];
  };
  whenToSeekCare: {
    en: string;
    ta: string;
  };
}

export interface Appointment {
  id: string;
  expertId: string;
  expertName: string;
  expertRole: 'listener' | 'counsellor' | 'singer';
  expertAvatar: string;
  date: string;
  time: string;
  mode: string;
  priceDisplay: number;
  isComplimentary: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  bookingId: string;
  createdAt: string;
  rescheduleCount?: number;
  selectedTierTitle?: string;
}


export interface CycleLog {
  id: string;
  startDate: string;
  endDate: string;
  flow: 'Light' | 'Medium' | 'Heavy' | 'Spotting';
  symptoms: string[];
  mood: string;
  notes: string;
  createdAt: string;
}

export interface ProApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'counsellor' | 'listener' | 'singer';
  qualification: string;
  rciNumber: string | null;
  experienceYears: number;
  specialties: string[];
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface NotificationItem {
  id: string;
  type: 'security' | 'entitlement';
  titleEn: string;
  titleTa: string;
  bodyEn: string;
  bodyTa: string;
  time: string;
  read: boolean;
}

export interface TelephonySession {
  queueId: string;
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  state: 'ringing' | 'connected' | 'on_hold' | 'parked' | 'transferred' | 'ended';
  memberMaskedDisplay: string;
  partnerMaskedDisplay: string;
  parkCode?: string;
  startedAt: number;
}
