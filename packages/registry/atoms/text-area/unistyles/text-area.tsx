import type { Ref } from "react";
import {
	Pressable,
	TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Field, inputColors, type InputVariant } from "@/components/ui/field";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useInput, type InputState } from "@/components/ui/use-input";

export type TextAreaVariant = "outline" | "filled" | "plain";

export type TextAreaProps = Omit<TextInputProps, "editable" | "multiline"> & {
	label?: string;
	helper?: string;
	/** Puts the field in the `invalid` state. A string also replaces `helper`. */
	error?: string | boolean;
	/** `plain` has no border, background or padding, for full-screen editors. */
	variant?: TextAreaVariant;
	disabled?: boolean;
	/** Adds a marker to the label and a hint for screen readers. It doesn't validate. */
	required?: boolean;
	/** Grows with its content between `minRows` and `maxRows`, then scrolls. */
	autoGrow?: boolean;
	/** Height when empty, in lines. */
	minRows?: number;
	/** Height limit with `autoGrow`, in lines. */
	maxRows?: number;
	/** Shows `length / maxLength` under the field. Needs `maxLength`. */
	showCount?: boolean;
	/** The wrapper holding the label, the field and the helper. */
	containerStyle?: StyleProp<ViewStyle>;
	ref?: Ref<TextInput>;
};

/** `plain` keeps the colors of `outline`; it only drops the border, background and padding. */
const colorVariant = (variant: TextAreaVariant): InputVariant =>
	variant === "plain" ? "outline" : variant;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`. Refs are forwarded.
const ThemedTextInput = withUnistyles(TextInput);

export function TextArea({
	label,
	helper,
	error,
	variant = "outline",
	disabled = false,
	required = false,
	autoGrow = false,
	minRows = 3,
	maxRows = 8,
	showCount = false,
	maxLength,
	containerStyle,
	style,
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
		label,
		helper,
		error,
		required,
		disabled,
		accessibilityLabel,
		accessibilityHint,
		ref,
	});

	const length = input.value.length;
	const count =
		showCount && maxLength !== undefined ? (
			<Text
				variant="footnote"
				color={
					length >= maxLength ? "error" : disabled ? "disabled" : "muted"
				}
			>
				{length} / {maxLength}
			</Text>
		) : undefined;

	return (
		<Field
			label={label}
			required={required}
			helper={helper}
			message={input.message}
			disabled={disabled}
			meta={count}
			style={containerStyle}
		>
			<Pressable
				accessible={false}
				onPress={input.focus}
				style={styles.control(variant, input.state)}
			>
				<ThemedTextInput
					textAlignVertical="top"
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					uniProps={(theme) => {
						const colors = inputColors(
							theme.components,
							colorVariant(variant),
							input.state,
						);
						return {
							placeholderTextColor: colors.placeholder,
							selectionColor: colors.caret,
							cursorColor: colors.caret,
						};
					}}
					{...props}
					{...input.inputProps}
					multiline
					maxLength={maxLength}
					style={[
						styles.text(
							variant,
							input.state,
							autoGrow,
							minRows,
							maxRows,
						),
						style,
					]}
				/>
			</Pressable>
		</Field>
	);
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
