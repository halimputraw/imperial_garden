import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image
} from 'react-native';
import { Colors, FontSize, Spacing, TouchTarget } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarketItem {
  id: string;
  emoji: string;
  labelCantonese: string;
  isCorrect: boolean; // true = was in the original 5
}

export type GridMode = 'memorise' | 'quiz';

interface ItemGridProps {
  items: MarketItem[];
  mode: GridMode;
  // quiz mode only
  selectedIds?: Set<string>;
  onItemPress?: (item: MarketItem) => void;
}

// ─── Single item card ─────────────────────────────────────────────────────────

interface ItemCardProps {
  item: MarketItem;
  mode: GridMode;
  isSelected: boolean;
  onPress?: (item: MarketItem) => void;
}

const ITEM_IMAGES: Record<string, any> = {
  cabbage:     require('../../../assets/market/cabbage.png'),
  fish:        require('../../../assets/market/fish.png'),
  chicken:     require('../../../assets/market/chicken.png'),
  egg:         require('../../../assets/market/egg.png'),
  corn:        require('../../../assets/market/corn.png'),
  carrot:      require('../../../assets/market/carrot.png'),
  potato:      require('../../../assets/market/potato.png'),
  onion:       require('../../../assets/market/onion.png'),
  broccoli:    require('../../../assets/market/broccoli.png'),
  mushroom:    require('../../../assets/market/mushroom.png'),
  tofu:        require('../../../assets/market/tofu.png'),
  shrimp:      require('../../../assets/market/shrimp.png'),
  pork:        require('../../../assets/market/pork.png'),
  lemon:       require('../../../assets/market/lemon.png'),
  sweetpotato: require('../../../assets/market/sweet-potato.png'),
};

function ItemCard({ item, mode, isSelected, onPress }: ItemCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  const imgSource = ITEM_IMAGES[item.id];

  const handlePressIn = useCallback(() => {
    if (mode !== 'quiz') return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  }, [mode, scaleAnim]);

  const handlePressOut = useCallback(() => {
    if (mode !== 'quiz') return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  }, [mode, scaleAnim]);

  const handlePress = useCallback(() => {
    if (mode !== 'quiz' || !onPress) return;

    // Shake animation for wrong deselect feedback
    if (isSelected) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }

    onPress(item);
  }, [mode, onPress, item, isSelected, shakeAnim]);

  // Memorise mode — plain warm card, no interaction
  if (mode === 'memorise') {
    return (
      <View style={styles.memoriseCard}>
        {imgSource ? (
          <Image source={imgSource} style={{ width: 56, height: 56 }} resizeMode="contain" />
        ) : (
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
        )}
        <Text style={styles.itemLabel} numberOfLines={1}>
          {item.labelCantonese}
        </Text>
      </View>
    );
  }

  // Quiz mode — selectable, shows state
  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateX: shakeAnim },
        ],
      }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityRole="checkbox"
        accessibilityLabel={item.labelCantonese}
        accessibilityState={{ checked: isSelected }}
        style={[
          styles.quizCard,
          isSelected && styles.quizCardSelected,
        ]}
      >
        {/* Selection tick — top right corner */}
        {isSelected && (
          <View style={styles.tickBadge}>
            <Text style={styles.tickText}>✓</Text>
          </View>
        )}

        {imgSource ? (
          <Image source={imgSource} style={{ width: 56, height: 56 }} resizeMode="contain" />
        ) : (
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
        )}
        <Text
          style={[
            styles.itemLabel,
            isSelected && styles.itemLabelSelected,
          ]}
          numberOfLines={1}
        >
          {item.labelCantonese}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function ItemGrid({
  items,
  mode,
  selectedIds = new Set(),
  onItemPress,
}: ItemGridProps) {
  // Split into rows of 3
  const rows: MarketItem[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <View key={item.id} style={styles.cellWrapper}>
              <ItemCard
                item={item}
                mode={mode}
                isSelected={selectedIds.has(item.id)}
                onPress={onItemPress}
              />
            </View>
          ))}
          {/* Fill empty cells in last row to keep grid aligned */}
          {row.length < 3 &&
            Array(3 - row.length)
              .fill(null)
              .map((_, i) => (
                <View key={`empty-${i}`} style={styles.cellWrapper} />
              ))}
        </View>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cellWrapper: {
    flex: 1,
    minHeight: TouchTarget.comfortable,
    alignItems: 'stretch',
  },

  // ── Memorise card ──
  memoriseCard: {
    flex: 1,
    minHeight: TouchTarget.comfortable,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },

  // ── Quiz card ──
  quizCard: {
    flex: 1,
    minHeight: TouchTarget.comfortable,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  quizCardSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    borderWidth: 3,
  },

  // Tick badge
  tickBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },

  // Shared item content
  itemEmoji: {
    fontSize: 28,
    textAlign: 'center',
  },
  itemLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  itemLabelSelected: {
    color: Colors.primaryDark,
  },
});