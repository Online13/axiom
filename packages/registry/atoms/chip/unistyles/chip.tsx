import type { ReactElement, ReactNode } from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import type { HapticKind } from "@/components/core/haptics";
import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Spacing, Theme } from "@/theme";

export type ChipVariant = "outline" | "filled";
export type ChipSize = "sm" | "md";

export type ChipProps = {
	children?: ReactNode;
	/** Setting it makes the chip a toggle. */
	selected?: boolean;
	onPress?: () => void;
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
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = { sm: 28, md: 34 };

function chipColors(
	components: Theme["components"],
	variant: ChipVariant,
	selected: boolean | undefined,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.chip[variant];
	return {
		...states.default,
		...(selected ? states.selected : undefined),
		...(pressed && !selected ? states.pressed : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

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
	style,
}: ChipProps) {
	const label =
		accessibilityLabel ??
		(typeof children === "string" ? children : undefined);
	const iconSize = size === "sm" ? 14 : 16;

	const foreground = (pressed: boolean) => (theme: Theme) => ({
		color: chipColors(theme.components, variant, selected, pressed, disabled)
			.foreground,
	});

	const renderIcon = (
		icon: IconName | ReactElement | undefined,
		pressed: boolean,
	) =>
		typeof icon === "string" ? (
			<ThemedIcon
				name={icon}
				size={iconSize}
				uniProps={foreground(pressed)}
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
					<ThemedIcon
						name="close"
						size={iconSize}
						uniProps={foreground(pressed)}
					/>
				</Tappable>
			) : (
				renderIcon(trailing, pressed)
			)}
		</>
	);

	const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => [
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
		style,
	];

	if (!onPress) {
		return (
			<View
				accessible={!onRemove}
				accessibilityLabel={label}
				style={containerStyle(false)}
			>
				{content(false)}
			</View>
		);
	}

	return (
		<Tappable
			disabled={disabled}
			accessibilityRole={selected === undefined ? "button" : "togglebutton"}
			accessibilityLabel={label}
			accessibilityState={
				selected === undefined ? undefined : { checked: selected }
			}
			onPress={onPress}
			haptic={haptic}
			style={({ pressed }) => containerStyle(pressed)}
		>
			{({ pressed }) => content(pressed)}
		</Tappable>
	);
}

export type ChipGroupProps = {
	children?: ReactNode;
	/** `wrap` flows onto several lines, `scroll` keeps one line that scrolls. */
	layout?: "wrap" | "scroll";
	gap?: keyof Spacing;
	style?: StyleProp<ViewStyle>;
};

function ChipGroup({
	children,
	layout = "wrap",
	gap = 2,
	style,
}: ChipGroupProps) {
	if (layout === "scroll") {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={style}
				contentContainerStyle={styles.scrollRow(gap)}
			>
				{children}
			</ScrollView>
		);
	}

	return <View style={[styles.wrapRow(gap), style]}>{children}</View>;
}

export const Chip = Object.assign(ChipRoot, { Group: ChipGroup });

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
	scrollRow: (gap: keyof Spacing) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[gap],
		paddingHorizontal: theme.tokens.metrics.screenMargin,
	}),
	wrapRow: (gap: keyof Spacing) => ({
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[gap],
	}),
}));
