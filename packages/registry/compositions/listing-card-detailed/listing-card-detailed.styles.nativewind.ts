export function useListingCardDetailedStyles() {
	return {
		photo: { className: "h-full w-full" },
		mediaOverlay: {
			className: "absolute inset-0 items-start justify-between p-3",
			style: { pointerEvents: "none" as const },
		},
		priceRow: { className: "flex-row items-center gap-1" },
		section: { className: "gap-3" },
		specs: { className: "flex-row gap-4" },
		spec: { className: "flex-row items-center gap-1" },
		agent: { className: "flex-row items-center gap-2" },
		grow: { className: "flex-1" },
	};
}
