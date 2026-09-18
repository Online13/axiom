import { useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { FloatingButton } from '@/components/ui/floating-button';

type Scheme = 'light' | 'dark';

const LABEL: Record<Scheme, string> = { light: 'Light', dark: 'Dark' };

/** Toggles Light ↔ Dark on every screen, to check each component in both themes. */
export function ThemeButton() {
  const system = useColorScheme();
  const [scheme, setScheme] = useState<Scheme>(system === 'dark' ? 'dark' : 'light');

  const toggle = () => {
    const next: Scheme = scheme === 'dark' ? 'light' : 'dark';
    setScheme(next);
    Appearance.setColorScheme(next);
  };

  return (
    <FloatingButton
      icon={scheme === 'dark' ? 'theme-dark' : 'theme-light'}
      variant="tinted"
      accessibilityLabel={`Theme: ${LABEL[scheme]}. Switch to ${LABEL[scheme === 'dark' ? 'light' : 'dark']}`}
      onPress={toggle}
    />
  );
}
