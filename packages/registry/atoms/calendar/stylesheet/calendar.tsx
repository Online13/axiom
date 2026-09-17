import { createContext, use, useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

import { Tappable } from '@/components/core/tappable';
import { IconButton, type IconButtonProps } from '@/components/ui/icon-button';
import { FONT_WEIGHT, MAX_FONT_SCALE, Text, TEXT_VARIANT_TOKEN, type TextVariant } from '@/components/ui/text';
import { useTheme, type TypographyVariant } from '@/theme';

import { CalendarContext, useCalendar, useCalendarState, type DayState, type UseCalendarOptions } from '../use-calendar';

export { useCalendar, type CalendarSelection, type DateRange, type DayState } from '../use-calendar';

export type CalendarRootProps = UseCalendarOptions & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function CalendarRoot({ children, style, ...options }: CalendarRootProps) {
  const { tokens } = useTheme();
  const calendar = useCalendarState(options);

  return (
    <CalendarContext value={calendar}>
      <View style={[{ gap: tokens.spacing[3] }, style]}>{children}</View>
    </CalendarContext>
  );
}

function CalendarHeader({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { tokens } = useTheme();
  return <View style={[styles.header, { gap: tokens.spacing[2], paddingStart: tokens.spacing[2] }, style]}>{children}</View>;
}

export type CalendarTitleProps = {
  format?: 'month' | 'month-year';
  /** A Text variant, or a system typography style such as `headline`. */
  variant?: TextVariant | TypographyVariant;
  children?: (month: Date) => ReactNode;
};

function CalendarTitle({ format = 'month-year', variant = 'headline', children }: CalendarTitleProps) {
  const { tokens, colors } = useTheme();
  const { month, locale } = useCalendar();
  const label = new Intl.DateTimeFormat(locale, format === 'month' ? { month: 'long' } : { month: 'long', year: 'numeric' }).format(month);
  const typography = tokens.typography[variant in TEXT_VARIANT_TOKEN ? TEXT_VARIANT_TOKEN[variant as TextVariant] : (variant as TypographyVariant)];

  return (
    // Announces the new month after navigation.
    <View accessibilityLiveRegion="polite" style={styles.title}>
      {children ? (
        children(month)
      ) : (
        <Text maxFontSizeMultiplier={MAX_FONT_SCALE.control} style={[typography, { color: colors.content.default }]}>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
      )}
    </View>
  );
}

function CalendarNav({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  return <View style={[styles.header, { gap: tokens.spacing[1] }]}>{children}</View>;
}

type NavButtonProps = Partial<Omit<IconButtonProps, 'onPress'>>;

function CalendarPrevButton({ icon = 'chevron-left', size = 'sm', accessibilityLabel = 'Previous month', ...props }: NavButtonProps) {
  const { canGoPrev, goToPrev } = useCalendar();
  return <IconButton {...props} icon={icon} size={size} accessibilityLabel={accessibilityLabel} disabled={!canGoPrev} onPress={goToPrev} />;
}

function CalendarNextButton({ icon = 'chevron-right', size = 'sm', accessibilityLabel = 'Next month', ...props }: NavButtonProps) {
  const { canGoNext, goToNext } = useCalendar();
  return <IconButton {...props} icon={icon} size={size} accessibilityLabel={accessibilityLabel} disabled={!canGoNext} onPress={goToNext} />;
}

function CalendarGrid({ swipeable = true, children, style }: { swipeable?: boolean; children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { tokens } = useTheme();
  const { goToPrev, goToNext } = useCalendar();

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeable)
        .activeOffsetX([-20, 20])
        .failOffsetY([-12, 12])
        .onEnd((event) => {
          if (event.translationX < -40 || event.velocityX < -600) scheduleOnRN(goToNext);
          else if (event.translationX > 40 || event.velocityX > 600) scheduleOnRN(goToPrev);
        }),
    [swipeable, goToNext, goToPrev],
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={[{ gap: tokens.spacing[1] }, style]}>{children}</View>
    </GestureDetector>
  );
}

function CalendarWeekdays({ format = 'short' }: { format?: 'short' | 'narrow' }) {
  const { weekdays } = useCalendar();

  return (
    <View style={styles.week} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {weekdays(format).map((name, i) => (
        <View key={i} style={styles.cell}>
          <Text variant="caption" color="muted" weight="medium" maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}>
            {name}
          </Text>
        </View>
      ))}
    </View>
  );
}

export type CalendarDaysProps = {
  /** `fit`: rows the month needs. `fixed`: always 6. A number: that many weeks. */
  weeks?: 'fit' | 'fixed' | number;
  showOutsideDays?: boolean;
  children?: (day: DayState) => ReactNode;
};

function CalendarDays({ weeks = 'fit', showOutsideDays = true, children }: CalendarDaysProps) {
  const calendar = useCalendar();

  return (
    <View>
      {calendar.weeks(weeks).map((week) => (
        <View key={week[0].key} style={styles.week}>
          {week.map((day) => (
            <View key={day.key} style={styles.cell}>
              {day.isOutside && !showOutsideDays ? null : children ? children(day) : <CalendarDay day={day} />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const DayContext = createContext<{ selected: boolean } | null>(null);

const CELL = 40;

export type CalendarDayProps = {
  day: DayState;
  disabled?: boolean;
  /** Content under the number, such as a `Calendar.Dot`. */
  children?: ReactNode;
};

function CalendarDay({ day, disabled = day.isDisabled, children }: CalendarDayProps) {
  const { tokens, components } = useTheme();
  const { select, locale } = useCalendar();
  const states = components.calendar.day;
  const selected = day.isSelected;
  const inRangeBand = day.isInRange || ((day.isRangeStart || day.isRangeEnd) && !(day.isRangeStart && day.isRangeEnd));
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

  const label = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(day.date);

  return (
    <View style={styles.dayCell}>
      {/* The range band runs behind the days, cut in half on its first and last day. */}
      {inRangeBand ? (
        <View
          style={[
            styles.band,
            { backgroundColor: states.default.range },
            hasEnd && { left: '50%' },
            hasStart && { right: '50%' },
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
          { borderRadius: CELL / 2, backgroundColor: colorsFor(pressed).background ?? 'transparent' },
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
                  { color: colors.foreground, fontWeight: day.isToday || selected ? FONT_WEIGHT.semibold : undefined },
                ]}
              >
                {day.date.getDate()}
              </Text>
              {children ? <View style={styles.under}>{children}</View> : null}
            </DayContext>
          );
        }}
      </Tappable>
    </View>
  );
}

/** A small dot under the day number, for days with events. */
function CalendarDot({ color }: { color?: string }) {
  const { components } = useTheme();
  const day = use(DayContext);
  const states = components.calendar.day;
  const fill = day?.selected ? (states.selected?.dot ?? states.default.dot) : (color ?? states.default.dot);

  return <View style={[styles.dot, { backgroundColor: fill }]} />;
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  week: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: CELL + 4,
  },
  dayCell: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 2,
    bottom: 2,
  },
  day: {
    width: CELL,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  under: {
    position: 'absolute',
    bottom: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
