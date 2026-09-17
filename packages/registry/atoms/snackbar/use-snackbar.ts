import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AccessibilityInfo, useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { IconName } from '@/components/ui/icons';

export type SnackbarDismissReason = 'timeout' | 'action' | 'swipe' | 'replaced' | 'dismiss';

export type SnackbarOptions = {
  message: string;
  /** One text action, usually "Undo" or "Retry". Pressing it also dismisses the snackbar. */
  action?: { label: string; onPress: () => void };
  /** `short` is 4s, `long` 8s (the default with an action). */
  duration?: 'short' | 'long' | 'indefinite' | number;
  icon?: IconName;
  /** Commit a destructive action here if it wasn't undone. */
  onDismiss?: (reason: SnackbarDismissReason) => void;
};

export type SnackbarData = SnackbarOptions & { id: number; open: boolean; reason?: SnackbarDismissReason };

// Only one snackbar is visible. A replaced one stays in the list until its exit animation ends.
let items: SnackbarData[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit(next: SnackbarData[]) {
  items = next;
  listeners.forEach((listener) => listener());
}

function close(id: number, reason: SnackbarDismissReason) {
  emit(items.map((item) => (item.id === id && item.open ? { ...item, open: false, reason } : item)));
}

export const snackbar = {
  show(options: SnackbarOptions) {
    const id = ++counter;
    const replaced = items.map((item) => (item.open ? { ...item, open: false, reason: 'replaced' as const } : item));
    emit([...replaced, { ...options, id, open: true }]);
    AccessibilityInfo.announceForAccessibility(options.action ? `${options.message}. ${options.action.label} available` : options.message);
    return id;
  },
  /** Hides the current snackbar. */
  dismiss() {
    const current = items.find((item) => item.open);
    if (current) close(current.id, 'dismiss');
  },
};

function remove(id: number) {
  const item = items.find((entry) => entry.id === id);
  emit(items.filter((entry) => entry.id !== id));
  item?.onDismiss?.(item.reason ?? 'dismiss');
}

export function useSnackbars() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => items,
  );
}

const DURATIONS = { short: 4000, long: 8000, indefinite: Infinity };
const SPRING = { stiffness: 380, damping: 34, mass: 1 };

/** Timer, swipe down, left or right to dismiss and the enter and exit animation of one snackbar. */
export function useSnackbarItem(data: SnackbarData, swipeToDismiss: boolean) {
  const progress = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  // 0 until the pan picks an axis, then 1 for horizontal and 2 for vertical.
  const axis = useSharedValue(0);
  const [touching, setTouching] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReader);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (data.open) {
      progress.value = withSpring(1, SPRING);
      return;
    }
    const finish = () => remove(data.id);
    progress.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) scheduleOnRN(finish);
    });
  }, [data.open, data.id, progress]);

  const base = data.duration ?? (data.action ? 'long' : 'short');
  // A screen reader needs longer to read the message and reach the action.
  const duration = (typeof base === 'number' ? base : DURATIONS[base]) * (screenReader ? 2 : 1);

  useEffect(() => {
    if (!data.open || touching || !Number.isFinite(duration)) return;
    const timeout = setTimeout(() => close(data.id, 'timeout'), duration);
    return () => clearTimeout(timeout);
  }, [data.open, data.id, touching, duration]);

  const id = data.id;
  const gesture = useMemo(() => {
    const swipe = () => close(id, 'swipe');
    return Gesture.Pan()
      .enabled(swipeToDismiss)
      .activeOffsetX([-10, 10])
      .activeOffsetY([-10, 10])
      .onBegin(() => {
        axis.value = 0;
        scheduleOnRN(setTouching, true);
      })
      .onUpdate((event) => {
        if (axis.value === 0) {
          axis.value = Math.abs(event.translationX) > Math.abs(event.translationY) ? 1 : 2;
        }
        if (axis.value === 1) {
          dragX.value = event.translationX;
        } else {
          // Down follows the finger, up resists.
          dragY.value = event.translationY > 0 ? event.translationY : event.translationY * 0.2;
        }
      })
      .onEnd((event) => {
        if (axis.value === 1) {
          if (Math.abs(event.translationX) > screenWidth * 0.3 || Math.abs(event.velocityX) > 800) {
            // Slide out on the side of the swipe, then close.
            const direction = (event.velocityX !== 0 ? event.velocityX : event.translationX) > 0 ? 1 : -1;
            dragX.value = withTiming(direction * screenWidth, { duration: 180 }, (finished) => {
              if (finished) scheduleOnRN(swipe);
            });
          } else {
            dragX.value = withSpring(0, SPRING);
          }
        } else if (event.translationY > 24 || event.velocityY > 500) {
          scheduleOnRN(swipe);
        } else {
          dragY.value = withSpring(0, SPRING);
        }
      })
      .onFinalize(() => {
        scheduleOnRN(setTouching, false);
      });
    // Shared values are stable references.
  }, [id, swipeToDismiss, screenWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    // A horizontal drag fades the snackbar as it leaves.
    opacity: progress.value * (1 - Math.min(Math.abs(dragX.value) / screenWidth, 1) * 0.8),
    transform: [{ translateX: dragX.value }, { translateY: dragY.value + (1 - progress.value) * 32 }],
  }));

  const onAction = () => {
    data.action?.onPress();
    close(id, 'action');
  };

  return { gesture, animatedStyle, onAction };
}
