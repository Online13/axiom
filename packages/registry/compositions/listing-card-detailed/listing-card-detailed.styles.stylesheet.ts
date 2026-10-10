import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useListingCardDetailedStyles() {
	const { tokens } = useTheme();

	return {
		photo: { style: styles.photo },
		mediaOverlay: {
			style: [styles.mediaOverlay, { padding: tokens.spacing[3] }],
		},
		priceRow: { style: [styles.row, { gap: tokens.spacing[1] }] },
		section: { style: { gap: tokens.spacing[3] } },
		specs: { style: [styles.specs, { gap: tokens.spacing[4] }] },
		spec: { style: [styles.row, { gap: tokens.spacing[1] }] },
		agent: { style: [styles.row, { gap: tokens.spacing[2] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	photo: {
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	specs: {
		flexDirection: "row",
	},
});
