import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

import type {
	BottomTabBarActionProps,
	BottomTabBarItemProps,
	BottomTabBarProps,
	BottomTabBarVariant,
} from "./bottom-tab-bar";
import { stateColors } from "@/theme/components/states";

// A disabled item keeps its disabled color, active or not.
function itemColors(
	components: Theme["components"],
	active: boolean,
	disabled: boolean,
) {
	const states = components.bottomTabBar.item;
	return stateColors(states, disabled ? "disabled" : active && "active");
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const BottomTabBarIcon = withUnistyles(Icon);

export function useBottomTabBarStyles() {
	return {
		bar: (
			variant: BottomTabBarVariant,
			safeArea: boolean,
			{ style }: Pick<BottomTabBarProps, "style">,
		) => ({ style: [styles.bar(variant, safeArea), style] }),
		action: ({ style }: Pick<BottomTabBarActionProps, "style">) => ({
			style: [styles.action, style],
		}),
		item: ({ style }: Pick<BottomTabBarItemProps, "style">) => ({
			style: [styles.item, style],
		}),
		tint: (active: boolean, disabled: boolean) => ({
			uniProps: (theme: Theme) => ({
				color: itemColors(theme.components, active, disabled).content,
			}),
		}),
		label: (active: boolean, disabled: boolean) => ({
			style: styles.label(active, disabled),
		}),
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	bar: (variant: BottomTabBarVariant, safeArea: boolean) => {
		const floating = variant === "floating";
		const colors = theme.components.bottomTabBar[variant].default;

		return {
			flexDirection: "row",
			alignItems: floating ? "center" : "flex-end",
			...(floating
				? {
						borderWidth: StyleSheet.hairlineWidth,
						borderCurve: "continuous",
					}
				: { borderTopWidth: StyleSheet.hairlineWidth }),
			paddingTop: theme.tokens.spacing[1],
			paddingBottom: floating
				? theme.tokens.spacing[1]
				: theme.tokens.spacing[1] + (safeArea ? rt.insets.bottom : 0),
			paddingHorizontal: theme.tokens.spacing[1],
			backgroundColor: colors.background,
			borderColor: colors.border,
			borderRadius: floating ? theme.tokens.radius.xl : 0,
			marginHorizontal: floating ? theme.tokens.metrics.screenMargin : 0,
			marginBottom:
				floating && safeArea
					? rt.insets.bottom + theme.tokens.spacing[2]
					: 0,
		};
	},
	item: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		minHeight: theme.tokens.metrics.touchTarget,
		paddingVertical: theme.tokens.spacing[1],
		gap: 2,
	},
	label: (active: boolean, disabled: boolean) => ({
		color: itemColors(theme.components, active, disabled).content,
	}),
	action: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
}));
