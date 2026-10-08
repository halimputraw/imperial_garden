// src/components/app-tabs.tsx

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, TabBar } from '@/constants/theme';

// ─── Tab definitions ──────────────────────────────────────────────────────────

interface TabItem {
  name: string;          // expo-router screen name
  labelCantonese: string;
  labelEnglish: string;
  emoji: string;         // large icon — no icon library needed
  href: string;
}

const TABS: TabItem[] = [
  {
    name: 'index',
    labelCantonese: '地圖',
    labelEnglish: 'Map',
    emoji: '🗺️',
    href: '/',
  },
  {
    name: 'home-screen',
    labelCantonese: '我的家',
    labelEnglish: 'My Home',
    emoji: '🏠',
    href: '/home-screen',
  },
  {
    name: 'games',
    labelCantonese: '遊戲',
    labelEnglish: 'Games',
    emoji: '🎮',
    href: '/games',
  },
  {
    name: 'friends',
    labelCantonese: '朋友',
    labelEnglish: 'Friends',
    emoji: '👥',
    href: '/friends',
  },
];

// ─── Single tab button ────────────────────────────────────────────────────────

interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ tab, isActive, onPress }: TabButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityRole="tab"
      accessibilityLabel={tab.labelCantonese}
      accessibilityState={{ selected: isActive }}
      style={styles.tabPressable}
    >
      <Animated.View
        style={[
          styles.tabInner,
          isActive && styles.tabInnerActive,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Active indicator pill above emoji */}
        {isActive && <View style={styles.activePill} />}

        {/* Emoji icon */}
        <Text style={[styles.tabEmoji, isActive && styles.tabEmojiActive]}>
          {tab.emoji}
        </Text>

        {/* Cantonese label */}
        <Text
          style={[styles.tabLabel, isActive && styles.tabLabelActive]}
          numberOfLines={1}
        >
          {tab.labelCantonese}
        </Text>

        {/* English sub-label */}
        <Text
          style={[styles.tabSubLabel, isActive && styles.tabSubLabelActive]}
          numberOfLines={1}
        >
          {tab.labelEnglish}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom tab bar ───────────────────────────────────────────────────────────

function CustomTabBar({
  state,
  navigation,
}: {
  state: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, Spacing.two),
          height: TabBar.height + Math.max(insets.bottom, Spacing.two),
        },
      ]}
    >
      {/* Top border — pixel art style hard line */}
      <View style={styles.topBorder} />

      <View style={styles.tabBarRow}>
        {TABS.map((tab, index) => {
          const isActive = state.index === index;
          return (
            <TabButton
              key={tab.name}
              tab={tab}
              isActive={isActive}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index]?.key,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(state.routes[index]?.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Main export — wraps Expo Router Tabs ─────────────────────────────────────

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="home-screen" />
      <Tabs.Screen name="games" />
      <Tabs.Screen name="friends" />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.surface,
    // Hard pixel shadow upward
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 12,
  },
  topBorder: {
    height: 3,
    backgroundColor: Colors.surfaceDark,
  },
  tabBarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },

  // Each tab takes equal width
  tabPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // elderly touch target
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    width: '90%',
    gap: 1,
  },
  tabInnerActive: {
    backgroundColor: Colors.surfaceDark,
  },

  // Active pill indicator
  activePill: {
    position: 'absolute',
    top: -2,
    width: 24,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // Emoji
  tabEmoji: {
    fontSize: 24,
    opacity: 0.55, // inactive — dimmed
  },
  tabEmojiActive: {
    opacity: 1,
    fontSize: 26, // slightly bigger when active
  },

  // Cantonese label
  tabLabel: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },

  // English sub-label
  tabSubLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    opacity: 0.6,
    textAlign: 'center',
  },
  tabSubLabelActive: {
    color: Colors.primary,
    opacity: 0.8,
  },
});