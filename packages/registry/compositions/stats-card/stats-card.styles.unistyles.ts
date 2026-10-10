import { StyleSheet } from "react-native-unistyles";

export function useStatsCardStyles() {
	return {
		body: { style: styles.body },
		row: { style: styles.row },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	body: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
