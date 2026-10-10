import type { ComponentProps, ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

// The icon takes its color as a prop. Uniwind reads it from the `accent-` class of
// `colorClassName`, which the icon gets by being wrapped.
export const SnackbarIcon = withUniwind(Icon);

type SurfaceProps = Omit<ComponentProps<typeof Animated.View>, "children"> & {
	children?: ReactNode;
	surfaceClassName?: string;
};

/**
 * The snackbar itself, which moves. An animated view takes `style` only, so it keeps what places
 * it, and the view inside it takes the classes: the color, the radius, the padding.
 */
export function SnackbarSurface({
	surfaceClassName,
	children,
	...props
}: SurfaceProps) {
	return (
		<Animated.View {...props}>
			<View
				className={surfaceClassName}
				style={{ boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.18)" }}
			>
				{children}
			</View>
		</Animated.View>
	);
}

// The colors are the snackbar's own tokens, in `theme/components/snackbar.css`.
export function useSnackbarStyles() {
	// The bottom inset is a number the device gives: it isn't a class.
	const insets = useSafeAreaInsets();

	return {
		container: (bottomOffset: number) => ({
			className: "absolute",
			style: {
				pointerEvents: "box-none" as const,
				// Clear of the Android gesture bar, so a swipe on the snackbar doesn't start the system back or home gesture.
				bottom: insets.bottom + spacing[4] + bottomOffset,
				left: metrics.screenMargin,
				right: metrics.screenMargin,
			},
		}),
		surface: (actionable: boolean) => ({
			surfaceClassName: cx(
				"min-h-[48px] flex-row items-center gap-3 rounded-md bg-snackbar py-1 ps-4",
				actionable ? "pe-1" : "pe-4",
			),
		}),
		snackbar: (actionable: boolean, open: boolean) =>
			({
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: open ? "auto" : "none",
			}) satisfies ViewStyle,
		tint: { colorClassName: "accent-snackbar-foreground" },
		message: { className: "flex-1 py-[6px] text-snackbar-foreground" },
		action: {
			className:
				"min-h-[40px] justify-center rounded-sm px-3 active:opacity-60",
		},
		actionLabel: { className: "font-semibold text-snackbar-action" },
	};
}
