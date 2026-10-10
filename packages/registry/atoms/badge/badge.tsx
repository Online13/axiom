import {
	createContext,
	useContext,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import { BadgeIcon, useBadgeStyles } from "./badge.styles";

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
	const styles = useBadgeStyles();
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
				{...styles.counter(size, label !== undefined, ring, props)}
			>
				{label !== undefined ? (
					<Text
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						{...styles.counterText(size)}
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
			{...styles.pill(variant, size, props)}
		>
			{icon ? (
				<BadgeIcon
					name={icon}
					size={size === "sm" ? 12 : 14}
					{...styles.tint(variant)}
				/>
			) : dot ? (
				<View {...styles.dot(variant)} />
			) : null}
			{typeof children === "string" || typeof children === "number" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					{...styles.pillText(variant, size)}
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
	const styles = useBadgeStyles();

	return (
		<View {...props} {...styles.anchor(props)}>
			{children}
			{/* Always mounted, so a badge animated out has a parent to play its exit in. */}
			<View {...styles.badge(placement)}>
				<RingContext value>{badge}</RingContext>
			</View>
		</View>
	);
}

export const Badge = Object.assign(BadgeRoot, { Anchor: BadgeAnchor });
