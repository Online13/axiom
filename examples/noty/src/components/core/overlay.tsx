import { useEffect, useState } from "react";
import {
	Pressable,
	StyleSheet,
	type ColorValue,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type OverlayProps = {
	/** Shows or hides the overlay, with the enter or exit animation. */
	visible: boolean;
	/** Called when the overlay is pressed. Without it, presses are blocked and ignored. */
	onPress?: () => void;
	/** Called when the exit animation ends. */
	onExited?: () => void;
	/** Drives opacity from 0 to 1 instead of the timed animation, for a sheet that follows a gesture. */
	progress?: SharedValue<number>;
	opacity?: number;
	color?: ColorValue;
	duration?: number;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

/**
 * Backdrop behind sheets, dialogs and menus. Fills its parent: render it in a `Portal`.
 * Reanimated skips the fade when Reduce Motion is on.
 */
export function Overlay({
	visible,
	onPress,
	onExited,
	progress,
	opacity = 0.4,
	color = "hsla(0, 0%, 0%, 1)",
	duration = 250,
	accessibilityLabel = "Close",
	style,
}: OverlayProps) {
	const [mounted, setMounted] = useState(visible);
	if (visible && !mounted) setMounted(true);

	const timed = useSharedValue(0);

	useEffect(() => {
		if (!mounted) return;

		// With `progress`, the owner animates and unmounts the overlay.
		if (progress) {
			if (!visible) onExited?.();
			return;
		}

		if (visible) {
			timed.value = withTiming(1, { duration });
			return;
		}

		const finish = () => {
			setMounted(false);
			onExited?.();
		};
		timed.value = withTiming(0, { duration }, (finished) => {
			if (finished) scheduleOnRN(finish);
		});
		// Only `visible` starts an animation; the callbacks are read when it runs.
	}, [visible, mounted]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: (progress ? progress.value : timed.value) * opacity,
	}));

	if (!mounted) return null;

	const dismissible = onPress !== undefined;

	return (
		<AnimatedPressable
			accessible={dismissible}
			accessibilityRole={dismissible ? "button" : undefined}
			accessibilityLabel={dismissible ? accessibilityLabel : undefined}
			importantForAccessibility={dismissible ? "yes" : "no-hide-descendants"}
			onAccessibilityEscape={onPress}
			onPress={visible ? onPress : undefined}
			style={[
				StyleSheet.absoluteFill,
				// Touches go back to the screen as soon as closing starts.
				{
					backgroundColor: color,
					pointerEvents: visible ? "auto" : "none",
				},
				style,
				animatedStyle,
			]}
		/>
	);
}
