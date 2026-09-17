import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { Tappable } from '@/components/core/tappable';
import { useTheme } from '@/theme';

import { useSwitch, type UseSwitchOptions } from '../use-switch';

export type SwitchSize = 'sm' | 'md';

export type SwitchProps = UseSwitchOptions & {
  size?: SwitchSize;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

// md matches the iOS system switch.
const DIMENSIONS: Record<SwitchSize, { width: number; height: number; thumb: number }> = {
  sm: { width: 40, height: 24, thumb: 20 },
  md: { width: 51, height: 31, thumb: 27 },
};

export function Switch({ size = 'md', disabled = false, accessibilityLabel, style, ...options }: SwitchProps) {
  const { components } = useTheme();
  const { progress, toggle, accessibilityProps } = useSwitch({ ...options, disabled });

  const tokens = components.switch.default;
  const off = { ...tokens.default, ...(disabled ? tokens.disabled : undefined) };
  const on = { ...tokens.default, ...tokens.checked, ...(disabled ? tokens.disabled : undefined) };

  const { width, height, thumb } = DIMENSIONS[size];
  const inset = (height - thumb) / 2;
  const travel = width - thumb - inset * 2;

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [off.track, on.track]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [0, travel]) }],
  }));

  return (
    <Tappable
      {...accessibilityProps}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={toggle}
    >
      <Animated.View style={[styles.track, { width, height, padding: inset, borderRadius: height / 2 }, style, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            { width: thumb, height: thumb, borderRadius: thumb / 2, backgroundColor: on.thumb },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    boxShadow: '0px 2px 4px hsla(0, 0%, 0%, 0.2)',
  },
});
