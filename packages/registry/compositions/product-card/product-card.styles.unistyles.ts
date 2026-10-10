import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function useProductCardStyles() {
	return {
		card: (withMedia: boolean, style: StyleProp<ViewStyle>) => ({
			style: [withMedia ? styles.ratio : undefined, style],
		}),
		media: { style: styles.media },
		overlay: { style: styles.overlay },
		inline: { style: styles.inline },
		price: { style: styles.price },
	};
}

const styles = StyleSheet.create((theme) => ({
	// Width:height, with media. The width comes from the caller.
	ratio: {
		aspectRatio: 3 / 4,
	},
	// Takes the height the text leaves.
	media: {
		flexGrow: 1,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
	inline: {
		alignItems: "flex-start",
	},
	price: {
		marginTop: theme.tokens.spacing[1],
	},
}));
