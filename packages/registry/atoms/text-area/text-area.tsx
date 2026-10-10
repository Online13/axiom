import type { Ref } from "react";
import {
	Pressable,
	type TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { MAX_FONT_SCALE } from "@/components/ui/text";
import { useInput } from "@/components/ui/use-input";

import { TextAreaText, useTextAreaStyles } from "./text-area.styles";

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
	const styles = useTextAreaStyles(variant, autoGrow, minRows, maxRows);
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
			{...styles.control(input.state, containerStyle)}
		>
			<TextAreaText
				textAlignVertical="top"
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...styles.colors(input.state)}
				{...props}
				{...input.inputProps}
				multiline
				{...styles.text(input.state, props)}
			/>
		</Pressable>
	);
}
