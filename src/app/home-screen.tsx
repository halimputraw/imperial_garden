// src/app/home-screen.tsx

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { usePlayerStore } from '@/store/player-store';
import { useWagerStore } from '@/store/wager-store';
import { useStrings } from '@/i18n/strings';
import { Image } from 'react-native';

// ─── Furniture definitions ────────────────────────────────────────────────────

interface FurnitureItem {
  id: string;
  emoji: string;
  label: string;
  price: number;
  level: number;
  // Position in room (percentage based)
  // zone: 'wall' = top 40%, 'floor' = bottom 60%
  zone: 'wall' | 'floor';
  xPct: number;  // 0-100 left offset % of room width
  yPct: number;  // 0-100 top offset % of zone height
}

const FURNITURE_ITEMS: FurnitureItem[] = [
  // Wall zone items (top 40% of room)
  { id: 'painting', emoji: '🖼️',  label: '畫',   price: 30,  level: 1, zone: 'wall',  xPct: 26, yPct: 15 },
  { id: 'clock',    emoji: '🕰️',  label: '時鐘', price: 30,  level: 1, zone: 'wall',  xPct: 48, yPct: 20 },
  { id: 'window',   emoji: '🪟',  label: '窗',   price: 30,  level: 1, zone: 'wall',  xPct: 10, yPct: -2 },
  // Floor zone items (bottom 60% of room)
  { id: 'sofa',     emoji: '🛋️',  label: '梳化', price: 50,  level: 2, zone: 'floor', xPct: -13, yPct: -87 },
  { id: 'tv',       emoji: '📺',  label: '電視', price: 60,  level: 2, zone: 'floor', xPct: -7,  yPct: -50 },
  { id: 'cabinet',  emoji: '🗄️',  label: '櫃',   price: 60,  level: 2, zone: 'floor', xPct: 27, yPct: -115 },
  { id: 'plant',    emoji: '🪴',  label: '植物', price: 80,  level: 3, zone: 'floor', xPct: 5,  yPct: 45 },
  { id: 'cat',      emoji: '🐱',  label: '貓咪', price: 100, level: 3, zone: 'floor', xPct: 36, yPct: -48 },
  { id: 'lamp',     emoji: '🪔',  label: '燈',   price: 120, level: 3, zone: 'floor', xPct: 78, yPct: 42 },
];

const FURNITURE_IMAGES: Record<string, any> = {
  painting:  require('../../assets/furniture/painting.png'),
  clock:     require('../../assets/furniture/clock.png'),
  // window:    require('../../assets/furniture/window.png'),
  tv:        require('../../assets/furniture/tv-cabinet.png'),
  sofa:      require('../../assets/furniture/sofa.png'),
  cabinet:   require('../../assets/furniture/cabinet.png'),
  // plant:     require('../assets/furniture/plant.png'),   // placeholder until you have it
  cat:       require('../../assets/furniture/cat.png'),
  // lamp:      require('../assets/furniture/lamp.png'),    // placeholder until you have it
};

const INITIALLY_UNLOCKED: string[] = ['painting', 'clock'];
const COIN_REWARD = 20;

// ─── Leaderboard ──────────────────────────────────────────────────────────────

const LEADERBOARD_BASE = [
  { id: '1',  name: '李婆婆', avatar: '👵', coins: 892, isYou: false },
  { id: '2',  name: '張師奶', avatar: '👩', coins: 756, isYou: false },
  { id: '3',  name: '陳伯',   avatar: '👴', coins: 0,   isYou: true  },
  { id: '4',  name: '王叔叔', avatar: '👴', coins: 634, isYou: false },
  { id: '5',  name: '黃太',   avatar: '👩', coins: 521, isYou: false },
  { id: '6',  name: '吳伯',   avatar: '👴', coins: 489, isYou: false },
  { id: '7',  name: '鄭師奶', avatar: '👵', coins: 412, isYou: false },
  { id: '8',  name: '劉叔叔', avatar: '👴', coins: 398, isYou: false },
  { id: '9',  name: '梁婆婆', avatar: '👵', coins: 276, isYou: false },
  { id: '10', name: '何大媽', avatar: '🧓', coins: 201, isYou: false },
];

// ─── Room component ───────────────────────────────────────────────────────────

interface RoomProps {
  unlockedIds: Set<string>;
}

