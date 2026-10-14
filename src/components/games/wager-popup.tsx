import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { WagerAmount, COMMUNITY_AVG_SCORES } from '@/store/wager-store';
import { usePlayerStore } from '@/store/player-store';
import { useStrings } from '@/i18n/strings';

// ─── Props ────────────────────────────────────────────────────────────────────

interface WagerPopupProps {
  visible: boolean;
  gameId: string;
  gameTitle: string;
  gameEmoji: string;
  onWager: (amount: WagerAmount) => void;
  onSkip: () => void;
}

// ─── Wager amount button ──────────────────────────────────────────────────────

function WagerAmountButton({
  amount,
  isSelected,
  payout,
  canAfford,
  onPress,
}: {
  amount: WagerAmount;
  isSelected: boolean;
  payout: number;
  canAfford: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!canAfford}
      style={[
        styles.amountButton,
        isSelected && styles.amountButtonSelected,
        !canAfford && styles.amountButtonDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`下注 ${amount} 積分`}
      accessibilityState={{ selected: isSelected, disabled: !canAfford }}
    >
      {/* Wager amount */}
      <Text
        style={[
          styles.amountValue,
          isSelected && styles.amountValueSelected,
          !canAfford && styles.amountValueDisabled,
        ]}
      >
        🪙 {amount}
      </Text>

      {/* Arrow */}
      <Text style={[
        styles.amountArrow,
        !canAfford && styles.amountValueDisabled,
      ]}>
        →
      </Text>

      {/* Payout */}
      <Text
        style={[
          styles.amountPayout,
          isSelected && styles.amountPayoutSelected,
          !canAfford && styles.amountValueDisabled,
        ]}
      >
        🪙 {payout}
      </Text>

      {/* Can't afford label */}
      {!canAfford && (
        <Text style={styles.cantAffordLabel}>積分唔夠</Text>
      )}
    </Pressable>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WagerPopup({
  visible,
  gameId,
  gameTitle,
  gameEmoji,
  onWager,
  onSkip,
}: WagerPopupProps) {
  const t = useStrings();
  const coins = usePlayerStore((s) => s.coins);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const [selectedAmount, setSelectedAmount] = useState<WagerAmount | null>(null);

  const communityAvg = COMMUNITY_AVG_SCORES[gameId] ?? 60;
  const WAGER_OPTIONS: WagerAmount[] = [10, 20, 50];

  // Slide up animation
  useEffect(() => {
    if (visible) {
      setSelectedAmount(null);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleConfirm = () => {
    if (!selectedAmount) return;
    onWager(selectedAmount);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onSkip}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onSkip} />

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Game info header */}
        <View style={styles.gameHeader}>
          <Text style={styles.gameEmoji}>{gameEmoji}</Text>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{gameTitle}</Text>
            <View style={styles.communityAvgRow}>
              <Text style={styles.communityAvgLabel}>
                {t.wagerCommunityAvg}:
              </Text>
              <Text style={styles.communityAvgValue}>{communityAvg}</Text>
            </View>
          </View>
          {/* Current coins */}
          <View style={styles.coinsBadge}>
            <Text style={styles.coinsBadgeEmoji}>🪙</Text>
            <Text style={styles.coinsBadgeValue}>{coins}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{t.wagerTitle}</Text>
        <Text style={styles.subtitle}>{t.wagerSubtitle}</Text>

        {/* Win condition */}
        <View style={styles.winConditionBox}>
          <Text style={styles.winConditionEmoji}>🎯</Text>
          <Text style={styles.winConditionText}>{t.wagerWinCondition}</Text>
        </View>

        {/* Payout label */}
        <Text style={styles.chooseLabel}>{t.wagerChooseAmount}</Text>

        {/* Wager amount options */}
        <View style={styles.amountRow}>
          {WAGER_OPTIONS.map((amount) => (
            <WagerAmountButton
              key={amount}
              amount={amount}
              isSelected={selectedAmount === amount}
              payout={Math.round(amount * 2.5)}
              canAfford={coins >= amount}
              onPress={() => setSelectedAmount(amount)}
            />
          ))}
        </View>

        {/* Payout info */}
        <Text style={styles.payoutInfo}>{t.wagerPayout}</Text>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          {/* Skip */}
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && { backgroundColor: Colors.surfaceDark },
            ]}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel={t.wagerSkip}
          >
            <Text style={styles.skipButtonText}>{t.wagerSkip}</Text>
          </Pressable>

          {/* Confirm wager */}
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              !selectedAmount && styles.confirmButtonDisabled,
              pressed && selectedAmount && { backgroundColor: Colors.primaryDark },
            ]}
            onPress={handleConfirm}
            disabled={!selectedAmount}
            accessibilityRole="button"
            accessibilityLabel={t.wagerConfirm}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !selectedAmount && styles.confirmButtonTextDisabled,
              ]}
            >
              {t.wagerConfirm}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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
    paddingBottom: Spacing.eight,
    paddingTop: Spacing.two,
    gap: Spacing.three,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.two,
  },

  // ── Game header ──
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Colors.background,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
  },
  gameEmoji: {
    fontSize: 36,
  },
  gameInfo: {
    flex: 1,
    gap: 4,
  },
  gameTitle: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  communityAvgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  communityAvgLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  communityAvgValue: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.primary,
  },
  coinsBadge: {
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
  coinsBadgeEmoji: { fontSize: 16 },
  coinsBadgeValue: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // ── Title ──
  title: {
    fontSize: FontSize.subtitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -Spacing.two,
  },

  // ── Win condition ──
  winConditionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.background,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
  },
  winConditionEmoji: { fontSize: 20 },
  winConditionText: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // ── Amount options ──
  chooseLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  amountRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  amountButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    gap: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  amountButtonSelected: {
    borderColor: Colors.gold,
    borderWidth: 3,
    backgroundColor: `${Colors.gold}22`,
  },
  amountButtonDisabled: {
    opacity: 0.5,
  },
  amountValue: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  amountValueSelected: {
    color: Colors.gold,
  },
  amountValueDisabled: {
    color: Colors.textSecondary,
  },
  amountArrow: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
  },
  amountPayout: {
    fontSize: FontSize.small,
    fontWeight: '800',
    color: Colors.success,
  },
  amountPayoutSelected: {
    color: Colors.success,
  },
  cantAffordLabel: {
    fontSize: 9,
    color: Colors.error,
    fontWeight: '700',
  },
  payoutInfo: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ── Buttons ──
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceDark,
    backgroundColor: Colors.surface,
  },
  skipButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderBottomWidth: 4,
    borderBottomColor: '#B8832A',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.surfaceDark,
    borderBottomColor: Colors.surfaceDark,
  },
  confirmButtonText: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.white,
  },
  confirmButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});