import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type {
	BottomTabBarActionProps,
	BottomTabBarItemProps,
	BottomTabBarProps,
	BottomTabBarVariant,
} from "./bottom-tab-bar";

// Every class is written whole, so Tailwind finds it. The colors are the bar's own tokens, in
// `theme/components/bottom-tab-bar.css`.

// A disabled item keeps its disabled color, active or not.
const content = (active: boolean, disabled: boolean) =>
	disabled
		? "text-bottom-tab-bar-item-content-disabled"
		: active
			? "text-bottom-tab-bar-item-content-active"
			: "text-bottom-tab-bar-item-content";

// The same again, as the `accent-` classes Uniwind reads a color prop from.
const tint = (active: boolean, disabled: boolean) =>
	disabled
		? "accent-bottom-tab-bar-item-content-disabled"
		: active
			? "accent-bottom-tab-bar-item-content-active"
			: "accent-bottom-tab-bar-item-content";

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const BottomTabBarIcon = withUniwind(Icon);

export function useBottomTabBarStyles() {
	// The bottom inset is a number the device gives: it isn't a class.
	const insets = useSafeAreaInsets();

	return {
		bar: (
			variant: BottomTabBarVariant,
			safeArea: boolean,
			{ className, style }: Pick<BottomTabBarProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row px-1 pt-1",
				variant === "floating"
					? "mx-screen-margin items-center rounded-xl border-bottom-tab-bar-floating-border bg-bottom-tab-bar-floating"
					: "items-end border-bottom-tab-bar-fixed-border bg-bottom-tab-bar-fixed",
				className,
			),
			style: [
				// Only the device knows the width of a hairline. A fixed bar adds the inset to its
				// padding; a floating one keeps it as a margin.
				variant === "floating"
					? {
							borderWidth: metrics.hairline,
							borderCurve: "continuous" as const,
							paddingBottom: spacing[1],
							marginBottom: safeArea ? insets.bottom + spacing[2] : 0,
						}
					: {
							borderTopWidth: metrics.hairline,
							paddingBottom: spacing[1] + (safeArea ? insets.bottom : 0),
						},
				style,
			],
		}),
		action: ({ className }: Pick<BottomTabBarActionProps, "className">) => ({
			className: cx("items-center justify-center px-[4px]", className),
		}),
		item: ({ className }: Pick<BottomTabBarItemProps, "className">) => ({
			className: cx(
				"min-h-touch-target flex-1 items-center justify-center gap-[2px] py-1",
				className,
			),
		}),
		tint: (active: boolean, disabled: boolean) => ({
			colorClassName: tint(active, disabled),
		}),
		label: (active: boolean, disabled: boolean) => ({
			className: content(active, disabled),
		}),
	};
}
