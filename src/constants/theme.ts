// src/constants/theme.ts

// ─── Spacing scale (unchanged from your original) ───────────────────────────
export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
} as const;

export const MaxContentWidth = 480;
export const BottomTabInset = 60; // height reserved for our custom tab bar

// ─── Elderly-friendly font sizes ─────────────────────────────────────────────
// Rule: minimum 18sp for body, 22sp+ for interactive labels, 28sp+ for titles
export const FontSize = {
  tiny: 14,      // captions only, avoid where possible
  small: 18,     // minimum body text
  body: 20,      // default readable text
  label: 22,     // tab bar labels, button text
  subtitle: 26,  // section headings
  title: 32,     // screen titles
  hero: 40,      // splash / welcome
} as const;

// ─── Warm pixel art palette ───────────────────────────────────────────────────
// Inspired by old HK illustrated maps: terracotta rooftops, jade greens,
// lantern reds, dim sum gold, dim evening purples
export const Colors = {
  // Primary actions
  primary: '#D94F3D',       // lantern red — main CTA buttons
  primaryLight: '#F28B7D',  // lighter red for hover/pressed
  primaryDark: '#A8332A',   // darker for borders

  // Accent
  gold: '#E8A838',          // dim sum gold — coins, rewards
  goldLight: '#F5C96A',

  // Map zone colours (each neighbourhood has its own warm hue)
  zoneMarket: '#6BAF6B',    // jade green — wet market
  zoneCafe: '#C47A3A',      // cha chaan teng brown
  zoneEstate: '#7A9CC4',    // public housing pastel blue
  zonePark: '#4E9E6B',      // Victoria Park green

  // UI surfaces
  background: '#FDF3E3',    // warm parchment — main bg
  surface: '#FBE8C8',       // slightly darker parchment — cards
  surfaceDark: '#E8D5A8',   // pressed states, dividers

  // Map background tiles
  mapBg: '#C8DFA0',         // muted grass/ground
  mapRoad: '#E8D8B0',       // sandy road colour
  mapWater: '#A8C8D8',      // harbour water

  // Text
  textPrimary: '#2C1A0E',   // very dark brown — main text (high contrast)
  textSecondary: '#6B4C2A', // medium brown — secondary text
  textOnDark: '#FDF3E3',    // parchment on dark backgrounds

  // Status
  success: '#4E9E6B',
  warning: '#E8A838',
  error: '#D94F3D',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ─── Tab bar ──────────────────────────────────────────────────────────────────
export const TabBar = {
  height: 80,           // tall enough for elderly tap targets
  iconSize: 28,
  labelSize: FontSize.label,
  paddingBottom: 12,
} as const;

// ─── Touch targets ────────────────────────────────────────────────────────────
// WCAG recommends 44×44pt minimum; we use 56pt minimum for elderly users
export const TouchTarget = {
  min: 56,
  comfortable: 72,
} as const;