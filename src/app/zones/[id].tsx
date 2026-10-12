import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { usePlayerStore } from '@/store/player-store';

// ─── Zone static data ─────────────────────────────────────────────────────────

interface ZoneGame {
  id: string;
  emoji: string;
  titleCantonese: string;
  domain: string;
  domainColor: string;
  coins: number;
  durationSeconds: number; // estimated play time
  route: string;           // expo-router path
}

interface ZoneData {
  id: string;
  labelCantonese: string;
  labelEnglish: string;
  emoji: string;
  color: string;
  descriptionCantonese: string;
  ambianceEmojis: string[]; // decorative flavour row
  games: ZoneGame[];
  npcs: { name: string; emoji: string; line: string }[];
}

const ZONES: Record<string, ZoneData> = {
  market: {
    id: 'market',
    labelCantonese: '街市',
    labelEnglish: 'Wet Market',
    emoji: '🥬',
    color: Colors.zoneMarket,
    descriptionCantonese:
      '香港街市係充滿生氣嘅地方。新鮮蔬菜、魚類同肉類琳瑯滿目，街坊鄰里每日都嚟購物。',
    ambianceEmojis: ['🥬', '🐟', '🍗', '🥚', '🌽', '🍠', '🥕', '🧅'],
    games: [
      {
        id: 'market-memory',
        emoji: '🧠',
        titleCantonese: '街市記憶',
        domain: '記憶力',
        domainColor: Colors.zonePark,
        coins: 20,
        durationSeconds: 30,
        route: '/games/market-memory',
      },
    ],
    npcs: [
      {
        name: '陳師奶',
        emoji: '👵',
        line: '今日嘅菜好新鮮呀，記得買番幾樣！',
      },
      {
        name: '魚檔佬',
        emoji: '🧑‍🍳',
        line: '靚魚到貨喇，要唔要試吓記憶力？',
      },
    ],
  },
  park: {
    id: 'park',
    labelCantonese: '維多利亞公園',
    labelEnglish: 'Victoria Park',
    emoji: '🌳',
    color: Colors.zonePark,
    descriptionCantonese:
      '維多利亞公園係香港最大嘅公園之一，係街坊晨運、下棋同休閒嘅好地方。',
    ambianceEmojis: ['🌸', '🌳', '♟️', '🌿', '🦋', '☀️', '🐦', '🌺'],
    games: [],
    npcs: [
      {
        name: '太極伯伯',
        emoji: '🧘',
        line: '每日晨運，身體健康！',
      },
    ],
  },
  estate: {
    id: 'estate',
    labelCantonese: '公共屋邨',
    labelEnglish: 'Housing Estate',
    emoji: '🏢',
    color: Colors.zoneEstate,
    descriptionCantonese:
      '香港公共屋邨係好多人嘅家，充滿鄰里情。走廊、天台花園同公共空間都係街坊相聚嘅地方。',
    ambianceEmojis: ['🏢', '🌿', '📮', '🛗', '🪴', '👴', '👵', '🏠'],
    games: [],
    npcs: [
      {
        name: '管理員',
        emoji: '👨‍💼',
        line: '歡迎返到屋邨！有咩需要可以搵我。',
      },
    ],
  },
  cafe: {
    id: 'cafe',
    labelCantonese: '茶餐廳',
    labelEnglish: 'Cha Chaan Teng',
    emoji: '🍵',
    color: Colors.zoneCafe,
    descriptionCantonese:
      '茶餐廳係香港獨有嘅飲食文化，一杯絲襪奶茶同一份菠蘿油係港人嘅集體回憶。',
    ambianceEmojis: ['🍵', '🍞', '📰', '🥐', '☕', '🧋', '🍳', '🪑'],
    games: [],
    npcs: [
      {
        name: '茶餐廳老闆',
        emoji: '👨‍🍳',
        line: '靚仔！飲唔飲奶茶？今日有特價！',
      },
    ],
  },
};

// ─── NPC card ─────────────────────────────────────────────────────────────────

function NPCCard({
  npc,
}: {
  npc: { name: string; emoji: string; line: string };
}) {
  return (
    <View style={styles.npcCard}>
      <Text style={styles.npcEmoji}>{npc.emoji}</Text>
      <View style={styles.npcBubble}>
        <Text style={styles.npcName}>{npc.name}</Text>
        <Text style={styles.npcLine}>「{npc.line}」</Text>
      </View>
    </View>
  );
}

// ─── Game card ────────────────────────────────────────────────────────────────

function ZoneGameCard({
  game,
  onPress,
}: {
  game: ZoneGame;
  onPress: (game: ZoneGame) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.gameCard,
        pressed && styles.gameCardPressed,
      ]}
      onPress={() => onPress(game)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`玩 ${game.titleCantonese}`}
    >
      {/* Left emoji box */}
      <View style={[styles.gameEmojiBox, { backgroundColor: game.domainColor }]}>
        <Text style={styles.gameEmoji}>{game.emoji}</Text>
      </View>

      {/* Middle info */}
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{game.titleCantonese}</Text>
        <View style={styles.gameMetaRow}>
          <View style={[styles.domainBadge, { backgroundColor: game.domainColor }]}>
            <Text style={styles.domainText}>{game.domain}</Text>
          </View>
          <Text style={styles.gameDuration}>
            ⏱ 約 {game.durationSeconds} 秒
          </Text>
        </View>
      </View>

      {/* Right reward */}
      <View style={styles.gameReward}>
        <Text style={styles.coinEmoji}>🪙</Text>
        <Text style={styles.coinAmount}>+{game.coins}</Text>
        <Text style={styles.playArrow}>›</Text>
      </View>
    </Pressable>
  );
}

