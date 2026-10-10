import { cx } from "@/theme";

export function useStatsCardInlineStyles() {
	return {
		row: { className: "flex-row items-center gap-3" },
		// Stands out from the card: the page color on a filled card, the filled color otherwise.
		tile: (onFilled: boolean) => ({
			className: cx(
				"size-[32px] items-center justify-center rounded-sm",
				onFilled ? "bg-background" : "bg-background-subtle",
			),
		}),
		grow: { className: "flex-1" },
	};
}
