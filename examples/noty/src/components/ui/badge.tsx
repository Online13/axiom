import {
	createContext,
	useContext,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { IconName } from "@/components/ui/icon/icons";
import { MAX_FONT_SCALE, Text, FONT_WEIGHT } from "@/components/ui/text";

import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Icon } from "@/components/ui/icon/icon";
import type { Theme } from "@/theme";

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
	...props
}: BadgeProps) {
	const anchored = useContext(RingContext);
	const ring = ringProp ?? anchored;

	// Counter and lone dot: round, in the `count` colors.
	if (count !== undefined || (dot && children === undefined)) {
		if (count === 0) return null;
		const label =
			count === undefined
				? undefined
				: count > max
					? `${max}+`
					: String(count);

		return (
			<View
				{...props}
				accessible={accessibilityLabel !== undefined}
				accessibilityLabel={accessibilityLabel}
				style={[
					styles.counter(size, label !== undefined, ring),
					props.style,
				]}
			>
				{label !== undefined ? (
					<Text
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						style={styles.counterText(size)}
					>
						{label}
					</Text>
				) : null}
			</View>
		);
	}

	return (
		<View
			{...props}
			accessible={accessibilityLabel !== undefined}
			accessibilityLabel={accessibilityLabel}
			style={[styles.pill(variant, size), props.style]}
		>
			{icon ? (
				<BadgeIcon
					name={icon}
					size={size === "sm" ? 12 : 14}
					uniProps={(theme: Theme) => ({
						color: theme.components.badge[variant].default.foreground,
					})}
				/>
			) : dot ? (
				<View style={styles.dot(variant)} />
			) : null}
			{typeof children === "string" || typeof children === "number" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					style={styles.pillText(variant, size)}
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
	...props
}: BadgeAnchorProps) {
	return (
		<View {...props} style={[styles.anchor, props.style]}>
			{children}
			{/* Always mounted, so a badge animated out has a parent to play its exit in. */}
			<View style={styles.badge(placement)}>
				<RingContext value>{badge}</RingContext>
			</View>
		</View>
	);
}

export const Badge = Object.assign(BadgeRoot, { Anchor: BadgeAnchor });

const HEIGHT = { sm: 18, md: 22 };

const DOT = 10;

/** Width of the ring around an anchored counter or dot. */
const RING = 2;

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
const BadgeIcon = withUnistyles(Icon);

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
