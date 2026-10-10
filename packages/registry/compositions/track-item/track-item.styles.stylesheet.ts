import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const ARTWORK = 48;

export function useTrackItemStyles() {
	const { tokens } = useTheme();

	return {
		artwork: {
			style: [styles.artwork, { borderRadius: tokens.radius.sm }],
		},
		index: { style: styles.index },
		digits: { style: styles.digits },
		row: { style: [styles.row, { gap: tokens.spacing[1] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	artwork: {
		width: ARTWORK,
		height: ARTWORK,
	},
	index: {
		minWidth: 24,
		justifyContent: "center",
	},
	digits: {
		fontVariant: ["tabular-nums"],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
});
