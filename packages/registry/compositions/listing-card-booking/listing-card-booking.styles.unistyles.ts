import { StyleSheet } from "react-native-unistyles";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
	fill: "hsla(0, 0%, 100%, 0.2)",
	ink: "hsla(0, 0%, 0%, 1)",
};

export function useListingCardBookingStyles() {
	return {
		photo: { style: styles.photo },
		scrim: { style: styles.scrim },
		content: { style: styles.content },
		badge: { style: styles.badge },
		passThrough: { style: styles.passThrough },
		details: { style: styles.details },
		onMedia: { style: styles.onMedia },
		muted: { style: styles.muted },
		specs: { style: styles.specs },
		line: { style: styles.line },
		spec: { style: styles.spec },
		tint: { color: ON_MEDIA.muted },
		actions: { style: styles.actions },
		pill: { style: styles.pill },
		action: { style: styles.action },
		actionLabel: { style: styles.actionLabel },
	};
}

const styles = StyleSheet.create((theme) => ({
	details: {
		gap: theme.tokens.spacing[1],
		pointerEvents: "none",
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: theme.tokens.spacing[2],
		marginTop: theme.tokens.spacing[4],
		pointerEvents: "box-none",
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
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "box-none",
	},
	badge: {
		alignSelf: "flex-start",
		pointerEvents: "none",
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
		gap: theme.tokens.spacing[3],
		marginTop: theme.tokens.spacing[2],
		flexDirection: "row",
		justifyContent: "space-between",
	},
	pill: {
		minHeight: theme.tokens.sizes.control.md,
		paddingHorizontal: theme.tokens.spacing[4],
		borderRadius: theme.tokens.radius.full,
		pointerEvents: "none",
		justifyContent: "center",
		backgroundColor: ON_MEDIA.fill,
	},
	action: {
		borderRadius: theme.tokens.radius.full,
		backgroundColor: ON_MEDIA.text,
	},
	actionLabel: {
		color: ON_MEDIA.ink,
	},
}));
