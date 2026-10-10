export function useNotificationItemStyles() {
	return {
		item: { className: "py-3" },
		tile: {
			className:
				"size-[40px] items-center justify-center rounded-full bg-primary-subtle",
		},
		content: { className: "gap-1" },
		action: { className: "flex-row pt-1" },
		dot: { className: "pt-2" },
	};
}
