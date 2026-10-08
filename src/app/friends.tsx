// src/app/friends.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  lastSeen: string;
  currentZone: string;
  isOnline: boolean;
}

interface CommunityEvent {
  id: string;
  emoji: string;
  title: string;
  description: string;
  time: string;
  participants: number;
  maxParticipants: number;
}

const FRIENDS: Friend[] = [
  {
    id: '1',
    name: '李婆婆',
    avatar: '👵',
    level: 5,
    lastSeen: '而家',
    currentZone: '街市',
    isOnline: true,
  },
  {
    id: '2',
    name: '王叔叔',
    avatar: '👴',
    level: 3,
    lastSeen: '1 小時前',
    currentZone: '茶餐廳',
    isOnline: false,
  },
  {
    id: '3',
    name: '張師奶',
    avatar: '👩',
    level: 7,
    lastSeen: '而家',
    currentZone: '維多利亞公園',
    isOnline: true,
  },
  {
    id: '4',
    name: '陳大媽',
    avatar: '🧓',
    level: 4,
    lastSeen: '3 小時前',
    currentZone: '公共屋邨',
    isOnline: false,
  },
];

const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    emoji: '🌸',
    title: '維多利亞公園賞花活動',
    description: '一齊去公園睇花，認識新朋友！',
    time: '今日 下午 3:00',
    participants: 8,
    maxParticipants: 12,
  },
  {
    id: '2',
    emoji: '🍵',
    title: '茶餐廳早茶聚會',
    description: '一齊飲早茶，傾吓偈！',
    time: '聽日 上午 9:00',
    participants: 5,
    maxParticipants: 8,
  },
  {
    id: '3',
    emoji: '🀄',
    title: '麻雀比賽',
    description: '4 人一組，一齊打麻雀，贏取積分！',
    time: '後日 下午 2:00',
    participants: 12,
    maxParticipants: 16,
  },
];

// ─── Tab selector ─────────────────────────────────────────────────────────────

type TabType = 'friends' | 'events';

interface TabSelectorProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

