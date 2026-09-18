import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useControllableState } from '@/hooks/use-controllable-state';

export type TabLayout = { x: number; width: number };

// Firm enough to land with the finger, soft enough to be seen travelling.
const SPRING = { stiffness: 380, damping: 34, mass: 1 };
// A flick this fast switches tab whatever the distance covered.
const FLICK_VELOCITY = 500;
// Past the first and the last panel, the drag only moves this share of the finger.
const EDGE_RESISTANCE = 0.3;
// Shorter drags fall back to the panel they started from.
const COMMIT_RATIO = 1 / 3;

/** Where the indicator sits at a continuous position in the list, between two items. */
function at(layouts: TabLayout[], position: number) {
  'worklet';
  const last = layouts.length - 1;
  const clamped = Math.min(Math.max(position, 0), last);
  const low = layouts[Math.floor(clamped)];
  const high = layouts[Math.ceil(clamped)] ?? low;
  const t = clamped - Math.floor(clamped);
  return { x: low.x + (high.x - low.x) * t, width: low.width + (high.width - low.width) * t };
}

export type UseTabOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Item values, in the order they are laid out. Positions in the list are indexes into it. */
  values: string[];
  /** A horizontal drag across the panels also switches tab. */
  swipeEnabled?: boolean;
  /** The list scrolls, so the selected item has to be brought into view. */
  scrollable?: boolean;
};

