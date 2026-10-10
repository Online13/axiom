import {
	StyleSheet,
	useWindowDimensions,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme } from "@/theme";

import type { DialogActionsOrientation, DialogActionsProps } from "./dialog";

// The surface, which moves: with styles, the animated view takes them all.
export const DialogSurface = Animated.View;

export function useDialogStyles() {
	const { tokens, colors, components } = useTheme();
	const { width: screenWidth } = useWindowDimensions();

	return {
		layer: (isTop: boolean) => ({
			style: [styles.layer, !isTop && styles.inert],
		}),
		surface: {},
		// Capped by the screen margins.
		frame: (width: number) => [
			styles.surface,
			{
				width: Math.min(
					width,
					screenWidth - tokens.metrics.screenMargin * 2,
				),
				padding: tokens.spacing[5],
				gap: tokens.spacing[2],
				borderRadius: tokens.radius.xl,
				backgroundColor: components.dialog.default.default.background,
			},
		],
		media: { style: [styles.media, { marginBottom: tokens.spacing[1] }] },
		actions: (
			orientation: DialogActionsOrientation,
			{ style }: Pick<DialogActionsProps, "style">,
		) => ({
			style: [
				orientation === "horizontal" ? styles.row : styles.column,
				{ gap: tokens.spacing[2], marginTop: tokens.spacing[3] },
				style,
			],
		}),
		action: ({ style }: { style?: StyleProp<ViewStyle> }) => ({
			style: [styles.action, style],
		}),
		destructiveLabel: {
			style: {
				color: colors.feedback.error,
				fontWeight: FONT_WEIGHT.semibold,
			},
		},
	};
}

const styles = StyleSheet.create({
	layer: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	surface: {
		boxShadow: "0px 12px 32px hsla(0, 0%, 0%, 0.18)",
	},
	media: {
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
	},
	column: {
		flexDirection: "column",
	},
	action: {
		flexGrow: 1,
		flexBasis: 0,
		alignSelf: "stretch",
	},
});
