import { useState } from 'react';
import { Appearance } from 'react-native';

import { FloatingButton } from '@/components/ui/floating-button';
import type { IconName } from '@/components/ui/icons';

type Scheme = 'unspecified' | 'light' | 'dark';

const NEXT: Record<Scheme, Scheme> = { unspecified: 'light', light: 'dark', dark: 'unspecified' };

const LABEL: Record<Scheme, string> = { unspecified: 'System', light: 'Light', dark: 'Dark' };

const ICON: Record<Scheme, IconName> = {
  unspecified: 'theme-system',
  light: 'theme-light',
  dark: 'theme-dark',
};

/** Cycles System → Light → Dark on every screen, to check each component in both themes. */
export function ThemeButton() {
  const [scheme, setScheme] = useState<Scheme>('unspecified');

  const cycle = () => {
    const next = NEXT[scheme];
    setScheme(next);
    Appearance.setColorScheme(next);
  };

  return (
    <FloatingButton
      icon={ICON[scheme]}
      variant="tinted"
      accessibilityLabel={`Theme: ${LABEL[scheme]}. Switch to ${LABEL[NEXT[scheme]]}`}
      onPress={cycle}
    />
  );
}
