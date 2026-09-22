import { createContext, use, isValidElement, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { IconName } from "@/components/ui/icons";
import type { Theme } from "@/theme";

import { useToolBar } from "../use-tool-bar";

export type ToolBarPlacement = "docked" | "floating";
export type ToolBarJustify = "start" | "center" | "between" | "around";

const PlacementContext = createContext<ToolBarPlacement>("docked");

export type ToolBarProps = {
	/** Actions and optional separators. */
	children?: ReactNode;
	/** Attached to the bottom edge, or an inset capsule over the content. */
	placement?: ToolBarPlacement;
	/** Adds the bottom safe-area inset for a docked bar. Floating bars use a margin instead. */
	safeArea?: boolean;
	/** Shows or hides the bar with its transition. */
	visible?: boolean;
	justify?: ToolBarJustify;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const JUSTIFY = {
	start: "flex-start",
	center: "center",
	between: "space-between",
	around: "space-around",
} as const;

function actionColors(
	components: Theme["components"],
	selected: boolean,
	destructive: boolean,
	disabled: boolean,
) {
	const states = components.toolBar.action;
	return {
		...states.default,
		...(selected ? states.selected : undefined),
		...(destructive ? states.destructive : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

function ToolBarRoot({
	children,
	placement = "docked",
	safeArea = true,
	visible = true,
	justify = "around",
	accessibilityLabel = "Actions",
	style,
}: ToolBarProps) {
	const { animatedStyle } = useToolBar(visible);

	return (
		<PlacementContext value={placement}>
			<Animated.View
				accessibilityRole="toolbar"
				accessibilityLabel={accessibilityLabel}
				// Hidden bars keep their space but take no touches.
				pointerEvents={visible ? "box-none" : "none"}
				style={[
					styles.bar(placement, safeArea, justify),
					animatedStyle,
					style,
				]}
			>
				{children}
			</Animated.View>
		</PlacementContext>
	);
}

export type ToolBarActionProps = {
	/** An icon of your registry, or your own node. */
	icon: IconName | ReactNode;
	/** Visible name in a docked bar, and the default accessible name. */
	label: string;
	onPress?: () => void;
	disabled?: boolean;
	/** Error color, for an action such as Delete. It adds no confirmation by itself. */
	destructive?: boolean;
	/** Marks a toggle action such as Favorite as active. */
	selected?: boolean;
	/** Defaults to `true` on a docked bar. The accessible name stays either way. */
	showLabel?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

function ToolBarAction({
	icon,
	label,
	onPress,
	disabled = false,
	destructive = false,
	selected = false,
	showLabel,
	accessibilityLabel,
	style,
}: ToolBarActionProps) {
	const placement = use(PlacementContext);
	const withLabel = showLabel ?? placement === "docked";

	return (
		<Tappable
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ selected, disabled }}
			disabled={disabled}
			onPress={onPress}
			style={[styles.action(selected, destructive, disabled), style]}
		>
			{isValidElement(icon) ? (
				icon
			) : (
				<ThemedIcon
					name={icon as IconName}
					size="md"
					uniProps={(theme) => ({
						color: actionColors(
							theme.components,
							selected,
							destructive,
							disabled,
						).content,
					})}
				/>
			)}
			{withLabel ? (
				<Text
					variant="caption"
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					numberOfLines={1}
					style={styles.actionLabel(selected, destructive, disabled)}
				>
					{label}
				</Text>
			) : null}
		</Tappable>
	);
}

export type ToolBarSeparatorProps = {
	style?: StyleProp<ViewStyle>;
};

function ToolBarSeparator({ style }: ToolBarSeparatorProps) {
	const placement = use(PlacementContext);

	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={[styles.separator(placement), style]}
		/>
	);
}

export const ToolBar = Object.assign(ToolBarRoot, {
	Action: ToolBarAction,
	Separator: ToolBarSeparator,
});

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
	action: (
		selected: boolean,
		destructive: boolean,
		disabled: boolean,
	) => ({
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
