import { Children, createContext, isValidElement, use, type ReactElement, type ReactNode } from 'react';
import { Keyboard, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tappable } from '@/components/core/tappable';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import type { IconButtonProps } from '@/components/ui/icon-button';
import type { IconName } from '@/components/ui/icons';
import { MAX_FONT_SCALE, Text } from '@/components/ui/text';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useTheme } from '@/theme';

import { useKeyboardVisible } from '../use-bottom-tab-bar';

export type BottomTabBarVariant = 'fixed' | 'floating';

type BottomTabBarContextValue = {
  value: string | undefined;
  select: (value: string) => void;
};

const BottomTabBarContext = createContext<BottomTabBarContextValue | null>(null);

function useBottomTabBar() {
  const context = use(BottomTabBarContext);
  if (!context) throw new Error('BottomTabBar.Item must be used inside <BottomTabBar>.');
  return context;
}

export type BottomTabBarProps = {
  /** Value of the active item. Keep it aligned with the current route name. */
  value?: string;
  defaultValue?: string;
  /** Called when a different enabled item is pressed: where a router adapter navigates. */
  onValueChange?: (value: string) => void;
  /** Pinned to the screen edge, or an inset pill. */
  variant?: BottomTabBarVariant;
  /** Hides the bar while the software keyboard is open. */
  hideOnKeyboard?: boolean;
  safeArea?: boolean;
  /** A raised action between the items. It never becomes the selected route. */
  mainAction?: ReactElement<IconButtonProps>;
  /** Two to five `BottomTabBar.Item` elements. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function BottomTabBarRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = 'fixed',
  hideOnKeyboard = true,
  safeArea = true,
  mainAction,
  children,
  style,
}: BottomTabBarProps) {
  const { tokens, components } = useTheme();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const keyboardVisible = useKeyboardVisible(hideOnKeyboard);

  if (hideOnKeyboard && keyboardVisible) return null;

  const colors = components.bottomTabBar[variant].default;
  const floating = variant === 'floating';

  const select = (next: string) => {
    if (next === value) return;
    Keyboard.dismiss();
    setValue(next);
  };

  return (
    <BottomTabBarContext value={{ value, select }}>
      <View
        accessibilityRole="tablist"
        style={[
          floating ? styles.floating : styles.fixed,
          {
            paddingTop: tokens.spacing[1],
            paddingBottom: floating ? tokens.spacing[1] : tokens.spacing[1] + (safeArea ? insets.bottom : 0),
            paddingHorizontal: tokens.spacing[1],
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: floating ? tokens.radius.xl : 0,
            marginHorizontal: floating ? tokens.metrics.screenMargin : 0,
            marginBottom: floating && safeArea ? insets.bottom + tokens.spacing[2] : 0,
          },
          style,
        ]}
      >
        {mainAction ? withMainAction(children, mainAction) : children}
      </View>
    </BottomTabBarContext>
  );
}

/** Drops the raised action in the middle of the row, whatever the number of items. */
function withMainAction(children: ReactNode, mainAction: ReactNode): ReactNode {
  const items = Children.toArray(children);
  const middle = Math.ceil(items.length / 2);
  return (
    <>
      {items.slice(0, middle)}
      <View style={styles.mainAction}>{mainAction}</View>
      {items.slice(middle)}
    </>
  );
}

export type BottomTabBarItemProps = {
  /** Stable value used by the root to identify this destination. */
  value: string;
  /** Short destination name, under the icon. */
  label: string;
  icon: IconName | ReactNode;
  /** A filled or heavier icon for the active state. */
  activeIcon?: IconName | ReactNode;
  /** Count, short text or dot. Counts above 99 show as `99+`. */
  badge?: number | string | boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

function BottomTabBarItem({
  value,
  label,
  icon,
  activeIcon,
  badge,
  disabled = false,
  accessibilityLabel,
  testID,
  style,
}: BottomTabBarItemProps) {
  const { tokens, components } = useTheme();
  const bar = useBottomTabBar();
  const states = components.bottomTabBar.item;

  const active = bar.value === value;
  const colors = { ...states.default, ...(disabled ? states.disabled : active ? states.active : undefined) };
  const glyph = (active ? (activeIcon ?? icon) : icon) as IconName | ReactNode;

  return (
    <Tappable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active, disabled }}
      testID={testID}
      disabled={disabled}
      onPress={() => bar.select(value)}
      style={[styles.item, { minHeight: tokens.metrics.touchTarget, paddingVertical: tokens.spacing[1], gap: 2 }, style]}
    >
      <WithBadge badge={badge} label={label}>
        {isValidElement(glyph) ? glyph : <Icon name={glyph as IconName} size="md" color={colors.content} />}
      </WithBadge>
      <Text variant="caption" maxFontSizeMultiplier={MAX_FONT_SCALE.fixed} numberOfLines={1} style={{ color: colors.content }}>
        {label}
      </Text>
    </Tappable>
  );
}

/** A number becomes a counter, a string a short label, `true` a lone dot. No badge, no wrapper. */
function WithBadge({
  badge,
  label,
  children,
}: {
  badge: number | string | boolean | undefined;
  label: string;
  children: ReactNode;
}) {
  if (badge === undefined || badge === false || badge === 0) return <>{children}</>;

  const element =
    badge === true ? (
      <Badge dot accessibilityLabel={`${label}, new content`} />
    ) : typeof badge === 'number' ? (
      <Badge count={badge} accessibilityLabel={`${label}, ${badge} new`} />
    ) : (
      <Badge size="sm">{badge}</Badge>
    );

  return <Badge.Anchor badge={element}>{children}</Badge.Anchor>;
}

export const BottomTabBar = Object.assign(BottomTabBarRoot, {
  Item: BottomTabBarItem,
});

const styles = StyleSheet.create({
  fixed: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  floating: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
