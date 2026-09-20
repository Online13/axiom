import { createContext, use } from "react";

import { useControllableState } from "@/hooks/use-controllable-state";

export type CalendarMode = "single" | "range" | "multiple";
export type DateRange = { from: Date; to?: Date };
export type CalendarSelection = Date | DateRange | Date[] | undefined;
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type UseCalendarOptions = {
	mode?: CalendarMode;
	selected?: CalendarSelection;
	defaultSelected?: CalendarSelection;
	onSelect?: (selected: CalendarSelection) => void;
	month?: Date;
	defaultMonth?: Date;
	onMonthChange?: (month: Date) => void;
	minDate?: Date;
	maxDate?: Date;
	isDateDisabled?: (date: Date) => boolean;
	/** In `range` mode, limits on the number of nights. */
	minRange?: number;
	maxRange?: number;
	/** Defaults to the locale's first day of the week. */
	weekStartsOn?: Weekday;
	locale?: string;
};

export type DayState = {
	date: Date;
	/** YYYY-MM-DD */
	key: string;
	isToday: boolean;
	isSelected: boolean;
	isRangeStart: boolean;
	isRangeEnd: boolean;
	isInRange: boolean;
	isOutside: boolean;
	isDisabled: boolean;
};

const DAY = 24 * 60 * 60 * 1000;

export const startOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const startOfMonth = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), 1);
export const addMonths = (date: Date, count: number) =>
	new Date(date.getFullYear(), date.getMonth() + count, 1);
export const addDays = (date: Date, count: number) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
export const sameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();
export const dayKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
/** Whole days between two dates, ignoring daylight saving shifts. */
export const daysBetween = (a: Date, b: Date) =>
	Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY);

