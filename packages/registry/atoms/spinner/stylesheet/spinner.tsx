import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { textColor, type TextColor } from '@/components/ui/text';
import { useTheme } from '@/theme';

export type SpinnerProps = {
  /** From the `icon` size tokens (16, 20, 24), or a number. */
  size?: 'sm' | 'md' | 'lg' | number;
  color?: TextColor;
  /** Announced by screen readers. Not rendered. */
  label?: string;
  /** `false` hides the spinner but keeps its space. */
  animating?: boolean;
  /** Waits this many ms before showing, to avoid a flash on fast responses. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function Spinner({
  size = 'md',
  color = 'default',
  label = 'Loading',
  animating = true,
  delay = 0,
  style,
}: SpinnerProps) {
  const { tokens, colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const [delayed, setDelayed] = useState(delay > 0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (delay <= 0) return;
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const visible = animating && !delayed;

  useEffect(() => {
    if (!visible) {
      cancelAnimation(progress);
      return;
    }
    // With Reduce Motion, the spinner pulses slowly instead of turning.
    progress.value = 0;
    progress.value = reduceMotion
      ? withRepeat(withTiming(1, { duration: 1000 }), -1, true)
      : withRepeat(withTiming(1, { duration: 800, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(progress);
  }, [visible, reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() =>
    reduceMotion
      ? { opacity: 0.4 + progress.value * 0.6 }
      : { transform: [{ rotate: `${progress.value * 360}deg` }] },
  );

  const dimension = typeof size === 'number' ? size : tokens.sizes.icon[size];
  const stroke = Math.max(2, Math.round(dimension / 10));
  const tint = textColor(colors, color);

  return (
    <View
      accessible={visible}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: visible }}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
      style={[{ width: dimension, height: dimension, opacity: visible ? 1 : 0 }, style]}
    >
      <Animated.View
        style={[
          styles.ring,
          { borderRadius: dimension / 2, borderWidth: stroke, borderColor: tint },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // One transparent side draws the gap of the ring.
  ring: {
    flex: 1,
    borderTopColor: 'transparent',
  },
});
