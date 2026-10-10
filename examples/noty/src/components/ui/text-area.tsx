import type { Ref } from "react";
import {
	Pressable,
	TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { MAX_FONT_SCALE } from "@/components/ui/text";
import { useInput, type InputState } from "@/components/ui/input/use-input";

import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { InputVariant } from "@/components/ui/input/field";
import { inputColors } from "@/components/ui/input/input-colors";
import type { Theme } from "@/theme";

export type TextAreaVariant = "outline" | "filled" | "plain";

export type TextAreaProps = Omit<TextInputProps, "editable" | "multiline"> & {
	/** Puts the field in the `invalid` state. Inside a Field, it follows the Field. */
	invalid?: boolean;
	/** `plain` has no border, background or padding, for full-screen editors. */
	variant?: TextAreaVariant;
	/** Inside a Field, it follows the Field. */
	disabled?: boolean;
	/** Grows with its content between `minRows` and `maxRows`, then scrolls. */
	autoGrow?: boolean;
	/** Height when empty, in lines. */
	minRows?: number;
	/** Height limit with `autoGrow`, in lines. */
	maxRows?: number;
	/** The box around the text. `style` goes to the TextInput. */
	containerStyle?: StyleProp<ViewStyle>;
	ref?: Ref<TextInput>;
};

/** The multiline control alone. Wrap it in a Field for a label, a description, an error or a count. */
export function TextArea({
	invalid,
	variant = "outline",
	disabled,
	autoGrow = false,
	minRows = 3,
	maxRows = 8,
	containerStyle,
	value,
	defaultValue,
	onChangeText,
	onFocus,
	onBlur,
	accessibilityLabel,
	accessibilityHint,
	ref,
	...props
}: TextAreaProps) {
	const input = useInput({
		value,
		defaultValue,
		onChangeText,
		onFocus,
		onBlur,
		invalid,
		disabled,
		accessibilityLabel,
		accessibilityHint,
		ref,
	});

	return (
		<Pressable
			accessible={false}
			onPress={input.focus}
			style={[styles.control(variant, input.state), containerStyle]}
		>
			<TextAreaText
				textAlignVertical="top"
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				uniProps={(theme: Theme) => ({
					placeholderTextColor: inputColors(
						theme.components,
						colorVariant(variant),
						input.state,
					).placeholder,
					selectionColor: inputColors(
						theme.components,
						colorVariant(variant),
						input.state,
					).caret,
					cursorColor: inputColors(
						theme.components,
						colorVariant(variant),
						input.state,
					).caret,
				})}
				{...props}
				{...input.inputProps}
				multiline
				style={[
					styles.text(variant, input.state, autoGrow, minRows, maxRows),
					props.style,
				]}
			/>
		</Pressable>
	);
}

/** `plain` keeps the colors of `outline`; it only drops the border, background and padding. */
const colorVariant = (variant: TextAreaVariant): InputVariant =>
	variant === "plain" ? "outline" : variant;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`, which `colors` gives it. Refs are forwarded.
const TextAreaText = withUnistyles(TextInput);

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
