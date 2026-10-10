import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { HapticKind } from "@/components/core/haptics";
import {
	Tappable,
	type TappableProps,
	type TappableState,
} from "@/components/core/tappable";
import type { IconName } from "@/components/ui/icon/icons";
import { MAX_FONT_SCALE, Text, FONT_WEIGHT } from "@/components/ui/text";
import type { Spacing, Theme } from "@/theme";

import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Icon } from "@/components/ui/icon/icon";
import { stateColors } from "@/theme/components/states";

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
				uniProps={(theme: Theme) => ({
					color: chipColors(
						theme.components,
						variant,
						selected,
						pressed,
						disabled,
					).foreground,
				})}
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
					style={styles.label(variant, size, selected, pressed, disabled)}
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
					style={styles.remove(size)}
				>
					<ChipIcon
						name="close"
						size={iconSize}
						uniProps={(theme: Theme) => ({
							color: chipColors(
								theme.components,
								variant,
								selected,
								pressed,
								disabled,
							).foreground,
						})}
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
				style={[
					styles.chip(
						variant,
						size,
						selected,
						false,
						disabled,
						leading !== undefined,
						trailing !== undefined,
						onRemove !== undefined,
					),
					props.style,
				]}
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
			style={({ pressed }: TappableState) => [
				styles.chip(
					variant,
					size,
					selected,
					pressed,
					disabled,
					leading !== undefined,
					trailing !== undefined,
					onRemove !== undefined,
				),
				props.style,
			]}
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
	return <View {...props} style={[styles.wrapRow(gap), props.style]} />;
}

export const Chip = Object.assign(ChipRoot, { Group: ChipGroup });

const HEIGHT = { sm: 28, md: 34 };

function chipColors(
	components: Theme["components"],
	variant: ChipVariant,
	selected: boolean | undefined,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.chip[variant];
	return stateColors(
		states,
		selected && "selected",
		pressed && !selected && "pressed",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
const ChipIcon = withUnistyles(Icon);

const styles = StyleSheet.create((theme) => ({
	chip: (
		variant: ChipVariant,
		size: ChipSize,
		selected: boolean | undefined,
		pressed: boolean,
		disabled: boolean,
		leading: boolean,
		trailing: boolean,
		removable: boolean,
	) => {
		const colors = chipColors(
			theme.components,
			variant,
			selected,
			pressed,
			disabled,
		);
		return {
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "flex-start",
			minHeight: HEIGHT[size],
			gap: theme.tokens.spacing[1],
			paddingStart: leading
				? theme.tokens.spacing[2]
				: theme.tokens.spacing[3],
			paddingEnd: removable
				? theme.tokens.spacing[1]
				: trailing
					? theme.tokens.spacing[2]
					: theme.tokens.spacing[3],
			borderRadius: theme.components.chip.radius,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
	label: (
		variant: ChipVariant,
		size: ChipSize,
		selected: boolean | undefined,
		pressed: boolean,
		disabled: boolean,
	) => ({
		...theme.tokens.typography[size === "sm" ? "footnote" : "subheadline"],
		color: chipColors(theme.components, variant, selected, pressed, disabled)
			.foreground,
		fontWeight: FONT_WEIGHT.medium,
	}),
	remove: (size: ChipSize) => ({
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 9999,
		width: HEIGHT[size] - 8,
		height: HEIGHT[size] - 8,
	}),
	wrapRow: (gap: keyof Spacing) => ({
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[gap],
	}),
}));
