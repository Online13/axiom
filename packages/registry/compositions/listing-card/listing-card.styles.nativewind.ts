export function useListingCardStyles() {
	return {
		photo: { className: "h-full w-full" },
		mediaOverlay: {
			className: "absolute inset-0 items-start justify-between p-3",
			style: { pointerEvents: "none" as const },
		},
		heading: { className: "flex-row items-baseline gap-2" },
		title: { className: "flex-1" },
		section: { className: "gap-3" },
		specs: { className: "flex-row justify-between" },
		spec: { className: "shrink flex-row items-center gap-1" },
	};
}
