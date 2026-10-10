import type { ComponentProps, ReactNode } from "react";
import {
	View,
	type StyleProp,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

type SurfaceProps = Omit<ComponentProps<typeof Animated.View>, "children"> & {
	children?: ReactNode;
	surfaceClassName?: string;
	surfaceStyle?: StyleProp<ViewStyle>;
};

/**
 * The sheet and its footer, which move. An animated view takes `style` only, so it keeps what
 * places it, and the view inside it takes the classes: the color, the radius, the padding.
 */
export function BottomSheetSurface({
	surfaceClassName,
	surfaceStyle,
	children,
	...props
}: SurfaceProps) {
	return (
		<Animated.View {...props}>
			<View className={surfaceClassName} style={surfaceStyle}>
				{children}
			</View>
		</Animated.View>
	);
}

export function useBottomSheetStyles() {
	// Numbers the sheet is laid out with, added to the safe area: they aren't styles.
	const insets = useSafeAreaInsets();

	return {
		bottomOffset: (detached: boolean) =>
			detached ? insets.bottom + spacing[2] : 0,
		stackScale: metrics.stackScale,
		layer: {
			className: "absolute inset-0",
			pointerEvents: "box-none" as const,
		},
		surface: (detached: boolean) => ({
			surfaceClassName: cx(
				"flex-1 overflow-hidden bg-bottom-sheet",
				detached ? "rounded-xl" : "rounded-t-xl",
			),
		}),
		sheet: (
			detached: boolean,
			height: number,
			bottom: number,
			isTop: boolean,
		) =>
			({
				position: "absolute",
				left: detached ? metrics.screenMargin : 0,
				right: detached ? metrics.screenMargin : 0,
				height,
				bottom,
				// A covered sheet keeps its shape but stops answering: a button left
				// visible beside the sheet above it can't be pressed.
				pointerEvents: isTop ? "auto" : "none",
			}) satisfies ViewStyle,
		// Detached, the sheet already floats above the safe area: it only needs its own inner padding.
		content: (
			fitsContent: boolean,
			detached: boolean,
			footerHeight: number | undefined,
		) => ({
			className: cx(
				!fitsContent && "flex-1",
				footerHeight === undefined && detached && "pb-3",
			),
			style:
				footerHeight !== undefined
					? { paddingBottom: footerHeight }
					: detached
						? undefined
						: { paddingBottom: insets.bottom },
		}),
		footerSurface: (detached: boolean) => ({
			surfaceClassName: cx(
				"gap-2 bg-bottom-sheet px-screen-margin pt-2",
				detached && "pb-5",
			),
			surfaceStyle: detached
				? undefined
				: { paddingBottom: insets.bottom + spacing[2] },
		}),
		footer: (detached: boolean) =>
			({
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
			}) satisfies ViewStyle,
		handleArea: ({ className }: Pick<ViewProps, "className">) => ({
			className: cx("items-center py-2", className),
		}),
		handle: {
			className: "h-[5px] w-[36px] rounded-full bg-bottom-sheet-handle",
		},
		header: ({ className }: Pick<ViewProps, "className">) => ({
			className: cx(
				"min-h-touch-target flex-row items-center gap-2 px-screen-margin",
				className,
			),
		}),
		start: { className: "flex-1 flex-row justify-start" },
		end: { className: "flex-1 flex-row justify-end" },
		title: { flexShrink: 1 } satisfies ViewStyle,
	};
}
