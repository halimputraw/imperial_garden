import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Colors, FontSize, Spacing, TouchTarget } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MahjongTileData {
  id: string;         // unique per tile instance e.g. 'east-0', 'east-1'
  pairId: string;     // shared by the two matching tiles e.g. 'east'
  symbol: string;     // emoji or character to display
  label: string;      // Cantonese name e.g. '東風'
  color: string;      // accent color for this tile type
}

export type TileState = 'hidden' | 'revealed' | 'matched';

interface MahjongTileProps {
  tile: MahjongTileData;
  state: TileState;
  onPress: (tile: MahjongTileData) => void;
  disabled: boolean;
}

// ─── Tile back design ─────────────────────────────────────────────────────────
// The face-down side of the tile

function TileBack({ size }: { size: number }) {
  return (
    <View style={[styles.tileBack, { width: size, height: size }]}>
      <Text style={styles.tileBackPattern}>🀫</Text>
    </View>
  );
}

// ─── Tile front design ────────────────────────────────────────────────────────

function TileFront({
  tile,
  size,
  isMatched,
}: {
  tile: MahjongTileData;
  size: number;
  isMatched: boolean;
}) {
  return (
    <View
      style={[
        styles.tileFront,
        {
          width: size,
          height: size,
          borderColor: isMatched ? Colors.success : tile.color,
          backgroundColor: isMatched
            ? `${Colors.success}22`
            : Colors.surface,
        },
      ]}
    >
      <Text style={styles.tileSymbol}>{tile.symbol}</Text>
      <Text
        style={[styles.tileLabel, { color: isMatched ? Colors.success : Colors.textPrimary }]}
        numberOfLines={1}
      >
        {tile.label}
      </Text>
      {isMatched && (
        <View style={styles.matchedBadge}>
          <Text style={styles.matchedBadgeText}>✓</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main tile component ──────────────────────────────────────────────────────

export function MahjongTile({
  tile,
  state,
  onPress,
  disabled,
}: MahjongTileProps) {
  const TILE_SIZE = 76;

  // Flip animation — rotateY 0→90 (face disappears) then 90→0 (other face appears)
  const flipAnim = useRef(new Animated.Value(state === 'hidden' ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Track previous state to detect changes
  const prevState = useRef(state);

  useEffect(() => {
    if (prevState.current === state) return;
    prevState.current = state;

    if (state === 'revealed' || state === 'matched') {
      // Flip to front
      Animated.spring(flipAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    } else if (state === 'hidden') {
      // Flip back to back
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }
  }, [state, flipAnim]);

  // Match celebration — scale bounce
  useEffect(() => {
    if (state === 'matched') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          useNativeDriver: true,
          speed: 30,
          bounciness: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
        }),
      ]).start();
    }
  }, [state, scaleAnim]);

  const handlePress = useCallback(() => {
    if (disabled || state !== 'hidden') return;
    onPress(tile);
  }, [disabled, state, onPress, tile]);

  // Flip interpolations
  // Front face: rotateY 0deg→90deg (hidden) / 90deg→0deg (shown)
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['90deg', '90deg', '0deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || state !== 'hidden'}
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        state === 'hidden'
          ? '翻開牌'
          : `${tile.label} ${state === 'matched' ? '已配對' : ''}`
      }
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.tileWrapper,
          {
            width: TILE_SIZE,
            height: TILE_SIZE,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Back face */}
        <Animated.View
          style={[
            styles.face,
            {
              opacity: backOpacity,
              transform: [{ rotateY: backRotate }],
            },
          ]}
        >
          <TileBack size={TILE_SIZE} />
        </Animated.View>

        {/* Front face */}
        <Animated.View
          style={[
            styles.face,
            {
              opacity: frontOpacity,
              transform: [{ rotateY: frontRotate }],
            },
          ]}
        >
          <TileFront
            tile={tile}
            size={TILE_SIZE}
            isMatched={state === 'matched'}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  // ── Back ──
  tileBack: {
    borderRadius: Spacing.two,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 4,
  },
  tileBackPattern: {
    fontSize: 36,
  },

  // ── Front ──
  tileFront: {
    borderRadius: Spacing.two,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  tileSymbol: {
    fontSize: 34,
    lineHeight: 40,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── Matched badge ──
  matchedBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },
});