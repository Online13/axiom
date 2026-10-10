import { ActivityIndicator } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";

import type {
	ButtonProps,
	ButtonSize,
	ButtonState,
	ButtonVariant,
} from "./button";
import { stateColors } from "@/theme/components/states";

// The spinner and the icon take their color as a prop, not as a style. Wrapped once, here, so each
// instance only has to map the theme to that prop through `uniProps`, which `tint` gives them.
export const ButtonSpinner = withUnistyles(ActivityIndicator);
export const ButtonIcon = withUnistyles(Icon);

export function useButtonStyles(
	variant: ButtonVariant,
	size: ButtonSize,
	fullWidth: boolean,
) {
	styles.useVariants({ variant, size, fullWidth });

	return {
		container: (
			state: ButtonState,
			{ style }: Pick<ButtonProps, "style">,
		) => ({
			style: [styles.container(state), style],
		}),
		pressable: (
			disabled: boolean,
			{ style, pressScale }: Pick<ButtonProps, "style" | "pressScale">,
		) => ({
			pressScale: pressScale ?? metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.container(
					disabled ? "disabled" : pressed ? "pressed" : "default",
				),
				style,
			],
		}),
		text: (state: ButtonState) => ({
			style: styles.text(state),
		}),
		tint: (state: ButtonState) => ({
			uniProps: (theme: Theme) => ({
				color: stateColors(theme.components.button[variant], state)
					.foreground,
			}),
		}),
		label: (hidden: boolean) => ({
			style: [styles.label, hidden && styles.hidden],
		}),
		spinnerOverlay: { style: styles.spinnerOverlay },
	};
}

function surface(
	components: Theme["components"],
	variant: ButtonVariant,
	state: ButtonState,
) {
	const colors = stateColors(components.button[variant], state);
	return {
		backgroundColor: colors.background ?? "transparent",
		borderWidth: colors.border ? 1 : 0,
		borderColor: colors.border,
	};
}

// What the props choose is a variant, selected once by `useVariants`. The state is an argument:
// `pressed` only exists inside the callback of Tappable, after the variants are selected.
const styles = StyleSheet.create((theme) => ({
	container: (state: ButtonState) => ({
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.tokens.spacing[2],
		borderRadius: theme.components.button.radius,
		variants: {
			variant: {
				solid: surface(theme.components, "solid", state),
				outline: surface(theme.components, "outline", state),
				ghost: surface(theme.components, "ghost", state),
				destructive: surface(theme.components, "destructive", state),
			},
			size: {
				sm: {
					minHeight: theme.tokens.sizes.control.sm,
					paddingHorizontal: theme.tokens.spacing[3],
				},
				md: {
					minHeight: theme.tokens.sizes.control.md,
					paddingHorizontal: theme.tokens.spacing[4],
				},
				lg: {
					minHeight: theme.tokens.sizes.control.lg,
					paddingHorizontal: theme.tokens.spacing[5],
				},
			},
			fullWidth: {
				true: { alignSelf: "stretch" },
				false: { alignSelf: "flex-start" },
			},
		},
	}),
	text: (state: ButtonState) => ({
		fontWeight: FONT_WEIGHT.semibold,
		variants: {
			variant: {
				solid: {
					color: stateColors(theme.components.button.solid, state)
						.foreground,
				},
				outline: {
					color: stateColors(theme.components.button.outline, state)
						.foreground,
				},
				ghost: {
					color: stateColors(theme.components.button.ghost, state)
						.foreground,
				},
				destructive: {
					color: stateColors(theme.components.button.destructive, state)
						.foreground,
				},
			},
			size: {
				sm: theme.tokens.typography.subheadline,
				md: theme.tokens.typography.callout,
				lg: theme.tokens.typography.headline,
			},
		},
	}),
	label: {
		flexShrink: 1,
	},
	hidden: {
		opacity: 0,
	},
	spinnerOverlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
}));
