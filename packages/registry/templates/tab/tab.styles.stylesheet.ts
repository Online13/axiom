import { StyleSheet, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

import type {
	TabListScrollViewProps,
	TabListViewProps,
	TabPagerProps,
	TabPanelProps,
	TabVariant,
} from "./tab";
import { stateColors } from "@/theme/components/states";

const INDICATOR_HEIGHT = 2;

// A disabled item keeps its disabled color, selected or not.
function tabItemColors(
	components: Theme["components"],
	variant: TabVariant,
	selected: boolean,
	disabled: boolean,
) {
	const states = components.tab[variant];
	return stateColors(states, disabled ? "disabled" : selected && "selected");
}

// The icon takes its color as a prop.
export const TabIcon = Icon;
// The indicator, which slides: with styles, the animated view takes them all.
export const TabIndicator = Animated.View;

export function useTabStyles() {
	const theme = useTheme();
	const { tokens, components } = theme;

	return {
		indicator: (variant: TabVariant) => ({}),
		indicatorFrame: (variant: TabVariant) => [
			variant === "pill" ? styles.pillIndicator : styles.underline,
			{
				backgroundColor: components.tab[variant].default.indicator,
				borderRadius: variant === "pill" ? tokens.radius.full : 0,
				height: variant === "pill" ? undefined : INDICATOR_HEIGHT,
			},
		],
		scrollList: (
			variant: TabVariant,
			{
				style,
				contentContainerStyle,
			}: Pick<TabListScrollViewProps, "style" | "contentContainerStyle">,
		) => ({
			style: [styles.row, style],
			contentContainerStyle: [
				styles.list,
				listStyle(theme, variant),
				contentContainerStyle,
			],
		}),
		list: (
			variant: TabVariant,
			{ style }: Pick<TabListViewProps, "style">,
		) => ({
			style: [styles.list, styles.stretch, listStyle(theme, variant), style],
		}),
		// The item is laid out by `itemStyle`: nothing is added to its props.
		item: (scrollable: boolean, props: object) => ({}),
		itemStyle: (scrollable: boolean) => [
			styles.item,
			!scrollable && styles.fill,
			{
				minHeight: tokens.metrics.touchTarget,
				paddingHorizontal: tokens.spacing[3],
				gap: tokens.spacing[1],
			},
		],
		tint: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			color: tabItemColors(components, variant, selected, disabled).content,
		}),
		label: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			style: {
				color: tabItemColors(components, variant, selected, disabled)
					.content,
			},
		}),
		pager: ({ style }: Pick<TabPagerProps, "style">) => ({
			style: [styles.pager, style],
		}),
		// In a pager, each panel is as wide as a page.
		panel: (
			pageWidth: number | undefined,
			{ style }: Pick<TabPanelProps, "style">,
		) => ({
			style: [
				styles.panel,
				pageWidth !== undefined && { width: pageWidth },
				style,
			],
		}),
	};
}

function listStyle(
	{ tokens, components }: Theme,
	variant: TabVariant,
): ViewStyle {
	const pill = variant === "pill";
	const colors = components.tab[variant].default;
	return {
		padding: pill ? tokens.spacing[1] : 0,
		borderRadius: pill ? tokens.radius.full : 0,
		backgroundColor: colors.background,
		borderBottomWidth: pill ? 0 : StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
	};
}

const styles = StyleSheet.create({
	list: {
		flexDirection: "row",
		alignItems: "stretch",
	},
	fill: {
		flex: 1,
	},
	stretch: {
		alignSelf: "stretch",
	},
	row: {
		flexGrow: 0,
	},
	pager: {
		flex: 1,
	},
	panel: {
		flex: 1,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	underline: {
		position: "absolute",
		bottom: 0,
		start: 0,
	},
	pillIndicator: {
		position: "absolute",
		top: 4,
		bottom: 4,
		start: 0,
	},
});
