import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Spacing } from "@/theme";

import { PasscodeIcon, usePasscodeStyles } from "./passcode.styles";
import { usePasscode, type UsePasscodeOptions } from "./use-passcode";

export type { PasscodeStatus } from "./use-passcode";

export type SlotVariant = "dot" | "box";
export type KeyboardVariant = "round" | "flat";
export type PasscodeSlotState =
	"default" | "filled" | "error" | "success" | "disabled";
export type PasscodeKeyState = "default" | "pressed" | "disabled";

type PasscodeContextValue = ReturnType<typeof usePasscode> & {
	length: number;
	secure: boolean;
};

const PasscodeContext = createContext<PasscodeContextValue | null>(null);

function usePasscodeContext() {
	const context = use(PasscodeContext);
	if (!context)
		throw new Error("Passcode parts must be used inside <Passcode>.");
	return context;
}

const GroupContext = createContext<SlotVariant>("dot");
const KeyboardContext = createContext<{
	variant: KeyboardVariant;
	letters: boolean;
}>({
	variant: "round",
	letters: true,
});

export type PasscodeProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	UsePasscodeOptions & {
		/** Slots show dots. `false` shows the digits, for a code the user reads from somewhere. */
		secure?: boolean;
		/** `Group` and `Keyboard`, in any layout. Left out, both are rendered in order. */
		children?: ReactNode;
		style?: StyleProp<ViewStyle>;
	};

function PasscodeRoot({
	secure = true,
	children,
	length = 4,
	value,
	defaultValue,
	onChange,
	onComplete,
	status,
	disabled,
	haptic,
	...props
}: PasscodeProps) {
	const styles = usePasscodeStyles();
	const passcode = usePasscode({
		length,
		value,
		defaultValue,
		onChange,
		onComplete,
		status,
		disabled,
		haptic,
	});

	return (
		<PasscodeContext value={{ ...passcode, length, secure }}>
			<View {...props} {...styles.root(props)}>
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

export type PasscodeGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Applied to the slots: iOS dots, or boxes like InputOTP. */
	variant?: SlotVariant;
	/** Space between slots, from the spacing tokens. */
	gap?: keyof Spacing;
	/** Left out, one `Slot` per digit. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function PasscodeGroup({
	variant = "dot",
	gap = 4,
	children,
	style,
	...props
}: PasscodeGroupProps) {
	const styles = usePasscodeStyles();
	const { length, shakeStyle, accessibilityValue } = usePasscodeContext();

	return (
		<GroupContext value={variant}>
			{/* One accessible element: the row announces how many digits are in, never which ones. */}
			<Animated.View
				{...props}
				accessible
				accessibilityRole="text"
				accessibilityLabel="Passcode"
				accessibilityValue={{ text: accessibilityValue }}
				style={[styles.group(gap), shakeStyle, style]}
			>
				{children ??
					Array.from({ length }, (_, index) => (
						<PasscodeSlot key={index} index={index} />
					))}
			</Animated.View>
		</GroupContext>
	);
}

export type PasscodeSlotProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Position in the code. */
	index: number;
	style?: StyleProp<ViewStyle>;
};

function PasscodeSlot({ index, ...props }: PasscodeSlotProps) {
	const styles = usePasscodeStyles();
	const { value, status, secure, busy } = usePasscodeContext();
	const variant = use(GroupContext);

	const digit = value[index];
	const filled = digit !== undefined;
	const state: PasscodeSlotState =
		status === "error" || status === "success"
			? status
			: busy && status !== "verifying"
				? "disabled"
				: filled
					? "filled"
					: "default";

	if (variant === "dot") {
		return <View {...props} {...styles.dot(state, filled, props)} />;
	}

	return (
		<View {...props} {...styles.box(state, props)}>
			{filled ? (
				secure ? (
					<View {...styles.boxDot(state)} />
				) : (
					<Text
						variant="bodyLg"
						weight="semibold"
						maxFontSizeMultiplier={MAX_FONT_SCALE.control}
						{...styles.boxText(state)}
					>
						{digit}
					</Text>
				)
			) : null}
		</View>
	);
}

