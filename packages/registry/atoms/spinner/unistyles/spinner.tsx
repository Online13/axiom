import { useEffect, useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { textColor, type TextColor } from "@/components/ui/text";
import type { Theme } from "@/theme";

export type SpinnerSize = "sm" | "md" | "lg" | number;

export type SpinnerProps = {
	/** From the `icon` size tokens (16, 20, 24), or a number. */
	size?: SpinnerSize;
	color?: TextColor;
	/** Announced by screen readers. Not rendered. */
	label?: string;
	/** `false` hides the spinner but keeps its space. */
	animating?: boolean;
	/** Waits this many ms before showing, to avoid a flash on fast responses. */
	delay?: number;
	style?: StyleProp<ViewStyle>;
};

const dimensionOf = (tokens: Theme["tokens"], size: SpinnerSize) =>
	typeof size === "number" ? size : tokens.sizes.icon[size];

export function Spinner({
	size = "md",
	color = "default",
	label = "Loading",
	animating = true,
	delay = 0,
	style,
}: SpinnerProps) {
	const reduceMotion = useReducedMotion();
	const [delayed, setDelayed] = useState(delay > 0);
	const progress = useSharedValue(0);

	useEffect(() => {
		if (delay <= 0) return;
		const timeout = setTimeout(() => setDelayed(false), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	const visible = animating && !delayed;

	useEffect(() => {
		if (!visible) {
			cancelAnimation(progress);
			return;
		}
		// With Reduce Motion, the spinner pulses slowly instead of turning.
		progress.value = 0;
		progress.value = reduceMotion
			? withRepeat(withTiming(1, { duration: 1000 }), -1, true)
			: withRepeat(
					withTiming(1, { duration: 800, easing: Easing.linear }),
					-1,
					false,
				);
		return () => cancelAnimation(progress);
	}, [visible, reduceMotion, progress]);

	const animatedStyle = useAnimatedStyle(() =>
		reduceMotion
			? { opacity: 0.4 + progress.value * 0.6 }
			: { transform: [{ rotate: `${progress.value * 360}deg` }] },
	);

	return (
		<View
			accessible={visible}
			accessibilityRole="progressbar"
			accessibilityLabel={label}
			accessibilityState={{ busy: visible }}
			accessibilityElementsHidden={!visible}
			importantForAccessibility={visible ? "yes" : "no-hide-descendants"}
			style={[styles.frame(size, visible), style]}
		>
			<Animated.View style={[styles.ring(size, color), animatedStyle]} />
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	frame: (size: SpinnerSize, visible: boolean) => {
		const dimension = dimensionOf(theme.tokens, size);
		return {
			width: dimension,
			height: dimension,
			opacity: visible ? 1 : 0,
		};
	},
	ring: (size: SpinnerSize, color: TextColor) => {
		const dimension = dimensionOf(theme.tokens, size);
		return {
			flex: 1,
			borderRadius: dimension / 2,
			borderWidth: Math.max(2, Math.round(dimension / 10)),
			borderColor: textColor(theme.colors, color),
			// One transparent side draws the gap of the ring.
			borderTopColor: "transparent",
		};
	},
}));
