import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import type { Theme } from "@/theme";

import type { InputState } from "../use-input";

export type InputVariant = "outline" | "filled";

/** Colors of a text field for a variant and a state; missing properties fall back to `default`. */
export function inputColors(
	components: Theme["components"],
	variant: InputVariant,
	state: InputState,
) {
	const states = components.input[variant];
	return {
		...states.default,
		...(state === "default" ? undefined : states[state]),
	};
}

export type FieldProps = {
	label?: string;
	required?: boolean;
	helper?: string;
	/** Error message. Replaces `helper`. */
	message?: string;
	disabled?: boolean;
	/** Content at the end of the helper row, like a character count. */
	meta?: ReactNode;
	style?: StyleProp<ViewStyle>;
	children: ReactNode;
};

/**
 * Label above a field, helper or error below it. The texts are hidden from screen readers:
 * the field announces them through its label and hint.
 */
export function Field({
	label,
	required,
	helper,
	message,
	disabled,
	meta,
	style,
	children,
}: FieldProps) {
	const note = message ?? helper;

	return (
		<View style={[styles.field, style]}>
			{label ? (
				<Text
					variant="bodySm"
					weight="medium"
					color={disabled ? "disabled" : "default"}
					accessibilityElementsHidden
					importantForAccessibility="no-hide-descendants"
				>
					{label}
					{required ? (
						<Text color={disabled ? "disabled" : "error"}> *</Text>
					) : null}
				</Text>
			) : null}
			{children}
			{note || meta ? (
				<View
					style={styles.notes}
					accessibilityElementsHidden
					importantForAccessibility="no-hide-descendants"
				>
					<Text
						variant="footnote"
						color={message ? "error" : disabled ? "disabled" : "muted"}
						style={styles.note}
					>
						{note}
					</Text>
					{meta}
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	field: {
		gap: theme.tokens.spacing[2],
	},
	notes: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
	},
	note: {
		flex: 1,
	},
}));
