import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import type { InputOTPCellState, InputOTPSize } from "./input-otp";
import { stateColors } from "@/theme/components/states";

type CellState = InputOTPCellState;

const CELL_WIDTH = { sm: 40, md: 48 };

// The caret, which blinks: with styles, the animated view takes them all.
export const InputOtpCaret = Animated.View;

export function useInputOtpStyles(size: InputOTPSize) {
	return {
		container: styles.container,
		cells: { style: styles.cells },
		separator: { style: styles.separator },
		cell: (state: InputOTPCellState, active: boolean) => ({
			style: styles.cell(size, state, active),
		}),
		dot: (state: InputOTPCellState) => ({ style: styles.dot(state) }),
		char: (state: InputOTPCellState) => ({
			style: styles.char(size, state),
		}),
		caret: (state: InputOTPCellState) => ({}),
		caretFrame: (state: InputOTPCellState) => styles.caret(size, state),
		input: { style: styles.input },
	};
}

const styles = StyleSheet.create((theme) => {
	const states = theme.components.inputOtp.default;
	const typographyFor = (size: InputOTPSize) =>
		theme.tokens.typography[size === "sm" ? "title3" : "title2"];

	return {
		container: {
			alignSelf: "center",
		},
		cells: {
			flexDirection: "row",
			alignItems: "center",
			gap: theme.tokens.spacing[2],
		},
		cell: (size: InputOTPSize, state: CellState, active: boolean) => {
			const colors = stateColors(states, state);
			return {
				alignItems: "center",
				justifyContent: "center",
				borderCurve: "continuous",
				width: CELL_WIDTH[size],
				height: theme.tokens.sizes.input[size],
				borderRadius: theme.tokens.radius.md,
				backgroundColor: colors.background,
				borderColor: colors.border,
				borderWidth: active ? 2 : 1,
			};
		},
		separator: {
			width: 10,
			height: 2,
			backgroundColor: states.default.border,
			borderRadius: theme.tokens.radius.full,
		},
		dot: (state: CellState) => ({
			width: 12,
			height: 12,
			borderRadius: 6,
			backgroundColor: stateColors(states, state).text,
		}),
		char: (size: InputOTPSize, state: CellState) => {
			const typography = typographyFor(size);
			return {
				fontSize: typography.fontSize,
				lineHeight: typography.lineHeight,
				fontWeight: typography.fontWeight,
				fontFamily: typography.fontFamily,
				color: stateColors(states, state).text,
			};
		},
		caret: (size: InputOTPSize, state: CellState) => ({
			width: 2,
			borderRadius: 1,
			height: typographyFor(size).lineHeight,
			backgroundColor: stateColors(states, state).caret,
		}),
		input: {
			...StyleSheet.absoluteFillObject,
			// Nearly invisible rather than hidden, so it keeps receiving taps, paste and autofill.
			opacity: 0.015,
			color: "transparent",
			fontSize: 1,
		},
	};
});
