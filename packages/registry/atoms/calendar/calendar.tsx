import {
	createContext,
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
	const label = new Intl.DateTimeFormat(
		locale,
		format === "month"
			? { month: "long" }
			: { month: "long", year: "numeric" },
	).format(month);

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

	return (
		<View
			{...props}
			{...styles.weekdays(props)}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
		>
			{weekdays(format).map((name, i) => (
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
			{calendar.weeks(weeks).map((week) => (
				<View key={week[0].key} {...styles.week}>
					{week.map((day) => (
						<View key={day.key} {...styles.cell}>
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

const DayContext = createContext<{ selected: boolean } | null>(null);

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
	const { select, locale } = useCalendar();
	const selected = day.isSelected;
	const inRangeBand =
		day.isInRange ||
		((day.isRangeStart || day.isRangeEnd) &&
			!(day.isRangeStart && day.isRangeEnd));
	const hasEnd = day.isRangeStart && inRangeBand;
	const hasStart = day.isRangeEnd && inRangeBand;

	const label = new Intl.DateTimeFormat(locale, {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(day.date);

	return (
		<View {...props} {...styles.dayCell(props)}>
			{/* The range band runs behind the days, cut in half on its first and last day. */}
			{inRangeBand ? <View {...styles.band(hasEnd, hasStart)} /> : null}
			<Tappable
				disabled={disabled}
				accessibilityLabel={selected ? `${label}, selected` : label}
				accessibilityState={{ selected }}
				onPress={() => select(day.date)}
				{...styles.day(
					day.isToday,
					day.isOutside,
					day.isInRange,
					selected,
					disabled,
				)}
			>
				{({ pressed }) => (
					<DayContext value={{ selected }}>
						<Text
							maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
							{...styles.dayText(
								day.isToday,
								day.isOutside,
								day.isInRange,
								pressed,
								selected,
								disabled,
							)}
						>
							{day.date.getDate()}
						</Text>
						{children ? <View {...styles.under}>{children}</View> : null}
					</DayContext>
				)}
			</Tappable>
		</View>
	);
}

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
	const day = use(DayContext);

	return (
		<View {...props} {...styles.dot(day?.selected ?? false, color, props)} />
	);
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
