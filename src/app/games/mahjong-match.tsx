import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { MahjongTile, MahjongTileData, TileState } from '@/components/games/mahjong-tile';
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';
import { CountdownTimer } from '@/components/games/countdown-timer';

// ─── Tile definitions ─────────────────────────────────────────────────────────

const TILE_PAIRS: Omit<MahjongTileData, 'id'>[] = [
  { pairId: 'east',  symbol: '🀀', label: '東風', color: '#E8A838' },
  { pairId: 'south', symbol: '🀁', label: '南風', color: '#6BAF6B' },
  { pairId: 'west',  symbol: '🀂', label: '西風', color: '#7A9CC4' },
  { pairId: 'north', symbol: '🀃', label: '北風', color: '#9B6BB5' },
  { pairId: 'chung', symbol: '🀄', label: '中',   color: '#D94F3D' },
  { pairId: 'faat',  symbol: '🀅', label: '發',   color: '#4E9E6B' },
  { pairId: 'bak',   symbol: '🀆', label: '白',   color: '#A0A0A0' },
  { pairId: 'one',   symbol: '🀇', label: '一萬', color: '#C47A3A' },
];

const COIN_REWARD = 30;
const PREVIEW_SECONDS = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTiles(): MahjongTileData[] {
  const tiles: MahjongTileData[] = [];
  TILE_PAIRS.forEach((pair) => {
    tiles.push({ ...pair, id: `${pair.pairId}-0` });
    tiles.push({ ...pair, id: `${pair.pairId}-1` });
  });
  return shuffle(tiles);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function calculateScore(moves: number, seconds: number): number {
  const optimalMoves = TILE_PAIRS.length; // 8
  const extraMoves = Math.max(0, moves - optimalMoves);
  const timePenalty = Math.floor(seconds / 10);
  const score = Math.max(20, 100 - extraMoves * 3 - timePenalty * 2);
  return score;
}

// ─── Game phases ──────────────────────────────────────────────────────────────

type Phase = 'intro' | 'preview' | 'play' | 'complete';

// ─── Intro phase ─────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  return (
    <ScrollView
      contentContainerStyle={styles.centeredPhase}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.phaseEmoji}>🀄</Text>
      <Text style={styles.phaseTitle}>{t.mahjongTitle}</Text>
      <Text style={styles.phaseSubtitle}>{t.mahjongSubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.mahjongHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.mahjongStep1}</Text>
        <Text style={styles.instructionStep}>{t.mahjongStep2}</Text>
        <Text style={styles.instructionStep}>{t.mahjongStep3}</Text>
        <Text style={styles.instructionStep}>{t.mahjongStep4}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.mahjongRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.mahjongStart}
      >
        <Text style={styles.primaryButtonText}>{t.mahjongStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Preview phase ────────────────────────────────────────────────────────────

function PreviewPhase({
  tiles,
  secondsLeft,
}: {
  tiles: MahjongTileData[];
  secondsLeft: number;
}) {
  const t = useStrings();
  return (
    <View style={styles.gamePhase}>
      {/* Header */}
      <View style={styles.gameHeader}>
        <View>
          <Text style={styles.phaseLabel}>{t.mahjongPreviewPrompt}</Text>
          <Text style={styles.phaseLabelSub}>{t.mahjongPreviewSub}</Text>
        </View>
        {/* Countdown bubble */}
        <CountdownTimer
        totalSeconds={PREVIEW_SECONDS}
        currentSeconds={secondsLeft}
        size={88}
        />
      </View>

      {/* Tile grid — all face up */}
      <TileGrid
        tiles={tiles}
        tileStates={Object.fromEntries(tiles.map((t) => [t.id, 'revealed' as TileState]))}
        onTilePress={() => {}}
        disabled
      />
    </View>
  );
}

// ─── Play phase ───────────────────────────────────────────────────────────────

function PlayPhase({
  tiles,
  tileStates,
  onTilePress,
  moves,
  seconds,
  disableInput,
}: {
  tiles: MahjongTileData[];
  tileStates: Record<string, TileState>;
  onTilePress: (tile: MahjongTileData) => void;
  moves: number;
  seconds: number;
  disableInput: boolean;
}) {
  const t = useStrings();
  const matchedCount = Object.values(tileStates).filter((s) => s === 'matched').length;
  const pairsFound = matchedCount / 2;

  return (
    <View style={styles.gamePhase}>
      {/* Header */}
      <View style={styles.gameHeader}>
        <View>
          <Text style={styles.phaseLabel}>{t.mahjongPlayPrompt}</Text>
          <Text style={styles.phaseLabelSub}>{t.mahjongPlaySub}</Text>
        </View>
        {/* Stats */}
        <View style={styles.statsColumn}>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>{t.mahjongMoves}</Text>
            <Text style={styles.statPillValue}>{moves}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>{t.mahjongTime}</Text>
            <Text style={styles.statPillValue}>{formatTime(seconds)}</Text>
          </View>
        </View>
      </View>

      {/* Pairs progress */}
      <View style={styles.pairsProgress}>
        {TILE_PAIRS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.pairDot,
              { backgroundColor: i < pairsFound ? Colors.success : Colors.surfaceDark },
            ]}
          />
        ))}
        <Text style={styles.pairsText}>
          {pairsFound} / {TILE_PAIRS.length}
        </Text>
      </View>

      {/* Tile grid */}
      <TileGrid
        tiles={tiles}
        tileStates={tileStates}
        onTilePress={onTilePress}
        disabled={disableInput}
      />
    </View>
  );
}

