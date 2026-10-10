import { useTheme, type TypographyVariant } from "@/theme";

import type { TitleAlign, TitleColor, TitleProps, TitleVariant } from "./title";

const VARIANT_TOKEN: Record<TitleVariant, TypographyVariant> = {
	display: "largeTitle",
	headingLg: "title1",
	heading: "title2",
	headingSm: "title3",
	subheading: "headline",
};

export function useTitleStyles() {
	const { tokens, colors } = useTheme();

	return {
		title: (
			variant: TitleVariant,
			color: TitleColor,
			align: TitleAlign | undefined,
			{ style }: Pick<TitleProps, "style">,
		) => ({
			style: [
				tokens.typography[VARIANT_TOKEN[variant]],
				{ color: colors.content[color] },
				align && { textAlign: align },
				style,
			],
		}),
	};
}
