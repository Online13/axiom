import { useEffect } from 'react';
import { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

// Short enough that a selection bar feels like part of the same gesture.
const DURATION = 180;
const TRAVEL = 24;

/** Enter and exit transition of a toolbar, shared by every styling variant. */
export function useToolBar(visible: boolean) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    const target = visible ? 1 : 0;
    progress.value = reduceMotion ? target : withTiming(target, { duration: DURATION });
  }, [visible, reduceMotion, progress]);

  return {
    animatedStyle: useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [{ translateY: (1 - progress.value) * TRAVEL }],
    })),
  };
}
