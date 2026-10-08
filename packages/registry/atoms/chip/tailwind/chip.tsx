import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { cx, useTheme, type Spacing } from "@/theme";

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

const HEIGHT = { sm: 28, md: 34 };

// `Tappable` doesn't take classes of its own: the pressable chip gets its layout through `style`.
const CHIP_LAYOUT: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	alignSelf: "flex-start",
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
	className,
	style,
	...props
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
			{
				minHeight: height,
				gap: tokens.spacing[1],
				paddingStart: leading ? tokens.spacing[2] : tokens.spacing[3],
				paddingEnd: onRemove
					? tokens.spacing[1]
					: trailing
						? tokens.spacing[2]
						: tokens.spacing[3],
				borderRadius: components.chip.radius,
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
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 9999,
							width: height - 8,
							height: height - 8,
						}}
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
				{...props}
				accessible={!onRemove}
				accessibilityLabel={label}
				className={cx("flex-row items-center self-start", className)}
				style={containerStyle(false)}
			>
				{content(false)}
			</View>
		);
	}

	return (
		<Tappable
			{...props}
			className={className}
			disabled={disabled}
			accessibilityRole={selected === undefined ? "button" : "togglebutton"}
			accessibilityLabel={label}
			accessibilityState={
				selected === undefined ? undefined : { checked: selected }
			}
			onPress={onPress}
			haptic={haptic}
			style={({ pressed }) => [CHIP_LAYOUT, containerStyle(pressed)]}
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
function ChipGroup({ gap = 2, className, style, ...props }: ChipGroupProps) {
	const { tokens } = useTheme();

	return (
		<View
			{...props}
			className={cx("flex-row flex-wrap items-center", className)}
			style={[{ gap: tokens.spacing[gap] }, style]}
		/>
	);
}

export const Chip = Object.assign(ChipRoot, { Group: ChipGroup });
