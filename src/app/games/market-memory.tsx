// src/app/games/market-memory.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { CountdownTimer } from '@/components/games/countdown-timer';
import { ItemGrid, MarketItem } from '@/components/games/item-grid';
import { usePlayerStore } from '@/store/player-store';

// ─── Game configuration ───────────────────────────────────────────────────────

const MEMORISE_SECONDS = 5;
const COIN_REWARD = 20;

// 5 correct items the player must remember
const CORRECT_ITEMS: MarketItem[] = [
  { id: 'cabbage',  emoji: '🥬', labelCantonese: '椰菜',  isCorrect: true },
  { id: 'fish',     emoji: '🐟', labelCantonese: '魚',    isCorrect: true },
  { id: 'chicken',  emoji: '🍗', labelCantonese: '雞',    isCorrect: true },
  { id: 'egg',      emoji: '🥚', labelCantonese: '雞蛋',  isCorrect: true },
  { id: 'corn',     emoji: '🌽', labelCantonese: '粟米',  isCorrect: true },
];

// 7 distractor items — plausible wet market items elderly would know
const DISTRACTOR_ITEMS: MarketItem[] = [
  { id: 'tofu',     emoji: '🫙', labelCantonese: '豆腐',  isCorrect: false },
  { id: 'carrot',   emoji: '🥕', labelCantonese: '紅蘿蔔', isCorrect: false },
  { id: 'pork',     emoji: '🥩', labelCantonese: '豬肉',  isCorrect: false },
  { id: 'onion',    emoji: '🧅', labelCantonese: '洋蔥',  isCorrect: false },
  { id: 'potato',   emoji: '🥔', labelCantonese: '薯仔',  isCorrect: false },
  { id: 'shrimp',   emoji: '🍤', labelCantonese: '蝦',    isCorrect: false },
  { id: 'mushroom', emoji: '🍄', labelCantonese: '冬菇',  isCorrect: false },
];

// Shuffle helper — Fisher-Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Game phases ──────────────────────────────────────────────────────────────

type Phase = 'intro' | 'memorise' | 'transition' | 'quiz' | 'done';

// ─── Phase: Intro ─────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.centeredPhase}>
      <Text style={styles.phaseEmoji}>🥬</Text>
      <Text style={styles.phaseTitle}>街市記憶</Text>
      <Text style={styles.phaseSubtitle}>Market Memory</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>點樣玩？</Text>
        <Text style={styles.instructionStep}>
          1️⃣  睇住 5 樣街市貨品
        </Text>
        <Text style={styles.instructionStep}>
          2️⃣  記低佢哋（得 5 秒！）
        </Text>
        <Text style={styles.instructionStep}>
          3️⃣  答出你記得嘅貨品
        </Text>
        <Text style={styles.instructionStep}>
          4️⃣  答啱越多，積分越高！
        </Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>完成可獲得</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel="開始遊戲"
      >
        <Text style={styles.primaryButtonText}>開始遊戲 →</Text>
      </Pressable>
    </View>
  );
}

// ─── Phase: Memorise ─────────────────────────────────────────────────────────

function MemorisePhase({
  secondsLeft,
  onFinish,
}: {
  secondsLeft: number;
  onFinish: () => void;
}) {
  return (
    <View style={styles.memorisePhase}>
      {/* Header */}
      <View style={styles.memoriseHeader}>
        <View style={styles.memoriseHeaderText}>
          <Text style={styles.phaseLabel}>記住呢 5 樣嘢！</Text>
          <Text style={styles.phaseLabelSub}>記低佢哋，之後要答！</Text>
        </View>
        <CountdownTimer
          totalSeconds={MEMORISE_SECONDS}
          currentSeconds={secondsLeft}
          size={88}
          onFinish={onFinish}
        />
      </View>

      {/* Items to memorise */}
      <View style={styles.memoriseGrid}>
        <ItemGrid
          items={CORRECT_ITEMS}
          mode="memorise"
        />
      </View>

      {/* Tip */}
      <View style={styles.tipBox}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipText}>
          試吓大聲讀出每樣嘢，幫助記憶！
        </Text>
      </View>
    </View>
  );
}

// ─── Phase: Transition ────────────────────────────────────────────────────────

