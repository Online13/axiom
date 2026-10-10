import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon, iconColor, type IconColor } from "@/components/ui/icon";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";

import type {
	IconButtonProps,
	IconButtonShape,
	IconButtonSize,
	IconButtonVariant,
} from "./icon-button";
import { stateColors } from "@/theme/components/states";

// Later states win: selected, then pressed, then disabled.
function iconButtonColors(
	components: Theme["components"],
	variant: IconButtonVariant,
	selected: boolean,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.iconButton[variant];
	return stateColors(
		states,
		selected && "selected",
		pressed && "pressed",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const IconButtonIcon = withUnistyles(Icon);

export function useIconButtonStyles(
	variant: IconButtonVariant,
	size: IconButtonSize,
	shape: IconButtonShape,
	selected: boolean,
) {
	return {
		container: (
			disabled: boolean,
			{ style, pressScale }: Pick<IconButtonProps, "style" | "pressScale">,
		) => ({
			pressScale: pressScale ?? metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.container(variant, size, shape, selected, pressed, disabled),
				style,
			],
		}),
		tint: (
			color: IconColor | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			uniProps: (theme: Theme) => ({
				color:
					color && !disabled
						? iconColor(theme.colors, color)
						: iconButtonColors(
								theme.components,
								variant,
								selected,
								pressed,
								disabled,
							).foreground,
			}),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	container: (
		variant: IconButtonVariant,
		size: IconButtonSize,
		shape: IconButtonShape,
		selected: boolean,
		pressed: boolean,
		disabled: boolean,
	) => {
		const colors = iconButtonColors(
			theme.components,
			variant,
			selected,
			pressed,
			disabled,
		);
		const dimension = theme.tokens.sizes.control[size];

		return {
			alignItems: "center",
			justifyContent: "center",
			width: dimension,
			height: dimension,
			borderRadius:
				shape === "circle"
					? dimension / 2
					: theme.components.iconButton.radius,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
}));
