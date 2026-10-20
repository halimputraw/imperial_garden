import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { DraggableStop, TramStop, StopStatus } from '@/components/games/draggable-stop';
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';

// ─── Round definitions ────────────────────────────────────────────────────────

interface Round {
  id: string;
  stops: TramStop[];          // correct order
  hintStart: string;          // western terminus label
  hintEnd: string;            // eastern terminus label
}

const ROUNDS: Round[] = [
  {
    id: 'round1',
    hintStart: '上環',
    hintEnd: '金鐘',
    stops: [
      { id: 'sheung-wan', nameCantonese: '上環', nameEnglish: 'Sheung Wan', position: 0 },
      { id: 'central',    nameCantonese: '中環', nameEnglish: 'Central',    position: 1 },
      { id: 'admiralty',  nameCantonese: '金鐘', nameEnglish: 'Admiralty',  position: 2 },
    ],
  },
  {
    id: 'round2',
    hintStart: '上環',
    hintEnd: '灣仔',
    stops: [
      { id: 'sheung-wan', nameCantonese: '上環', nameEnglish: 'Sheung Wan', position: 0 },
      { id: 'central',    nameCantonese: '中環', nameEnglish: 'Central',    position: 1 },
      { id: 'admiralty',  nameCantonese: '金鐘', nameEnglish: 'Admiralty',  position: 2 },
      { id: 'wanchai',    nameCantonese: '灣仔', nameEnglish: 'Wan Chai',   position: 3 },
    ],
  },
  {
    id: 'round3',
    hintStart: '筲箕灣',
    hintEnd: '炮台山',
    stops: [
      { id: 'shau-kei-wan',  nameCantonese: '筲箕灣', nameEnglish: 'Shau Kei Wan',  position: 0 },
      { id: 'sai-wan-ho',    nameCantonese: '西灣河', nameEnglish: 'Sai Wan Ho',    position: 1 },
      { id: 'quarry-bay',    nameCantonese: '鰂魚涌', nameEnglish: 'Quarry Bay',    position: 2 },
      { id: 'north-point',   nameCantonese: '北角',   nameEnglish: 'North Point',   position: 3 },
      { id: 'fortress-hill', nameCantonese: '炮台山', nameEnglish: 'Fortress Hill', position: 4 },
    ],
  },
  {
    id: 'round4',
    hintStart: '上環',
    hintEnd: '天后',
    stops: [
      { id: 'sheung-wan',  nameCantonese: '上環',   nameEnglish: 'Sheung Wan',    position: 0 },
      { id: 'central',     nameCantonese: '中環',   nameEnglish: 'Central',       position: 1 },
      { id: 'admiralty',   nameCantonese: '金鐘',   nameEnglish: 'Admiralty',     position: 2 },
      { id: 'wanchai',     nameCantonese: '灣仔',   nameEnglish: 'Wan Chai',      position: 3 },
      { id: 'causeway-bay',nameCantonese: '銅鑼灣', nameEnglish: 'Causeway Bay',  position: 4 },
      { id: 'tin-hau',     nameCantonese: '天后',   nameEnglish: 'Tin Hau',       position: 5 },
    ],
  },
  {
    id: 'round5',
    hintStart: '堅尼地城',
    hintEnd: '銅鑼灣',
    stops: [
      { id: 'kennedy-town', nameCantonese: '堅尼地城', nameEnglish: 'Kennedy Town', position: 0 },
      { id: 'sai-ying-pun', nameCantonese: '西營盤',   nameEnglish: 'Sai Ying Pun', position: 1 },
      { id: 'sheung-wan',   nameCantonese: '上環',     nameEnglish: 'Sheung Wan',   position: 2 },
      { id: 'central',      nameCantonese: '中環',     nameEnglish: 'Central',      position: 3 },
      { id: 'admiralty',    nameCantonese: '金鐘',     nameEnglish: 'Admiralty',    position: 4 },
      { id: 'wanchai',      nameCantonese: '灣仔',     nameEnglish: 'Wan Chai',     position: 5 },
      { id: 'causeway-bay', nameCantonese: '銅鑼灣',   nameEnglish: 'Causeway Bay', position: 6 },
    ],
  },
];

const COIN_REWARD = 35;

// ─── Shuffle helper ───────────────────────────────────────────────────────────

function shuffleStops(stops: TramStop[]): TramStop[] {
  const arr = [...stops];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((s, idx) => ({ ...s, position: idx }));
}

