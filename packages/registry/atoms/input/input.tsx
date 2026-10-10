import type { ReactNode, Ref } from "react";
import {
	Pressable,
	type TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { InputVariant } from "./field";
import { InputText, useInputStyles } from "./input.styles";
import { useInput } from "./use-input";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<TextInputProps, "editable"> & {
	/** Puts the field in the `invalid` state. Inside a Field, it follows the Field. */
	invalid?: boolean;
	/** Before the text: an icon, a currency sign, a country code. A string is drawn in the affix color. */
	prefix?: ReactNode;
	/** After the text: a unit, a clear button, a visibility toggle. */
	suffix?: ReactNode;
	/** Height of the field: 50, 56 or 64pt, from the `input` size tokens. */
	size?: InputSize;
	variant?: InputVariant;
	/** Inside a Field, it follows the Field. */
	disabled?: boolean;
	/** The box around the text, prefix and suffix. `style` goes to the TextInput. */
	containerStyle?: StyleProp<ViewStyle>;
	ref?: Ref<TextInput>;
};

/** The text control alone. Wrap it in a Field for a label, a description or an error. */
export function Input({
	invalid,
	prefix,
	suffix,
	size = "md",
	variant = "outline",
	disabled,
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
}: InputProps) {
	const styles = useInputStyles(size, variant);
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

	const affix = (node: ReactNode) =>
		typeof node === "string" || typeof node === "number" ? (
			<Text
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...styles.affixText(input.state)}
			>
				{node}
			</Text>
		) : (
			node
		);

	// Taps on the padding and the affixes focus the field.
	return (
		<Pressable
			accessible={false}
			onPress={input.focus}
			{...styles.control(input.state, containerStyle)}
		>
			{prefix !== undefined ? (
				<View {...styles.affix}>{affix(prefix)}</View>
			) : null}
			<InputText
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...styles.colors(input.state)}
				{...props}
				{...input.inputProps}
				{...styles.text(input.state, props)}
			/>
			{suffix !== undefined ? (
				<View {...styles.affix}>{affix(suffix)}</View>
			) : null}
		</Pressable>
	);
}
