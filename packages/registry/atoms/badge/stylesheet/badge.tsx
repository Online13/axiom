import {
	createContext,
	useContext,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type BadgeVariant =
	| "neutral"
	| "highlight"
	| "info"
	| "success"
	| "warning"
	| "error"
	| "outline"
	| "inverse";

export type BadgeSize = "sm" | "md";
export type BadgePlacement = "top-right" | "bottom-right";

export type BadgeProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** The label. One or two words. */
	children?: ReactNode;
	variant?: BadgeVariant;
	/** A dot before the label. Without a label, the badge is a lone dot, for `Badge.Anchor`. */
	dot?: boolean;
	/** Icon before the label. Replaces `dot`. */
	icon?: IconName;
	/** Renders a round counter instead of a label. `0` hides the badge. */
	count?: number;
	/** Above this, the counter shows `99+`. */
	max?: number;
	size?: BadgeSize;
	/**
	 * A ring in the surface color around a counter or lone dot, to detach it from what it sits on.
	 * `Badge.Anchor` turns it on for its badge.
	 */
	ring?: boolean;
	/** For counters, what is counted: "3 unread notifications". */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = { sm: 18, md: 22 };
const DOT = 10;
/** Width of the ring around an anchored counter or dot. */
const RING = 2;

// Set by `Badge.Anchor` around its badge, so the ring follows the badge: it animates with it and
// disappears when the badge renders nothing.
const RingContext = createContext(false);

function BadgeRoot({
	children,
	variant = "neutral",
	dot = false,
	icon,
	count,
	max = 99,
	size = "md",
	ring: ringProp,
	accessibilityLabel,
	style,
	...props
}: BadgeProps) {
	const { tokens, components } = useTheme();
	const anchored = useContext(RingContext);
	const ring = ringProp ?? anchored;
	const height = HEIGHT[size];
	const typography = tokens.typography[size === "sm" ? "caption" : "footnote"];

	// Counter and lone dot: round, in the `count` colors.
	if (count !== undefined || (dot && children === undefined)) {
		if (count === 0) return null;
		const colors = components.badge.count.default;
		const label =
			count === undefined
				? undefined
				: count > max
					? `${max}+`
					: String(count);
		// The ring is drawn outside the badge: it grows the box, not the fill.
		const ringWidth = ring ? RING : 0;

		return (
			<View
				{...props}
				accessible={accessibilityLabel !== undefined}
				accessibilityLabel={accessibilityLabel}
				style={[
					styles.center,
					label === undefined
						? {
								width: DOT + 2 * ringWidth,
								height: DOT + 2 * ringWidth,
								borderRadius: tokens.radius.full,
							}
						: {
								minWidth: height + 2 * ringWidth,
								minHeight: height + 2 * ringWidth,
								borderRadius: tokens.radius.full,
								paddingHorizontal: tokens.spacing[1],
							},
					{
						backgroundColor: colors.background,
						borderWidth: ringWidth,
						borderColor: colors.border,
					},
					style,
				]}
			>
				{label !== undefined ? (
					<Text
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						style={[
							typography,
							{
								color: colors.foreground,
								fontWeight: FONT_WEIGHT.semibold,
							},
						]}
					>
						{label}
					</Text>
				) : null}
			</View>
		);
	}

	const colors = components.badge[variant].default;

	return (
		<View
			{...props}
			accessible={accessibilityLabel !== undefined}
			accessibilityLabel={accessibilityLabel}
			style={[
				styles.pill,
				{
					minHeight: height,
					gap: tokens.spacing[1],
					paddingHorizontal: size === "sm" ? 6 : tokens.spacing[2],
					borderRadius: tokens.radius.full,
					backgroundColor: colors.background ?? "transparent",
					borderWidth: colors.border ? 1 : 0,
					borderColor: colors.border,
				},
				style,
			]}
		>
			{icon ? (
				<Icon
					name={icon}
					size={size === "sm" ? 12 : 14}
					color={colors.foreground}
				/>
			) : dot ? (
				<View
					style={[styles.dot, { backgroundColor: colors.foreground }]}
				/>
			) : null}
			{typeof children === "string" || typeof children === "number" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					style={[
						typography,
						{ color: colors.foreground, fontWeight: FONT_WEIGHT.medium },
					]}
				>
					{children}
				</Text>
			) : (
				children
			)}
		</View>
	);
}

export type BadgeAnchorProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** The element to decorate: an IconButton, an Avatar. */
	children: ReactNode;
	/**
	 * A `count` or `dot` badge, drawn with its ring. `null` shows none. To animate it in and out,
	 * wrap it in an `Animated.View` with `entering` and `exiting`: the anchor stays mounted, so the
	 * exit plays, and the ring, being part of the badge, animates with it.
	 */
	badge: ReactNode;
	placement?: BadgePlacement;
	style?: StyleProp<ViewStyle>;
};

function BadgeAnchor({
	children,
	badge,
	placement = "top-right",
	style,
	...props
}: BadgeAnchorProps) {
	return (
		<View {...props} style={[styles.anchor, style]}>
			{children}
			{/* Always mounted, so a badge animated out has a parent to play its exit in. */}
			<View
				style={[
					styles.badge,
					placement === "top-right" ? styles.top : styles.bottom,
				]}
			>
				<RingContext value>{badge}</RingContext>
			</View>
		</View>
	);
}

export const Badge = Object.assign(BadgeRoot, { Anchor: BadgeAnchor });

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
