import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import {
  useLanguageStore,
  LANGUAGE_OPTIONS,
  Language,
} from '@/store/language-store';
import { strings } from '@/i18n/strings';
import { usePlayerStore } from '@/store/player-store';
import { useOnboardingStore } from '@/store/onboarding-store';

// ─── Language picker modal ────────────────────────────────────────────────────

interface LanguagePickerProps {
  visible: boolean;
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

function LanguagePicker({
  visible,
  current,
  onSelect,
  onClose,
}: LanguagePickerProps) {
  const t = strings[current];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Picker card */}
      <View style={styles.pickerCard}>
        {/* Title */}
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>
            🌐 {t.settingsLanguagePickerTitle}
          </Text>
          <Pressable
            onPress={onClose}
            style={styles.pickerClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.pickerCloseText}>✕</Text>
          </Pressable>
        </View>

        {/* Language options */}
        <View style={styles.pickerOptions}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = current === option.code;
            return (
              <Pressable
                key={option.code}
                style={({ pressed }) => [
                  styles.languageOption,
                  isSelected && styles.languageOptionSelected,
                  pressed && !isSelected && styles.languageOptionPressed,
                ]}
                onPress={() => onSelect(option.code)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={option.label}
              >
                {/* Flag + labels */}
                <Text style={styles.languageFlag}>{option.flag}</Text>
                <View style={styles.languageLabelBlock}>
                  <Text
                    style={[
                      styles.languageLabel,
                      isSelected && styles.languageLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.languageSublabel}>
                    {option.sublabel}
                  </Text>
                </View>

                {/* Selected tick */}
                {isSelected && (
                  <View style={styles.tickCircle}>
                    <Text style={styles.tickText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

// ─── Settings row ─────────────────────────────────────────────────────────────

interface SettingsRowProps {
  emoji: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightContent?: React.ReactNode;
}

function SettingsRow({
  emoji,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightContent,
}: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsRow,
        pressed && onPress && styles.settingsRowPressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={title}
    >
      {/* Left emoji */}
      <View style={styles.rowEmojiBox}>
        <Text style={styles.rowEmoji}>{emoji}</Text>
      </View>

      {/* Middle text */}
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Right content or arrow */}
      {rightContent ?? (showArrow && onPress && (
        <Text style={styles.rowArrow}>›</Text>
      ))}
    </Pressable>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SettingsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      {children}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const t = strings[language];

  const playerName = usePlayerStore((s) => s.name);
  const playerAvatar = usePlayerStore((s) => s.avatar);
  const playerLevel = usePlayerStore((s) => s.level);
  const playerCoins = usePlayerStore((s) => s.coins);

  const [pickerVisible, setPickerVisible] = useState(false);

  const currentLanguageOption = LANGUAGE_OPTIONS.find(
    (o) => o.code === language
  )!;

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Player card ── */}
        <View style={styles.playerCard}>
          <Text style={styles.playerAvatar}>{playerAvatar}</Text>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{playerName}</Text>
            <Text style={styles.playerMeta}>
              {t.level} {playerLevel} · 🪙 {playerCoins}
            </Text>
          </View>
        </View>

        {/* ── Preferences ── */}
        <SettingsSection>
          {/* Language row */}
          <SettingsRow
            emoji="🌐"
            title={t.settingsLanguage}
            subtitle={`${currentLanguageOption.flag}  ${currentLanguageOption.label}`}
            onPress={() => setPickerVisible(true)}
          />
        </SettingsSection>

        {/* ── Account ── */}
        <SettingsSection>
          <SettingsRow
            emoji="👤"
            title={t.settingsAccount}
            subtitle={t.settingsAccountDesc}
            onPress={() => {
              // TODO: navigate to HKID registration
            }}
          />
        </SettingsSection>

        {/* ── Reset Onboarding ── */}
        <SettingsSection>
          <SettingsRow
            emoji="🔄"
            title="Reset Onboarding"
            subtitle="Demo only — restart the onboarding flow"
            onPress={resetOnboarding}
          />
        </SettingsSection>

        {/* ── About ── */}
        <SettingsSection>
          <SettingsRow
            emoji="ℹ️"
            title={t.settingsAbout}
            subtitle={t.settingsAboutDesc}
            onPress={() => {}}
          />
          <View style={styles.sectionDivider} />
          <SettingsRow
            emoji="📱"
            title={t.settingsVersion}
            subtitle="Imperial Garden · Hackathon Build"
            showArrow={false}
          />
        </SettingsSection>

        {/* ── Credits ── */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>
            🏮 Imperial Garden
          </Text>
          <Text style={styles.creditsSubtext}>
            Made with ❤️ for Hong Kong & Macau elderly
          </Text>
        </View>
      </ScrollView>

      {/* Language picker modal */}
      <LanguagePicker
        visible={pickerVisible}
        current={language}
        onSelect={handleSelectLanguage}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },

  // ── Player card ──
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  playerAvatar: {
    fontSize: 48,
  },
  playerInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  playerName: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  playerMeta: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ── Settings section ──
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.surfaceDark,
    marginHorizontal: Spacing.three,
  },

  // ── Settings row ──
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
    minHeight: 72,
  },
  settingsRowPressed: {
    backgroundColor: Colors.surfaceDark,
  },
  rowEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: Spacing.two,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEmoji: {
    fontSize: 22,
  },
  rowTextBlock: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  rowArrow: {
    fontSize: FontSize.title,
    color: Colors.textSecondary,
    fontWeight: '300',
    lineHeight: 28,
  },

  // ── Language picker modal ──
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    borderTopWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingBottom: Spacing.eight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  pickerTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  pickerClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerCloseText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pickerOptions: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.background,
    minHeight: 72,
  },
  languageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  languageOptionPressed: {
    backgroundColor: Colors.surfaceDark,
  },
  languageFlag: {
    fontSize: 36,
  },
  languageLabelBlock: {
    flex: 1,
    gap: 3,
  },
  languageLabel: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  languageLabelSelected: {
    color: Colors.primaryDark,
  },
  languageSublabel: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  tickCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Credits ──
  credits: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.one,
  },
  creditsText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  creditsSubtext: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});