import { StyleSheet } from "react-native-unistyles";

export function useProfileCardStyles() {
	return {
		header: { style: styles.header },
		identity: { style: styles.identity },
		stats: { style: styles.stats },
		stat: { style: styles.stat },
		actions: { style: styles.actions },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[3],
		alignItems: "center",
	},
	identity: {
		gap: theme.tokens.spacing[1],
		alignItems: "center",
	},

	stats: {
		flexDirection: "row",
	},
	stat: {
		gap: theme.tokens.spacing[1],
		flex: 1,
		alignItems: "center",
	},

	actions: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
	},
	grow: {
		flex: 1,
	},
}));
