import {
	createContext,
	memo,
	use,
	useMemo,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

import { Tappable } from "@/components/core/tappable";
import { IconButton, type IconButtonProps } from "@/components/ui/icon-button";
import { MAX_FONT_SCALE, Text, type TextVariant } from "@/components/ui/text";
import type { TypographyVariant } from "@/theme";

import { useCalendarStyles } from "./calendar.styles";

import {
	CalendarContext,
	useCalendar,
	useCalendarState,
	type DayState,
	type UseCalendarOptions,
} from "./use-calendar";

export {
	useCalendar,
	type CalendarSelection,
	type DateRange,
	type DayState,
} from "./use-calendar";

export type CalendarRootProps = ComponentPropsWithRef<typeof View> &
	UseCalendarOptions;

function CalendarRoot({
	children,
	mode,
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
	...props
}: CalendarRootProps) {
	const styles = useCalendarStyles();
	const calendar = useCalendarState({
		mode,
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
	});

	return (
		<CalendarContext value={calendar}>
			<View {...props} {...styles.root(props)}>
				{children}
			</View>
		</CalendarContext>
	);
}

export type CalendarHeaderProps = ComponentPropsWithRef<typeof View>;

function CalendarHeader({ children, ...props }: CalendarHeaderProps) {
	const styles = useCalendarStyles();

	return (
		<View {...props} {...styles.header(props)}>
			{children}
		</View>
	);
}

export type CalendarTitleProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	format?: "month" | "month-year";
	/** A Text variant, or a system typography style such as `headline`. */
	variant?: TextVariant | TypographyVariant;
	children?: (month: Date) => ReactNode;
};

function CalendarTitle({
	format = "month-year",
	variant = "headline",
	children,
	...props
}: CalendarTitleProps) {
	const styles = useCalendarStyles();
	const { month, locale } = useCalendar();
	const formatter = useMemo(
		() =>
			new Intl.DateTimeFormat(
				locale,
				format === "month"
					? { month: "long" }
					: { month: "long", year: "numeric" },
			),
		[locale, format],
	);
	const label = formatter.format(month);

	return (
		// Announces the new month after navigation.
		<View
			accessibilityLiveRegion="polite"
			{...props}
			{...styles.title(props)}
		>
			{children ? (
				children(month)
			) : (
				<Text
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					{...styles.titleText(variant)}
				>
					{label.charAt(0).toUpperCase() + label.slice(1)}
				</Text>
			)}
		</View>
	);
}

export type CalendarNavProps = ComponentPropsWithRef<typeof View>;

function CalendarNav({ children, ...props }: CalendarNavProps) {
	const styles = useCalendarStyles();

	return (
		<View {...props} {...styles.nav(props)}>
			{children}
		</View>
	);
}

type NavButtonProps = Partial<Omit<IconButtonProps, "onPress">>;

function CalendarPrevButton({
	icon = "chevron-left",
	size = "sm",
	accessibilityLabel = "Previous month",
	...props
}: NavButtonProps) {
	const { canGoPrev, goToPrev } = useCalendar();
	return (
		<IconButton
			{...props}
			icon={icon}
			size={size}
			accessibilityLabel={accessibilityLabel}
			disabled={!canGoPrev}
			onPress={goToPrev}
		/>
	);
}

function CalendarNextButton({
	icon = "chevron-right",
	size = "sm",
	accessibilityLabel = "Next month",
	...props
}: NavButtonProps) {
	const { canGoNext, goToNext } = useCalendar();
	return (
		<IconButton
			{...props}
			icon={icon}
			size={size}
			accessibilityLabel={accessibilityLabel}
			disabled={!canGoNext}
			onPress={goToNext}
		/>
	);
}

export type CalendarGridProps = ComponentPropsWithRef<typeof View> & {
	swipeable?: boolean;
};

function CalendarGrid({
	swipeable = true,
	children,
	...props
}: CalendarGridProps) {
	const styles = useCalendarStyles();
	const { goToPrev, goToNext } = useCalendar();

	const gesture = useMemo(
		() =>
			Gesture.Pan()
				.enabled(swipeable)
				.activeOffsetX([-20, 20])
				.failOffsetY([-12, 12])
				.onEnd((event) => {
					if (event.translationX < -40 || event.velocityX < -600)
						scheduleOnRN(goToNext);
					else if (event.translationX > 40 || event.velocityX > 600)
						scheduleOnRN(goToPrev);
				}),
		[swipeable, goToNext, goToPrev],
	);

	return (
		<GestureDetector gesture={gesture}>
			<View {...props} {...styles.grid(props)}>
				{children}
			</View>
		</GestureDetector>
	);
}

export type CalendarWeekdaysProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	format?: "short" | "narrow";
};

