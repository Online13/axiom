import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import type { IconColor } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";

import { IconButtonIcon, useIconButtonStyles } from "./icon-button.styles";

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
	const styles = useIconButtonStyles(variant, size, shape, selected);
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
			{...styles.container(off, props)}
		>
			{({ pressed }) => (
				<WithBadge badge={badge}>
					<IconButtonIcon
						name={icon}
						size={size}
						{...styles.tint(color, pressed, off)}
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
