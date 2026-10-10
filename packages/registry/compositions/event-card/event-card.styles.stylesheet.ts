import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useEventCardStyles() {
	const { tokens, colors } = useTheme();

	return {
		date: {
			style: [
				styles.date,
				{
					minWidth: tokens.sizes.control.lg,
					paddingVertical: tokens.spacing[1],
					paddingHorizontal: tokens.spacing[2],
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background.elevated,
				},
			],
		},
		month: { style: styles.month },
		header: { style: { gap: tokens.spacing[2] } },
		detail: { style: [styles.row, { gap: tokens.spacing[2] }] },
		footer: { style: { gap: tokens.spacing[3] } },
		attendees: {
			style: [styles.row, styles.grow, { gap: tokens.spacing[2] }],
		},
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	date: {
		alignItems: "center",
	},
	month: {
		textTransform: "uppercase",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
});
