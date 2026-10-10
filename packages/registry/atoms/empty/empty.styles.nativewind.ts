import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";

import type { EmptyProps, EmptySize, EmptyTone } from "./empty";

// The icon takes its color as a prop. NativeWind gives it from a text color class.
export const EmptyIcon = Icon;

// Every class is written whole, so Tailwind finds it. The colors are the empty state's own tokens,
// in `theme/components/empty.css`.
export function useEmptyStyles() {
	return {
		root: (
			size: EmptySize,
			fill: boolean,
			{ className }: Pick<EmptyProps, "className">,
		) => ({
			className: cx(
				"items-center justify-center",
				fill && "flex-1",
				size === "md" ? "gap-6 p-8" : "gap-4 p-4",
				className,
			),
		}),
		header: (
			size: EmptySize,
			{ className }: Pick<EmptyProps, "className">,
		) => ({
			className: cx(
				"max-w-[320px] items-center",
				size === "md" ? "gap-2" : "gap-1",
				className,
			),
		}),
		media: (
			size: EmptySize,
			{ className }: Pick<EmptyProps, "className">,
		) => ({
			className: cx(size === "md" ? "mb-3" : "mb-2", className),
		}),
		tile: (size: EmptySize, tone: EmptyTone) => ({
			className: cx(
				"items-center justify-center rounded-full",
				size === "md" ? "size-[64px]" : "size-[48px]",
				tone === "error"
					? "bg-empty-error-media"
					: "bg-empty-neutral-media",
			),
		}),
		tint: (tone: EmptyTone) => ({
			className:
				tone === "error"
					? "text-empty-error-icon"
					: "text-empty-neutral-icon",
		}),
		content: ({ className }: Pick<EmptyProps, "className">) => ({
			className: cx("items-center gap-2", className),
		}),
	};
}
