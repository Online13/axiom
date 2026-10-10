import { StyleSheet } from "react-native";

import { useTheme, type Spacing } from "@/theme";

import type { CarouselPaginationProps } from "./carousel";

export function useCarouselStyles() {
	const { tokens, colors } = useTheme();

	return {
		gap: (gap: keyof Spacing) => tokens.spacing[gap],
		// Padding at the start and end. Defaults to the screen margin.
		inset: (contentInset: keyof Spacing | undefined) =>
			contentInset === undefined
				? tokens.metrics.screenMargin
				: tokens.spacing[contentInset],
		dots: ({ style }: Pick<CarouselPaginationProps, "style">) => ({
			style: [
				styles.dots,
				{ gap: tokens.spacing[1] + 2, marginTop: tokens.spacing[3] },
				style,
			],
		}),
		dot: [styles.dot, { backgroundColor: colors.content.default }],
	};
}

const styles = StyleSheet.create({
	dots: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	dot: {
		height: 6,
		borderRadius: 3,
	},
});
