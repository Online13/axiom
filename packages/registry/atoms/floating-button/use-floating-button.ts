import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FloatingButtonPlacement = 'bottom-end' | 'bottom-center' | 'bottom-start';

export type UseFloatingButtonOptions = {
  placement?: FloatingButtonPlacement;
  /** Extra distance from the bottom, for instance the height of a tab bar. */
  offset?: number;
  /** Distance from the screen edges. */
  margin: number;
  /** Shows or hides the button with a scale and fade, for instance while scrolling. */
  visible?: boolean;
};

/** Placement above the bottom safe area and the show / hide animation. Shared by every styling variant. */
export function useFloatingButton({ placement = 'bottom-end', offset = 0, margin, visible = true }: UseFloatingButtonOptions) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    // Reanimated jumps to the end when Reduce Motion is on.
    progress.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [visible, progress]);

  const position = {
    bottom: insets.bottom + margin + offset,
    ...(placement === 'bottom-start' && { left: insets.left + margin }),
    ...(placement === 'bottom-end' && { right: insets.right + margin }),
    ...(placement === 'bottom-center' && { left: 0, right: 0, alignItems: 'center' as const }),
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  return { position, animatedStyle, hidden: !visible };
}
