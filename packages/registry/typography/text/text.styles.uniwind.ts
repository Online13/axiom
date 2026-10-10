import { cx } from "@/theme";

import type {
	TextAlign,
	TextColor,
	TextProps,
	TextVariant,
	TextWeight,
} from "./text";

const VARIANT: Record<TextVariant, string> = {
	bodyLg: "text-body",
	body: "text-callout",
	bodySm: "text-subheadline",
	footnote: "text-footnote",
	caption: "text-caption",
};

const COLOR: Record<TextColor, string> = {
	default: "text-content",
	muted: "text-content-muted",
	subtle: "text-content-subtle",
	disabled: "text-content-disabled",
	inverse: "text-content-inverse",
	link: "text-content-link",
	success: "text-feedback-success",
	warning: "text-feedback-warning",
	error: "text-feedback-error",
};

const WEIGHT: Record<TextWeight, string> = {
	regular: "font-normal",
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold",
};

const ALIGN: Record<TextAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export function useTextStyles() {
	return {
		text: (
			variant: TextVariant | undefined,
			color: TextColor | undefined,
			weight: TextWeight | undefined,
			align: TextAlign | undefined,
			{ className }: Pick<TextProps, "className">,
		) => ({
			className: cx(
				variant && VARIANT[variant],
				color && COLOR[color],
				weight && WEIGHT[weight],
				align && ALIGN[align],
				className,
			),
		}),
	};
}
