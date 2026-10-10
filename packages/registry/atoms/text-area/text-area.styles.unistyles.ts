import { TextInput, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import type { InputVariant } from "@/components/ui/field";
import { inputColors } from "@/components/ui/input-colors";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import type { InputState } from "@/components/ui/use-input";
import type { Theme } from "@/theme";

import type { TextAreaProps, TextAreaVariant } from "./text-area";

/** `plain` keeps the colors of `outline`; it only drops the border, background and padding. */
const colorVariant = (variant: TextAreaVariant): InputVariant =>
	variant === "plain" ? "outline" : variant;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`, which `colors` gives it. Refs are forwarded.
export const TextAreaText = withUnistyles(TextInput);

export function useTextAreaStyles(
	variant: TextAreaVariant,
	autoGrow: boolean,
	minRows: number,
	maxRows: number,
) {
	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [styles.control(variant, state), containerStyle],
		}),
		colors: (state: InputState) => ({
			uniProps: (theme: Theme) => ({
				placeholderTextColor: inputColors(
					theme.components,
					colorVariant(variant),
					state,
				).placeholder,
				selectionColor: inputColors(
					theme.components,
					colorVariant(variant),
					state,
				).caret,
				cursorColor: inputColors(
					theme.components,
					colorVariant(variant),
					state,
				).caret,
			}),
		}),
		text: (state: InputState, { style }: Pick<TextAreaProps, "style">) => ({
			style: [
				styles.text(variant, state, autoGrow, minRows, maxRows),
				style,
			],
		}),
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	control: (variant: TextAreaVariant, state: InputState) => {
		if (variant === "plain") return { flexGrow: 1 };
		const colors = inputColors(
			theme.components,
			colorVariant(variant),
			state,
		);
		return {
			borderWidth: 1,
			borderCurve: "continuous",
			paddingHorizontal: theme.tokens.spacing[3],
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	text: (
		variant: TextAreaVariant,
		state: InputState,
		autoGrow: boolean,
		minRows: number,
		maxRows: number,
	) => {
		const typography = theme.tokens.typography.callout;
		const plain = variant === "plain";
		const paddingVertical = plain ? 0 : theme.tokens.spacing[3] - 1;
		// The system text size also scales the line height: the rows follow it, up to the cap.
		const scale = Math.min(rt.fontScale, MAX_FONT_SCALE.control);
		const rowsHeight = (rows: number) =>
			rows * typography.lineHeight * scale + paddingVertical * 2;

		return {
			paddingHorizontal: 0,
			paddingVertical,
			fontSize: typography.fontSize,
			lineHeight: typography.lineHeight,
			fontWeight: typography.fontWeight,
			...(typography.fontFamily && { fontFamily: typography.fontFamily }),
			color: inputColors(theme.components, colorVariant(variant), state)
				.text,
			...(plain
				? { flexGrow: 1 }
				: autoGrow
					? {
							minHeight: rowsHeight(minRows),
							maxHeight: rowsHeight(maxRows),
						}
					: { height: rowsHeight(minRows) }),
		};
	},
}));
