import type { ReactNode } from "react";
import {
	StyleSheet,
	View,
	type DimensionValue,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { TEXT_VARIANT_TOKEN, type TextVariant } from "@/components/ui/text";
import { useTheme, type Radius } from "@/theme";

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
	const { tokens, components } = useTheme();
	const { animation, pulseStyle, shimmerStyle, onLayout } = useSkeleton(
		variant,
		loading,
	);

	if (!loading) return <>{children}</>;

	const colors = components.skeleton.default.default;

	return (
		<Animated.View
			// Placeholders say nothing: announce the loading state once on their container.
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			onLayout={onLayout}
			style={[
				styles.block,
				{
					width,
					height,
					borderRadius: tokens.radius[radius],
					backgroundColor: colors.background,
				},
				style,
				pulseStyle,
			]}
		>
			{animation === "shimmer" ? (
				<Animated.View
					style={[
						styles.band,
						// Soft edges: the band fades in and out instead of showing a hard rectangle.
						{
							experimental_backgroundImage: `linear-gradient(90deg, transparent, ${colors.highlight}, transparent)`,
						},
						shimmerStyle,
					]}
				/>
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
	const { tokens } = useTheme();
	if (!loading) return <>{children}</>;
	const { fontSize, lineHeight } =
		tokens.typography[TEXT_VARIANT_TOKEN[variant]];

	return (
		<View style={style}>
			{Array.from({ length: lines }, (_, i) => (
				<SkeletonBlock
					key={i}
					variant={animation}
					height={fontSize}
					// The last line is shorter, like the end of a paragraph.
					width={i === lines - 1 && lines > 1 ? "60%" : "100%"}
					style={{ marginVertical: (lineHeight - fontSize) / 2 }}
				/>
			))}
		</View>
	);
}

export const Skeleton = Object.assign(SkeletonBlock, { Text: SkeletonText });

const styles = StyleSheet.create({
	block: {
		overflow: "hidden",
	},
	band: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
	},
});
