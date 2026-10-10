import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme } from "@/theme";

// The icon takes its color as a prop.
export const PricingCardHeroIcon = Icon;

// Everything is drawn on the primary color: the texts take its `on` color.
export function usePricingCardHeroStyles() {
	const { tokens, colors } = useTheme();

	return {
		card: (style: StyleProp<ViewStyle>) => ({
			style: [{ backgroundColor: colors.primary.default }, style],
		}),
		header: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		label: { style: [styles.grow, { color: colors.primary.on }] },
		price: { style: [styles.price, { gap: tokens.spacing[1] }] },
		on: { style: { color: colors.primary.on } },
		onMuted: { style: { color: colors.primary.on, opacity: 0.72 } },
		features: { style: { gap: tokens.spacing[2] } },
		tint: { color: colors.primary.on },
		// The solid button inverted: the primary text on the `on` color.
		button: { style: { backgroundColor: colors.primary.on } },
		buttonLabel: {
			style: {
				color: colors.primary.default,
				fontWeight: FONT_WEIGHT.semibold,
			},
		},
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	grow: {
		flex: 1,
	},
});