function CalendarWeekdays({
	format = "short",
	...props
}: CalendarWeekdaysProps) {
	const styles = useCalendarStyles();
	const { weekdays } = useCalendar();
	const names = useMemo(() => weekdays(format), [weekdays, format]);

	return (
		<View
			{...props}
			{...styles.weekdays(props)}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
		>
			{names.map((name, i) => (
				<View key={i} {...styles.cell}>
					<Text
						variant="caption"
						color="muted"
						weight="medium"
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					>
						{name}
					</Text>
				</View>
			))}
		</View>
	);
}

export type CalendarDaysProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** `fit`: rows the month needs. `fixed`: always 6. A number: that many weeks. */
	weeks?: "fit" | "fixed" | number;
	showOutsideDays?: boolean;
	children?: (day: DayState) => ReactNode;
};

function CalendarDays({
	weeks = "fit",
	showOutsideDays = true,
	children,
	...props
}: CalendarDaysProps) {
	const styles = useCalendarStyles();
	const calendar = useCalendar();

	return (
		<View {...props}>
			{/* Keyed by position, so a new month updates the cells in place. */}
			{calendar.weeks(weeks).map((week, row) => (
				<View key={row} {...styles.week}>
					{week.map((day, column) => (
						<View key={column} {...styles.cell}>
							{day.isOutside && !showOutsideDays ? null : children ? (
								children(day)
							) : (
								<CalendarDay day={day} />
							)}
						</View>
					))}
				</View>
			))}
		</View>
	);
}

// Whether the day around a `Calendar.Dot` is selected.
const DayContext = createContext(false);

// A day is 40pt wide in a cell of 44pt at least: the slop is known, so no day measures itself.
const DAY_HIT_SLOP = 2;

export type CalendarDayProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	day: DayState;
	disabled?: boolean;
	/** Content under the number, such as a `Calendar.Dot`. */
	children?: ReactNode;
};

function CalendarDay({
	day,
	disabled = day.isDisabled,
	children,
	...props
}: CalendarDayProps) {
	const styles = useCalendarStyles();
	const { select, formatDay } = useCalendar();
	const inRangeBand =
		day.isInRange ||
		((day.isRangeStart || day.isRangeEnd) &&
			!(day.isRangeStart && day.isRangeEnd));
	const hasEnd = day.isRangeStart && inRangeBand;
	const hasStart = day.isRangeEnd && inRangeBand;

	return (
		<View {...props} {...styles.dayCell(props)}>
			{/* The range band runs behind the days, cut in half on its first and last day. */}
			{inRangeBand ? <View {...styles.band(hasEnd, hasStart)} /> : null}
			<DayButton
				time={day.date.getTime()}
				formatDay={formatDay}
				today={day.isToday}
				outside={day.isOutside}
				inRange={day.isInRange}
				selected={day.isSelected}
				disabled={disabled}
				onSelect={select}
			>
				{children}
			</DayButton>
		</View>
	);
}

type DayButtonProps = {
	/** The day as a timestamp: a `Date` would be a new object on every render. */
	time: number;
	formatDay: (date: Date) => string;
	today: boolean;
	outside: boolean;
	inRange: boolean;
	selected: boolean;
	disabled: boolean;
	onSelect: (date: Date) => void;
	children?: ReactNode;
};

// Takes plain values only, so a press on one day renders the days that change and no other.
const DayButton = memo(function DayButton({
	time,
	formatDay,
	today,
	outside,
	inRange,
	selected,
	disabled,
	onSelect,
	children,
}: DayButtonProps) {
	const styles = useCalendarStyles();
	const date = new Date(time);
	const label = formatDay(date);

	return (
		<Tappable
			disabled={disabled}
			hitSlop={DAY_HIT_SLOP}
			accessibilityLabel={selected ? `${label}, selected` : label}
			accessibilityState={{ selected }}
			onPress={() => onSelect(date)}
			{...styles.day(today, outside, inRange, selected, disabled)}
		>
			{({ pressed }) => (
				<DayContext value={selected}>
					<Text
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						{...styles.dayText(
							today,
							outside,
							inRange,
							pressed,
							selected,
							disabled,
						)}
					>
						{date.getDate()}
					</Text>
					{children ? <View {...styles.under}>{children}</View> : null}
				</DayContext>
			)}
		</Tappable>
	);
});

/** A small dot under the day number, for days with events. */
export type CalendarDotProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Defaults to the `dot` color of the calendar tokens. */
	color?: string;
};

function CalendarDot({ color, ...props }: CalendarDotProps) {
	const styles = useCalendarStyles();
	const selected = use(DayContext);

	return <View {...props} {...styles.dot(selected, color, props)} />;
}

export const Calendar = {
	Root: CalendarRoot,
	Header: CalendarHeader,
	Title: CalendarTitle,
	Nav: CalendarNav,
	PrevButton: CalendarPrevButton,
	NextButton: CalendarNextButton,
	Grid: CalendarGrid,
	Weekdays: CalendarWeekdays,
	Days: CalendarDays,
	Day: CalendarDay,
	Dot: CalendarDot,
};
