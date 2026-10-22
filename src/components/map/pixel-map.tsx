// src/components/map/pixel-map.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
  ImageBackground,
  Image,
  Pressable
} from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { NeighbourhoodZone, Zone, ZoneId } from './neighbourhood-zone';
import { useStrings } from '@/i18n/strings';

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

interface MapElement {
  source: any;
  xPct: number;
  yPct: number;
  widthPct: number;  // % of map width
  heightPct: number; // % of map height
}

interface MapNode {
  id: string;
  locationName: string;
  locationEnglish: string;
  imageSource: any;
  levelSource: any;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  levelXPct: number;  // level badge position
  levelYPct: number;
  levelWidthPct: number;
  levelHeightPct: number;
}

const DECORATIONS: Decoration[] = [
  { emoji: '☁️',  xPct: 30, yPct: 2,  size: 20 },  // cloud top
  { emoji: '☁️',  xPct: 65, yPct: 1,  size: 16 },  // cloud top right
];

const MAP_ELEMENTS: MapElement[] = [
  { source: require('../../../assets/map/elements/tree1.png'),  xPct: -30, yPct: 55, widthPct: 150, heightPct: 15 },
  { source: require('../../../assets/map/elements/char.png'),   xPct: 28,  yPct: 75, widthPct: 25,  heightPct: 23 },
  { source: require('../../../assets/map/elements/rocks.png'),  xPct: 7,   yPct: 30, widthPct: 23,  heightPct: 20 },
];

const MAP_NODES: MapNode[] = [
  {
    id: 'temple',
    locationName: '侯王廟',
    locationEnglish: 'Visit Hau Wong Temple',
    imageSource:  require('../../../assets/map/elements/temple.png'),
    levelSource:  require('../../../assets/map/elements/level1.png'),
    xPct: -3,  yPct: 53,  widthPct: 50,  heightPct: 65,
    levelXPct: 5, levelYPct: 65, levelWidthPct: 30, levelHeightPct: 15,
  },
  {
    id: 'chachanteng',
    locationName: '金華冰廳',
    locationEnglish: 'Visit Kam Wah Cafe, Mong Kok',
    imageSource:  require('../../../assets/map/elements/chachanteng.png'),
    levelSource:  require('../../../assets/map/elements/level2.png'),
    xPct: 45, yPct: 53, widthPct: 35, heightPct: 30,
    levelXPct: 43, levelYPct: 53, levelWidthPct: 40, levelHeightPct: 17,
  },
  {
    id: 'mtr',
    locationName: '油麻地地鐵站',
    locationEnglish: 'Visit Yau Ma Tei MTR Station',
    imageSource:  require('../../../assets/map/elements/mtr-station.png'),
    levelSource:  require('../../../assets/map/elements/level3.png'),
    xPct: 40, yPct: 33, widthPct: 35, heightPct: 25,
    levelXPct: 41, levelYPct: 33, levelWidthPct: 30, levelHeightPct: 15,
  },
  {
    id: 'fountain',
    locationName: '星光大道',
    locationEnglish: 'Visit Avenue of Stars',
    imageSource:  require('../../../assets/map/elements/fountain.png'),
    levelSource:  require('../../../assets/map/elements/level4.png'),
    xPct: 58, yPct: 26, widthPct: 30, heightPct: 13,
    levelXPct: 58, levelYPct: 23, levelWidthPct: 30, levelHeightPct: 10,
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface PixelMapProps {
  onZonePress: (zone: Zone) => void;
  onNodePress: (node: MapNode) => void;
}

export type { MapNode };

// ─── Component ────────────────────────────────────────────────────────────────

export function PixelMap({ onZonePress, onNodePress  }: PixelMapProps) {
  const t = useStrings();
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

  const nodeScales = React.useRef<Record<string, Animated.Value>>(
    Object.fromEntries(MAP_NODES.map(n => [n.id, new Animated.Value(1)]))
  ).current;

  const handleNodePressIn = useCallback((id: string) => {
    Animated.spring(nodeScales[id], {
      toValue: 1.15,
      useNativeDriver: true,
      speed: 30,
      bounciness: 12,
    }).start();
  }, [nodeScales]);

  const handleNodePressOut = useCallback((id: string) => {
    Animated.spring(nodeScales[id], {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [nodeScales]);

  return (
    <ImageBackground
      source={require('../../../assets/map/background.png')}
      style={styles.container}
      resizeMode="cover"
      onLayout={handleLayout}
    >
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

      {/* ── Clickable location nodes ─────────────────────────────────────── */}
      {mapSize.width > 0 &&
        MAP_NODES.map((node) => (
          <React.Fragment key={node.id}>
            {/* Main building image — bouncy */}
            <Pressable
              onPress={() => onNodePress(node)}
              onPressIn={() => handleNodePressIn(node.id)}
              onPressOut={() => handleNodePressOut(node.id)}
              style={{
                position: 'absolute',
                left:   (node.xPct      / 100) * mapSize.width,
                top:    (node.yPct      / 100) * mapSize.height,
                width:  (node.widthPct  / 100) * mapSize.width,
                height: (node.heightPct / 100) * mapSize.height,
              }}
            >
              <Animated.Image
                source={node.imageSource}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: [{ scale: nodeScales[node.id] }],
                }}
                resizeMode="contain"
              />
            </Pressable>
            {/* Level badge — same bounce */}
            <Pressable
              onPress={() => onNodePress(node)}
              onPressIn={() => handleNodePressIn(node.id)}
              onPressOut={() => handleNodePressOut(node.id)}
              style={{
                position: 'absolute',
                left:   (node.levelXPct      / 100) * mapSize.width,
                top:    (node.levelYPct      / 100) * mapSize.height,
                width:  (node.levelWidthPct  / 100) * mapSize.width,
                height: (node.levelHeightPct / 100) * mapSize.height,
              }}
            >
              <Animated.Image
                source={node.levelSource}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: [{ scale: nodeScales[node.id] }],
                }}
                resizeMode="contain"
              />
            </Pressable>
          </React.Fragment>
      ))}

      {/* ── Non-clickable map elements (tree, char, rocks) ───────────────── */}
      {mapSize.width > 0 &&
        MAP_ELEMENTS.map((el, i) => (
          <Image
            key={i}
            source={el.source}
            style={{
              position: 'absolute',
              left:   (el.xPct   / 100) * mapSize.width,
              top:    (el.yPct   / 100) * mapSize.height,
              width:  (el.widthPct  / 100) * mapSize.width,
              height: (el.heightPct / 100) * mapSize.height,
            }}
            resizeMode="contain"
          />
        ))}

      {/* ── Map title badge ──────────────────────────────────────────────── */}
      <View style={styles.mapTitleBadge}>
        <Text style={styles.mapTitleText}>{t.mapTitle}</Text>
      </View>
    </ImageBackground>
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