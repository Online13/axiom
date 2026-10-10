import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

import type {
	ToolBarActionProps,
	ToolBarJustify,
	ToolBarPlacement,
	ToolBarProps,
	ToolBarSeparatorProps,
} from "./tool-bar";
import { stateColors } from "@/theme/components/states";

const JUSTIFY = {
	start: "flex-start",
	center: "center",
	between: "space-between",
	around: "space-around",
} as const;

// Later states win: selected, then destructive, then disabled.
function actionColors(
	components: Theme["components"],
	selected: boolean,
	destructive: boolean,
	disabled: boolean,
) {
	const states = components.toolBar.action;
	return stateColors(
		states,
		selected && "selected",
		destructive && "destructive",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop.
export const ToolBarIcon = Icon;

export function useToolBarStyles() {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();

	return {
		bar: (
			placement: ToolBarPlacement,
			safeArea: boolean,
			justify: ToolBarJustify,
			{ style }: Pick<ToolBarProps, "style">,
		) => ({
			style: [
				placement === "floating" ? styles.floating : styles.docked,
				{
					paddingBottom:
						placement === "floating"
							? tokens.spacing[2]
							: tokens.spacing[2] + (safeArea ? insets.bottom : 0),
					paddingTop: tokens.spacing[2],
					paddingHorizontal: tokens.spacing[2],
					justifyContent: JUSTIFY[justify],
					gap: tokens.spacing[1],
					backgroundColor:
						components.toolBar[placement].default.background,
					borderColor: components.toolBar[placement].default.border,
					borderRadius: placement === "floating" ? tokens.radius.full : 0,
					marginHorizontal:
						placement === "floating" ? tokens.metrics.screenMargin : 0,
					marginBottom:
						placement === "floating" && safeArea
							? insets.bottom + tokens.spacing[2]
							: 0,
				},
				style,
			],
		}),
		action: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
			{ style }: Pick<ToolBarActionProps, "style">,
		) => ({
			style: [
				styles.action,
				{
					minHeight: tokens.metrics.touchTarget,
					paddingHorizontal: tokens.spacing[3],
					paddingVertical: tokens.spacing[1],
					gap: 2,
					borderRadius: tokens.radius.md,
					backgroundColor: actionColors(
						components,
						selected,
						destructive,
						disabled,
					).background,
				},
				style,
			],
		}),
		tint: (selected: boolean, destructive: boolean, disabled: boolean) => ({
			color: actionColors(components, selected, destructive, disabled)
				.content,
		}),
		actionLabel: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
		) => ({
			style: {
				color: actionColors(components, selected, destructive, disabled)
					.content,
			},
		}),
		separator: (
			placement: ToolBarPlacement,
			{ style }: Pick<ToolBarSeparatorProps, "style">,
		) => ({
			style: [
				styles.separator,
				{
					backgroundColor: components.toolBar[placement].default.separator,
				},
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	docked: {
		flexDirection: "row",
		alignItems: "center",
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	floating: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: StyleSheet.hairlineWidth,
		borderCurve: "continuous",
	},
	action: {
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		width: StyleSheet.hairlineWidth,
		height: 24,
		alignSelf: "center",
	},
});
