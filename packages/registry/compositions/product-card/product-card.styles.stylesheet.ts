import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

export function useProductCardStyles() {
	const { tokens } = useTheme();

	return {
		card: (withMedia: boolean, style: StyleProp<ViewStyle>) => ({
			style: [withMedia ? styles.ratio : undefined, style],
		}),
		media: { style: styles.media },
		overlay: { style: [styles.overlay, { padding: tokens.spacing[3] }] },
		inline: { style: styles.inline },
		price: { style: { marginTop: tokens.spacing[1] } },
	};
}

const styles = StyleSheet.create({
	// Width:height, with media. The width comes from the caller.
	ratio: {
		aspectRatio: 3 / 4,
	},
	// Takes the height the text leaves.
	media: {
		flexGrow: 1,
	},
	overlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
	},
	inline: {
		alignItems: "flex-start",
	},
});
