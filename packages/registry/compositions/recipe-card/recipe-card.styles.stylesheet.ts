import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useRecipeCardStyles() {
	const { tokens } = useTheme();

	return {
		section: { style: { gap: tokens.spacing[3] } },
		stats: { style: styles.stats },
		stat: { style: [styles.stat, { gap: tokens.spacing[1] }] },
		ingredients: {
			style: [styles.ingredients, { gap: tokens.spacing[2] }],
		},
	};
}

const styles = StyleSheet.create({
	stats: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	stat: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
	ingredients: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
});
