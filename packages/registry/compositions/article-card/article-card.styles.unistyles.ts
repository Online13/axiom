import { StyleSheet } from "react-native-unistyles";

export function useArticleCardStyles() {
	return {
		header: { style: styles.header },
		category: { style: styles.category },
		byline: { style: styles.byline },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[2],
	},
	category: {
		textTransform: "uppercase",
		letterSpacing: 0.6,
	},

	byline: {
		gap: theme.tokens.spacing[3],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
