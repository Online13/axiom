import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

/**
 * Closes an open overlay (sheet, dialog, menu) on the Android back button instead of leaving the screen.
 * The press is consumed while the overlay is open, even when it can't be dismissed.
 *
 * This version only handles `BackHandler`. With a navigator, also listen to `beforeRemove` so the
 * back gesture closes the overlay first.
 */
export function useOverlayBackHandler(open: boolean, onClose: (() => void) | undefined) {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      latest.current?.();
      return true;
    });
    return () => subscription.remove();
  }, [open]);
}
