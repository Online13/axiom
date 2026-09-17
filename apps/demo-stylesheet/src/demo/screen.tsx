import type { ReactNode } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useTheme } from '@/theme';

/** Scrollable demo screen with the default margins and spacing between sections. Scrolls the focused field above the keyboard. */
export function Screen({ children }: { children: ReactNode }) {
  const { tokens, colors } = useTheme();

  return (
    <KeyboardAwareScrollView
      bottomOffset={tokens.spacing[4]}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.background.subtle }}
      contentContainerStyle={{
        padding: tokens.metrics.screenMargin,
        // Room for the theme button.
        paddingBottom: tokens.spacing[12] * 2,
        gap: tokens.spacing[8],
      }}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
