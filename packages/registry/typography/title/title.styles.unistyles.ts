import { StyleSheet } from "react-native-unistyles";

import type { TypographyVariant } from "@/theme";

import type { TitleAlign, TitleColor, TitleProps, TitleVariant } from "./title";

const VARIANT_TOKEN: Record<TitleVariant, TypographyVariant> = {
	display: "largeTitle",
	headingLg: "title1",
	heading: "title2",
	headingSm: "title3",
	subheading: "headline",
};

export function useTitleStyles() {
	return {
		title: (
			variant: TitleVariant,
			color: TitleColor,
			align: TitleAlign | undefined,
			{ style }: Pick<TitleProps, "style">,
		) => ({ style: [styles.title(variant, color, align), style] }),
	};
}

const styles = StyleSheet.create((theme) => ({
	title: (
		variant: TitleVariant,
		color: TitleColor,
		align: TitleAlign | undefined,
	) => ({
		...theme.tokens.typography[VARIANT_TOKEN[variant]],
		color: theme.colors.content[color],
		...(align && { textAlign: align }),
	}),
}));
