import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";

// The icon takes its color as a prop, not as a style. Wrapped once, here, so the instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const SnackbarIcon = withUnistyles(Icon);
// The snackbar itself, which moves: with styles, the animated view takes them all.
export const SnackbarSurface = Animated.View;

export function useSnackbarStyles() {
	return {
		container: (bottomOffset: number) => ({
			style: styles.container(bottomOffset),
		}),
		surface: (actionable: boolean) => ({}),
		snackbar: (actionable: boolean, open: boolean) =>
			styles.snackbar(actionable, open),
		tint: {
			uniProps: (theme: Theme) => ({
				color: theme.components.snackbar.default.default.foreground,
			}),
		},
		message: { style: styles.message },
		action: {
			style: ({ pressed }: TappableState) => styles.action(pressed),
		},
		actionLabel: { style: styles.actionLabel },
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	container: (bottomOffset: number) => ({
		position: "absolute",
		pointerEvents: "box-none",
		// Clear of the Android gesture bar, so a swipe on the snackbar doesn't start the system back or home gesture.
		bottom: rt.insets.bottom + theme.tokens.spacing[4] + bottomOffset,
		left: theme.tokens.metrics.screenMargin,
		right: theme.tokens.metrics.screenMargin,
	}),
	snackbar: (actionable: boolean, open: boolean) => ({
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: "row",
		alignItems: "center",
		boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.18)",
		minHeight: 48,
		gap: theme.tokens.spacing[3],
		paddingStart: theme.tokens.spacing[4],
		paddingEnd: actionable
			? theme.tokens.spacing[1]
			: theme.tokens.spacing[4],
		paddingVertical: theme.tokens.spacing[1],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.components.snackbar.default.default.background,
		...(!open && { pointerEvents: "none" }),
	}),
	message: {
		flex: 1,
		paddingVertical: 6,
		color: theme.components.snackbar.default.default.foreground,
	},
	action: (pressed: boolean) => ({
		minHeight: 40,
		justifyContent: "center",
		paddingHorizontal: theme.tokens.spacing[3],
		borderRadius: theme.tokens.radius.sm,
		opacity: pressed ? 0.6 : 1,
	}),
	actionLabel: {
		color: theme.components.snackbar.default.default.action,
		fontWeight: FONT_WEIGHT.semibold,
	},
}));
