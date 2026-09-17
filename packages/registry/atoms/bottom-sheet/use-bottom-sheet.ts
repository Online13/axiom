import { createContext, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { KeyboardController, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useBottomSheet } from './bottom-sheet-root';

/** Points (`320`), a percentage of the screen (`'50%'`), or `'content'` to fit the children. */
export type SnapPoint = number | `${number}%` | 'content';

/**
 * - `interactive`: the sheet rises with the keyboard, frame by frame.
 * - `extend`: same, and the sheet also moves to its highest snap point.
 * - `none`: the sheet stays where it is.
 */
export type KeyboardBehavior = 'interactive' | 'extend' | 'none';

export type UseBottomSheetContentOptions = {
  snapPoints?: SnapPoint[];
  /** Controlled snap point. */
  index?: number;
  onIndexChange?: (index: number) => void;
  /** Closes on swipe down, backdrop press and back button. */
  dismissible?: boolean;
  /** Called after the close animation ends. */
  onDismiss?: () => void;
  /** Distance between the bottom of the sheet and the bottom of the screen, for a detached sheet. */
  bottomOffset?: number;
  /** How the sheet reacts when an input inside it opens the keyboard. */
  keyboardBehavior?: KeyboardBehavior;
};

// Critically damped: settles fast without bouncing.
const SPRING = { stiffness: 400, damping: 40, mass: 1 };
// How far the release velocity carries the sheet, in seconds, when picking the snap point.
const VELOCITY_PROJECTION = 0.1;

/** Snap points, gesture, animation and back button of a bottom sheet, shared by every styling variant. */
export function useBottomSheetContent({
  snapPoints = ['content'],
  index: controlledIndex,
  onIndexChange,
  dismissible = true,
  onDismiss,
  bottomOffset = 0,
  keyboardBehavior = 'interactive',
}: UseBottomSheetContentOptions) {
  const { open, setOpen } = useBottomSheet();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  const [uncontrolledIndex, setUncontrolledIndex] = useState(controlledIndex ?? 0);
  const index = Math.min(controlledIndex ?? uncontrolledIndex, snapPoints.length - 1);

  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  // Bumped when a close was refused by the owner, so the sheet goes back to its snap point.
  const [restore, setRestore] = useState(0);

  const fitsContent = snapPoints.includes('content');
  const ready = !fitsContent || contentHeight !== null;
  const maxHeight = screenHeight - insets.top - bottomOffset;

  const heights = snapPoints.map((point) => {
    const height =
      point === 'content'
        ? (contentHeight ?? 0)
        : typeof point === 'number'
          ? point
          : (screenHeight * parseFloat(point)) / 100;
    return Math.min(height, maxHeight);
  });
  const sheetHeight = ready ? Math.max(...heights) : maxHeight;
  // translateY of the sheet for each snap point, and when closed.
  const snapPositions = heights.map((height) => sheetHeight - height);
  const closedPosition = sheetHeight + bottomOffset;

  const translateY = useSharedValue(screenHeight);
  const positions = useSharedValue(snapPositions);
  const closed = useSharedValue(closedPosition);
  const canDismiss = useSharedValue(dismissible);
  const isReady = useSharedValue(false);
  const start = useSharedValue(0);

  // The keyboard covers the bottom safe area, so the sheet only rises by what's above it.
  const keyboard = useReanimatedKeyboardAnimation();
  const followsKeyboard = useSharedValue(keyboardBehavior !== 'none');
  const safeBottom = useSharedValue(insets.bottom);
  const topLimit = useSharedValue(maxHeight - sheetHeight);

  // Scrollable content (BottomSheet.ScrollView) takes the gesture back when it isn't at the top.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);
  const hasScroll = useSharedValue(false);

  // Callbacks run from the UI thread read the latest render through this ref.
  const latest = useRef({ open, index, controlledIndex, onIndexChange, onDismiss, setOpen });
  useLayoutEffect(() => {
    latest.current = { open, index, controlledIndex, onIndexChange, onDismiss, setOpen };
  });

  const requestIndex = useCallback((next: number) => {
    const { index: current, controlledIndex: controlled, onIndexChange: onChange } = latest.current;
    if (controlled === undefined) setUncontrolledIndex(next);
    if (next !== current) onChange?.(next);
  }, []);

  const requestClose = useCallback(() => latest.current.setOpen(false), []);

  const onClosed = useCallback(() => {
    if (latest.current.open) {
      // The owner kept the sheet open: go back to the current snap point.
      setRestore((value) => value + 1);
      return;
    }
    setMounted(false);
    setContentHeight(null);
    latest.current.onDismiss?.();
  }, []);

  const wasOpen = useRef(false);
  const positionsKey = snapPositions.join(',');

  useEffect(() => {
    positions.value = snapPositions;
    closed.value = closedPosition;
    canDismiss.value = dismissible;
    followsKeyboard.value = keyboardBehavior !== 'none';
    safeBottom.value = insets.bottom;
    topLimit.value = maxHeight - sheetHeight;
    isReady.value = mounted && ready;
    if (!mounted || !ready) return;

    if (open) {
      if (!wasOpen.current) {
        translateY.value = closedPosition;
        wasOpen.current = true;
      }
      translateY.value = withSpring(snapPositions[index], SPRING);
    } else if (wasOpen.current) {
      wasOpen.current = false;
      if (KeyboardController.isVisible()) KeyboardController.dismiss();
      translateY.value = withSpring(closedPosition, SPRING, (finished) => {
        if (finished) scheduleOnRN(onClosed);
      });
    }
    // `positionsKey` stands for `snapPositions`, which is a new array on every render.
  }, [open, mounted, ready, index, positionsKey, closedPosition, dismissible, restore, keyboardBehavior, insets.bottom, maxHeight, sheetHeight]);

  // `extend`: go to the highest snap point when the keyboard opens.
  const highestIndex = snapPositions.indexOf(Math.min(...snapPositions));
  useAnimatedReaction(
    () => keyboard.progress.value > 0.5,
    (visible, previous) => {
      if (keyboardBehavior === 'extend' && visible && previous === false && positions.value.length > 0) {
        scheduleOnRN(requestIndex, highestIndex);
      }
    },
    [keyboardBehavior, highestIndex, requestIndex],
  );

  /** How far the sheet rises above its snap position. It stops when the top of the sheet reaches the top limit. */
  const keyboardLift = useDerivedValue(() => {
    if (!followsKeyboard.value) return 0;
    const lift = Math.max(0, Math.abs(keyboard.height.value) - safeBottom.value);
    return Math.min(lift, Math.max(0, topLimit.value + translateY.value));
  });

  useEffect(() => {
    if (!open) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dismissible) requestClose();
      return true;
    });
    return () => subscription.remove();
  }, [open, dismissible, requestClose]);

  const nativeGesture = useMemo(() => Gesture.Native(), []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .simultaneousWithExternalGesture(nativeGesture)
        .onStart(() => {
          start.value = translateY.value;
        })
        .onUpdate((event) => {
          const top = Math.min(...positions.value);
          const bottom = canDismiss.value ? closed.value : Math.max(...positions.value);

          // The list is scrolled: it owns the gesture. Keep the start in sync so the sheet doesn't jump later.
          if (hasScroll.value && scrollOffset.value > 0) {
            start.value = translateY.value - event.translationY;
            return;
          }

          let next = start.value + event.translationY;
          if (next < top) {
            if (hasScroll.value) {
              // Fully open and dragging up: the list scrolls instead.
              translateY.value = top;
              start.value = top - event.translationY;
              return;
            }
            next = top;
          }

          translateY.value = Math.min(next, bottom);
          if (hasScroll.value) scrollTo(scrollRef, 0, 0, false);
        })
        .onEnd((event) => {
          const top = Math.min(...positions.value);
          if (hasScroll.value && scrollOffset.value > 0 && translateY.value <= top) return;

          const projected = translateY.value + event.velocityY * VELOCITY_PROJECTION;
          let target = 0;
          positions.value.forEach((position, i) => {
            if (Math.abs(position - projected) < Math.abs(positions.value[target] - projected)) target = i;
          });

          const config = { ...SPRING, velocity: event.velocityY };
          if (canDismiss.value && Math.abs(closed.value - projected) < Math.abs(positions.value[target] - projected)) {
            translateY.value = withSpring(closed.value, config, (finished) => {
              if (finished) scheduleOnRN(onClosed);
            });
            scheduleOnRN(requestClose);
            return;
          }

          translateY.value = withSpring(positions.value[target], config);
          scheduleOnRN(requestIndex, target);
        }),
    [
      nativeGesture,
      start,
      translateY,
      positions,
      closed,
      canDismiss,
      hasScroll,
      scrollOffset,
      scrollRef,
      onClosed,
      requestClose,
      requestIndex,
    ],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const registerScroll = useCallback(() => {
    hasScroll.value = true;
    return () => {
      hasScroll.value = false;
      scrollOffset.value = 0;
    };
  }, [hasScroll, scrollOffset]);

  /** 0 when closed, 1 at the first snap point. Drives the Overlay. */
  const progress = useDerivedValue(() => {
    // Until 'content' is measured, the positions are placeholders: closed and first can be equal, which read as fully open.
    if (!isReady.value) return 0;
    const first = positions.value[0] ?? 0;
    if (closed.value === first) return 1;
    return interpolate(translateY.value, [closed.value, first], [0, 1], Extrapolation.CLAMP);
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboardLift.value }],
  }));

  // Keeps the footer at the bottom of the screen at every snap point, and lets it leave with the sheet.
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.min(translateY.value, Math.max(...positions.value)) }],
  }));

  const onContentLayout = (event: LayoutChangeEvent) => {
    if (!fitsContent) return;
    const { height } = event.nativeEvent.layout;
    setContentHeight((previous) => (previous === height ? previous : height));
  };

  const onFooterLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setFooterHeight((previous) => (previous === height ? previous : height));
  };

  return {
    mounted,
    open,
    dismissible,
    close: requestClose,
    sheetHeight,
    fitsContent,
    footerHeight,
    progress,
    gesture: panGesture,
    sheetStyle,
    footerStyle,
    onContentLayout,
    onFooterLayout,
    context: {
      index,
      snapCount: snapPoints.length,
      requestIndex,
      close: requestClose,
      footerHeight,
      nativeGesture,
      scrollRef,
      scrollHandler,
      registerScroll,
    },
  };
}

export type BottomSheetContentContextValue = ReturnType<typeof useBottomSheetContent>['context'];

export const BottomSheetContentContext = createContext<BottomSheetContentContextValue | null>(null);

export function useBottomSheetContentContext() {
  const context = use(BottomSheetContentContext);
  if (!context) {
    throw new Error('This part must be rendered inside BottomSheet.Content.');
  }
  return context;
}
