export function useEventCardStyles() {
	return {
		date: {
			className:
				"min-w-control-lg items-center rounded-md bg-background-elevated px-2 py-1",
		},
		month: { className: "uppercase" },
		header: { className: "gap-2" },
		detail: { className: "flex-row items-center gap-2" },
		footer: { className: "gap-3" },
		attendees: { className: "flex-1 flex-row items-center gap-2" },
		grow: { className: "flex-1" },
	};
}
