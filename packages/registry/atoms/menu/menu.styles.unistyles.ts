import Animated from "react-native-reanimated";
import {
	StyleSheet,
	useUnistyles,
	withUnistyles,
} from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const MenuIcon = withUnistyles(Icon);
// The menu itself, which moves: with styles, the animated view takes them all.
export const MenuSurface = Animated.View;

export function useMenuStyles() {
	// The placement is computed in plain numbers, so the spacing tokens are read here rather than
	// resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();

	return {
		gap: theme.tokens.spacing[2],
		margin: theme.tokens.metrics.screenMargin,
		layer: (isTop: boolean) => ({
			style: [styles.layer, !isTop && styles.inert],
		}),
		preview: (x: number, y: number, width: number) =>
			styles.preview(x, y, width),
		surface: {},
		menu: (transformOrigin: string) => styles.menu(transformOrigin),
		item: ({ style }: Pick<MenuItemProps, "style">) => ({
			style: ({ pressed }: TappableState) => [styles.item(pressed), style],
		}),
		check: { style: styles.check },
		label: { style: styles.label },
		tint: (destructive: boolean, disabled: boolean) => ({
			uniProps: (uniTheme: Theme) => ({
				color: menuItemColors(uniTheme.components, destructive, disabled)
					.foreground,
			}),
		}),
		itemText: (destructive: boolean, disabled: boolean) => ({
			style: styles.itemText(destructive, disabled),
		}),
		groupLabel: { style: styles.groupLabel },
		separator: ({ style }: Pick<MenuSeparatorProps, "style">) => ({
			style: [styles.separator, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	layer: StyleSheet.absoluteFillObject,
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	preview: (x: number, y: number, width: number) => ({
		position: "absolute",
		pointerEvents: "none",
		top: y,
		left: x,
		width,
	}),
	menu: (transformOrigin: string) => ({
		position: "absolute",
		overflow: "hidden",
		boxShadow: "0px 8px 32px hsla(0, 0%, 0%, 0.2)",
		transformOrigin,
		borderRadius: theme.tokens.radius.lg,
		backgroundColor: theme.components.menu.default.default.background,
	}),
	item: (pressed: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		minHeight: theme.tokens.metrics.touchTarget,
		gap: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.spacing[4],
		paddingVertical: theme.tokens.spacing[2] + 2,
		backgroundColor: pressed
			? theme.components.menu.default.pressed?.item
			: undefined,
	}),
	itemText: (destructive: boolean, disabled: boolean) => ({
		color: menuItemColors(theme.components, destructive, disabled).foreground,
	}),
	check: {
		width: 16,
		alignItems: "center",
	},
	label: {
		flex: 1,
		gap: 2,
	},
	groupLabel: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[2],
		paddingBottom: theme.tokens.spacing[1],
	},
	separator: {
		height: theme.tokens.spacing[2],
		backgroundColor: theme.components.menu.default.default.separator,
	},
}));
