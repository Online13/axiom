import { StyleSheet } from "react-native-unistyles";

const ART_WIDTH = 96;
// ISO/IEC 7810 ID-1, the size of every bank card.
const CARD_RATIO = 85.6 / 53.98;

export function useOfferCardStyles() {
	return {
		header: { style: styles.header },
		art: { style: styles.art },
		intro: { style: styles.intro },
		start: { style: styles.start },
		highlights: { style: styles.highlights },
		row: { style: styles.row },
		footer: { style: styles.footer },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[4],
		flexDirection: "row",
		alignItems: "center",
	},
	art: {
		// A height, not an aspectRatio: a bundled image's own pixel height would win over the ratio.
		width: ART_WIDTH,
		height: ART_WIDTH / CARD_RATIO,
		borderRadius: theme.tokens.radius.md,
	},
	intro: {
		gap: theme.tokens.spacing[1],
		flex: 1,
	},
	start: {
		flexDirection: "row",
	},
	highlights: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		gap: theme.tokens.spacing[3],
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
