import { Fragment } from 'react';
import { StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { MAX_FONT_SCALE } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { useInputOTP, type UseInputOTPOptions } from '../use-input-otp';

export type InputOTPProps = UseInputOTPOptions &
  Pick<TextInputProps, 'autoCapitalize' | 'onSubmitEditing' | 'returnKeyType'> & {
    /** Splits the cells into groups with a separator, e.g. `[3, 3]`. Should add up to `length`. */
    groups?: number[];
    /** Shows dots instead of the characters, for a PIN. */
    secure?: boolean;
    /** Green cells, once the code is accepted. */
    success?: boolean;
    /** Cell size: 40×48 or 48×56pt. */
    size?: 'sm' | 'md';
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
  };

const CELL = { sm: { width: 40, height: 48 }, md: { width: 48, height: 56 } };

export function InputOTP({
  groups,
  secure = false,
  success = false,
  size = 'md',
  accessibilityLabel = 'Verification code',
  style,
  autoCapitalize,
  onSubmitEditing,
  returnKeyType,
  ...options
}: InputOTPProps) {
  const { tokens, components } = useTheme();
  const otp = useInputOTP(options);
  const states = components.inputOtp.default;
  const typography = tokens.typography[size === 'sm' ? 'title3' : 'title2'];

  // Index of the first cell of each group after the first, where a separator goes.
  const breaks = new Set<number>();
  groups?.slice(0, -1).reduce((start, count) => {
    breaks.add(start + count);
    return start + count;
  }, 0);

  const cellState = (active: boolean) =>
    options.disabled ? 'disabled' : options.error ? 'invalid' : success ? 'success' : active ? 'active' : 'default';

  return (
    <Animated.View style={[styles.container, otp.shakeStyle, style]}>
      <View
        style={[styles.cells, { gap: tokens.spacing[2] }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {otp.cells.map((cell, index) => {
          const state = cellState(cell.active);
          const colors = { ...states.default, ...(state === 'default' ? undefined : states[state]) };

          return (
            <Fragment key={index}>
              {breaks.has(index) ? (
                <View style={[styles.separator, { backgroundColor: states.default.border, borderRadius: tokens.radius.full }]} />
              ) : null}
              <View
                style={[
                  styles.cell,
                  CELL[size],
                  {
                    borderRadius: tokens.radius.md,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: cell.active ? 2 : 1,
                  },
                ]}
              >
                {cell.filled ? (
                  secure ? (
                    <View style={[styles.dot, { backgroundColor: colors.text }]} />
                  ) : (
                    <Text
                      maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
                      style={{
                        fontSize: typography.fontSize,
                        lineHeight: typography.lineHeight,
                        fontWeight: typography.fontWeight,
                        fontFamily: typography.fontFamily,
                        color: colors.text,
                      }}
                    >
                      {cell.char}
                    </Text>
                  )
                ) : cell.active ? (
                  <Animated.View
                    style={[styles.caret, { height: typography.lineHeight, backgroundColor: colors.caret }, otp.caretStyle]}
                  />
                ) : null}
              </View>
            </Fragment>
          );
        })}
      </View>
      {/* Laid over the cells so taps, long-press paste and autofill reach it. */}
      <TextInput
        {...otp.inputProps}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: secure ? `${otp.value.length} of ${otp.cells.length}` : otp.value }}
        style={styles.input}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  cells: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  separator: {
    width: 10,
    height: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  caret: {
    width: 2,
    borderRadius: 1,
  },
  input: {
    ...StyleSheet.absoluteFill,
    // Nearly invisible rather than hidden, so it keeps receiving taps, paste and autofill.
    opacity: 0.015,
    color: 'transparent',
    fontSize: 1,
  },
});
