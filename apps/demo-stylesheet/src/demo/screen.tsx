import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { useTheme } from '@/theme';

/** Scrollable demo screen with the default margins and spacing between sections. */
export function Screen({ children }: { children: ReactNode }) {
  const { tokens, colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background.subtle }}
      contentContainerStyle={{
        padding: tokens.metrics.screenMargin,
        paddingBottom: tokens.spacing[12],
        gap: tokens.spacing[8],
      }}
    >
      {children}
    </ScrollView>
  );
}
