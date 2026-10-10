import type { ComponentProps, ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type { MenuItemProps, MenuSeparatorProps } from "./menu";

// Every class is written whole, so Tailwind finds it. The colors are the menu's own tokens, in
// `theme/components/menu.css`.

// Later states win: destructive, then disabled.
const foreground = (destructive: boolean, disabled: boolean) =>
	disabled
		? "text-menu-foreground-disabled"
		: destructive
			? "text-menu-foreground-destructive"
			: "text-menu-foreground";

// The same again, as the `accent-` classes Uniwind reads a color prop from.
const tint = (destructive: boolean, disabled: boolean) =>
	disabled
		? "accent-menu-foreground-disabled"
		: destructive
			? "accent-menu-foreground-destructive"
			: "accent-menu-foreground";

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const MenuIcon = withUniwind(Icon);

type SurfaceProps = Omit<ComponentProps<typeof Animated.View>, "children"> & {
	children?: ReactNode;
	surfaceClassName?: string;
};

/**
 * The menu itself, which moves. An animated view takes `style` only, so it keeps what places it,
 * and the view inside it takes the classes: the color and the radius.
 */
export function MenuSurface({
	surfaceClassName,
	children,
	...props
}: SurfaceProps) {
	return (
		<Animated.View {...props}>
			<View
				className={surfaceClassName}
				style={{ boxShadow: "0px 8px 32px hsla(0, 0%, 0%, 0.2)" }}
			>
				{children}
			</View>
		</Animated.View>
	);
}

export function useMenuStyles() {
	return {
		// The placement is computed in plain numbers: the space kept from the trigger and the screen.
		gap: spacing[2],
		margin: metrics.screenMargin,
		// Covered by a surface opened over it, the layer keeps its place but stops answering.
		layer: (isTop: boolean) => ({
			className: "absolute inset-0",
			style: {
				pointerEvents: isTop ? ("auto" as const) : ("none" as const),
			},
		}),
		preview: (x: number, y: number, width: number) =>
			({
				position: "absolute",
				pointerEvents: "none",
				top: y,
				left: x,
				width,
			}) satisfies ViewStyle,
		surface: { surfaceClassName: "overflow-hidden rounded-lg bg-menu" },
		menu: (transformOrigin: string) =>
			({ position: "absolute", transformOrigin }) satisfies ViewStyle,
		// `pressed` is applied by the pressable itself, through `active:`.
		item: ({ className }: Pick<MenuItemProps, "className">) => ({
			className: cx(
				"min-h-touch-target flex-row items-center gap-3 px-4 py-[10px] active:bg-menu-item-pressed",
				className,
			),
		}),
		check: { className: "w-[16px] items-center" },
		label: { className: "flex-1 gap-[2px]" },
		tint: (destructive: boolean, disabled: boolean) => ({
			colorClassName: tint(destructive, disabled),
		}),
		itemText: (destructive: boolean, disabled: boolean) => ({
			className: foreground(destructive, disabled),
		}),
		groupLabel: { className: "px-4 pb-1 pt-2" },
		separator: ({ className }: Pick<MenuSeparatorProps, "className">) => ({
			className: cx("h-2 bg-menu-separator", className),
		}),
	};
}
