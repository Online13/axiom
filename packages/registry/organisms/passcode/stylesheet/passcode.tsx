import { createContext, use, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import { MAX_FONT_SCALE, Text } from '@/components/ui/text';
import { useTheme, type Theme } from '@/theme';

import { usePasscode, type UsePasscodeOptions } from '../use-passcode';

export type { PasscodeStatus } from '../use-passcode';

export type SlotVariant = 'dot' | 'box';
export type KeyboardVariant = 'round' | 'flat';

type PasscodeContextValue = ReturnType<typeof usePasscode> & {
  length: number;
  secure: boolean;
};

const PasscodeContext = createContext<PasscodeContextValue | null>(null);

function usePasscodeContext() {
  const context = use(PasscodeContext);
  if (!context) throw new Error('Passcode parts must be used inside <Passcode>.');
  return context;
}

const GroupContext = createContext<SlotVariant>('dot');
const KeyboardContext = createContext<{ variant: KeyboardVariant; letters: boolean }>({
  variant: 'round',
  letters: true,
});

/** Colors of a part for a variant and a state; missing properties fall back to `default`. */
function slotColors(components: Theme['components'], variant: SlotVariant, state: 'default' | 'filled' | 'error' | 'success' | 'disabled') {
  const states = components.passcode.slot[variant];
  return { ...states.default, ...(state === 'default' ? undefined : states[state]) };
}

function keyColors(components: Theme['components'], variant: KeyboardVariant, state: 'default' | 'pressed' | 'disabled') {
  const states = components.passcode.key[variant];
  return { ...states.default, ...(state === 'default' ? undefined : states[state]) };
}

export type PasscodeProps = UsePasscodeOptions & {
  /** Slots show dots. `false` shows the digits, for a code the user reads from somewhere. */
  secure?: boolean;
  /** `Group` and `Keyboard`, in any layout. Left out, both are rendered in order. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function PasscodeRoot({ secure = true, children, style, ...options }: PasscodeProps) {
  const { tokens } = useTheme();
  const passcode = usePasscode(options);
  const length = options.length ?? 4;

  return (
    <PasscodeContext value={{ ...passcode, length, secure }}>
      <View style={[styles.root, { gap: tokens.spacing[8] }, style]}>
        {children ?? (
          <>
            <PasscodeGroup />
            <PasscodeKeyboard />
          </>
        )}
      </View>
    </PasscodeContext>
  );
}

export type PasscodeGroupProps = {
  /** Applied to the slots: iOS dots, or boxes like InputOTP. */
  variant?: SlotVariant;
  /** Space between slots, from the spacing tokens. */
  gap?: keyof Theme['tokens']['spacing'];
  /** Left out, one `Slot` per digit. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function PasscodeGroup({ variant = 'dot', gap = 4, children, style }: PasscodeGroupProps) {
  const { tokens } = useTheme();
  const { length, shakeStyle, accessibilityValue } = usePasscodeContext();

  return (
    <GroupContext value={variant}>
      {/* One accessible element: the row announces how many digits are in, never which ones. */}
      <Animated.View
        accessible
        accessibilityRole="text"
        accessibilityLabel="Passcode"
        accessibilityValue={{ text: accessibilityValue }}
        style={[styles.group, { gap: tokens.spacing[gap] }, shakeStyle, style]}
      >
        {children ?? Array.from({ length }, (_, index) => <PasscodeSlot key={index} index={index} />)}
      </Animated.View>
    </GroupContext>
  );
}

export type PasscodeSlotProps = {
  /** Position in the code. */
  index: number;
  style?: StyleProp<ViewStyle>;
};

const DOT = 14;
const BOX = { width: 48, height: 56 };

