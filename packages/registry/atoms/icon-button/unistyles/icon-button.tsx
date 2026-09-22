import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon, iconColor, type IconColor } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import type { Theme } from "@/theme";

export type IconButtonVariant = "ghost" | "tinted" | "outline" | "solid";
export type IconButtonSize = "sm" | "md" | "lg";
export type IconButtonShape = "circle" | "square";

export type IconButtonProps = Omit<
	TappableProps,
	"children" | "style" | "accessibilityLabel"
> & {
	/** An icon of your registry. */
	icon: IconName;
	/** Required: there is no visible text, so this is all a screen reader can announce. */
	accessibilityLabel: string;
	variant?: IconButtonVariant;
	/** 32, 44 or 52pt, from the `control` size tokens. The touch area never goes below 44pt. */
	size?: IconButtonSize;
	shape?: IconButtonShape;
	/** Marks a toggle button as on. */
	selected?: boolean;
	/** Overrides the icon color of the variant, except when disabled. */
	color?: IconColor;
	style?: StyleProp<ViewStyle>;
};

// Later states win: selected, then pressed, then disabled.
function iconButtonColors(
	components: Theme["components"],
	variant: IconButtonVariant,
	selected: boolean,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.iconButton[variant];
	return {
		...states.default,
		...(selected ? states.selected : undefined),
		...(pressed ? states.pressed : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function IconButton({
	icon,
	variant = "ghost",
	size = "md",
	shape = "circle",
	selected = false,
	disabled = false,
	color,
	accessibilityState,
	style,
	...props
}: IconButtonProps) {
	// `disabled` is nullable on Pressable; the styles and the icon color want a plain boolean.
	const off = disabled ?? false;

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityState={{ ...accessibilityState, selected }}
			style={({ pressed }) => [
				styles.container(variant, size, shape, selected, pressed, off),
				style,
			]}
		>
			{({ pressed }) => (
				<ThemedIcon
					name={icon}
					size={size}
					uniProps={(theme) => ({
						color:
							color && !off
								? iconColor(theme.colors, color)
								: iconButtonColors(
										theme.components,
										variant,
										selected,
										pressed,
										off,
									).foreground,
					})}
				/>
			)}
		</Tappable>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: (
		variant: IconButtonVariant,
		size: IconButtonSize,
		shape: IconButtonShape,
		selected: boolean,
		pressed: boolean,
		disabled: boolean,
	) => {
		const colors = iconButtonColors(
			theme.components,
			variant,
			selected,
			pressed,
			disabled,
		);
		const dimension = theme.tokens.sizes.control[size];

		return {
			alignItems: "center",
			justifyContent: "center",
			width: dimension,
			height: dimension,
			borderRadius:
				shape === "circle" ? dimension / 2 : theme.tokens.radius.md,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
}));
