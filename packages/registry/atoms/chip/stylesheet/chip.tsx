import type { ReactElement, ReactNode } from "react";
import {
	ScrollView,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme, type Spacing } from "@/theme";

export type ChipProps = {
	children?: ReactNode;
	/** Setting it makes the chip a toggle. */
	selected?: boolean;
	onPress?: () => void;
	/** Shows a close icon that calls it, with its own touch area. */
	onRemove?: () => void;
	/** `outline` for filters, `filled` for tags and entered values. */
	variant?: "outline" | "filled";
	/** 28 or 34pt. The touch area stays 44pt. */
	size?: "sm" | "md";
	leading?: IconName | ReactElement;
	/** Ignored with `onRemove`. */
	trailing?: IconName | ReactElement;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = { sm: 28, md: 34 };

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
	accessibilityLabel,
	style,
}: ChipProps) {
	const { tokens, components } = useTheme();
	const states = components.chip[variant];
	const label =
		accessibilityLabel ??
		(typeof children === "string" ? children : undefined);
	const height = HEIGHT[size];
	const iconSize = size === "sm" ? 14 : 16;

	const colorsFor = (pressed: boolean) => ({
		...states.default,
		...(selected ? states.selected : undefined),
		...(pressed && !selected ? states.pressed : undefined),
		...(disabled ? states.disabled : undefined),
	});

	const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
		const colors = colorsFor(pressed);
		return [
			styles.chip,
			{
				minHeight: height,
				gap: tokens.spacing[1],
				paddingStart: leading ? tokens.spacing[2] : tokens.spacing[3],
				paddingEnd: onRemove
					? tokens.spacing[1]
					: trailing
						? tokens.spacing[2]
						: tokens.spacing[3],
				borderRadius: tokens.radius.full,
				backgroundColor: colors.background ?? "transparent",
				borderWidth: colors.border ? 1 : 0,
				borderColor: colors.border,
			},
			style,
		];
	};

	const renderIcon = (
		icon: IconName | ReactElement | undefined,
		color: string,
	) =>
		typeof icon === "string" ? (
			<Icon name={icon} size={iconSize} color={color} />
		) : (
			icon
		);

	const content = (pressed: boolean) => {
		const { foreground } = colorsFor(pressed);
		return (
			<>
				{renderIcon(leading, foreground)}
				{typeof children === "string" || typeof children === "number" ? (
					<Text
						numberOfLines={1}
						maxFontSizeMultiplier={MAX_FONT_SCALE.control}
						style={[
							tokens.typography[
								size === "sm" ? "footnote" : "subheadline"
							],
							{ color: foreground, fontWeight: FONT_WEIGHT.medium },
						]}
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
						style={[
							styles.remove,
							{ width: height - 8, height: height - 8 },
						]}
					>
						<Icon name="close" size={iconSize} color={foreground} />
					</Tappable>
				) : (
					renderIcon(trailing, foreground)
				)}
			</>
		);
	};

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
	const { tokens } = useTheme();

	if (layout === "scroll") {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={style}
				contentContainerStyle={[
					styles.row,
					{
						gap: tokens.spacing[gap],
						paddingHorizontal: tokens.metrics.screenMargin,
					},
				]}
			>
				{children}
			</ScrollView>
		);
	}

	return (
		<View
			style={[styles.row, styles.wrap, { gap: tokens.spacing[gap] }, style]}
		>
			{children}
		</View>
	);
}

export const Chip = Object.assign(ChipRoot, { Group: ChipGroup });

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	remove: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 9999,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	wrap: {
		flexWrap: "wrap",
	},
});
