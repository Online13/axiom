const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always
// white: full for the text, 75% for what is muted, 25% for the lines.
export function useListingCardOverlayDetailedStyles() {
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
		priceRow: { className: "flex-row items-center gap-1" },
		owner: { className: "flex-row items-center gap-3" },
		grow: { className: "flex-1" },
		spec: { className: "items-center" },
		specValue: { className: "flex-row items-center gap-1" },
		onMedia: { className: "text-white" },
		muted: { className: "text-white/75" },
		agentSection: { className: "mt-2 gap-3" },
		line: { className: "bg-white/25" },
		agent: { className: "flex-row items-center gap-2" },
		// The icon takes its color as a prop.
		tint: { color: "hsla(0, 0%, 100%, 1)" },
	};
}
