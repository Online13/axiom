import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type {
	ItemAlign,
	ItemAreaProps,
	ItemDivider,
	ItemProps,
	ItemSize,
} from "./item";

// Every class is written whole, so Tailwind finds it. The colors are the item's own tokens, in
// `theme/components/item.css`.
const MIN_HEIGHT: Record<ItemSize, string> = {
	sm: "min-h-[44px]",
	md: "min-h-[52px]",
	lg: "min-h-[64px]",
};

export function useItemStyles() {
	return {
		row: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ className }: Pick<ItemProps, "className">,
		) => ({
			className: cx(
				"flex-row gap-3 px-screen-margin py-2",
				MIN_HEIGHT[size],
				align === "center" ? "items-center" : "items-start",
				selected && "bg-item-selected",
				className,
			),
		}),
		// `pressed` is applied by the pressable itself, through `active:`.
		pressableRow: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ className }: Pick<ItemProps, "className">,
		) => ({
			className: cx(
				"flex-row gap-3 px-screen-margin py-2 active:bg-item-pressed",
				MIN_HEIGHT[size],
				align === "center" ? "items-center" : "items-start",
				selected && "bg-item-selected",
				className,
			),
		}),
		// `inset` starts the line after the leading area, once it has been measured: a number, like
		// the width of a hairline, which only the device knows.
		divider: (divider: ItemDivider, leadingWidth: number) => ({
			className: "absolute bottom-0 right-0 bg-item-divider",
			style: {
				height: metrics.hairline,
				left:
					divider === "inset" && leadingWidth > 0
						? metrics.screenMargin + leadingWidth + spacing[3]
						: metrics.screenMargin,
			},
		}),
		leading: ({ className }: Pick<ItemAreaProps, "className">) => ({
			className: cx("flex-row items-center", className),
		}),
		trailing: ({ className }: Pick<ItemAreaProps, "className">) => ({
			className: cx("flex-row items-center gap-2", className),
		}),
		content: ({ className }: Pick<ItemAreaProps, "className">) => ({
			className: cx("flex-1 gap-[2px]", className),
		}),
	};
}
