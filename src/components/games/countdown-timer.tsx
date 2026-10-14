import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';
import { useStrings } from '@/i18n/strings';

interface CountdownTimerProps {
  totalSeconds: number;
  currentSeconds: number;
  size?: number;
  onFinish?: () => void;
}

export function CountdownTimer({
  totalSeconds,
  currentSeconds,
  size = 100,
  onFinish,
}: CountdownTimerProps) {
  const t = useStrings();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentSeconds === 0) onFinish?.();
  }, [currentSeconds, onFinish]);

  useEffect(() => {
    if (currentSeconds <= 2 && currentSeconds > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [currentSeconds, pulseAnim]);

  const ringColor =
    currentSeconds <= 1
      ? Colors.error
      : currentSeconds <= 2
      ? Colors.warning
      : Colors.success;

  const stroke = size * 0.1;
  const innerSize = size - stroke * 2;

  const totalSegments = 12;
  const activeSegments = Math.ceil(
    (currentSeconds / totalSeconds) * totalSegments
  );

  const segmentSize = stroke * 1.5;

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
      {/* Grey track circle */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: Colors.surfaceDark,
        }}
      />

      {/* Colored segments */}
      {Array.from({ length: totalSegments }).map((_, i) => {
        const angleDeg = (i / totalSegments) * 360 - 90; // start from top
        const angleRad = (angleDeg * Math.PI) / 180;
        const cx = size / 2 + (size / 2 - stroke / 2) * Math.cos(angleRad);
        const cy = size / 2 + (size / 2 - stroke / 2) * Math.sin(angleRad);
        const isActive = i < activeSegments;

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: segmentSize,
              height: segmentSize,
              borderRadius: segmentSize / 2,
              backgroundColor: isActive ? ringColor : Colors.surfaceDark,
              left: cx - segmentSize / 2,
              top: cy - segmentSize / 2,
            }}
          />
        );
      })}

      {/* Center white fill */}
      <View
        style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: Colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size * 0.36,
            fontWeight: '800',
            color: currentSeconds <= 2 ? Colors.error : Colors.textPrimary,
            lineHeight: size * 0.42,
          }}
        >
          {currentSeconds}
        </Text>
        <Text style={styles.secondsLabel}>{t.seconds}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsLabel: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: -4,
  },
});