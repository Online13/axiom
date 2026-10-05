import type { ComponentPropsWithRef, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Text, type TextProps } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

import {
	FieldContext,
	useField,
	useFieldRoot,
	useFieldText,
	type InputState,
} from "../use-input";

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

export type FieldProps = ComponentPropsWithRef<typeof View> & {
	/** Puts the control inside in the `invalid` state. A rendered `Field.Error` does it too. */
	invalid?: boolean;
	/** Disables the control inside and dims the texts. */
	disabled?: boolean;
	/** Adds a marker to `Field.Label` and a hint for screen readers. It doesn't validate. */
	required?: boolean;
	style?: StyleProp<ViewStyle>;
};

/**
 * Groups a control with its label and messages. Each part renders where you write it; the control
 * inside (Input, TextArea) reads the texts and the state from here.
 */
function FieldRoot({
	invalid,
	disabled,
	required,
	style,
	children,
	...props
}: FieldProps) {
	const { tokens } = useTheme();
	const field = useFieldRoot({ invalid, disabled, required });

	return (
		<FieldContext value={field}>
			<View {...props} style={[{ gap: tokens.spacing[2] }, style]}>
				{children}
			</View>
		</FieldContext>
	);
}

export type FieldTextProps = Omit<TextProps, "variant" | "color"> & {
	children?: ReactNode;
};

// Plain text is announced by the control, so the line itself is hidden from screen readers.
const hidden = {
	accessibilityElementsHidden: true,
	importantForAccessibility: "no-hide-descendants",
} as const;

function FieldLabel({ children, ...props }: FieldTextProps) {
	const field = useField();
	const announced = useFieldText("label", children);

	return (
		<Text
			variant="bodySm"
			weight="medium"
			color={field?.disabled ? "disabled" : "default"}
			{...(announced && hidden)}
			{...props}
		>
			{children}
			{field?.required ? (
				<Text color={field.disabled ? "disabled" : "error"}> *</Text>
			) : null}
		</Text>
	);
}

/** Help under the control. Next to an error, the error is announced instead. */
function FieldDescription({ children, ...props }: FieldTextProps) {
	const field = useField();
	const announced = useFieldText("description", children);

	return (
		<Text
			variant="footnote"
			color={field?.disabled ? "disabled" : "muted"}
			{...(announced && hidden)}
			{...props}
		>
			{children}
		</Text>
	);
}

/** Render it only when there's an error: it marks the field invalid. */
function FieldError({ children, ...props }: FieldTextProps) {
	const announced = useFieldText("error", children);

	return (
		<Text
			variant="footnote"
			color="error"
			{...(announced && hidden)}
			{...props}
		>
			{children}
		</Text>
	);
}

export const Field = Object.assign(FieldRoot, {
	Label: FieldLabel,
	Description: FieldDescription,
	Error: FieldError,
});
