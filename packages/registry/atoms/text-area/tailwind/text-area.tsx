import type { Ref } from "react";
import {
	Pressable,
	TextInput,
	useWindowDimensions,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { inputColors } from "@/components/ui/field";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import { useInput } from "@/components/ui/use-input";
import { cx, useTheme } from "@/theme";

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
	className,
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
	const { tokens, components } = useTheme();
	const { fontScale } = useWindowDimensions();
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

	const plain = variant === "plain";
	const colors = inputColors(
		components,
		plain ? "outline" : variant,
		input.state,
	);
	const typography = tokens.typography.callout;
	const paddingVertical = plain ? 0 : tokens.spacing[3] - 1;
	// The system text size also scales the line height: the rows follow it, up to the cap.
	const scale = Math.min(fontScale, MAX_FONT_SCALE.control);
	const rowsHeight = (rows: number) =>
		rows * typography.lineHeight * scale + paddingVertical * 2;

	return (
		<Pressable
			accessible={false}
			onPress={input.focus}
			className={plain ? "grow" : "border"}
			style={[
				!plain && {
					borderCurve: "continuous",
					paddingHorizontal: tokens.spacing[3],
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background ?? "transparent",
					borderColor: colors.border ?? "transparent",
				},
				containerStyle,
			]}
		>
			<TextInput
				placeholderTextColor={colors.placeholder}
				selectionColor={colors.caret}
				cursorColor={colors.caret}
				textAlignVertical="top"
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...props}
				{...input.inputProps}
				multiline
				className={cx(plain && "grow", className)}
				style={[
					{
						paddingHorizontal: 0,
						paddingVertical,
						fontSize: typography.fontSize,
						lineHeight: typography.lineHeight,
						fontWeight: typography.fontWeight,
						color: colors.text,
					},
					typography.fontFamily
						? { fontFamily: typography.fontFamily }
						: undefined,
					plain
						? undefined
						: autoGrow
							? {
									minHeight: rowsHeight(minRows),
									maxHeight: rowsHeight(maxRows),
								}
							: { height: rowsHeight(minRows) },
					style,
				]}
			/>
		</Pressable>
	);
}
