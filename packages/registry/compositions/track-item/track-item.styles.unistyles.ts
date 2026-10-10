import { StyleSheet } from "react-native-unistyles";

const ARTWORK = 48;

export function useTrackItemStyles() {
	return {
		artwork: { style: styles.artwork },
		index: { style: styles.index },
		digits: { style: styles.digits },
		row: { style: styles.row },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	artwork: {
		width: ARTWORK,
		height: ARTWORK,
		borderRadius: theme.tokens.radius.sm,
	},
	index: {
		minWidth: 24,
		justifyContent: "center",
	},
	digits: {
		fontVariant: ["tabular-nums"],
	},
	row: {
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
