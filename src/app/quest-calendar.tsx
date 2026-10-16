// src/app/quest-calendar.tsx
// Monthly calendar of quests (games) completed each day.
// Built from usePlayerStore.mocaHistory — saved in AsyncStorage, so it
// survives app restarts. New games appear automatically once they call
// recordMoCASession().

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useStrings } from '@/i18n/strings';
import { usePlayerStore, MoCASession, MOCA_DOMAIN_INFO, MoCADomain } from '@/store/player-store';
import { todayKey, DAILY_TARGET } from '@/store/daily-store';

type Strings = ReturnType<typeof useStrings>;

// ─── Game names (add new games here, e.g. the language game) ──────────────────

const GAME_TITLES: Record<string, (t: Strings) => string> = {
  'market-memory':   (t) => t.gameTitleMarketMemory,
  'mahjong-match':   (t) => t.gameTitleMahjongMatch,
  'mahjong-pattern': (t) => t.gameTitleMahjongMatch,
  'dim-sum-order':   (t) => t.gameTitleDimSumOrder,
  'tram-route':      (t) => t.gameTitleTramRoute,
  'calendar-quiz':   (t) => t.gameTitleCalendarQuiz,
  'news-words':      (t) => t.gameTitleNewsWords,
};

const DOMAIN_LABEL: Record<MoCADomain, (t: Strings) => string> = {
  memory:       (t) => t.domainMemory,
  attention:    (t) => t.domainAttention,
  language:     (t) => t.domainLanguage,
  executive:    (t) => t.domainExecutive,
  visuospatial: (t) => t.domainVisuospatial,
  orientation:  (t) => t.domainOrientation,
};

// Unknown game id → falls back to its brain-area name, so nothing breaks
const gameTitle = (t: Strings, s: MoCASession) =>
  GAME_TITLES[s.gameId]?.(t) ?? DOMAIN_LABEL[s.domain](t);

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface DayInfo {
  sessions: MoCASession[]; // games finished that day (newest first)
  quests: number;          // distinct games finished
}

function groupByDay(history: MoCASession[]): Record<string, DayInfo> {
  const days: Record<string, DayInfo> = {};
  for (const s of history) {
    const key = todayKey(new Date(s.playedAt));
    if (!days[key]) days[key] = { sessions: [], quests: 0 };
    days[key].sessions.push(s);
  }
  for (const d of Object.values(days)) {
    d.sessions.sort((a, b) => b.playedAt - a.playedAt);
    d.quests = new Set(d.sessions.map((s) => s.gameId)).size;
  }
  return days;
}

