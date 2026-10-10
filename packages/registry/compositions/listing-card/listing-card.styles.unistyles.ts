import { StyleSheet } from "react-native-unistyles";

export function useListingCardStyles() {
	return {
		photo: { style: styles.photo },
		mediaOverlay: { style: styles.mediaOverlay },
		heading: { style: styles.heading },
		title: { style: styles.title },
		section: { style: styles.section },
		specs: { style: styles.specs },
		spec: { style: styles.spec },
	};
}

const styles = StyleSheet.create((theme) => ({
	photo: {
		width: "100%",
		height: "100%",
	},
	section: {
		gap: theme.tokens.spacing[3],
	},

	mediaOverlay: {
		padding: theme.tokens.spacing[3],
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	heading: {
		gap: theme.tokens.spacing[2],
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
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
}));
