import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TramStop {
  id: string;
  nameCantonese: string;
  nameEnglish: string;
  position: number; // current position in the user's arrangement (0-indexed)
}

export type StopStatus = 'default' | 'correct' | 'wrong';

interface DraggableStopProps {
  stop: TramStop;
  index: number;
  status: StopStatus;
  onDragEnd: (stopId: string, newIndex: number) => void;
  totalStops: number;
  containerWidth: number;
  chipWidth: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DraggableStop({
  stop,
  index,
  status,
  onDragEnd,
  totalStops,
  containerWidth,
  chipWidth
}: DraggableStopProps) {
  const chipWidthRef = useRef(chipWidth);
  const indexRef = useRef(index);
  const onDragEndRef = useRef(onDragEnd);

  onDragEndRef.current = onDragEnd;
  chipWidthRef.current = chipWidth;
  indexRef.current = index;

  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;
        pan.setOffset({ x: (pan.x as any)._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });

        // Scale up while dragging — tactile feedback
        Animated.spring(scaleAnim, {
          toValue: 1.12,
          useNativeDriver: false,
          speed: 40,
          bounciness: 0,
        }).start();
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        isDragging.current = false;
        pan.flattenOffset();

        // Scale back down
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: false,
          speed: 30,
          bounciness: 4,
        }).start();

        // Snap back to position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          speed: 20,
          bounciness: 6,
        }).start();

        // Calculate new index from drag distance
        const draggedCells = Math.round(gestureState.dx / chipWidthRef.current);
        const newIndex = Math.max(
          0,
          Math.min(totalStops - 1, indexRef.current + draggedCells)
        );

        if (newIndex !== indexRef.current) {
          onDragEndRef.current(stop.id, newIndex);
        }
      },
    })
  ).current;

  const bgColor =
    status === 'correct'
      ? Colors.success
      : status === 'wrong'
      ? Colors.error
      : Colors.surface;

  const borderColor =
    status === 'correct'
      ? Colors.success
      : status === 'wrong'
      ? Colors.error
      : Colors.surfaceDark;

  const textColor =
    status === 'correct' || status === 'wrong'
      ? Colors.white
      : Colors.textPrimary;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.chip,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          minWidth: chipWidth,
          transform: [
            { translateX: pan.x },
            { scale: scaleAnim },
          ],
          zIndex: isDragging.current ? 10 : 1,
          shadowOpacity: isDragging.current ? 0.3 : 0.12,
          elevation: isDragging.current ? 8 : 3,
        },
      ]}
    >
      {/* Position number badge */}
      <View
        style={[
          styles.positionBadge,
          {
            backgroundColor:
              status === 'correct' || status === 'wrong'
                ? 'rgba(255,255,255,0.3)'
                : Colors.surfaceDark,
          },
        ]}
      >
        <Text
          style={[
            styles.positionText,
            { color: status !== 'default' ? Colors.white : Colors.textSecondary },
          ]}
        >
          {index + 1}
        </Text>
      </View>

      {/* Stop name */}
      <Text
        style={[styles.stopName, { color: textColor }]}
        numberOfLines={1}
      >
        {stop.nameCantonese}
      </Text>
      <Text
        style={[styles.stopNameEn, { color: textColor, opacity: 0.75 }]}
        numberOfLines={1}
      >
        {stop.nameEnglish}
      </Text>

      {/* Drag handle dots */}
      {status === 'default' && (
        <View style={styles.dragHandle}>
          <Text style={styles.dragDots}>⠿</Text>
        </View>
      )}
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  chip: {
    borderRadius: Spacing.two,
    borderWidth: 2,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    height: 90,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 0,
  },
  positionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  positionText: {
    fontSize: 10,
    fontWeight: '800',
  },
  stopName: {
    fontSize: FontSize.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  stopNameEn: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  dragHandle: {
    marginTop: 2,
  },
  dragDots: {
    fontSize: 12,
    color: Colors.textSecondary,
    opacity: 0.5,
  },
});