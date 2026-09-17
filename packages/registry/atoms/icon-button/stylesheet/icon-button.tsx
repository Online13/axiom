import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Tappable, type TappableProps } from '@/components/core/tappable';
import { Icon, iconColor, type IconColor } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icons';
import { useTheme } from '@/theme';

export type IconButtonVariant = 'ghost' | 'tinted' | 'outline' | 'solid';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = Omit<TappableProps, 'children' | 'style' | 'accessibilityLabel'> & {
  /** An icon of your registry. */
  icon: IconName;
  /** Required: there is no visible text, so this is all a screen reader can announce. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  /** 32, 44 or 52pt, from the `control` size tokens. The touch area never goes below 44pt. */
  size?: IconButtonSize;
  shape?: 'circle' | 'square';
  /** Marks a toggle button as on. */
  selected?: boolean;
  /** Overrides the icon color of the variant, except when disabled. */
  color?: IconColor;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  shape = 'circle',
  selected = false,
  disabled = false,
  color,
  accessibilityState,
  style,
  ...props
}: IconButtonProps) {
  const { tokens, colors, components } = useTheme();
  const states = components.iconButton[variant];
  const dimension = tokens.sizes.control[size];

  // Later states win: selected, then pressed, then disabled.
  const colorsFor = (pressed: boolean) => ({
    ...states.default,
    ...(selected ? states.selected : undefined),
    ...(pressed ? states.pressed : undefined),
    ...(disabled ? states.disabled : undefined),
  });

  return (
    <Tappable
      {...props}
      disabled={disabled}
      accessibilityState={{ ...accessibilityState, selected }}
      style={({ pressed }) => {
        const state = colorsFor(pressed);
        return [
          styles.container,
          {
            width: dimension,
            height: dimension,
            borderRadius: shape === 'circle' ? dimension / 2 : tokens.radius.md,
            backgroundColor: state.background ?? 'transparent',
            borderWidth: state.border ? 1 : 0,
            borderColor: state.border,
          },
          style,
        ];
      }}
    >
      {({ pressed }) => (
        <Icon
          name={icon}
          size={size}
          color={color && !disabled ? iconColor(colors, color) : colorsFor(pressed).foreground}
        />
      )}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
