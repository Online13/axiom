import { createContext, use, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import { MAX_FONT_SCALE, Text } from '@/components/ui/text';
import type { IconName } from '@/components/ui/icons';
import { useTheme } from '@/theme';

import { useToolBar } from '../use-tool-bar';

export type ToolBarPlacement = 'docked' | 'floating';
export type ToolBarJustify = 'start' | 'center' | 'between' | 'around';

const PlacementContext = createContext<ToolBarPlacement>('docked');

export type ToolBarProps = {
  /** Actions and optional separators. */
  children?: ReactNode;
  /** Attached to the bottom edge, or an inset capsule over the content. */
  placement?: ToolBarPlacement;
  /** Adds the bottom safe-area inset for a docked bar. Floating bars use a margin instead. */
  safeArea?: boolean;
  /** Shows or hides the bar with its transition. */
  visible?: boolean;
  justify?: ToolBarJustify;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
} as const;

function ToolBarRoot({
  children,
  placement = 'docked',
  safeArea = true,
  visible = true,
  justify = 'around',
  accessibilityLabel = 'Actions',
  style,
}: ToolBarProps) {
  const { tokens, components } = useTheme();
  const insets = useSafeAreaInsets();
  const { animatedStyle } = useToolBar(visible);
  const colors = components.toolBar[placement].default;

  const floating = placement === 'floating';

  return (
    <PlacementContext value={placement}>
      <Animated.View
        accessibilityRole="toolbar"
        accessibilityLabel={accessibilityLabel}
        // Hidden bars keep their space but take no touches.
        pointerEvents={visible ? 'box-none' : 'none'}
        style={[
          floating ? styles.floating : styles.docked,
          {
            paddingBottom: floating ? tokens.spacing[2] : tokens.spacing[2] + (safeArea ? insets.bottom : 0),
            paddingTop: tokens.spacing[2],
            paddingHorizontal: tokens.spacing[2],
            justifyContent: JUSTIFY[justify],
            gap: tokens.spacing[1],
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: floating ? tokens.radius.full : 0,
            marginHorizontal: floating ? tokens.metrics.screenMargin : 0,
            marginBottom: floating && safeArea ? insets.bottom + tokens.spacing[2] : 0,
          },
          animatedStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </PlacementContext>
  );
}

export type ToolBarActionProps = {
  /** An icon of your registry, or your own node. */
  icon: IconName | ReactNode;
  /** Visible name in a docked bar, and the default accessible name. */
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Error color, for an action such as Delete. It adds no confirmation by itself. */
  destructive?: boolean;
  /** Marks a toggle action such as Favorite as active. */
  selected?: boolean;
  /** Defaults to `true` on a docked bar. The accessible name stays either way. */
  showLabel?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function ToolBarAction({
  icon,
  label,
  onPress,
  disabled = false,
  destructive = false,
  selected = false,
  showLabel,
  accessibilityLabel,
  style,
}: ToolBarActionProps) {
  const { tokens, components } = useTheme();
  const placement = use(PlacementContext);
  const states = components.toolBar.action;
  const colors = {
    ...states.default,
    ...(selected ? states.selected : undefined),
    ...(destructive ? states.destructive : undefined),
    ...(disabled ? states.disabled : undefined),
  };

  const withLabel = showLabel ?? placement === 'docked';

  return (
    <Tappable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.action,
        {
          minHeight: tokens.metrics.touchTarget,
          paddingHorizontal: tokens.spacing[3],
          paddingVertical: tokens.spacing[1],
          gap: 2,
          borderRadius: tokens.radius.md,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {isValidElement(icon) ? icon : <Icon name={icon as IconName} size="md" color={colors.content} />}
      {withLabel ? (
        <Text variant="caption" maxFontSizeMultiplier={MAX_FONT_SCALE.fixed} numberOfLines={1} style={{ color: colors.content }}>
          {label}
        </Text>
      ) : null}
    </Tappable>
  );
}

export type ToolBarSeparatorProps = {
  style?: StyleProp<ViewStyle>;
};

function ToolBarSeparator({ style }: ToolBarSeparatorProps) {
  const { components } = useTheme();
  const placement = use(PlacementContext);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.separator, { backgroundColor: components.toolBar[placement].default.separator }, style]}
    />
  );
}

export const ToolBar = Object.assign(ToolBarRoot, {
  Action: ToolBarAction,
  Separator: ToolBarSeparator,
});

const styles = StyleSheet.create({
  docked: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  floating: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    alignSelf: 'center',
  },
});
