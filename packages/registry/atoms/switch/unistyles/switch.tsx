import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";

import { useSwitch, type UseSwitchOptions } from "../use-switch";

export type SwitchSize = "sm" | "md";

export type SwitchProps = UseSwitchOptions & {
	size?: SwitchSize;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

// md matches the iOS system switch.
const DIMENSIONS: Record<
	SwitchSize,
	{ width: number; height: number; thumb: number }
> = {
	sm: { width: 40, height: 24, thumb: 20 },
	md: { width: 51, height: 31, thumb: 27 },
};

export function Switch({
	size = "md",
	disabled = false,
	accessibilityLabel,
	style,
	...options
}: SwitchProps) {
	// The track color is interpolated between its off and on values inside a worklet, so both are
	// read here as plain values rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const { progress, toggle, accessibilityProps } = useSwitch({
		...options,
		disabled,
	});

	const states = theme.components.switch.default;
	const off = {
		...states.default,
		...(disabled ? states.disabled : undefined),
	};
	const on = {
		...states.default,
		...states.checked,
		...(disabled ? states.disabled : undefined),
	};

	const { width, height, thumb } = DIMENSIONS[size];
	const travel = width - thumb - (height - thumb);

	const trackStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progress.value,
			[0, 1],
			[off.track, on.track],
		),
	}));

	const thumbStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: interpolate(progress.value, [0, 1], [0, travel]) },
		],
	}));

	return (
		<Tappable
			{...accessibilityProps}
			accessibilityLabel={accessibilityLabel}
			disabled={disabled}
			onPress={toggle}
		>
			<Animated.View style={[styles.track(size), style, trackStyle]}>
				<Animated.View
					style={[styles.thumb(size, disabled), thumbStyle]}
				/>
			</Animated.View>
		</Tappable>
	);
}

const styles = StyleSheet.create((theme) => ({
	track: (size: SwitchSize) => {
		const { width, height, thumb } = DIMENSIONS[size];
		return {
			justifyContent: "center",
			width,
			height,
			// The thumb is centered in the track: the same inset on every side.
			padding: (height - thumb) / 2,
			borderRadius: height / 2,
		};
	},
	thumb: (size: SwitchSize, disabled: boolean) => {
		const { thumb } = DIMENSIONS[size];
		const states = theme.components.switch.default;
		return {
			width: thumb,
			height: thumb,
			borderRadius: thumb / 2,
			backgroundColor: {
				...states.default,
				...states.checked,
				...(disabled ? states.disabled : undefined),
			}.thumb,
			boxShadow: "0px 2px 4px hsla(0, 0%, 0%, 0.2)",
		};
	},
}));
