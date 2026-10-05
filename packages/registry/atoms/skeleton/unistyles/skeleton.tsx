import type { ComponentPropsWithRef, ReactNode } from "react";
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
	const animation = useSkeleton(variant, loading);

	if (!loading) return <>{children}</>;

	const Container = animation === "pulse" ? SkeletonPulse : View;

	return (
		<Container
			{...props}
			// Placeholders say nothing: announce the loading state once on their container.
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={[styles.block(width, height, radius), style]}
		>
			{animation === "shimmer" ? <SkeletonShimmer /> : null}
		</Container>
	);
}

/** Only mounted for `pulse`: other placeholders build no animated style. */
function SkeletonPulse({ style, ...props }: ComponentPropsWithRef<typeof View>) {
	const pulseStyle = usePulseStyle();
	return <Animated.View {...props} style={[style, pulseStyle]} />;
}

/** Only mounted for `shimmer`. Fills the placeholder to measure the width the band crosses. */
function SkeletonShimmer() {
	const { style, onLayout } = useShimmer();
	return (
		<View style={styles.fill} onLayout={onLayout}>
			<Animated.View style={[styles.band, style]} />
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
	if (!loading) return <>{children}</>;

	return (
		<View {...props} style={style}>
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
	fill: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
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
