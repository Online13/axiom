import type { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

// The sheet and its footer, which move: with styles, the animated view takes them all.
export const BottomSheetSurface = Animated.View;

export function useBottomSheetStyles() {
	// The sheet is laid out in plain numbers by its hook, so the bottom inset and the spacing token
	// are read here rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme, rt } = useUnistyles();

	return {
		bottomOffset: (detached: boolean) =>
			detached ? rt.insets.bottom + theme.tokens.spacing[2] : 0,
		stackScale: theme.tokens.metrics.stackScale,
		layer: { style: styles.layer },
		surface: (detached: boolean) => ({}),
		footerSurface: (detached: boolean) => ({}),
		sheet: (
			detached: boolean,
			height: number,
			bottom: number,
			isTop: boolean,
		) => styles.sheet(detached, height, bottom, isTop),
		content: (
			fitsContent: boolean,
			detached: boolean,
			footerHeight: number | undefined,
		) => ({ style: styles.content(fitsContent, detached, footerHeight) }),
		footer: (detached: boolean) => styles.footer(detached),
		handleArea: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.handleArea, style],
		}),
		handle: { style: styles.handle },
		header: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.header, style],
		}),
		start: { style: styles.start },
		end: { style: styles.end },
		title: styles.title,
	};
}

const styles = StyleSheet.create((theme, rt) => {
	const colors = theme.components.bottomSheet.default.default;
	// Detached, the sheet already floats above the safe area: it only needs its own inner padding.
	const safeBottom = (detached: boolean) =>
		detached ? theme.tokens.spacing[3] : rt.insets.bottom;

	return {
		layer: {
			...StyleSheet.absoluteFillObject,
			pointerEvents: "box-none",
		},
		sheet: (
			detached: boolean,
			height: number,
			bottom: number,
			isTop: boolean,
		) => ({
			position: "absolute",
			left: 0,
			right: 0,
			overflow: "hidden",
			height,
			bottom,
			// A covered sheet keeps its shape but stops answering: a button left visible beside
			// the sheet above it can't be pressed.
			pointerEvents: isTop ? "auto" : "none",
			backgroundColor: colors.background,
			borderTopLeftRadius: theme.tokens.radius.xl,
			borderTopRightRadius: theme.tokens.radius.xl,
			...(detached && {
				left: theme.tokens.metrics.screenMargin,
				right: theme.tokens.metrics.screenMargin,
				borderRadius: theme.tokens.radius.xl,
			}),
		}),
		content: (
			fitsContent: boolean,
			detached: boolean,
			footerHeight: number | undefined,
		) => ({
			...(!fitsContent && { flex: 1 }),
			paddingBottom: footerHeight ?? safeBottom(detached),
		}),
		footer: (detached: boolean) => ({
			position: "absolute",
			left: 0,
			right: 0,
			bottom: 0,
			gap: theme.tokens.spacing[2],
			paddingHorizontal: theme.tokens.metrics.screenMargin,
			paddingTop: theme.tokens.spacing[2],
			paddingBottom: safeBottom(detached) + theme.tokens.spacing[2],
			backgroundColor: colors.background,
		}),
		handleArea: {
			alignItems: "center",
			paddingVertical: theme.tokens.spacing[2],
		},
		handle: {
			width: 36,
			height: 5,
			borderRadius: theme.tokens.radius.full,
			backgroundColor: colors.handle,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			minHeight: theme.tokens.metrics.touchTarget,
			paddingHorizontal: theme.tokens.metrics.screenMargin,
			gap: theme.tokens.spacing[2],
		},
		start: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-start",
		},
		end: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		title: {
			flexShrink: 1,
		},
	};
});
