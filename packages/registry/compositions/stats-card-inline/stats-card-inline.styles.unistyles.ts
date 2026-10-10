import { StyleSheet } from "react-native-unistyles";

const TILE = 32;

export function useStatsCardInlineStyles() {
	return {
		row: { style: styles.row },
		tile: (onFilled: boolean) => ({ style: styles.tile(onFilled) }),
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	tile: (onFilled: boolean) => ({
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.sm,
		// Stands out from the card: the page color on a filled card, the filled color otherwise.
		backgroundColor: onFilled
			? theme.colors.background.default
			: theme.colors.background.subtle,
	}),
	grow: {
		flex: 1,
	},
}));
