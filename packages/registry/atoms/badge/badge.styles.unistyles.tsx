import type { ViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";

import type { BadgePlacement, BadgeSize, BadgeVariant } from "./badge";

const HEIGHT = { sm: 18, md: 22 };
const DOT = 10;
/** Width of the ring around an anchored counter or dot. */
const RING = 2;

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const BadgeIcon = withUnistyles(Icon);

export function useBadgeStyles() {
	return {
		counter: (
			size: BadgeSize,
			labelled: boolean,
			ring: boolean,
			{ style }: Pick<ViewProps, "style">,
		) => ({ style: [styles.counter(size, labelled, ring), style] }),
		counterText: (size: BadgeSize) => ({ style: styles.counterText(size) }),
		pill: (
			variant: BadgeVariant,
			size: BadgeSize,
			{ style }: Pick<ViewProps, "style">,
		) => ({ style: [styles.pill(variant, size), style] }),
		pillText: (variant: BadgeVariant, size: BadgeSize) => ({
			style: styles.pillText(variant, size),
		}),
		tint: (variant: BadgeVariant) => ({
			uniProps: (theme: Theme) => ({
				color: theme.components.badge[variant].default.foreground,
			}),
		}),
		dot: (variant: BadgeVariant) => ({ style: styles.dot(variant) }),
		anchor: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.anchor, style],
		}),
		badge: (placement: BadgePlacement) => ({
			style: styles.badge(placement),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	counter: (size: BadgeSize, labelled: boolean, ring: boolean) => {
		// The ring is drawn outside the badge: it grows the box, not the fill.
		const ringWidth = ring ? RING : 0;
		return {
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.tokens.radius.full,
			backgroundColor: theme.components.badge.count.default.background,
			borderWidth: ringWidth,
			borderColor: theme.components.badge.count.default.border,
			...(labelled
				? {
						minWidth: HEIGHT[size] + 2 * ringWidth,
						minHeight: HEIGHT[size] + 2 * ringWidth,
						paddingHorizontal: theme.tokens.spacing[1],
					}
				: {
						width: DOT + 2 * ringWidth,
						height: DOT + 2 * ringWidth,
					}),
		};
	},
	counterText: (size: BadgeSize) => ({
		...theme.tokens.typography[size === "sm" ? "caption" : "footnote"],
		color: theme.components.badge.count.default.foreground,
		fontWeight: FONT_WEIGHT.semibold,
	}),
	pill: (variant: BadgeVariant, size: BadgeSize) => {
		const colors = theme.components.badge[variant].default;
		return {
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "flex-start",
			minHeight: HEIGHT[size],
			gap: theme.tokens.spacing[1],
			paddingHorizontal: size === "sm" ? 6 : theme.tokens.spacing[2],
			borderRadius: theme.tokens.radius.full,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
	pillText: (variant: BadgeVariant, size: BadgeSize) => ({
		...theme.tokens.typography[size === "sm" ? "caption" : "footnote"],
		color: theme.components.badge[variant].default.foreground,
		fontWeight: FONT_WEIGHT.medium,
	}),
	dot: (variant: BadgeVariant) => ({
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: theme.components.badge[variant].default.foreground,
	}),
	anchor: {
		alignSelf: "flex-start",
	},
	// Offset by the ring, so the badge's fill lands where it would without one.
	badge: (placement: BadgePlacement) => ({
		position: "absolute",
		pointerEvents: "none",
		right: -RING,
		...(placement === "top-right" ? { top: -RING } : { bottom: -RING }),
	}),
}));
