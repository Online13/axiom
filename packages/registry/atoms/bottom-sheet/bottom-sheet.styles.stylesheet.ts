import { StyleSheet, type ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

// The sheet and its footer, which move: with styles, the animated view takes them all.
export const BottomSheetSurface = Animated.View;

export function useBottomSheetStyles() {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.bottomSheet.default.default;
	const margin = tokens.metrics.screenMargin;
	// Detached, the sheet already floats above the safe area: it only needs its own inner padding.
	const safeBottom = (detached: boolean) =>
		detached ? tokens.spacing[3] : insets.bottom;

	return {
		// The numbers the sheet's hook lays it out with.
		bottomOffset: (detached: boolean) =>
			detached ? insets.bottom + tokens.spacing[2] : 0,
		stackScale: tokens.metrics.stackScale,
		layer: { style: styles.layer },
		surface: (detached: boolean) => ({}),
		footerSurface: (detached: boolean) => ({}),
		sheet: (
			detached: boolean,
			height: number,
			bottom: number,
			isTop: boolean,
		) => [
			styles.sheet,
			// A covered sheet keeps its shape but stops answering: a button left
			// visible beside the sheet above it can't be pressed.
			!isTop && styles.inert,
			{
				height,
				bottom,
				backgroundColor: colors.background,
				borderTopLeftRadius: tokens.radius.xl,
				borderTopRightRadius: tokens.radius.xl,
			},
			detached && {
				left: margin,
				right: margin,
				borderRadius: tokens.radius.xl,
			},
		],
		content: (
			fitsContent: boolean,
			detached: boolean,
			footerHeight: number | undefined,
		) => ({
			style: [
				!fitsContent && styles.fill,
				{ paddingBottom: footerHeight ?? safeBottom(detached) },
			],
		}),
		footer: (detached: boolean) => [
			styles.footer,
			{
				gap: tokens.spacing[2],
				paddingHorizontal: margin,
				paddingTop: tokens.spacing[2],
				paddingBottom: safeBottom(detached) + tokens.spacing[2],
				backgroundColor: colors.background,
			},
		],
		handleArea: ({ style }: Pick<ViewProps, "style">) => ({
			style: [
				styles.handleArea,
				{ paddingVertical: tokens.spacing[2] },
				style,
			],
		}),
		handle: {
			style: [
				styles.handle,
				{
					borderRadius: tokens.radius.full,
					backgroundColor: colors.handle,
				},
			],
		},
		header: ({ style }: Pick<ViewProps, "style">) => ({
			style: [
				styles.header,
				{
					minHeight: tokens.metrics.touchTarget,
					paddingHorizontal: margin,
					gap: tokens.spacing[2],
				},
				style,
			],
		}),
		start: { style: [styles.side, styles.start] },
		end: { style: [styles.side, styles.end] },
		title: styles.title,
	};
}

const styles = StyleSheet.create({
	layer: {
		...StyleSheet.absoluteFill,
		pointerEvents: "box-none",
	},
	sheet: {
		position: "absolute",
		left: 0,
		right: 0,
		overflow: "hidden",
	},
	inert: {
		pointerEvents: "none",
	},
	fill: {
		flex: 1,
	},
	footer: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
	},
	handleArea: {
		alignItems: "center",
	},
	handle: {
		width: 36,
		height: 5,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	side: {
		flex: 1,
		flexDirection: "row",
	},
	start: {
		justifyContent: "flex-start",
	},
	end: {
		justifyContent: "flex-end",
	},
	title: {
		flexShrink: 1,
	},
});
