import { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { LARGE_TITLE_HEIGHT } from '@/components/ui/use-app-bar';

/**
 * Drives an `AppBar variant="large"` from the scroll of its content: the large title folds into the
 * compact bar over its own height, and comes back at the top.
 *
 * The list has to be an `Animated` one, since `onScroll` is a Reanimated handler.
 */
export function useLargeTitle(distance = LARGE_TITLE_HEIGHT) {
  const offset = useSharedValue(0);
  const collapse = useDerivedValue(() => Math.min(Math.max(offset.value / distance, 0), 1));

  const onScroll = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.y;
  });

  return { collapse, onScroll };
}