function localeWeekStart(locale: string | undefined): Weekday {
	try {
		// `getWeekInfo` is missing from some engines and from the TypeScript lib.
		const info = new Intl.Locale(
			locale ?? Intl.DateTimeFormat().resolvedOptions().locale,
		) as unknown as {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
		return firstDay === undefined ? 0 : ((firstDay % 7) as Weekday);
	} catch {
		return 0;
	}
}

function initialMonth(selected: CalendarSelection): Date {
	if (selected instanceof Date) return startOfMonth(selected);
	if (Array.isArray(selected)) return startOfMonth(selected[0] ?? new Date());
	if (selected) return startOfMonth(selected.from);
	return startOfMonth(new Date());
}

/** Selection, displayed month and the day grid of a calendar, shared by every styling variant. */
export function useCalendarState({
	mode = "single",
	selected,
	defaultSelected,
	onSelect,
	month,
	defaultMonth,
	onMonthChange,
	minDate,
	maxDate,
	isDateDisabled,
	minRange,
	maxRange,
	weekStartsOn,
	locale,
}: UseCalendarOptions) {
	const [selection, setSelection] = useControllableState<CalendarSelection>({
		value: selected,
		defaultValue: defaultSelected,
		onChange: onSelect,
	});
	const [displayed, setDisplayed] = useControllableState<Date>({
		value: month ? startOfMonth(month) : undefined,
		defaultValue: defaultMonth
			? startOfMonth(defaultMonth)
			: initialMonth(selected ?? defaultSelected),
		onChange: onMonthChange,
	});

	const firstDay = weekStartsOn ?? localeWeekStart(locale);
	const today = startOfDay(new Date());
	const canGoPrev =
		!minDate || addMonths(displayed, -1) >= startOfMonth(minDate);
	const canGoNext =
		!maxDate || addMonths(displayed, 1) <= startOfMonth(maxDate);

	const setMonth = (next: Date) => {
		const target = startOfMonth(next);
		if (minDate && target < startOfMonth(minDate)) return;
		if (maxDate && target > startOfMonth(maxDate)) return;
		if (target.getTime() !== displayed.getTime()) setDisplayed(target);
	};

	const range =
		mode === "range" &&
		selection &&
		!(selection instanceof Date) &&
		!Array.isArray(selection)
			? selection
			: undefined;

	const isDisabled = (date: Date) => {
		if (minDate && date < startOfDay(minDate)) return true;
		if (maxDate && date > startOfDay(maxDate)) return true;
		if (isDateDisabled?.(date)) return true;
		// While picking the end of a range, days outside the allowed number of nights are disabled.
		if (range && !range.to) {
			const nights = daysBetween(range.from, date);
			if (
				nights > 0 &&
				((minRange !== undefined && nights < minRange) ||
					(maxRange !== undefined && nights > maxRange))
			) {
				return true;
			}
		}
		return false;
	};

	const isSelected = (date: Date) => {
		if (!selection) return false;
		if (selection instanceof Date) return sameDay(selection, date);
		if (Array.isArray(selection))
			return selection.some((item) => sameDay(item, date));
		return (
			sameDay(selection.from, date) ||
			(selection.to !== undefined && sameDay(selection.to, date))
		);
	};

	const select = (date: Date) => {
		if (isDisabled(date)) return;
		if (mode === "single") {
			setSelection(date);
		} else if (mode === "multiple") {
			const current = Array.isArray(selection) ? selection : [];
			setSelection(
				current.some((item) => sameDay(item, date))
					? current.filter((item) => !sameDay(item, date))
					: [...current, date],
			);
		} else if (!range || range.to || date < range.from) {
			// First press, a complete range, or a day before the start: start a new range.
			setSelection({ from: date });
		} else {
			setSelection({ from: range.from, to: date });
		}
		if (date.getMonth() !== displayed.getMonth()) setMonth(date);
	};

	/** Days of the displayed month, padded to whole weeks. */
	const weeks = (count: "fit" | "fixed" | number): DayState[][] => {
		const first = startOfMonth(displayed);
		const lead = (first.getDay() - firstDay + 7) % 7;
		const start = addDays(first, -lead);
		const daysInMonth = new Date(
			displayed.getFullYear(),
			displayed.getMonth() + 1,
			0,
		).getDate();
		const rows =
			count === "fixed"
				? 6
				: count === "fit"
					? Math.ceil((lead + daysInMonth) / 7)
					: count;

		return Array.from({ length: rows }, (_, row) =>
			Array.from({ length: 7 }, (_, column) => {
				const date = addDays(start, row * 7 + column);
				const inRange =
					range?.to !== undefined && date > range.from && date < range.to;
				return {
					date,
					key: dayKey(date),
					isToday: sameDay(date, today),
					isSelected: isSelected(date),
					isRangeStart: range !== undefined && sameDay(range.from, date),
					isRangeEnd: range?.to !== undefined && sameDay(range.to, date),
					isInRange: inRange,
					isOutside: date.getMonth() !== displayed.getMonth(),
					isDisabled: isDisabled(date),
				};
			}),
		);
	};

	const weekdays = (format: "short" | "narrow") => {
		const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
		// 2023-01-01 is a Sunday.
		return Array.from({ length: 7 }, (_, i) =>
			formatter.format(new Date(2023, 0, 1 + ((firstDay + i) % 7))),
		);
	};

	return {
		mode,
		locale,
		month: displayed,
		setMonth,
		selected: selection,
		select,
		canGoPrev,
		canGoNext,
		goToPrev: () => setMonth(addMonths(displayed, -1)),
		goToNext: () => setMonth(addMonths(displayed, 1)),
		goToToday: () => setMonth(today),
		weeks,
		weekdays,
	};
}

export type CalendarContextValue = ReturnType<typeof useCalendarState>;

export const CalendarContext = createContext<CalendarContextValue | null>(null);

/** Reads the Root state from any component inside `Calendar.Root`. */
export function useCalendar() {
	const context = use(CalendarContext);
	if (!context)
		throw new Error(
			"useCalendar and Calendar parts must be used inside Calendar.Root.",
		);
	return context;
}
