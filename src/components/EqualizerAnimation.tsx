import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface EqualizerAnimationProps {
  isPlaying?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  barCount?: number;
}

export const EqualizerAnimation: React.FC<EqualizerAnimationProps> = ({
  isPlaying = true,
  color = Colors.primary,
  size = 'small',
  barCount = 3,
}) => {
  const heights = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.8)).current,
    useRef(new Animated.Value(0.5)).current,
    useRef(new Animated.Value(0.9)).current,
  ];

  useEffect(() => {
    let animations: Animated.CompositeAnimation[] = [];

    if (isPlaying) {
      const createAnimation = (val: Animated.Value, duration: number, min: number, max: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(val, {
              toValue: max,
              duration,
              useNativeDriver: false,
            }),
            Animated.timing(val, {
              toValue: min,
              duration: duration * 0.9,
              useNativeDriver: false,
            }),
          ])
        );
      };

      animations = [
        createAnimation(heights[0], 380, 0.2, 0.95),
        createAnimation(heights[1], 310, 0.3, 1.0),
        createAnimation(heights[2], 440, 0.15, 0.85),
        createAnimation(heights[3], 360, 0.25, 0.9),
      ];

      animations.forEach((anim) => anim.start());
    } else {
      heights.forEach((h) => h.setValue(0.2));
    }

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [isPlaying]);

  const containerHeight = size === 'small' ? 16 : size === 'large' ? 26 : 20;
  const barWidth = size === 'small' ? 3 : size === 'large' ? 4.5 : 3.5;
  const gap = size === 'small' ? 2 : size === 'large' ? 3.5 : 2.5;

  return (
    <View style={[styles.container, { height: containerHeight, gap }]}>
      {Array.from({ length: barCount }).map((_, index) => {
        const animatedStyle = {
          height: heights[index % 4].interpolate({
            inputRange: [0, 1],
            outputRange: [3, containerHeight],
          }),
        };

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                backgroundColor: color,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    borderRadius: 2,
  },
});