// ─── Coming soon placeholder ──────────────────────────────────────────────────

function ComingSoon() {
  return (
    <View style={styles.comingSoon}>
      <Text style={styles.comingSoonEmoji}>🔨</Text>
      <Text style={styles.comingSoonText}>
        更多遊戲即將推出！
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ZoneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const coins = usePlayerStore((s) => s.coins);
  const name = usePlayerStore((s) => s.name);
  const avatar = usePlayerStore((s) => s.avatar);

  const zone = ZONES[id ?? 'market'];

  // Fallback if unknown zone id
  if (!zone) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>揾唔到呢個地區 🤔</Text>
      </SafeAreaView>
    );
  }

  const handleGamePress = (game: ZoneGame) => {
    router.push(game.route as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: zone.color }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="返回地圖"
        >
          <Text style={styles.backButtonText}>‹ 返回</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{zone.emoji}</Text>
          <Text style={styles.headerTitle}>{zone.labelCantonese}</Text>
          <Text style={styles.headerSubtitle}>{zone.labelEnglish}</Text>
        </View>

        {/* Coin badge */}
        <View style={styles.coinBadge}>
          <Text style={styles.coinBadgeEmoji}>🪙</Text>
          <Text style={styles.coinBadgeText}>{coins}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Ambiance emoji strip ── */}
        <View style={styles.ambianceStrip}>
          {zone.ambianceEmojis.map((e, i) => (
            <Text key={i} style={styles.ambianceEmoji}>
              {e}
            </Text>
          ))}
        </View>

        {/* ── Description ── */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            {zone.descriptionCantonese}
          </Text>
        </View>

        {/* ── NPCs ── */}
        <Text style={styles.sectionTitle}>街坊</Text>
        <View style={styles.npcList}>
          {zone.npcs.map((npc, i) => (
            <NPCCard key={i} npc={npc} />
          ))}
        </View>

        {/* ── Games ── */}
        <Text style={styles.sectionTitle}>可以玩嘅遊戲</Text>
        {zone.games.length > 0 ? (
          <View style={styles.gameList}>
            {zone.games.map((game) => (
              <ZoneGameCard
                key={game.id}
                game={game}
                onPress={handleGamePress}
              />
            ))}
          </View>
        ) : (
          <ComingSoon />
        )}

        {/* ── Player badge at bottom ── */}
        <View style={styles.playerBadge}>
          <Text style={styles.playerAvatar}>{avatar}</Text>
          <Text style={styles.playerBadgeText}>
            {name} 而家喺 {zone.labelCantonese}
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
  errorText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.eight,
  },

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: Colors.surfaceDark,
  },
  backButton: {
    paddingVertical: Spacing.two,
    paddingRight: Spacing.three,
    minWidth: 56,
  },
  backButtonText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerEmoji: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  headerSubtitle: {
    fontSize: FontSize.tiny,
    color: Colors.white,
    opacity: 0.85,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
    minWidth: 56,
    justifyContent: 'center',
  },
  coinBadgeEmoji: { fontSize: 16 },
  coinBadgeText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.white,
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.four,
    paddingTop: Spacing.three,
  },

  // ── Ambiance strip ──
  ambianceStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  ambianceEmoji: {
    fontSize: 24,
  },

  // ── Description ──
  descriptionBox: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
  },
  descriptionText: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 30,
  },

  // ── Section title ──
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── NPCs ──
  npcList: {
    gap: Spacing.three,
  },
  npcCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
  },
  npcEmoji: {
    fontSize: 36,
  },
  npcBubble: {
    flex: 1,
    gap: Spacing.one,
  },
  npcName: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  npcLine: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },

  // ── Games ──
  gameList: {
    gap: Spacing.three,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  gameCardPressed: {
    backgroundColor: Colors.surfaceDark,
  },
  gameEmojiBox: {
    width: 56,
    height: 56,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameEmoji: {
    fontSize: 30,
  },
  gameInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  gameTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  gameMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  domainBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  domainText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  gameDuration: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  gameReward: {
    alignItems: 'center',
    gap: 2,
  },
  coinEmoji: { fontSize: 18 },
  coinAmount: {
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

  // ── Coming soon ──
  comingSoon: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    borderStyle: 'dashed',
    gap: Spacing.two,
  },
  comingSoonEmoji: { fontSize: 32 },
  comingSoonText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: '700',
  },

  // ── Player badge ──
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    opacity: 0.6,
  },
  playerAvatar: { fontSize: 20 },
  playerBadgeText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});