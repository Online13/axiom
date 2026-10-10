import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import {
	FloatingButtonIcon,
	useFloatingButtonStyles,
} from "./floating-button.styles";
import {
	useFloatingButton,
	type UseFloatingButtonOptions,
} from "./use-floating-button";

export type { FloatingButtonPlacement } from "./use-floating-button";

export type FloatingButtonVariant = "solid" | "tinted";

type Content =
	/** Extended button: icon and label. */
	| { label: string; accessibilityLabel?: string }
	/** Icon only: the label is required for screen readers. */
	| { label?: undefined; accessibilityLabel: string };

export type FloatingButtonSize = "sm" | "md";

export type FloatingButtonProps = Omit<
	TappableProps,
	"children" | "style" | "accessibilityLabel"
> &
	Omit<UseFloatingButtonOptions, "margin"> &
	Content & {
		icon: IconName;
		variant?: FloatingButtonVariant;
		/** 44 or 52pt, from the `control` size tokens. */
		size?: FloatingButtonSize;
		style?: StyleProp<ViewStyle>;
	};

/**
 * A button floating above the content, in thumb reach, for the main action of a screen.
 * Render it last in the screen container: it positions itself above the bottom safe area.
 */
export function FloatingButton({
	icon,
	label,
	variant = "solid",
	size = "md",
	placement,
	offset,
	visible,
	disabled = false,
	accessibilityLabel,
	...props
}: FloatingButtonProps) {
	const styles = useFloatingButtonStyles(variant, size);
	const { position, animatedStyle, hidden } = useFloatingButton({
		placement,
		offset,
		visible,
		margin: styles.margin,
	});
	// `disabled` is nullable on Pressable; the styles want a plain boolean.
	const off = disabled ?? false;

	return (
		<Animated.View style={[styles.anchor(hidden), position, animatedStyle]}>
			<Tappable
				{...props}
				disabled={off || hidden}
				accessibilityLabel={accessibilityLabel ?? label}
				accessibilityElementsHidden={hidden}
				importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
				{...styles.button(label !== undefined, off, props)}
			>
				{({ pressed }) => (
					<View {...styles.content}>
						<FloatingButtonIcon
							name={icon}
							size={size === "sm" ? "md" : "lg"}
							{...styles.tint(pressed, off)}
						/>
						{label ? (
							<Text
								variant="bodyLg"
								numberOfLines={1}
								maxFontSizeMultiplier={MAX_FONT_SCALE.control}
								{...styles.label(pressed, off)}
							>
								{label}
							</Text>
						) : null}
					</View>
				)}
			</Tappable>
		</Animated.View>
	);
}
