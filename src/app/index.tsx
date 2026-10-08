// src/app/index.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { PixelMap } from '@/components/map/pixel-map';
import { Zone } from '@/components/map/neighbourhood-zone';

// ─── Placeholder player data ──────────────────────────────────────────────────
// Will be replaced by registration + auth system later

const PLAYER = {
  name: '陳伯',
  avatar: '👴',
  coins: 128,
  level: 3,
};

// ─── Zone detail content ──────────────────────────────────────────────────────
// When a zone is tapped, a bottom sheet shows its description + enter button

const ZONE_DETAILS: Record<
  string,
  { description: string; activities: string[] }
> = {
  park: {
    description: '維多利亞公園係一個充滿生氣嘅地方，可以見到好多街坊朋友。',
    activities: ['🌸 晨運', '🎭 睇表演', '♟️ 下棋', '👥 見朋友'],
  },
  estate: {
    description: '公共屋邨係香港人嘅家，充滿溫馨同回憶。',
    activities: ['🏠 探訪鄰居', '🛗 搭電梯', '🌿 花圃', '📮 信箱'],
  },
  market: {
    description: '街市係香港嘅心臟，新鮮食材同熱鬧氣氛令人精神爽利。',
    activities: ['🥬 買菜', '🐟 買魚', '🗣️ 傾偈', '🛍️ 執平貨'],
  },
  cafe: {
    description: '茶餐廳係香港獨有嘅文化，一杯奶茶令你精神百倍。',
    activities: ['☕ 飲奶茶', '🍞 食多士', '📰 睇報紙', '💬 聊天'],
  },
};

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <View style={styles.topBar}>
      {/* Player info — left side */}
      <View style={styles.playerInfo}>
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarEmoji}>{PLAYER.avatar}</Text>
        </View>
        <View style={styles.playerText}>
          <Text style={styles.playerName}>{PLAYER.name}</Text>
          <Text style={styles.playerLevel}>等級 {PLAYER.level}</Text>
        </View>
      </View>

      {/* Coin count — right side */}
      <View style={styles.coinBadge}>
        <Text style={styles.coinEmoji}>🪙</Text>
        <Text style={styles.coinCount}>{PLAYER.coins}</Text>
      </View>
    </View>
  );
}

// ─── Zone bottom sheet ────────────────────────────────────────────────────────

interface ZoneSheetProps {
  zone: Zone | null;
  visible: boolean;
  onClose: () => void;
  onEnter: (zone: Zone) => void;
}

function ZoneSheet({ zone, visible, onClose, onEnter }: ZoneSheetProps) {
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!zone) return null;
  const detail = ZONE_DETAILS[zone.id];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Dim backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.sheetHandle} />

        {/* Zone header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetEmoji}>{zone.emoji}</Text>
          <View style={styles.sheetTitleBlock}>
            <Text style={styles.sheetTitle}>{zone.labelCantonese}</Text>
            <Text style={styles.sheetSubtitle}>{zone.labelEnglish}</Text>
          </View>
          {/* Close button */}
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="關閉"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {/* Description */}
        <Text style={styles.sheetDescription}>{detail.description}</Text>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>可以做咩？</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activitiesScroll}
          contentContainerStyle={styles.activitiesContent}
        >
          {detail.activities.map((activity, i) => (
            <View key={i} style={styles.activityChip}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Enter button */}
        <Pressable
          style={({ pressed }) => [
            styles.enterButton,
            { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
          ]}
          onPress={() => onEnter(zone)}
          accessibilityRole="button"
          accessibilityLabel={`進入 ${zone.labelCantonese}`}
        >
          <Text style={styles.enterButtonText}>
            進入 {zone.labelCantonese} →
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function MapScreen() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleZonePress = useCallback((zone: Zone) => {
    setSelectedZone(zone);
    setSheetVisible(true);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const handleEnterZone = useCallback((zone: Zone) => {
    // TODO: navigate into the zone screen
    // router.push(`/zones/${zone.id}`)
    setSheetVisible(false);
    console.log('Entering zone:', zone.id);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Top player bar */}
      <TopBar />

      {/* Daily quest nudge banner */}
      <View style={styles.questBanner}>
        <Text style={styles.questEmoji}>📋</Text>
        <Text style={styles.questText}>
          今日任務：去街市買 5 樣嘢！
        </Text>
        <Text style={styles.questArrow}>›</Text>
      </View>

      {/* Main pixel map — takes all remaining space */}
      <View style={styles.mapContainer}>
        <PixelMap onZonePress={handleZonePress} />
      </View>

      {/* Zone detail bottom sheet */}
      <ZoneSheet
        zone={selectedZone}
        visible={sheetVisible}
        onClose={handleSheetClose}
        onEnter={handleEnterZone}
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

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatarBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  playerText: {
    gap: 2,
  },
  playerName: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  playerLevel: {
    fontSize: FontSize.tiny,
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
  coinEmoji: {
    fontSize: 18,
  },
  coinCount: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Quest banner ──
  questBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  questEmoji: {
    fontSize: 18,
  },
  questText: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  questArrow: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Map ──
  mapContainer: {
    flex: 1,
    padding: Spacing.three,
  },

  // ── Backdrop ──
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // ── Bottom sheet ──
  sheet: {
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
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    paddingTop: Spacing.two,
    // Hard pixel shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  sheetEmoji: {
    fontSize: 40,
  },
  sheetTitleBlock: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  sheetDescription: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: Spacing.three,
  },
  activitiesTitle: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.two,
  },
  activitiesScroll: {
    marginBottom: Spacing.four,
  },
  activitiesContent: {
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  activityChip: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.surfaceDark,
  },
  activityText: {
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // ── Enter button ──
  enterButton: {
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  enterButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});