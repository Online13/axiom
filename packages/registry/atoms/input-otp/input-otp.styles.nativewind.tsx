import type { ComponentProps } from "react";
import { View, type TextStyle, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { cx } from "@/theme";
import { typography } from "@/theme/tokens";

import type { InputOTPCellState, InputOTPSize } from "./input-otp";

// Every class is written whole, so Tailwind finds it. The colors are the code input's own tokens,
// in `theme/components/input-otp.css`.
const CELL: Record<InputOTPCellState, string> = {
	default: "border-input-otp-border bg-input-otp",
	active: "border-input-otp-border-active bg-input-otp-active",
	invalid: "border-input-otp-border-invalid bg-input-otp-invalid",
	success: "border-input-otp-border-success bg-input-otp-success",
	disabled: "border-input-otp-border-disabled bg-input-otp-disabled",
};

const TEXT: Record<InputOTPCellState, string> = {
	default: "text-input-otp-text",
	active: "text-input-otp-text-active",
	invalid: "text-input-otp-text-invalid",
	success: "text-input-otp-text-success",
	disabled: "text-input-otp-text-disabled",
};

// The text color again, as the fill of the dot of a hidden character.
const DOT: Record<InputOTPCellState, string> = {
	default: "bg-input-otp-text",
	active: "bg-input-otp-text-active",
	invalid: "bg-input-otp-text-invalid",
	success: "bg-input-otp-text-success",
	disabled: "bg-input-otp-text-disabled",
};

const CARET: Record<InputOTPCellState, string> = {
	default: "bg-input-otp-caret",
	active: "bg-input-otp-caret-active",
	invalid: "bg-input-otp-caret-invalid",
	success: "bg-input-otp-caret-success",
	disabled: "bg-input-otp-caret-disabled",
};

type CaretProps = ComponentProps<typeof Animated.View> & {
	caretClassName?: string;
};

/**
 * The caret, which blinks. An animated view takes `style` only, so it keeps the size and the
 * opacity, and the view inside it takes the classes that draw it.
 */
export function InputOtpCaret({ caretClassName, ...props }: CaretProps) {
	return (
		<Animated.View {...props}>
			<View className={caretClassName} />
		</Animated.View>
	);
}

export function useInputOtpStyles(size: InputOTPSize) {
	return {
		// An animated view takes `style` only.
		container: { alignSelf: "center" } satisfies ViewStyle,
		cells: { className: "flex-row items-center gap-2" },
		separator: {
			className: "h-[2px] w-[10px] rounded-full bg-input-otp-border",
		},
		// The active cell takes a thicker border.
		cell: (state: InputOTPCellState, active: boolean) => ({
			className: cx(
				"items-center justify-center rounded-md",
				size === "sm" ? "h-input-sm w-[40px]" : "h-input-md w-[48px]",
				active ? "border-2" : "border",
				CELL[state],
			),
			style: { borderCurve: "continuous" as const },
		}),
		dot: (state: InputOTPCellState) => ({
			className: cx("size-[12px] rounded-full", DOT[state]),
		}),
		char: (state: InputOTPCellState) => ({
			className: cx(
				size === "sm" ? "text-title3" : "text-title2",
				TEXT[state],
			),
		}),
		caret: (state: InputOTPCellState) => ({
			caretClassName: cx("flex-1 rounded-[1px]", CARET[state]),
		}),
		// As tall as a line of the character it stands for.
		caretFrame: (state: InputOTPCellState) =>
			({
				width: 2,
				height: typography[size === "sm" ? "title3" : "title2"].lineHeight,
			}) satisfies ViewStyle,
		// Nearly invisible rather than hidden, so it keeps receiving taps, paste and autofill.
		input: {
			className: "absolute inset-0",
			style: {
				opacity: 0.015,
				color: "transparent",
				fontSize: 1,
			} satisfies TextStyle,
		},
	};
}
