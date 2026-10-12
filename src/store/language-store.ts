import { create } from 'zustand';

// ─── Supported languages ──────────────────────────────────────────────────────

export type Language = 'en' | 'zh-HK' | 'zh-CN';

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
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'zh-HK', // Cantonese default
  setLanguage: (lang) => set({ language: lang }),
}));

// ─── Convenience hook ─────────────────────────────────────────────────────────
// Returns current language code — import this anywhere you need to read strings

export const useLanguage = () => useLanguageStore((s) => s.language);