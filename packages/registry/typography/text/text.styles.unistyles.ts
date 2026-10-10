import { StyleSheet } from "react-native-unistyles";

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
	return {
		text: (
			variant: TextVariant | undefined,
			color: TextColor | undefined,
			weight: TextWeight | undefined,
			align: TextAlign | undefined,
			{ style }: Pick<TextProps, "style">,
		) => ({ style: [styles.text(variant, color, weight, align), style] }),
	};
}

const styles = StyleSheet.create((theme) => ({
	// A missing variant or color means "inherit from the Text above": the property is left out.
	text: (
		variant: TextVariant | undefined,
		color: TextColor | undefined,
		weight: TextWeight | undefined,
		align: TextAlign | undefined,
	) => ({
		...(variant && theme.tokens.typography[TEXT_VARIANT_TOKEN[variant]]),
		...(color && { color: textColor(theme.colors, color) }),
		...(weight && { fontWeight: FONT_WEIGHT[weight] }),
		...(align && { textAlign: align }),
	}),
}));
