import type { TextVariant } from "@/components/ui/text";
import { TEXT_VARIANT_TOKEN } from "@/components/ui/text";
import { cx, type TypographyVariant } from "@/theme";

import type { CalendarDotProps } from "./calendar";

type Classed = { className?: string };

// Every class is written whole, so Tailwind finds it. The colors are the calendar's own tokens, in
// `theme/components/calendar.css`.
const TYPOGRAPHY: Record<TypographyVariant, string> = {
	largeTitle: "text-large-title",
	title1: "text-title1",
	title2: "text-title2",
	title3: "text-title3",
	headline: "text-headline",
	body: "text-body",
	callout: "text-callout",
	subheadline: "text-subheadline",
	footnote: "text-footnote",
	caption: "text-caption",
};

export function useCalendarStyles() {
	return {
		root: ({ className }: Classed) => ({ className: cx("gap-3", className) }),
		header: ({ className }: Classed) => ({
			className: cx("flex-row items-center gap-2 ps-2", className),
		}),
		title: ({ className }: Classed) => ({
			className: cx("flex-1", className),
		}),
		// A Text variant, or a typography token for a larger title.
		titleText: (variant: TextVariant | TypographyVariant) => ({
			className: cx(
				TYPOGRAPHY[
					variant in TEXT_VARIANT_TOKEN
						? TEXT_VARIANT_TOKEN[variant as TextVariant]
						: (variant as TypographyVariant)
				],
				"text-content",
			),
		}),
		nav: ({ className }: Classed) => ({
			className: cx("flex-row items-center gap-1", className),
		}),
		grid: ({ className }: Classed) => ({ className: cx("gap-1", className) }),
		weekdays: ({ className }: Classed) => ({
			className: cx("flex-row", className),
		}),
		week: { className: "flex-row" },
		cell: { className: "min-h-[44px] flex-1 items-center justify-center" },
		dayCell: ({ className }: Classed) => ({
			className: cx(
				"flex-1 items-center justify-center self-stretch",
				className,
			),
		}),
		// The range band runs behind the days, cut in half on its first and last day.
		band: (hasEnd: boolean, hasStart: boolean) => ({
			className: cx(
				"absolute bottom-[2px] top-[2px] bg-calendar-day-range",
				hasEnd ? "left-1/2" : "left-0",
				hasStart ? "right-1/2" : "right-0",
			),
		}),
		// `pressed` is applied by the pressable itself, through `active:`, on a day that isn't selected.
		day: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			className: cx(
				"size-[40px] items-center justify-center rounded-full",
				selected
					? "bg-calendar-day-selected"
					: !disabled && "active:bg-calendar-day-pressed",
			),
		}),
		// Later states win, each one listing what it changes.
		dayText: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			pressed: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			className: cx(
				"text-callout text-calendar-day-foreground",
				(today || selected) && "font-semibold",
				today && "text-calendar-day-foreground-today",
				outside && "text-calendar-day-foreground-outside",
				inRange && "text-calendar-day-foreground-in-range",
				selected && "text-calendar-day-foreground-selected",
				disabled && "text-calendar-day-foreground-disabled",
			),
		}),
		under: { className: "absolute bottom-[4px]" },
		// On a selected day, the dot takes the color that reads on the selection. A color of the
		// caller's is a raw value: it stays a style.
		dot: (
			selected: boolean,
			color: string | undefined,
			{ className, style }: Pick<CalendarDotProps, "className" | "style">,
		) => ({
			className: cx(
				"size-[4px] rounded-[2px]",
				selected
					? "bg-calendar-day-dot-selected"
					: !color && "bg-calendar-day-dot",
				className,
			),
			style: [
				!selected && color ? { backgroundColor: color } : undefined,
				style,
			],
		}),
	};
}
