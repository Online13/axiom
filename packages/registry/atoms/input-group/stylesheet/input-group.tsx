import { Children, Fragment, isValidElement, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { Tappable } from '@/components/core/tappable';
import { Button, type ButtonProps } from '@/components/ui/button';
import { inputColors } from '@/components/ui/field';
import { Text } from '@/components/ui/text';
import { useInput } from '@/components/ui/use-input';
import { useTheme } from '@/theme';

import {
  InputGroupContext,
  useInputGroup,
  useInputGroupContext,
  type UseInputGroupOptions,
} from '../use-input-group';

export type InputGroupProps = UseInputGroupOptions & {
  children: ReactNode;
  /** Draws a separator between adjacent parts. */
  divided?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TEXT = { sm: 'subheadline', md: 'callout', lg: 'body' } as const;

function InputGroupRoot({ children, divided = true, style, ...options }: InputGroupProps) {
  const { tokens, components } = useTheme();
  const group = useInputGroup(options);
  const colors = inputColors(components, 'outline', group.state);
  const groupColors = components.inputGroup.default;
  const divider = (group.state === 'disabled' && groupColors.disabled?.divider) || groupColors.default.divider;

  const parts = Children.toArray(children).filter(isValidElement);

  return (
    <InputGroupContext value={group.context}>
      <View
        style={[
          styles.group,
          {
            minHeight: tokens.sizes.control[group.context.size],
            borderRadius: tokens.radius.md,
            backgroundColor: colors.background ?? 'transparent',
            borderColor: colors.border ?? 'transparent',
          },
          style,
        ]}
      >
        {parts.map((part, index) => (
          <Fragment key={part.key ?? index}>
            {divided && index > 0 ? <View style={[styles.divider, { backgroundColor: divider }]} /> : null}
            {part}
          </Fragment>
        ))}
      </View>
    </InputGroupContext>
  );
}

export type InputGroupInputProps = Omit<TextInputProps, 'editable'> & {
  /** Share of the remaining width. */
  flex?: number;
  disabled?: boolean;
  ref?: Ref<TextInput>;
};

function InputGroupInput({
  flex = 1,
  disabled: disabledProp = false,
  style,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
  ref,
  ...props
}: InputGroupInputProps) {
  const { tokens, components } = useTheme();
  const group = useInputGroupContext();
  const disabled = group.disabled || disabledProp;

  const input = useInput({
    value,
    defaultValue,
    onChangeText,
    onFocus: (event) => {
      group.onPartFocus();
      onFocus?.(event);
    },
    onBlur: (event) => {
      group.onPartBlur();
      onBlur?.(event);
    },
    disabled,
    accessibilityLabel: accessibilityLabel ?? props.placeholder,
    accessibilityHint,
    ref,
  });

  // The group decides invalid and focused; the part only knows whether it is disabled.
  const colors = inputColors(components, 'outline', disabled ? 'disabled' : group.state);
  const typography = tokens.typography[TEXT[group.size]];

  return (
    <TextInput
      placeholderTextColor={colors.placeholder}
      selectionColor={colors.caret}
      cursorColor={colors.caret}
      {...props}
      {...input.inputProps}
      style={[
        styles.input,
        {
          flex,
          paddingHorizontal: tokens.spacing[group.size === 'sm' ? 2 : 3],
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeight,
          color: colors.text,
        },
        typography.fontFamily ? { fontFamily: typography.fontFamily } : undefined,
        style,
      ]}
    />
  );
}

export type InputGroupAddonProps = {
  /** Static text or an icon. A string is drawn in the affix color. */
  children: ReactNode;
  /** Makes the addon pressable, for example to open a picker. */
  onPress?: () => void;
  /** `subtle` fills the addon, `plain` leaves it transparent. */
  variant?: 'subtle' | 'plain';
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function InputGroupAddon({ children, onPress, variant = 'subtle', accessibilityLabel, style }: InputGroupAddonProps) {
  const { tokens, components } = useTheme();
  const group = useInputGroupContext();
  const colors = inputColors(components, 'outline', group.disabled ? 'disabled' : 'default');
  const typography = tokens.typography[TEXT[group.size]];

  const content =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text style={{ fontSize: typography.fontSize, color: colors.affix }}>{children}</Text>
    ) : (
      children
    );

  const addonStyle = (pressed: boolean): StyleProp<ViewStyle> => [
    styles.addon,
    {
      gap: tokens.spacing[1],
      paddingHorizontal: tokens.spacing[group.size === 'sm' ? 2 : 3],
      backgroundColor: variant === 'subtle' ? components.inputGroup.default.default.addon : 'transparent',
    },
    pressed && styles.pressed,
    style,
  ];

  if (!onPress) {
    return <View style={addonStyle(false)}>{content}</View>;
  }

  return (
    <Tappable
      disabled={group.disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      style={({ pressed }) => addonStyle(pressed)}
    >
      {content}
    </Tappable>
  );
}

/** A Button with its radius and border removed, flush with the group. */
function InputGroupButton({ disabled, style, ...props }: Omit<ButtonProps, 'size' | 'fullWidth' | 'asChild'>) {
  const group = useInputGroupContext();

  return (
    <Button
      size={group.size}
      disabled={group.disabled || disabled}
      {...props}
      style={[styles.button, style]}
    />
  );
}

export const InputGroup = Object.assign(InputGroupRoot, {
  Input: InputGroupInput,
  Addon: InputGroupAddon,
  Button: InputGroupButton,
});

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  divider: {
    width: 1,
  },
  input: {
    minWidth: 0,
    paddingVertical: 0,
  },
  addon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  button: {
    minHeight: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
});
