import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const ToolBarIcon = withUnistyles(Icon);

export function useToolBarStyles() {
	return {
		bar: (
			placement: ToolBarPlacement,
			safeArea: boolean,
			justify: ToolBarJustify,
			{ style }: Pick<ToolBarProps, "style">,
		) => ({ style: [styles.bar(placement, safeArea, justify), style] }),
		action: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
			{ style }: Pick<ToolBarActionProps, "style">,
		) => ({ style: [styles.action(selected, destructive, disabled), style] }),
		tint: (selected: boolean, destructive: boolean, disabled: boolean) => ({
			uniProps: (theme: Theme) => ({
				color: actionColors(
					theme.components,
					selected,
					destructive,
					disabled,
				).content,
			}),
		}),
		actionLabel: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
		) => ({ style: styles.actionLabel(selected, destructive, disabled) }),
		separator: (
			placement: ToolBarPlacement,
			{ style }: Pick<ToolBarSeparatorProps, "style">,
		) => ({ style: [styles.separator(placement), style] }),
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	bar: (
		placement: ToolBarPlacement,
		safeArea: boolean,
		justify: ToolBarJustify,
	) => {
		const floating = placement === "floating";
		const colors = theme.components.toolBar[placement].default;

		return {
			flexDirection: "row",
			alignItems: "center",
			borderCurve: "continuous",
			...(floating
				? { borderWidth: StyleSheet.hairlineWidth }
				: { borderTopWidth: StyleSheet.hairlineWidth }),
			paddingBottom: floating
				? theme.tokens.spacing[2]
				: theme.tokens.spacing[2] + (safeArea ? rt.insets.bottom : 0),
			paddingTop: theme.tokens.spacing[2],
			paddingHorizontal: theme.tokens.spacing[2],
			justifyContent: JUSTIFY[justify],
			gap: theme.tokens.spacing[1],
			backgroundColor: colors.background,
			borderColor: colors.border,
			borderRadius: floating ? theme.tokens.radius.full : 0,
			marginHorizontal: floating ? theme.tokens.metrics.screenMargin : 0,
			marginBottom:
				floating && safeArea
					? rt.insets.bottom + theme.tokens.spacing[2]
					: 0,
		};
	},
	action: (selected: boolean, destructive: boolean, disabled: boolean) => ({
		alignItems: "center",
		justifyContent: "center",
		minHeight: theme.tokens.metrics.touchTarget,
		paddingHorizontal: theme.tokens.spacing[3],
		paddingVertical: theme.tokens.spacing[1],
		gap: 2,
		borderRadius: theme.tokens.radius.md,
		backgroundColor: actionColors(
			theme.components,
			selected,
			destructive,
			disabled,
		).background,
	}),
	actionLabel: (
		selected: boolean,
		destructive: boolean,
		disabled: boolean,
	) => ({
		color: actionColors(theme.components, selected, destructive, disabled)
			.content,
	}),
	separator: (placement: ToolBarPlacement) => ({
		width: StyleSheet.hairlineWidth,
		height: 24,
		alignSelf: "center",
		backgroundColor: theme.components.toolBar[placement].default.separator,
	}),
}));
