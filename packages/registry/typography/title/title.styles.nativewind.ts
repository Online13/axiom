import { cx } from "@/theme";

import type { TitleAlign, TitleColor, TitleProps, TitleVariant } from "./title";

const VARIANT: Record<TitleVariant, string> = {
	display: "text-large-title",
	headingLg: "text-title1",
	heading: "text-title2",
	headingSm: "text-title3",
	subheading: "text-headline",
};

const COLOR: Record<TitleColor, string> = {
	default: "text-content",
	muted: "text-content-muted",
	inverse: "text-content-inverse",
};

const ALIGN: Record<TitleAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export function useTitleStyles() {
	return {
		title: (
			variant: TitleVariant,
			color: TitleColor,
			align: TitleAlign | undefined,
			{ className }: Pick<TitleProps, "className">,
		) => ({
			className: cx(
				VARIANT[variant],
				COLOR[color],
				align && ALIGN[align],
				className,
			),
		}),
	};
}