function TransitionPhase() {
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
        <Text style={styles.phaseTitle}>貨品收起咗！</Text>
        <Text style={styles.transitionSub}>
          而家考考你嘅記憶力⋯
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Phase: Quiz ─────────────────────────────────────────────────────────────

function QuizPhase({
  quizItems,
  selectedIds,
  onItemPress,
  onSubmit,
}: {
  quizItems: MarketItem[];
  selectedIds: Set<string>;
  onItemPress: (item: MarketItem) => void;
  onSubmit: () => void;
}) {
  const selectedCount = selectedIds.size;

  return (
    <View style={styles.quizPhase}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <Text style={styles.phaseLabel}>你記得邊 5 樣？</Text>
        <Text style={styles.phaseLabelSub}>
          揀出你記得嘅貨品
        </Text>
        {/* Selection counter */}
        <View style={styles.selectionCounter}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.selectionDot,
                {
                  backgroundColor:
                    i <= selectedCount ? Colors.primary : Colors.surfaceDark,
                },
              ]}
            />
          ))}
          <Text style={styles.selectionCountText}>
            {selectedCount} / 5
          </Text>
        </View>
      </View>

      {/* Quiz grid */}
      <View style={styles.quizGrid}>
        <ItemGrid
          items={quizItems}
          mode="quiz"
          selectedIds={selectedIds}
          onItemPress={onItemPress}
        />
      </View>

      {/* Submit button */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          styles.submitButton,
          selectedCount === 0 && styles.buttonDisabled,
          pressed && selectedCount > 0 && {
            backgroundColor: Colors.primaryDark,
          },
        ]}
        onPress={onSubmit}
        disabled={selectedCount === 0}
        accessibilityRole="button"
        accessibilityLabel="提交答案"
      >
        <Text
          style={[
            styles.primaryButtonText,
            selectedCount === 0 && styles.buttonDisabledText,
          ]}
        >
          {selectedCount === 0 ? '揀選貨品先...' : '提交答案 →'}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function MarketMemoryGame() {
  const router = useRouter();
  const addCoins = usePlayerStore((s) => s.addCoins);
  const recordMoCASession = usePlayerStore((s) => s.recordMoCASession);

  const [phase, setPhase] = useState<Phase>('intro');
  const [secondsLeft, setSecondsLeft] = useState(MEMORISE_SECONDS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Shuffle quiz items once on mount so order is random every game
  const quizItems = useRef<MarketItem[]>(
    shuffle([...CORRECT_ITEMS, ...DISTRACTOR_ITEMS])
  ).current;

  // Countdown tick during memorise phase
  useEffect(() => {
    if (phase !== 'memorise') return;

    if (secondsLeft <= 0) {
      handleMemoriseFinish();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  const handleStart = useCallback(() => {
    setPhase('memorise');
    setSecondsLeft(MEMORISE_SECONDS);
  }, []);

  const handleMemoriseFinish = useCallback(() => {
    setPhase('transition');
    // Show transition screen briefly then go to quiz
    setTimeout(() => setPhase('quiz'), 1800);
  }, []);

  const handleItemPress = useCallback((item: MarketItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    // Calculate score
    const correctCount = [...selectedIds].filter(
      (id) => CORRECT_ITEMS.some((item) => item.id === id)
    ).length;

    const wrongCount = selectedIds.size - correctCount;
    const score = Math.round((correctCount / CORRECT_ITEMS.length) * 100);

    // Award coins — partial reward for partial score
    const coinsEarned = Math.round((correctCount / CORRECT_ITEMS.length) * COIN_REWARD);
    addCoins(coinsEarned);

    // Record MoCA session
    recordMoCASession({
      gameId: 'market-memory',
      domain: 'memory',
      score,
      correctCount,
      totalCount: CORRECT_ITEMS.length,
    });

    // Navigate to reward screen with results
    router.replace({
      pathname: '/games/reward' as any,
      params: {
        correctCount: correctCount.toString(),
        wrongCount: wrongCount.toString(),
        score: score.toString(),
        coinsEarned: coinsEarned.toString(),
        domain: 'memory',
        gameTitle: '街市記憶',
      },
    });
  }, [selectedIds, addCoins, recordMoCASession, router]);

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
          accessibilityLabel="返回"
        >
          <Text style={styles.backButtonText}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>🥬 街市記憶</Text>
        <View style={styles.topBarRight} />
      </View>

      {/* Phase renderer */}
      <View style={styles.phaseContainer}>
        {phase === 'intro' && (
          <IntroPhase onStart={handleStart} />
        )}
        {phase === 'memorise' && (
          <MemorisePhase
            secondsLeft={secondsLeft}
            onFinish={handleMemoriseFinish}
          />
        )}
        {phase === 'transition' && <TransitionPhase />}
        {phase === 'quiz' && (
          <QuizPhase
            quizItems={quizItems}
            selectedIds={selectedIds}
            onItemPress={handleItemPress}
            onSubmit={handleSubmit}
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

  phaseContainer: {
    flex: 1,
  },

  // ── Shared phase styles ──
  centeredPhase: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
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

  // ── Intro ──
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

  // ── Memorise ──
  memorisePhase: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.four,
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
    paddingTop: Spacing.four,
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

  // ── Buttons ──
  primaryButton: {
    backgroundColor: Colors.primary,
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
});