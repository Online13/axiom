import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useStatsCardStyles() {
	const { tokens } = useTheme();

	return {
		body: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
});
