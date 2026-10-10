import { cx } from "@/theme";

export function useStatsCardProgressStyles() {
	return {
		body: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		baseline: { className: "flex-row items-baseline gap-1" },
		track: { className: "h-[8px] overflow-hidden rounded-full bg-border" },
		// The width follows the progress: a number, so it stays a style.
		fill: (ratio: number, reached: boolean) => ({
			className: cx(
				"h-[8px] rounded-full",
				reached ? "bg-feedback-success" : "bg-primary",
			),
			style: { width: `${ratio * 100}%` as const },
		}),
		grow: { className: "flex-1" },
		shrink: { className: "shrink" },
	};
}
