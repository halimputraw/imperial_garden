// src/app/onboarding.tsx

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import {
  useOnboardingStore,
  REGION_INFO,
  AVATAR_OPTIONS,
  Region,
} from '@/store/onboarding-store';
import {
  useLanguageStore,
  LANGUAGE_OPTIONS,
  Language,
} from '@/store/language-store';
import { usePlayerStore } from '@/store/player-store';
import { strings } from '@/i18n/strings';

// ─── Step type ────────────────────────────────────────────────────────────────

type Step =
  | 'splash'
  | 'language'
  | 'region'
  | 'verify-id'
  | 'id-photo'
  | 'selfie'
  | 'verifying'
  | 'verified'
  | 'profile';

// ─── Progress bar ─────────────────────────────────────────────────────────────

const STEPS_ORDER: Step[] = [
  'splash', 'language', 'region',
  'verify-id', 'id-photo', 'selfie',
  'verifying', 'verified', 'profile',
];

function ProgressBar({ step }: { step: Step }) {
  const index = STEPS_ORDER.indexOf(step);
  const total = STEPS_ORDER.length - 1; // exclude splash
  if (step === 'splash') return null;
  const progress = (index / total) * 100;

  return (
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${progress}%` as any }]} />
    </View>
  );
}

// ─── Step: Splash ─────────────────────────────────────────────────────────────

function SplashStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const floatAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.splashContainer}>
      {/* Background decorations */}
      <View style={styles.splashBg}>
        <Text style={styles.splashBgEmoji1}>🏮</Text>
        <Text style={styles.splashBgEmoji2}>🌸</Text>
        <Text style={styles.splashBgEmoji3}>🍵</Text>
        <Text style={styles.splashBgEmoji4}>🀄</Text>
        <Text style={styles.splashBgEmoji5}>⛵</Text>
        <Text style={styles.splashBgEmoji6}>🏮</Text>
      </View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.splashLogoWrapper,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        <View style={styles.splashLogo}>
          <Text style={styles.splashLogoEmoji}>🌸</Text>
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={styles.splashTitle}>{t.onboardingWelcome}</Text>
      <Text style={styles.splashTagline}>{t.onboardingTagline}</Text>

      {/* Decorative line */}
      <View style={styles.splashDivider}>
        <View style={styles.splashDividerLine} />
        <Text style={styles.splashDividerEmoji}>🏮</Text>
        <View style={styles.splashDividerLine} />
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.splashButton,
          pressed && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={onNext}
        accessibilityRole="button"
      >
        <Text style={styles.splashButtonText}>{t.onboardingGetStarted}</Text>
      </Pressable>

      {/* Version */}
      <Text style={styles.splashVersion}>v1.0 · Hackathon Build</Text>
    </View>
  );
}

// ─── Step: Language ───────────────────────────────────────────────────────────

function LanguageStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage); 
  const t = strings[lang] ?? strings['zh-HK'];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>🌐</Text>
      <Text style={styles.stepTitle}>{t.onboardingSelectLanguage}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingSelectLanguageSub}</Text>

      <View style={styles.languageList}>
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = lang === option.code;
          return (
            <Pressable
              key={option.code}
              style={[
                styles.languageOption,
                isSelected && styles.languageOptionSelected,
              ]}
              onPress={() => setLanguage(option.code as Language)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={styles.languageFlag}>{option.flag}</Text>
              <View style={styles.languageLabelBlock}>
                <Text style={[
                  styles.languageLabel,
                  isSelected && styles.languageLabelSelected,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.languageSublabel}>{option.sublabel}</Text>
              </View>
              {isSelected && (
                <View style={styles.tickCircle}>
                  <Text style={styles.tickText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          pressed && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={onNext}
        accessibilityRole="button"
      >
        <Text style={styles.nextButtonText}>{t.onboardingNext}</Text>
      </Pressable>
    </View>
  );
}

// ─── Step: Region ─────────────────────────────────────────────────────────────

function RegionStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const region = useOnboardingStore((s) => s.region);
  const setRegion = useOnboardingStore((s) => s.setRegion);

  const REGIONS: Region[] = ['hk', 'macau', 'sz', 'gz'];

  const getRegionLabel = (r: Region) => {
    const info = REGION_INFO[r];
    if (lang === 'en') return info.labelEnglish;
    if (lang === 'zh-CN') return info.labelSimplified;
    if (lang === 'pt') return info.labelPortuguese;
    return info.labelCantonese;
  };

  const handleSelectRegion = (r: Region) => {
    setRegion(r);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>📍</Text>
      <Text style={styles.stepTitle}>{t.onboardingSelectRegion}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingSelectRegionSub}</Text>

      <View style={styles.regionList}>
        {/* HK + Macau */}
        <Text style={styles.regionGroupLabel}>
          {lang === 'en' ? 'Special Administrative Regions' : '特別行政區'}
        </Text>
        {(['hk', 'macau'] as Region[]).map((r) => {
          const info = REGION_INFO[r];
          const isSelected = region === r;
          return (
            <Pressable
              key={r}
              style={[
                styles.regionOption,
                isSelected && styles.regionOptionSelected,
              ]}
              onPress={() => handleSelectRegion(r)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={styles.regionFlag}>{info.emoji}</Text>
              <View style={styles.regionLabelBlock}>
                <Text style={[
                  styles.regionLabel,
                  isSelected && styles.regionLabelSelected,
                ]}>
                  {getRegionLabel(r)}
                </Text>
                <Text style={styles.regionSublabel}>
                  {info.idLabel}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.tickCircle}>
                  <Text style={styles.tickText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* GBA */}
        <Text style={[styles.regionGroupLabel, { marginTop: Spacing.three }]}>
          {lang === 'en' ? 'Greater Bay Area' : '大灣區'}
        </Text>
        {(['sz', 'gz'] as Region[]).map((r) => {
          const info = REGION_INFO[r];
          const isSelected = region === r;
          return (
            <Pressable
              key={r}
              style={[
                styles.regionOption,
                isSelected && styles.regionOptionSelected,
              ]}
              onPress={() => handleSelectRegion(r)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={styles.regionFlag}>{info.emoji}</Text>
              <View style={styles.regionLabelBlock}>
                <Text style={[
                  styles.regionLabel,
                  isSelected && styles.regionLabelSelected,
                ]}>
                  {getRegionLabel(r)}
                </Text>
                <Text style={styles.regionSublabel}>
                  {info.idLabel}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.tickCircle}>
                  <Text style={styles.tickText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          !region && styles.nextButtonDisabled,
          pressed && region && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={region ? onNext : undefined}
        disabled={!region}
        accessibilityRole="button"
      >
        <Text style={[
          styles.nextButtonText,
          !region && styles.nextButtonTextDisabled,
        ]}>
          {t.onboardingNext}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Step: Verify ID ──────────────────────────────────────────────────────────

function VerifyIdStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const region = useOnboardingStore((s) => s.region);
  const idNumber = useOnboardingStore((s) => s.idNumber);
  const setIdNumber = useOnboardingStore((s) => s.setIdNumber);
  const [error, setError] = useState('');

  const regionInfo = region ? REGION_INFO[region] : REGION_INFO.hk;

  const handleNext = () => {
    const isValid = regionInfo.idRegex.test(idNumber.trim().toUpperCase());
    if (!isValid) {
      setError(t.onboardingInvalidId);
      return;
    }
    setError('');
    onNext();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.stepContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepEmoji}>🪪</Text>
      <Text style={styles.stepTitle}>{t.onboardingVerifyId}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingVerifyIdSub}</Text>

      {/* ID type info card */}
      <View style={styles.idInfoCard}>
        <Text style={styles.idInfoEmoji}>🪪</Text>
        <View style={styles.idInfoText}>
          <Text style={styles.idInfoTitle}>{regionInfo.idLabel}</Text>
          <Text style={styles.idInfoFormat}>
            {t.onboardingIdFormat}: {regionInfo.idFormat}
          </Text>
          <Text style={styles.idInfoExample}>
            {lang === 'en' ? 'e.g.' : '例如'}: {regionInfo.idPlaceholder}
          </Text>
        </View>
      </View>

      {/* ID input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t.onboardingIdNumber}</Text>
        <TextInput
          style={[
            styles.textInput,
            error ? styles.textInputError : null,
          ]}
          value={idNumber}
          onChangeText={(v) => {
            setIdNumber(v);
            setError('');
          }}
          placeholder={regionInfo.idPlaceholder}
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel={t.onboardingIdNumber}
        />
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>

      {/* Privacy note */}
      <View style={styles.privacyNote}>
        <Text style={styles.privacyEmoji}>🔒</Text>
        <Text style={styles.privacyText}>
          {lang === 'en'
            ? 'Your ID is encrypted and never shared with third parties.'
            : lang === 'pt'
            ? 'O seu cartão de identidade é encriptado e nunca partilhado com terceiros.'
            : '你的身份證資料會被加密，不會與第三方共享。'}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          !idNumber && styles.nextButtonDisabled,
          pressed && idNumber && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={handleNext}
        disabled={!idNumber}
        accessibilityRole="button"
      >
        <Text style={[
          styles.nextButtonText,
          !idNumber && styles.nextButtonTextDisabled,
        ]}>
          {t.onboardingNext}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Step: ID Photo ───────────────────────────────────────────────────────────

function IdPhotoStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const [photoTaken, setPhotoTaken] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const handleTakePhoto = () => {
    // Mock camera flash
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setPhotoTaken(true));
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>📷</Text>
      <Text style={styles.stepTitle}>{t.onboardingTakeIdPhoto}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingTakeIdPhotoSub}</Text>

      {/* Mock camera viewfinder */}
      <View style={styles.cameraViewfinder}>
        {!photoTaken ? (
          <>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* ID card outline */}
            <View style={styles.idCardOutline}>
              <Text style={styles.idCardOutlineEmoji}>🪪</Text>
              <Text style={styles.idCardOutlineText}>
                {lang === 'en'
                  ? 'Place ID card here'
                  : lang === 'pt'
                  ? 'Coloque o cartão aqui'
                  : '將身份證放喺呢度'}
              </Text>
            </View>

            {/* Flash overlay */}
            <Animated.View
              style={[styles.flashOverlay, { opacity: flashAnim }]}
              pointerEvents="none"
            />
          </>
        ) : (
          /* Photo taken state */
          <View style={styles.photoTakenState}>
            <Text style={styles.photoTakenEmoji}>✅</Text>
            <Text style={styles.photoTakenText}>{t.onboardingMockPhotoTaken}</Text>
          </View>
        )}
      </View>

      {/* Tips */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>
          {lang === 'en' ? '💡 Tips' : '💡 提示'}
        </Text>
        <Text style={styles.tipItem}>
          {lang === 'en'
            ? '• Good lighting helps'
            : lang === 'pt'
            ? '• Boa iluminação ajuda'
            : '• 光線充足效果更好'}
        </Text>
        <Text style={styles.tipItem}>
          {lang === 'en'
            ? '• Keep the card flat and straight'
            : lang === 'pt'
            ? '• Mantenha o cartão plano e direito'
            : '• 保持身份證平整'}
        </Text>
        <Text style={styles.tipItem}>
          {lang === 'en'
            ? '• All text must be visible'
            : lang === 'pt'
            ? '• Todo o texto deve ser visível'
            : '• 確保所有文字清晰可見'}
        </Text>
      </View>

      {!photoTaken ? (
        <Pressable
          style={({ pressed }) => [
            styles.cameraButton,
            pressed && { backgroundColor: Colors.primaryDark },
          ]}
          onPress={handleTakePhoto}
          accessibilityRole="button"
        >
          <Text style={styles.cameraButtonEmoji}>📸</Text>
          <Text style={styles.cameraButtonText}>
            {lang === 'en'
              ? 'Take Photo'
              : lang === 'pt'
              ? 'Fotografar'
              : '拍攝相片'}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && { backgroundColor: Colors.primaryDark },
          ]}
          onPress={onNext}
          accessibilityRole="button"
        >
          <Text style={styles.nextButtonText}>{t.onboardingNext}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Step: Selfie ─────────────────────────────────────────────────────────────

function SelfieStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const [photoTaken, setPhotoTaken] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const handleTakePhoto = () => {
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setPhotoTaken(true));
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>🤳</Text>
      <Text style={styles.stepTitle}>{t.onboardingTakeSelfie}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingTakeSelfieSub}</Text>

      {/* Selfie viewfinder — circular face outline */}
      <View style={styles.selfieViewfinder}>
        {!photoTaken ? (
          <>
            {/* Face oval guide */}
            <View style={styles.faceGuide}>
              <Text style={styles.faceGuideEmoji}>👤</Text>
            </View>
            {/* ID card indicator */}
            <View style={styles.selfieIdIndicator}>
              <Text style={styles.selfieIdText}>
                {lang === 'en'
                  ? '🪪 Hold ID here'
                  : lang === 'pt'
                  ? '🪪 Segure o cartão aqui'
                  : '🪪 拿住身份證'}
              </Text>
            </View>
            <Animated.View
              style={[styles.flashOverlay, { opacity: flashAnim }]}
              pointerEvents="none"
            />
          </>
        ) : (
          <View style={styles.photoTakenState}>
            <Text style={styles.photoTakenEmoji}>✅</Text>
            <Text style={styles.photoTakenText}>{t.onboardingMockPhotoTaken}</Text>
          </View>
        )}
      </View>

      {!photoTaken ? (
        <Pressable
          style={({ pressed }) => [
            styles.cameraButton,
            pressed && { backgroundColor: Colors.primaryDark },
          ]}
          onPress={handleTakePhoto}
          accessibilityRole="button"
        >
          <Text style={styles.cameraButtonEmoji}>🤳</Text>
          <Text style={styles.cameraButtonText}>
            {lang === 'en'
              ? 'Take Selfie'
              : lang === 'pt'
              ? 'Tirar Selfie'
              : '拍攝自拍'}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && { backgroundColor: Colors.primaryDark },
          ]}
          onPress={onNext}
          accessibilityRole="button"
        >
          <Text style={styles.nextButtonText}>{t.onboardingNext}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Step: Verifying ──────────────────────────────────────────────────────────

function VerifyingStep({ onDone }: { onDone: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const spinAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Auto-advance after 2.5 seconds
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.centeredStep}>
      <Animated.Text
        style={[styles.verifyingSpinner, { transform: [{ rotate: spin }] }]}
      >
        ⚙️
      </Animated.Text>
      <Text style={styles.stepTitle}>{t.onboardingVerifying}</Text>

      {/* Steps */}
      <View style={styles.verifyingSteps}>
        {[
          lang === 'en' ? '✓ ID format checked' : '✓ 身份證格式已確認',
          lang === 'en' ? '✓ Photo analysed'    : '✓ 相片已分析',
          lang === 'en' ? '⟳ Verifying...'      : '⟳ 驗證中...',
        ].map((step, i) => (
          <Text key={i} style={styles.verifyingStep}>{step}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── Step: Verified ───────────────────────────────────────────────────────────

function VerifiedStep({ onNext }: { onNext: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 12,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.centeredStep}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedEmoji}>✓</Text>
        </View>
      </Animated.View>

      <Text style={styles.verifiedTitle}>{t.onboardingVerified}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingVerifiedSub}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          pressed && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={onNext}
        accessibilityRole="button"
      >
        <Text style={styles.nextButtonText}>{t.onboardingNext}</Text>
      </Pressable>
    </View>
  );
}

// ─── Step: Profile ────────────────────────────────────────────────────────────

function ProfileStep({ onDone }: { onDone: () => void }) {
  const lang = useLanguageStore((s) => s.language);
  const t = strings[lang] ?? strings['zh-HK'];
  const playerName = useOnboardingStore((s) => s.playerName);
  const playerAvatar = useOnboardingStore((s) => s.playerAvatar);
  const setPlayerName = useOnboardingStore((s) => s.setPlayerName);
  const setPlayerAvatar = useOnboardingStore((s) => s.setPlayerAvatar);

  return (
    <ScrollView
      contentContainerStyle={styles.stepContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepEmoji}>{playerAvatar}</Text>
      <Text style={styles.stepTitle}>{t.onboardingSetupProfile}</Text>
      <Text style={styles.stepSubtitle}>{t.onboardingSetupProfileSub}</Text>

      {/* Name input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t.onboardingYourName}</Text>
        <TextInput
          style={styles.textInput}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder={t.onboardingNamePlaceholder}
          placeholderTextColor={Colors.textSecondary}
          maxLength={20}
          accessibilityLabel={t.onboardingYourName}
        />
      </View>

      {/* Avatar picker */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t.onboardingChooseAvatar}</Text>
        <View style={styles.avatarGrid}>
          {AVATAR_OPTIONS.map((avatar) => (
            <Pressable
              key={avatar}
              style={[
                styles.avatarOption,
                playerAvatar === avatar && styles.avatarOptionSelected,
              ]}
              onPress={() => setPlayerAvatar(avatar)}
              accessibilityRole="radio"
              accessibilityState={{ checked: playerAvatar === avatar }}
            >
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          !playerName.trim() && styles.nextButtonDisabled,
          pressed && playerName.trim() && { backgroundColor: Colors.primaryDark },
        ]}
        onPress={playerName.trim() ? onDone : undefined}
        disabled={!playerName.trim()}
        accessibilityRole="button"
      >
        <Text style={[
          styles.nextButtonText,
          !playerName.trim() && styles.nextButtonTextDisabled,
        ]}>
          {t.onboardingDone}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Main onboarding screen ───────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('splash');
  const lang = useLanguageStore((s) => s.language);

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const playerName = useOnboardingStore((s) => s.playerName);
  const playerAvatar = useOnboardingStore((s) => s.playerAvatar);

  const next = useCallback((to: Step) => setStep(to), []);

  const handleDone = useCallback(() => {
    // Sync profile to player store
    if (playerName.trim()) {
      // Update player store with the onboarding name + avatar
      usePlayerStore.setState({
        name: playerName.trim(),
        avatar: playerAvatar,
      });
    }
    completeOnboarding();
    router.replace('/');
  }, [playerName, playerAvatar, completeOnboarding, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ProgressBar step={step} />

      {step === 'splash'    && <SplashStep    onNext={() => next('language')} />}
      {step === 'language'  && <LanguageStep  onNext={() => next('region')} />}
      {step === 'region'    && <RegionStep    onNext={() => next('verify-id')} />}
      {step === 'verify-id' && <VerifyIdStep  onNext={() => next('id-photo')} />}
      {step === 'id-photo'  && <IdPhotoStep   onNext={() => next('selfie')} />}
      {step === 'selfie'    && <SelfieStep    onNext={() => next('verifying')} />}
      {step === 'verifying' && <VerifyingStep onDone={() => next('verified')} />}
      {step === 'verified'  && <VerifiedStep  onNext={() => next('profile')} />}
      {step === 'profile'   && <ProfileStep   onDone={handleDone} />}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Progress bar ──
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surfaceDark,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // ── Splash ──
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.six,
    gap: Spacing.three,
    backgroundColor: Colors.background,
  },
  splashBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splashBgEmoji1: { position: 'absolute', top: '8%',  left: '5%',  fontSize: 40, opacity: 0.12 },
  splashBgEmoji2: { position: 'absolute', top: '15%', right: '8%', fontSize: 32, opacity: 0.10 },
  splashBgEmoji3: { position: 'absolute', top: '45%', left: '3%',  fontSize: 28, opacity: 0.08 },
  splashBgEmoji4: { position: 'absolute', top: '60%', right: '5%', fontSize: 36, opacity: 0.10 },
  splashBgEmoji5: { position: 'absolute', bottom:'15%',left: '8%', fontSize: 30, opacity: 0.08 },
  splashBgEmoji6: { position: 'absolute', bottom:'8%', right:'6%', fontSize: 34, opacity: 0.12 },
  splashLogoWrapper: {
    marginBottom: Spacing.two,
  },
  splashLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 8,
  },
  splashLogoEmoji: {
    fontSize: 56,
  },
  splashTitle: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  splashTagline: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  splashDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginVertical: Spacing.two,
  },
  splashDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceDark,
  },
  splashDividerEmoji: {
    fontSize: 20,
  },
  splashButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.eight,
    borderRadius: Spacing.three,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  splashButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },
  splashVersion: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    opacity: 0.5,
    marginTop: Spacing.two,
  },

  // ── Shared step container ──
  stepContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
    alignItems: 'stretch',
  },
  centeredStep: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  stepEmoji: {
    fontSize: 52,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginTop: -Spacing.two,
  },

  // ── Language options ──
  languageList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.surface,
    minHeight: 72,
  },
  languageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}11`,
  },
  languageFlag: { fontSize: 36 },
  languageLabelBlock: { flex: 1 },
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

  // ── Region options ──
  regionList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  regionGroupLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: -Spacing.one,
  },
  regionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.surface,
    minHeight: 64,
  },
  regionOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}11`,
  },
  regionFlag: { fontSize: 32 },
  regionLabelBlock: { flex: 1 },
  regionLabel: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  regionLabelSelected: {
    color: Colors.primaryDark,
  },
  regionSublabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },

  // ── Tick circle ──
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

  // ── ID verify ──
  idInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
  },
  idInfoEmoji: { fontSize: 36 },
  idInfoText: { flex: 1, gap: Spacing.one },
  idInfoTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  idInfoFormat: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  idInfoExample: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  inputWrapper: {
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    minHeight: 56,
  },
  textInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSize.small,
    color: Colors.error,
    fontWeight: '600',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
  },
  privacyEmoji: { fontSize: 18 },
  privacyText: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // ── Camera viewfinder ──
  cameraViewfinder: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: '#1A1A1A',
    borderRadius: Spacing.three,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.white,
  },
  cornerTL: { top: 12,  left: 12,  borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12,  right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  idCardOutline: {
    width: '75%',
    aspectRatio: 1.58,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: Spacing.two,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  idCardOutlineEmoji: { fontSize: 32 },
  idCardOutlineText: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.white,
  },
  photoTakenState: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  photoTakenEmoji: { fontSize: 52 },
  photoTakenText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Selfie viewfinder ──
  selfieViewfinder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: Spacing.three,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
  },
  faceGuide: {
    width: '55%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuideEmoji: { fontSize: 64, opacity: 0.3 },
  selfieIdIndicator: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  selfieIdText: {
    fontSize: FontSize.small,
    color: Colors.white,
    fontWeight: '700',
  },

  // ── Tips ──
  tipsBox: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  tipsTitle: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.one,
  },
  tipItem: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // ── Camera button ──
  cameraButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  cameraButtonEmoji: { fontSize: 24 },
  cameraButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Verifying ──
  verifyingSpinner: {
    fontSize: 64,
  },
  verifyingSteps: {
    gap: Spacing.two,
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    alignSelf: 'stretch',
  },
  verifyingStep: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // ── Verified ──
  verifiedBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 8,
  },
  verifiedEmoji: {
    fontSize: 52,
    color: Colors.white,
    fontWeight: '800',
  },
  verifiedTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.success,
    textAlign: 'center',
  },

  // ── Profile ──
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
    backgroundColor: `${Colors.primary}18`,
  },
  avatarEmoji: { fontSize: 32 },

  // ── Next button ──
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    marginTop: Spacing.two,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderBottomColor: Colors.surfaceDark,
  },
  nextButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },
  nextButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});