// ─── Pixel art tram map ───────────────────────────────────────────────────────

function TramMap({
  round,
  userOrder,
  showCorrect,
}: {
  round: Round;
  userOrder: TramStop[];
  showCorrect: boolean;
}) {
  const displayStops = showCorrect ? round.stops : userOrder;

  return (
    <View style={styles.tramMap}>
      {/* Map background */}
      <View style={styles.tramMapBg}>
        {/* Harbour water strip */}
        <View style={styles.harbourStrip}>
          <Text style={styles.harbourLabel}>維多利亞港 ⛵</Text>
        </View>

        {/* Tram line */}
        <View style={styles.tramLineContainer}>
          {/* The line itself */}
          <View style={styles.tramLine} />

          {/* Tram icon */}
          <Text style={styles.tramIcon}>🚋</Text>

          {/* Stop markers */}
          <View style={styles.stopMarkersRow}>
            {round.stops.map((_, i) => (
              <View key={i} style={styles.stopMarkerWrapper}>
                <View style={styles.stopMarkerDot} />
                <View style={styles.stopMarkerLine} />
              </View>
            ))}
          </View>
        </View>

        {/* Direction labels */}
        <View style={styles.directionRow}>
          <Text style={styles.directionLabel}>← 西 West</Text>
          <Text style={styles.directionLabel}>東 East →</Text>
        </View>
      </View>

      {/* Correct stop names below map (greyed out reference) */}
      <View style={styles.referenceStops}>
        {round.stops.map((stop, i) => (
          <View key={stop.id} style={styles.referenceStop}>
            <Text style={styles.referenceStopName}>{stop.nameCantonese}</Text>
            {i < round.stops.length - 1 && (
              <Text style={styles.referenceArrow}>›</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Feedback banner ──────────────────────────────────────────────────────────

function FeedbackBanner({
  status,
  attemptsLeft,
  onNext,
  onShowAnswer,
  isLastRound,
}: {
  status: 'correct' | 'wrong' | null;
  attemptsLeft: number;
  onNext: () => void;
  onShowAnswer: () => void;
  isLastRound: boolean;
}) {
  const t = useStrings();
  if (!status) return null;

  return (
    <View
      style={[
        styles.feedbackBanner,
        { backgroundColor: status === 'correct' ? Colors.success : Colors.error },
      ]}
    >
      <Text style={styles.feedbackText}>
        {status === 'correct' ? t.tramCorrect : t.tramWrong}
      </Text>
      {status === 'correct' && (
        <Pressable
          style={styles.feedbackButton}
          onPress={onNext}
          accessibilityRole="button"
        >
          <Text style={styles.feedbackButtonText}>
            {isLastRound ? '完成 →' : t.tramNextRound}
          </Text>
        </Pressable>
      )}
      {status === 'wrong' && attemptsLeft === 0 && (
        <Pressable
          style={styles.feedbackButton}
          onPress={onShowAnswer}
          accessibilityRole="button"
        >
          <Text style={styles.feedbackButtonText}>{t.tramShowAnswer}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Round screen ─────────────────────────────────────────────────────────────

function RoundScreen({
  round,
  roundIndex,
  totalRounds,
  onRoundComplete,
}: {
  round: Round;
  roundIndex: number;
  totalRounds: number;
  onRoundComplete: (score: number) => void;
}) {
  const t = useStrings();
  const [userStops, setUserStops] = useState<TramStop[]>(() =>
    shuffleStops(round.stops)
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(1); // 1 retry allowed
  const [stopStatuses, setStopStatuses] = useState<Record<string, StopStatus>>(
    () => Object.fromEntries(round.stops.map((s) => [s.id, 'default']))
  );
  const [showCorrect, setShowCorrect] = useState(false);
  const [containerWidth, setContainerWidth] = useState(300);

  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollMax, setScrollMax] = useState(999);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const handleDragEnd = useCallback(
    (stopId: string, newIndex: number) => {
      if (feedback === 'correct') return;
      setUserStops((prev) => {
        const arr = [...prev];
        const oldIndex = arr.findIndex((s) => s.id === stopId);
        if (oldIndex === -1 || oldIndex === newIndex) return prev;
        const [moved] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, moved);
        return arr.map((s, i) => ({ ...s, position: i }));
      });
    },
    [feedback]
  );

  const handleConfirm = useCallback(() => {
    // Check if order matches correct order
    const isCorrect = userStops.every(
      (stop, idx) => stop.id === round.stops[idx].id
    );

    if (isCorrect) {
      // Mark all green
      setStopStatuses(
        Object.fromEntries(round.stops.map((s) => [s.id, 'correct']))
      );
      setFeedback('correct');
      const score = attemptsLeft === 1 ? 20 : 10;
      setTimeout(() => onRoundComplete(score), 800);
    } else {
      // Mark wrong ones red
      const statuses: Record<string, StopStatus> = {};
      userStops.forEach((stop, idx) => {
        statuses[stop.id] =
          stop.id === round.stops[idx].id ? 'correct' : 'wrong';
      });
      setStopStatuses(statuses);
      setFeedback('wrong');

      if (attemptsLeft > 0) {
        // Reset after 1.5s for retry
        setTimeout(() => {
          setFeedback(null);
          setAttemptsLeft((a) => a - 1);
          setStopStatuses(
            Object.fromEntries(round.stops.map((s) => [s.id, 'default']))
          );
        }, 1500);
      }
    }
  }, [userStops, round, attemptsLeft, onRoundComplete]);

  const handleShowAnswer = useCallback(() => {
    setShowCorrect(true);
    setUserStops(round.stops);
    setStopStatuses(
      Object.fromEntries(round.stops.map((s) => [s.id, 'correct']))
    );
    setTimeout(() => onRoundComplete(0), 2000);
  }, [round, onRoundComplete]);

  const handleNext = useCallback(() => {
    onRoundComplete(attemptsLeft === 1 ? 20 : 10);
  }, [attemptsLeft, onRoundComplete]);

  const chipWidth = containerWidth > 0
  ? Math.max(
      72,
      (containerWidth - Spacing.two * (userStops.length - 1)) / userStops.length
    )
  : 72;

  return (
    <View style={styles.roundScreen}>
      {/* Round indicator */}
      <View style={styles.roundIndicator}>
        <Text style={styles.roundLabel}>
          {t.tramRound} {roundIndex + 1} {t.tramOf} {totalRounds}
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

      {/* Tram map */}
      <TramMap
        round={round}
        userOrder={userStops}
        showCorrect={showCorrect}
      />

      {/* Prompt */}
      <View>
        <Text style={styles.phaseLabel}>{t.tramPrompt}</Text>
        <Text style={styles.phaseLabelSub}>{t.tramPromptSub}</Text>
      </View>

      {/* Draggable stops */}
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          onLayout={handleLayout}
          onScroll={(e) => {
            const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
            setScrollX(contentOffset.x);
            setScrollMax(contentSize.width - layoutMeasurement.width);
          }}
          scrollEventThrottle={16}
          ref={scrollRef}
          contentContainerStyle={styles.stopsContainer}
        >
          {userStops.map((stop, index) => (
            <DraggableStop
              key={stop.id}
              stop={stop}
              index={index}
              status={stopStatuses[stop.id] ?? 'default'}
              onDragEnd={handleDragEnd}
              totalStops={userStops.length}
              containerWidth={containerWidth}
              chipWidth={chipWidth}
            />
          ))}
        </ScrollView>
        {/* Scroll hint arrows */}
        <View style={styles.scrollHints}>
          <Pressable
            onPress={() => scrollRef.current?.scrollTo({ x: 0, animated: true })}
            style={[styles.scrollArrow, scrollX <= 0 && styles.scrollArrowHidden]}
          >
            <Text style={styles.scrollArrowText}>‹ 左</Text>
          </Pressable>
          <Pressable
            onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            style={[styles.scrollArrow, scrollX >= scrollMax - 2 && styles.scrollArrowHidden]}
          >
            <Text style={styles.scrollArrowText}>右 ›</Text>
          </Pressable>
        </View>
      </View>

      {/* Feedback banner */}
      <FeedbackBanner
        status={feedback}
        attemptsLeft={attemptsLeft}
        onNext={handleNext}
        onShowAnswer={handleShowAnswer}
        isLastRound={roundIndex === totalRounds - 1}
      />

      {/* Confirm button */}
      {!feedback && (
        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && { backgroundColor: Colors.primaryDark },
          ]}
          onPress={handleConfirm}
          accessibilityRole="button"
          accessibilityLabel={t.tramConfirm}
        >
          <Text style={styles.confirmButtonText}>{t.tramConfirm}</Text>
        </Pressable>
      )}
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
      <Text style={styles.phaseEmoji}>🚋</Text>
      <Text style={styles.phaseTitle}>{t.tramTitle}</Text>
      <Text style={styles.phaseSubtitle}>{t.tramSubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.tramHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.tramStep1}</Text>
        <Text style={styles.instructionStep}>{t.tramStep2}</Text>
        <Text style={styles.instructionStep}>{t.tramStep3}</Text>
        <Text style={styles.instructionStep}>{t.tramStep4}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.tramRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.tramStart}
      >
        <Text style={styles.primaryButtonText}>{t.tramStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Complete phase ───────────────────────────────────────────────────────────

function CompletePhase({ totalScore }: { totalScore: number }) {
  const t = useStrings();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
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
        <Text style={styles.phaseTitle}>{t.tramComplete}</Text>
        <Text style={styles.phaseLabelSub}>{t.tramCompleteSub}</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeLabel}>{t.tramTotalScore}</Text>
          <Text style={styles.scoreBadgeValue}>{totalScore}</Text>
          {totalScore === 100 && (
            <Text style={styles.perfectLabel}>{t.tramPerfect}</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function TramRouteGame() {
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

      if (currentRound < ROUNDS.length - 1) {
        setCurrentRound((r) => r + 1);
      } else {
        // All rounds done
        const totalScore = newScores.reduce((a, b) => a + b, 0);
        const normalizedScore = Math.round((totalScore / 100) * 100);
        const coinsEarned = Math.round((totalScore / 100) * COIN_REWARD);

        setPhase('complete');

        addCoins(coinsEarned);
        recordMoCASession({
          gameId: 'tram-route',
          domain: 'visuospatial',
          score: normalizedScore,
          correctCount: newScores.filter((s) => s > 0).length,
          totalCount: ROUNDS.length,
        });

        setTimeout(() => {
          router.replace({
            pathname: '/games/reward' as any,
            params: {
              correctCount: newScores.filter((s) => s > 0).length.toString(),
              wrongCount: newScores.filter((s) => s === 0).length.toString(),
              score: normalizedScore.toString(),
              coinsEarned: coinsEarned.toString(),
              domain: 'visuospatial',
              gameTitle: t.tramTitle,
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
        <Text style={styles.topBarTitle}>🚋 {t.tramTitle}</Text>
        <View style={styles.topBarRight} />
      </View>

      {/* Phase renderer */}
      <View style={styles.phaseContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'playing' && (
          <RoundScreen
            key={currentRound}
            round={ROUNDS[currentRound]}
            roundIndex={currentRound}
            totalRounds={ROUNDS.length}
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

  // ── Round screen ──
  roundScreen: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundLabel: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roundDots: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  roundDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  // ── Tram map ──
  tramMap: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    overflow: 'hidden',
  },
  tramMapBg: {
    backgroundColor: Colors.mapBg,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  harbourStrip: {
    backgroundColor: Colors.mapWater,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
    alignItems: 'center',
  },
  harbourLabel: {
    fontSize: FontSize.tiny,
    color: Colors.white,
    fontWeight: '600',
  },
  tramLineContainer: {
    paddingVertical: Spacing.two,
    position: 'relative',
    alignItems: 'center',
  },
  tramLine: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    height: 4,
    backgroundColor: Colors.primary,
    top: '50%',
    borderRadius: 2,
  },
  tramIcon: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: Spacing.two,
  },
  stopMarkersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Spacing.two,
  },
  stopMarkerWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  stopMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  stopMarkerLine: {
    width: 2,
    height: 8,
    backgroundColor: Colors.primary,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  directionLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  referenceStops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: 2,
    alignItems: 'center',
  },
  referenceStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  referenceStopName: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  referenceArrow: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  // ── Stops container ──
  stopsContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingRight: Spacing.four,
    minHeight: 90,
    alignItems: 'flex-start', 
  },

  // ── Feedback ──
  feedbackBanner: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  feedbackText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
    flex: 1,
  },
  feedbackButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  feedbackButtonText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Confirm button ──
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    marginBottom: Spacing.four,
  },
  confirmButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Complete ──
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
  scrollHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginTop: 2,
  },
  scrollArrow: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    backgroundColor: Colors.surfaceDark,
    borderRadius: Spacing.two,
  },
  scrollArrowHidden: {
    opacity: 0,
  },
  scrollArrowText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.primary,
  }
});