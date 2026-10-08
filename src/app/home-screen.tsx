// src/app/home-screen.tsx

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

// ─── Placeholder furniture / room items ───────────────────────────────────────
// Each item has a position in the room grid and an unlock status
// Will be replaced by real inventory system later

interface RoomItem {
  id: string;
  emoji: string;
  label: string;
  unlocked: boolean;
  gridCol: number; // 1–3
  gridRow: number; // 1–3
}

const ROOM_ITEMS: RoomItem[] = [
  { id: 'window',   emoji: '🪟', label: '窗', unlocked: true,  gridCol: 2, gridRow: 1 },
  { id: 'plant',    emoji: '🪴', label: '植物', unlocked: true,  gridCol: 1, gridRow: 1 },
  { id: 'clock',    emoji: '🕰️', label: '時鐘', unlocked: true,  gridCol: 3, gridRow: 1 },
  { id: 'sofa',     emoji: '🛋️', label: '梳化', unlocked: true,  gridCol: 2, gridRow: 2 },
  { id: 'tv',       emoji: '📺', label: '電視', unlocked: true,  gridCol: 1, gridRow: 2 },
  { id: 'cabinet',  emoji: '🗄️', label: '櫃',  unlocked: false, gridCol: 3, gridRow: 2 },
  { id: 'table',    emoji: '🍵', label: '茶几', unlocked: true,  gridCol: 1, gridRow: 3 },
  { id: 'cat',      emoji: '🐱', label: '貓咪', unlocked: false, gridCol: 2, gridRow: 3 },
  { id: 'lamp',     emoji: '🪔', label: '燈',  unlocked: false, gridCol: 3, gridRow: 3 },
];

// ─── Placeholder player data ──────────────────────────────────────────────────

const PLAYER = {
  name: '陳伯',
  avatar: '👴',
  coins: 128,
  homeLevel: 2,
  homeName: '陳伯嘅溫馨小屋',
};

// ─── Room grid ────────────────────────────────────────────────────────────────

function RoomGrid() {
  return (
    <View style={styles.roomGrid}>
      {/* Room background — warm wallpaper feel */}
      <View style={styles.roomWall} />
      <View style={styles.roomFloor} />

      {/* Grid of items */}
      <View style={styles.grid}>
        {[1, 2, 3].map((row) => (
          <View key={row} style={styles.gridRow}>
            {[1, 2, 3].map((col) => {
              const item = ROOM_ITEMS.find(
                (i) => i.gridCol === col && i.gridRow === row
              );
              return (
                <Pressable
                  key={col}
                  style={({ pressed }) => [
                    styles.gridCell,
                    item?.unlocked && pressed && styles.gridCellPressed,
                  ]}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={
                    item
                      ? item.unlocked
                        ? item.label
                        : `${item.label} 未解鎖`
                      : '空格'
                  }
                >
                  {item ? (
                    <View style={styles.itemWrapper}>
                      <Text
                        style={[
                          styles.itemEmoji,
                          !item.unlocked && styles.itemLocked,
                        ]}
                      >
                        {item.unlocked ? item.emoji : '🔒'}
                      </Text>
                      <Text
                        style={[
                          styles.itemLabel,
                          !item.unlocked && styles.itemLabelLocked,
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ) : (
                    // Empty cell — show a subtle + to invite decoration
                    <Text style={styles.emptyCellPlus}>＋</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Stats row ────────────────────────────────────────────────────────────────

interface StatBadgeProps {
  emoji: string;
  value: string;
  label: string;
}

function StatBadge({ emoji, value, label }: StatBadgeProps) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.avatarEmoji}>{PLAYER.avatar}</Text>
            <View>
              <Text style={styles.homeName}>{PLAYER.homeName}</Text>
              <Text style={styles.homeLevel}>
                🏠 等級 {PLAYER.homeLevel}
              </Text>
            </View>
          </View>
          <View style={styles.coinBadge}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinCount}>{PLAYER.coins}</Text>
          </View>
        </View>

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatBadge emoji="🛋️" value="6" label="家具" />
          <StatBadge emoji="🔒" value="3" label="未解鎖" />
          <StatBadge emoji="⭐" value="240" label="積分" />
        </View>

        {/* ── Room ── */}
        <Text style={styles.sectionTitle}>我嘅房間</Text>
        <RoomGrid />

        {/* ── Hint ── */}
        <View style={styles.hintBox}>
          <Text style={styles.hintEmoji}>💡</Text>
          <Text style={styles.hintText}>
            完成遊戲同任務可以獲得積分，用嚟解鎖更多家具！
          </Text>
        </View>

        {/* ── Decorate button ── */}
        <Pressable
          style={({ pressed }) => [
            styles.decorateButton,
            { backgroundColor: pressed ? Colors.primaryDark : Colors.primary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="裝飾我的家"
        >
          <Text style={styles.decorateButtonText}>🎨 裝飾我的家</Text>
        </Pressable>
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
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.three,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarEmoji: {
    fontSize: 44,
  },
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

  // ── Room ──
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.two,
  },
  roomGrid: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
    aspectRatio: 1,
  },
  roomWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: '#F0E0C8', // warm beige wallpaper
  },
  roomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#C8A87A', // warm timber floor
  },
  grid: {
    flex: 1,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  gridCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellPressed: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  itemWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemLocked: {
    opacity: 0.5,
  },
  itemLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  itemLabelLocked: {
    color: Colors.textSecondary,
    opacity: 0.6,
  },
  emptyCellPlus: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    opacity: 0.3,
    fontWeight: '300',
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

  // ── Decorate button ──
  decorateButton: {
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    marginTop: Spacing.two,
  },
  decorateButtonText: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.white,
  },
});