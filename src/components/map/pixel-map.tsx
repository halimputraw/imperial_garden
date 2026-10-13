// src/components/map/pixel-map.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { NeighbourhoodZone, Zone, ZoneId } from './neighbourhood-zone';

// ─── Zone Definitions ─────────────────────────────────────────────────────────
// All positions are % of map canvas — scales to any screen size
// Layout inspiration: rough top-down HK island / Kowloon feel
//
//  [  Victoria Park  ]  [  Housing Estate  ]
//        (top-left)           (top-right)
//
//  [  Wet Market     ]  [  Cha Chaan Teng  ]
//       (bottom-left)        (bottom-right)
//
// Water strip runs along the bottom (harbour)

const ZONES: Zone[] = [
  {
    id: 'park',
    labelCantonese: '維多利亞公園',
    labelEnglish: 'Victoria Park',
    emoji: '🌳',
    color: Colors.zonePark,
    borderColor: '#3A7A52',
    xPct: 5,
    yPct: 8,
    widthPct: 40,
    heightPct: 30,
  },
  {
    id: 'estate',
    labelCantonese: '公共屋邨',
    labelEnglish: 'Housing Estate',
    emoji: '🏢',
    color: Colors.zoneEstate,
    borderColor: '#5A7A9C',
    xPct: 53,
    yPct: 8,
    widthPct: 42,
    heightPct: 30,
  },
  {
    id: 'market',
    labelCantonese: '街市',
    labelEnglish: 'Wet Market',
    emoji: '🥬',
    color: Colors.zoneMarket,
    borderColor: '#4A8A4A',
    xPct: 5,
    yPct: 46,
    widthPct: 40,
    heightPct: 30,
  },
  {
    id: 'cafe',
    labelCantonese: '茶餐廳',
    labelEnglish: 'Cha Chaan Teng',
    emoji: '🍵',
    color: Colors.zoneCafe,
    borderColor: '#9A5A20',
    xPct: 53,
    yPct: 46,
    widthPct: 42,
    heightPct: 30,
  },
];

// ─── Decorative pixel elements ────────────────────────────────────────────────
// Small fixed decorations placed on the map for visual warmth
// Each has a position (% based) and an emoji

interface Decoration {
  emoji: string;
  xPct: number;
  yPct: number;
  size: number;
}

const DECORATIONS: Decoration[] = [
  { emoji: '🏮', xPct: 47, yPct: 20, size: 20 },  // lantern between zones (center)
  { emoji: '⛵', xPct: 20, yPct: 82, size: 18 },   // boat in harbour
  { emoji: '⛵', xPct: 60, yPct: 86, size: 16 },   // another boat
  { emoji: '🌸', xPct: 46, yPct: 52, size: 16 },   // flower between bottom zones
  { emoji: '🏮', xPct: 47, yPct: 58, size: 14 },   // lantern
  { emoji: '☁️',  xPct: 30, yPct: 2,  size: 20 },  // cloud top
  { emoji: '☁️',  xPct: 65, yPct: 1,  size: 16 },  // cloud top right
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface PixelMapProps {
  onZonePress: (zone: Zone) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PixelMap({ onZonePress }: PixelMapProps) {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | null>(null);

  // Subtle idle animation for the harbour water
  const waveAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnim]);

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapSize({ width, height });
  }, []);

  const handleZonePress = useCallback(
    (zone: Zone) => {
      setSelectedZoneId(zone.id);
      onZonePress(zone);
    },
    [onZonePress]
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>

      {/* ── Sky strip ───────────────────────────────────────────────────── */}
      <View style={styles.sky} />

      {/* ── Ground / map body ───────────────────────────────────────────── */}
      <View style={styles.ground} />

      {/* ── Harbour water (bottom strip) ────────────────────────────────── */}
      <Animated.View style={[styles.harbour, { opacity: waveOpacity }]}>
        <Text style={styles.harbourLabel}>維多利亞港</Text>
        <Text style={styles.harbourLabelEn}>Victoria Harbour</Text>
      </Animated.View>

      {/* ── Road grid (simple cross) ─────────────────────────────────────── */}
      {/* Vertical road */}
      <View style={[styles.road, styles.roadVertical]} />
      {/* Horizontal road */}
      <View style={[styles.road, styles.roadHorizontal]} />

      {/* ── Decorations ─────────────────────────────────────────────────── */}
      {mapSize.width > 0 &&
        DECORATIONS.map((d, i) => (
          <Text
            key={i}
            style={[
              styles.decoration,
              {
                left: (d.xPct / 100) * mapSize.width,
                top: (d.yPct / 100) * mapSize.height,
                fontSize: d.size,
              },
            ]}
            pointerEvents="none"
          >
            {d.emoji}
          </Text>
        ))}

      {/* ── Neighbourhood zones ──────────────────────────────────────────── */}
      {mapSize.width > 0 &&
        ZONES.map((zone) => (
          <NeighbourhoodZone
            key={zone.id}
            zone={zone}
            mapWidth={mapSize.width}
            mapHeight={mapSize.height}
            onPress={handleZonePress}
            isSelected={selectedZoneId === zone.id}
          />
        ))}

      {/* ── Pixel grid overlay (subtle) ──────────────────────────────────── */}
      {/* Gives the map a very faint grid texture for pixel art feel */}
      <View style={styles.pixelGridOverlay} pointerEvents="none" />

      {/* ── Map title badge ──────────────────────────────────────────────── */}
      <View style={styles.mapTitleBadge}>
        <Text style={styles.mapTitleText}>🗺 香港地圖</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mapBg,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.surfaceDark,
    // Hard pixel shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 6,
  },

  // Sky strip at top (~15% height)
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: '#B8D4F0', // soft morning sky blue
  },

  // Ground covers rest above harbour
  ground: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    bottom: '18%',
    backgroundColor: Colors.mapBg,
  },

  // Harbour at bottom ~18%
  harbour: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '18%',
    backgroundColor: Colors.mapWater,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#7AB8CC',
  },
  harbourLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textOnDark,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  harbourLabelEn: {
    fontSize: FontSize.tiny,
    color: Colors.textOnDark,
    opacity: 0.85,
  },

  // Roads
  road: {
    position: 'absolute',
    backgroundColor: Colors.mapRoad,
    borderColor: Colors.surfaceDark,
  },
  roadVertical: {
    width: '8%',
    top: '10%',
    bottom: '18%',
    left: '46%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  roadHorizontal: {
    height: '8%',
    left: 0,
    right: 0,
    top: '39%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  // Decorative emojis
  decoration: {
    position: 'absolute',
    zIndex: 1,
  },

  // Very subtle pixel grid overlay
  pixelGridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
    backgroundColor: Colors.black,
  },

  // Map title badge (top-left corner)
  mapTitleBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.surfaceDark,
    zIndex: 10,
  },
  mapTitleText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});