function Room({ unlockedIds }: RoomProps) {
  const [roomSize, setRoomSize] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setRoomSize({ width, height });
  }, []);

  const wallHeight = roomSize.height * 0.65;
  const floorHeight = roomSize.height * 0.35; 

  const getPosition = (item: FurnitureItem) => {
    if (item.zone === 'wall') {
      return {
        left: (item.xPct / 100) * roomSize.width,
        top: (item.yPct / 100) * wallHeight,
      };
    } else {
      return {
        left: (item.xPct / 100) * roomSize.width,
        top: wallHeight + (item.yPct / 100) * floorHeight,
      };
    }
  };

  // Size each item depending on zone
  const getSize = (item: FurnitureItem) => {
    const sizes: Record<string, { w: number; h: number }> = {
      window:   { w: 0.25, h: 0.38 }, // was 0.22, 0.28
      painting: { w: 0.33, h: 0.34 }, // was 0.16, 0.22
      clock:    { w: 0.78, h: 0.58 }, // was 0.14, 0.38
      tv:       { w: 0.72, h: 0.44 }, // was 0.32, 0.20
      sofa:     { w: 0.80, h: 0.47 }, // was 0.30, 0.22
      cabinet:  { w: 0.78, h: 0.62 }, // was 0.20, 0.24
      plant:    { w: 0.16, h: 0.24 }, // was 0.12, 0.18
      cat:      { w: 0.58, h: 0.58 }, // was 0.12, 0.14
      lamp:     { w: 0.14, h: 0.28 }, // was 0.10, 0.20
    };
    const s = sizes[item.id] ?? { w: 0.14, h: 0.18 };
    return {
      width:  s.w * roomSize.width,
      height: s.h * roomSize.height,
    };
  };

  return (
    <View style={styles.room} onLayout={handleLayout}>
      {/* ── Warm wall ── */}
      <View style={[styles.roomWall, { height: wallHeight }]}>
        <View style={styles.wallpaperRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Text key={i} style={styles.wallpaperDot}>✦</Text>
          ))}
        </View>
        <View style={styles.skirtingBoard} />
      </View>

      {/* ── Warm wood floor ── */}
      <View style={[styles.roomFloor, { height: floorHeight }]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={[styles.floorPlank, { top: `${i * 20}%` as any }]} />
        ))}
      </View>

      {/* ── Window light glow ── */}
      <View style={styles.windowLight} />

      {/* ── Furniture items ── */}
      {roomSize.width > 0 && FURNITURE_ITEMS.map((item) => {
        const isUnlocked = unlockedIds.has(item.id);
        const pos = getPosition(item);
        const { width, height } = getSize(item);
        const imgSource = FURNITURE_IMAGES[item.id];

        return (
          <View
            key={item.id}
            style={[
              styles.furnitureItem,
              {
                left: pos.left,
                top: pos.top,
                width,
                height,
              },
            ]}
          >
            {isUnlocked && imgSource ? (
              // ── Real PNG sprite ──
              <Image
                source={imgSource}
                style={{ width, height }}
                resizeMode="contain"
              />
            ) : isUnlocked ? (
              // ── Fallback emoji if PNG not ready yet ──
              <Text style={{ fontSize: width * 0.6 }}>{item.emoji}</Text>
            ) : (
              // ── Locked ghost placeholder ──
              <View style={[styles.ghostItem, { width, height }]}>
                <Text style={styles.ghostEmoji}>＋</Text>
                <Text style={styles.furniturePriceLabel}>🪙{item.price}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Shop overlay ─────────────────────────────────────────────────────────────

interface ShopOverlayProps {
  visible: boolean;
  unlockedIds: Set<string>;
  coins: number;
  onBuy: (item: FurnitureItem) => void;
  onClose: () => void;
}

function ShopOverlay({
  visible,
  unlockedIds,
  coins,
  onBuy,
  onClose,
}: ShopOverlayProps) {
  const t = useStrings();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const [confirmItem, setConfirmItem] = useState<FurnitureItem | null>(null);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 3,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setConfirmItem(null);
    }
  }, [visible, slideAnim]);

  const handleItemPress = (item: FurnitureItem) => {
    if (unlockedIds.has(item.id)) return;
    setConfirmItem(item);
  };

  const handleConfirm = () => {
    if (!confirmItem) return;
    onBuy(confirmItem);
    setConfirmItem(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.shopBackdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.shopSheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.shopHandle} />

        {/* Header */}
        <View style={styles.shopHeader}>
          <Text style={styles.shopTitle}>🛍️ 家具商店</Text>
          <View style={styles.shopCoinsBadge}>
            <Text style={styles.shopCoinsEmoji}>🪙</Text>
            <Text style={styles.shopCoinsValue}>{coins}</Text>
          </View>
          <Pressable
            onPress={onClose}
            style={styles.shopCloseBtn}
            accessibilityRole="button"
          >
            <Text style={styles.shopCloseBtnText}>✕</Text>
          </Pressable>
        </View>

        {/* Confirm banner */}
        {confirmItem && (
          <View style={styles.confirmBanner}>
            <Text style={styles.confirmEmoji}>{confirmItem.emoji}</Text>
            <View style={styles.confirmInfo}>
              <Text style={styles.confirmName}>{confirmItem.label}</Text>
              <Text style={styles.confirmPrice}>🪙 {confirmItem.price} {t.shopCoinsNeeded}</Text>
            </View>
            <View style={styles.confirmButtons}>
              <Pressable
                style={styles.confirmCancelBtn}
                onPress={() => setConfirmItem(null)}
              >
                <Text style={styles.confirmCancelText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmBuyBtn,
                  coins < confirmItem.price && styles.confirmBuyBtnDisabled,
                ]}
                onPress={coins >= confirmItem.price ? handleConfirm : undefined}
                disabled={coins < confirmItem.price}
              >
                <Text style={[
                  styles.confirmBuyText,
                  coins < confirmItem.price && styles.confirmBuyTextDisabled,
                ]}>
                  {coins >= confirmItem.price ? `🔓 ${t.shopUnlock}` : t.shopNotEnoughCoins}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Items grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.shopGrid}
        >
          {/* Group by level */}
          {[1, 2, 3].map((lvl) => (
            <View key={lvl} style={styles.shopLevelGroup}>
              <Text style={styles.shopLevelLabel}>
                {'⭐'.repeat(lvl)} {t.level} {lvl}
              </Text>
              <View style={styles.shopLevelRow}>
                {FURNITURE_ITEMS.filter((i) => i.level === lvl).map((item) => {
                  const isUnlocked = unlockedIds.has(item.id);
                  const isSelected = confirmItem?.id === item.id;
                  const canAfford = coins >= item.price;

                  return (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.shopItem,
                        isUnlocked && styles.shopItemUnlocked,
                        isSelected && styles.shopItemSelected,
                        !isUnlocked && !canAfford && styles.shopItemCantAfford,
                      ]}
                      onPress={() => handleItemPress(item)}
                      disabled={isUnlocked}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isUnlocked
                          ? `${item.label} 已解鎖`
                          : `${item.label} ${item.price} 積分`
                      }
                    >
                      <Text style={styles.shopItemEmoji}>{item.emoji}</Text>
                      <Text style={[
                        styles.shopItemName,
                        isUnlocked && styles.shopItemNameUnlocked,
                      ]}>
                        {item.label}
                      </Text>
                      {isUnlocked ? (
                        <View style={styles.ownedBadge}>
                          <Text style={styles.ownedBadgeText}>✓ 已有</Text>
                        </View>
                      ) : (
                        <Text style={[
                          styles.shopItemPrice,
                          !canAfford && styles.shopItemPriceCantAfford,
                        ]}>
                          🪙 {item.price}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────

function StatBadge({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Leaderboard tab ──────────────────────────────────────────────────────────

function LeaderboardTab() {
  const t = useStrings();
  const coins = usePlayerStore((s) => s.coins);
  const getWagerNetTotal = useWagerStore((s) => s.getWagerNetTotal);
  const wagerNetTotal = getWagerNetTotal();

  const entries = LEADERBOARD_BASE
    .map((e) => e.isYou ? { ...e, coins } : e)
    .sort((a, b) => b.coins - a.coins)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const rankEmoji = (rank: number) =>
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

  return (
    <ScrollView
      contentContainerStyle={styles.leaderboardContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.leaderboardTitle}>{t.leaderboardWeekly}</Text>

      <View style={[
        styles.wagerNetCard,
        {
          borderColor: wagerNetTotal >= 0 ? Colors.success : Colors.error,
          backgroundColor: wagerNetTotal >= 0
            ? `${Colors.success}18`
            : `${Colors.error}18`,
        },
      ]}>
        <Text style={styles.wagerNetEmoji}>🎰</Text>
        <View>
          <Text style={styles.wagerNetLabel}>今週下注收益</Text>
          <Text style={[
            styles.wagerNetValue,
            { color: wagerNetTotal >= 0 ? Colors.success : Colors.error },
          ]}>
            {wagerNetTotal >= 0 ? '+' : ''}{wagerNetTotal} 🪙
          </Text>
        </View>
      </View>

      <View style={styles.leaderboardList}>
        {entries.map((entry) => (
          <View
            key={entry.id}
            style={[
              styles.leaderboardRow,
              entry.isYou && styles.leaderboardRowYou,
            ]}
          >
            <Text style={styles.leaderboardRank}>{rankEmoji(entry.rank)}</Text>
            <Text style={styles.leaderboardAvatar}>{entry.avatar}</Text>
            <View style={styles.leaderboardNameBlock}>
              <Text style={styles.leaderboardName}>
                {entry.name}
                {entry.isYou && (
                  <Text style={styles.youBadge}> ({t.leaderboardYou})</Text>
                )}
              </Text>
            </View>
            <Text style={styles.leaderboardCoins}>🪙 {entry.coins}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const t = useStrings();
  const name = usePlayerStore((s) => s.name);
  const avatar = usePlayerStore((s) => s.avatar);
  const coins = usePlayerStore((s) => s.coins);
  const level = usePlayerStore((s) => s.level);
  const addCoins = usePlayerStore((s) => s.addCoins);
  const unlockedFurniture = usePlayerStore((s) => s.unlockedFurniture);
  const unlockFurniture = usePlayerStore((s) => s.unlockFurniture);
  const unlockedIds = new Set(unlockedFurniture);

  const [activeTab, setActiveTab] = useState<'room' | 'leaderboard'>('room');
  const [shopVisible, setShopVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const unlockedCount = unlockedIds.size;
  const lockedCount = FURNITURE_ITEMS.length - unlockedCount;

  const handleBuy = useCallback((item: FurnitureItem) => {
    if (coins < item.price) return;
    addCoins(-item.price);
    unlockFurniture(item.id); 
    setShopVisible(false);
    setSuccessMessage(`${item.emoji} ${item.label} ${t.shopUnlockSuccess}`);
    setTimeout(() => setSuccessMessage(null), 2500);
  }, [coins, addCoins, unlockFurniture, t]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.avatarEmoji}>{avatar}</Text>
          <View>
            <Text style={styles.homeName}>{name}{t.homeTitle}</Text>
            <Text style={styles.homeLevel}>{t.homeLevel} {level}</Text>
          </View>
        </View>
        <View style={styles.coinBadge}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinCount}>{coins}</Text>
        </View>
      </View>

      {/* Tab selector */}
      <View style={styles.tabSelector}>
        {(
          [
            { key: 'room',        label: t.homeTabRoom },
            { key: 'leaderboard', label: t.homeTabLeaderboard },
          ] as { key: 'room' | 'leaderboard'; label: string }[]
        ).map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
          >
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive,
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Success banner */}
      {successMessage && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {activeTab === 'room' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBadge
              emoji="🛋️"
              value={unlockedCount.toString()}
              label={t.homeFurniture}
            />
            <StatBadge
              emoji="🔒"
              value={lockedCount.toString()}
              label={t.homeLocked}
            />
            <StatBadge
              emoji="🪙"
              value={coins.toString()}
              label={t.homeScore}
            />
          </View>

          {/* Room title + shop button */}
          <View style={styles.roomTitleRow}>
            <Text style={styles.sectionTitle}>{t.homeMyRoom}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.shopButton,
                pressed && { backgroundColor: Colors.primaryDark },
              ]}
              onPress={() => setShopVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="家具商店"
            >
              <Text style={styles.shopButtonText}>🛍️ 商店</Text>
            </Pressable>
          </View>

          {/* Room */}
          <Room unlockedIds={unlockedIds} />

          {/* Hint */}
          <View style={styles.hintBox}>
            <Text style={styles.hintEmoji}>💡</Text>
            <Text style={styles.hintText}>{t.homeHint}</Text>
          </View>
        </ScrollView>
      ) : (
        <LeaderboardTab />
      )}

      {/* Shop overlay */}
      <ShopOverlay
        visible={shopVisible}
        unlockedIds={unlockedIds}
        coins={coins}
        onBuy={handleBuy}
        onClose={() => setShopVisible(false)}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarEmoji: { fontSize: 44 },
  homeName: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  homeLevel: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  coinEmoji: { fontSize: 18 },
  coinCount: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Tabs ──
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.four,
  },
  tabItem: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: Colors.transparent,
    marginRight: Spacing.two,
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primary,
  },

  // ── Success ──
  successBanner: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  successText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statBadge: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    gap: 2,
  },
  statEmoji: { fontSize: 22 },
  statValue: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ── Room title row ──
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
  },
  shopButtonText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Room ──
  room: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.surface,
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
  },
  roomWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5E6C8',
    justifyContent: 'flex-start',
    paddingTop: Spacing.three,
  },
  wallpaperRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.four,
    opacity: 0.2,
  },
  wallpaperDot: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  skirtingBoard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#D4A870',
  },
  roomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#C8955A',
    overflow: 'hidden',
  },
  floorPlank: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#B07840',
    opacity: 0.4,
  },
  windowLight: {
    position: 'absolute',
    top: 0,
    right: '15%',
    width: '20%',
    height: '35%',
    backgroundColor: 'rgba(255, 240, 180, 0.25)',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  // ── Furniture items ──
  furnitureItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  furnitureLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ghostItem: {
    width: 36,
    height: 36,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  ghostEmoji: {
    fontSize: 16,
    color: Colors.textSecondary,
    opacity: 0.5,
  },
  furniturePriceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ── Hint ──
  hintBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  hintEmoji: { fontSize: 20 },
  hintText: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // ── Shop overlay ──
  shopBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  shopSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    borderTopWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingBottom: Spacing.eight,
    maxHeight: '80%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 20,
  },
  shopHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
    gap: Spacing.two,
  },
  shopTitle: {
    flex: 1,
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shopCoinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  shopCoinsEmoji: { fontSize: 14 },
  shopCoinsValue: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shopCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopCloseBtnText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  // ── Confirm banner ──
  confirmBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: `${Colors.gold}22`,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  confirmEmoji: { fontSize: 28 },
  confirmInfo: { flex: 1 },
  confirmName: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmPrice: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  confirmCancelBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
    backgroundColor: Colors.surfaceDark,
  },
  confirmCancelText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  confirmBuyBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
    backgroundColor: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryDark,
  },
  confirmBuyBtnDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderBottomColor: Colors.surfaceDark,
  },
  confirmBuyText: {
    fontSize: FontSize.tiny,
    fontWeight: '800',
    color: Colors.white,
  },
  confirmBuyTextDisabled: {
    color: Colors.textSecondary,
  },

  // ── Shop grid ──
  shopGrid: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  shopLevelGroup: {
    gap: Spacing.two,
  },
  shopLevelLabel: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  shopLevelRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  shopItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.two,
    alignItems: 'center',
    gap: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 2,
  },
  shopItemUnlocked: {
    backgroundColor: `${Colors.success}18`,
    borderColor: Colors.success,
  },
  shopItemSelected: {
    borderColor: Colors.gold,
    borderWidth: 3,
    backgroundColor: `${Colors.gold}18`,
  },
  shopItemCantAfford: {
    opacity: 0.55,
  },
  shopItemEmoji: {
    fontSize: 32,
  },
  shopItemName: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  shopItemNameUnlocked: {
    color: Colors.success,
  },
  shopItemPrice: {
    fontSize: FontSize.tiny,
    fontWeight: '800',
    color: Colors.gold,
  },
  shopItemPriceCantAfford: {
    color: Colors.error,
  },
  ownedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ownedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Leaderboard ──
  leaderboardContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.three,
  },
  leaderboardTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  wagerNetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 2,
    padding: Spacing.three,
  },
  wagerNetEmoji: { fontSize: 28 },
  wagerNetLabel: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  wagerNetValue: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
  },
  leaderboardList: { gap: Spacing.two },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  leaderboardRowYou: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}11`,
  },
  leaderboardRank: {
    fontSize: FontSize.body,
    fontWeight: '800',
    width: 36,
    textAlign: 'center',
  },
  leaderboardAvatar: { fontSize: 24 },
  leaderboardNameBlock: { flex: 1 },
  leaderboardName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  youBadge: {
    fontSize: FontSize.tiny,
    color: Colors.primary,
    fontWeight: '800',
  },
  leaderboardCoins: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.gold,
  },
});