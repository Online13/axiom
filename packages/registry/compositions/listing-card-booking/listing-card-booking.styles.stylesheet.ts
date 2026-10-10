import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
	fill: "hsla(0, 0%, 100%, 0.2)",
	ink: "hsla(0, 0%, 0%, 1)",
};

export function useListingCardBookingStyles() {
	const { tokens } = useTheme();

	return {
		photo: { style: styles.photo },
		scrim: { style: styles.scrim },
		content: { style: [styles.content, { padding: tokens.spacing[4] }] },
		badge: { style: styles.badge },
		passThrough: { style: styles.passThrough },
		details: { style: [styles.noTouch, { gap: tokens.spacing[1] }] },
		onMedia: { style: styles.onMedia },
		muted: { style: styles.muted },
		specs: {
			style: [
				styles.specs,
				{ gap: tokens.spacing[3], marginTop: tokens.spacing[2] },
			],
		},
		line: { style: styles.line },
		spec: { style: [styles.row, { gap: tokens.spacing[1] }] },
		tint: { color: ON_MEDIA.muted },
		actions: {
			style: [
				styles.row,
				styles.passThrough,
				styles.spread,
				{ gap: tokens.spacing[2], marginTop: tokens.spacing[4] },
			],
		},
		pill: {
			style: [
				styles.pill,
				styles.noTouch,
				{
					minHeight: tokens.sizes.control.md,
					paddingHorizontal: tokens.spacing[4],
					borderRadius: tokens.radius.full,
				},
			],
		},
		action: {
			style: [styles.action, { borderRadius: tokens.radius.full }],
		},
		actionLabel: { style: styles.actionLabel },
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
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))",
	},
	content: {
		...StyleSheet.absoluteFill,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "box-none",
	},
	spread: {
		justifyContent: "space-between",
	},
	passThrough: {
		pointerEvents: "box-none",
	},
	noTouch: {
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
		pointerEvents: "none",
	},
	row: {
		flexDirection: "row",
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
	specs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	pill: {
		justifyContent: "center",
		backgroundColor: ON_MEDIA.fill,
	},
	action: {
		backgroundColor: ON_MEDIA.text,
	},
	actionLabel: {
		color: ON_MEDIA.ink,
	},
});
