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

import { useInput, type InputState } from "../use-input";
import { Field, inputColors, type InputVariant } from "./field";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<TextInputProps, "editable"> & {
	label?: string;
	helper?: string;
	/** Puts the field in the `invalid` state. A string also replaces `helper`. */
	error?: string | boolean;
	/** Before the text: an icon, a currency sign, a country code. A string is drawn in the affix color. */
	prefix?: ReactNode;
	/** After the text: a unit, a clear button, a visibility toggle. */
	suffix?: ReactNode;
	/** Minimum height of the field: 32, 44 or 52pt, from the `control` size tokens. Label and helper come on top. */
	size?: InputSize;
	variant?: InputVariant;
	disabled?: boolean;
	/** Adds a marker to the label and a hint for screen readers. It doesn't validate. */
	required?: boolean;
	/** The wrapper holding the label, the field and the helper. */
	containerStyle?: StyleProp<ViewStyle>;
	ref?: Ref<TextInput>;
};

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`. Refs are forwarded.
const ThemedTextInput = withUnistyles(TextInput);

export function Input({
	label,
	helper,
	error,
	prefix,
	suffix,
	size = "md",
	variant = "outline",
	disabled = false,
	required = false,
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
		label,
		helper,
		error,
		required,
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

	return (
		<Field
			label={label}
			required={required}
			helper={helper}
			message={input.message}
			disabled={disabled}
			style={containerStyle}
		>
			{/* Taps on the padding and the affixes focus the field. */}
			<Pressable
				accessible={false}
				onPress={input.focus}
				style={styles.control(size, variant, input.state)}
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
		</Field>
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
			minHeight: theme.tokens.sizes.control[size],
			paddingHorizontal: theme.tokens.spacing[size === "sm" ? 2 : 3],
			gap: theme.tokens.spacing[2],
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	text: (size: InputSize, variant: InputVariant, state: InputState) => {
		const typography = theme.tokens.typography[TEXT[size]];
		return {
			flex: 1,
			alignSelf: "stretch",
			// Android adds vertical padding to TextInput; the control sets the minimum height.
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
	affixText: (
		size: InputSize,
		variant: InputVariant,
		state: InputState,
	) => ({
		fontSize: theme.tokens.typography[TEXT[size]].fontSize,
		color: inputColors(theme.components, variant, state).affix,
	}),
}));
