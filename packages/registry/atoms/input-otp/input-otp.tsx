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

import { MAX_FONT_SCALE } from "@/components/ui/text";

import { InputOtpCaret, useInputOtpStyles } from "./input-otp.styles";
import { useInputOTP, type UseInputOTPOptions } from "./use-input-otp";

export type InputOTPSize = "sm" | "md";
export type InputOTPCellState =
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
		/** Cell size: 40×50 or 48×56pt. The height comes from the `input` size tokens. */
		size?: InputOTPSize;
		accessibilityLabel?: string;
		style?: StyleProp<ViewStyle>;
	};

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
	const styles = useInputOtpStyles(size);
	const otp = useInputOTP(options);

	// Index of the first cell of each group after the first, where a separator goes.
	const breaks = new Set<number>();
	groups?.slice(0, -1).reduce((start, count) => {
		breaks.add(start + count);
		return start + count;
	}, 0);

	const cellState = (active: boolean): InputOTPCellState =>
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
				{...styles.cells}
				accessibilityElementsHidden
				importantForAccessibility="no-hide-descendants"
			>
				{otp.cells.map((cell, index) => {
					const state = cellState(cell.active);

					return (
						<Fragment key={index}>
							{breaks.has(index) ? <View {...styles.separator} /> : null}
							<View {...styles.cell(state, cell.active)}>
								{cell.filled ? (
									secure ? (
										<View {...styles.dot(state)} />
									) : (
										<Text
											maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
											{...styles.char(state)}
										>
											{cell.char}
										</Text>
									)
								) : cell.active ? (
									<InputOtpCaret
										{...styles.caret(state)}
										style={[styles.caretFrame(state), otp.caretStyle]}
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
				{...styles.input}
			/>
		</Animated.View>
	);
}
