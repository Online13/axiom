const ART_WIDTH = 96;
// ISO/IEC 7810 ID-1, the size of every bank card.
const CARD_RATIO = 85.6 / 53.98;

export function useOfferCardStyles() {
	return {
		header: { className: "flex-row items-center gap-4" },
		// A height, not an aspectRatio: a bundled image's own pixel height would win over the ratio.
		art: {
			className: "rounded-md",
			style: { width: ART_WIDTH, height: ART_WIDTH / CARD_RATIO },
		},
		intro: { className: "flex-1 gap-1" },
		start: { className: "flex-row" },
		highlights: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		footer: { className: "items-center gap-3" },
		grow: { className: "flex-1" },
	};
}
