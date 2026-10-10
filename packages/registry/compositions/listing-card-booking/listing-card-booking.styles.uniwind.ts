const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))";

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always
// white: full for the text, 75% for what is muted, 25% for the lines, 20% for the fill of the pill.
// Only the button takes presses: the rest lets them go through to the card.
export function useListingCardBookingStyles() {
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
			style: { pointerEvents: "box-none" as const },
		},
		badge: {
			className: "self-start",
			style: { pointerEvents: "none" as const },
		},
		passThrough: { style: { pointerEvents: "box-none" as const } },
		details: {
			className: "gap-1",
			style: { pointerEvents: "none" as const },
		},
		onMedia: { className: "text-white" },
		muted: { className: "text-white/75" },
		specs: { className: "mt-2 flex-row justify-between gap-3" },
		line: { className: "bg-white/25" },
		spec: { className: "flex-row items-center gap-1" },
		// The icon takes its color as a prop.
		tint: { color: "hsla(0, 0%, 100%, 0.75)" },
		actions: {
			className: "mt-4 flex-row items-center justify-between gap-2",
			style: { pointerEvents: "box-none" as const },
		},
		pill: {
			className:
				"min-h-control-md justify-center rounded-full bg-white/20 px-4",
			style: { pointerEvents: "none" as const },
		},
		// A light button on the dark scrim, in both schemes, pressed or not.
		action: { className: "rounded-full bg-white active:bg-white" },
		actionLabel: { className: "text-black" },
	};
}
