import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

// One MoCA session result — stored after every completed mini-game
export interface MoCASession {
  gameId: string;
  domain: MoCADomain;
  score: number;        // 0–100
  correctCount: number;
  totalCount: number;
  playedAt: Date;
}

// The six MoCA cognitive domains we're tracking
export type MoCADomain =
  | 'memory'
  | 'attention'
  | 'language'
  | 'executive'
  | 'visuospatial'
  | 'orientation';

// Domain display info — Cantonese label + colour
export const MOCA_DOMAIN_INFO: Record<
  MoCADomain,
  { labelCantonese: string; labelEnglish: string; emoji: string; color: string }
> = {
  memory: {
    labelCantonese: '記憶力',
    labelEnglish: 'Memory',
    emoji: '🧠',
    color: '#6BAF6B',
  },
  attention: {
    labelCantonese: '專注力',
    labelEnglish: 'Attention',
    emoji: '🎯',
    color: '#7A9CC4',
  },
  language: {
    labelCantonese: '語言能力',
    labelEnglish: 'Language',
    emoji: '💬',
    color: '#E8A838',
  },
  executive: {
    labelCantonese: '執行能力',
    labelEnglish: 'Executive',
    emoji: '⚙️',
    color: '#C47A3A',
  },
  visuospatial: {
    labelCantonese: '視空間',
    labelEnglish: 'Visuospatial',
    emoji: '👁️',
    color: '#9B6BB5',
  },
  orientation: {
    labelCantonese: '定向能力',
    labelEnglish: 'Orientation',
    emoji: '🧭',
    color: '#D94F3D',
  },
};

// Full player state shape
export interface PlayerState {
  // Profile
  name: string;
  avatar: string;
  level: number;
  coins: number;

  // MoCA history — all past sessions, newest first
  mocaHistory: MoCASession[];

  // ── Actions ──────────────────────────────────────────────────────────────

  // Add coins after completing a game
  addCoins: (amount: number) => void;

  // Record a completed MoCA game session
  recordMoCASession: (session: Omit<MoCASession, 'playedAt'>) => void;

  // Get the last session for a specific domain (for comparison on reward screen)
  getLastDomainSession: (domain: MoCADomain) => MoCASession | null;

  // Get the last TWO sessions for a domain (current + previous for trend)
  getDomainTrend: (domain: MoCADomain) => {
    current: MoCASession | null;
    previous: MoCASession | null;
  };

  // Get overall MoCA score across all domains (average of latest per domain)
  getOverallMoCAScore: () => number | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────

  name: '陳伯',
  avatar: '👴',
  level: 3,
  coins: 128,
  mocaHistory: [
    // Seed one past memory session so the reward screen
    // can immediately show a "vs last time" comparison
    {
      gameId: 'market-memory',
      domain: 'memory',
      score: 60,
      correctCount: 3,
      totalCount: 5,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
    },
  ],

  // ── Actions ───────────────────────────────────────────────────────────────

  addCoins: (amount) => {
    set((state) => ({
      coins: state.coins + amount,
      // Level up every 200 coins — simple progression for demo
      level: Math.floor((state.coins + amount) / 200) + 1,
    }));
  },

  recordMoCASession: (session) => {
    const full: MoCASession = {
      ...session,
      playedAt: new Date(),
    };
    set((state) => ({
      // Newest first
      mocaHistory: [full, ...state.mocaHistory],
    }));
  },

  getLastDomainSession: (domain) => {
    const { mocaHistory } = get();
    return mocaHistory.find((s) => s.domain === domain) ?? null;
  },

  getDomainTrend: (domain) => {
    const { mocaHistory } = get();
    const sessions = mocaHistory.filter((s) => s.domain === domain);
    return {
      current: sessions[0] ?? null,
      previous: sessions[1] ?? null,
    };
  },

  getOverallMoCAScore: () => {
    const { mocaHistory } = get();
    const domains: MoCADomain[] = [
      'memory',
      'attention',
      'language',
      'executive',
      'visuospatial',
      'orientation',
    ];
    const latestPerDomain = domains
      .map((d) => mocaHistory.find((s) => s.domain === d))
      .filter((s): s is MoCASession => s !== null);

    if (latestPerDomain.length === 0) return null;

    const avg =
      latestPerDomain.reduce((sum, s) => sum + s.score, 0) /
      latestPerDomain.length;

    return Math.round(avg);
  },
}));