// src/app/games/news-words.tsx
// Language game — "Morning Paper" (報紙填字)
// Each round shows a newspaper headline with one missing word.
// The player taps the right word from 4 big buttons. 5 rounds, easy → hard.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { usePlayerStore } from '@/store/player-store';
import { useLanguage, Language } from '@/store/language-store';
import { useStrings } from '@/i18n/strings';

// ─── Config ───────────────────────────────────────────────────────────────────

const GAME_ID = 'news-words';
const COIN_REWARD = 50;
const ROUNDS = 5;
const POINTS_PER_ROUND = 100 / ROUNDS; // 20
const FEEDBACK_MS = 2000;
const BLANK = '___';

// ─── Headline bank (one list per language) ────────────────────────────────────
// text must contain ___ exactly once. wrong = 3 distractors.
// IMPORTANT: all 4 lists are parallel — headline #3 in every language is the
// same story, in the same order — so the game can switch language mid-round.

interface Headline {
  section: string;
  text: string;
  answer: string;
  wrong: [string, string, string];
  level: 1 | 2 | 3; // 1 easy → 3 hard
}

const HEADLINES: Record<Language, Headline[]> = {
  'zh-HK': [
    { section: '天氣', text: '天文台預測明日有___，市民出門記得帶遮', answer: '驟雨', wrong: ['烈日', '大雪', '地震'], level: 1 },
    { section: '生活', text: '中秋節將至，餅店___銷情理想', answer: '月餅', wrong: ['粽子', '湯圓', '年糕'], level: 1 },
    { section: '健康', text: '醫生提醒長者天氣轉涼要注意___', answer: '保暖', wrong: ['防曬', '減肥', '游水'], level: 1 },
    { section: '節日', text: '農曆新年，長輩派___俾小朋友', answer: '利是', wrong: ['月餅', '功課', '雨遮'], level: 1 },
    { section: '港聞', text: '港鐵新綫通車，大批市民排隊___', answer: '試搭', wrong: ['試食', '試身', '試唱'], level: 2 },
    { section: '體育', text: '香港運動員奪得___，全城歡呼', answer: '金牌', wrong: ['金魚', '金錶', '金鎖匙'], level: 2 },
    { section: '天氣', text: '颱風襲港，天文台懸掛八號___', answer: '風球', wrong: ['氣球', '足球', '燈籠'], level: 2 },
    { section: '飲食', text: '老字號茶樓結業，街坊專程去飲最後一次___', answer: '早茶', wrong: ['咖啡', '啤酒', '湯藥'], level: 2 },
    { section: '生活', text: '街市菜價上升，主婦買餸更加___', answer: '精打細算', wrong: ['大吉大利', '一帆風順', '心想事成'], level: 3 },
    { section: '社區', text: '社區中心開辦___班，教長者用手機視像通話', answer: '數碼', wrong: ['烹飪', '太極', '書法'], level: 3 },
  ],
  'zh-CN': [
    { section: '天气', text: '气象台预测明天有___，市民出门记得带伞', answer: '阵雨', wrong: ['烈日', '大雪', '地震'], level: 1 },
    { section: '生活', text: '中秋节将至，饼店___销情理想', answer: '月饼', wrong: ['粽子', '汤圆', '年糕'], level: 1 },
    { section: '健康', text: '医生提醒老人天气转凉要注意___', answer: '保暖', wrong: ['防晒', '减肥', '游泳'], level: 1 },
    { section: '节日', text: '春节期间，长辈给小朋友发___', answer: '红包', wrong: ['月饼', '作业', '雨伞'], level: 1 },
    { section: '交通', text: '地铁新线开通，大批市民排队___', answer: '试乘', wrong: ['试吃', '试穿', '试唱'], level: 2 },
    { section: '体育', text: '中国运动员夺得___，全城欢呼', answer: '金牌', wrong: ['金鱼', '金表', '金钥匙'], level: 2 },
    { section: '天气', text: '台风来袭，学校宣布全日___', answer: '停课', wrong: ['开学', '考试', '放烟花'], level: 2 },
    { section: '饮食', text: '老字号茶楼结业，街坊专程去喝最后一次___', answer: '早茶', wrong: ['咖啡', '啤酒', '汤药'], level: 2 },
    { section: '生活', text: '菜价上涨，主妇买菜更加___', answer: '精打细算', wrong: ['大吉大利', '一帆风顺', '心想事成'], level: 3 },
    { section: '社区', text: '社区中心开设___班，教老人用手机视频通话', answer: '数码', wrong: ['烹饪', '太极', '书法'], level: 3 },
  ],
  en: [
    { section: 'Weather', text: 'Observatory forecasts ___ tomorrow, bring an umbrella', answer: 'showers', wrong: ['sunshine', 'snowstorms', 'earthquakes'], level: 1 },
    { section: 'Living', text: 'Mid-Autumn Festival brings record sales of ___', answer: 'mooncakes', wrong: ['rice dumplings', 'Easter eggs', 'turkeys'], level: 1 },
    { section: 'Health', text: 'Doctors remind seniors to keep ___ as weather turns cold', answer: 'warm', wrong: ['wet', 'hungry', 'awake'], level: 1 },
    { section: 'Festival', text: 'Lunar New Year: elders hand out ___ to children', answer: 'red packets', wrong: ['mooncakes', 'homework', 'umbrellas'], level: 1 },
    { section: 'Local', text: 'New MTR line opens as crowds queue to ___ the first train', answer: 'ride', wrong: ['cook', 'paint', 'sell'], level: 2 },
    { section: 'Sports', text: 'Hong Kong athlete wins ___ medal, city celebrates', answer: 'gold', wrong: ['chocolate', 'paper', 'wooden'], level: 2 },
    { section: 'Weather', text: 'Typhoon Signal No. 8 hoisted, schools and offices ___', answer: 'close', wrong: ['open early', 'celebrate', 'hire staff'], level: 2 },
    { section: 'Food', text: 'Famous teahouse closes, regulars come for one last ___', answer: 'yum cha', wrong: ['swim', 'haircut', 'taxi ride'], level: 2 },
    { section: 'Living', text: 'Vegetable prices rise, shoppers ___ prices at the wet market', answer: 'compare', wrong: ['ignore', 'sing', 'paint'], level: 3 },
    { section: 'Community', text: 'Community centre offers free ___ class teaching seniors video calls', answer: 'digital', wrong: ['cooking', 'tai chi', 'calligraphy'], level: 3 },
  ],
  pt: [
    { section: 'Tempo', text: 'Observatório prevê ___ para amanhã, leve guarda-chuva', answer: 'aguaceiros', wrong: ['sol forte', 'neve', 'terramotos'], level: 1 },
    { section: 'Vida', text: 'Festival do Bolo Lunar: pastelarias vendem muitos ___', answer: 'bolos lunares', wrong: ['ovos de Páscoa', 'perus', 'gelados'], level: 1 },
    { section: 'Saúde', text: 'Médicos lembram idosos de se manterem ___ no frio', answer: 'agasalhados', wrong: ['molhados', 'com fome', 'acordados'], level: 1 },
    { section: 'Festas', text: 'Ano Novo Lunar: avós dão ___ às crianças', answer: 'envelopes vermelhos', wrong: ['bolos lunares', 'trabalhos de casa', 'guarda-chuvas'], level: 1 },
    { section: 'Local', text: 'Nova linha do Metro Ligeiro abre e residentes fazem fila para a primeira ___', answer: 'viagem', wrong: ['refeição', 'aula', 'consulta'], level: 2 },
    { section: 'Desporto', text: 'Atleta de Macau conquista medalha de ___', answer: 'ouro', wrong: ['chocolate', 'papel', 'madeira'], level: 2 },
    { section: 'Tempo', text: 'Sinal 8 de tufão içado, escolas e escritórios ___', answer: 'fecham', wrong: ['abrem cedo', 'celebram', 'contratam'], level: 2 },
    { section: 'Comida', text: 'Casa de chá famosa fecha e clientes vêm tomar um último ___', answer: 'chá', wrong: ['banho', 'táxi', 'corte de cabelo'], level: 2 },
    { section: 'Vida', text: 'Preços dos legumes sobem e compradores ___ preços no mercado', answer: 'comparam', wrong: ['ignoram', 'cantam', 'pintam'], level: 3 },
    { section: 'Comunidade', text: 'Centro comunitário oferece aulas ___ para idosos fazerem videochamadas', answer: 'digitais', wrong: ['de culinária', 'de tai chi', 'de caligrafia'], level: 3 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A round only stores WHICH headline (idx) and the button order.
// The words are looked up in the current language every render, so
// switching language mid-game translates the newspaper immediately.
// Option id 0 = the correct answer, 1–3 = the wrong ones.
interface Round {
  idx: number;
  order: number[];
}

interface LocalRound {
  section: string;
  text: string;
  answer: string;
  options: { id: number; label: string }[];
}

// 5 random headlines, ordered easy → hard, button order shuffled
function buildRounds(): Round[] {
  const levels = HEADLINES['zh-HK'];
  return shuffle(levels.map((_, idx) => idx))
    .slice(0, ROUNDS)
    .sort((a, b) => levels[a].level - levels[b].level)
    .map((idx) => ({ idx, order: shuffle([0, 1, 2, 3]) }));
}

function localise(round: Round, lang: Language): LocalRound {
  const h = (HEADLINES[lang] ?? HEADLINES['zh-HK'])[round.idx];
  const words = [h.answer, ...h.wrong];
  return {
    section: h.section,
    text: h.text,
    answer: h.answer,
    options: round.order.map((id) => ({ id, label: words[id] })),
  };
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  return (
    <ScrollView contentContainerStyle={styles.centeredPhase} showsVerticalScrollIndicator={false}>
      <Text style={styles.phaseEmoji}>📰</Text>
      <Text style={styles.phaseTitle}>{t.newsTitle}</Text>
      <Text style={styles.phaseSubtitle}>{t.newsSubtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>{t.newsHowToPlay}</Text>
        <Text style={styles.instructionStep}>{t.newsStep1}</Text>
        <Text style={styles.instructionStep}>{t.newsStep2}</Text>
        <Text style={styles.instructionStep}>{t.newsStep3}</Text>
      </View>

      <View style={styles.rewardPreview}>
        <Text style={styles.rewardPreviewText}>{t.newsRewardPreview}</Text>
        <Text style={styles.rewardPreviewCoins}>🪙 {COIN_REWARD}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
        ]}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={t.newsStart}
      >
        <Text style={styles.primaryButtonText}>{t.newsStart}</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Newspaper ────────────────────────────────────────────────────────────────

function Newspaper({
  round,
  roundKey,
  filled,
}: {
  round: LocalRound;
  roundKey: number;
  filled: string | null;
}) {
  const t = useStrings();
  const now = new Date();
  const dateLine = `${t.calWeekdayNames[now.getDay()]} · ${t.calDateOption.replace('{n}', String(now.getDate()))} ${t.calMonthNames[now.getMonth()]} ${t.calYearOption.replace('{n}', String(now.getFullYear()))}`;
  const [before, after] = round.text.split(BLANK);
  const isRight = filled === round.answer;

  // Paper "drops in" each new round
  const dropAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    dropAnim.setValue(0);
    Animated.spring(dropAnim, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 6 }).start();
  }, [roundKey, dropAnim]);

  return (
    <Animated.View
      style={[
        styles.paper,
        {
          opacity: dropAnim,
          transform: [
            { translateY: dropAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
            { rotate: '-1deg' },
          ],
        },
      ]}
    >
      {/* Masthead */}
      <Text style={styles.masthead}>{t.newsPaperName}</Text>
      <View style={styles.rule} />
      <Text style={styles.dateLine}>{dateLine}</Text>
      <View style={styles.ruleThin} />

      {/* Section tag */}
      <View style={styles.sectionTag}>
        <Text style={styles.sectionTagText}>{round.section}</Text>
      </View>

      {/* Headline with blank */}
      <Text style={styles.headline}>
        {before}
        <Text
          style={[
            styles.blank,
            filled !== null && { color: isRight ? Colors.success : Colors.error },
          ]}
        >
          {filled ?? '＿＿＿'}
        </Text>
        {after}
      </Text>

      {/* Fake column lines */}
      <View style={styles.columns}>
        {[0, 1].map((c) => (
          <View key={c} style={styles.column}>
            {[100, 92, 96, 70].map((w, i) => (
              <View key={i} style={[styles.textLine, { width: `${w}%` }]} />
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── Round phase ──────────────────────────────────────────────────────────────

function RoundPhase({
  rounds,
  index,
  selected,
  onSelect,
}: {
  rounds: Round[];
  index: number;
  selected: number | null;
  onSelect: (optionId: number) => void;
}) {
  const t = useStrings();
  const lang = useLanguage();
  const round = localise(rounds[index], lang);
  const answered = selected !== null;
  const isCorrect = selected === 0;
  const filledLabel =
    selected === null ? null : round.options.find((o) => o.id === selected)?.label ?? null;

  return (
    <ScrollView contentContainerStyle={styles.roundPhase} showsVerticalScrollIndicator={false}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {t.newsProgress.replace('{n}', String(index + 1)).replace('{total}', String(rounds.length))}
        </Text>
        <View style={styles.progressDots}>
          {rounds.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                { backgroundColor: i < index ? Colors.success : i === index ? Colors.primary : Colors.surfaceDark },
              ]}
            />
          ))}
        </View>
      </View>

      <Newspaper round={round} roundKey={index} filled={filledLabel} />

      <Text style={styles.prompt}>🔍 {t.newsPrompt}</Text>

      {/* Options — 2 × 2 */}
      <View style={styles.optionGrid}>
        {round.options.map((option) => {
          const isChosen = selected === option.id;
          const isAnswer = option.id === 0;
          const bg = !answered ? Colors.surface : isAnswer ? Colors.success : isChosen ? Colors.error : Colors.surface;
          const textColor = answered && (isAnswer || isChosen) ? Colors.white : Colors.textPrimary;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              disabled={answered}
              style={({ pressed }) => [
                styles.optionButton,
                { backgroundColor: bg },
                answered && !isAnswer && !isChosen && styles.optionFaded,
                pressed && !answered && styles.optionPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <Text style={[styles.optionText, { color: textColor }]} numberOfLines={2} adjustsFontSizeToFit>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View style={[styles.feedback, { backgroundColor: isCorrect ? Colors.success : Colors.error }]}>
          <Text style={styles.feedbackText}>
            {isCorrect ? t.newsCorrect : `${t.newsWrong} ${round.answer}`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Main game screen ─────────────────────────────────────────────────────────

export default function NewsWordsGame() {
  const t = useStrings();
  const router = useRouter();
  const addCoins = usePlayerStore((s) => s.addCoins);
  const recordMoCASession = usePlayerStore((s) => s.recordMoCASession);

  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleStart = useCallback(() => {
    setRounds(buildRounds());
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setPhase('playing');
  }, []);

  const finishGame = useCallback(
    (finalCorrect: number, total: number) => {
      const score = Math.round(finalCorrect * POINTS_PER_ROUND);
      const coinsEarned = Math.round((score / 100) * COIN_REWARD);

      addCoins(coinsEarned);
      recordMoCASession({
        gameId: GAME_ID,
        domain: 'language',
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
          domain: 'language',
          gameTitle: t.newsTitle,
        },
      });
    },
    [addCoins, recordMoCASession, router, t]
  );

  const handleSelect = useCallback(
    (optionId: number) => {
      if (selected !== null) return;
      const right = optionId === 0; // id 0 is always the correct answer
      const newCorrect = correctCount + (right ? 1 : 0);
      setSelected(optionId);
      setCorrectCount(newCorrect);

      timerRef.current = setTimeout(() => {
        if (index < rounds.length - 1) {
          setIndex((i) => i + 1);
          setSelected(null);
        } else {
          finishGame(newCorrect, rounds.length);
        }
      }, FEEDBACK_MS);
    },
    [selected, rounds, index, correctCount, finishGame]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel={t.back}>
          <Text style={styles.backButtonText}>{t.back}</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>📰 {t.newsTitle}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.phaseContainer}>
        {phase === 'intro' && <IntroPhase onStart={handleStart} />}
        {phase === 'playing' && rounds.length > 0 && (
          <RoundPhase rounds={rounds} index={index} selected={selected} onSelect={handleSelect} />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const PAPER = '#FBF7EE';
const INK = '#2B2B2B';

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
  phaseContainer: { flex: 1 },

  // ── Intro ──
  centeredPhase: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, gap: Spacing.four,
  },
  phaseEmoji: { fontSize: 64 },
  phaseTitle: { fontSize: FontSize.title, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  phaseSubtitle: { fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'center', marginTop: -Spacing.three },
  instructionBox: {
    backgroundColor: Colors.surface, borderRadius: Spacing.three, borderWidth: 2,
    borderColor: Colors.surfaceDark, padding: Spacing.four, gap: Spacing.three, alignSelf: 'stretch',
  },
  instructionTitle: { fontSize: FontSize.body, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.one },
  instructionStep: { fontSize: FontSize.body, color: Colors.textPrimary, lineHeight: 28 },
  rewardPreview: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Spacing.three,
    borderWidth: 2, borderColor: Colors.gold,
  },
  rewardPreviewText: { fontSize: FontSize.small, color: Colors.textSecondary, fontWeight: '600' },
  rewardPreviewCoins: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.gold },
  primaryButton: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.four, borderRadius: Spacing.three,
    alignItems: 'center', borderBottomWidth: 4, borderBottomColor: Colors.primaryDark, alignSelf: 'stretch',
  },
  primaryButtonText: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.white },

  // ── Round ──
  roundPhase: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, paddingBottom: Spacing.eight, gap: Spacing.four },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { fontSize: FontSize.small, fontWeight: '700', color: Colors.textSecondary },
  progressDots: { flexDirection: 'row', gap: Spacing.one },
  progressDot: { width: 14, height: 14, borderRadius: 7 },

  // ── Newspaper ──
  paper: {
    backgroundColor: PAPER, borderWidth: 2, borderColor: '#D9CFB8', borderRadius: 4,
    padding: Spacing.four, gap: Spacing.two,
    shadowColor: Colors.black, shadowOffset: { width: 3, height: 4 }, shadowOpacity: 0.18, shadowRadius: 0, elevation: 5,
  },
  masthead: { fontSize: FontSize.title, fontWeight: '900', color: INK, textAlign: 'center', fontFamily: SERIF, letterSpacing: 2 },
  rule: { height: 3, backgroundColor: INK },
  ruleThin: { height: 1, backgroundColor: INK },
  dateLine: { fontSize: FontSize.tiny, color: INK, textAlign: 'center', fontWeight: '600' },
  sectionTag: {
    alignSelf: 'flex-start', backgroundColor: Colors.primary, paddingHorizontal: Spacing.two,
    paddingVertical: 2, borderRadius: 3, marginTop: Spacing.one,
  },
  sectionTagText: { fontSize: FontSize.tiny, color: Colors.white, fontWeight: '800' },
  headline: { fontSize: FontSize.subtitle, fontWeight: '900', color: INK, lineHeight: 36, fontFamily: SERIF },
  blank: { color: Colors.primary, textDecorationLine: 'underline' },
  columns: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.one },
  column: { flex: 1, gap: 6 },
  textLine: { height: 5, borderRadius: 2, backgroundColor: '#D9CFB8' },

  prompt: { fontSize: FontSize.body, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },

  // ── Options ──
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.three },
  optionButton: {
    width: '48%', minHeight: 72, borderRadius: Spacing.three, borderWidth: 2,
    borderColor: Colors.surfaceDark, borderBottomWidth: 4, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: Spacing.two,
  },
  optionPressed: { backgroundColor: Colors.surfaceDark },
  optionFaded: { opacity: 0.45 },
  optionText: { fontSize: FontSize.body, fontWeight: '800', textAlign: 'center' },

  // ── Feedback ──
  feedback: { borderRadius: Spacing.three, paddingVertical: Spacing.three, paddingHorizontal: Spacing.four, alignItems: 'center' },
  feedbackText: { fontSize: FontSize.body, fontWeight: '800', color: Colors.white, textAlign: 'center' },
});