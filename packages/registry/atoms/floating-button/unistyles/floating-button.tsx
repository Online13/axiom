import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import {
	StyleSheet,
	useUnistyles,
	withUnistyles,
} from "react-native-unistyles";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";

import {
	useFloatingButton,
	type UseFloatingButtonOptions,
} from "../use-floating-button";

export type { FloatingButtonPlacement } from "../use-floating-button";

export type FloatingButtonVariant = "solid" | "tinted";
export type FloatingButtonSize = "sm" | "md";

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
		size?: FloatingButtonSize;
		style?: StyleProp<ViewStyle>;
	};

function floatingButtonColors(
	components: Theme["components"],
	variant: FloatingButtonVariant,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.floatingButton[variant];
	return {
		...states.default,
		...(pressed ? states.pressed : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

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
	// The hook takes the screen margin as a plain number to compute its position, so the token is
	// read here rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const { position, animatedStyle, hidden } = useFloatingButton({
		placement,
		offset,
		visible,
		margin: theme.tokens.metrics.screenMargin,
	});

	const off = disabled ?? false;

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
				pressScale={metrics.pressScale}
				{...props}
				disabled={off || hidden}
				accessibilityLabel={accessibilityLabel ?? label}
				accessibilityElementsHidden={hidden}
				importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
				style={({ pressed }) => [
					styles.button(variant, size, label !== undefined, pressed, off),
					style,
				]}
			>
				{({ pressed }) => (
					<View style={styles.content}>
						<ThemedIcon
							name={icon}
							size={size === "sm" ? "md" : "lg"}
							uniProps={(uniTheme) => ({
								color: floatingButtonColors(
									uniTheme.components,
									variant,
									pressed,
									off,
								).foreground,
							})}
						/>
						{label ? (
							<Text
								variant="bodyLg"
								numberOfLines={1}
								maxFontSizeMultiplier={MAX_FONT_SCALE.control}
								style={styles.label(variant, pressed, off)}
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

const styles = StyleSheet.create((theme) => ({
	anchor: {
		position: "absolute",
		// A centered anchor spans the screen width: only the button catches touches.
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "none",
	},
	button: (
		variant: FloatingButtonVariant,
		size: FloatingButtonSize,
		extended: boolean,
		pressed: boolean,
		disabled: boolean,
	) => {
		const colors = floatingButtonColors(
			theme.components,
			variant,
			pressed,
			disabled,
		);
		const dimension =
			size === "sm"
				? theme.tokens.sizes.control.md
				: theme.tokens.sizes.control.lg;

		return {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			boxShadow: "0px 6px 16px hsla(0, 0%, 0%, 0.18)",
			minHeight: dimension,
			minWidth: dimension,
			paddingHorizontal: extended ? theme.tokens.spacing[5] : 0,
			borderRadius: theme.components.floatingButton.radius,
			backgroundColor: colors.background,
			borderWidth: colors.border ? theme.tokens.metrics.hairline : 0,
			borderColor: colors.border,
		};
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	label: (
		variant: FloatingButtonVariant,
		pressed: boolean,
		disabled: boolean,
	) => ({
		color: floatingButtonColors(theme.components, variant, pressed, disabled)
			.foreground,
		fontWeight: FONT_WEIGHT.semibold,
	}),
}));
