import { StyleSheet, type DimensionValue, type ViewStyle } from "react-native";

import { TEXT_VARIANT_TOKEN, type TextVariant } from "@/components/ui/text";
import { useTheme, type Radius } from "@/theme";

import type { SkeletonProps } from "./skeleton";

export function useSkeletonStyles() {
	const { tokens, components } = useTheme();

	return {
		block: (
			width: DimensionValue,
			height: DimensionValue,
			radius: keyof Radius,
			{ style }: Pick<SkeletonProps, "style">,
		) => ({
			style: [
				styles.block,
				{
					width,
					height,
					borderRadius: tokens.radius[radius],
					backgroundColor: components.skeleton.default.default.background,
				},
				style,
			],
		}),
		fill: { style: styles.fill },
		band: [
			styles.band,
			// Soft edges: the band fades in and out instead of showing a hard rectangle.
			{
				experimental_backgroundImage: `linear-gradient(90deg, transparent, ${components.skeleton.default.default.highlight}, transparent)`,
			},
		],
		line: (variant: TextVariant) =>
			({
				height: tokens.typography[TEXT_VARIANT_TOKEN[variant]].fontSize,
				marginVertical:
					(tokens.typography[TEXT_VARIANT_TOKEN[variant]].lineHeight -
						tokens.typography[TEXT_VARIANT_TOKEN[variant]].fontSize) /
					2,
			}) satisfies ViewStyle,
	};
}

const styles = StyleSheet.create({
	block: {
		overflow: "hidden",
	},
	fill: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	band: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
	},
});
