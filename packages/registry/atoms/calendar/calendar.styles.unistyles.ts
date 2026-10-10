import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import {
	FONT_WEIGHT,
	TEXT_VARIANT_TOKEN,
	type TextVariant,
} from "@/components/ui/text";
import type { Theme, TypographyVariant } from "@/theme";

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
	return {
		root: ({ style }: Styled) => ({ style: [styles.root, style] }),
		header: ({ style }: Styled) => ({ style: [styles.header, style] }),
		title: ({ style }: Styled) => ({ style: [styles.title, style] }),
		titleText: (variant: TextVariant | TypographyVariant) => ({
			style: styles.titleText(variant),
		}),
		nav: ({ style }: Styled) => ({ style: [styles.nav, style] }),
		grid: ({ style }: Styled) => ({ style: [styles.grid, style] }),
		weekdays: ({ style }: Styled) => ({ style: [styles.week, style] }),
		week: { style: styles.week },
		cell: { style: styles.cell },
		dayCell: ({ style }: Styled) => ({ style: [styles.dayCell, style] }),
		band: (hasEnd: boolean, hasStart: boolean) => ({
			style: styles.band(hasEnd, hasStart),
		}),
		day: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			style: ({ pressed }: TappableState) =>
				styles.day(today, outside, inRange, pressed, selected, disabled),
		}),
		dayText: (
			today: boolean,
			outside: boolean,
			inRange: boolean,
			pressed: boolean,
			selected: boolean,
			disabled: boolean,
		) => ({
			style: styles.dayText(
				today,
				outside,
				inRange,
				pressed,
				selected,
				disabled,
			),
		}),
		under: { style: styles.under },
		dot: (
			selected: boolean,
			color: string | undefined,
			{ style }: Pick<CalendarDotProps, "style">,
		) => ({ style: [styles.dot(selected, color), style] }),
	};
}

const styles = StyleSheet.create((theme) => ({
	root: {
		gap: theme.tokens.spacing[3],
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
		paddingStart: theme.tokens.spacing[2],
	},
	nav: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	title: {
		flex: 1,
	},
	titleText: (variant: TextVariant | TypographyVariant) => ({
		...theme.tokens.typography[
			variant in TEXT_VARIANT_TOKEN
				? TEXT_VARIANT_TOKEN[variant as TextVariant]
				: (variant as TypographyVariant)
		],
		color: theme.colors.content.default,
	}),
	grid: {
		gap: theme.tokens.spacing[1],
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
	band: (hasEnd: boolean, hasStart: boolean) => ({
		position: "absolute",
		left: hasEnd ? "50%" : 0,
		right: hasStart ? "50%" : 0,
		top: 2,
		bottom: 2,
		backgroundColor: theme.components.calendar.day.default.range,
	}),
	day: (
		today: boolean,
		outside: boolean,
		inRange: boolean,
		pressed: boolean,
		selected: boolean,
		disabled: boolean,
	) => ({
		width: CELL,
		height: CELL,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: CELL / 2,
		backgroundColor:
			dayColors(
				theme.components,
				today,
				outside,
				inRange,
				pressed,
				selected,
				disabled,
			).background ?? "transparent",
	}),
	dayText: (
		today: boolean,
		outside: boolean,
		inRange: boolean,
		pressed: boolean,
		selected: boolean,
		disabled: boolean,
	) => ({
		...theme.tokens.typography.callout,
		color: dayColors(
			theme.components,
			today,
			outside,
			inRange,
			pressed,
			selected,
			disabled,
		).foreground,
		fontWeight: today || selected ? FONT_WEIGHT.semibold : undefined,
	}),
	under: {
		position: "absolute",
		bottom: 4,
	},
	dot: (selected: boolean, color: string | undefined) => {
		const states = theme.components.calendar.day;
		return {
			width: 4,
			height: 4,
			borderRadius: 2,
			backgroundColor: selected
				? stateColors(states, "selected").dot
				: (color ?? states.default.dot),
		};
	},
}));
