// src/app/games/calendar-quiz.tsx
// Orientation game — "Tear-off Calendar" (撕日曆)
// Mirrors the 6 MoCA orientation items using the phone's real clock:
// date, month, year, day of week, city, time of day.

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
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';

type Strings = ReturnType<typeof useStrings>;

// ─── Config ───────────────────────────────────────────────────────────────────

const GAME_ID = 'calendar-quiz';
const COIN_REWARD = 15;
const FEEDBACK_MS = 1800;
const BOUNDARY_GRACE_MIN = 30; // near 12:00 / 18:00 etc. accept both answers

type QKind = 'date' | 'month' | 'year' | 'weekday' | 'city' | 'timeOfDay';
type CityKey = 'hk' | 'macau' | 'shenzhen' | 'guangzhou';
type TimeKey = 'morning' | 'afternoon' | 'evening' | 'night';
type OptionValue = number | string;

interface Question {
  kind: QKind;
  options: OptionValue[];
  correct: OptionValue;   // shown as "the answer"
  accepted: OptionValue[]; // all answers counted as correct
}

const QUESTION_ORDER: QKind[] = ['date', 'month', 'year', 'weekday', 'city', 'timeOfDay'];
const CITY_KEYS: CityKey[] = ['hk', 'macau', 'shenzhen', 'guangzhou'];
const TIME_KEYS: TimeKey[] = ['morning', 'afternoon', 'evening', 'night'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 3 plausible wrong answers close to the real one (e.g. 14, 16, 17 for 15)
function nearbyOptions(answer: number, candidates: number[]): number[] {
  const near = candidates
    .filter((v) => v !== answer)
    .sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer))
    .slice(0, 6);
  const picked = shuffle(near).slice(0, 3);
  return [...picked, answer].sort((a, b) => a - b);
}

// Same idea for values that wrap around (months 0–11, weekdays 0–6)
function wrappingOptions(answer: number, size: number): number[] {
  const offsets = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 3);
  const values = [answer, ...offsets.map((o) => (answer + o + size) % size)];
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function detectCity(): CityKey {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Macau') return 'macau';
  } catch {
    // ignore — fall back to Hong Kong
  }
  return 'hk';
}

function timeKeyForHour(h: number): TimeKey {
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  if (h >= 18 && h < 23) return 'evening';
  return 'night';
}

// Near a boundary (e.g. 11:50) both neighbouring answers are accepted
function acceptedTimeKeys(now: Date): TimeKey[] {
  const keys = new Set<TimeKey>([timeKeyForHour(now.getHours())]);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const shifted = (m: number) => timeKeyForHour(Math.floor((((m % 1440) + 1440) % 1440) / 60));
  keys.add(shifted(minutes - BOUNDARY_GRACE_MIN));
  keys.add(shifted(minutes + BOUNDARY_GRACE_MIN));
  return [...keys];
}

function buildQuestions(now: Date): Question[] {
  const date = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const weekday = now.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const city = detectCity();
  const timeKeys = acceptedTimeKeys(now);
  const timeNow = timeKeyForHour(now.getHours());

  return QUESTION_ORDER.map((kind): Question => {
    switch (kind) {
      case 'date':
        return {
          kind,
          options: nearbyOptions(date, Array.from({ length: daysInMonth }, (_, i) => i + 1)),
          correct: date,
          accepted: [date],
        };
      case 'month':
        return { kind, options: wrappingOptions(month, 12), correct: month, accepted: [month] };
      case 'year':
        return {
          kind,
          options: nearbyOptions(year, [year - 3, year - 2, year - 1, year + 1, year + 2]),
          correct: year,
          accepted: [year],
        };
      case 'weekday':
        return { kind, options: wrappingOptions(weekday, 7), correct: weekday, accepted: [weekday] };
      case 'city':
        return { kind, options: shuffle(CITY_KEYS), correct: city, accepted: [city] };
      case 'timeOfDay':
        return { kind, options: TIME_KEYS, correct: timeNow, accepted: timeKeys };
    }
  });
}

function optionLabel(t: Strings, kind: QKind, value: OptionValue): string {
  switch (kind) {
    case 'date':
      return t.calDateOption.replace('{n}', String(value));
    case 'month':
      return t.calMonthNames[value as number];
    case 'year':
      return t.calYearOption.replace('{n}', String(value));
    case 'weekday':
      return t.calWeekdayNames[value as number];
    case 'city':
      return {
        hk: t.calCityHongKong,
        macau: t.calCityMacau,
        shenzhen: t.calCityShenzhen,
        guangzhou: t.calCityGuangzhou,
      }[value as CityKey];
    case 'timeOfDay':
      return {
        morning: t.calTimeMorning,
        afternoon: t.calTimeAfternoon,
        evening: t.calTimeEvening,
        night: t.calTimeNight,
      }[value as TimeKey];
  }
}

