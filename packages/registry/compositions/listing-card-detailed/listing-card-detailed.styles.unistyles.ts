import { StyleSheet } from "react-native-unistyles";

export function useListingCardDetailedStyles() {
	return {
		photo: { style: styles.photo },
		mediaOverlay: { style: styles.mediaOverlay },
		priceRow: { style: styles.priceRow },
		section: { style: styles.section },
		specs: { style: styles.specs },
		spec: { style: styles.spec },
		agent: { style: styles.agent },
		grow: { style: styles.grow },
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
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	agent: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},

	mediaOverlay: {
		padding: theme.tokens.spacing[3],
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	grow: {
		flex: 1,
	},
	specs: {
		gap: theme.tokens.spacing[4],
		flexDirection: "row",
	},
}));
