import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function usePricingCardToggleStyles() {
	return {
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			style: [featured && styles.featured, style],
		}),
		header: { style: styles.header },
		plan: { style: styles.plan },
		row: { style: styles.row },
		prices: { style: styles.prices },
		price: { style: styles.price },
		struck: { style: styles.struck },
		center: { style: styles.center },
		features: { style: styles.features },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	featured: {
		borderWidth: 2,
		borderColor: theme.colors.primary.default,
	},
	header: {
		gap: theme.tokens.spacing[3],
	},
	plan: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	prices: {
		flexDirection: "row",
		alignItems: "baseline",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[2],
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: theme.tokens.spacing[1],
	},
	struck: {
		textDecorationLine: "line-through",
	},
	center: {
		alignSelf: "center",
	},
	features: {
		gap: theme.tokens.spacing[2],
	},
	grow: {
		flex: 1,
	},
}));
