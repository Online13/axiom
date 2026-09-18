import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

/**
 * Whether the software keyboard is up, so the bar can step aside and leave the field room.
 * `enabled` is false when the bar stays put: no listener is attached at all.
 */
export function useKeyboardVisible(enabled = true): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // `Will` fires with the animation on iOS; Android only ever sends `Did`.
    const show = Keyboard.addListener('keyboardWillShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setVisible(false));
    const shown = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hidden = Keyboard.addListener('keyboardDidHide', () => setVisible(false));

    return () => {
      show.remove();
      hide.remove();
      shown.remove();
      hidden.remove();
    };
  }, [enabled]);

  return enabled && visible;
}
