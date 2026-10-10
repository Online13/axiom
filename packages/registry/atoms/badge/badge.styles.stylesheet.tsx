import { StyleSheet, type ViewProps } from "react-native";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme } from "@/theme";

import type { BadgePlacement, BadgeSize, BadgeVariant } from "./badge";

const HEIGHT = { sm: 18, md: 22 };
const DOT = 10;
/** Width of the ring around an anchored counter or dot. */
const RING = 2;

// The icon takes its color as a prop.
export const BadgeIcon = Icon;

export function useBadgeStyles() {
	const { tokens, components } = useTheme();
	const typography = (size: BadgeSize) =>
		tokens.typography[size === "sm" ? "caption" : "footnote"];
	// The ring is drawn outside the badge: it grows the box, not the fill.
	const ringWidth = (ring: boolean) => (ring ? RING : 0);

	return {
		counter: (
			size: BadgeSize,
			labelled: boolean,
			ring: boolean,
			{ style }: Pick<ViewProps, "style">,
		) => ({
			style: [
				styles.center,
				labelled
					? {
							minWidth: HEIGHT[size] + 2 * ringWidth(ring),
							minHeight: HEIGHT[size] + 2 * ringWidth(ring),
							borderRadius: tokens.radius.full,
							paddingHorizontal: tokens.spacing[1],
						}
					: {
							width: DOT + 2 * ringWidth(ring),
							height: DOT + 2 * ringWidth(ring),
							borderRadius: tokens.radius.full,
						},
				{
					backgroundColor: components.badge.count.default.background,
					borderWidth: ringWidth(ring),
					borderColor: components.badge.count.default.border,
				},
				style,
			],
		}),
		counterText: (size: BadgeSize) => ({
			style: [
				typography(size),
				{
					color: components.badge.count.default.foreground,
					fontWeight: FONT_WEIGHT.semibold,
				},
			],
		}),
		pill: (
			variant: BadgeVariant,
			size: BadgeSize,
			{ style }: Pick<ViewProps, "style">,
		) => ({
			style: [
				styles.pill,
				{
					minHeight: HEIGHT[size],
					gap: tokens.spacing[1],
					paddingHorizontal: size === "sm" ? 6 : tokens.spacing[2],
					borderRadius: tokens.radius.full,
					backgroundColor:
						components.badge[variant].default.background ?? "transparent",
					borderWidth: components.badge[variant].default.border ? 1 : 0,
					borderColor: components.badge[variant].default.border,
				},
				style,
			],
		}),
		pillText: (variant: BadgeVariant, size: BadgeSize) => ({
			style: [
				typography(size),
				{
					color: components.badge[variant].default.foreground,
					fontWeight: FONT_WEIGHT.medium,
				},
			],
		}),
		tint: (variant: BadgeVariant) => ({
			color: components.badge[variant].default.foreground,
		}),
		dot: (variant: BadgeVariant) => ({
			style: [
				styles.dot,
				{ backgroundColor: components.badge[variant].default.foreground },
			],
		}),
		anchor: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.anchor, style],
		}),
		badge: (placement: BadgePlacement) => ({
			style: [
				styles.badge,
				placement === "top-right" ? styles.top : styles.bottom,
			],
		}),
	};
}

const styles = StyleSheet.create({
	center: {
		alignItems: "center",
		justifyContent: "center",
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
	anchor: {
		alignSelf: "flex-start",
	},
	// Offset by the ring, so the badge's fill lands where it would without one.
	badge: {
		position: "absolute",
		pointerEvents: "none",
		right: -RING,
	},
	top: {
		top: -RING,
	},
	bottom: {
		bottom: -RING,
	},
});
