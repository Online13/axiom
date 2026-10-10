import { StyleSheet } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { Icon, iconColor, type IconColor } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

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

// The icon takes its color as a prop.
export const IconButtonIcon = Icon;

export function useIconButtonStyles(
	variant: IconButtonVariant,
	size: IconButtonSize,
	shape: IconButtonShape,
	selected: boolean,
) {
	const { tokens, colors, components } = useTheme();
	const dimension = tokens.sizes.control[size];

	return {
		container: (
			disabled: boolean,
			{ style, pressScale }: Pick<IconButtonProps, "style" | "pressScale">,
		) => ({
			pressScale: pressScale ?? tokens.metrics.pressScale,
			style: ({ pressed }: TappableState) => [
				styles.container,
				containerStyle(
					iconButtonColors(
						components,
						variant,
						selected,
						pressed,
						disabled,
					),
					dimension,
					shape === "circle"
						? dimension / 2
						: components.iconButton.radius,
				),
				style,
			],
		}),
		tint: (
			color: IconColor | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			color:
				color && !disabled
					? iconColor(colors, color)
					: iconButtonColors(
							components,
							variant,
							selected,
							pressed,
							disabled,
						).foreground,
		}),
	};
}

function containerStyle(
	colors: ReturnType<typeof iconButtonColors>,
	dimension: number,
	radius: number,
) {
	return {
		width: dimension,
		height: dimension,
		borderRadius: radius,
		backgroundColor: colors.background ?? "transparent",
		borderWidth: colors.border ? 1 : 0,
		borderColor: colors.border,
	};
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});
