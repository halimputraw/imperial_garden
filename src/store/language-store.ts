import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Supported languages ──────────────────────────────────────────────────────

export type Language = 'en' | 'zh-HK' | 'zh-CN' | 'pt';

export const LANGUAGE_OPTIONS: {
  code: Language;
  label: string;
  sublabel: string;
  flag: string;
}[] = [
  {
    code: 'zh-HK',
    label: '廣東話',
    sublabel: 'Cantonese',
    flag: '🇭🇰',
  },
  {
    code: 'en',
    label: 'English',
    sublabel: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'zh-CN',
    label: '简体中文',
    sublabel: 'Simplified Chinese',
    flag: '🇨🇳',
  },
  {
    code: 'pt',
    label: 'Português',
    sublabel: 'Portuguese',
    flag: '🇵🇹',
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'zh-HK',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ─── Convenience hook ─────────────────────────────────────────────────────────
// Returns current language code — import this anywhere you need to read strings

export const useLanguage = () => useLanguageStore((s) => s.language);