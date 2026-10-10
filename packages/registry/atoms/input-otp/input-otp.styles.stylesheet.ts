import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import type { InputOTPCellState, InputOTPSize } from "./input-otp";
import { stateColors } from "@/theme/components/states";

const CELL_WIDTH = { sm: 40, md: 48 };

// The caret, which blinks: with styles, the animated view takes them all.
export const InputOtpCaret = Animated.View;

export function useInputOtpStyles(size: InputOTPSize) {
	const { tokens, components } = useTheme();
	const states = components.inputOtp.default;
	const typography = tokens.typography[size === "sm" ? "title3" : "title2"];

	return {
		container: styles.container,
		cells: { style: [styles.cells, { gap: tokens.spacing[2] }] },
		separator: {
			style: [
				styles.separator,
				{
					backgroundColor: states.default.border,
					borderRadius: tokens.radius.full,
				},
			],
		},
		cell: (state: InputOTPCellState, active: boolean) => ({
			style: [
				styles.cell,
				{
					width: CELL_WIDTH[size],
					height: tokens.sizes.input[size],
					borderRadius: tokens.radius.md,
					backgroundColor: stateColors(states, state).background,
					borderColor: stateColors(states, state).border,
					borderWidth: active ? 2 : 1,
				},
			],
		}),
		dot: (state: InputOTPCellState) => ({
			style: [
				styles.dot,
				{ backgroundColor: stateColors(states, state).text },
			],
		}),
		char: (state: InputOTPCellState) => ({
			style: {
				fontSize: typography.fontSize,
				lineHeight: typography.lineHeight,
				fontWeight: typography.fontWeight,
				fontFamily: typography.fontFamily,
				color: stateColors(states, state).text,
			},
		}),
		caret: (state: InputOTPCellState) => ({}),
		caretFrame: (state: InputOTPCellState) => [
			styles.caret,
			{
				height: typography.lineHeight,
				backgroundColor: stateColors(states, state).caret,
			},
		],
		input: { style: styles.input },
	};
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "center",
	},
	cells: {
		flexDirection: "row",
		alignItems: "center",
	},
	cell: {
		alignItems: "center",
		justifyContent: "center",
		borderCurve: "continuous",
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
		color: "transparent",
		fontSize: 1,
	},
});
