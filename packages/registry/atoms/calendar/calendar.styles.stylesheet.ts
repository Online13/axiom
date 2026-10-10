import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import {
	FONT_WEIGHT,
	TEXT_VARIANT_TOKEN,
	type TextVariant,
} from "@/components/ui/text";
import { useTheme, type Theme, type TypographyVariant } from "@/theme";

import type { CalendarDotProps } from "./calendar";
import { stateColors } from "@/theme/components/states";

type Styled = { style?: StyleProp<ViewStyle> };

const CELL = 40;

// Later states win, in this order. A selected day keeps its color while it is pressed.
function dayColors(
	components: Theme["components"],
	today: boolean,
	outside: boolean,
	inRange: boolean,
	pressed: boolean,
	selected: boolean,
	disabled: boolean,
) {
	const states = components.calendar.day;
	return stateColors(
		states,
		today && "today",
		outside && "outside",
		inRange && "inRange",
		pressed && !selected && "pressed",
		selected && "selected",
		disabled && "disabled",
	);
}

export function useCalendarStyles() {
	const { tokens, colors, components } = useTheme();

	return {
		root: ({ style }: Styled) => ({
			style: [{ gap: tokens.spacing[3] }, style],
		}),
		header: ({ style }: Styled) => ({
			style: [
				styles.header,
				{ gap: tokens.spacing[2], paddingStart: tokens.spacing[2] },
				style,
			],
		}),
		title: ({ style }: Styled) => ({ style: [styles.title, style] }),
		// A Text variant, or a typography token for a larger title.
		titleText: (variant: TextVariant | TypographyVariant) => ({
			style: [
				tokens.typography[
					variant in TEXT_VARIANT_TOKEN
						? TEXT_VARIANT_TOKEN[variant as TextVariant]
						: (variant as TypographyVariant)
				],
				{ color: colors.content.default },
			],
		}),
		nav: ({ style }: Styled) => ({
			style: [styles.header, { gap: tokens.spacing[1] }, style],
		}),
		grid: ({ style }: Styled) => ({
			style: [{ gap: tokens.spacing[1] }, style],
		}),
		weekdays: ({ style }: Styled) => ({ style: [styles.week, style] }),
		week: { style: styles.week },
		cell: { style: styles.cell },
		dayCell: ({ style }: Styled) => ({ style: [styles.dayCell, style] }),
		// The range band runs behind the days, cut in half on its first and last day.
		band: (hasEnd: boolean, hasStart: boolean) => ({
			style: [
				styles.band,
				{ backgroundColor: components.calendar.day.default.range },
				hasEnd && { left: "50%" as const },
				hasStart && { right: "50%" as const },
			],
		}),
		day: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.day,
				{
					borderRadius: CELL / 2,
					backgroundColor:
						dayColors(
							components,
							today,
							outside,
							inRange,
							pressed,
							selected,
							disabled,
						).background ?? "transparent",
				},
			],
		}),
		dayText: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			pressed: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			style: [
				tokens.typography.callout,
				{
					color: dayColors(
						components,
						today,
						outside,
						inRange,
						pressed,
						selected,
						disabled,
					).foreground,
					fontWeight: today || selected ? FONT_WEIGHT.semibold : undefined,
				},
			],
		}),
		under: { style: styles.under },
		// On a selected day, the dot takes the color that reads on the selection.
		dot: (
			selected: boolean,
			color: string | undefined,
			{ style }: Pick<CalendarDotProps, "style">,
		) => ({
			style: [
				styles.dot,
				{
					backgroundColor: selected
						? stateColors(components.calendar.day, "selected").dot
						: (color ?? components.calendar.day.default.dot),
				},
				style,
			],
		}),
	};
}

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
