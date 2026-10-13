// src/components/map/neighbourhood-zone.tsx

import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { Colors, FontSize, Spacing, TouchTarget } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ZoneId = 'market' | 'cafe' | 'estate' | 'park';

export interface Zone {
  id: ZoneId;
  labelCantonese: string;   // e.g. 街市
  labelEnglish: string;     // e.g. Wet Market
  emoji: string;            // large visual anchor for elderly recognition
  color: string;            // background fill from Colors
  borderColor: string;
  // Position on the map canvas (percentage-based so it scales)
  xPct: number;             // 0–100, left offset as % of map width
  yPct: number;             // 0–100, top offset as % of map height
  widthPct: number;         // zone width as % of map width
  heightPct: number;        // zone height as % of map height
}

interface NeighbourhoodZoneProps {
  zone: Zone;
  mapWidth: number;
  mapHeight: number;
  onPress: (zone: Zone) => void;
  isSelected: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NeighbourhoodZone({
  zone,
  mapWidth,
  mapHeight,
  onPress,
  isSelected,
}: NeighbourhoodZoneProps) {
  // Animated scale for press feedback — gentle, not jarring for elderly
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    onPress(zone);
  }, [onPress, zone]);

  // Convert percentage positions to absolute pixels
  const left = (zone.xPct / 100) * mapWidth;
  const top = (zone.yPct / 100) * mapHeight;
  const width = (zone.widthPct / 100) * mapWidth;
  const height = (zone.heightPct / 100) * mapHeight;

  // Ensure touch target is never smaller than minimum
  const touchWidth = Math.max(width, TouchTarget.min);
  const touchHeight = Math.max(height, TouchTarget.min);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          left: left - (touchWidth - width) / 2,
          top: top - (touchHeight - height) / 2,
          width: touchWidth,
          height: touchHeight,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${zone.labelCantonese} ${zone.labelEnglish}`}
        accessibilityHint="輕按進入此地區"
        style={({ pressed }) => [
          styles.zone,
          {
            backgroundColor: zone.color,
            borderColor: isSelected ? Colors.primary : zone.borderColor,
            borderWidth: isSelected ? 3 : 2,
            width: touchWidth,
            height: touchHeight,
          },
          pressed && styles.pressed,
        ]}
      >
        {/* Pixel-art style dashed border overlay when selected */}
        {isSelected && <View style={styles.selectedOverlay} />}

        {/* Emoji icon — large visual anchor */}
        <Text style={styles.emoji}>{zone.emoji}</Text>

        {/* Cantonese label — primary */}
        <Text
          style={[styles.labelCantonese, { color: Colors.textPrimary }]}
          numberOfLines={1}
        >
          {zone.labelCantonese}
        </Text>

        {/* English sub-label — smaller, secondary */}
        <Text
          style={[styles.labelEnglish, { color: Colors.textSecondary }]}
          numberOfLines={1}
        >
          {zone.labelEnglish}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  zone: {
    flex: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    // Pixel art style: slightly hard shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0, // sharp shadow = pixel art feel
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.white,
    borderStyle: 'dashed',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  labelCantonese: {
    fontSize: FontSize.small,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  labelEnglish: {
    fontSize: FontSize.tiny,
    fontWeight: '400',
    textAlign: 'center',
  },
});