import { useEffect, type ReactElement, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type BadgeVariant =
	| "neutral"
	| "accent"
	| "info"
	| "success"
	| "warning"
	| "error"
	| "outline"
	| "inverse";

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
	size?: "sm" | "md";
	/** For counters, what is counted: "3 unread notifications". */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = { sm: 18, md: 22 };
const DOT = 10;

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
	const { tokens, components } = useTheme();
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

		return (
			<View
				accessible={accessibilityLabel !== undefined}
				accessibilityLabel={accessibilityLabel}
				style={[
					styles.center,
					label === undefined
						? { width: DOT, height: DOT, borderRadius: DOT / 2 }
						: {
								minWidth: height,
								minHeight: height,
								borderRadius: tokens.radius.full,
								paddingHorizontal: tokens.spacing[1],
							},
					{ backgroundColor: colors.background },
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

export type BadgeAnchorProps = {
	/** The element to decorate: an IconButton, an Avatar. */
	children: ReactNode;
	/** A `count` or `dot` badge. */
	badge: ReactElement<BadgeProps>;
	placement?: "top-right" | "bottom-right";
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
	const { components } = useTheme();
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
			<Animated.View
				style={[
					styles.badge,
					placement === "top-right" ? styles.top : styles.bottom,
					// The ring detaches the badge from the element under it.
					{ borderColor: components.badge.count.default.border },
					animatedStyle,
				]}
			>
				{badge}
			</Animated.View>
		</View>
	);
}

export const Badge = Object.assign(BadgeRoot, { Anchor: BadgeAnchor });

const RING = 2;

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
	badge: {
		position: "absolute",
		pointerEvents: "none",
		right: -RING,
		borderWidth: RING,
		borderRadius: 9999,
	},
	top: {
		top: -RING,
	},
	bottom: {
		bottom: -RING,
	},
});
