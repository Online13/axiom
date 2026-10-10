import type { ViewProps } from "react-native";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";

import type { BadgePlacement, BadgeSize, BadgeVariant } from "./badge";

// Every class is written whole, so Tailwind finds it. The colors are the badge's own tokens, in
// `theme/components/badge.css`: restyle the badge there, or here for its layout.

// A counter is as wide as it is tall until its label needs more. The ring is drawn outside the
// badge: it grows the box, not the fill.
const COUNTER: Record<BadgeSize, { plain: string; ringed: string }> = {
	sm: {
		plain: "min-h-[18px] min-w-[18px]",
		ringed: "min-h-[22px] min-w-[22px] border-2",
	},
	md: {
		plain: "min-h-[22px] min-w-[22px]",
		ringed: "min-h-[26px] min-w-[26px] border-2",
	},
};

const TEXT_SIZE: Record<BadgeSize, string> = {
	sm: "text-caption",
	md: "text-footnote",
};

const PILL_SIZE: Record<BadgeSize, string> = {
	sm: "min-h-[18px] px-[6px]",
	md: "min-h-[22px] px-2",
};

const PILL: Record<BadgeVariant, string> = {
	neutral: "bg-badge-neutral",
	highlight: "bg-badge-highlight",
	info: "bg-badge-info",
	success: "bg-badge-success",
	warning: "bg-badge-warning",
	error: "bg-badge-error",
	outline: "border border-badge-outline-border",
	inverse: "bg-badge-inverse",
};

const FOREGROUND: Record<BadgeVariant, string> = {
	neutral: "text-badge-neutral-foreground",
	highlight: "text-badge-highlight-foreground",
	info: "text-badge-info-foreground",
	success: "text-badge-success-foreground",
	warning: "text-badge-warning-foreground",
	error: "text-badge-error-foreground",
	outline: "text-badge-outline-foreground",
	inverse: "text-badge-inverse-foreground",
};

// The foreground again, as the fill of the dot.
const DOT: Record<BadgeVariant, string> = {
	neutral: "bg-badge-neutral-foreground",
	highlight: "bg-badge-highlight-foreground",
	info: "bg-badge-info-foreground",
	success: "bg-badge-success-foreground",
	warning: "bg-badge-warning-foreground",
	error: "bg-badge-error-foreground",
	outline: "bg-badge-outline-foreground",
	inverse: "bg-badge-inverse-foreground",
};

// The icon takes its color as a prop. NativeWind gives it from a text color class: the label's.
export const BadgeIcon = Icon;

/** Width of the ring around an anchored counter or dot. */
const RING = 2;

export function useBadgeStyles() {
	return {
		counter: (
			size: BadgeSize,
			labelled: boolean,
			ring: boolean,
			{ className }: Pick<ViewProps, "className">,
		) => ({
			className: cx(
				"items-center justify-center rounded-full border-badge-count-border bg-badge-count",
				labelled && "px-1",
				labelled && COUNTER[size][ring ? "ringed" : "plain"],
				!labelled && (ring ? "size-[14px] border-2" : "size-[10px]"),
				className,
			),
		}),
		counterText: (size: BadgeSize) => ({
			className: cx(
				TEXT_SIZE[size],
				"font-semibold text-badge-count-foreground",
			),
		}),
		pill: (
			variant: BadgeVariant,
			size: BadgeSize,
			{ className }: Pick<ViewProps, "className">,
		) => ({
			className: cx(
				"flex-row items-center gap-1 self-start rounded-full",
				PILL_SIZE[size],
				PILL[variant],
				className,
			),
		}),
		pillText: (variant: BadgeVariant, size: BadgeSize) => ({
			className: cx(TEXT_SIZE[size], "font-medium", FOREGROUND[variant]),
		}),
		tint: (variant: BadgeVariant) => ({ className: FOREGROUND[variant] }),
		dot: (variant: BadgeVariant) => ({
			className: cx("size-[6px] rounded-full", DOT[variant]),
		}),
		anchor: ({ className }: Pick<ViewProps, "className">) => ({
			className: cx("self-start", className),
		}),
		// Offset by the ring, so the badge's fill lands where it would without one.
		badge: (placement: BadgePlacement) => ({
			className: "absolute",
			style: [
				{ pointerEvents: "none" as const, right: -RING },
				placement === "top-right" ? { top: -RING } : { bottom: -RING },
			],
		}),
	};
}
