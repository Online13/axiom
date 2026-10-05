import type { ReactNode, Ref } from "react";
import {
	Pressable,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import { useInput, type InputState } from "./use-input";
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

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`. Refs are forwarded.
const ThemedTextInput = withUnistyles(TextInput);

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
				style={styles.affixText(size, variant, input.state)}
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
			style={[styles.control(size, variant, input.state), containerStyle]}
		>
			{prefix !== undefined ? (
				<View style={styles.affix}>{affix(prefix)}</View>
			) : null}
			<ThemedTextInput
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				uniProps={(theme) => {
					const colors = inputColors(
						theme.components,
						variant,
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
				style={[styles.text(size, variant, input.state), style]}
			/>
			{suffix !== undefined ? (
				<View style={styles.affix}>{affix(suffix)}</View>
			) : null}
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	control: (size: InputSize, variant: InputVariant, state: InputState) => {
		const colors = inputColors(theme.components, variant, state);
		return {
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			borderCurve: "continuous",
			height: theme.tokens.sizes.input[size],
			paddingHorizontal: theme.tokens.spacing[size === "sm" ? 2 : 3],
			gap: theme.tokens.spacing[2],
			borderRadius: theme.components.input.radius,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	text: (size: InputSize, variant: InputVariant, state: InputState) => {
		const typography = theme.tokens.typography[TEXT[size]];
		return {
			flex: 1,
			alignSelf: "stretch",
			// Android adds vertical padding to TextInput; the control sets the height.
			paddingVertical: 0,
			paddingHorizontal: 0,
			fontSize: typography.fontSize,
			fontWeight: typography.fontWeight,
			...(typography.fontFamily && { fontFamily: typography.fontFamily }),
			color: inputColors(theme.components, variant, state).text,
		};
	},
	affix: {
		flexDirection: "row",
		alignItems: "center",
	},
	affixText: (size: InputSize, variant: InputVariant, state: InputState) => ({
		fontSize: theme.tokens.typography[TEXT[size]].fontSize,
		color: inputColors(theme.components, variant, state).affix,
	}),
}));
