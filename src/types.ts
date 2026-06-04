export interface UserProfile {
  userId: string;
  displayName: string;
  photoURL: string | null;
  isPremium: boolean;
  streakCounter: number;
  lastScanDate: string | null;
  totalScans: number;
  badges: string[];
}

export interface AestheticMetrics {
  shape: number; // 0-100
  toeType: string;
  proportions: number; // 0-100
  arch: number; // 0-100
  symmetry: number; // 0-100
  lineClarity: number; // 0-100
  beautyIndex: number; // 0-100
}

export interface HealthMetrics {
  pronation: number; // 0-100
  plantarArch: number; // 0-100
  halluxValgus: number; // 0-100
  sizeMm: number;
}

export interface ScanRecord {
  scanId: string;
  userId: string;
  timestamp: number;
  imageUrl: string;
  footScore: number;
  aestheticMetrics: AestheticMetrics;
  healthMetrics: HealthMetrics;
  shareableCardUrl?: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string | null;
  currentFootScore: number;
  rankTitle: string;
}
