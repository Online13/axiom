import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

import type { MenuItemProps, MenuSeparatorProps } from "./menu";
import { stateColors } from "@/theme/components/states";

// Later states win: destructive, then disabled.
function menuItemColors(
	components: Theme["components"],
	destructive: boolean,
	disabled: boolean,
) {
	const states = components.menu.default;
	return stateColors(
		states,
		destructive && "destructive",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop.
export const MenuIcon = Icon;
// The menu itself, which moves: with styles, the animated view takes them all.
export const MenuSurface = Animated.View;

export function useMenuStyles() {
	const { tokens, components } = useTheme();

	return {
		// The placement is computed in plain numbers: the space kept from the trigger and the screen.
		gap: tokens.spacing[2],
		margin: tokens.metrics.screenMargin,
		layer: (isTop: boolean) => ({
			style: [styles.layer, !isTop && styles.inert],
		}),
		preview: (x: number, y: number, width: number) => [
			styles.preview,
			{ top: y, left: x, width },
		],
		surface: {},
		menu: (transformOrigin: string) => [
			styles.menu,
			{
				transformOrigin,
				borderRadius: tokens.radius.lg,
				backgroundColor: components.menu.default.default.background,
			},
		],
		item: ({ style }: Pick<MenuItemProps, "style">) => ({
			style: ({ pressed }: TappableState) => [
				styles.item,
				{
					minHeight: tokens.metrics.touchTarget,
					gap: tokens.spacing[3],
					paddingHorizontal: tokens.spacing[4],
					paddingVertical: tokens.spacing[2] + 2,
					backgroundColor: pressed
						? components.menu.default.pressed?.item
						: undefined,
				},
				style,
			],
		}),
		check: { style: styles.check },
		label: { style: styles.label },
		tint: (destructive: boolean, disabled: boolean) => ({
			color: menuItemColors(components, destructive, disabled).foreground,
		}),
		itemText: (destructive: boolean, disabled: boolean) => ({
			style: {
				color: menuItemColors(components, destructive, disabled).foreground,
			},
		}),
		groupLabel: {
			style: {
				paddingHorizontal: tokens.spacing[4],
				paddingTop: tokens.spacing[2],
				paddingBottom: tokens.spacing[1],
			},
		},
		separator: ({ style }: Pick<MenuSeparatorProps, "style">) => ({
			style: [
				{
					height: tokens.spacing[2],
					backgroundColor: components.menu.default.default.separator,
				},
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	layer: {
		...StyleSheet.absoluteFill,
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	preview: {
		position: "absolute",
		pointerEvents: "none",
	},
	menu: {
		position: "absolute",
		overflow: "hidden",
		boxShadow: "0px 8px 32px hsla(0, 0%, 0%, 0.2)",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
	},
	check: {
		width: 16,
		alignItems: "center",
	},
	label: {
		flex: 1,
		gap: 2,
	},
});
