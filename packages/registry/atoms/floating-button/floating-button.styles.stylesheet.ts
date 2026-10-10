import { StyleSheet } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

import type {
	FloatingButtonProps,
	FloatingButtonSize,
	FloatingButtonVariant,
} from "./floating-button";
import { stateColors } from "@/theme/components/states";

function floatingButtonColors(
	components: Theme["components"],
	variant: FloatingButtonVariant,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.floatingButton[variant];
	return stateColors(states, pressed && "pressed", disabled && "disabled");
}

// The icon takes its color as a prop.
export const FloatingButtonIcon = Icon;

export function useFloatingButtonStyles(
	variant: FloatingButtonVariant,
	size: FloatingButtonSize,
) {
	const { tokens, components } = useTheme();
	const dimension =
		size === "sm" ? tokens.sizes.control.md : tokens.sizes.control.lg;

	return {
		// The distance the button keeps from the edges of the screen.
		margin: tokens.metrics.screenMargin,
		anchor: (hidden: boolean) => [
			styles.anchor,
			hidden && styles.passThrough,
		],
		button: (
			extended: boolean,
			disabled: boolean,
			{
				style,
				pressScale,
			}: Pick<FloatingButtonProps, "style" | "pressScale">,
		) => ({
			pressScale: pressScale ?? tokens.metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.button,
				{
					minHeight: dimension,
					minWidth: dimension,
					paddingHorizontal: extended ? tokens.spacing[5] : 0,
					borderRadius: components.floatingButton.radius,
				},
				surfaceStyle(
					floatingButtonColors(components, variant, pressed, disabled),
					tokens.metrics.hairline,
				),
				style,
			],
		}),
		content: { style: [styles.content, { gap: tokens.spacing[2] }] },
		tint: (pressed: boolean, disabled: boolean) => ({
			color: floatingButtonColors(components, variant, pressed, disabled)
				.foreground,
		}),
		label: (pressed: boolean, disabled: boolean) => ({
			style: {
				color: floatingButtonColors(components, variant, pressed, disabled)
					.foreground,
				fontWeight: FONT_WEIGHT.semibold,
			},
		}),
	};
}

function surfaceStyle(
	colors: ReturnType<typeof floatingButtonColors>,
	hairline: number,
) {
	return {
		backgroundColor: colors.background,
		borderWidth: colors.border ? hairline : 0,
		borderColor: colors.border,
	};
}

const styles = StyleSheet.create({
	anchor: {
		position: "absolute",
		// A centered anchor spans the screen width: only the button catches touches.
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "none",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0px 6px 16px hsla(0, 0%, 0%, 0.18)",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
	},
});
