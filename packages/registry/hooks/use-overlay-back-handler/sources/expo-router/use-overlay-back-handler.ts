import { useContext, useEffect, useId, useRef } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContext, NavigationRouteContext, PreventRemoveContext } from 'expo-router/react-navigation';

/**
 * Closes an open overlay (sheet, dialog, menu) on a back action instead of leaving the screen:
 * - the Android back button, even on the first screen of the stack;
 * - the back gesture and the header back button, which Expo Router would otherwise use to remove the screen.
 *
 * The action is consumed while the overlay is open, even when it can't be dismissed. This includes
 * `router.back()` or `navigation.goBack()` called while it's open: close the overlay first, and navigate
 * once it's closed.
 *
 * Outside a screen (a root layout, for instance), only the Android back button is handled.
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

  // Same as `usePreventRemove`, which throws outside a screen. Read through contexts, the hook works anywhere.
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const preventRemove = useContext(PreventRemoveContext);
  const id = useId();
  const routeKey = route?.key;
  const setPreventRemove = preventRemove?.setPreventRemove;

  // Tells a native stack to block its native dismissal (iOS swipe back) while the overlay is open.
  useEffect(() => {
    if (!routeKey || !setPreventRemove) return;
    setPreventRemove(id, routeKey, open);
    return () => setPreventRemove(id, routeKey, false);
  }, [id, routeKey, setPreventRemove, open]);

  useEffect(() => {
    if (!open || !navigation || !routeKey) return;
    return navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();
      latest.current?.();
    });
  }, [navigation, routeKey, open]);
}
