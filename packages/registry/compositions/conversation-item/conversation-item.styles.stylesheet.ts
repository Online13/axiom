import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useConversationItemStyles() {
	const { tokens } = useTheme();

	return {
		content: { style: { gap: tokens.spacing[1] } },
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
