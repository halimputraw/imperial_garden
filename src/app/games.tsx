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
import { useStrings } from '@/i18n/strings';
import { useRouter } from 'expo-router';

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

const getGames = (t: ReturnType<typeof useStrings>): Game[] => [
  {
    id: 'market-memory',
    emoji: '🥬',
    titleCantonese: t.gameTitleMarketMemory,
    titleEnglish: 'Market Memory',
    descriptionCantonese: t.gameDescMarketMemory,
    domain: t.domainMemory,
    domainColor: Colors.zonePark,
    difficulty: 1,
    coins: 20,
    unlocked: true,
  },
  {
    id: 'mahjong-pattern',
    emoji: '🀄',
    titleCantonese: t.gameTitleMahjongMatch,
    titleEnglish: 'Mahjong Match',
    descriptionCantonese: t.gameDescMahjongMatch,
    domain: t.domainAttention,
    domainColor: Colors.zoneEstate,
    difficulty: 2,
    coins: 30,
    unlocked: true,
  },
  {
    id: 'dim-sum-order',
    emoji: '🍡',
    titleCantonese: t.gameTitleDimSumOrder,
    titleEnglish: 'Dim Sum Order',
    descriptionCantonese: t.gameDescDimSumOrder,
    domain: t.domainExecutive,
    domainColor: Colors.zoneCafe,
    difficulty: 2,
    coins: 35,
    unlocked: true,
  },
  {
    id: 'tram-route',
    emoji: '🚋',
    titleCantonese: t.gameTitleTramRoute,
    titleEnglish: 'Tram Route',
    descriptionCantonese: t.gameDescTramRoute,
    domain: t.domainVisuospatial,
    domainColor: Colors.primary,
    difficulty: 2,
    coins: 35,
    unlocked: true,
  },
  {
    id: 'news-words',
    emoji: '📰',
    titleCantonese: t.gameTitleNewsWords,
    titleEnglish: 'News Words',
    descriptionCantonese: t.gameDescNewsWords,
    domain: t.domainLanguage,
    domainColor: Colors.gold,
    difficulty: 3,
    coins: 50,
    unlocked: false,
  },
  {
    id: 'calendar-quiz',
    emoji: '📅',
    titleCantonese: t.gameTitleCalendarQuiz,
    titleEnglish: 'Date Quiz',
    descriptionCantonese: t.gameDescCalendarQuiz,
    domain: t.domainOrientation,
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
  onPress: (game: Game) => void;
}

function GameCard({ game, onPress }: GameCardProps) {
  const t = useStrings();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        !game.unlocked && styles.cardLocked,
        pressed && game.unlocked && styles.cardPressed,
      ]}
      onPress={() => onPress(game)} 
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        game.unlocked
          ? `${game.titleCantonese} ${game.descriptionCantonese}`
          : `${game.titleCantonese} ${t.gamesLocked}`
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
          {game.unlocked ? game.descriptionCantonese : t.gamesUnlockHint}
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
  const t = useStrings();
  return (
    <View style={styles.dailyBanner}>
      <View style={styles.dailyLeft}>
        <Text style={styles.dailyEmoji}>🌟</Text>
        <View>
          <Text style={styles.dailyTitle}>{t.gamesDailyChallenge}</Text>
          <Text style={styles.dailyDesc}>{t.gamesDailyChallengeDesc}</Text>
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
  const t = useStrings();
  const router = useRouter();
  const games = getGames(t); 

  const handleGamePress = (game: Game) => {
    if (!game.unlocked) return;
    if (game.id === 'market-memory') {
      router.push('/games/market-memory' as any);
    } else if (game.id === 'mahjong-pattern') {
      router.push('/games/mahjong-match' as any);
    } else if (game.id === 'tram-route') {
      router.push('/games/tram-route' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.gamesTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily challenge */}
        <DailyChallenge />

        {/* Section label */}
        <Text style={styles.sectionTitle}>{t.gamesAllGames}</Text>
        <Text style={styles.sectionSubtitle}>{t.gamesAllGamesSubtitle}</Text>

        {/* Game cards */}
        <View style={styles.cardList}>
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={handleGamePress}
            />
          ))}
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerEmoji}>🧠</Text>
          <Text style={styles.footerText}>{t.gamesBrainTip}</Text>
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