import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Spacing } from "@/theme";

import { ChipIcon, useChipStyles } from "./chip.styles";

export type ChipVariant = "outline" | "filled";
export type ChipSize = "sm" | "md";

export type ChipProps = Omit<
	TappableProps,
	"children" | "style" | "onPress" | "disabled"
> & {
	children?: ReactNode;
	/** Setting it makes the chip a toggle. */
	selected?: boolean;
	/** Makes the chip pressable. Without it, the chip renders a plain `View` and ignores press props. */
	onPress?: TappableProps["onPress"];
	/** Shows a close icon that calls it, with its own touch area. */
	onRemove?: () => void;
	/** `outline` for filters, `filled` for tags and entered values. */
	variant?: ChipVariant;
	/** 28 or 34pt. The touch area stays 44pt. */
	size?: ChipSize;
	leading?: IconName | ReactElement;
	/** Ignored with `onRemove`. */
	trailing?: IconName | ReactElement;
	disabled?: boolean;
	/** Played on touch when the chip is pressable. Off unless you pass a kind. */
	haptic?: HapticKind | false;
	style?: StyleProp<ViewStyle>;
};

function ChipRoot({
	children,
	selected,
	onPress,
	onRemove,
	variant = "outline",
	size = "md",
	leading,
	trailing,
	disabled = false,
	haptic,
	accessibilityLabel,
	...props
}: ChipProps) {
	const styles = useChipStyles();
	const label =
		accessibilityLabel ??
		(typeof children === "string" ? children : undefined);
	const iconSize = size === "sm" ? 14 : 16;

	const renderIcon = (
		icon: IconName | ReactElement | undefined,
		pressed: boolean,
	) =>
		typeof icon === "string" ? (
			<ChipIcon
				name={icon}
				size={iconSize}
				{...styles.tint(variant, selected, pressed, disabled)}
			/>
		) : (
			icon
		);

	const content = (pressed: boolean) => (
		<>
			{renderIcon(leading, pressed)}
			{typeof children === "string" || typeof children === "number" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					{...styles.label(variant, size, selected, pressed, disabled)}
				>
					{children}
				</Text>
			) : (
				children
			)}
			{onRemove ? (
				<Tappable
					disabled={disabled}
					accessibilityLabel={label ? `Remove ${label}` : "Remove"}
					onPress={onRemove}
					{...styles.remove(size)}
				>
					<ChipIcon
						name="close"
						size={iconSize}
						{...styles.tint(variant, selected, pressed, disabled)}
					/>
				</Tappable>
			) : (
				renderIcon(trailing, pressed)
			)}
		</>
	);

	if (!onPress) {
		return (
			<View
				{...props}
				accessible={!onRemove}
				accessibilityLabel={label}
				{...styles.chip(
					variant,
					size,
					selected,
					disabled,
					leading !== undefined,
					trailing !== undefined,
					onRemove !== undefined,
					props,
				)}
			>
				{content(false)}
			</View>
		);
	}

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityRole={selected === undefined ? "button" : "togglebutton"}
			accessibilityLabel={label}
			accessibilityState={
				selected === undefined ? undefined : { checked: selected }
			}
			onPress={onPress}
			haptic={haptic}
			{...styles.pressableChip(
				variant,
				size,
				selected,
				disabled,
				leading !== undefined,
				trailing !== undefined,
				onRemove !== undefined,
				props,
			)}
		>
			{({ pressed }) => content(pressed)}
		</Tappable>
	);
}

type ChipGroupSharedProps = {
	children?: ReactNode;
	gap?: keyof Spacing;
};

export type ChipGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	ChipGroupSharedProps;

/**
 * Lays chips out on as many lines as they need. For one line that scrolls, put the group in a
 * horizontal ScrollView: it no longer has a width to wrap at.
 */
function ChipGroup({ gap = 2, ...props }: ChipGroupProps) {
	const styles = useChipStyles();

	return <View {...props} {...styles.group(gap, props)} />;
}

export const Chip = Object.assign(ChipRoot, { Group: ChipGroup });