export type PasscodeKeyboardProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** `round`: iOS lock screen keys. `flat`: full-width keys like the system number pad. */
	variant?: KeyboardVariant;
	/** Shows `ABC`, `DEF`… under the digits. */
	letters?: boolean;
	/** 12 keys in a 3×4 grid. Left out, digits with a delete key. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function PasscodeKeyboard({
	variant = "round",
	letters = true,
	children,
	...props
}: PasscodeKeyboardProps) {
	const styles = usePasscodeStyles();

	return (
		<KeyboardContext value={{ variant, letters }}>
			<View {...props} {...styles.keyboard(variant, props)}>
				{children ?? (
					<>
						{["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
							(digit) => (
								<PasscodeKey key={digit} value={digit} />
							),
						)}
						<View {...styles.cell} />
						<PasscodeKey value="0" />
						<PasscodeKeyAction action="delete" />
					</>
				)}
			</View>
		</KeyboardContext>
	);
}

const LETTERS: Record<string, string> = {
	"2": "ABC",
	"3": "DEF",
	"4": "GHI",
	"5": "JKL",
	"6": "MNO",
	"7": "PQRS",
	"8": "TUV",
	"9": "WXYZ",
};

type KeyShellProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress" | "onLongPress"
> & {
	onPress: () => void;
	onLongPress?: () => void;
	accessibilityLabel: string;
	disabled: boolean;
	children: (state: PasscodeKeyState) => ReactNode;
};

function KeyShell({
	onPress,
	onLongPress,
	accessibilityLabel,
	disabled,
	children,
	...props
}: KeyShellProps) {
	const styles = usePasscodeStyles();
	const { variant } = use(KeyboardContext);

	return (
		<View {...styles.cell}>
			<Tappable
				{...props}
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
				onPress={onPress}
				onLongPress={onLongPress}
				{...styles.key(variant, disabled)}
			>
				{({ pressed }) =>
					children(disabled ? "disabled" : pressed ? "pressed" : "default")
				}
			</Tappable>
		</View>
	);
}

export type PasscodeKeyProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress" | "onLongPress"
> & {
	/** The digit it types. */
	value: string;
	/** Replaces the default content of the key. */
	children?: ReactNode;
};

function PasscodeKey({
	value,
	children,
	accessibilityLabel,
	...props
}: PasscodeKeyProps) {
	const styles = usePasscodeStyles();
	const { press, busy } = usePasscodeContext();
	const { variant, letters } = use(KeyboardContext);

	return (
		<KeyShell
			{...props}
			accessibilityLabel={accessibilityLabel ?? value}
			disabled={busy}
			onPress={() => press(value)}
		>
			{(state) =>
				children ?? (
					<>
						<Text
							variant="bodyLg"
							maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
							{...styles.digit(variant, state)}
						>
							{value}
						</Text>
						{letters && LETTERS[value] ? (
							<Text
								variant="caption"
								maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
								{...styles.letters(variant, state)}
							>
								{LETTERS[value]}
							</Text>
						) : null}
					</>
				)
			}
		</KeyShell>
	);
}

export type PasscodeAction = "delete" | "biometrics" | "custom";

export type PasscodeKeyActionProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress" | "onLongPress"
> & {
	/** `delete` removes the last digit and clears the code on a long press. */
	action: PasscodeAction;
	/** Required for `biometrics` and `custom`. */
	onPress?: () => void;
	children?: ReactNode;
};

function PasscodeKeyAction({
	action,
	onPress,
	children,
	accessibilityLabel,
	...props
}: PasscodeKeyActionProps) {
	const styles = usePasscodeStyles();
	const { remove, clear, busy, filled } = usePasscodeContext();
	const { variant } = use(KeyboardContext);

	const label =
		accessibilityLabel ??
		(action === "delete"
			? "Delete"
			: action === "biometrics"
				? "Unlock with biometrics"
				: "Action");
	// Delete has nothing to remove on an empty code; the other actions stay available.
	const disabled = action === "delete" ? busy || filled === 0 : busy;

	return (
		<KeyShell
			{...props}
			accessibilityLabel={label}
			disabled={disabled}
			onPress={action === "delete" ? remove : (onPress ?? (() => {}))}
			onLongPress={action === "delete" ? clear : undefined}
		>
			{(state) =>
				children ??
				(action === "custom" ? null : (
					<PasscodeIcon
						name={action === "delete" ? "backspace" : "biometrics"}
						size="lg"
						{...styles.tint(variant, state)}
					/>
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
