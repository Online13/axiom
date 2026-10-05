import type { ReactNode, Ref } from "react";
import {
	Pressable,
	StyleSheet,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import { useInput } from "../use-input";
import { inputColors, type InputVariant } from "./field";

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

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

/** The text control alone. Wrap it in a Field for a label, a description or an error. */
export function Input({
	invalid,
	prefix,
	suffix,
	size = "md",
	variant = "outline",
	disabled,
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
}: InputProps) {
	const { tokens, components } = useTheme();
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

	const colors = inputColors(components, variant, input.state);
	const typography = tokens.typography[TEXT[size]];
	const affix = (node: ReactNode) =>
		typeof node === "string" || typeof node === "number" ? (
			<Text
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				style={{ fontSize: typography.fontSize, color: colors.affix }}
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
			style={[
				styles.control,
				{
					height: tokens.sizes.input[size],
					paddingHorizontal: tokens.spacing[size === "sm" ? 2 : 3],
					gap: tokens.spacing[2],
					borderRadius: components.input.radius,
					backgroundColor: colors.background ?? "transparent",
					borderColor: colors.border ?? "transparent",
				},
				containerStyle,
			]}
		>
			{prefix !== undefined ? (
				<View style={styles.affix}>{affix(prefix)}</View>
			) : null}
			<TextInput
				placeholderTextColor={colors.placeholder}
				selectionColor={colors.caret}
				cursorColor={colors.caret}
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...props}
				{...input.inputProps}
				style={[
					styles.text,
					{
						fontSize: typography.fontSize,
						fontWeight: typography.fontWeight,
						color: colors.text,
					},
					typography.fontFamily
						? { fontFamily: typography.fontFamily }
						: undefined,
					style,
				]}
			/>
			{suffix !== undefined ? (
				<View style={styles.affix}>{affix(suffix)}</View>
			) : null}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	control: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderCurve: "continuous",
	},
	text: {
		flex: 1,
		alignSelf: "stretch",
		// Android adds vertical padding to TextInput; the control sets the height.
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	affix: {
		flexDirection: "row",
		alignItems: "center",
	},
});
