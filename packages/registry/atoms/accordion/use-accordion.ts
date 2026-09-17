import { createContext, use, useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useControllableState } from '@/hooks/use-controllable-state';

export type AccordionType = 'single' | 'multiple';

export type UseAccordionOptions = {
  type?: AccordionType;
  /** A string for `single`, an array for `multiple`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** With `single`, lets the user close the open section. */
  collapsible?: boolean;
  disabled?: boolean;
};

const DURATION = 220;

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

/** Open sections of an accordion, shared by every styling variant. */
export function useAccordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled = false,
}: UseAccordionOptions) {
  const [current, setCurrent] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (type === 'single' ? '' : []),
    onChange: onValueChange,
  });
  const open = toArray(current);

  const toggle = (item: string) => {
    const isOpen = open.includes(item);
    if (type === 'multiple') {
      setCurrent(isOpen ? open.filter((v) => v !== item) : [...open, item]);
      return;
    }
    if (isOpen) {
      if (collapsible) setCurrent('');
      return;
    }
    setCurrent(item);
  };

  return { isOpen: (item: string) => open.includes(item), toggle, disabled };
}

export type AccordionContextValue = ReturnType<typeof useAccordion>;

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export type AccordionItemContextValue = { value: string; open: boolean; disabled: boolean; toggle: () => void };

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionContext() {
  const context = use(AccordionContext);
  if (!context) throw new Error('Accordion.Item must be rendered inside Accordion.');
  return context;
}

export function useAccordionItem() {
  const context = use(AccordionItemContext);
  if (!context) throw new Error('Accordion.Trigger and Accordion.Content must be rendered inside Accordion.Item.');
  return context;
}

/** Measures the content once, then animates its height and the indicator rotation on the UI thread. */
export function useAccordionContent(open: boolean, forceMount: boolean) {
  const [mounted, setMounted] = useState(open);
  const [height, setHeight] = useState(0);
  if (open && !mounted) setMounted(true);

  const progress = useSharedValue(open ? 1 : 0);
  const measured = useSharedValue(0);

  useEffect(() => {
    const unmount = () => setMounted(false);
    // Reanimated jumps to the end when Reduce Motion is on.
    progress.value = withTiming(open ? 1 : 0, { duration: DURATION }, (finished) => {
      if (finished && !open) scheduleOnRN(unmount);
    });
  }, [open, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    measured.value = next;
    setHeight((previous) => (previous === next ? previous : next));
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: measured.value * progress.value,
    opacity: progress.value,
  }));

  return { rendered: mounted || forceMount, measured: height > 0, onLayout, containerStyle };
}

export function useAccordionIndicator(open: boolean) {
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: DURATION });
  }, [open, progress]);

  return useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.value * 180}deg` }] }));
}
