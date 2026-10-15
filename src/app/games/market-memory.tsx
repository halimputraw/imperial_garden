import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { CountdownTimer } from '@/components/games/countdown-timer';
import { ItemGrid, MarketItem } from '@/components/games/item-grid';
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';

// ─── Item pool ────────────────────────────────────────────────────────────────
// All possible items — correct ones picked randomly each round

const ALL_ITEMS: Omit<MarketItem, 'isCorrect'>[] = [
  { id: 'cabbage',   emoji: '🥬', labelCantonese: '椰菜'   },
  { id: 'fish',      emoji: '🐟', labelCantonese: '魚'     },
  { id: 'chicken',   emoji: '🍗', labelCantonese: '雞'     },
  { id: 'egg',       emoji: '🥚', labelCantonese: '雞蛋'   },
  { id: 'corn',      emoji: '🌽', labelCantonese: '粟米'   },
  { id: 'carrot',    emoji: '🥕', labelCantonese: '紅蘿蔔' },
  { id: 'potato',    emoji: '🥔', labelCantonese: '薯仔'   },
  { id: 'onion',     emoji: '🧅', labelCantonese: '洋蔥'   },
  { id: 'broccoli',  emoji: '🥦', labelCantonese: '西蘭花' },
  { id: 'mushroom',  emoji: '🍄', labelCantonese: '冬菇'   },
  { id: 'tofu',      emoji: '🫙', labelCantonese: '豆腐'   },
  { id: 'shrimp',    emoji: '🍤', labelCantonese: '蝦'     },
  { id: 'pork',      emoji: '🥩', labelCantonese: '豬肉'   },
  { id: 'lemon',     emoji: '🍋', labelCantonese: '檸檬'   },
  { id: 'sweetpotato', emoji: '🍠', labelCantonese: '番薯' },
];

// ─── Round config ─────────────────────────────────────────────────────────────

interface RoundConfig {
  correctCount: number;   // items to memorise
  distractorCount: number; // extra wrong items in quiz
}

const ROUND_CONFIGS: RoundConfig[] = [
  { correctCount: 3, distractorCount: 3 },  // Round 1: remember 3, quiz 6
  { correctCount: 4, distractorCount: 4 },  // Round 2: remember 4, quiz 8
  { correctCount: 5, distractorCount: 5 },  // Round 3: remember 5, quiz 10
  { correctCount: 6, distractorCount: 4 },  // Round 4: remember 6, quiz 10
  { correctCount: 7, distractorCount: 5 },  // Round 5: remember 7, quiz 12
];

const MEMORISE_SECONDS = 5;
const COIN_REWARD = 20;
const TOTAL_ROUNDS = ROUND_CONFIGS.length;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(config: RoundConfig): {
  correctItems: MarketItem[];
  quizItems: MarketItem[];
} {
  const shuffled = shuffle(ALL_ITEMS);
  const correctItems: MarketItem[] = shuffled
    .slice(0, config.correctCount)
    .map((item) => ({ ...item, isCorrect: true }));
  const distractors: MarketItem[] = shuffled
    .slice(config.correctCount, config.correctCount + config.distractorCount)
    .map((item) => ({ ...item, isCorrect: false }));
  const quizItems = shuffle([...correctItems, ...distractors]);
  return { correctItems, quizItems };
}

// ─── Phase types ──────────────────────────────────────────────────────────────

