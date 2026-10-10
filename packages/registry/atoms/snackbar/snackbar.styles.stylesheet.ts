import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme } from "@/theme";

// The icon takes its color as a prop.
export const SnackbarIcon = Icon;
// The snackbar itself, which moves: with styles, the animated view takes them all.
export const SnackbarSurface = Animated.View;

export function useSnackbarStyles() {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.snackbar.default.default;

	return {
		container: (bottomOffset: number) => ({
			style: [
				styles.container,
				{
					// Clear of the Android gesture bar, so a swipe on the snackbar doesn't start the system back or home gesture.
					bottom: insets.bottom + tokens.spacing[4] + bottomOffset,
					left: tokens.metrics.screenMargin,
					right: tokens.metrics.screenMargin,
				},
			],
		}),
		surface: (actionable: boolean) => ({}),
		snackbar: (actionable: boolean, open: boolean) => [
			styles.snackbar,
			{
				minHeight: 48,
				gap: tokens.spacing[3],
				paddingStart: tokens.spacing[4],
				paddingEnd: actionable ? tokens.spacing[1] : tokens.spacing[4],
				paddingVertical: tokens.spacing[1],
				borderRadius: tokens.radius.md,
				backgroundColor: colors.background,
			},
			!open && styles.leaving,
		],
		tint: { color: colors.foreground },
		message: { style: [styles.message, { color: colors.foreground }] },
		action: {
			style: ({ pressed }: TappableState) => [
				styles.action,
				{
					paddingHorizontal: tokens.spacing[3],
					borderRadius: tokens.radius.sm,
					opacity: pressed ? 0.6 : 1,
				},
			],
		},
		actionLabel: {
			style: { color: colors.action, fontWeight: FONT_WEIGHT.semibold },
		},
	};
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		pointerEvents: "box-none",
	},
	snackbar: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: "row",
		alignItems: "center",
		boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.18)",
	},
	leaving: {
		pointerEvents: "none",
	},
	message: {
		flex: 1,
		paddingVertical: 6,
	},
	action: {
		minHeight: 40,
		justifyContent: "center",
	},
});
