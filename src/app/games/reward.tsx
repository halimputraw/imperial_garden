import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import {
  usePlayerStore,
  MoCADomain,
  MOCA_DOMAIN_INFO,
} from '@/store/player-store';
import { useStrings } from '@/i18n/strings';
import { useWagerStore } from '@/store/wager-store';

// ─── Coin shower animation ────────────────────────────────────────────────────

interface CoinParticle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
}

function CoinShower({ count }: { count: number }) {
  const particles = useRef<CoinParticle[]>(
    Array.from({ length: Math.min(count * 2, 12) }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * 300 - 150),
      y: new Animated.Value(-20),
      opacity: new Animated.Value(1),
      rotation: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((p) =>
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: 400,
          duration: 1200 + Math.random() * 600,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotation, {
          toValue: Math.random() > 0.5 ? 360 : -360,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(80, animations).start();
  }, []);

  return (
    <View style={styles.coinShowerContainer} pointerEvents="none">
      {particles.map((p) => {
        const rotate = p.rotation.interpolate({
          inputRange: [-360, 360],
          outputRange: ['-360deg', '360deg'],
        });
        return (
          <Animated.Text
            key={p.id}
            style={[
              styles.coinParticle,
              {
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate },
                ],
                opacity: p.opacity,
              },
            ]}
          >
            🪙
          </Animated.Text>
        );
      })}
    </View>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
// Simple visual score display — large number with label

function ScoreRing({ score }: { score: number }) {
  const t = useStrings();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 10,
      delay: 400,
    }).start();
  }, [scaleAnim]);

  const scoreColor =
    score >= 80
      ? Colors.success
      : score >= 60
      ? Colors.warning
      : Colors.error;

  const scoreLabel =
    score >= 80 ? t.rewardScoreLabelHigh
    : score >= 60 ? t.rewardScoreLabelMid
    : t.rewardScoreLabelLow;

  return (
    <Animated.View
      style={[styles.scoreRing, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={[styles.scoreRingInner, { borderColor: scoreColor }]}>
        <Text style={[styles.scoreNumber, { color: scoreColor }]}>
          {score}
        </Text>
        <Text style={styles.scoreUnit}>{t.scoreUnit}</Text>
        <Text style={[styles.scoreLabel, { color: scoreColor }]}>
          {scoreLabel}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── MoCA trend bar ───────────────────────────────────────────────────────────

function MoCAComparisonBar({
  domain,
  currentScore,
  previousScore,
}: {
  domain: MoCADomain;
  currentScore: number;
  previousScore: number | null;
}) {
  const t = useStrings();
  const info = MOCA_DOMAIN_INFO[domain];
  const fillAnim = useRef(new Animated.Value(0)).current;
  const prevFillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fillAnim, {
        toValue: currentScore / 100,
        duration: 800,
        delay: 600,
        useNativeDriver: false,
      }),
      Animated.timing(prevFillAnim, {
        toValue: previousScore ? previousScore / 100 : 0,
        duration: 800,
        delay: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fillAnim, prevFillAnim, currentScore, previousScore]);

  const trend =
    previousScore === null
      ? null
      : currentScore > previousScore
      ? 'up'
      : currentScore < previousScore
      ? 'down'
      : 'same';

  const trendEmoji =
    trend === 'up' ? '↑' : trend === 'down' ? '↓' : trend === 'same' ? '→' : '';
  const trendColor =
    trend === 'up'
      ? Colors.success
      : trend === 'down'
      ? Colors.error
      : Colors.textSecondary;

  return (
    <View style={styles.trendCard}>
      {/* Domain header */}
      <View style={styles.trendHeader}>
        <Text style={styles.trendEmoji}>{info.emoji}</Text>
        <View style={styles.trendTitleBlock}>
          <Text style={styles.trendDomain}>
            {domain === 'memory' ? t.domainMemory
            : domain === 'attention' ? t.domainAttention
            : domain === 'language' ? t.domainLanguage
            : domain === 'executive' ? t.domainExecutive
            : domain === 'visuospatial' ? t.domainVisuospatial
            : t.domainOrientation}
          </Text>
          <Text style={styles.trendDomainEn}>{info.labelEnglish}</Text>
        </View>
        {trend !== null && (
          <Text style={[styles.trendArrow, { color: trendColor }]}>
            {trendEmoji}{' '}
            {previousScore !== null
              ? `${previousScore} → ${currentScore}`
              : currentScore}
          </Text>
        )}
      </View>

      {/* Current score bar */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>{t.rewardThisTime}</Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: info.color,
              },
            ]}
          />
        </View>
        <Text style={styles.barScore}>{currentScore}</Text>
      </View>

      {/* Previous score bar */}
      {previousScore !== null && (
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>{t.rewardLastTime}</Text>
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  width: prevFillAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: "#B0B0B0",
                },
              ]}
            />
          </View>
          <Text style={styles.barScore}>{previousScore}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RewardScreen() {
  const t = useStrings();
  const router = useRouter();
  const params = useLocalSearchParams<{
    correctCount: string;
    wrongCount: string;
    score: string;
    coinsEarned: string;
    domain: string;
    gameTitle: string;
  }>();

  const correctCount = parseInt(params.correctCount ?? '0');
  const wrongCount = parseInt(params.wrongCount ?? '0');
  const score = parseInt(params.score ?? '0');
  const coinsEarned = parseInt(params.coinsEarned ?? '0');
  const domain = (params.domain ?? 'memory') as MoCADomain;
  const gameTitle = params.gameTitle ?? t.rewardGameDone;

  const coins = usePlayerStore((s) => s.coins);
  const getDomainTrend = usePlayerStore((s) => s.getDomainTrend);
  const trend = getDomainTrend(domain);

  // Entry animation
  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // ── Resolve wager ──────────────────────────────────────────────────────
  const resolveWager = useWagerStore((s) => s.resolveWager);
  const addCoins = usePlayerStore((s) => s.addCoins);
  const wagerResult = useRef<ReturnType<typeof resolveWager>>(null);
  const [wagerResolved, setWagerResolved] = useState(false);

  useEffect(() => {
    const result = resolveWager(score);
    wagerResult.current = result;
    if (result?.won && result.payout > 0) {
      addCoins(result.payout);
    }
    setWagerResolved(true);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const handleContinue = () => {
    // Go back to map — replace so reward isn't in back stack
    router.replace('/');
  };

  const handlePlayAgain = () => {
    router.replace('/games/market-memory' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Coin shower — plays on mount */}
      {coinsEarned > 0 && <CoinShower count={coinsEarned} />}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
            gap: Spacing.four,
          }}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.rewardTitle}</Text>
            <Text style={styles.headerSubtitle}>{gameTitle}</Text>
          </View>

          {/* ── Score ring ── */}
          <ScoreRing score={score} />

          {/* ── Result breakdown ── */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t.rewardGameDone}</Text>

            <View style={styles.resultRow}>
              <View style={[styles.resultBadge, { backgroundColor: Colors.success }]}>
                <Text style={styles.resultBadgeEmoji}>✓</Text>
                <Text style={styles.resultBadgeCount}>{correctCount}</Text>
                <Text style={styles.resultBadgeLabel}>{t.rewardCorrect}</Text>
              </View>

              <View style={[styles.resultBadge, { backgroundColor: Colors.error }]}>
                <Text style={styles.resultBadgeEmoji}>✗</Text>
                <Text style={styles.resultBadgeCount}>{wrongCount}</Text>
                <Text style={styles.resultBadgeLabel}>{t.rewardWrong}</Text>
              </View>

              <View style={[styles.resultBadge, { backgroundColor: Colors.gold }]}>
                <Text style={styles.resultBadgeEmoji}>🪙</Text>
                <Text style={styles.resultBadgeCount}>+{coinsEarned}</Text>
                <Text style={styles.resultBadgeLabel}>{t.rewardCoins}</Text>
                {wagerResolved && wagerResult.current?.won && (
                  <Text style={styles.resultBadgeWager}>
                    +{wagerResult.current.payout} 🎰
                  </Text>
                )}
              </View>
            </View>

            {/* Total coins */}
            <View style={styles.totalCoinsRow}>
              <Text style={styles.totalCoinsLabel}>{t.rewardTotalCoins}</Text>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                {wagerResolved && wagerResult.current && (
                  <Text style={{ fontSize: FontSize.tiny, color: Colors.textSecondary }}>
                    {t.rewardCoins}: +{coinsEarned}
                    {wagerResult.current.won
                      ? `  🎰: +${wagerResult.current.payout}`
                      : `  🎰: -${wagerResult.current.amount}`}
                  </Text>
                )}
                <Text style={styles.totalCoinsValue}>🪙 {coins}</Text>
              </View>
            </View>
          </View>

          {/* ── Wager result ── */}
          {wagerResult.current && (
            <View
              style={[
                styles.wagerResultCard,
                {
                  backgroundColor: wagerResult.current.won
                    ? `${Colors.success}22`
                    : `${Colors.error}22`,
                  borderColor: wagerResult.current.won
                    ? Colors.success
                    : Colors.error,
                },
              ]}
            >
              <Text style={styles.wagerResultEmoji}>
                {wagerResult.current.won ? '🎉' : '😔'}
              </Text>
              <View style={styles.wagerResultInfo}>
                <Text
                  style={[
                    styles.wagerResultTitle,
                    { color: wagerResult.current.won ? Colors.success : Colors.error },
                  ]}
                >
                  {wagerResult.current.won ? t.wagerWon : t.wagerLost}
                </Text>
                <Text style={styles.wagerResultDesc}>
                  {wagerResult.current.won ? t.wagerWonDesc : t.wagerLostDesc}
                </Text>
                <Text style={styles.wagerResultScore}>
                  {t.wagerCommunityAvg}: {wagerResult.current.communityAvgScore}
                  {'  '}|{'  '}
                  {t.rewardThisTime}: {wagerResult.current.playerScore}
                </Text>
              </View>
              <View style={styles.wagerResultPayout}>
                {wagerResult.current.won ? (
                  <>
                    <Text style={styles.wagerPayoutLabel}>獲得</Text>
                    <Text style={[styles.wagerPayoutValue, { color: Colors.success }]}>
                      +🪙{wagerResult.current.payout}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.wagerPayoutLabel}>損失</Text>
                    <Text style={[styles.wagerPayoutValue, { color: Colors.error }]}>
                      -🪙{wagerResult.current.amount}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {/* ── MoCA comparison ── */}
          <View style={styles.mocaSection}>
            <Text style={styles.mocaSectionTitle}>{t.rewardMoCATitle}</Text>
            <Text style={styles.mocaSectionSubtitle}>{t.rewardMoCASubtitle}</Text>

            <MoCAComparisonBar
              domain={domain}
              currentScore={score}
              previousScore={trend.previous?.score ?? null}
            />
          </View>

          {/* ── Encouragement message ── */}
          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementEmoji}>
              {score >= 80 ? '🌟' : score >= 60 ? '💪' : '🤗'}
            </Text>
            <Text style={styles.encouragementText}>
              {score >= 80
                ? t.rewardEncouragementHigh
                : score >= 60
                ? t.rewardEncouragementMid
                : t.rewardEncouragementLow}
            </Text>
          </View>

          {/* ── Action buttons ── */}
          <View style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.playAgainButton,
                pressed && { backgroundColor: Colors.surfaceDark },
              ]}
              onPress={handlePlayAgain}
              accessibilityRole="button"
              accessibilityLabel={t.rewardPlayAgain}
            >
              <Text style={styles.playAgainText}>{t.rewardPlayAgain}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && { backgroundColor: Colors.primaryDark },
              ]}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel={t.rewardBackToMap}
            >
              <Text style={styles.continueText}>{t.rewardBackToMap}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    paddingTop: Spacing.four,
  },

  // ── Coin shower ──
  coinShowerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  coinParticle: {
    position: 'absolute',
    fontSize: 24,
    top: 0,
  },

  // ── Header ──
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ── Score ring ──
  scoreRing: {
    alignItems: 'center',
  },
  scoreRingInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    gap: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 6,
  },
  scoreNumber: {
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 56,
  },
  scoreUnit: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: -4,
  },
  scoreLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '800',
  },

  // ── Result card ──
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  resultTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  resultRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  resultBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    gap: 2,
  },
  resultBadgeEmoji: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '800',
  },
  resultBadgeCount: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },
  resultBadgeLabel: {
    fontSize: FontSize.tiny,
    color: Colors.white,
    fontWeight: '600',
  },
  resultBadgeWager: {
    fontSize: FontSize.tiny,
    color: Colors.white,
    fontWeight: '800',
    opacity: 0.9,
  },
  totalCoinsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceDark,
  },
  totalCoinsLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  totalCoinsValue: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.gold,
  },

  // ── MoCA section ──
  mocaSection: {
    gap: Spacing.two,
  },
  mocaSectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  mocaSectionSubtitle: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  trendCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  trendEmoji: {
    fontSize: 28,
  },
  trendTitleBlock: {
    flex: 1,
  },
  trendDomain: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  trendDomainEn: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  trendArrow: {
    fontSize: FontSize.body,
    fontWeight: '800',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  barLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textSecondary,
    width: 44,
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  barScore: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },

  // ── Encouragement ──
  encouragementBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  encouragementEmoji: {
    fontSize: 28,
  },
  encouragementText: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 28,
  },

  // ── Buttons ──
  buttonGroup: {
    gap: Spacing.three,
  },
  playAgainButton: {
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.surface,
  },
  playAgainText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  continueButton: {
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  continueText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },

  // Wager Design
  wagerResultCard: {
    borderRadius: Spacing.three,
    borderWidth: 2,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  wagerResultEmoji: {
    fontSize: 32,
  },
  wagerResultInfo: {
    flex: 1,
    gap: 3,
  },
  wagerResultTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
  },
  wagerResultDesc: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  wagerResultScore: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  wagerResultPayout: {
    alignItems: 'center',
    gap: 2,
  },
  wagerPayoutLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  wagerPayoutValue: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
  },
});