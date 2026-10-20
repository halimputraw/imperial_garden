import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { CountdownTimer } from '@/components/games/countdown-timer';
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';

// ─── Dish definitions ─────────────────────────────────────────────────────────

interface Dish {
  id: string;
  emoji: string;
  nameCantonese: string;
  nameEnglish: string;
  color: string;
}

// All possible dishes — correct ones + distractors pulled from this pool
const ALL_DISHES: Dish[] = [
  { id: 'har-gau',    emoji: '🥟', nameCantonese: '蝦餃',   nameEnglish: 'Har Gau',      color: '#E8D4B8' },
  { id: 'siu-mai',   emoji: '🫕', nameCantonese: '燒賣',   nameEnglish: 'Siu Mai',      color: '#F4A460' },
  { id: 'cheung-fun',emoji: '🌯', nameCantonese: '腸粉',   nameEnglish: 'Cheung Fun',   color: '#F5F5DC' },
  { id: 'lo-mai-gai',emoji: '🍙', nameCantonese: '糯米雞', nameEnglish: 'Lo Mai Gai',   color: '#90EE90' },
  { id: 'char-siu-bao',emoji:'🥐',nameCantonese: '叉燒包', nameEnglish: 'Char Siu Bao', color: '#FFD700' },
  { id: 'egg-tart',  emoji: '🥧', nameCantonese: '蛋撻',   nameEnglish: 'Egg Tart',     color: '#FFD700' },
  { id: 'turnip-cake',emoji:'🟨', nameCantonese: '蘿蔔糕', nameEnglish: 'Turnip Cake',  color: '#F5DEB3' },
  { id: 'taro-dump', emoji: '🫔', nameCantonese: '芋角',   nameEnglish: 'Taro Dumpling',color: '#DDA0DD' },
  { id: 'spring-roll',emoji:'🥖', nameCantonese: '春卷',   nameEnglish: 'Spring Roll',  color: '#DAA520' },
  { id: 'custard-bun',emoji:'🍞', nameCantonese: '奶黃包', nameEnglish: 'Custard Bun',  color: '#FFFACD' },
  { id: 'tripe',     emoji: '🫀', nameCantonese: '牛雜',   nameEnglish: 'Beef Tripe',   color: '#CD853F' },
  { id: 'mango-pudding',emoji:'🟧',nameCantonese:'芒果布甸',nameEnglish:'Mango Pudding', color: '#FFA500' },
];

const DISH_IMAGES: Record<string, any> = {
  'har-gau':       require('../../../assets/dimsum/har-gau.png'),
  'siu-mai':       require('../../../assets/dimsum/siu-mai.png'),
  'cheung-fun':    require('../../../assets/dimsum/cheung-fun.png'),
  'lo-mai-gai':    require('../../../assets/dimsum/lo-mai-gai.png'),
  'char-siu-bao':  require('../../../assets/dimsum/char-siu-bao.png'),
  'egg-tart':      require('../../../assets/dimsum/egg-tart.png'),
  'turnip-cake':   require('../../../assets/dimsum/turnip-cake.png'),
  'taro-dump':     require('../../../assets/dimsum/taro-dump.png'),
  'spring-roll':   require('../../../assets/dimsum/spring-roll.png'),
  'custard-bun':   require('../../../assets/dimsum/custard-bun.png'),
  'tripe':         require('../../../assets/dimsum/tripe.png'),
  'mango-pudding': require('../../../assets/dimsum/mango-pudding.png'),
};

const COIN_REWARD = 35;

// ─── Round config ─────────────────────────────────────────────────────────────

interface RoundConfig {
  dishCount: number;      // how many dishes to show in correct order
  showSeconds: number;    // how long to show them
  distractorCount: number;// extra wrong dishes
}

const ROUND_CONFIGS: RoundConfig[] = [
  { dishCount: 2, showSeconds: 4, distractorCount: 2 },
  { dishCount: 3, showSeconds: 5, distractorCount: 2 },
  { dishCount: 4, showSeconds: 6, distractorCount: 2 },
  { dishCount: 5, showSeconds: 7, distractorCount: 2 },
  { dishCount: 6, showSeconds: 8, distractorCount: 2 },
];

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
  correctOrder: Dish[];
  quizDishes: Dish[];
} {
  const shuffledAll = shuffle(ALL_DISHES);
  const correctOrder = shuffledAll.slice(0, config.dishCount);
  const distractors = shuffledAll.slice(
    config.dishCount,
    config.dishCount + config.distractorCount
  );
  const quizDishes = shuffle([...correctOrder, ...distractors]);
  return { correctOrder, quizDishes };
}

// ─── Dish card ────────────────────────────────────────────────────────────────