/** Selection, indicator travel and the swipeable pager of a tab list, shared by every styling variant. */
export function useTab({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  values,
  swipeEnabled = false,
  scrollable = false,
}: UseTabOptions) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});
  const [pageWidth, setPageWidth] = useState(0);

  const count = values.length;
  const index = Math.max(values.indexOf(value), 0);

  const reduceMotion = useReducedMotion();
  // The one value the pages and the indicator both read: a continuous position in the list.
  const progress = useSharedValue(0);
  const positions = useSharedValue<TabLayout[]>([]);
  // Nothing measured yet: the indicator waits instead of flying in from zero.
  const ready = useSharedValue(false);
  const width = useSharedValue(0);
  const dragFrom = useSharedValue(0);

  const measured = count > 0 && values.every((item) => layouts[item]);
  const layoutsKey = values.map((item) => (layouts[item] ? `${layouts[item].x}:${layouts[item].width}` : '')).join(',');

  useEffect(() => {
    if (!measured) return;
    positions.value = values.map((item) => layouts[item]);
    if (!ready.value) {
      progress.value = index;
      ready.value = true;
    }
    // `layoutsKey` stands for `layouts`, and is stable while the items keep their place.
  }, [measured, layoutsKey, index, layouts, positions, progress, ready, values]);

  // The indicator follows the selection, including when the parent changes it.
  const previousIndex = useRef(index);
  useEffect(() => {
    const from = previousIndex.current;
    previousIndex.current = index;
    if (!ready.value || from === index) return;
    // Pressing a far tab while swiping would fly through every panel in between: jump instead.
    const jump = reduceMotion || (swipeEnabled && Math.abs(index - from) > 1);
    progress.value = jump ? index : withSpring(index, SPRING);
  }, [index, progress, ready, reduceMotion, swipeEnabled]);

  // A panel mounts the first time it is reached, and stays mounted.
  const [mounted, setMounted] = useState<string[]>(() => (value ? [value] : []));
  useEffect(() => {
    if (!value) return;
    setMounted((previous) => (previous.includes(value) ? previous : [...previous, value]));
  }, [value]);

  const mountNeighbours = useCallback(() => {
    setMounted((previous) => {
      const around = [values[index - 1], values[index + 1]].filter((item) => item && !previous.includes(item));
      return around.length ? [...previous, ...around] : previous;
    });
  }, [index, values]);

  const commit = useCallback(
    (next: number) => {
      const item = values[next];
      if (item !== undefined) setValue(item);
    },
    [setValue, values],
  );

  // The gesture runs on the UI thread and keeps its first callbacks: it reaches the latest render through a ref.
  const latest = useRef({ commit, mountNeighbours });
  useLayoutEffect(() => {
    latest.current = { commit, mountNeighbours };
  });
  const commitFromGesture = useCallback((next: number) => latest.current.commit(next), []);
  const mountFromGesture = useCallback(() => latest.current.mountNeighbours(), []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeEnabled && count > 1)
        // Horizontal past 10pt, and never at the expense of a list scrolling inside the panel.
        .activeOffsetX([-10, 10])
        .failOffsetY([-10, 10])
        // On touch down, before the drag is claimed: the panel entered is never blank.
        .onBegin(() => {
          scheduleOnRN(mountFromGesture);
        })
        .onStart(() => {
          dragFrom.value = progress.value;
        })
        .onUpdate((event) => {
          if (!width.value) return;
          const raw = dragFrom.value - event.translationX / width.value;
          const last = count - 1;
          if (raw < 0) progress.value = raw * EDGE_RESISTANCE;
          else if (raw > last) progress.value = last + (raw - last) * EDGE_RESISTANCE;
          else progress.value = raw;
        })
        .onEnd((event, success) => {
          const from = Math.round(dragFrom.value);
          // Velocity decides first, distance second.
          const flick = Math.abs(event.velocityX) > FLICK_VELOCITY;
          const far = width.value > 0 && Math.abs(event.translationX) > width.value * COMMIT_RATIO;
          const direction = event.translationX < 0 ? 1 : -1;
          const target = success && (flick || far) ? Math.min(Math.max(from + direction, 0), count - 1) : from;
          progress.value = reduceMotion ? target : withSpring(target, SPRING);
          if (target !== from) scheduleOnRN(commitFromGesture, target);
        }),
    [commitFromGesture, count, dragFrom, mountFromGesture, progress, reduceMotion, swipeEnabled, width],
  );

  // The list scrolls under the indicator while the pages move, not once they have landed.
  const listRef = useAnimatedRef<Animated.ScrollView>();
  const viewport = useSharedValue(0);
  const content = useSharedValue(0);
  useAnimatedReaction(
    () => progress.value,
    (position) => {
      if (!scrollable || !viewport.value || positions.value.length === 0) return;
      const item = at(positions.value, position);
      const max = Math.max(content.value - viewport.value, 0);
      scrollTo(listRef, Math.min(Math.max(item.x + item.width / 2 - viewport.value / 2, 0), max), 0, false);
    },
  );

  return {
    value,
    index,
    pageWidth,
    /** Whether a panel has been reached at least once. Unmounted panels render nothing. */
    isMounted: (item: string) => mounted.includes(item),
    select: (next: string) => setValue(next),
    /** On each item, to place the indicator under it. */
    onItemLayout: (item: string) => (event: LayoutChangeEvent) => {
      const { x, width: itemWidth } = event.nativeEvent.layout;
      setLayouts((previous) => {
        const known = previous[item];
        if (known?.x === x && known.width === itemWidth) return previous;
        return { ...previous, [item]: { x, width: itemWidth } };
      });
    },
    /** On the pager, whose width is one page. */
    onPagerLayout: (event: LayoutChangeEvent) => {
      const next = event.nativeEvent.layout.width;
      width.value = next;
      setPageWidth((previous) => (previous === next ? previous : next));
    },
    listRef,
    onListLayout: (event: LayoutChangeEvent) => {
      viewport.value = event.nativeEvent.layout.width;
    },
    onListContentSizeChange: (contentWidth: number) => {
      content.value = contentWidth;
    },
    gesture,
    indicatorStyle: useAnimatedStyle(() => {
      if (!ready.value || positions.value.length === 0) return { opacity: 0 };
      const item = at(positions.value, progress.value);
      return { opacity: 1, width: item.width, transform: [{ translateX: item.x }] };
    }),
    pagesStyle: useAnimatedStyle(() => ({ transform: [{ translateX: -progress.value * width.value }] })),
  };
}