function questionText(t: Strings, kind: QKind): string {
  return {
    date: t.calQDate,
    month: t.calQMonth,
    year: t.calQYear,
    weekday: t.calQWeekday,
    city: t.calQCity,
    timeOfDay: t.calQTimeOfDay,
  }[kind];
}

const KIND_EMOJI: Record<QKind, string> = {
  date: '📆',
  month: '🗓️',
  year: '🎆',
  weekday: '📅',
  city: '🏙️',
  timeOfDay: '🕐',
};

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  return (
    <ScrollView contentContainerStyle={styles.centeredPhase} showsVerticalScrollIndicator={false}>
      <Text style={styles.phaseEmoji}>📅</Text>
      <Text style={styles.phaseTitle}>{t.calTitle}</Text>
      <Text style={styles.phaseSubtitle}>{t.calSubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.calHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.calStep1}</Text>
        <Text style={styles.instructionStep}>{t.calStep2}</Text>
        <Text style={styles.instructionStep}>{t.calStep3}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.calRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.calStart}
      >
        <Text style={styles.primaryButtonText}>{t.calStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Wall calendar (fills in as questions are answered) ───────────────────────

function WallCalendar({
  questions,
  revealed,
  tearKey,
}: {
  questions: Question[];
  revealed: Set<QKind>;
  tearKey: number;
}) {
  const t = useStrings();
  const tearAnim = useRef(new Animated.Value(1)).current;

  // "Tear-off" bounce each time a new field is revealed
  useEffect(() => {
    if (tearKey === 0) return;
    tearAnim.setValue(0.85);
    Animated.spring(tearAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 12,
    }).start();
  }, [tearKey, tearAnim]);

  const show = (kind: QKind) => {
    const q = questions.find((x) => x.kind === kind)!;
    return revealed.has(kind) ? optionLabel(t, kind, q.correct) : '?';
  };
  const dateQ = questions.find((x) => x.kind === 'date')!;

  return (
    <Animated.View style={[styles.calendar, { transform: [{ scale: tearAnim }] }]}>
      {/* Binding rings */}
      <View style={styles.calendarRings}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.calendarRing} />
        ))}
      </View>

      {/* Red header — month + year */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText} numberOfLines={1}>
          {show('month')}  ·  {show('year')}
        </Text>
      </View>

      {/* Big date */}
      <View style={styles.calendarBody}>
        <Text
          style={[
            styles.calendarDate,
            !revealed.has('date') && styles.calendarUnknown,
          ]}
        >
          {revealed.has('date') ? String(dateQ.correct) : '?'}
        </Text>
        <Text style={styles.calendarWeekday}>{show('weekday')}</Text>
      </View>

      {/* Footer — city + time of day */}
      <View style={styles.calendarFooter}>
        <Text style={styles.calendarFooterText} numberOfLines={1}>
          📍 {show('city')}
        </Text>
        <Text style={styles.calendarFooterText} numberOfLines={1}>
          🕐 {show('timeOfDay')}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Question phase ───────────────────────────────────────────────────────────

