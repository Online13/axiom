import {
	createContext,
	use,
	useMemo,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

import { Tappable } from "@/components/core/tappable";
import { IconButton, type IconButtonProps } from "@/components/ui/icon-button";
import {
	FONT_WEIGHT,
	MAX_FONT_SCALE,
	Text,
	TEXT_VARIANT_TOKEN,
	type TextVariant,
} from "@/components/ui/text";
import { useTheme, type TypographyVariant } from "@/theme";

import {
	CalendarContext,
	useCalendar,
	useCalendarState,
	type DayState,
	type UseCalendarOptions,
} from "../use-calendar";

export {
	useCalendar,
	type CalendarSelection,
	type DateRange,
	type DayState,
} from "../use-calendar";

export type CalendarRootProps = ComponentPropsWithRef<typeof View> &
	UseCalendarOptions;

function CalendarRoot({
	children,
	style,
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
	const { tokens } = useTheme();
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
			<View {...props} style={[{ gap: tokens.spacing[3] }, style]}>
				{children}
			</View>
		</CalendarContext>
	);
}

export type CalendarHeaderProps = ComponentPropsWithRef<typeof View>;

function CalendarHeader({ children, style, ...props }: CalendarHeaderProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[
				styles.header,
				{ gap: tokens.spacing[2], paddingStart: tokens.spacing[2] },
				style,
			]}
		>
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
	style,
	...props
}: CalendarTitleProps) {
	const { tokens, colors } = useTheme();
	const { month, locale } = useCalendar();
	const label = new Intl.DateTimeFormat(
		locale,
		format === "month"
			? { month: "long" }
			: { month: "long", year: "numeric" },
	).format(month);
	const typography =
		tokens.typography[
			variant in TEXT_VARIANT_TOKEN
				? TEXT_VARIANT_TOKEN[variant as TextVariant]
				: (variant as TypographyVariant)
		];

	return (
		// Announces the new month after navigation.
		<View
			accessibilityLiveRegion="polite"
			{...props}
			style={[styles.title, style]}
		>
			{children ? (
				children(month)
			) : (
				<Text
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					style={[typography, { color: colors.content.default }]}
				>
					{label.charAt(0).toUpperCase() + label.slice(1)}
				</Text>
			)}
		</View>
	);
}

export type CalendarNavProps = ComponentPropsWithRef<typeof View>;

function CalendarNav({ children, style, ...props }: CalendarNavProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[styles.header, { gap: tokens.spacing[1] }, style]}
		>
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
	style,
	...props
}: CalendarGridProps) {
	const { tokens } = useTheme();
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
			<View {...props} style={[{ gap: tokens.spacing[1] }, style]}>
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
	style,
	...props
}: CalendarWeekdaysProps) {
	const { weekdays } = useCalendar();

	return (
		<View
			{...props}
			style={[styles.week, style]}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
		>
			{weekdays(format).map((name, i) => (
				<View key={i} style={styles.cell}>
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
	const calendar = useCalendar();

	return (
		<View {...props}>
			{calendar.weeks(weeks).map((week) => (
				<View key={week[0].key} style={styles.week}>
					{week.map((day) => (
						<View key={day.key} style={styles.cell}>
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

const CELL = 40;

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
	style,
	...props
}: CalendarDayProps) {
	const { tokens, components } = useTheme();
	const { select, locale } = useCalendar();
	const states = components.calendar.day;
	const selected = day.isSelected;
	const inRangeBand =
		day.isInRange ||
		((day.isRangeStart || day.isRangeEnd) &&
			!(day.isRangeStart && day.isRangeEnd));
	const hasEnd = day.isRangeStart && inRangeBand;
	const hasStart = day.isRangeEnd && inRangeBand;

	const colorsFor = (pressed: boolean) => ({
		...states.default,
		...(day.isToday ? states.today : undefined),
		...(day.isOutside ? states.outside : undefined),
		...(day.isInRange ? states.inRange : undefined),
		...(pressed && !selected ? states.pressed : undefined),
		...(selected ? states.selected : undefined),
		...(disabled ? states.disabled : undefined),
	});

	const label = new Intl.DateTimeFormat(locale, {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(day.date);

	return (
		<View {...props} style={[styles.dayCell, style]}>
			{/* The range band runs behind the days, cut in half on its first and last day. */}
			{inRangeBand ? (
				<View
					style={[
						styles.band,
						{ backgroundColor: states.default.range },
						hasEnd && { left: "50%" },
						hasStart && { right: "50%" },
					]}
				/>
			) : null}
			<Tappable
				disabled={disabled}
				accessibilityLabel={selected ? `${label}, selected` : label}
				accessibilityState={{ selected }}
				onPress={() => select(day.date)}
				style={({ pressed }) => [
					styles.day,
					{
						borderRadius: CELL / 2,
						backgroundColor:
							colorsFor(pressed).background ?? "transparent",
					},
				]}
			>
				{({ pressed }) => {
					const colors = colorsFor(pressed);
					return (
						<DayContext value={{ selected }}>
							<Text
								maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
								style={[
									tokens.typography.callout,
									{
										color: colors.foreground,
										fontWeight:
											day.isToday || selected
												? FONT_WEIGHT.semibold
												: undefined,
									},
								]}
							>
								{day.date.getDate()}
							</Text>
							{children ? (
								<View style={styles.under}>{children}</View>
							) : null}
						</DayContext>
					);
				}}
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

function CalendarDot({ color, style, ...props }: CalendarDotProps) {
	const { components } = useTheme();
	const day = use(DayContext);
	const states = components.calendar.day;
	const fill = day?.selected
		? (states.selected?.dot ?? states.default.dot)
		: (color ?? states.default.dot);

	return (
		<View {...props} style={[styles.dot, { backgroundColor: fill }, style]} />
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

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		flex: 1,
	},
	week: {
		flexDirection: "row",
	},
	cell: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		minHeight: CELL + 4,
	},
	dayCell: {
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	band: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 2,
		bottom: 2,
	},
	day: {
		width: CELL,
		height: CELL,
		alignItems: "center",
		justifyContent: "center",
	},
	under: {
		position: "absolute",
		bottom: 4,
	},
	dot: {
		width: 4,
		height: 4,
		borderRadius: 2,
	},
});