function TabSelector({ active, onChange }: TabSelectorProps) {
  return (
    <View style={styles.tabSelector}>
      {(
        [
          { key: 'friends', label: '👥 朋友' },
          { key: 'events', label: '🎉 社區活動' },
        ] as { key: TabType; label: string }[]
      ).map((tab) => (
        <Pressable
          key={tab.key}
          style={[
            styles.tabSelectorItem,
            active === tab.key && styles.tabSelectorItemActive,
          ]}
          onPress={() => onChange(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === tab.key }}
        >
          <Text
            style={[
              styles.tabSelectorLabel,
              active === tab.key && styles.tabSelectorLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Friend card ──────────────────────────────────────────────────────────────

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <View style={styles.friendCard}>
      {/* Avatar + online dot */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          <Text style={styles.friendAvatar}>{friend.avatar}</Text>
        </View>
        {/* Online indicator dot */}
        <View
          style={[
            styles.onlineDot,
            {
              backgroundColor: friend.isOnline
                ? Colors.success
                : Colors.surfaceDark,
            },
          ]}
        />
      </View>

      {/* Info */}
      <View style={styles.friendInfo}>
        <View style={styles.friendNameRow}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{friend.level}</Text>
          </View>
        </View>
        <Text style={styles.friendZone}>
          📍 {friend.currentZone}
        </Text>
        <Text style={styles.friendLastSeen}>
          {friend.isOnline ? '🟢 而家喺度' : `⚪ ${friend.lastSeen}`}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.friendActions}>
        <Pressable
          style={styles.visitButton}
          accessibilityRole="button"
          accessibilityLabel={`探訪 ${friend.name}`}
        >
          <Text style={styles.visitButtonText}>探訪</Text>
        </Pressable>
        <Pressable
          style={styles.questButton}
          accessibilityRole="button"
          accessibilityLabel={`同 ${friend.name} 做任務`}
        >
          <Text style={styles.questButtonText}>任務</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: CommunityEvent }) {
  const isFull = event.participants >= event.maxParticipants;
  const fillPct = (event.participants / event.maxParticipants) * 100;

  return (
    <View style={styles.eventCard}>
      {/* Header */}
      <View style={styles.eventHeader}>
        <Text style={styles.eventEmoji}>{event.emoji}</Text>
        <View style={styles.eventTitleBlock}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>🕐 {event.time}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.eventDescription}>{event.description}</Text>

      {/* Participants progress bar */}
      <View style={styles.participantsRow}>
        <Text style={styles.participantsText}>
          👥 {event.participants} / {event.maxParticipants} 人
        </Text>
        {isFull && (
          <View style={styles.fullBadge}>
            <Text style={styles.fullBadgeText}>已滿</Text>
          </View>
        )}
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${fillPct}%` as any,
              backgroundColor: isFull ? Colors.error : Colors.success,
            },
          ]}
        />
      </View>

      {/* Join button */}
      <Pressable
        style={({ pressed }) => [
          styles.joinButton,
          isFull && styles.joinButtonDisabled,
          !isFull && pressed && { backgroundColor: Colors.primaryDark },
        ]}
        disabled={isFull}
        accessibilityRole="button"
        accessibilityLabel={isFull ? '活動已滿' : `參加 ${event.title}`}
      >
        <Text
          style={[
            styles.joinButtonText,
            isFull && styles.joinButtonTextDisabled,
          ]}
        >
          {isFull ? '活動已滿' : '參加活動 →'}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Friends list ─────────────────────────────────────────────────────────────

function FriendsList() {
  const online = FRIENDS.filter((f) => f.isOnline);
  const offline = FRIENDS.filter((f) => !f.isOnline);

  return (
    <View style={styles.section}>
      {/* Online friends */}
      <Text style={styles.sectionTitle}>
        🟢 而家喺度 ({online.length})
      </Text>
      <View style={styles.cardList}>
        {online.map((f) => (
          <FriendCard key={f.id} friend={f} />
        ))}
      </View>

      {/* Offline friends */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.four }]}>
        ⚪ 最近喺度 ({offline.length})
      </Text>
      <View style={styles.cardList}>
        {offline.map((f) => (
          <FriendCard key={f.id} friend={f} />
        ))}
      </View>

      {/* Add friend nudge */}
      <Pressable
        style={styles.addFriendButton}
        accessibilityRole="button"
        accessibilityLabel="搵新朋友"
      >
        <Text style={styles.addFriendText}>＋ 搵新朋友</Text>
      </Pressable>
    </View>
  );
}

// ─── Events list ─────────────────────────────────────────────────────────────

function EventsList() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>即將舉行嘅活動</Text>
      <View style={styles.cardList}>
        {COMMUNITY_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('friends');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 朋友</Text>
        <Text style={styles.headerSubtitle}>Friends</Text>
      </View>

      {/* Tab selector */}
      <TabSelector active={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'friends' ? <FriendsList /> : <EventsList />}
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

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ── Tab selector ──
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  tabSelectorItem: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: Colors.transparent,
  },
  tabSelectorItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabSelectorLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabSelectorLabelActive: {
    color: Colors.primary,
  },

  scrollContent: {
    paddingBottom: Spacing.eight,
  },

  section: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardList: {
    gap: Spacing.three,
  },

  // ── Friend card ──
  friendCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  friendAvatar: {
    fontSize: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  friendInfo: {
    flex: 1,
    gap: 3,
  },
  friendNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  friendName: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  levelBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.one,
    paddingVertical: 1,
    borderRadius: Spacing.one,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  friendZone: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  friendLastSeen: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  friendActions: {
    gap: Spacing.one,
  },
  visitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryDark,
    alignItems: 'center',
    minWidth: 52,
  },
  visitButtonText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.white,
  },
  questButton: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceDark,
    alignItems: 'center',
    minWidth: 52,
  },
  questButtonText: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  addFriendButton: {
    marginTop: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addFriendText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.primary,
  },

  // ── Event card ──
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  eventEmoji: {
    fontSize: 36,
  },
  eventTitleBlock: {
    flex: 1,
    gap: 3,
  },
  eventTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  eventTime: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  eventDescription: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantsText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fullBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  fullBadgeText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Colors.white,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
  },
  joinButtonDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderBottomColor: Colors.surfaceDark,
  },
  joinButtonText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },
  joinButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});