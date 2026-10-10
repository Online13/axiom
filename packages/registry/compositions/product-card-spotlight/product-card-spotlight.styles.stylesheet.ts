import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function useProductCardSpotlightStyles() {
	const { tokens } = useTheme();

	return {
		media: { style: { padding: tokens.spacing[4], paddingBottom: 0 } },
		frame: { style: styles.frame },
		overlay: { style: [styles.overlay, { padding: tokens.spacing[3] }] },
	};
}

const styles = StyleSheet.create({
	// A square the product fits in, whatever the size of its file.
	frame: {
		aspectRatio: 1,
	},
	overlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
	},
});
