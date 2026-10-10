import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const TILE = 32;

export function useStatsCardInlineStyles() {
	const { tokens, colors } = useTheme();

	return {
		row: { style: [styles.row, { gap: tokens.spacing[3] }] },
		// Stands out from the card: the page color on a filled card, the filled color otherwise.
		tile: (onFilled: boolean) => ({
			style: [
				styles.tile,
				{
					borderRadius: tokens.radius.sm,
					backgroundColor: onFilled
						? colors.background.default
						: colors.background.subtle,
				},
			],
		}),
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	tile: {
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
	},
	grow: {
		flex: 1,
	},
});