function QuestionPhase({
  questions,
  index,
  revealed,
  tearKey,
  selected,
  onSelect,
}: {
  questions: Question[];
  index: number;
  revealed: Set<QKind>;
  tearKey: number;
  selected: OptionValue | null;
  onSelect: (value: OptionValue) => void;
}) {
  const t = useStrings();
  const q = questions[index];
  const answered = selected !== null;
  const isCorrect = answered && q.accepted.includes(selected);

  return (
    <ScrollView contentContainerStyle={styles.questionPhase} showsVerticalScrollIndicator={false}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {t.calProgress
            .replace('{n}', String(index + 1))
            .replace('{total}', String(questions.length))}
        </Text>
        <View style={styles.progressDots}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    i < index ? Colors.success : i === index ? Colors.primary : Colors.surfaceDark,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <WallCalendar questions={questions} revealed={revealed} tearKey={tearKey} />

      {/* NPC speech bubble */}
      <View style={styles.npcRow}>
        <Text style={styles.npcEmoji}>👵</Text>
        <View style={styles.speechBubble}>
          <Text style={styles.npcName}>{t.calNpcName}</Text>
          <Text style={styles.questionText}>
            {KIND_EMOJI[q.kind]} {questionText(t, q.kind)}
          </Text>
        </View>
      </View>

      {/* Options — 2 × 2 */}
      <View style={styles.optionGrid}>
        {q.options.map((value) => {
          const isChosen = selected === value;
          const isAnswer = q.accepted.includes(value);
          const bg = !answered
            ? Colors.surface
            : isAnswer
            ? Colors.success
            : isChosen
            ? Colors.error
            : Colors.surface;
          const textColor = answered && (isAnswer || isChosen) ? Colors.white : Colors.textPrimary;

          return (
            <Pressable
              key={String(value)}
              onPress={() => onSelect(value)}
              disabled={answered}
              style={({ pressed }) => [
                styles.optionButton,
                { backgroundColor: bg },
                answered && !isAnswer && !isChosen && styles.optionFaded,
                pressed && !answered && styles.optionPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={optionLabel(t, q.kind, value)}
            >
              <Text style={[styles.optionText, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
                {optionLabel(t, q.kind, value)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {answered && (
        <View
          style={[
            styles.feedback,
            { backgroundColor: isCorrect ? Colors.success : Colors.error },
          ]}
        >
          <Text style={styles.feedbackText}>
            {isCorrect
              ? t.calCorrect
              : `${t.calWrong} ${optionLabel(t, q.kind, q.correct)}`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function CalendarQuizGame() {
  const t = useStrings();
  const router = useRouter();
  const addCoins = usePlayerStore((s) => s.addCoins);
  const recordMoCASession = usePlayerStore((s) => s.recordMoCASession);

  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<OptionValue | null>(null);
  const [revealed, setRevealed] = useState<Set<QKind>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [tearKey, setTearKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending timer if the player leaves mid-game
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleStart = useCallback(() => {
    // Freeze "now" at start so a midnight rollover can't change answers mid-game
    setQuestions(buildQuestions(new Date()));
    setIndex(0);
    setSelected(null);
    setRevealed(new Set());
    setCorrectCount(0);
    setPhase('playing');
  }, []);

  const finishGame = useCallback(
    (finalCorrect: number, total: number) => {
      const score = Math.round((finalCorrect / total) * 100);
      const coinsEarned = Math.round((score / 100) * COIN_REWARD);

      addCoins(coinsEarned);
      recordMoCASession({
        gameId: GAME_ID,
        domain: 'orientation',
        score,
        correctCount: finalCorrect,
        totalCount: total,
      });

      router.replace({
        pathname: '/games/reward' as any,
        params: {
          correctCount: finalCorrect.toString(),
          wrongCount: (total - finalCorrect).toString(),
          score: score.toString(),
          coinsEarned: coinsEarned.toString(),
          domain: 'orientation',
          gameTitle: t.calTitle,
        },
      });
    },
    [addCoins, recordMoCASession, router, t]
  );

  const handleSelect = useCallback(
    (value: OptionValue) => {
      if (selected !== null) return;
      const q = questions[index];
      const right = q.accepted.includes(value);
      const newCorrect = correctCount + (right ? 1 : 0);

      setSelected(value);
      setCorrectCount(newCorrect);
      setRevealed((prev) => new Set(prev).add(q.kind));
      setTearKey((k) => k + 1);

      timerRef.current = setTimeout(() => {
        if (index < questions.length - 1) {
          setIndex((i) => i + 1);
          setSelected(null);
        } else {
          finishGame(newCorrect, questions.length);
        }
      }, FEEDBACK_MS);
    },
    [selected, questions, index, correctCount, finishGame]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t.back}
        >
          <Text style={styles.backButtonText}>{t.back}</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>📅 {t.calTitle}</Text>
        <View style={styles.topBarRight} />
      </View>

      <View style={styles.phaseContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'playing' && questions.length > 0 && (
          <QuestionPhase
            questions={questions}
            index={index}
            revealed={revealed}
            tearKey={tearKey}
            selected={selected}
            onSelect={handleSelect}
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

  // ── Intro ──
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

  // ── Question phase ──
  questionPhase: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.eight,
    gap: Spacing.four,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  progressDots: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  // ── Calendar ──
  calendar: {
    alignSelf: 'center',
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: Spacing.two,
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
    overflow: 'visible',
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 5,
  },
  calendarRings: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    zIndex: 2,
  },
  calendarRing: {
    width: 12,
    height: 20,
    borderRadius: 6,
    backgroundColor: Colors.textSecondary,
  },
  calendarHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    borderTopLeftRadius: Spacing.one,
    borderTopRightRadius: Spacing.one,
  },
  calendarHeaderText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },
  calendarBody: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  calendarDate: {
    fontSize: 80,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 92,
  },
  calendarUnknown: {
    color: Colors.surfaceDark,
  },
  calendarWeekday: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.primary,
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 2,
    borderTopColor: Colors.surface,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  calendarFooterText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textSecondary,
    maxWidth: 110,
  },

  // ── NPC ──
  npcRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  npcEmoji: {
    fontSize: 44,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: 2,
  },
  npcName: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  questionText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Options ──
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
  },
  optionButton: {
    width: '48%',
    minHeight: 72,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  optionPressed: {
    backgroundColor: Colors.surfaceDark,
  },
  optionFaded: {
    opacity: 0.45,
  },
  optionText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
  },

  // ── Feedback ──
  feedback: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
});