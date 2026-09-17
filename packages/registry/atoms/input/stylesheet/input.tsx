import type { ReactNode, Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { useInput } from '../use-input';
import { Field, inputColors, type InputVariant } from './field';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = Omit<TextInputProps, 'editable'> & {
  label?: string;
  helper?: string;
  /** Puts the field in the `invalid` state. A string also replaces `helper`. */
  error?: string | boolean;
  /** Before the text: an icon, a currency sign, a country code. A string is drawn in the affix color. */
  prefix?: ReactNode;
  /** After the text: a unit, a clear button, a visibility toggle. */
  suffix?: ReactNode;
  /** 32, 44 or 52pt, from the `control` size tokens. */
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  /** Adds a marker to the label and a hint for screen readers. It doesn't validate. */
  required?: boolean;
  /** The wrapper holding the label, the field and the helper. */
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

const TEXT = { sm: 'subheadline', md: 'callout', lg: 'body' } as const;

export function Input({
  label,
  helper,
  error,
  prefix,
  suffix,
  size = 'md',
  variant = 'outline',
  disabled = false,
  required = false,
  containerStyle,
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
}: InputProps) {
  const { tokens, components } = useTheme();
  const input = useInput({
    value,
    defaultValue,
    onChangeText,
    onFocus,
    onBlur,
    label,
    helper,
    error,
    required,
    disabled,
    accessibilityLabel,
    accessibilityHint,
    ref,
  });

  const colors = inputColors(components, variant, input.state);
  const typography = tokens.typography[TEXT[size]];
  const affix = (node: ReactNode) =>
    typeof node === 'string' || typeof node === 'number' ? (
      <Text style={{ fontSize: typography.fontSize, color: colors.affix }}>{node}</Text>
    ) : (
      node
    );

  return (
    <Field
      label={label}
      required={required}
      helper={helper}
      message={input.message}
      disabled={disabled}
      style={containerStyle}
    >
      {/* Taps on the padding and the affixes focus the field. */}
      <Pressable
        accessible={false}
        onPress={input.focus}
        style={[
          styles.control,
          {
            minHeight: tokens.sizes.control[size],
            paddingHorizontal: tokens.spacing[size === 'sm' ? 2 : 3],
            gap: tokens.spacing[2],
            borderRadius: tokens.radius.md,
            backgroundColor: colors.background ?? 'transparent',
            borderColor: colors.border ?? 'transparent',
          },
        ]}
      >
        {prefix !== undefined ? <View style={styles.affix}>{affix(prefix)}</View> : null}
        <TextInput
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.caret}
          cursorColor={colors.caret}
          {...props}
          {...input.inputProps}
          style={[
            styles.text,
            { fontSize: typography.fontSize, fontWeight: typography.fontWeight, color: colors.text },
            typography.fontFamily ? { fontFamily: typography.fontFamily } : undefined,
            style,
          ]}
        />
        {suffix !== undefined ? <View style={styles.affix}>{affix(suffix)}</View> : null}
      </Pressable>
    </Field>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  text: {
    flex: 1,
    alignSelf: 'stretch',
    // Android adds vertical padding to TextInput; the control sets the height.
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  affix: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
