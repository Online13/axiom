import type { ViewStyle } from "react-native";

import { cx, useTheme, type Spacing } from "@/theme";
import { tokens } from "@/theme/tokens";

import type { CarouselPaginationProps } from "./carousel";

export function useCarouselStyles() {
	// A dot is an animated view, which takes `style` only: its color is read from the theme.
	const { colors } = useTheme();

	return {
		gap: (gap: keyof Spacing) => tokens.spacing[gap],
		// Padding at the start and end. Defaults to the screen margin.
		inset: (contentInset: keyof Spacing | undefined) =>
			contentInset === undefined
				? tokens.metrics.screenMargin
				: tokens.spacing[contentInset],
		dots: ({ className }: Pick<CarouselPaginationProps, "className">) => ({
			className: cx(
				"mt-3 flex-row items-center gap-[6px] self-center",
				className,
			),
		}),
		dot: {
			height: 6,
			borderRadius: 3,
			backgroundColor: colors.content.default,
		} satisfies ViewStyle,
	};
}
