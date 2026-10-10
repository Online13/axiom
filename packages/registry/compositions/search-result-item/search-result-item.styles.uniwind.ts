import { cx } from "@/theme";

export function useSearchResultItemStyles() {
	return {
		thumb: (shape: "square" | "circle") => ({
			className: cx(
				"size-[44px]",
				shape === "circle" ? "rounded-full" : "rounded-sm",
			),
		}),
		tile: (shape: "square" | "circle") => ({
			className: cx(
				"size-[44px] items-center justify-center bg-background-subtle",
				shape === "circle" ? "rounded-full" : "rounded-sm",
			),
		}),
	};
}
