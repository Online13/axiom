import type { ReactNode } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { AppBar, type AppBarProps } from '@/components/ui/app-bar';
import { useTheme } from '@/theme';

export type ScaffoldProps = {
  /** Screen regions, usually `AppBar`, `Content` and an optional `Footer`. */
  children?: ReactNode;
  /** Safe-area edges the screen owns, so its regions don't apply the same inset twice. */
  safeAreaEdges?: Edge[];
  /** The standard screen background, or the grouped-list one. */
  background?: 'default' | 'subtle';
  /** Moves the footer above the keyboard and leaves the content its room. */
  keyboardAvoiding?: boolean;
  /** `auto` follows the resolved color scheme. */
  statusBarStyle?: 'auto' | 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
};

function ScaffoldRoot({
  children,
  safeAreaEdges = ['top', 'bottom'],
  background = 'default',
  keyboardAvoiding = true,
  statusBarStyle = 'auto',
  style,
}: ScaffoldProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  // `auto` means readable on the current background: dark glyphs on a light screen.
  const resolved = statusBarStyle === 'auto' ? (scheme === 'dark' ? 'light' : 'dark') : statusBarStyle;

  const container = [
    styles.root,
    {
      backgroundColor: background === 'subtle' ? colors.background.subtle : colors.background.default,
      paddingTop: safeAreaEdges.includes('top') ? insets.top : 0,
      paddingBottom: safeAreaEdges.includes('bottom') ? insets.bottom : 0,
      paddingLeft: safeAreaEdges.includes('left') ? insets.left : 0,
      paddingRight: safeAreaEdges.includes('right') ? insets.right : 0,
    },
    style,
  ];

  return (
    <View style={container}>
      <StatusBar barStyle={resolved === 'light' ? 'light-content' : 'dark-content'} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView behavior="padding" style={styles.fill}>
          {children}
        </KeyboardAvoidingView>
      ) : (
        children
      )}
    </View>
  );
}

export type ScaffoldAppBarProps = Omit<AppBarProps, 'children' | 'safeArea'> & {
  /** Shortcut for a standard compact bar. */
  title?: string;
  leading?: ReactNode;
  actions?: ReactNode;
  /** The compound slots, when `title` isn't enough. */
  children?: ReactNode;
};

/** The bar of the screen. The root already owns the top inset, so the bar doesn't add it again. */
function ScaffoldAppBar({ title, leading, actions, children, ...props }: ScaffoldAppBarProps) {
  return (
    <AppBar safeArea={false} {...props}>
      {children ?? (
        <>
          {leading ? <AppBar.Leading>{leading}</AppBar.Leading> : null}
          {title ? <AppBar.Title>{title}</AppBar.Title> : null}
          {actions ? <AppBar.Actions>{actions}</AppBar.Actions> : null}
        </>
      )}
    </AppBar>
  );
}

export type ScaffoldContentProps = Omit<ScrollViewProps, 'children'> & {
  children?: ReactNode;
  /** `false` for a list, a map or another child that owns its scrolling. */
  scrollable?: boolean;
};

function ScaffoldContent({
  children,
  scrollable = true,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  style,
  ...props
}: ScaffoldContentProps) {
  if (!scrollable) return <View style={[styles.fill, style]}>{children}</View>;

  return (
    <ScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={contentContainerStyle}
      style={[styles.fill, style]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export type ScaffoldFooterProps = {
  /** Fixed actions after the content region. */
  children?: ReactNode;
  /** Hairline above the footer, when content scrolls behind it. */
  bordered?: boolean;
  /** Adds the bottom safe-area inset here. Leave it off when the root already owns that edge. */
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ScaffoldFooter({ children, bordered = false, safeArea = false, style }: ScaffoldFooterProps) {
  const { tokens, colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          padding: tokens.metrics.screenMargin,
          paddingBottom: tokens.metrics.screenMargin + (safeArea ? insets.bottom : 0),
          gap: tokens.spacing[2],
          backgroundColor: colors.background.default,
          borderTopWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderTopColor: colors.border.subtle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const Scaffold = Object.assign(ScaffoldRoot, {
  AppBar: ScaffoldAppBar,
  Content: ScaffoldContent,
  Footer: ScaffoldFooter,
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
