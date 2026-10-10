import {
	createContext,
	use,
	isValidElement,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { IconName } from "@/components/ui/icons";

import { ToolBarIcon, useToolBarStyles } from "./tool-bar.styles";

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
	...props
}: ToolBarProps) {
	const styles = useToolBarStyles();

	return (
		<PlacementContext value={placement}>
			<View
				{...props}
				accessibilityRole="toolbar"
				accessibilityLabel={accessibilityLabel}
				{...styles.bar(placement, safeArea, justify, props)}
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
	...props
}: ToolBarActionProps) {
	const styles = useToolBarStyles();
	const placement = use(PlacementContext);
	const withLabel = showLabel ?? placement === "docked";

	return (
		<Tappable
			{...props}
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ selected, disabled }}
			disabled={disabled}
			onPress={onPress}
			{...styles.action(selected, destructive, disabled, props)}
		>
			{isValidElement(icon) ? (
				icon
			) : (
				<ToolBarIcon
					name={icon as IconName}
					size="md"
					{...styles.tint(selected, destructive, disabled)}
				/>
			)}
			{withLabel ? (
				<Text
					variant="caption"
					maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
					numberOfLines={1}
					{...styles.actionLabel(selected, destructive, disabled)}
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

function ToolBarSeparator(props: ToolBarSeparatorProps) {
	const styles = useToolBarStyles();
	const placement = use(PlacementContext);

	return (
		<View
			{...props}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			{...styles.separator(placement, props)}
		/>
	);
}

export const ToolBar = Object.assign(ToolBarRoot, {
	Action: ToolBarAction,
	Separator: ToolBarSeparator,
});
