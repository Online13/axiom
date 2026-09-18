import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

/** A progress a screen can drive from a scroll handler, or set once as a plain number. */
export type Progress = number | SharedValue<number>;

const clamp = (value: number) => {
  'worklet';
  return Math.min(Math.max(value, 0), 1);
};

/** Reads a progress that may be a number or a shared value, always as a shared value between 0 and 1. */
export function useProgress(progress: Progress | undefined, fallback = 0): SharedValue<number> {
  return useDerivedValue(() => {
    if (progress === undefined) return fallback;
    return clamp(typeof progress === 'number' ? progress : progress.value);
  });
}

/** Height of the row holding the leading, title and action slots. */
export const APP_BAR_HEIGHT = 44;
/** Height of the row holding the large title. */
export const LARGE_TITLE_HEIGHT = 52;
