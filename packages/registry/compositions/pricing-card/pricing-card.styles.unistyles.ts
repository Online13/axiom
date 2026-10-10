import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function usePricingCardStyles() {
	return {
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			style: [featured && styles.featured, style],
		}),
		header: { style: styles.header },
		row: { style: styles.row },
		price: { style: styles.price },
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
		gap: theme.tokens.spacing[2],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	price: {
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "baseline",
	},
	features: {
		gap: theme.tokens.spacing[2],
	},
	grow: {
		flex: 1,
	},
}));
