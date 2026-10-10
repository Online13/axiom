import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const ART_WIDTH = 96;
// ISO/IEC 7810 ID-1, the size of every bank card.
const CARD_RATIO = 85.6 / 53.98;

export function useOfferCardStyles() {
	const { tokens } = useTheme();

	return {
		header: { style: [styles.header, { gap: tokens.spacing[4] }] },
		art: { style: [styles.art, { borderRadius: tokens.radius.md }] },
		intro: { style: [styles.grow, { gap: tokens.spacing[1] }] },
		start: { style: styles.start },
		highlights: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		footer: { style: [styles.footer, { gap: tokens.spacing[3] }] },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	art: {
		// A height, not an aspectRatio: a bundled image's own pixel height would win over the ratio.
		width: ART_WIDTH,
		height: ART_WIDTH / CARD_RATIO,
	},
	start: {
		flexDirection: "row",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
});