// Consecutive days with ≥1 quest, counting back from today (or yesterday)
function currentStreak(days: Record<string, DayInfo>): number {
  const d = new Date();
  if (!days[todayKey(d)]) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (days[todayKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function QuestCalendarScreen() {
  const t = useStrings();
  const router = useRouter();
  const history = usePlayerStore((s) => s.mocaHistory);
  const days = useMemo(() => groupByDay(history), [history]);

  const now = new Date();
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selectedKey, setSelectedKey] = useState(todayKey(now));

  const isCurrentMonth = month.y === now.getFullYear() && month.m === now.getMonth();
  const changeMonth = (delta: number) => {
    const d = new Date(month.y, month.m + delta, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  };

  // Calendar grid: leading blanks + days of the month
  const firstWeekday = new Date(month.y, month.m, 1).getDay();
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Month summary
  const monthKeys = Object.keys(days).filter((k) =>
    k.startsWith(`${month.y}-${String(month.m + 1).padStart(2, '0')}-`)
  );
  const activeDays = monthKeys.length;
  const totalQuests = monthKeys.reduce((sum, k) => sum + days[k].quests, 0);
  const streak = currentStreak(days);

  const selected = days[selectedKey];
  const selDate = new Date(selectedKey + 'T00:00:00');
  const selLabel = `${t.calDateOption.replace('{n}', String(selDate.getDate()))} ${t.calMonthNames[selDate.getMonth()]} · ${t.calWeekdayNames[selDate.getDay()]}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel={t.back}>
          <Text style={styles.backButtonText}>{t.back}</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>📅 {t.questCalTitle}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>🔥 {streak}</Text>
            <Text style={styles.summaryLabel}>{t.questCalStreak}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>📆 {activeDays}</Text>
            <Text style={styles.summaryLabel}>{t.questCalDaysActive}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>🎮 {totalQuests}</Text>
            <Text style={styles.summaryLabel}>{t.questCalTotalQuests}</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.card}>
          <View style={styles.monthRow}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.monthArrow} accessibilityRole="button">
              <Text style={styles.monthArrowText}>‹</Text>
            </Pressable>
            <Text style={styles.monthTitle}>
              {t.calMonthNames[month.m]} {t.calYearOption.replace('{n}', String(month.y))}
            </Text>
            <Pressable
              onPress={() => changeMonth(1)}
              disabled={isCurrentMonth}
              style={[styles.monthArrow, isCurrentMonth && { opacity: 0.3 }]}
              accessibilityRole="button"
            >
              <Text style={styles.monthArrowText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {t.questWeekdayShort.map((w, i) => (
              <Text key={i} style={styles.weekday}>{w}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (day === null) return <View key={i} style={styles.cell} />;
              const key = todayKey(new Date(month.y, month.m, day));
              const info = days[key];
              const quests = info?.quests ?? 0;
              const isToday = key === todayKey(now);
              const isFuture = new Date(month.y, month.m, day) > now;
              const isSelected = key === selectedKey;
              const done = quests >= DAILY_TARGET;

              return (
                <Pressable
                  key={i}
                  onPress={() => setSelectedKey(key)}
                  disabled={isFuture}
                  style={styles.cell}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} · ${quests}`}
                >
                  <View
                    style={[
                      styles.dayBox,
                      quests > 0 && { backgroundColor: done ? Colors.gold : `${Colors.gold}55` },
                      isToday && styles.dayToday,
                      isSelected && styles.daySelected,
                      isFuture && { opacity: 0.35 },
                    ]}
                  >
                    <Text style={[styles.dayNumber, done && { color: Colors.white }]}>{day}</Text>
                    {quests > 0 && (
                      <Text style={[styles.dayCount, done && { color: Colors.white }]}>
                        {done ? '⭐' : `${quests}`}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={[styles.legendBox, { backgroundColor: `${Colors.gold}55` }]} />
            <Text style={styles.legendText}>1–{DAILY_TARGET - 1}</Text>
            <View style={[styles.legendBox, { backgroundColor: Colors.gold }]} />
            <Text style={styles.legendText}>⭐ {DAILY_TARGET}+</Text>
          </View>
        </View>

        {/* Selected day details */}
        <View style={styles.card}>
          <Text style={styles.detailTitle}>{selLabel}</Text>
          {selected ? (
            <>
              <Text style={styles.detailSub}>
                {t.questCalQuestsDone.replace('{n}', String(selected.quests))}
                {selected.quests >= DAILY_TARGET ? `  ·  ${t.questCalBonus}` : ''}
              </Text>
              {selected.sessions.map((s, i) => {
                const d = new Date(s.playedAt);
                return (
                  <View key={`${s.playedAt}-${i}`} style={styles.sessionRow}>
                    <Text style={styles.sessionEmoji}>{MOCA_DOMAIN_INFO[s.domain].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sessionName}>{gameTitle(t, s)}</Text>
                      <Text style={styles.sessionMeta}>
                        {`${d.getHours()}`.padStart(2, '0')}:{`${d.getMinutes()}`.padStart(2, '0')} · {DOMAIN_LABEL[s.domain](t)}
                      </Text>
                    </View>
                    <Text style={styles.sessionScore}>{s.score}</Text>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.detailSub}>{t.questCalNoQuests}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
    backgroundColor: Colors.surface, borderBottomWidth: 2, borderBottomColor: Colors.surfaceDark,
  },
  backButton: { minWidth: 60, paddingVertical: Spacing.one },
  backButtonText: { fontSize: FontSize.body, fontWeight: '800', color: Colors.primary },
  topBarTitle: { fontSize: FontSize.body, fontWeight: '800', color: Colors.textPrimary },
  scroll: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.eight },

  summaryRow: { flexDirection: 'row', gap: Spacing.two },
  summaryCard: {
    flex: 1, alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Spacing.three,
    borderWidth: 2, borderColor: Colors.surfaceDark, paddingVertical: Spacing.three,
  },
  summaryValue: { fontSize: FontSize.body, fontWeight: '900', color: Colors.textPrimary },
  summaryLabel: { fontSize: FontSize.tiny, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  card: {
    backgroundColor: Colors.surface, borderRadius: Spacing.three, borderWidth: 2,
    borderColor: Colors.surfaceDark, padding: Spacing.three, gap: Spacing.two,
  },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthArrow: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  monthArrowText: { fontSize: FontSize.title, fontWeight: '800', color: Colors.primary },
  monthTitle: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.textPrimary },

  weekRow: { flexDirection: 'row' },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', fontSize: FontSize.tiny, fontWeight: '700', color: Colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 },
  dayBox: {
    flex: 1, borderRadius: Spacing.two, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, borderWidth: 2, borderColor: 'transparent',
  },
  dayToday: { borderColor: Colors.primary },
  daySelected: { borderColor: Colors.textPrimary, borderWidth: 3 },
  dayNumber: { fontSize: FontSize.small, fontWeight: '800', color: Colors.textPrimary },
  dayCount: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary },

  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, justifyContent: 'center' },
  legendBox: { width: 16, height: 16, borderRadius: 4 },
  legendText: { fontSize: FontSize.tiny, color: Colors.textSecondary, marginRight: Spacing.two },

  detailTitle: { fontSize: FontSize.body, fontWeight: '800', color: Colors.textPrimary },
  detailSub: { fontSize: FontSize.small, color: Colors.textSecondary },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.three,
    paddingVertical: Spacing.two, borderTopWidth: 1, borderTopColor: Colors.surfaceDark,
  },
  sessionEmoji: { fontSize: 24 },
  sessionName: { fontSize: FontSize.small, fontWeight: '800', color: Colors.textPrimary },
  sessionMeta: { fontSize: FontSize.tiny, color: Colors.textSecondary },
  sessionScore: { fontSize: FontSize.body, fontWeight: '900', color: Colors.textPrimary },
});