type DishCardMode = 'show' | 'quiz-default' | 'quiz-selected' | 'quiz-wrong' | 'quiz-correct';

interface DishCardProps {
  dish: Dish;
  mode: DishCardMode;
  tapOrder?: number;      // shows the tap order number when selected
  onPress?: () => void;
}

function DishCard({ dish, mode, tapOrder, onPress }: DishCardProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Shake on wrong
  useEffect(() => {
    if (mode === 'quiz-wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [mode, shakeAnim]);

  // Bounce on correct tap
  useEffect(() => {
    if (mode === 'quiz-selected') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          speed: 40,
          bounciness: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 4,
        }),
      ]).start();
    }
  }, [mode, scaleAnim]);

  const bgColor =
    mode === 'quiz-selected' ? Colors.success
    : mode === 'quiz-wrong'   ? Colors.error
    : mode === 'quiz-correct' ? Colors.success
    : Colors.surface;

  const borderColor =
    mode === 'quiz-selected' ? Colors.success
    : mode === 'quiz-wrong'   ? Colors.error
    : mode === 'quiz-correct' ? Colors.success
    : Colors.surfaceDark;

  const textColor =
    mode === 'quiz-selected' || mode === 'quiz-wrong' || mode === 'quiz-correct'
      ? Colors.white
      : Colors.textPrimary;

  return (
    <Animated.View
      style={{
        transform: [
          { translateX: shakeAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress || mode !== 'quiz-default'}
        accessible
        accessibilityRole="button"
        accessibilityLabel={dish.nameCantonese}
        style={[
          styles.dishCard,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
      >
        {/* Tap order badge */}
        {tapOrder !== undefined && (
          <View style={styles.tapOrderBadge}>
            <Text style={styles.tapOrderText}>{tapOrder}</Text>
          </View>
        )}

        {/* Show order number during show phase */}
        {mode === 'show' && (
          <View style={styles.showOrderBadge}>
            <Text style={styles.showOrderText}>★</Text>
          </View>
        )}

        {DISH_IMAGES[dish.id] ? (
          <Image
            source={DISH_IMAGES[dish.id]}
            style={{ width: 56, height: 56 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.dishEmoji}>{dish.emoji}</Text>
        )}
        
        <Text
          style={[styles.dishName, { color: textColor }]}
          numberOfLines={1}
        >
          {dish.nameCantonese}
        </Text>
        <Text
          style={[styles.dishNameEn, { color: textColor, opacity: 0.75 }]}
          numberOfLines={1}
        >
          {dish.nameEnglish}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Show phase ───────────────────────────────────────────────────────────────

function ShowPhase({
  correctOrder,
  secondsLeft,
  totalSeconds,
  roundIndex,
  totalRounds,
}: {
  correctOrder: Dish[];
  secondsLeft: number;
  totalSeconds: number;
  roundIndex: number;
  totalRounds: number;
}) {
  const t = useStrings();
  return (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.phaseHeader}>
        <View style={styles.phaseHeaderText}>
          <Text style={styles.phaseLabel}>{t.dimSumShowPrompt}</Text>
          <Text style={styles.phaseLabelSub}>{t.dimSumShowSub}</Text>
        </View>
        <CountdownTimer
          totalSeconds={totalSeconds}
          currentSeconds={secondsLeft}
          size={80}
        />
      </View>

      {/* Correct order — shown in sequence */}
      <View style={styles.showGrid}>
        {correctOrder.map((dish, i) => (
            <View key={dish.id} style={styles.showGridCell}>
            {/* Order number badge */}
            <View style={styles.orderNumberCircle}>
                <Text style={styles.orderNumberText}>{i + 1}</Text>
            </View>
            <DishCard dish={dish} mode="show" />
            </View>
        ))}
      </View>

      {/* Round progress dots */}
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

// ─── Quiz phase ───────────────────────────────────────────────────────────────

function QuizPhase({
  correctOrder,
  quizDishes,
  tappedIds,
  wrongId,
  onDishPress,
  roundIndex,
  totalRounds,
  attempts,
}: {
  correctOrder: Dish[];
  quizDishes: Dish[];
  tappedIds: string[];
  wrongId: string | null;
  onDishPress: (dish: Dish) => void;
  roundIndex: number;
  totalRounds: number;
  attempts: number;
}) {
  const t = useStrings();

  const getDishMode = (dish: Dish): DishCardMode => {
    if (dish.id === wrongId) return 'quiz-wrong';
    if (tappedIds.includes(dish.id)) return 'quiz-selected';
    return 'quiz-default';
  };

  const getTapOrder = (dish: Dish): number | undefined => {
    const idx = tappedIds.indexOf(dish.id);
    return idx >= 0 ? idx + 1 : undefined;
  };

  // Arrange quiz dishes in a grid — 3 columns
  const rows: Dish[][] = [];
  for (let i = 0; i < quizDishes.length; i += 3) {
    rows.push(quizDishes.slice(i, i + 3));
  }

  return (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.phaseHeader}>
        <View style={styles.phaseHeaderText}>
          <Text style={styles.phaseLabel}>{t.dimSumQuizPrompt}</Text>
          <Text style={styles.phaseLabelSub}>{t.dimSumQuizSub}</Text>
        </View>
        {/* Attempts indicator */}
        <View style={styles.attemptsIndicator}>
          <Text style={styles.attemptsLabel}>{t.dimSumAttempts}</Text>
          <Text style={styles.attemptsValue}>{attempts}</Text>
        </View>
      </View>

      {/* Progress — how many tapped correctly so far */}
      <View style={styles.progressRow}>
        {correctOrder.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i < tappedIds.length ? Colors.success : Colors.surfaceDark,
              },
            ]}
          />
        ))}
        <Text style={styles.progressText}>
          {tappedIds.length} / {correctOrder.length}
        </Text>
      </View>

      {/* Dish grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.quizGrid}
      >
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.quizRow}>
            {row.map((dish) => (
              <View key={dish.id} style={styles.quizCell}>
                <DishCard
                  dish={dish}
                  mode={getDishMode(dish)}
                  tapOrder={getTapOrder(dish)}
                  onPress={
                    getDishMode(dish) === 'quiz-default'
                      ? () => onDishPress(dish)
                      : undefined
                  }
                />
              </View>
            ))}
            {/* Fill empty cells in last row */}
            {row.length < 3 &&
              Array(3 - row.length)
                .fill(null)
                .map((_, i) => (
                  <View key={`empty-${i}`} style={styles.quizCell} />
                ))}
          </View>
        ))}
      </ScrollView>

      {/* Round progress dots */}
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

// ─── Intro phase ──────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  return (
    <ScrollView
      contentContainerStyle={styles.centeredPhase}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.phaseEmoji}>🍡</Text>
      <Text style={styles.bigTitle}>{t.dimSumTitle}</Text>
      <Text style={styles.bigSubtitle}>{t.dimSumSubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.dimSumHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.dimSumStep1}</Text>
        <Text style={styles.instructionStep}>{t.dimSumStep2}</Text>
        <Text style={styles.instructionStep}>{t.dimSumStep3}</Text>
        <Text style={styles.instructionStep}>{t.dimSumStep4}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.dimSumRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.dimSumStart}
      >
        <Text style={styles.primaryButtonText}>{t.dimSumStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Complete phase ───────────────────────────────────────────────────────────

function CompletePhase({ totalScore }: { totalScore: number }) {
  const t = useStrings();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
      bounciness: 10,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.centeredPhase}>
      <Animated.View
        style={{
          alignItems: 'center',
          gap: Spacing.four,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={styles.phaseEmoji}>🎊</Text>
        <Text style={styles.bigTitle}>{t.dimSumComplete}</Text>
        <Text style={styles.phaseLabelSub}>{t.dimSumCompleteSub}</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeLabel}>{t.dimSumTotalScore}</Text>
          <Text style={styles.scoreBadgeValue}>{totalScore}</Text>
          {totalScore === 100 && (
            <Text style={styles.perfectLabel}>{t.dimSumPerfect}</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Round screen ─────────────────────────────────────────────────────────────

function RoundScreen({
  config,
  roundIndex,
  totalRounds,
  onRoundComplete,
}: {
  config: RoundConfig;
  roundIndex: number;
  totalRounds: number;
  onRoundComplete: (score: number) => void;
}) {
  const t = useStrings();
  const [phase, setPhase] = useState<'show' | 'quiz'>('show');
  const [secondsLeft, setSecondsLeft] = useState(config.showSeconds);
  const [round] = useState(() => buildRound(config));
  const [tappedIds, setTappedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [roundScore, setRoundScore] = useState(20);

  // Show phase countdown
  useEffect(() => {
    if (phase !== 'show') return;
    if (secondsLeft <= 0) {
      setPhase('quiz');
      return;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  const handleDishPress = useCallback(
    (dish: Dish) => {
      const expectedIndex = tappedIds.length;
      const expectedDish = round.correctOrder[expectedIndex];

      if (dish.id === expectedDish.id) {
        // Correct tap
        const newTapped = [...tappedIds, dish.id];
        setTappedIds(newTapped);
        setWrongId(null);

        // Check if round complete
        if (newTapped.length === round.correctOrder.length) {
          setTimeout(() => onRoundComplete(roundScore), 800);
        }
      } else {
        // Wrong tap — flash red, reset after delay
        setWrongId(dish.id);
        setAttempts((a) => a + 1);
        setRoundScore((s) => Math.max(0, s - 4));

        setTimeout(() => {
          setWrongId(null);
          setTappedIds([]); // reset progress
        }, 1000);
      }
    },
    [tappedIds, round, roundScore, onRoundComplete]
  );

  return (
    <View style={styles.roundWrapper}>
      {/* Round label */}
      <View style={styles.roundLabelRow}>
        <Text style={styles.roundLabelText}>
          {t.dimSumRound} {roundIndex + 1} {t.dimSumOf} {totalRounds}
        </Text>
        <Text style={styles.roundScoreText}>
          {t.dimSumTotalScore}: {roundScore}
        </Text>
      </View>

      {phase === 'show' ? (
        <ShowPhase
          correctOrder={round.correctOrder}
          secondsLeft={secondsLeft}
          totalSeconds={config.showSeconds}
          roundIndex={roundIndex}
          totalRounds={totalRounds}
        />
      ) : (
        <QuizPhase
          correctOrder={round.correctOrder}
          quizDishes={round.quizDishes}
          tappedIds={tappedIds}
          wrongId={wrongId}
          onDishPress={handleDishPress}
          roundIndex={roundIndex}
          totalRounds={totalRounds}
          attempts={attempts}
        />
      )}
    </View>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function DimSumOrderGame() {
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

      if (currentRound < ROUND_CONFIGS.length - 1) {
        setCurrentRound((r) => r + 1);
      } else {
        const totalScore = newScores.reduce((a, b) => a + b, 0);
        const coinsEarned = Math.round((totalScore / 100) * COIN_REWARD);

        setPhase('complete');
        addCoins(coinsEarned);
        recordMoCASession({
          gameId: 'dim-sum-order',
          domain: 'executive',
          score: totalScore,
          correctCount: newScores.filter((s) => s > 0).length,
          totalCount: ROUND_CONFIGS.length,
        });

        setTimeout(() => {
          router.replace({
            pathname: '/games/reward' as any,
            params: {
              correctCount: newScores.filter((s) => s > 0).length.toString(),
              wrongCount: newScores.filter((s) => s === 0).length.toString(),
              score: totalScore.toString(),
              coinsEarned: coinsEarned.toString(),
              domain: 'executive',
              gameTitle: t.dimSumTitle,
            },
          });
        }, 2500);
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
        <Text style={styles.topBarTitle}>🍡 {t.dimSumTitle}</Text>
        <View style={styles.topBarRight} />
      </View>

      <View style={styles.screenContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'playing' && (
          <RoundScreen
            key={currentRound}
            config={ROUND_CONFIGS[currentRound]}
            roundIndex={currentRound}
            totalRounds={ROUND_CONFIGS.length}
            onRoundComplete={handleRoundComplete}
          />
        )}
        {phase === 'complete' && (
          <CompletePhase
            totalScore={roundScores.reduce((a, b) => a + b, 0)}
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

  // ── Top bar ──
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
  screenContainer: {
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
  bigTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  bigSubtitle: {
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
    alignSelf: 'stretch',
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  primaryButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Round wrapper ──
  roundWrapper: {
    flex: 1,
  },
  roundLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDark,
  },
  roundLabelText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roundScoreText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  // ── Phase container ──
  phaseContainer: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phaseHeaderText: {
    flex: 1,
    gap: 2,
  },


  orderNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
    zIndex: 1,
  },
  orderNumberText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.white,
  },

  showGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  showGridCell: {
    width: '30%',
    alignItems: 'center',
    gap: Spacing.one,
  },

  showOrderBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
  showOrderText: {
    fontSize: 10,
    color: Colors.gold,
  },

  // ── Quiz phase ──
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: Spacing.two,
  },
  quizGrid: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  quizRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quizCell: {
    flex: 1,
  },
  attemptsIndicator: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  attemptsLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  attemptsValue: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Dish card ──
  dishCard: {
    borderRadius: Spacing.two,
    borderWidth: 2,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 90,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
    position: 'relative',
  },
  tapOrderBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapOrderText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  dishEmoji: {
    fontSize: 32,
  },
  dishName: {
    fontSize: FontSize.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  dishNameEn: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Round dots ──
  roundDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingBottom: Spacing.three,
  },
  roundDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  // ── Score badge ──
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.six,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    gap: 2,
  },
  scoreBadgeLabel: {
    fontSize: FontSize.small,
    color: Colors.white,
    fontWeight: '600',
    opacity: 0.85,
  },
  scoreBadgeValue: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.white,
  },
  perfectLabel: {
    fontSize: FontSize.small,
    color: Colors.white,
    fontWeight: '800',
    opacity: 0.9,
  },
});