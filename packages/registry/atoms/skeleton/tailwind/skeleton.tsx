import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	View,
	type DimensionValue,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { TEXT_VARIANT_TOKEN, type TextVariant } from "@/components/ui/text";
import { useTheme, type Radius } from "@/theme";

import {
	usePulseStyle,
	useShimmer,
	useSkeleton,
	type SkeletonAnimation,
} from "../use-skeleton";

export type SkeletonProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
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
	...props
}: SkeletonProps) {
	const { tokens, components } = useTheme();
	const animation = useSkeleton(variant, loading);

	if (!loading) return <>{children}</>;

	const colors = components.skeleton.default.default;
	const Container = animation === "pulse" ? SkeletonPulse : View;

	return (
		<Container
			{...props}
			// Placeholders say nothing: announce the loading state once on their container.
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			// `Container` can be an animated view, which takes no `className`.
			style={[
				{
					overflow: "hidden",
					width,
					height,
					borderRadius: tokens.radius[radius],
					backgroundColor: colors.background,
				},
				style,
			]}
		>
			{animation === "shimmer" ? (
				<SkeletonShimmer color={colors.highlight} />
			) : null}
		</Container>
	);
}

/** Only mounted for `pulse`: other placeholders build no animated style. */
function SkeletonPulse({
	style,
	...props
}: ComponentPropsWithRef<typeof View>) {
	const pulseStyle = usePulseStyle();
	return <Animated.View {...props} style={[style, pulseStyle]} />;
}

/** Only mounted for `shimmer`. Fills the placeholder to measure the width the band crosses. */
function SkeletonShimmer({ color }: { color: string }) {
	const { style, onLayout } = useShimmer();
	return (
		<View className="absolute inset-0" onLayout={onLayout}>
			<Animated.View
				style={[
					{ position: "absolute", top: 0, bottom: 0, left: 0 },
					// Soft edges: the band fades in and out instead of showing a hard rectangle.
					{
						experimental_backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
					},
					style,
				]}
			/>
		</View>
	);
}

export type SkeletonTextProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	lines?: number;
	/** Uses the line height of this Text variant. */
	variant?: TextVariant;
	animation?: SkeletonAnimation;
	/** When `false`, renders `children` instead of the placeholder. */
	loading?: boolean;
	children?: ReactNode;
};

function SkeletonText({
	lines = 3,
	variant = "body",
	animation,
	loading = true,
	children,
	style,
	...props
}: SkeletonTextProps) {
	const { tokens } = useTheme();
	if (!loading) return <>{children}</>;
	const { fontSize, lineHeight } =
		tokens.typography[TEXT_VARIANT_TOKEN[variant]];

	return (
		<View {...props} style={style}>
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
