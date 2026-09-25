import {
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type Ref,
} from "react";
import { Platform, type TextInput } from "react-native";
import {
	cancelAnimation,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { useControllableState } from "@/hooks/use-controllable-state";

export type InputOTPType = "numeric" | "alphanumeric";

export type UseInputOTPOptions = {
	length?: number;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Called once every cell is filled. */
	onComplete?: (value: string) => void;
	type?: InputOTPType;
	autoFocus?: boolean;
	error?: boolean;
	disabled?: boolean;
	/** Played when `error` turns on: a wrong code. `false` turns it off. */
	haptic?: HapticKind | false;
	ref?: Ref<TextInput>;
};

export type OTPCell = {
	char: string;
	/** The cell the next character goes into, while the field has focus. */
	active: boolean;
	filled: boolean;
};

const FILTER: Record<InputOTPType, RegExp> = {
	numeric: /[^0-9]/g,
	alphanumeric: /[^A-Za-z0-9]/g,
};

/**
 * One hidden TextInput under the cells: it gets the system keyboard, paste, deletion and SMS autofill,
 * and the cells only draw its value. Shared by every styling variant of InputOTP.
 */
export function useInputOTP({
	length = 6,
	value: valueProp,
	defaultValue = "",
	onChange,
	onComplete,
	type = "numeric",
	autoFocus = true,
	error = false,
	disabled = false,
	haptic: hapticKind = "error",
	ref,
}: UseInputOTPOptions) {
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange,
	});
	const [focused, setFocused] = useState(false);

	const inputRef = useRef<TextInput>(null);
	useImperativeHandle(ref, () => inputRef.current as TextInput);

	const onChangeText = (text: string) => {
		// Pasted codes often come with spaces or dashes: keep only what the type accepts.
		const next = text.replace(FILTER[type], "").slice(0, length);
		if (next === value) return;
		setValue(next);
		if (next.length === length) onComplete?.(next);
	};

	const cells: OTPCell[] = Array.from({ length }, (_, index) => ({
		char: value[index] ?? "",
		active:
			focused && !disabled && index === Math.min(value.length, length - 1),
		filled: index < value.length,
	}));

	// Buzz and shake once when `error` turns on. The haptic doesn't depend on Reduce Motion.
	useEffect(() => {
		if (error && hapticKind) haptic(hapticKind);
	}, [error, hapticKind]);
	const reducedMotion = useReducedMotion();
	const shake = useSharedValue(0);
	useEffect(() => {
		if (!error || reducedMotion) return;
		shake.value = withSequence(
			withTiming(-8, { duration: 50 }),
			withRepeat(withTiming(8, { duration: 80 }), 4, true),
			withTiming(0, { duration: 50 }),
		);
	}, [error, reducedMotion, shake]);
	const shakeStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: shake.value }],
	}));

	// Blinking caret in the active cell, restarted when it moves so it shows right away.
	const caret = useSharedValue(1);
	const activeIndex = cells.findIndex((cell) => cell.active);
	useEffect(() => {
		if (activeIndex < 0) return;
		caret.value = 1;
		if (!reducedMotion) {
			caret.value = withRepeat(
				withSequence(
					withTiming(1, { duration: 500 }),
					withTiming(0, { duration: 0 }),
					withTiming(0, { duration: 500 }),
				),
				-1,
			);
		}
		return () => cancelAnimation(caret);
	}, [activeIndex, reducedMotion, caret]);
	const caretStyle = useAnimatedStyle(() => ({ opacity: caret.value }));

	return {
		value,
		cells,
		focused,
		shakeStyle,
		caretStyle,
		focus: () => {
			if (!disabled) inputRef.current?.focus();
		},
		inputProps: {
			ref: inputRef,
			value,
			onChangeText,
			maxLength: length,
			autoFocus: autoFocus && !disabled,
			editable: !disabled,
			keyboardType:
				type === "numeric" ? ("number-pad" as const) : ("default" as const),
			autoCorrect: false,
			spellCheck: false,
			textContentType: "oneTimeCode" as const,
			autoComplete:
				Platform.OS === "android"
					? ("sms-otp" as const)
					: ("one-time-code" as const),
			// The caret is drawn by the cells; keep the real one at the end so typing always appends.
			caretHidden: true,
			selection: { start: value.length, end: value.length },
			onFocus: () => setFocused(true),
			onBlur: () => setFocused(false),
			accessibilityState: { disabled },
		},
	};
}
