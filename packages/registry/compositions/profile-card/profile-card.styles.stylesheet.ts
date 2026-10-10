import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useProfileCardStyles() {
	const { tokens } = useTheme();

	return {
		header: { style: [styles.center, { gap: tokens.spacing[3] }] },
		identity: { style: [styles.center, { gap: tokens.spacing[1] }] },
		stats: { style: styles.stats },
		stat: { style: [styles.stat, { gap: tokens.spacing[1] }] },
		actions: { style: [styles.actions, { gap: tokens.spacing[2] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	center: {
		alignItems: "center",
	},
	stats: {
		flexDirection: "row",
	},
	stat: {
		flex: 1,
		alignItems: "center",
	},
	actions: {
		flexDirection: "row",
	},
	grow: {
		flex: 1,
	},
});
