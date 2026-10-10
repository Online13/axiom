import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";

// The icon takes its color as a prop, not as a style: mapped from the theme through `uniProps`.
export const PricingCardHeroIcon = withUnistyles(Icon);

export function usePricingCardHeroStyles() {
	return {
		card: (style: StyleProp<ViewStyle>) => ({ style: [styles.card, style] }),
		header: { style: styles.header },
		row: { style: styles.row },
		label: { style: [styles.grow, styles.on] },
		price: { style: styles.price },
		on: { style: styles.on },
		onMuted: { style: styles.onMuted },
		features: { style: styles.features },
		tint: {
			uniProps: (theme: Theme) => ({ color: theme.colors.primary.on }),
		},
		button: { style: styles.button },
		buttonLabel: { style: styles.buttonLabel },
	};
}

const styles = StyleSheet.create((theme) => ({
	card: {
		backgroundColor: theme.colors.primary.default,
	},
	header: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: theme.tokens.spacing[1],
	},
	on: {
		color: theme.colors.primary.on,
	},
	onMuted: {
		color: theme.colors.primary.on,
		opacity: 0.72,
	},
	features: {
		gap: theme.tokens.spacing[2],
	},
	button: {
		backgroundColor: theme.colors.primary.on,
	},
	buttonLabel: {
		color: theme.colors.primary.default,
		fontWeight: FONT_WEIGHT.semibold,
	},
	grow: {
		flex: 1,
	},
}));
