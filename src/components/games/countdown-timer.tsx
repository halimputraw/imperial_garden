import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CountdownTimerProps {
  totalSeconds: number;       // e.g. 5
  currentSeconds: number;     // counts down from totalSeconds → 0
  size?: number;              // diameter of the ring, default 100
  onFinish?: () => void;      // called when currentSeconds hits 0
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CountdownTimer({
  totalSeconds,
  currentSeconds,
  size = 100,
  onFinish,
}: CountdownTimerProps) {
  // Progress: 1.0 = full ring, 0.0 = empty ring
  const progress = currentSeconds / totalSeconds;

  // Animated value drives the ring arc and colour
  const animatedProgress = useRef(new Animated.Value(progress)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Smoothly animate ring as seconds change
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false, // needs to drive non-transform styles
    }).start();
  }, [progress, animatedProgress]);

  // Pulse ring when ≤ 2 seconds left — urgency cue for elderly
  useEffect(() => {
    if (currentSeconds <= 2 && currentSeconds > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [currentSeconds, pulseAnim]);

  // Fire onFinish
  useEffect(() => {
    if (currentSeconds === 0) {
      onFinish?.();
    }
  }, [currentSeconds, onFinish]);

  // Colour shifts green → orange → red as time runs out
  const ringColor = animatedProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [Colors.error, Colors.warning, Colors.success],
  });

  // Ring geometry
  const stroke = size * 0.1;
  const radius = (size - stroke) / 2;
  const center = size / 2;

  // We fake the SVG ring with two rotated semicircle views
  // (no SVG dependency needed — pure React Native)
  // The trick: two half-circles, clip and rotate to show arc progress
  const halfSize = size / 2;

  // How many degrees to show — 0° = empty, 360° = full
  const degrees = progress * 360;

  // We split into two halves:
  // Right half: shows 0–180°
  // Left half: shows 180–360°
  const rightDegrees = Math.min(degrees, 180);
  const leftDegrees = Math.max(degrees - 180, 0);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* ── Background ring (grey track) ── */}
      <View
        style={[
          styles.ringTrack,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: Colors.surfaceDark,
          },
        ]}
      />

      {/* ── Coloured arc — right half ── */}
      <View
        style={[
          styles.halfCircleContainer,
          {
            width: halfSize,
            height: size,
            left: halfSize,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.halfCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: stroke,
              borderColor: ringColor,
              transform: [
                { translateX: -halfSize / 2 },
                { rotate: `${rightDegrees - 180}deg` },
              ],
            },
          ]}
        />
      </View>

      {/* ── Coloured arc — left half ── */}
      {degrees > 180 && (
        <View
          style={[
            styles.halfCircleContainer,
            {
              width: halfSize,
              height: size,
              left: 0,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.halfCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: stroke,
                borderColor: ringColor,
                transform: [
                  { translateX: halfSize / 2 },
                  { rotate: `${leftDegrees}deg` },
                ],
              },
            ]}
          />
        </View>
      )}

      {/* ── Centre number ── */}
      <View
        style={[
          styles.center,
          { width: size, height: size },
        ]}
      >
        <Text
          style={[
            styles.number,
            {
              fontSize: size * 0.36,
              color:
                currentSeconds <= 2 ? Colors.error : Colors.textPrimary,
            },
          ]}
        >
          {currentSeconds}
        </Text>
        <Text style={styles.secondsLabel}>秒</Text>
      </View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
  },
  halfCircleContainer: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: '800',
    lineHeight: undefined,
  },
  secondsLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: -4,
  },
});