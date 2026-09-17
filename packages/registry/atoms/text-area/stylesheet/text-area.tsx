import type { Ref } from 'react';
import { Pressable, StyleSheet, TextInput, useWindowDimensions, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { Field, inputColors } from '@/components/ui/field';
import { MAX_FONT_SCALE, Text } from '@/components/ui/text';
import { useInput } from '@/components/ui/use-input';
import { useTheme } from '@/theme';

export type TextAreaVariant = 'outline' | 'filled' | 'plain';

export type TextAreaProps = Omit<TextInputProps, 'editable' | 'multiline'> & {
  label?: string;
  helper?: string;
  /** Puts the field in the `invalid` state. A string also replaces `helper`. */
  error?: string | boolean;
  /** `plain` has no border, background or padding, for full-screen editors. */
  variant?: TextAreaVariant;
  disabled?: boolean;
  /** Adds a marker to the label and a hint for screen readers. It doesn't validate. */
  required?: boolean;
  /** Grows with its content between `minRows` and `maxRows`, then scrolls. */
  autoGrow?: boolean;
  /** Height when empty, in lines. */
  minRows?: number;
  /** Height limit with `autoGrow`, in lines. */
  maxRows?: number;
  /** Shows `length / maxLength` under the field. Needs `maxLength`. */
  showCount?: boolean;
  /** The wrapper holding the label, the field and the helper. */
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

export function TextArea({
  label,
  helper,
  error,
  variant = 'outline',
  disabled = false,
  required = false,
  autoGrow = false,
  minRows = 3,
  maxRows = 8,
  showCount = false,
  maxLength,
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
}: TextAreaProps) {
  const { tokens, components } = useTheme();
  const { fontScale } = useWindowDimensions();
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

  const plain = variant === 'plain';
  const colors = inputColors(components, plain ? 'outline' : variant, input.state);
  const typography = tokens.typography.callout;
  const paddingVertical = plain ? 0 : tokens.spacing[3] - 1;
  // The system text size also scales the line height: the rows follow it, up to the cap.
  const scale = Math.min(fontScale, MAX_FONT_SCALE.control);
  const rowsHeight = (rows: number) => rows * typography.lineHeight * scale + paddingVertical * 2;

  const length = input.value.length;
  const count =
    showCount && maxLength !== undefined ? (
      <Text variant="footnote" color={length >= maxLength ? 'error' : disabled ? 'disabled' : 'muted'}>
        {length} / {maxLength}
      </Text>
    ) : undefined;

  return (
    <Field
      label={label}
      required={required}
      helper={helper}
      message={input.message}
      disabled={disabled}
      meta={count}
      style={containerStyle}
    >
      <Pressable
        accessible={false}
        onPress={input.focus}
        style={[
          plain ? styles.plain : styles.control,
          !plain && {
            paddingHorizontal: tokens.spacing[3],
            borderRadius: tokens.radius.md,
            backgroundColor: colors.background ?? 'transparent',
            borderColor: colors.border ?? 'transparent',
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.caret}
          cursorColor={colors.caret}
          textAlignVertical="top"
          maxFontSizeMultiplier={MAX_FONT_SCALE.control}
          {...props}
          {...input.inputProps}
          multiline
          maxLength={maxLength}
          style={[
            styles.text,
            {
              paddingVertical,
              fontSize: typography.fontSize,
              lineHeight: typography.lineHeight,
              fontWeight: typography.fontWeight,
              color: colors.text,
            },
            typography.fontFamily ? { fontFamily: typography.fontFamily } : undefined,
            plain
              ? styles.fill
              : autoGrow
                ? { minHeight: rowsHeight(minRows), maxHeight: rowsHeight(maxRows) }
                : { height: rowsHeight(minRows) },
            style,
          ]}
        />
      </Pressable>
    </Field>
  );
}

const styles = StyleSheet.create({
  control: {
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  plain: {
    flexGrow: 1,
  },
  text: {
    paddingHorizontal: 0,
  },
  fill: {
    flexGrow: 1,
  },
});
