import type { ComponentProps } from "react";
import { View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type {
	TabItemProps,
	TabListScrollViewProps,
	TabListViewProps,
	TabPagerProps,
	TabPanelProps,
	TabVariant,
} from "./tab";

const INDICATOR_HEIGHT = 2;

type State = "default" | "selected" | "disabled";

// Every class is written whole, so Tailwind finds it. The colors are the tab's own tokens, in
// `theme/components/tab.css`.
const LIST: Record<TabVariant, string> = {
	underline:
		"flex-row items-stretch border-b-tab-underline-border bg-tab-underline",
	pill: "flex-row items-stretch rounded-full bg-tab-pill p-1",
};

const INDICATOR: Record<TabVariant, string> = {
	underline: "flex-1 bg-tab-underline-indicator",
	pill: "flex-1 rounded-full bg-tab-pill-indicator",
};

const CONTENT: Record<TabVariant, Record<State, string>> = {
	underline: {
		default: "text-tab-underline-content",
		selected: "text-tab-underline-content-selected",
		disabled: "text-tab-underline-content-disabled",
	},
	pill: {
		default: "text-tab-pill-content",
		selected: "text-tab-pill-content-selected",
		disabled: "text-tab-pill-content-disabled",
	},
};

// The same again, as the `accent-` classes Uniwind reads a color prop from.
const TINT: Record<TabVariant, Record<State, string>> = {
	underline: {
		default: "accent-tab-underline-content",
		selected: "accent-tab-underline-content-selected",
		disabled: "accent-tab-underline-content-disabled",
	},
	pill: {
		default: "accent-tab-pill-content",
		selected: "accent-tab-pill-content-selected",
		disabled: "accent-tab-pill-content-disabled",
	},
};

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const TabIcon = withUniwind(Icon);

type IndicatorProps = ComponentProps<typeof Animated.View> & {
	indicatorClassName?: string;
};

/**
 * The indicator, which slides. An animated view takes `style` only, so it keeps what places it,
 * and the view inside it takes the classes that draw it.
 */
export function TabIndicator({ indicatorClassName, ...props }: IndicatorProps) {
	return (
		<Animated.View {...props}>
			<View className={indicatorClassName} />
		</Animated.View>
	);
}

// A disabled item keeps its disabled color, selected or not.
const stateOf = (selected: boolean, disabled: boolean): State =>
	disabled ? "disabled" : selected ? "selected" : "default";

// Only the device knows the width of a hairline: the line under an underlined list stays a style.
const listStyle = (variant: TabVariant) =>
	variant === "pill" ? undefined : { borderBottomWidth: metrics.hairline };

export function useTabStyles() {
	return {
		indicator: (variant: TabVariant) => ({
			indicatorClassName: INDICATOR[variant],
		}),
		indicatorFrame: (variant: TabVariant) =>
			(variant === "pill"
				? { position: "absolute", top: 4, bottom: 4, start: 0 }
				: {
						position: "absolute",
						bottom: 0,
						start: 0,
						height: INDICATOR_HEIGHT,
					}) satisfies ViewStyle,
		scrollList: (
			variant: TabVariant,
			{
				className,
				contentContainerClassName,
				contentContainerStyle,
			}: Pick<
				TabListScrollViewProps,
				"className" | "contentContainerClassName" | "contentContainerStyle"
			>,
		) => ({
			className: cx("grow-0", className),
			contentContainerClassName: cx(
				LIST[variant],
				contentContainerClassName,
			),
			contentContainerStyle: [listStyle(variant), contentContainerStyle],
		}),
		list: (
			variant: TabVariant,
			{ className, style }: Pick<TabListViewProps, "className" | "style">,
		) => ({
			className: cx(LIST[variant], "self-stretch", className),
			style: [listStyle(variant), style],
		}),
		item: (
			scrollable: boolean,
			{ className }: Pick<TabItemProps, "className">,
		) => ({
			className: cx(
				"min-h-touch-target flex-row items-center justify-center gap-1 px-3",
				!scrollable && "flex-1",
				className,
			),
		}),
		// The item is laid out by its classes: nothing goes before the caller's style.
		itemStyle: (scrollable: boolean) => undefined,
		tint: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			colorClassName: TINT[variant][stateOf(selected, disabled)],
		}),
		label: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
			className: CONTENT[variant][stateOf(selected, disabled)],
		}),
		pager: ({ className }: Pick<TabPagerProps, "className">) => ({
			className: cx("flex-1", className),
		}),
		// In a pager, each panel is as wide as a page.
		panel: (
			pageWidth: number | undefined,
			{ className, style }: Pick<TabPanelProps, "className" | "style">,
		) => ({
			className: cx("flex-1", className),
			style: [pageWidth !== undefined && { width: pageWidth }, style],
		}),
	};
}
