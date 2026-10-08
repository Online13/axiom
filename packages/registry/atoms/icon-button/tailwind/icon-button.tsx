import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import { Icon, iconColor, type IconColor } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { useTheme } from "@/theme";

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
	style,
	...props
}: IconButtonProps) {
	const { tokens, colors, components } = useTheme();
	const states = components.iconButton[variant];
	const dimension = tokens.sizes.control[size];

	// Later states win: selected, then pressed, then disabled.
	const colorsFor = (pressed: boolean) => ({
		...states.default,
		...(selected ? states.selected : undefined),
		...(pressed ? states.pressed : undefined),
		...(disabled ? states.disabled : undefined),
	});

	return (
		<Tappable
			pressScale={tokens.metrics.pressScale}
			{...props}
			disabled={disabled}
			accessibilityLabel={
				typeof badge === "number" && badge > 0
					? `${accessibilityLabel}, ${badge}`
					: accessibilityLabel
			}
			accessibilityState={{ ...accessibilityState, selected }}
			style={({ pressed }) => {
				const state = colorsFor(pressed);
				return [
					{
						alignItems: "center",
						justifyContent: "center",
						width: dimension,
						height: dimension,
						borderRadius:
							shape === "circle"
								? dimension / 2
								: components.iconButton.radius,
						backgroundColor: state.background ?? "transparent",
						borderWidth: state.border ? 1 : 0,
						borderColor: state.border,
					},
					style,
				];
			}}
		>
			{({ pressed }) => (
				<WithBadge badge={badge}>
					<Icon
						name={icon}
						size={size}
						color={
							color && !disabled
								? iconColor(colors, color)
								: colorsFor(pressed).foreground
						}
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
