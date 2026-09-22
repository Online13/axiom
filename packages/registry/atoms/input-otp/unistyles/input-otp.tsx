import { Fragment } from "react";
import {
	Text,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { MAX_FONT_SCALE } from "@/components/ui/text";

import { useInputOTP, type UseInputOTPOptions } from "../use-input-otp";

export type InputOTPSize = "sm" | "md";
type CellState =
	"default" | "active" | "invalid" | "success" | "disabled";

export type InputOTPProps = UseInputOTPOptions &
	Pick<
		TextInputProps,
		"autoCapitalize" | "onSubmitEditing" | "returnKeyType"
	> & {
		/** Splits the cells into groups with a separator, e.g. `[3, 3]`. Should add up to `length`. */
		groups?: number[];
		/** Shows dots instead of the characters, for a PIN. */
		secure?: boolean;
		/** Green cells, once the code is accepted. */
		success?: boolean;
		/** Cell size: 40×48 or 48×56pt. */
		size?: InputOTPSize;
		accessibilityLabel?: string;
		style?: StyleProp<ViewStyle>;
	};

const CELL = { sm: { width: 40, height: 48 }, md: { width: 48, height: 56 } };

export function InputOTP({
	groups,
	secure = false,
	success = false,
	size = "md",
	accessibilityLabel = "Verification code",
	style,
	autoCapitalize,
	onSubmitEditing,
	returnKeyType,
	...options
}: InputOTPProps) {
	const otp = useInputOTP(options);

	// Index of the first cell of each group after the first, where a separator goes.
	const breaks = new Set<number>();
	groups?.slice(0, -1).reduce((start, count) => {
		breaks.add(start + count);
		return start + count;
	}, 0);

	const cellState = (active: boolean): CellState =>
		options.disabled
			? "disabled"
			: options.error
				? "invalid"
				: success
					? "success"
					: active
						? "active"
						: "default";

	return (
		<Animated.View style={[styles.container, otp.shakeStyle, style]}>
			<View
				style={styles.cells}
				accessibilityElementsHidden
				importantForAccessibility="no-hide-descendants"
			>
				{otp.cells.map((cell, index) => {
					const state = cellState(cell.active);

					return (
						<Fragment key={index}>
							{breaks.has(index) ? (
								<View style={styles.separator} />
							) : null}
							<View style={styles.cell(size, state, cell.active)}>
								{cell.filled ? (
									secure ? (
										<View style={styles.dot(state)} />
									) : (
										<Text
											maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
											style={styles.char(size, state)}
										>
											{cell.char}
										</Text>
									)
								) : cell.active ? (
									<Animated.View
										style={[
											styles.caret(size, state),
											otp.caretStyle,
										]}
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
				accessibilityValue={{
					text: secure
						? `${otp.value.length} of ${otp.cells.length}`
						: otp.value,
				}}
				style={styles.input}
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create((theme) => {
	const states = theme.components.inputOtp.default;
	const colorsFor = (state: CellState) => ({
		...states.default,
		...(state === "default" ? undefined : states[state]),
	});
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
			const colors = colorsFor(state);
			return {
				alignItems: "center",
				justifyContent: "center",
				borderCurve: "continuous",
				...CELL[size],
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
			backgroundColor: colorsFor(state).text,
		}),
		char: (size: InputOTPSize, state: CellState) => {
			const typography = typographyFor(size);
			return {
				fontSize: typography.fontSize,
				lineHeight: typography.lineHeight,
				fontWeight: typography.fontWeight,
				fontFamily: typography.fontFamily,
				color: colorsFor(state).text,
			};
		},
		caret: (size: InputOTPSize, state: CellState) => ({
			width: 2,
			borderRadius: 1,
			height: typographyFor(size).lineHeight,
			backgroundColor: colorsFor(state).caret,
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
