import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Spacing } from "@/theme";

import type { CarouselPaginationProps } from "./carousel";

export function useCarouselStyles() {
	// The carousel's hook and `getItemLayout` measure in plain numbers, so the spacing tokens are
	// read here rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();

	return {
		gap: (gap: keyof Spacing) => theme.tokens.spacing[gap],
		inset: (contentInset: keyof Spacing | undefined) =>
			contentInset === undefined
				? theme.tokens.metrics.screenMargin
				: theme.tokens.spacing[contentInset],
		dots: ({ style }: Pick<CarouselPaginationProps, "style">) => ({
			style: [styles.dots, style],
		}),
		dot: styles.dot,
	};
}

const styles = StyleSheet.create((theme) => ({
	dots: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
		gap: theme.tokens.spacing[1] + 2,
		marginTop: theme.tokens.spacing[3],
	},
	dot: {
		height: 6,
		borderRadius: 3,
		backgroundColor: theme.colors.content.default,
	},
}));
