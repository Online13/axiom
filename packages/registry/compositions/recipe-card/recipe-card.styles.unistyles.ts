import { StyleSheet } from "react-native-unistyles";

export function useRecipeCardStyles() {
	return {
		section: { style: styles.section },
		stats: { style: styles.stats },
		stat: { style: styles.stat },
		ingredients: { style: styles.ingredients },
	};
}

const styles = StyleSheet.create((theme) => ({
	section: {
		gap: theme.tokens.spacing[3],
	},

	stats: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	stat: {
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
	ingredients: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		flexWrap: "wrap",
	},
}));
