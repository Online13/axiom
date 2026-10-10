import type { Radius } from "@/theme";
import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type {
	CardPadding,
	CardPartProps,
	CardProps,
	CardVariant,
} from "./card";

// Every class is written whole, so Tailwind finds it. The colors are the card's own tokens, in
// `theme/components/card.css`.

// `pressed` is applied by the pressable itself, through `active:`.
const SURFACE: Record<CardVariant, Record<"default" | "pressed", string>> = {
	elevated: {
		default: "bg-card-elevated",
		pressed: "active:bg-card-elevated-pressed",
	},
	outlined: {
		default: "border-card-outlined-border bg-card-outlined",
		pressed: "active:bg-card-outlined-pressed",
	},
	filled: {
		default: "bg-card-filled",
		pressed: "active:bg-card-filled-pressed",
	},
};

const RADIUS: Record<keyof Radius, string> = {
	none: "rounded-none",
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	xl: "rounded-xl",
	full: "rounded-full",
};

// The sub-components pad their top; without a padding of its own, the card pads the bottom of the
// last one.
const PADDING: Record<CardPadding, string> = {
	none: "pb-4",
	0: "p-0",
	1: "p-1",
	2: "p-2",
	3: "p-3",
	4: "p-4",
	5: "p-5",
	6: "p-6",
	8: "p-8",
	10: "p-10",
	12: "p-12",
};

const SHADOW =
	"0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)";

export function useCardStyles() {
	return {
		card: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ className, style }: Pick<CardProps, "className" | "style">,
		) => ({
			className: cx(
				"overflow-hidden",
				RADIUS[radius],
				PADDING[padding],
				SURFACE[variant].default,
				disabled && "opacity-50",
				className,
			),
			style: [
				// Only the device knows the width of a hairline.
				variant === "outlined" && { borderWidth: metrics.hairline },
				variant === "elevated" && { boxShadow: SHADOW },
				style,
			],
		}),
		pressable: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ className, style }: Pick<CardProps, "className" | "style">,
		) => ({
			className: cx(
				"overflow-hidden",
				RADIUS[radius],
				PADDING[padding],
				SURFACE[variant].default,
				!disabled && SURFACE[variant].pressed,
				disabled && "opacity-50",
				className,
			),
			style: [
				variant === "outlined" && { borderWidth: metrics.hairline },
				variant === "elevated" && { boxShadow: SHADOW },
				style,
			],
		}),
		media: (aspectRatio: number, { style }: Pick<CardProps, "style">) => ({
			style: [{ aspectRatio }, style],
		}),
		// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
		mediaImage: { className: "absolute inset-0 h-full w-full" },
		mediaOverlay: { className: "absolute inset-0 items-start p-3" },
		// The sub-components pad their own top and sides.
		header: ({ className }: Pick<CardPartProps, "className">) => ({
			className: cx("gap-1 px-4 pt-4", className),
		}),
		content: ({ className }: Pick<CardPartProps, "className">) => ({
			className: cx("px-4 pt-4", className),
		}),
		footer: ({ className }: Pick<CardPartProps, "className">) => ({
			className: cx(
				"flex-row flex-wrap items-center gap-2 px-4 pt-4",
				className,
			),
		}),
	};
}
