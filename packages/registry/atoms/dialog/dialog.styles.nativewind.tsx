import type { ComponentProps, ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";

import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type { DialogActionsOrientation, DialogActionsProps } from "./dialog";

type SurfaceProps = Omit<ComponentProps<typeof Animated.View>, "children"> & {
	children?: ReactNode;
	surfaceClassName?: string;
};

/**
 * The surface, which moves. An animated view takes `style` only, so it keeps its width and its
 * animation, and the view inside it takes the classes: the color, the radius, the padding.
 */
export function DialogSurface({
	surfaceClassName,
	children,
	...props
}: SurfaceProps) {
	return (
		<Animated.View {...props}>
			<View
				className={surfaceClassName}
				style={{ boxShadow: "0px 12px 32px hsla(0, 0%, 0%, 0.18)" }}
			>
				{children}
			</View>
		</Animated.View>
	);
}

// The color is the dialog's own token, in `theme/components/dialog.css`.
export function useDialogStyles() {
	const { width: screenWidth } = useWindowDimensions();

	return {
		// Covered by a surface opened over it, the layer keeps its place but stops answering.
		layer: (isTop: boolean) => ({
			className: "absolute inset-0 items-center justify-center",
			style: {
				pointerEvents: isTop ? ("auto" as const) : ("none" as const),
			},
		}),
		surface: { surfaceClassName: "gap-2 rounded-xl bg-dialog p-5" },
		// Capped by the screen margins.
		frame: (width: number) => ({
			width: Math.min(width, screenWidth - metrics.screenMargin * 2),
		}),
		media: { className: "mb-1 items-center" },
		actions: (
			orientation: DialogActionsOrientation,
			{ className }: Pick<DialogActionsProps, "className">,
		) => ({
			className: cx(
				"mt-3 gap-2",
				orientation === "horizontal" ? "flex-row" : "flex-col",
				className,
			),
		}),
		action: ({ className }: { className?: string }) => ({
			className: cx("grow basis-0 self-stretch", className),
		}),
		destructiveLabel: { className: "font-semibold text-feedback-error" },
	};
}
