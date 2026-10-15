import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Region = 'hk' | 'macau' | 'sz' | 'gz';
export type IDType = 'hkid' | 'macau-id' | 'mainland-id';

export const REGION_INFO: Record<Region, {
  labelCantonese: string;
  labelEnglish: string;
  labelSimplified: string;
  labelPortuguese: string;
  emoji: string;
  idType: IDType;
  idLabel: string;
  idFormat: string;
  idPlaceholder: string;
  idRegex: RegExp;
  suggestedLanguage: string;
}> = {
  hk: {
    labelCantonese: '香港',
    labelEnglish: 'Hong Kong',
    labelSimplified: '香港',
    labelPortuguese: 'Hong Kong',
    emoji: '🇭🇰',
    idType: 'hkid',
    idLabel: '香港身份證',
    idFormat: 'A123456(7)',
    idPlaceholder: 'A123456(7)',
    idRegex: /^[A-Z]{1,2}[0-9]{6}\([0-9A]\)$/,
    suggestedLanguage: 'zh-HK',
  },
  macau: {
    labelCantonese: '澳門',
    labelEnglish: 'Macau',
    labelSimplified: '澳门',
    labelPortuguese: 'Macau',
    emoji: '🇲🇴',
    idType: 'macau-id',
    idLabel: '澳門居民身份證',
    idFormat: '1/2/5/7/8 + 6位數字',
    idPlaceholder: '1234567',
    idRegex: /^[12578][0-9]{6}$/,
    suggestedLanguage: 'pt',
  },
  sz: {
    labelCantonese: '深圳',
    labelEnglish: 'Shenzhen',
    labelSimplified: '深圳',
    labelPortuguese: 'Shenzhen',
    emoji: '🏙️',
    idType: 'mainland-id',
    idLabel: '中國居民身份證',
    idFormat: '18位數字',
    idPlaceholder: '440300199001011234',
    idRegex: /^[1-9][0-9]{16}[0-9X]$/,
    suggestedLanguage: 'zh-CN',
  },
  gz: {
    labelCantonese: '廣州',
    labelEnglish: 'Guangzhou',
    labelSimplified: '广州',
    labelPortuguese: 'Guangzhou',
    emoji: '🌆',
    idType: 'mainland-id',
    idLabel: '中國居民身份證',
    idFormat: '18位數字',
    idPlaceholder: '440100199001011234',
    idRegex: /^[1-9][0-9]{16}[0-9X]$/,
    suggestedLanguage: 'zh-CN',
  },
};

export const AVATAR_OPTIONS = [
  '👴', '👵', '🧓', '👨', '👩',
  '🧑', '👦', '👧', '🐱', '🐶',
];

// ─── State ────────────────────────────────────────────────────────────────────

interface OnboardingState {
  // Completion flag — if true, skip onboarding
  isComplete: boolean;

  // Selected values
  region: Region | null;
  idNumber: string;
  idVerified: boolean;
  playerName: string;
  playerAvatar: string;

  // ── Actions ──────────────────────────────────────────────────────────────
  setRegion: (region: Region) => void;
  setIdNumber: (id: string) => void;
  setIdVerified: (verified: boolean) => void;
  setPlayerName: (name: string) => void;
  setPlayerAvatar: (avatar: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isComplete: false,
      region: null,
      idNumber: '',
      idVerified: false,
      playerName: '',
      playerAvatar: '👴',

      setRegion: (region) => set({ region }),
      setIdNumber: (idNumber) => set({ idNumber }),
      setIdVerified: (idVerified) => set({ idVerified }),
      setPlayerName: (playerName) => set({ playerName }),
      setPlayerAvatar: (playerAvatar) => set({ playerAvatar }),

      completeOnboarding: () => set({ isComplete: true }),

      resetOnboarding: () => set({
        isComplete: false,
        region: null,
        idNumber: '',
        idVerified: false,
        playerName: '',
        playerAvatar: '👴',
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isComplete: state.isComplete,
        region: state.region,
        idNumber: state.idNumber,
        idVerified: state.idVerified,
        playerName: state.playerName,
        playerAvatar: state.playerAvatar,
      }),
    }
  )
);