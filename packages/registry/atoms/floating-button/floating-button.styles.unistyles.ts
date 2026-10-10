import {
	StyleSheet,
	useUnistyles,
	withUnistyles,
} from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const FloatingButtonIcon = withUnistyles(Icon);

export function useFloatingButtonStyles(
	variant: FloatingButtonVariant,
	size: FloatingButtonSize,
) {
	// The button's hook takes the screen margin as a plain number to compute its position, so the
	// token is read here rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();

	return {
		margin: theme.tokens.metrics.screenMargin,
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
			pressScale: pressScale ?? metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.button(variant, size, extended, pressed, disabled),
				style,
			],
		}),
		content: { style: styles.content },
		tint: (pressed: boolean, disabled: boolean) => ({
			uniProps: (uniTheme: Theme) => ({
				color: floatingButtonColors(
					uniTheme.components,
					variant,
					pressed,
					disabled,
				).foreground,
			}),
		}),
		label: (pressed: boolean, disabled: boolean) => ({
			style: styles.label(variant, pressed, disabled),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	anchor: {
		position: "absolute",
		// A centered anchor spans the screen width: only the button catches touches.
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "none",
	},
	button: (
		variant: FloatingButtonVariant,
		size: FloatingButtonSize,
		extended: boolean,
		pressed: boolean,
		disabled: boolean,
	) => {
		const colors = floatingButtonColors(
			theme.components,
			variant,
			pressed,
			disabled,
		);
		const dimension =
			size === "sm"
				? theme.tokens.sizes.control.md
				: theme.tokens.sizes.control.lg;

		return {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			boxShadow: "0px 6px 16px hsla(0, 0%, 0%, 0.18)",
			minHeight: dimension,
			minWidth: dimension,
			paddingHorizontal: extended ? theme.tokens.spacing[5] : 0,
			borderRadius: theme.components.floatingButton.radius,
			backgroundColor: colors.background,
			borderWidth: colors.border ? theme.tokens.metrics.hairline : 0,
			borderColor: colors.border,
		};
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	label: (
		variant: FloatingButtonVariant,
		pressed: boolean,
		disabled: boolean,
	) => ({
		color: floatingButtonColors(theme.components, variant, pressed, disabled)
			.foreground,
		fontWeight: FONT_WEIGHT.semibold,
	}),
}));
