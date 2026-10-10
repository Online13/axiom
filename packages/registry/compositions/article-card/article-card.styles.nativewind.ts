export function useArticleCardStyles() {
	return {
		header: { className: "gap-2" },
		// Tracked by 0.6, which no class of the theme names.
		category: { className: "uppercase tracking-[0.6px]" },
		byline: { className: "flex-row items-center gap-3" },
		grow: { className: "flex-1" },
	};
}
