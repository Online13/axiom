import { router, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AppBar } from '@/components/ui/app-bar';
import { IconButton } from '@/components/ui/icon-button';
import { Scaffold } from '@/components/ui/scaffold';
import { experienceTitle } from '@/demo/experiences';
import { screenTitle } from '@/demo/screens';
import { useTheme } from '@/theme';

/** Back button of a pushed demo screen. Nothing to go back to means no button. */
export function BackButton() {
  if (!router.canGoBack()) return null;

  return <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />;
}

/** The title of the current route, read from the demo catalogues. */
export function useRouteTitle(fallback = 'Axiom') {
  const pathname = usePathname();
  const name = pathname.split('/').filter(Boolean).pop() ?? '';

  return screenTitle(name) ?? experienceTitle(name) ?? fallback;
}

export type ScreenProps = {
  children: ReactNode;
  /** Overrides the title read from the route. */
  title?: string;
  /** Actions on the right of the bar. */
  actions?: ReactNode;
  /** `false` when the screen draws its own scrolling region. */
  scrollable?: boolean;
};

/**
 * A pushed demo screen: the app's own AppBar over a scrolling body with the standard margins.
 * Scrolls the focused field above the keyboard.
 */
export function Screen({ children, title, actions, scrollable = true }: ScreenProps) {
  const { tokens, colors } = useTheme();
  const routeTitle = useRouteTitle();

  return (
    <Scaffold background="subtle" safeAreaEdges={['top']} keyboardAvoiding={false}>
      <AppBar safeArea={false} bordered backgroundColor={colors.background.subtle}>
        <AppBar.Leading>
          <BackButton />
        </AppBar.Leading>
        <AppBar.Title>{title ?? routeTitle}</AppBar.Title>
        {actions ? <AppBar.Actions>{actions}</AppBar.Actions> : null}
      </AppBar>
      {scrollable ? (
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
      ) : (
        children
      )}
    </Scaffold>
  );
}
