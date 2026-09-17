import { useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  cancelAnimation,
  Easing,
  interpolate,
  makeMutable,
  useAnimatedStyle,
  useReducedMotion,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

// One clock for every skeleton on screen, so shimmers and pulses stay in sync.
const clock = makeMutable(0);
let subscribers = 0;

function subscribe() {
  subscribers++;
  if (subscribers === 1) {
    clock.value = 0;
    clock.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, false);
  }
  return () => {
    subscribers--;
    if (subscribers === 0) cancelAnimation(clock);
  };
}

/** Shared animation clock and the placeholder styles for each animation. Shared by every styling variant. */
export function useSkeleton(animation: SkeletonAnimation, active: boolean) {
  const reduceMotion = useReducedMotion();
  const effective: SkeletonAnimation = reduceMotion ? 'none' : animation;
  const animated = active && effective !== 'none';
  const [width, setWidth] = useState(0);

  useEffect(() => (animated ? subscribe() : undefined), [animated]);

  const pulseStyle = useAnimatedStyle(() =>
    effective === 'pulse' ? { opacity: interpolate(clock.value, [0, 0.5, 1], [1, 0.5, 1]) } : {},
  );

  // The highlight band crosses the placeholder from left to right.
  const shimmerStyle = useAnimatedStyle(() => ({
    width: width * 0.6,
    transform: [{ translateX: interpolate(clock.value, [0, 1], [-width * 0.6, width]) }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setWidth((previous) => (previous === next ? previous : next));
  };

  return { animation: effective, pulseStyle, shimmerStyle, onLayout };
}