function PasscodeSlot({ index, style }: PasscodeSlotProps) {
  const { tokens, components } = useTheme();
  const { value, status, secure, busy } = usePasscodeContext();
  const variant = use(GroupContext);

  const digit = value[index];
  const filled = digit !== undefined;
  const state =
    status === 'error' || status === 'success'
      ? status
      : busy && status !== 'verifying'
        ? 'disabled'
        : filled
          ? 'filled'
          : 'default';
  const colors = slotColors(components, variant, state);

  if (variant === 'dot') {
    return (
      <View
        style={[
          {
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            borderWidth: 1.5,
            borderColor: colors.border,
            backgroundColor: filled ? colors.background : 'transparent',
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.box,
        {
          ...BOX,
          borderRadius: tokens.radius.md,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {filled ? (
        secure ? (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.content }} />
        ) : (
          <Text variant="bodyLg" weight="semibold" maxFontSizeMultiplier={MAX_FONT_SCALE.control} style={{ color: colors.content }}>
            {digit}
          </Text>
        )
      ) : null}
    </View>
  );
}

export type PasscodeKeyboardProps = {
  /** `round`: iOS lock screen keys. `flat`: full-width keys like the system number pad. */
  variant?: KeyboardVariant;
  /** Shows `ABC`, `DEF`… under the digits. */
  letters?: boolean;
  /** 12 keys in a 3×4 grid. Left out, digits with a delete key. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function PasscodeKeyboard({ variant = 'round', letters = true, children, style }: PasscodeKeyboardProps) {
  const { tokens } = useTheme();

  return (
    <KeyboardContext value={{ variant, letters }}>
      <View style={[styles.keyboard, { rowGap: tokens.spacing[variant === 'round' ? 3 : 2] }, style]}>
        {children ?? (
          <>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <PasscodeKey key={digit} value={digit} />
            ))}
            <View style={styles.cell} />
            <PasscodeKey value="0" />
            <PasscodeKeyAction action="delete" />
          </>
        )}
      </View>
    </KeyboardContext>
  );
}

const LETTERS: Record<string, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
};

const ROUND = 72;
const FLAT_HEIGHT = 56;

type KeyShellProps = {
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel: string;
  disabled: boolean;
  children: (colors: ReturnType<typeof keyColors>) => ReactNode;
};

function KeyShell({ onPress, onLongPress, accessibilityLabel, disabled, children }: KeyShellProps) {
  const { tokens, components } = useTheme();
  const { variant } = use(KeyboardContext);

  return (
    <View style={styles.cell}>
      <Tappable
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          styles.key,
          variant === 'round'
            ? { width: ROUND, height: ROUND, borderRadius: ROUND / 2 }
            : { alignSelf: 'stretch', height: FLAT_HEIGHT, borderRadius: tokens.radius.md },
          { backgroundColor: keyColors(components, variant, disabled ? 'disabled' : pressed ? 'pressed' : 'default').background },
        ]}
      >
        {({ pressed }) => children(keyColors(components, variant, disabled ? 'disabled' : pressed ? 'pressed' : 'default'))}
      </Tappable>
    </View>
  );
}

export type PasscodeKeyProps = {
  /** The digit it types. */
  value: string;
  /** Replaces the default content of the key. */
  children?: ReactNode;
  accessibilityLabel?: string;
};

function PasscodeKey({ value, children, accessibilityLabel }: PasscodeKeyProps) {
  const { press, busy } = usePasscodeContext();
  const { letters } = use(KeyboardContext);

  return (
    <KeyShell
      accessibilityLabel={accessibilityLabel ?? value}
      disabled={busy}
      onPress={() => press(value)}
    >
      {(colors) =>
        children ?? (
          <>
            <Text variant="bodyLg" maxFontSizeMultiplier={MAX_FONT_SCALE.fixed} style={[styles.digit, { color: colors.text }]}>
              {value}
            </Text>
            {letters && LETTERS[value] ? (
              <Text variant="caption" maxFontSizeMultiplier={MAX_FONT_SCALE.fixed} style={{ color: colors.letters, letterSpacing: 1 }}>
                {LETTERS[value]}
              </Text>
            ) : null}
          </>
        )
      }
    </KeyShell>
  );
}

export type PasscodeAction = 'delete' | 'biometrics' | 'custom';

export type PasscodeKeyActionProps = {
  /** `delete` removes the last digit and clears the code on a long press. */
  action: PasscodeAction;
  /** Required for `biometrics` and `custom`. */
  onPress?: () => void;
  children?: ReactNode;
  accessibilityLabel?: string;
};

function PasscodeKeyAction({ action, onPress, children, accessibilityLabel }: PasscodeKeyActionProps) {
  const { remove, clear, busy, filled } = usePasscodeContext();

  const label =
    accessibilityLabel ?? (action === 'delete' ? 'Delete' : action === 'biometrics' ? 'Unlock with biometrics' : 'Action');
  // Delete has nothing to remove on an empty code; the other actions stay available.
  const disabled = action === 'delete' ? busy || filled === 0 : busy;

  return (
    <KeyShell
      accessibilityLabel={label}
      disabled={disabled}
      onPress={action === 'delete' ? remove : (onPress ?? (() => {}))}
      onLongPress={action === 'delete' ? clear : undefined}
    >
      {(colors) =>
        children ??
        (action === 'custom' ? null : (
          <Icon name={action === 'delete' ? 'backspace' : 'biometrics'} size="lg" color={colors.text} />
        ))
      }
    </KeyShell>
  );
}

export const Passcode = Object.assign(PasscodeRoot, {
  Group: PasscodeGroup,
  Slot: PasscodeSlot,
  Keyboard: PasscodeKeyboard,
  Key: PasscodeKey,
  KeyAction: PasscodeKeyAction,
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'stretch',
  },
  // Three columns whatever the width: the space between keys comes from the cells, never from a gap,
  // so three cells always add up to exactly one row.
  cell: {
    width: '33.333%',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  digit: {
    fontSize: 28,
    lineHeight: 34,
  },
});
