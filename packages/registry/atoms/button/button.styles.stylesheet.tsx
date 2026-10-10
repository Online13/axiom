import {
	ActivityIndicator,
	StyleSheet,
	type TextStyle,
	type ViewStyle,
} from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { useTheme, type Theme } from "@/theme";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";

import type {
	ButtonProps,
	ButtonSize,
	ButtonState,
	ButtonVariant,
} from "./button";
import { stateColors } from "@/theme/components/states";

// The spinner and the icon take their color as a prop.
export const ButtonSpinner = ActivityIndicator;
export const ButtonIcon = Icon;

export function useButtonStyles(
	variant: ButtonVariant,
	size: ButtonSize,
	fullWidth: boolean,
) {
	const theme = useTheme();

	return {
		container: (
			state: ButtonState,
			{ style }: Pick<ButtonProps, "style">,
		) => ({
			style: [
				styles.container,
				containerStyle(theme, variant, size, state),
				fullWidth && styles.fullWidth,
				style,
			],
		}),
		pressable: (
			disabled: boolean,
			{ style, pressScale }: Pick<ButtonProps, "style" | "pressScale">,
		) => ({
			pressScale: pressScale ?? theme.tokens.metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.container,
				containerStyle(
					theme,
					variant,
					size,
					disabled ? "disabled" : pressed ? "pressed" : "default",
				),
				fullWidth && styles.fullWidth,
				style,
			],
		}),
		text: (state: ButtonState) => ({
			style: textStyle(theme, variant, size, state),
		}),
		tint: (state: ButtonState) => ({
			color: stateColors(theme.components.button[variant], state).foreground,
		}),
		label: (hidden: boolean) => ({
			style: [styles.label, hidden && styles.hidden],
		}),
		spinnerOverlay: { style: styles.spinnerOverlay },
	};
}

function containerStyle(
	theme: Theme,
	variant: ButtonVariant,
	size: ButtonSize,
	state: ButtonState,
): ViewStyle {
	const { tokens, components } = theme;
	const colors = stateColors(components.button[variant], state);
	return {
		minHeight: tokens.sizes.control[size],
		paddingHorizontal: PADDING[size](tokens),
		gap: tokens.spacing[2],
		borderRadius: components.button.radius,
		backgroundColor: colors.background ?? "transparent",
		borderWidth: colors.border ? 1 : 0,
		borderColor: colors.border,
	};
}

function textStyle(
	theme: Theme,
	variant: ButtonVariant,
	size: ButtonSize,
	state: ButtonState,
): TextStyle {
	return {
		...theme.tokens.typography[TYPOGRAPHY[size]],
		color: stateColors(theme.components.button[variant], state).foreground,
		fontWeight: FONT_WEIGHT.semibold,
	};
}

const PADDING: Record<ButtonSize, (tokens: Theme["tokens"]) => number> = {
	sm: (tokens) => tokens.spacing[3],
	md: (tokens) => tokens.spacing[4],
	lg: (tokens) => tokens.spacing[5],
};

const TYPOGRAPHY = {
	sm: "subheadline",
	md: "callout",
	lg: "headline",
} as const satisfies Record<ButtonSize, keyof Theme["tokens"]["typography"]>;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-start",
	},
	fullWidth: {
		alignSelf: "stretch",
	},
	label: {
		flexShrink: 1,
	},
	hidden: {
		opacity: 0,
	},
	spinnerOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
});