type RoundPhase = 'memorise' | 'transition' | 'quiz';

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  return (
    <ScrollView
      contentContainerStyle={styles.centeredPhase}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.phaseEmoji}>🥬</Text>
      <Text style={styles.phaseTitle}>{t.marketMemoryTitle}</Text>
      <Text style={styles.phaseSubtitle}>{t.marketMemorySubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.marketMemoryHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.marketMemoryStep1}</Text>
        <Text style={styles.instructionStep}>{t.marketMemoryStep2}</Text>
        <Text style={styles.instructionStep}>{t.marketMemoryStep3}</Text>
        <Text style={styles.instructionStep}>{t.marketMemoryStep4}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.marketMemoryRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.marketMemoryStart}
      >
        <Text style={styles.primaryButtonText}>{t.marketMemoryStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Round screen ─────────────────────────────────────────────────────────────

function RoundScreen({
  roundIndex,
  totalRounds,
  onRoundComplete,
}: {
  roundIndex: number;
  totalRounds: number;
  onRoundComplete: (score: number) => void;
}) {
  const t = useStrings();
  const config = ROUND_CONFIGS[roundIndex];
  const [round] = useState(() => buildRound(config));
  const [phase, setPhase] = useState<RoundPhase>('memorise');
  const [secondsLeft, setSecondsLeft] = useState(MEMORISE_SECONDS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Countdown tick
  useEffect(() => {
    if (phase !== 'memorise') return;
    if (secondsLeft <= 0) {
      setPhase('transition');
      setTimeout(() => setPhase('quiz'), 1800);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  const handleItemPress = useCallback((item: MarketItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        // Limit selection to correctCount
        if (next.size >= config.correctCount) return prev;
        next.add(item.id);
      }
      return next;
    });
  }, [config.correctCount]);

  const handleSubmit = useCallback(() => {
    const correctCount = [...selectedIds].filter(
      (id) => round.correctItems.some((item) => item.id === id)
    ).length;
    const score = Math.round((correctCount / config.correctCount) * 20);
    onRoundComplete(score);
  }, [selectedIds, round, config, onRoundComplete]);

  const selectedCount = selectedIds.size;

  // ── Memorise phase ──
  if (phase === 'memorise') {
    return (
      <View style={styles.roundContainer}>
        {/* Round indicator */}
        <RoundIndicator roundIndex={roundIndex} totalRounds={totalRounds} />

        <View style={styles.memorisePhase}>
          <View style={styles.memoriseHeader}>
            <View style={styles.memoriseHeaderText}>
              <Text style={styles.phaseLabel}>{t.marketMemoryMemorisePrompt}</Text>
              <Text style={styles.phaseLabelSub}>
                {t.marketMemoryMemoriseSubPrompt}
              </Text>
            </View>
            <CountdownTimer
              totalSeconds={MEMORISE_SECONDS}
              currentSeconds={secondsLeft}
              size={80}
              onFinish={() => {
                setPhase('transition');
                setTimeout(() => setPhase('quiz'), 1800);
              }}
            />
          </View>

          <View style={styles.memoriseGrid}>
            <ItemGrid items={round.correctItems} mode="memorise" />
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>{t.marketMemoryTip}</Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Transition phase ──
  if (phase === 'transition') {
    return <TransitionPhase />;
  }

  // ── Quiz phase ──
  return (
    <View style={styles.roundContainer}>
      {/* Round indicator */}
      <RoundIndicator roundIndex={roundIndex} totalRounds={totalRounds} />

      <View style={styles.quizPhase}>
        <View style={styles.quizHeader}>
          <Text style={styles.phaseLabel}>{t.marketMemoryQuizPrompt}</Text>
          <Text style={styles.phaseLabelSub}>{t.marketMemoryQuizSubPrompt}</Text>
          {/* Selection counter dots */}
          <View style={styles.selectionCounter}>
            {Array.from({ length: config.correctCount }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.selectionDot,
                  {
                    backgroundColor:
                      i < selectedCount ? Colors.primary : Colors.surfaceDark,
                  },
                ]}
              />
            ))}
            <Text style={styles.selectionCountText}>
              {selectedCount} / {config.correctCount}
            </Text>
          </View>
        </View>

        <View style={styles.quizGrid}>
          <ItemGrid
            items={round.quizItems}
            mode="quiz"
            selectedIds={selectedIds}
            onItemPress={handleItemPress}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            styles.submitButton,
            selectedCount === 0 && styles.buttonDisabled,
            pressed && selectedCount > 0 && {
              backgroundColor: Colors.primaryDark,
            },
          ]}
          onPress={handleSubmit}
          disabled={selectedCount === 0}
          accessibilityRole="button"
          accessibilityLabel={t.marketMemorySubmit}
        >
          <Text
            style={[
              styles.primaryButtonText,
              selectedCount === 0 && styles.buttonDisabledText,
            ]}
          >
            {selectedCount === 0
              ? t.marketMemorySelectFirst
              : t.marketMemorySubmit}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Round indicator ──────────────────────────────────────────────────────────

function RoundIndicator({
  roundIndex,
  totalRounds,
}: {
  roundIndex: number;
  totalRounds: number;
}) {
  const t = useStrings();
  return (
    <View style={styles.roundIndicatorRow}>
      <Text style={styles.roundIndicatorText}>
        {t.dimSumRound} {roundIndex + 1} {t.dimSumOf} {totalRounds}
      </Text>
      <View style={styles.roundDots}>
        {Array.from({ length: totalRounds }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.roundDot,
              {
                backgroundColor:
                  i < roundIndex
                    ? Colors.success
                    : i === roundIndex
                    ? Colors.primary
                    : Colors.surfaceDark,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Transition phase ─────────────────────────────────────────────────────────

function TransitionPhase() {
  const t = useStrings();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.centeredPhase}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          alignItems: 'center',
          gap: Spacing.three,
        }}
      >
        <Text style={styles.transitionEmoji}>🙈</Text>
        <Text style={styles.phaseTitle}>{t.marketMemoryHidden}</Text>
        <Text style={styles.transitionSub}>{t.marketMemoryHiddenSub}</Text>
      </Animated.View>
    </View>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function MarketMemoryGame() {
  const t = useStrings();
  const router = useRouter();
  const addCoins = usePlayerStore((s) => s.addCoins);
  const recordMoCASession = usePlayerStore((s) => s.recordMoCASession);

  const [phase, setPhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const handleStart = useCallback(() => {
    setPhase('playing');
    setCurrentRound(0);
    setRoundScores([]);
  }, []);

  const handleRoundComplete = useCallback(
    (score: number) => {
      const newScores = [...roundScores, score];
      setRoundScores(newScores);

      if (currentRound < TOTAL_ROUNDS - 1) {
        setCurrentRound((r) => r + 1);
      } else {
        // All rounds done
        const totalScore = newScores.reduce((a, b) => a + b, 0);
        const coinsEarned = Math.round((totalScore / 100) * COIN_REWARD);

        addCoins(coinsEarned);
        recordMoCASession({
          gameId: 'market-memory',
          domain: 'memory',
          score: totalScore,
          correctCount: newScores.filter((s) => s > 0).length,
          totalCount: TOTAL_ROUNDS,
        });

        router.replace({
          pathname: '/games/reward' as any,
          params: {
            correctCount: newScores.filter((s) => s > 0).length.toString(),
            wrongCount: newScores.filter((s) => s === 0).length.toString(),
            score: totalScore.toString(),
            coinsEarned: coinsEarned.toString(),
            domain: 'memory',
            gameTitle: t.marketMemoryTitle,
          },
        });
      }
    },
    [currentRound, roundScores, addCoins, recordMoCASession, router, t]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t.back}
        >
          <Text style={styles.backButtonText}>{t.back}</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>🥬 {t.marketMemoryTitle}</Text>
        <View style={styles.topBarRight} />
      </View>

      <View style={styles.phaseContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'playing' && (
          <RoundScreen
            key={currentRound}
            roundIndex={currentRound}
            totalRounds={TOTAL_ROUNDS}
            onRoundComplete={handleRoundComplete}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  backButton: {
    minWidth: 60,
    paddingVertical: Spacing.one,
  },
  backButtonText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.primary,
  },
  topBarTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  topBarRight: {
    minWidth: 60,
  },
  phaseContainer: {
    flex: 1,
  },

  // ── Shared ──
  centeredPhase: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  phaseEmoji: {
    fontSize: 64,
  },
  phaseTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  phaseSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -Spacing.three,
  },
  phaseLabel: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  phaseLabelSub: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  instructionBox: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
  instructionTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.one,
  },
  instructionStep: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  rewardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  rewardPreviewText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  rewardPreviewCoins: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.gold,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    alignSelf: 'stretch',
  },
  primaryButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },
  submitButton: {
    marginBottom: Spacing.four,
  },
  buttonDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderBottomColor: Colors.surfaceDark,
  },
  buttonDisabledText: {
    color: Colors.textSecondary,
  },

  // ── Round indicator ──
  roundContainer: {
    flex: 1,
  },
  roundIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDark,
  },
  roundIndicatorText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roundDots: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  roundDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  // ── Memorise ──
  memorisePhase: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  memoriseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memoriseHeaderText: {
    flex: 1,
    gap: Spacing.one,
  },
  memoriseGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  tipEmoji: { fontSize: 20 },
  tipText: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // ── Transition ──
  transitionEmoji: {
    fontSize: 72,
  },
  transitionSub: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ── Quiz ──
  quizPhase: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  quizHeader: {
    gap: Spacing.one,
  },
  selectionCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  selectionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  selectionCountText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: Spacing.one,
  },
  quizGrid: {
    flex: 1,
    justifyContent: 'center',
  },
});