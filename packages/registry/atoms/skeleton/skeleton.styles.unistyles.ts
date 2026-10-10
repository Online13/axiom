import type { DimensionValue } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { TEXT_VARIANT_TOKEN, type TextVariant } from "@/components/ui/text";
import type { Radius } from "@/theme";

import type { SkeletonProps } from "./skeleton";

export function useSkeletonStyles() {
	return {
		block: (
			width: DimensionValue,
			height: DimensionValue,
			radius: keyof Radius,
			{ style }: Pick<SkeletonProps, "style">,
		) => ({ style: [styles.block(width, height, radius), style] }),
		fill: { style: styles.fill },
		band: styles.band,
		line: (variant: TextVariant) => styles.line(variant),
	};
}

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