// ─── Complete phase ───────────────────────────────────────────────────────────

function CompletePhase({
  moves,
  seconds,
  score,
}: {
  moves: number;
  seconds: number;
  score: number;
}) {
  const t = useStrings();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.centeredPhase}>
      <Animated.View
        style={{
          alignItems: 'center',
          gap: Spacing.four,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Text style={styles.completeEmoji}>🎊</Text>
        <Text style={styles.phaseTitle}>{t.mahjongComplete}</Text>
        <Text style={styles.phaseLabelSub}>{t.mahjongCompleteSub}</Text>

        {/* Result stats */}
        <View style={styles.completeStats}>
          <View style={styles.completeStatRow}>
            <Text style={styles.completeStatLabel}>
              👟 {t.mahjongMoves}
            </Text>
            <Text style={styles.completeStatValue}>{moves}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.completeStatRow}>
            <Text style={styles.completeStatLabel}>
              ⏱ {t.mahjongTimeTaken}
            </Text>
            <Text style={styles.completeStatValue}>{formatTime(seconds)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.completeStatRow}>
            <Text style={styles.completeStatLabel}>
              🧠 {t.mahjongBestMoves}
            </Text>
            <Text style={styles.completeStatValue}>
              {TILE_PAIRS.length} 步
            </Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeLabel}>分數</Text>
          <Text style={styles.scoreBadgeValue}>{score}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Tile grid ────────────────────────────────────────────────────────────────

