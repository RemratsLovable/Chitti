
export enum BrainWaveState {
  Awake = 'Awake',
  Relaxed = 'Relaxed', // Alpha
  Deep = 'Deep', // Theta
  Flow = 'Flow' // High Coherence
}

export interface SessionDataPoint {
  timestamp: number;
  alpha: number; // 0-100
  theta: number; // 0-100
  coherence: number; // 0-100
  hrv: number; // Heart Rate Variability (ms)
  motion: number; // Accelerometer magnitude (0-100, where 0 is still)
  integrity: number; // 0-100, Meditation Integrity Score
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  wallet: {
    ltc: number;
    doge: number;
  };
}

export interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  timeAgo: string;
  duration: number;
  avgTheta: number;
  earnedLtc: number;
  earnedDoge: number;
  kudos: number;
  comments: number;
  verified: boolean; // True if Integrity Score > 90
}

export interface AISessionInsight {
  summary: string;
  score: number;
  integrityScore: number;
  recommendation: string;
  verificationStatus: 'Verified' | 'Flagged' | 'Unverified';
}

export interface Charity {
  id: string;
  name: string;
  cause: string;
}

export interface DonationConfig {
  enabled: boolean;
  charityId: string;
  threshold: number; // DOGE amount
}

export interface CalendarEvent {
  id: string;
  title: string;
  instructor: string;
  time: string;
  date: string;
  attendees: number;
  type: 'Live' | 'Encore';
}

export type ViewState = 'dashboard' | 'session' | 'feed' | 'wallet' | 'profile';
