import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { IconName } from '@/components/ui/icons';
import { useControllableState } from '@/hooks/use-controllable-state';

export type SegmentOption = {
  value: string;
  label?: string;
  icon?: IconName;
  accessibilityLabel?: string;
  disabled?: boolean;
};

export type UseSegmentedControlOptions = {
  /** A string is used as both value and label. */
  options: (string | SegmentOption)[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Equal segments filling the track. Positions then come from the track width, not from each segment. */
  fullWidth?: boolean;
  /** Padding of the track around the segments. */
  inset?: number;
};

type Layout = { x: number; width: number };

const TIMING = { duration: 220 };

/** Selection, segment measurement and the sliding, draggable indicator. Shared by every styling variant. */
export function useSegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  fullWidth = true,
  inset = 0,
}: UseSegmentedControlOptions) {
  const segments = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
  const [selected, select] = useControllableState({
    value,
    defaultValue: defaultValue ?? segments[0]?.value ?? '',
    onChange: onValueChange,
  });

  const [measuredLayouts, setLayouts] = useState<(Layout | undefined)[]>([]);
  const [trackWidth, setTrackWidth] = useState(0);
  const selectedIndex = segments.findIndex((segment) => segment.value === selected);

  // Equal segments: computed from the track, which always has its final width when it reports it.
  const segmentWidth = (trackWidth - inset * 2) / segments.length;
  const layouts = fullWidth
    ? trackWidth > 0
      ? segments.map((_, i) => ({ x: inset + i * segmentWidth, width: segmentWidth }))
      : []
    : measuredLayouts;
  const measured = layouts.length === segments.length && layouts.every(Boolean);
  const layoutsKey = layouts.map((layout) => (layout ? `${layout.x}:${layout.width}` : '')).join(',');

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const positions = useSharedValue<Layout[]>([]);
  const visible = useSharedValue(0);

  useEffect(() => {
    if (!measured) return;
    positions.value = layouts as Layout[];
    const target = layouts[selectedIndex];
    if (!target) {
      visible.value = 0;
      return;
    }
    // The first placement doesn't animate.
    const animate = visible.value === 1;
    indicatorX.value = animate ? withTiming(target.x, TIMING) : target.x;
    indicatorWidth.value = animate ? withTiming(target.width, TIMING) : target.width;
    visible.value = 1;
    // `layoutsKey` stands for `layouts`, a new array on every render in full width.
  }, [measured, layoutsKey, selectedIndex, indicatorX, indicatorWidth, positions, visible]);

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth((previous) => (previous === width ? previous : width));
  };

  const onSegmentLayout = (index: number) => (event: LayoutChangeEvent) => {
    if (fullWidth) return;
    const { x, width } = event.nativeEvent.layout;
    setLayouts((previous) => {
      if (previous[index]?.x === x && previous[index]?.width === width) return previous;
      const next = [...previous];
      next[index] = { x, width };
      return next.length > segments.length ? next.slice(0, segments.length) : next;
    });
  };

  const selectIndex = (index: number) => {
    const segment = segments[index];
    if (segment && !segment.disabled) select(segment.value);
  };

  // The gesture runs on the UI thread and keeps its first callbacks: it selects through a ref to the latest render.
  const latestSelectIndex = useRef(selectIndex);
  useLayoutEffect(() => {
    latestSelectIndex.current = selectIndex;
  });
  const drop = useCallback((index: number) => latestSelectIndex.current(index), []);

  // Dragging the indicator: it follows the finger, then lands on the nearest enabled segment.
  const enabled = segments.map((segment) => !segment.disabled && !disabled);
  const enabledKey = enabled.join(',');
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-6, 6])
        .onUpdate((event) => {
          const layout = positions.value;
          if (!layout.length) return;
          const first = layout[0];
          const last = layout[layout.length - 1];
          const x = event.x - indicatorWidth.value / 2;
          indicatorX.value = Math.min(Math.max(x, first.x), last.x + last.width - indicatorWidth.value);
        })
        .onEnd(() => {
          const layout = positions.value;
          const center = indicatorX.value + indicatorWidth.value / 2;
          let nearest = -1;
          layout.forEach((segment, i) => {
            if (!enabled[i]) return;
            const distance = Math.abs(segment.x + segment.width / 2 - center);
            if (nearest === -1 || distance < Math.abs(layout[nearest].x + layout[nearest].width / 2 - center)) {
              nearest = i;
            }
          });
          if (nearest === -1) return;
          indicatorX.value = withTiming(layout[nearest].x, TIMING);
          indicatorWidth.value = withTiming(layout[nearest].width, TIMING);
          scheduleOnRN(drop, nearest);
        }),
    // Rebuilt when the enabled segments change; `enabledKey` stands for `enabled`.
    [disabled, enabledKey, drop],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: visible.value,
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  return { segments, selected, selectIndex, onTrackLayout, onSegmentLayout, gesture, indicatorStyle };
}
