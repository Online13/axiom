import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import {
	useFloatingButton,
	type UseFloatingButtonOptions,
} from "../use-floating-button";

export type { FloatingButtonPlacement } from "../use-floating-button";

export type FloatingButtonVariant = "solid" | "tinted";

type Content =
	/** Extended button: icon and label. */
	| { label: string; accessibilityLabel?: string }
	/** Icon only: the label is required for screen readers. */
	| { label?: undefined; accessibilityLabel: string };

export type FloatingButtonProps = Omit<
	TappableProps,
	"children" | "style" | "accessibilityLabel"
> &
	Omit<UseFloatingButtonOptions, "margin"> &
	Content & {
		icon: IconName;
		variant?: FloatingButtonVariant;
		/** 44 or 52pt, from the `control` size tokens. */
		size?: "sm" | "md";
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
	style,
	...props
}: FloatingButtonProps) {
	const { tokens, components } = useTheme();
	const { position, animatedStyle, hidden } = useFloatingButton({
		placement,
		offset,
		visible,
		margin: tokens.metrics.screenMargin,
	});

	const states = components.floatingButton[variant];
	const dimension =
		size === "sm" ? tokens.sizes.control.md : tokens.sizes.control.lg;

	return (
		<Animated.View
			style={[
				styles.anchor,
				position,
				hidden && styles.passThrough,
				animatedStyle,
			]}
		>
			<Tappable
				pressScale={tokens.metrics.pressScale}
				{...props}
				disabled={disabled || hidden}
				accessibilityLabel={accessibilityLabel ?? label}
				accessibilityElementsHidden={hidden}
				importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
				style={({ pressed }) => {
					const colors = {
						...states.default,
						...(pressed ? states.pressed : undefined),
						...(disabled ? states.disabled : undefined),
					};
					return [
						styles.button,
						{
							minHeight: dimension,
							minWidth: dimension,
							paddingHorizontal: label ? tokens.spacing[5] : 0,
							borderRadius: components.floatingButton.radius,
							backgroundColor: colors.background,
							borderWidth: colors.border ? tokens.metrics.hairline : 0,
							borderColor: colors.border,
						},
						style,
					];
				}}
			>
				{({ pressed }) => {
					const { foreground } = {
						...states.default,
						...(pressed ? states.pressed : undefined),
						...(disabled ? states.disabled : undefined),
					};
					return (
						<View style={[styles.content, { gap: tokens.spacing[2] }]}>
							<Icon
								name={icon}
								size={size === "sm" ? "md" : "lg"}
								color={foreground}
							/>
							{label ? (
								<Text
									variant="bodyLg"
									numberOfLines={1}
									maxFontSizeMultiplier={MAX_FONT_SCALE.control}
									style={{
										color: foreground,
										fontWeight: FONT_WEIGHT.semibold,
									}}
								>
									{label}
								</Text>
							) : null}
						</View>
					);
				}}
			</Tappable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	anchor: {
		position: "absolute",
		// A centered anchor spans the screen width: only the button catches touches.
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "none",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0px 6px 16px hsla(0, 0%, 0%, 0.18)",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
	},
});
