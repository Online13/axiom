import type { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { FONT_WEIGHT } from "@/components/ui/text";

import type { DialogActionsOrientation, DialogActionsProps } from "./dialog";

// The surface, which moves: with styles, the animated view takes them all.
export const DialogSurface = Animated.View;

export function useDialogStyles() {
	return {
		layer: (isTop: boolean) => ({
			style: [styles.layer, !isTop && styles.inert],
		}),
		surface: {},
		frame: (width: number) => styles.surface(width),
		media: { style: styles.media },
		actions: (
			orientation: DialogActionsOrientation,
			{ style }: Pick<DialogActionsProps, "style">,
		) => ({ style: [styles.actions(orientation), style] }),
		action: ({ style }: { style?: StyleProp<ViewStyle> }) => ({
			style: [styles.action, style],
		}),
		destructiveLabel: { style: styles.destructiveLabel },
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	layer: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	surface: (width: number) => ({
		boxShadow: "0px 12px 32px hsla(0, 0%, 0%, 0.18)",
		width: Math.min(
			width,
			rt.screen.width - theme.tokens.metrics.screenMargin * 2,
		),
		padding: theme.tokens.spacing[5],
		gap: theme.tokens.spacing[2],
		borderRadius: theme.tokens.radius.xl,
		backgroundColor: theme.components.dialog.default.default.background,
	}),
	media: {
		alignItems: "center",
		marginBottom: theme.tokens.spacing[1],
	},
	actions: (orientation: DialogActionsOrientation) => ({
		flexDirection: orientation === "horizontal" ? "row" : "column",
		gap: theme.tokens.spacing[2],
		marginTop: theme.tokens.spacing[3],
	}),
	action: {
		flexGrow: 1,
		flexBasis: 0,
		alignSelf: "stretch",
	},
	destructiveLabel: {
		color: theme.colors.feedback.error,
		fontWeight: FONT_WEIGHT.semibold,
	},
}));
