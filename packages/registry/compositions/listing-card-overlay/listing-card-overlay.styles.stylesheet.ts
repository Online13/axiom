import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
};

export function useListingCardOverlayStyles() {
	const { tokens } = useTheme();

	return {
		photo: { style: styles.photo },
		scrim: { style: styles.scrim },
		content: { style: [styles.content, { padding: tokens.spacing[4] }] },
		badge: { style: styles.badge },
		details: { style: { gap: tokens.spacing[1] } },
		heading: { style: [styles.row, { gap: tokens.spacing[2] }] },
		title: { style: [styles.onMedia, styles.grow] },
		onMedia: { style: styles.onMedia },
		muted: { style: styles.muted },
		specSection: {
			style: { gap: tokens.spacing[3], marginTop: tokens.spacing[2] },
		},
		line: { style: styles.line },
		specs: { style: styles.specs },
		spec: { style: [styles.row, { gap: tokens.spacing[1] }] },
		tint: { color: ON_MEDIA.muted },
	};
}

const styles = StyleSheet.create({
	// A bundled image defaults to its file's pixel size: absoluteFill alone does not stretch it.
	photo: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	scrim: {
		...StyleSheet.absoluteFill,
		pointerEvents: "none",
		experimental_backgroundImage:
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 45%, hsla(0, 0%, 0%, 0.8))",
	},
	content: {
		...StyleSheet.absoluteFill,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	onMedia: {
		color: ON_MEDIA.text,
	},
	muted: {
		color: ON_MEDIA.muted,
	},
	line: {
		backgroundColor: ON_MEDIA.line,
	},
	specs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
