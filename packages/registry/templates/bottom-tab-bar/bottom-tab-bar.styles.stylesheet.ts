import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

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

// The icon takes its color as a prop.
export const BottomTabBarIcon = Icon;

export function useBottomTabBarStyles() {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();

	return {
		bar: (
			variant: BottomTabBarVariant,
			safeArea: boolean,
			{ style }: Pick<BottomTabBarProps, "style">,
		) => ({
			style: [
				variant === "floating" ? styles.floating : styles.fixed,
				{
					paddingTop: tokens.spacing[1],
					paddingBottom:
						variant === "floating"
							? tokens.spacing[1]
							: tokens.spacing[1] + (safeArea ? insets.bottom : 0),
					paddingHorizontal: tokens.spacing[1],
					backgroundColor:
						components.bottomTabBar[variant].default.background,
					borderColor: components.bottomTabBar[variant].default.border,
					borderRadius: variant === "floating" ? tokens.radius.xl : 0,
					marginHorizontal:
						variant === "floating" ? tokens.metrics.screenMargin : 0,
					marginBottom:
						variant === "floating" && safeArea
							? insets.bottom + tokens.spacing[2]
							: 0,
				},
				style,
			],
		}),
		action: ({ style }: Pick<BottomTabBarActionProps, "style">) => ({
			style: [styles.action, style],
		}),
		item: ({ style }: Pick<BottomTabBarItemProps, "style">) => ({
			style: [
				styles.item,
				{
					minHeight: tokens.metrics.touchTarget,
					paddingVertical: tokens.spacing[1],
					gap: 2,
				},
				style,
			],
		}),
		tint: (active: boolean, disabled: boolean) => ({
			color: itemColors(components, active, disabled).content,
		}),
		label: (active: boolean, disabled: boolean) => ({
			style: { color: itemColors(components, active, disabled).content },
		}),
	};
}

const styles = StyleSheet.create({
	fixed: {
		flexDirection: "row",
		alignItems: "flex-end",
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	floating: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: StyleSheet.hairlineWidth,
		borderCurve: "continuous",
	},
	item: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	action: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
});