function TileGrid({
  tiles,
  tileStates,
  onTilePress,
  disabled,
}: {
  tiles: MahjongTileData[];
  tileStates: Record<string, TileState>;
  onTilePress: (tile: MahjongTileData) => void;
  disabled: boolean;
}) {
  // 4 columns x 4 rows for 16 tiles
  const rows: MahjongTileData[][] = [];
  for (let i = 0; i < tiles.length; i += 4) {
    rows.push(tiles.slice(i, i + 4));
  }

  return (
    <View style={styles.tileGrid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tileRow}>
          {row.map((tile) => (
            <MahjongTile
              key={tile.id}
              tile={tile}
              state={tileStates[tile.id] ?? 'hidden'}
              onPress={onTilePress}
              disabled={disabled}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function MahjongMatchGame() {
  const t = useStrings();
  const router = useRouter();
  const addCoins = usePlayerStore((s) => s.addCoins);
  const recordMoCASession = usePlayerStore((s) => s.recordMoCASession);

  const [phase, setPhase] = useState<Phase>('intro');
  const [tiles] = useState<MahjongTileData[]>(buildTiles);
  const [tileStates, setTileStates] = useState<Record<string, TileState>>(
    () => Object.fromEntries(tiles.map((t) => [t.id, 'hidden' as TileState]))
  );
  const [previewSeconds, setPreviewSeconds] = useState(PREVIEW_SECONDS);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [disableInput, setDisableInput] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // ── Preview countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'preview') return;
    if (previewSeconds <= 0) {
      // Flip all tiles back down and start play phase
      setTileStates(
        Object.fromEntries(tiles.map((t) => [t.id, 'hidden' as TileState]))
      );
      setPhase('play');
      return;
    }
    const timer = setTimeout(() => {
      setPreviewSeconds((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, previewSeconds, tiles]);

  // ── Stopwatch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'play') return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // ── Check win condition ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'play') return;
    const allMatched = tiles.every(
      (tile) => tileStates[tile.id] === 'matched'
    );
    if (allMatched && tiles.length > 0) {
      const score = calculateScore(moves, seconds);
      setFinalScore(score);
      setPhase('complete');

      // Small delay then navigate to reward
      setTimeout(() => {
        const coinsEarned = Math.round((score / 100) * COIN_REWARD);
        addCoins(coinsEarned);
        recordMoCASession({
          gameId: 'mahjong-match',
          domain: 'attention',
          score,
          correctCount: TILE_PAIRS.length,
          totalCount: TILE_PAIRS.length,
        });
        router.replace({
          pathname: '/games/reward' as any,
          params: {
            correctCount: TILE_PAIRS.length.toString(),
            wrongCount: '0',
            score: score.toString(),
            coinsEarned: coinsEarned.toString(),
            domain: 'attention',
            gameTitle: t.mahjongTitle,
          },
        });
      }, 2500);
    }
  }, [tileStates, phase, tiles]);

  // ── Tile press handler ────────────────────────────────────────────────────
  const handleTilePress = useCallback(
    (tile: MahjongTileData) => {
      if (disableInput) return;
      if (tileStates[tile.id] !== 'hidden') return;
      if (flippedIds.includes(tile.id)) return;

      // Reveal this tile
      setTileStates((prev) => ({ ...prev, [tile.id]: 'revealed' }));
      const newFlipped = [...flippedIds, tile.id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setDisableInput(true);

        const [firstId, secondId] = newFlipped;
        const firstTile = tiles.find((t) => t.id === firstId)!;
        const secondTile = tiles.find((t) => t.id === secondId)!;

        if (firstTile.pairId === secondTile.pairId) {
          // Match found!
          setTimeout(() => {
            setTileStates((prev) => ({
              ...prev,
              [firstId]: 'matched',
              [secondId]: 'matched',
            }));
            setFlippedIds([]);
            setDisableInput(false);
          }, 600);
        } else {
          // No match — flip both back down
          setTimeout(() => {
            setTileStates((prev) => ({
              ...prev,
              [firstId]: 'hidden',
              [secondId]: 'hidden',
            }));
            setFlippedIds([]);
            setDisableInput(false);
          }, 1000);
        }
      }
    },
    [disableInput, tileStates, flippedIds, tiles]
  );

  const handleStart = useCallback(() => {
    setPhase('preview');
    setPreviewSeconds(PREVIEW_SECONDS);
  }, []);

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
        <Text style={styles.topBarTitle}>🀄 {t.mahjongTitle}</Text>
        <View style={styles.topBarRight} />
      </View>

      {/* Phase renderer */}
      <View style={styles.phaseContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'preview' && (
          <PreviewPhase tiles={tiles} secondsLeft={previewSeconds} />
        )}
        {phase === 'play' && (
          <PlayPhase
            tiles={tiles}
            tileStates={tileStates}
            onTilePress={handleTilePress}
            moves={moves}
            seconds={seconds}
            disableInput={disableInput}
          />
        )}
        {phase === 'complete' && (
          <CompletePhase
            moves={moves}
            seconds={seconds}
            score={finalScore}
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

  // ── Game phase (preview + play) ──
  gamePhase: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Stats ──
  statsColumn: {
    gap: Spacing.one,
    alignItems: 'flex-end',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    minWidth: 100,
  },
  statPillLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  statPillValue: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Pairs progress ──
  pairsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  pairDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  pairsText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: Spacing.two,
  },

  // ── Tile grid ──
  tileGrid: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.three,
  },

  // ── Complete ──
  completeEmoji: {
    fontSize: 72,
  },
  completeStats: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
  completeStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completeStatLabel: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  completeStatValue: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceDark,
  },
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
});