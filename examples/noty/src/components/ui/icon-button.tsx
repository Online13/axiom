import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import {
	Tappable,
	type TappableProps,
	type TappableState,
} from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import { type IconColor, Icon, iconColor } from "@/components/ui/icon/icon";
import type { IconName } from "@/components/ui/icon/icons";

import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";
import { stateColors } from "@/theme/components/states";

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
	/**
	 * A number shows a counter, `true` a dot. Pinned to the icon, not to the button's corner,
	 * so it stays on the glyph at every size. A counter is added to the accessibility label.
	 */
	badge?: number | boolean;
	style?: StyleProp<ViewStyle>;
};

export function IconButton({
	icon,
	variant = "ghost",
	size = "md",
	shape = "circle",
	selected = false,
	disabled = false,
	color,
	badge,
	accessibilityLabel,
	accessibilityState,
	...props
}: IconButtonProps) {
	// `disabled` is nullable on Pressable; the styles and the icon color want a plain boolean.
	const off = disabled ?? false;

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityLabel={
				typeof badge === "number" && badge > 0
					? `${accessibilityLabel}, ${badge}`
					: accessibilityLabel
			}
			accessibilityState={{ ...accessibilityState, selected }}
			pressScale={props.pressScale ?? metrics.pressScale}
			style={({ pressed }: TappableState) => [
				styles.container(variant, size, shape, selected, pressed, off),
				props.style,
			]}
		>
			{({ pressed }) => (
				<WithBadge badge={badge}>
					<IconButtonIcon
						name={icon}
						size={size}
						uniProps={(theme: Theme) => ({
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
				</WithBadge>
			)}
		</Tappable>
	);
}

/** Anchors the badge on the glyph: on the 44pt box, a dot would float a corner away from the icon. */
function WithBadge({
	badge,
	children,
}: {
	badge: number | boolean | undefined;
	children: ReactNode;
}) {
	if (badge === undefined || badge === false || badge === 0)
		return <>{children}</>;
	return (
		<Badge.Anchor
			badge={badge === true ? <Badge dot /> : <Badge count={badge} />}
		>
			{children}
		</Badge.Anchor>
	);
}

// Later states win: selected, then pressed, then disabled.
function iconButtonColors(
	components: Theme["components"],
	variant: IconButtonVariant,
	selected: boolean,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.iconButton[variant];
	return stateColors(
		states,
		selected && "selected",
		pressed && "pressed",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
const IconButtonIcon = withUnistyles(Icon);

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
				shape === "circle"
					? dimension / 2
					: theme.components.iconButton.radius,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
}));
