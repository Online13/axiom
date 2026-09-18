import { useState } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { useControllableState } from '@/hooks/use-controllable-state';

export type PasscodeStatus = 'idle' | 'verifying' | 'error' | 'success';

export type UsePasscodeOptions = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Return `false`, or a promise of `false`, to play the error animation and clear the code. */
  onComplete?: (value: string) => void | boolean | Promise<boolean | void>;
  /** Takes over the internal status, for a screen that verifies the code itself. */
  status?: PasscodeStatus;
  disabled?: boolean;
};

// One shake, out and back twice, at a distance the eye reads as a refusal.
const SHAKE = 9;
const STEP: WithTimingConfig = { duration: 55 };
// How long the wrong code stays on screen before the slots empty.
const ERROR_HOLD = 550;

/** Digits, status and error animation of a passcode, shared by every styling variant. */
export function usePasscode({
  length = 4,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  status: statusProp,
  disabled = false,
}: UsePasscodeOptions) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const [internalStatus, setInternalStatus] = useState<PasscodeStatus>('idle');
  const status = statusProp ?? internalStatus;

  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  const shake = () => {
    if (reduceMotion) return;
    offset.value = withSequence(
      withTiming(-SHAKE, STEP),
      withTiming(SHAKE, STEP),
      withTiming(-SHAKE / 2, STEP),
      withTiming(0, STEP),
    );
  };

  const fail = () => {
    setInternalStatus('error');
    shake();
    // The code stays visible long enough to be read as wrong, then clears itself.
    setTimeout(() => {
      setValue('');
      setInternalStatus('idle');
    }, ERROR_HOLD);
  };

  const complete = async (code: string) => {
    if (!onComplete) return;
    const result = onComplete(code);

    if (result instanceof Promise) {
      // `verifying` blocks the keypad until the screen answers, so no digit lands mid-check.
      setInternalStatus('verifying');
      const settled = await result;
      if (settled === false) fail();
      else setInternalStatus('success');
      return;
    }

    if (result === false) fail();
    else setInternalStatus('success');
  };

  const busy = disabled || status === 'verifying' || status === 'error';

  return {
    value,
    status,
    /** How many slots are filled. */
    filled: value.length,
    busy,
    /** Types one digit; the last one runs `onComplete`. */
    press: (digit: string) => {
      if (busy || value.length >= length) return;
      const next = value + digit;
      setValue(next);
      if (next.length === length) void complete(next);
    },
    /** Removes the last digit. */
    remove: () => {
      if (busy || value.length === 0) return;
      setValue(value.slice(0, -1));
    },
    /** Empties the code, for a long press on delete. */
    clear: () => {
      if (busy) return;
      setValue('');
    },
    shakeStyle: useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] })),
    /** Slots never announce the digits themselves, only how many are in. */
    accessibilityValue: `${value.length} of ${length} digits entered`,
  };
}
