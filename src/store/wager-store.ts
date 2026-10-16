import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WagerAmount = 10 | 20 | 50;

export interface ActiveWager {
  gameId: string;
  amount: WagerAmount;
  communityAvgScore: number;
  placedAt: number; // timestamp
}

export interface WagerResult {
  gameId: string;
  amount: WagerAmount;
  won: boolean;
  payout: number;
  playerScore: number;
  communityAvgScore: number;
  resolvedAt: number;
}

// placeholder data
export const COMMUNITY_AVG_SCORES: Record<string, number> = {
  'market-memory':  60,  // 3/5 correct = 60
  'mahjong-pattern': 55, // moderate attention score
  'tram-route':     52,  // moderate visuospatial
  'dim-sum-order':  58,  // moderate executive function
  'calendar-quiz':  83, 
  'news-words':  70, 
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface WagerState {
  // Currently active wager (null if no wager placed)
  activeWager: ActiveWager | null;

  // History of past wagers
  wagerHistory: WagerResult[];

  // ── Actions ──────────────────────────────────────────────────────────────

  // Place a wager before starting a game
  placeWager: (gameId: string, amount: WagerAmount) => void;

  // Resolve wager after game completes
  // Returns the result so reward screen can show it
  resolveWager: (playerScore: number) => WagerResult | null;

  // Clear active wager without resolving (user backed out)
  cancelWager: () => void;

  // Get wager history for a specific game
  getGameWagerHistory: (gameId: string) => WagerResult[];

  // Check if there's an active wager for a specific game
  hasActiveWager: (gameId: string) => boolean;

  // Get total coins won/lost from wagering
  getWagerNetTotal: () => number;
}

export const useWagerStore = create<WagerState>()(
  persist(
    (set, get) => ({
      activeWager: null,
      wagerHistory: [],

      placeWager: (gameId, amount) => {
        const communityAvgScore = COMMUNITY_AVG_SCORES[gameId] ?? 60;
        set({
          activeWager: {
            gameId,
            amount,
            communityAvgScore,
            placedAt: Date.now(),
          },
        });
      },

      resolveWager: (playerScore) => {
        const { activeWager } = get();
        if (!activeWager) return null;

        const won = playerScore > activeWager.communityAvgScore;
        const payout = won ? Math.round(activeWager.amount * 2.5) : 0;

        const result: WagerResult = {
          gameId: activeWager.gameId,
          amount: activeWager.amount,
          won,
          payout,
          playerScore,
          communityAvgScore: activeWager.communityAvgScore,
          resolvedAt: Date.now(),
        };

        set((state) => ({
          activeWager: null,
          wagerHistory: [result, ...state.wagerHistory],
        }));

        return result;
      },

      cancelWager: () => {
        set({ activeWager: null });
      },

      getGameWagerHistory: (gameId) => {
        return get().wagerHistory.filter((w) => w.gameId === gameId);
      },

      hasActiveWager: (gameId) => {
        const { activeWager } = get();
        return activeWager?.gameId === gameId;
      },

      getWagerNetTotal: () => {
        return get().wagerHistory.reduce((total, w) => {
          return total + (w.won ? w.payout - w.amount : -w.amount);
        }, 0);
      },
    }),
    {
      name: 'wager-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeWager: state.activeWager,
        wagerHistory: state.wagerHistory,
      }),
    }
  )
);