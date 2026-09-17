import { useEffect, useState } from 'react';
import type { AccessibilityActionEvent } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

export type UseSwitchOptions = {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export type UseSwitchResult = {
  checked: boolean;
  /** 0 when off, 1 when on, animated. Drives the thumb position and the track color. */
  progress: SharedValue<number>;
  toggle: () => void;
  accessibilityProps: {
    accessibilityRole: 'switch';
    accessibilityState: { checked: boolean; disabled: boolean };
    accessibilityActions: { name: 'activate' }[];
    onAccessibilityAction: (event: AccessibilityActionEvent) => void;
  };
};

/** On/off state and thumb animation, shared by every styling variant of Switch. */
export function useSwitch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
}: UseSwitchOptions): UseSwitchResult {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = value !== undefined;
  const checked = controlled ? value : uncontrolled;

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    // Reanimated jumps to the end when Reduce Motion is on.
    progress.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, progress]);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  return {
    checked,
    progress,
    toggle,
    accessibilityProps: {
      accessibilityRole: 'switch',
      accessibilityState: { checked, disabled },
      accessibilityActions: [{ name: 'activate' }],
      onAccessibilityAction: (event) => {
        if (event.nativeEvent.actionName === 'activate') toggle();
      },
    },
  };
}
