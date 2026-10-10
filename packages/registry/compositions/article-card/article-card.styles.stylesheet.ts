import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useArticleCardStyles() {
	const { tokens } = useTheme();

	return {
		header: { style: { gap: tokens.spacing[2] } },
		category: { style: styles.category },
		byline: { style: [styles.row, { gap: tokens.spacing[3] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	category: {
		textTransform: "uppercase",
		letterSpacing: 0.6,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
});
