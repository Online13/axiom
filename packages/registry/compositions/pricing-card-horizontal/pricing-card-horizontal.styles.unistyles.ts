import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function usePricingCardHorizontalStyles() {
	return {
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			style: [styles.card, featured && styles.featured, style],
		}),
		plan: { style: styles.plan },
		heading: { style: styles.heading },
		row: { style: styles.row },
		features: { style: styles.features },
		side: { style: styles.side },
		end: { style: styles.end },
		shrink: { style: styles.shrink },
	};
}

const styles = StyleSheet.create((theme) => ({
	card: {
		flexDirection: "row",
		gap: theme.tokens.spacing[5],
	},
	featured: {
		borderWidth: 2,
		borderColor: theme.colors.primary.default,
	},
	plan: {
		flex: 1,
		gap: theme.tokens.spacing[3],
	},
	heading: {
		gap: theme.tokens.spacing[1],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	features: {
		flexDirection: "row",
		flexWrap: "wrap",
		columnGap: theme.tokens.spacing[4],
		rowGap: theme.tokens.spacing[2],
	},
	side: {
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: theme.tokens.spacing[3],
		paddingLeft: theme.tokens.spacing[5],
		borderLeftWidth: theme.tokens.metrics.hairline,
		borderLeftColor: theme.colors.border.default,
	},
	end: {
		alignItems: "flex-end",
	},
	shrink: {
		flexShrink: 1,
	},
}));
