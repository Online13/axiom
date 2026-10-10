const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 45%, hsla(0, 0%, 0%, 0.8))";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always
// white: full for the text, 75% for what is muted, 25% for the lines.
export function useListingCardOverlayStyles() {
	return {
		// A bundled image defaults to its file's pixel size: `absolute inset-0` alone does not stretch it.
		photo: { className: "absolute inset-0 h-full w-full" },
		scrim: {
			className: "absolute inset-0",
			style: {
				pointerEvents: "none" as const,
				experimental_backgroundImage: SCRIM,
			},
		},
		content: {
			className: "absolute inset-0 items-stretch justify-between p-4",
			style: { pointerEvents: "none" as const },
		},
		badge: { className: "self-start" },
		details: { className: "gap-1" },
		heading: { className: "flex-row items-center gap-2" },
		title: { className: "flex-1 text-white" },
		onMedia: { className: "text-white" },
		muted: { className: "text-white/75" },
		specSection: { className: "mt-2 gap-3" },
		line: { className: "bg-white/25" },
		specs: { className: "flex-row justify-between" },
		spec: { className: "flex-row items-center gap-1" },
		// The icon takes its color as a prop.
		tint: { color: "hsla(0, 0%, 100%, 0.75)" },
	};
}
