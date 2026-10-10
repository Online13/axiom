import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const TabIcon = withUnistyles(Icon);
// The indicator, which slides: with styles, the animated view takes them all.
export const TabIndicator = Animated.View;

export function useTabStyles() {
	return {
		indicator: (variant: TabVariant) => ({}),
		indicatorFrame: (variant: TabVariant) => styles.indicator(variant),
		scrollList: (
			variant: TabVariant,
			{
				style,
				contentContainerStyle,
			}: Pick<TabListScrollViewProps, "style" | "contentContainerStyle">,
		) => ({
			style: [styles.row, style],
			contentContainerStyle: [
				styles.list(variant, false),
				contentContainerStyle,
			],
		}),
		list: (
			variant: TabVariant,
			{ style }: Pick<TabListViewProps, "style">,
		) => ({ style: [styles.list(variant, true), style] }),
		// The item is laid out by `itemStyle`: nothing is added to its props.
		item: (scrollable: boolean, props: object) => ({}),
		itemStyle: (scrollable: boolean) => styles.item(scrollable),
		tint: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			uniProps: (theme: Theme) => ({
				color: tabItemColors(theme.components, variant, selected, disabled)
					.content,
			}),
		}),
		label: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			style: styles.label(variant, selected, disabled),
		}),
		pager: ({ style }: Pick<TabPagerProps, "style">) => ({
			style: [styles.pager, style],
		}),
		panel: (
			pageWidth: number | undefined,
			{ style }: Pick<TabPanelProps, "style">,
		) => ({ style: [styles.panel(pageWidth), style] }),
	};
}

const styles = StyleSheet.create((theme) => ({
	list: (variant: TabVariant, stretch: boolean) => {
		const pill = variant === "pill";
		const colors = theme.components.tab[variant].default;
		return {
			flexDirection: "row",
			alignItems: "stretch",
			...(stretch && { alignSelf: "stretch" }),
			padding: pill ? theme.tokens.spacing[1] : 0,
			borderRadius: pill ? theme.tokens.radius.full : 0,
			backgroundColor: colors.background,
			borderBottomWidth: pill ? 0 : StyleSheet.hairlineWidth,
			borderBottomColor: colors.border,
		};
	},
	indicator: (variant: TabVariant) => {
		const pill = variant === "pill";
		return {
			position: "absolute",
			start: 0,
			backgroundColor: theme.components.tab[variant].default.indicator,
			...(pill
				? { top: 4, bottom: 4, borderRadius: theme.tokens.radius.full }
				: { bottom: 0, height: INDICATOR_HEIGHT, borderRadius: 0 }),
		};
	},
	row: {
		flexGrow: 0,
	},
	pager: {
		flex: 1,
	},
	panel: (pageWidth: number | undefined) => ({
		flex: 1,
		...(pageWidth !== undefined && { width: pageWidth }),
	}),
	item: (scrollable: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		...(!scrollable && { flex: 1 }),
		minHeight: theme.tokens.metrics.touchTarget,
		paddingHorizontal: theme.tokens.spacing[3],
		gap: theme.tokens.spacing[1],
	}),
	label: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
		color: tabItemColors(theme.components, variant, selected, disabled)
			.content,
	}),
}));
