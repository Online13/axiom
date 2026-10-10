import { StyleSheet } from "react-native-unistyles";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
};

export function useListingCardOverlayDetailedStyles() {
	return {
		photo: { style: styles.photo },
		scrim: { style: styles.scrim },
		content: { style: styles.content },
		badge: { style: styles.badge },
		details: { style: styles.details },
		priceRow: { style: styles.priceRow },
		owner: { style: styles.owner },
		grow: { style: styles.grow },
		spec: { style: styles.spec },
		specValue: { style: styles.specValue },
		onMedia: { style: styles.onMedia },
		muted: { style: styles.muted },
		agentSection: { style: styles.agentSection },
		line: { style: styles.line },
		agent: { style: styles.agent },
		tint: { color: ON_MEDIA.text },
	};
}

const styles = StyleSheet.create((theme) => ({
	details: {
		gap: theme.tokens.spacing[1],
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	owner: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	specValue: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	agentSection: {
		gap: theme.tokens.spacing[3],
		marginTop: theme.tokens.spacing[2],
	},
	agent: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},

	// A bundled image defaults to its file's pixel size: absoluteFill alone does not stretch it.
	photo: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	scrim: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: "none",
		experimental_backgroundImage:
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))",
	},
	content: {
		padding: theme.tokens.spacing[4],
		...StyleSheet.absoluteFillObject,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
	},
	grow: {
		flex: 1,
	},
	spec: {
		alignItems: "center",
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
}));
