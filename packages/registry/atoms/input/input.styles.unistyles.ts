import { TextInput, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { inputColors } from "@/components/ui/input-colors";
import type { Theme } from "@/theme";

import type { InputVariant } from "./field";
import type { InputProps, InputSize } from "./input";
import type { InputState } from "./use-input";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`, which `colors` gives it. Refs are forwarded.
export const InputText = withUnistyles(TextInput);

export function useInputStyles(size: InputSize, variant: InputVariant) {
	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [styles.control(size, variant, state), containerStyle],
		}),
		affix: { style: styles.affix },
		affixText: (state: InputState) => ({
			style: styles.affixText(size, variant, state),
		}),
		colors: (state: InputState) => ({
			uniProps: (theme: Theme) => ({
				placeholderTextColor: inputColors(theme.components, variant, state)
					.placeholder,
				selectionColor: inputColors(theme.components, variant, state).caret,
				cursorColor: inputColors(theme.components, variant, state).caret,
			}),
		}),
		text: (state: InputState, { style }: Pick<InputProps, "style">) => ({
			style: [styles.text(size, variant, state), style],
		}),
	};
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
