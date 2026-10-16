// src/app/moca.tsx
// MoCA Analysis tab — builds a MoCA-style cognitive profile from the
// player's saved game history (usePlayerStore.mocaHistory, persisted in
// AsyncStorage, so it survives app restarts).

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useStrings } from '@/i18n/strings';
import {
  usePlayerStore,
  MoCADomain,
  MoCASession,
  MOCA_DOMAIN_INFO,
} from '@/store/player-store';

type Strings = ReturnType<typeof useStrings>;

// ─── MoCA mapping ─────────────────────────────────────────────────────────────
// Official MoCA = 30 points. Each app domain is mapped to the MoCA sections it
// trains, so a 0–100 game score can be converted to MoCA-style points.
//   visuospatial 4 (cube 1 + clock 3)
//   executive    3 (trail-making 1 + abstraction 2)
//   memory       5 (delayed recall)
//   attention    6 (digits, tapping, serial 7s)
//   language     6 (naming 3 + repetition/fluency 3)
//   orientation  6 (date, month, year, day, place, city)

const DOMAIN_ORDER: MoCADomain[] = [
  'memory',
  'attention',
  'executive',
  'visuospatial',
  'language',
  'orientation',
];

const MOCA_WEIGHTS: Record<MoCADomain, number> = {
  visuospatial: 4,
  executive: 3,
  memory: 5,
  attention: 6,
  language: 6,
  orientation: 6,
};

const MOCA_MAX = 30;
const RECENT_WINDOW = 3; // average of the last N plays per domain
const TREND_THRESHOLD = 3; // score difference treated as "no change"
const HISTORY_BARS = 10;
const RECENT_LIST = 8;

