import { useTheme } from "@/theme";

import {
	FONT_WEIGHT,
	TEXT_VARIANT_TOKEN,
	textColor,
	type TextAlign,
	type TextColor,
	type TextProps,
	type TextVariant,
	type TextWeight,
} from "./text";

export function useTextStyles() {
	const { tokens, colors } = useTheme();

	return {
		text: (
			variant: TextVariant | undefined,
			color: TextColor | undefined,
			weight: TextWeight | undefined,
			align: TextAlign | undefined,
			{ style }: Pick<TextProps, "style">,
		) => ({
			style: [
				variant && tokens.typography[TEXT_VARIANT_TOKEN[variant]],
				color && { color: textColor(colors, color) },
				weight && { fontWeight: FONT_WEIGHT[weight] },
				align && { textAlign: align },
				style,
			],
		}),
	};
}
