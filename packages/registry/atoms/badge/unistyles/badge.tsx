import { useEffect, type ReactElement, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";

export type BadgeVariant =
	| "neutral"
	| "accent"
	| "info"
	| "success"
	| "warning"
	| "error"
	| "outline"
	| "inverse";
export type BadgeSize = "sm" | "md";
export type BadgePlacement = "top-right" | "bottom-right";

export type BadgeProps = {
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
	/** For counters, what is counted: "3 unread notifications". */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = { sm: 18, md: 22 };
const DOT = 10;

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

function BadgeRoot({
	children,
	variant = "neutral",
	dot = false,
	icon,
	count,
	max = 99,
	size = "md",
	accessibilityLabel,
	style,
}: BadgeProps) {
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
				accessible={accessibilityLabel !== undefined}
				accessibilityLabel={accessibilityLabel}
				style={[styles.counter(size, label !== undefined), style]}
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
			accessible={accessibilityLabel !== undefined}
			accessibilityLabel={accessibilityLabel}
			style={[styles.pill(variant, size), style]}
		>
			{icon ? (
				<ThemedIcon
					name={icon}
					size={size === "sm" ? 12 : 14}
					uniProps={(theme) => ({
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

export type BadgeAnchorProps = {
	/** The element to decorate: an IconButton, an Avatar. */
	children: ReactNode;
	/** A `count` or `dot` badge. */
	badge: ReactElement<BadgeProps>;
	placement?: BadgePlacement;
	/** Hides the badge with an animation, without unmounting. */
	invisible?: boolean;
	style?: StyleProp<ViewStyle>;
};

function BadgeAnchor({
	children,
	badge,
	placement = "top-right",
	invisible = false,
	style,
}: BadgeAnchorProps) {
	const progress = useSharedValue(invisible ? 0 : 1);

	useEffect(() => {
		progress.value = withTiming(invisible ? 0 : 1, { duration: 150 });
	}, [invisible, progress]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [{ scale: progress.value }],
	}));

	return (
		<View style={[styles.anchor, style]}>
			{children}
			<Animated.View style={[styles.badge(placement), animatedStyle]}>
				{badge}
			</Animated.View>
		</View>
	);
}

export const Badge = Object.assign(BadgeRoot, { Anchor: BadgeAnchor });

const RING = 2;

const styles = StyleSheet.create((theme) => ({
	counter: (size: BadgeSize, labelled: boolean) => ({
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.components.badge.count.default.background,
		...(labelled
			? {
					minWidth: HEIGHT[size],
					minHeight: HEIGHT[size],
					borderRadius: theme.tokens.radius.full,
					paddingHorizontal: theme.tokens.spacing[1],
				}
			: { width: DOT, height: DOT, borderRadius: DOT / 2 }),
	}),
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
	badge: (placement: BadgePlacement) => ({
		position: "absolute",
		pointerEvents: "none",
		right: -RING,
		borderWidth: RING,
		borderRadius: 9999,
		// The ring detaches the badge from the element under it.
		borderColor: theme.components.badge.count.default.border,
		...(placement === "top-right" ? { top: -RING } : { bottom: -RING }),
	}),
}));
