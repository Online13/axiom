import {
	StyleSheet,
	TextInput,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { inputColors } from "@/components/ui/input-colors";
import { useTheme } from "@/theme";

import type { InputVariant } from "./field";
import type { InputProps, InputSize } from "./input";
import type { InputState } from "./use-input";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

// The placeholder and the caret take their color as props.
export const InputText = TextInput;

export function useInputStyles(size: InputSize, variant: InputVariant) {
	const { tokens, components } = useTheme();
	const typography = tokens.typography[TEXT[size]];

	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [
				styles.control,
				{
					height: tokens.sizes.input[size],
					paddingHorizontal: tokens.spacing[size === "sm" ? 2 : 3],
					gap: tokens.spacing[2],
					borderRadius: components.input.radius,
					backgroundColor:
						inputColors(components, variant, state).background ??
						"transparent",
					borderColor:
						inputColors(components, variant, state).border ??
						"transparent",
				},
				containerStyle,
			],
		}),
		affix: { style: styles.affix },
		affixText: (state: InputState) => ({
			style: {
				fontSize: typography.fontSize,
				color: inputColors(components, variant, state).affix,
			},
		}),
		colors: (state: InputState) => ({
			placeholderTextColor: inputColors(components, variant, state)
				.placeholder,
			selectionColor: inputColors(components, variant, state).caret,
			cursorColor: inputColors(components, variant, state).caret,
		}),
		text: (state: InputState, { style }: Pick<InputProps, "style">) => ({
			style: [
				styles.text,
				{
					fontSize: typography.fontSize,
					fontWeight: typography.fontWeight,
					color: inputColors(components, variant, state).text,
				},
				typography.fontFamily
					? { fontFamily: typography.fontFamily }
					: undefined,
				style,
			],
		}),
	};
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
