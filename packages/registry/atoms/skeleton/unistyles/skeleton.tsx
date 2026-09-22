import type { ReactNode } from "react";
import {
	View,
	type DimensionValue,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { TEXT_VARIANT_TOKEN, type TextVariant } from "@/components/ui/text";
import type { Radius } from "@/theme";

import { useSkeleton, type SkeletonAnimation } from "../use-skeleton";

export type SkeletonProps = {
	width?: DimensionValue;
	height?: DimensionValue;
	radius?: keyof Radius;
	/** Reduce Motion forces `none`. */
	variant?: SkeletonAnimation;
	/** When `false`, renders `children` instead of the placeholder. */
	loading?: boolean;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function SkeletonBlock({
	width = "100%",
	height = 16,
	radius = "sm",
	variant = "shimmer",
	loading = true,
	children,
	style,
}: SkeletonProps) {
	const { animation, pulseStyle, shimmerStyle, onLayout } = useSkeleton(
		variant,
		loading,
	);

	if (!loading) return <>{children}</>;

	return (
		<Animated.View
			// Placeholders say nothing: announce the loading state once on their container.
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			onLayout={onLayout}
			style={[styles.block(width, height, radius), style, pulseStyle]}
		>
			{animation === "shimmer" ? (
				<Animated.View style={[styles.band, shimmerStyle]} />
			) : null}
		</Animated.View>
	);
}

export type SkeletonTextProps = Omit<
	SkeletonProps,
	"width" | "height" | "radius" | "variant"
> & {
	lines?: number;
	/** Uses the line height of this Text variant. */
	variant?: TextVariant;
	animation?: SkeletonAnimation;
};

function SkeletonText({
	lines = 3,
	variant = "body",
	animation,
	loading = true,
	children,
	style,
}: SkeletonTextProps) {
	if (!loading) return <>{children}</>;

	return (
		<View style={style}>
			{Array.from({ length: lines }, (_, i) => (
				<SkeletonBlock
					key={i}
					variant={animation}
					// The line takes the height of the text it stands in for, centered on its line box.
					style={styles.line(variant)}
					// The last line is shorter, like the end of a paragraph.
					width={i === lines - 1 && lines > 1 ? "60%" : "100%"}
				/>
			))}
		</View>
	);
}

export const Skeleton = Object.assign(SkeletonBlock, { Text: SkeletonText });

const styles = StyleSheet.create((theme) => ({
	block: (
		width: DimensionValue,
		height: DimensionValue,
		radius: keyof Radius,
	) => ({
		overflow: "hidden",
		width,
		height,
		borderRadius: theme.tokens.radius[radius],
		backgroundColor: theme.components.skeleton.default.default.background,
	}),
	// Soft edges: the band fades in and out instead of showing a hard rectangle.
	band: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		experimental_backgroundImage: `linear-gradient(90deg, transparent, ${theme.components.skeleton.default.default.highlight}, transparent)`,
	},
	line: (variant: TextVariant) => {
		const { fontSize, lineHeight } =
			theme.tokens.typography[TEXT_VARIANT_TOKEN[variant]];
		return {
			height: fontSize,
			marginVertical: (lineHeight - fontSize) / 2,
		};
	},
}));
