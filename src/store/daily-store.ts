import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Daily rules ──────────────────────────────────────────────────────────────

export const DAILY_TARGET = 3;   // games needed for the Daily Challenge
export const DAILY_BONUS = 100;  // coins awarded once per day

// Some games save a different id than the Games list uses
const GAME_ID_ALIASES: Record<string, string> = {
  'mahjong-match': 'mahjong-pattern',
};
const canonicalId = (gameId: string) => GAME_ID_ALIASES[gameId] ?? gameId;

// Local calendar day, e.g. "2026-10-16" (resets at the phone's midnight)
export const todayKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ─── Store ────────────────────────────────────────────────────────────────────

interface DailyState {
  dateKey: string;            // which day the lists below belong to
  completedGameIds: string[]; // games finished on that day
  bonusClaimed: boolean;      // Daily Challenge bonus already paid that day

  // Call when a game is finished. Returns true if the bonus was just earned.
  markCompleted: (gameId: string) => { bonusEarned: boolean };
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      dateKey: todayKey(),
      completedGameIds: [],
      bonusClaimed: false,

      markCompleted: (gameId) => {
        const key = todayKey();
        const state = get();
        const sameDay = state.dateKey === key;
        const done = sameDay ? state.completedGameIds : [];
        const claimed = sameDay ? state.bonusClaimed : false;

        const id = canonicalId(gameId);
        const completedGameIds = done.includes(id) ? done : [...done, id];
        const bonusEarned = !claimed && completedGameIds.length >= DAILY_TARGET;

        set({
          dateKey: key,
          completedGameIds,
          bonusClaimed: claimed || bonusEarned,
        });
        return { bonusEarned };
      },
    }),
    {
      name: 'daily-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dateKey: state.dateKey,
        completedGameIds: state.completedGameIds,
        bonusClaimed: state.bonusClaimed,
      }),
    }
  )
);

// ─── Hooks ────────────────────────────────────────────────────────────────────
// Always reads "today" — yesterday's data is ignored automatically.

export function useDailyProgress() {
  const dateKey = useDailyStore((s) => s.dateKey);
  const completedGameIds = useDailyStore((s) => s.completedGameIds);
  const bonusClaimed = useDailyStore((s) => s.bonusClaimed);
  const isToday = dateKey === todayKey();

  const completed = isToday ? completedGameIds : [];
  return {
    completedCount: Math.min(completed.length, DAILY_TARGET),
    totalCompleted: completed.length,
    bonusClaimed: isToday && bonusClaimed,
    isPlayedToday: (gameId: string) => completed.includes(canonicalId(gameId)),
  };
}