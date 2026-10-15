import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MoCASession {
  gameId: string;
  domain: MoCADomain;
  score: number;
  correctCount: number;
  totalCount: number;
  playedAt: number;     // ← changed from Date to number (timestamp)
}

export type MoCADomain =
  | 'memory'
  | 'attention'
  | 'language'
  | 'executive'
  | 'visuospatial'
  | 'orientation';

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

export interface PlayerState {
  // Profile
  name: string;
  avatar: string;
  level: number;
  coins: number;

  // MoCA history — newest first
  mocaHistory: MoCASession[];

  // ── Actions ──────────────────────────────────────────────────────────────
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  addCoins: (amount: number) => void;
  recordMoCASession: (session: Omit<MoCASession, 'playedAt'>) => void;
  getLastDomainSession: (domain: MoCADomain) => MoCASession | null;
  getDomainTrend: (domain: MoCADomain) => {
    current: MoCASession | null;
    previous: MoCASession | null;
  };
  getOverallMoCAScore: () => number | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────────────────

      name: '陳伯',
      avatar: '👴',
      level: 3,
      coins: 128,
      mocaHistory: [
        {
          gameId: 'market-memory',
          domain: 'memory',
          score: 60,
          correctCount: 3,
          totalCount: 5,
          playedAt: Date.now() - 1000 * 60 * 60 * 24, // ← timestamp now
        },
      ],

      // ── Actions ──────────────────────────────────────────────────────────

      setName: (name) => set({ name }),
      setAvatar: (avatar) => set({ avatar }),

      addCoins: (amount) => {
        set((state) => ({
          coins: state.coins + amount,
          level: Math.floor((state.coins + amount) / 200) + 1,
        }));
      },

      recordMoCASession: (session) => {
        const full: MoCASession = {
          ...session,
          playedAt: Date.now(), // ← timestamp now
        };
        set((state) => ({
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
    }),
    {
      name: 'player-storage',           // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist data fields, not functions
      partialize: (state) => ({
        name: state.name,
        avatar: state.avatar,
        level: state.level,
        coins: state.coins,
        mocaHistory: state.mocaHistory,
      }),
    }
  )
);