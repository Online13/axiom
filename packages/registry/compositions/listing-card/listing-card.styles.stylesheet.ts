import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useListingCardStyles() {
	const { tokens } = useTheme();

	return {
		photo: { style: styles.photo },
		mediaOverlay: {
			style: [styles.mediaOverlay, { padding: tokens.spacing[3] }],
		},
		heading: { style: [styles.heading, { gap: tokens.spacing[2] }] },
		title: { style: styles.title },
		section: { style: { gap: tokens.spacing[3] } },
		specs: { style: styles.specs },
		spec: { style: [styles.spec, { gap: tokens.spacing[1] }] },
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
	heading: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	title: {
		flex: 1,
	},
	specs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
});
