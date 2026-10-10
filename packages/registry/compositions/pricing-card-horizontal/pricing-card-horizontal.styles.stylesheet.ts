import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

export function usePricingCardHorizontalStyles() {
	const { tokens, colors } = useTheme();

	return {
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			style: [
				styles.card,
				{ gap: tokens.spacing[5] },
				featured
					? { borderWidth: 2, borderColor: colors.primary.default }
					: undefined,
				style,
			],
		}),
		plan: { style: [styles.grow, { gap: tokens.spacing[3] }] },
		heading: { style: { gap: tokens.spacing[1] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		features: {
			style: [
				styles.features,
				{ columnGap: tokens.spacing[4], rowGap: tokens.spacing[2] },
			],
		},
		side: {
			style: [
				styles.side,
				{
					gap: tokens.spacing[3],
					paddingLeft: tokens.spacing[5],
					borderLeftWidth: tokens.metrics.hairline,
					borderLeftColor: colors.border.default,
				},
			],
		},
		end: { style: styles.end },
		shrink: { style: styles.shrink },
	};
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	features: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	side: {
		alignItems: "flex-end",
		justifyContent: "space-between",
	},
	end: {
		alignItems: "flex-end",
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
});
