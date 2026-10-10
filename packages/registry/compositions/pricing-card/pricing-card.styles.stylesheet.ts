import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

export function usePricingCardStyles() {
	const { tokens, colors } = useTheme();

	return {
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			style: [
				featured
					? { borderWidth: 2, borderColor: colors.primary.default }
					: undefined,
				style,
			],
		}),
		header: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		price: { style: [styles.price, { gap: tokens.spacing[1] }] },
		features: { style: { gap: tokens.spacing[2] } },
		grow: { style: styles.grow },
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