// Which games train which domain (empty = no game yet)
const DOMAIN_HAS_GAME: Record<MoCADomain, boolean> = {
  memory: true,
  attention: true,
  executive: true,
  visuospatial: true,
  language: true,
  orientation: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avg = (arr: number[]) =>
  arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;

function domainLabel(t: Strings, d: MoCADomain): string {
  switch (d) {
    case 'memory': return t.domainMemory;
    case 'attention': return t.domainAttention;
    case 'language': return t.domainLanguage;
    case 'executive': return t.domainExecutive;
    case 'visuospatial': return t.domainVisuospatial;
    case 'orientation': return t.domainOrientation;
  }
}

function gameLabel(t: Strings, gameId: string): string {
  switch (gameId) {
    case 'market-memory': return t.gameTitleMarketMemory;
    case 'mahjong-match':
    case 'mahjong-pattern': return t.gameTitleMahjongMatch;
    case 'dim-sum-order': return t.gameTitleDimSumOrder;
    case 'tram-route': return t.gameTitleTramRoute;
    case 'news-words': return t.gameTitleNewsWords;
    case 'calendar-quiz': return t.gameTitleCalendarQuiz;
    default: return gameId;
  }
}

const pad2 = (n: number) => n.toString().padStart(2, '0');
const formatDate = (ts: number) => {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};
const formatDateTime = (ts: number) => {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

// Wait until the persisted store has been read back from AsyncStorage,
// so we never analyse the default seed data by mistake after a restart.
function usePlayerHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    usePlayerStore.persist.hasHydrated()
  );
  useEffect(() => {
    const unsub = usePlayerStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    setHydrated(usePlayerStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

type Trend = 'up' | 'down' | 'same' | null;

interface DomainStat {
  domain: MoCADomain;
  weight: number;
  plays: number;
  recentAvg: number | null; // 0–100
  points: number | null;    // MoCA-style points (0–weight)
  trend: Trend;
  lastPlayedAt: number | null;
}

interface Analysis {
  domains: DomainStat[];
  totalPlays: number;
  coveredCount: number;
  rawPoints: number;
  coveredMax: number;
  projectedScore: number | null; // 0–30
  strongest: DomainStat | null;
  weakest: DomainStat | null;
}

function analyse(history: MoCASession[]): Analysis {
  // history is stored newest-first; sort defensively
  const sorted = [...history].sort((a, b) => b.playedAt - a.playedAt);

  const domains: DomainStat[] = DOMAIN_ORDER.map((domain) => {
    const sessions = sorted.filter((s) => s.domain === domain);
    const weight = MOCA_WEIGHTS[domain];
    const recentAvg = avg(sessions.slice(0, RECENT_WINDOW).map((s) => s.score));

    // Trend: compare the newest window against the window before it
    let trend: Trend = null;
    if (sessions.length >= 2) {
      const w = Math.min(RECENT_WINDOW, Math.floor(sessions.length / 2));
      const now = avg(sessions.slice(0, w).map((s) => s.score))!;
      const before = avg(sessions.slice(w, w * 2).map((s) => s.score))!;
      const diff = now - before;
      trend = Math.abs(diff) < TREND_THRESHOLD ? 'same' : diff > 0 ? 'up' : 'down';
    }

    return {
      domain,
      weight,
      plays: sessions.length,
      recentAvg: recentAvg === null ? null : Math.round(recentAvg),
      points:
        recentAvg === null
          ? null
          : Math.round((Math.min(100, Math.max(0, recentAvg)) / 100) * weight * 10) / 10,
      trend,
      lastPlayedAt: sessions[0]?.playedAt ?? null,
    };
  });

  const covered = domains.filter((d) => d.points !== null);
  const rawPoints = covered.reduce((sum, d) => sum + (d.points ?? 0), 0);
  const coveredMax = covered.reduce((sum, d) => sum + d.weight, 0);
  const projectedScore =
    coveredMax > 0 ? Math.round((rawPoints / coveredMax) * MOCA_MAX) : null;

  const ranked = [...covered].sort(
    (a, b) => (b.recentAvg ?? 0) - (a.recentAvg ?? 0)
  );

  return {
    domains,
    totalPlays: sorted.length,
    coveredCount: covered.length,
    rawPoints: Math.round(rawPoints * 10) / 10,
    coveredMax,
    projectedScore,
    strongest: ranked.length >= 2 ? ranked[0] : null,
    weakest: ranked.length >= 2 ? ranked[ranked.length - 1] : null,
  };
}

// Standard MoCA bands (≥26 typical). Wording kept gentle for elderly users.
function getBand(t: Strings, score: number) {
  if (score >= 26) {
    return { label: t.mocaBandNormal, desc: t.mocaBandNormalDesc, color: Colors.success, emoji: '🌟' };
  }
  if (score >= 18) {
    return { label: t.mocaBandMild, desc: t.mocaBandMildDesc, color: Colors.warning, emoji: '💪' };
  }
  return { label: t.mocaBandLow, desc: t.mocaBandLowDesc, color: Colors.error, emoji: '🩺' };
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ analysis }: { analysis: Analysis }) {
  const t = useStrings();
  const score = analysis.projectedScore ?? 0;
  const band = getBand(t, score);

  return (
    <View style={[styles.card, styles.summaryCard, { borderColor: band.color }]}>
      <Text style={styles.cardLabel}>{t.mocaEstimatedScore}</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.scoreCircle, { borderColor: band.color }]}>
          <Text style={[styles.scoreBig, { color: band.color }]}>{score}</Text>
          <Text style={styles.scoreMax}>/ {MOCA_MAX}</Text>
        </View>

        <View style={styles.summaryInfo}>
          <Text style={[styles.bandLabel, { color: band.color }]}>
            {band.emoji} {band.label}
          </Text>
          <Text style={styles.bandDesc}>{band.desc}</Text>
        </View>
      </View>

      {/* Coverage */}
      <View style={styles.coverageRow}>
        {DOMAIN_ORDER.map((d) => {
          const stat = analysis.domains.find((s) => s.domain === d)!;
          return (
            <View
              key={d}
              style={[
                styles.coverageDot,
                {
                  backgroundColor:
                    stat.points !== null ? MOCA_DOMAIN_INFO[d].color : Colors.surfaceDark,
                },
              ]}
            >
              <Text style={styles.coverageEmoji}>{MOCA_DOMAIN_INFO[d].emoji}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.coverageText}>
        {analysis.coveredCount} / {DOMAIN_ORDER.length} {t.mocaAreasMeasured}
        {'  ·  '}
        {analysis.rawPoints} / {analysis.coveredMax} {t.mocaPoints}
        {'  ·  '}
        🎮 {analysis.totalPlays} {t.mocaGamesPlayed}
      </Text>
      {analysis.coveredCount < DOMAIN_ORDER.length && (
        <Text style={styles.projectedNote}>{t.mocaProjectedNote}</Text>
      )}
    </View>
  );
}

// ─── Insight row (strongest / needs practice) ─────────────────────────────────

function Insights({ analysis }: { analysis: Analysis }) {
  const t = useStrings();
  if (!analysis.strongest || !analysis.weakest) return null;
  const s = analysis.strongest;
  const w = analysis.weakest;

  return (
    <View style={styles.insightRow}>
      <View style={[styles.insightCard, { borderColor: Colors.success }]}>
        <Text style={styles.insightTitle}>💎 {t.mocaStrongest}</Text>
        <Text style={styles.insightValue}>
          {MOCA_DOMAIN_INFO[s.domain].emoji} {domainLabel(t, s.domain)}
        </Text>
        <Text style={styles.insightScore}>{s.recentAvg}</Text>
      </View>
      <View style={[styles.insightCard, { borderColor: Colors.warning }]}>
        <Text style={styles.insightTitle}>🎯 {t.mocaNeedsPractice}</Text>
        <Text style={styles.insightValue}>
          {MOCA_DOMAIN_INFO[w.domain].emoji} {domainLabel(t, w.domain)}
        </Text>
        <Text style={styles.insightScore}>{w.recentAvg}</Text>
      </View>
    </View>
  );
}

// ─── Domain row ───────────────────────────────────────────────────────────────

function DomainRow({ stat, onPlay }: { stat: DomainStat; onPlay: () => void }) {
  const t = useStrings();
  const info = MOCA_DOMAIN_INFO[stat.domain];
  const tested = stat.points !== null;

  const trendText =
    stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : stat.trend === 'same' ? '→' : '';
  const trendColor =
    stat.trend === 'up' ? Colors.success : stat.trend === 'down' ? Colors.error : Colors.textSecondary;

  return (
    <View style={styles.domainRow}>
      <View style={styles.domainHeader}>
        <View style={[styles.domainIcon, { backgroundColor: tested ? info.color : Colors.surfaceDark }]}>
          <Text style={styles.domainEmoji}>{info.emoji}</Text>
        </View>
        <View style={styles.domainTitleBlock}>
          <Text style={styles.domainTitle}>{domainLabel(t, stat.domain)}</Text>
          <Text style={styles.domainMeta}>
            {tested
              ? `${stat.plays} ${t.mocaPlays} · ${formatDate(stat.lastPlayedAt!)}`
              : t.mocaNotTested}
          </Text>
        </View>
        <View style={styles.domainPointsBlock}>
          <Text style={styles.domainPoints}>
            {tested ? stat.points : '–'}
            <Text style={styles.domainPointsMax}> / {stat.weight}</Text>
          </Text>
          {trendText !== '' && (
            <Text style={[styles.domainTrend, { color: trendColor }]}>{trendText}</Text>
          )}
        </View>
      </View>

      {tested ? (
        <View style={styles.barRow}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${stat.recentAvg ?? 0}%`, backgroundColor: info.color },
              ]}
            />
          </View>
          <Text style={styles.barValue}>{stat.recentAvg}</Text>
        </View>
      ) : DOMAIN_HAS_GAME[stat.domain] ? (
        <Pressable
          onPress={onPlay}
          style={({ pressed }) => [styles.playButton, pressed && { backgroundColor: Colors.primaryDark }]}
          accessibilityRole="button"
          accessibilityLabel={t.mocaPlayToTest}
        >
          <Text style={styles.playButtonText}>{t.mocaPlayToTest} →</Text>
        </Pressable>
      ) : (
        <Text style={styles.comingSoonText}>🔒 {t.mocaGameComingSoon}</Text>
      )}
    </View>
  );
}

// ─── History bar chart ────────────────────────────────────────────────────────

function HistoryChart({ history }: { history: MoCASession[] }) {
  const t = useStrings();
  // oldest → newest, last N plays
  const sessions = [...history]
    .sort((a, b) => b.playedAt - a.playedAt)
    .slice(0, HISTORY_BARS)
    .reverse();

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>📈 {t.mocaHistoryTitle}</Text>
      <View style={styles.chart}>
        {sessions.map((s, i) => (
          <View key={`${s.playedAt}-${i}`} style={styles.chartCol}>
            <Text style={styles.chartValue}>{s.score}</Text>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartBar,
                  {
                    height: `${Math.max(4, Math.min(100, s.score))}%`,
                    backgroundColor: MOCA_DOMAIN_INFO[s.domain].color,
                  },
                ]}
              />
            </View>
            <Text style={styles.chartEmoji}>{MOCA_DOMAIN_INFO[s.domain].emoji}</Text>
            <Text style={styles.chartDate}>{formatDate(s.playedAt)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Recent sessions list ─────────────────────────────────────────────────────

function RecentList({ history }: { history: MoCASession[] }) {
  const t = useStrings();
  const sessions = [...history]
    .sort((a, b) => b.playedAt - a.playedAt)
    .slice(0, RECENT_LIST);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>🕘 {t.mocaRecentTitle}</Text>
      {sessions.map((s, i) => {
        const info = MOCA_DOMAIN_INFO[s.domain];
        return (
          <View
            key={`${s.playedAt}-${i}`}
            style={[styles.recentRow, i === sessions.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.recentDot, { backgroundColor: info.color }]} />
            <View style={styles.recentInfo}>
              <Text style={styles.recentGame}>{gameLabel(t, s.gameId)}</Text>
              <Text style={styles.recentMeta}>
                {info.emoji} {domainLabel(t, s.domain)} · {formatDateTime(s.playedAt)}
              </Text>
            </View>
            <View style={styles.recentScoreBlock}>
              <Text style={styles.recentScore}>{s.score}</Text>
              <Text style={styles.recentCorrect}>
                ✓ {s.correctCount}/{s.totalCount}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function MoCAScreen() {
  const t = useStrings();
  const router = useRouter();
  const hydrated = usePlayerHydrated();
  const history = usePlayerStore((s) => s.mocaHistory);

  const analysis = useMemo(() => analyse(history), [history]);
  const goToGames = () => router.push('/games' as any);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.mocaTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.mocaSubtitle}</Text>
      </View>

      {!hydrated ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      ) : analysis.totalPlays === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🧠</Text>
          <Text style={styles.emptyTitle}>{t.mocaEmptyTitle}</Text>
          <Text style={styles.emptyDesc}>{t.mocaEmptyDesc}</Text>
          <Pressable
            onPress={goToGames}
            style={({ pressed }) => [styles.playButton, styles.emptyButton, pressed && { backgroundColor: Colors.primaryDark }]}
            accessibilityRole="button"
          >
            <Text style={styles.playButtonText}>{t.mocaPlayToTest} →</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SummaryCard analysis={analysis} />
          <Insights analysis={analysis} />

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🧩 {t.mocaDomainBreakdown}</Text>
            {analysis.domains.map((stat) => (
              <DomainRow key={stat.domain} stat={stat} onPlay={goToGames} />
            ))}
          </View>

          <HistoryChart history={history} />
          <RecentList history={history} />

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerEmoji}>ℹ️</Text>
            <Text style={styles.disclaimerText}>{t.mocaDisclaimer}</Text>
          </View>
        </ScrollView>
      )}
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
  headerSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.eight,
    gap: Spacing.three,
  },

  // ── Generic card ──
  card: {
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
  cardLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Summary ──
  summaryCard: {
    borderWidth: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  scoreCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  scoreBig: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    lineHeight: 44,
  },
  scoreMax: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  summaryInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  bandLabel: {
    fontSize: FontSize.body,
    fontWeight: '800',
  },
  bandDesc: {
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  coverageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverageDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageEmoji: {
    fontSize: 20,
  },
  coverageText: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  projectedNote: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // ── Insights ──
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  insightCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    padding: Spacing.three,
    gap: 2,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  insightValue: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  insightScore: {
    fontSize: FontSize.subtitle,
    fontWeight: '900',
    color: Colors.textPrimary,
  },

  // ── Domain row ──
  domainRow: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceDark,
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  domainIcon: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainEmoji: {
    fontSize: 24,
  },
  domainTitleBlock: {
    flex: 1,
  },
  domainTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  domainMeta: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  domainPointsBlock: {
    alignItems: 'flex-end',
  },
  domainPoints: {
    fontSize: FontSize.body,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  domainPointsMax: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  domainTrend: {
    fontSize: FontSize.body,
    fontWeight: '900',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  barTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.surfaceDark,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  barValue: {
    width: 36,
    textAlign: 'right',
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
  },
  playButtonText: {
    color: Colors.white,
    fontSize: FontSize.small,
    fontWeight: '800',
  },
  comingSoonText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ── Chart ──
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
    height: 180,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    gap: 2,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  chartTrack: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
  },
  chartEmoji: {
    fontSize: 14,
  },
  chartDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  // ── Recent list ──
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDark,
  },
  recentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recentInfo: {
    flex: 1,
  },
  recentGame: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  recentMeta: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recentScoreBlock: {
    alignItems: 'flex-end',
  },
  recentScore: {
    fontSize: FontSize.body,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  recentCorrect: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },

  // ── Disclaimer ──
  disclaimer: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    alignItems: 'flex-start',
  },
  disclaimerEmoji: {
    fontSize: 18,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // ── Loading / empty ──
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  loadingText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  emptyButton: {
    alignSelf: 'stretch',
  },
});