import {
	createContext,
	use,
	isValidElement,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { IconName } from "@/components/ui/icons";
import { cx, useTheme } from "@/theme";

export type ToolBarPlacement = "docked" | "floating";
export type ToolBarJustify = "start" | "center" | "between" | "around";

const PlacementContext = createContext<ToolBarPlacement>("docked");

export type ToolBarProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Actions and optional separators. */
	children?: ReactNode;
	/** Attached to the bottom edge, or an inset capsule over the content. */
	placement?: ToolBarPlacement;
	/** Adds the bottom safe-area inset for a docked bar. Floating bars use a margin instead. */
	safeArea?: boolean;
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

/**
 * A static bar of actions. To show it only in a mode, such as a selection, render it conditionally
 * and animate it where you render it: `<Animated.View entering={FadeInDown} exiting={FadeOutDown}>`.
 */
function ToolBarRoot({
	children,
	placement = "docked",
	safeArea = true,
	justify = "around",
	accessibilityLabel = "Actions",
	className,
	style,
	...props
}: ToolBarProps) {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.toolBar[placement].default;

	const floating = placement === "floating";

	return (
		<PlacementContext value={placement}>
			<View
				{...props}
				accessibilityRole="toolbar"
				accessibilityLabel={accessibilityLabel}
				className={cx("flex-row items-center", className)}
				style={[
					floating
						? {
								borderWidth: tokens.metrics.hairline,
								borderCurve: "continuous",
							}
						: { borderTopWidth: tokens.metrics.hairline },
					{
						paddingBottom: floating
							? tokens.spacing[2]
							: tokens.spacing[2] + (safeArea ? insets.bottom : 0),
						paddingTop: tokens.spacing[2],
						paddingHorizontal: tokens.spacing[2],
						justifyContent: JUSTIFY[justify],
						gap: tokens.spacing[1],
						backgroundColor: colors.background,
						borderColor: colors.border,
						borderRadius: floating ? tokens.radius.full : 0,
						marginHorizontal: floating ? tokens.metrics.screenMargin : 0,
						marginBottom:
							floating && safeArea
								? insets.bottom + tokens.spacing[2]
								: 0,
					},
					style,
				]}
			>
				{children}
			</View>
		</PlacementContext>
	);
}

export type ToolBarActionProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	/** An icon of your registry, or your own node. */
	icon: IconName | ReactNode;
	/** Visible name in a docked bar, and the default accessible name. */
	label: string;
	onPress?: TappableProps["onPress"];
	disabled?: boolean;
	/** Error color, for an action such as Delete. It adds no confirmation by itself. */
	destructive?: boolean;
	/** Marks a toggle action such as Favorite as active. */
	selected?: boolean;
	/** Defaults to `true` on a docked bar. The accessible name stays either way. */
	showLabel?: boolean;
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
	...props
}: ToolBarActionProps) {
	const { tokens, components } = useTheme();
	const placement = use(PlacementContext);
	const states = components.toolBar.action;
	const colors = {
		...states.default,
		...(selected ? states.selected : undefined),
		...(destructive ? states.destructive : undefined),
		...(disabled ? states.disabled : undefined),
	};

	const withLabel = showLabel ?? placement === "docked";

	return (
		<Tappable
			{...props}
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ selected, disabled }}
			disabled={disabled}
			onPress={onPress}
			style={[
				{
					alignItems: "center",
					justifyContent: "center",
					minHeight: tokens.metrics.touchTarget,
					paddingHorizontal: tokens.spacing[3],
					paddingVertical: tokens.spacing[1],
					gap: 2,
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background,
				},
				style,
			]}
		>
			{isValidElement(icon) ? (
				icon
			) : (
				<Icon name={icon as IconName} size="md" color={colors.content} />
			)}
			{withLabel ? (
				<Text
					variant="caption"
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					numberOfLines={1}
					style={{ color: colors.content }}
				>
					{label}
				</Text>
			) : null}
		</Tappable>
	);
}

export type ToolBarSeparatorProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
>;

function ToolBarSeparator({
	className,
	style,
	...props
}: ToolBarSeparatorProps) {
	const { tokens, components } = useTheme();
	const placement = use(PlacementContext);

	return (
		<View
			{...props}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			className={cx("h-[24px] self-center", className)}
			style={[
				{
					width: tokens.metrics.hairline,
					backgroundColor: components.toolBar[placement].default.separator,
				},
				style,
			]}
		/>
	);
}

export const ToolBar = Object.assign(ToolBarRoot, {
	Action: ToolBarAction,
	Separator: ToolBarSeparator,
});
