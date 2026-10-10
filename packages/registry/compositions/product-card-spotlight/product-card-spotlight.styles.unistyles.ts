import { StyleSheet } from "react-native-unistyles";

export function useProductCardSpotlightStyles() {
	return {
		media: { style: styles.media },
		frame: { style: styles.frame },
		overlay: { style: styles.overlay },
	};
}

const styles = StyleSheet.create((theme) => ({
	media: {
		padding: theme.tokens.spacing[4],
		paddingBottom: 0,
	},
	// A square the product fits in, whatever the size of its file.
	frame: {
		aspectRatio: 1,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
}));
