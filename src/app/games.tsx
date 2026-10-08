// src/app/games.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';

// ─── Game definitions ─────────────────────────────────────────────────────────
// Based on MoCA test domains:
// Memory, Attention, Language, Executive function,
// Visuospatial, Orientation

interface Game {
  id: string;
  emoji: string;
  titleCantonese: string;
  titleEnglish: string;
  descriptionCantonese: string;
  domain: string;         // MoCA domain label
  domainColor: string;
  difficulty: 1 | 2 | 3; // 1 = easy, 3 = hard
  coins: number;          // reward on completion
  unlocked: boolean;
}

const GAMES: Game[] = [
  {
    id: 'market-memory',
    emoji: '🥬',
    titleCantonese: '街市記憶',
    titleEnglish: 'Market Memory',
    descriptionCantonese: '記住街市入面嘅 5 樣嘢，考驗你嘅記憶力！',
    domain: '記憶力',
    domainColor: Colors.zonePark,
    difficulty: 1,
    coins: 20,
    unlocked: true,
  },
  {
    id: 'mahjong-pattern',
    emoji: '🀄',
    titleCantonese: '麻雀配對',
    titleEnglish: 'Mahjong Match',
    descriptionCantonese: '係有限時間內搵出相同嘅麻雀牌！',
    domain: '專注力',
    domainColor: Colors.zoneEstate,
    difficulty: 2,
    coins: 30,
    unlocked: true,
  },
  {
    id: 'dim-sum-order',
    emoji: '🍡',
    titleCantonese: '點心排序',
    titleEnglish: 'Dim Sum Order',
    descriptionCantonese: '按照正確次序排列點心，訓練你嘅執行能力！',
    domain: '執行能力',
    domainColor: Colors.zoneCafe,
    difficulty: 2,
    coins: 35,
    unlocked: true,
  },
  {
    id: 'tram-route',
    emoji: '🚋',
    titleCantonese: '電車路線',
    titleEnglish: 'Tram Route',
    descriptionCantonese: '搵出由上環去筲箕灣嘅最快路線！',
    domain: '視空間',
    domainColor: Colors.primary,
    difficulty: 2,
    coins: 35,
    unlocked: true,
  },
  {
    id: 'news-words',
    emoji: '📰',
    titleCantonese: '新聞填字',
    titleEnglish: 'News Words',
    descriptionCantonese: '完成今日新聞嘅填字遊戲，保持語言能力！',
    domain: '語言能力',
    domainColor: Colors.gold,
    difficulty: 3,
    coins: 50,
    unlocked: false,
  },
  {
    id: 'calendar-quiz',
    emoji: '📅',
    titleCantonese: '今日係幾號？',
    titleEnglish: 'Date Quiz',
    descriptionCantonese: '回答關於今日日期、星期同節氣嘅問題！',
    domain: '定向能力',
    domainColor: Colors.zoneMarket,
    difficulty: 1,
    coins: 15,
    unlocked: false,
  },
];

// ─── Difficulty dots ──────────────────────────────────────────────────────────

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <View style={styles.dotsRow}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i <= level ? Colors.primary : Colors.surfaceDark },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Game card ────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        !game.unlocked && styles.cardLocked,
        pressed && game.unlocked && styles.cardPressed,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        game.unlocked
          ? `${game.titleCantonese} ${game.descriptionCantonese}`
          : `${game.titleCantonese} 未解鎖`
      }
      disabled={!game.unlocked}
    >
      {/* Left — emoji + domain badge */}
      <View style={styles.cardLeft}>
        <View
          style={[
            styles.emojiBox,
            { backgroundColor: game.unlocked ? game.domainColor : Colors.surfaceDark },
          ]}
        >
          <Text style={styles.cardEmoji}>
            {game.unlocked ? game.emoji : '🔒'}
          </Text>
        </View>
        {/* Domain badge */}
        <View
          style={[
            styles.domainBadge,
            { backgroundColor: game.unlocked ? game.domainColor : Colors.surfaceDark },
          ]}
        >
          <Text style={styles.domainText}>{game.domain}</Text>
        </View>
      </View>

      {/* Middle — title + description */}
      <View style={styles.cardMiddle}>
        <Text
          style={[
            styles.cardTitle,
            !game.unlocked && styles.textLocked,
          ]}
          numberOfLines={1}
        >
          {game.titleCantonese}
        </Text>
        <Text
          style={[
            styles.cardDescription,
            !game.unlocked && styles.textLocked,
          ]}
          numberOfLines={2}
        >
          {game.unlocked ? game.descriptionCantonese : '完成更多遊戲解鎖'}
        </Text>
        <DifficultyDots level={game.difficulty} />
      </View>

      {/* Right — coin reward */}
      <View style={styles.cardRight}>
        {game.unlocked ? (
          <>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinReward}>+{game.coins}</Text>
            <Text style={styles.playArrow}>›</Text>
          </>
        ) : (
          <Text style={styles.lockEmoji}>🔒</Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── Daily challenge banner ───────────────────────────────────────────────────

function DailyChallenge() {
  return (
    <View style={styles.dailyBanner}>
      <View style={styles.dailyLeft}>
        <Text style={styles.dailyEmoji}>🌟</Text>
        <View>
          <Text style={styles.dailyTitle}>今日挑戰</Text>
          <Text style={styles.dailyDesc}>
            完成 3 個遊戲，獲得額外 🪙 100！
          </Text>
        </View>
      </View>
      {/* Progress pills */}
      <View style={styles.dailyProgress}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.progressPill,
              { backgroundColor: i <= 1 ? Colors.gold : Colors.surfaceDark },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function GamesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 遊戲</Text>
        <Text style={styles.headerSubtitle}>Games</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily challenge */}
        <DailyChallenge />

        {/* Section label */}
        <Text style={styles.sectionTitle}>所有遊戲</Text>
        <Text style={styles.sectionSubtitle}>
          每個遊戲訓練唔同嘅腦部能力
        </Text>

        {/* Game cards */}
        <View style={styles.cardList}>
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerEmoji}>🧠</Text>
          <Text style={styles.footerText}>
            定期玩腦部遊戲有助保持認知能力，每日玩一次效果最好！
          </Text>
        </View>
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
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },

  // ── Daily challenge ──
  dailyBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.gold,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Hard pixel shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 3,
  },
  dailyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
  },
  dailyEmoji: {
    fontSize: 36,
  },
  dailyTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dailyDesc: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dailyProgress: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignItems: 'center',
  },
  progressPill: {
    width: 12,
    height: 24,
    borderRadius: 4,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.two,
  },
  sectionSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Card list ──
  cardList: {
    gap: Spacing.three,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
    // Hard pixel shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  cardLocked: {
    opacity: 0.6,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceDark,
  },

  // Card left
  cardLeft: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  emojiBox: {
    width: 56,
    height: 56,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 30,
  },
  domainBadge: {
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  domainText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },

  // Card middle
  cardMiddle: {
    flex: 1,
    gap: Spacing.one,
  },
  cardTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardDescription: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  textLocked: {
    color: Colors.textSecondary,
    opacity: 0.6,
  },

  // Difficulty dots
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Card right
  cardRight: {
    alignItems: 'center',
    gap: 2,
    minWidth: 36,
  },
  coinEmoji: {
    fontSize: 18,
  },
  coinReward: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.gold,
  },
  playArrow: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 28,
  },
  lockEmoji: {
    fontSize: 22,
  },

  // ── Footer ──
  footerNote: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: Spacing.two,
    alignItems: 'flex-start',
    marginTop: Spacing.two,
  },
  footerEmoji: {
    fontSize: 20,
  },
  footerText: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});