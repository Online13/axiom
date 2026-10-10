import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
} from "react-native-reanimated";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { useSwitchStyles } from "./switch.styles";
import { useSwitch, type UseSwitchOptions } from "./use-switch";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> &
	UseSwitchOptions & {
		size?: SwitchSize;
		style?: StyleProp<ViewStyle>;
	};

export function Switch({
	size = "md",
	disabled = false,
	style,
	value,
	defaultValue,
	onValueChange,
	haptic,
	...props
}: SwitchProps) {
	const styles = useSwitchStyles(size, disabled);
	const { progress, toggle, accessibilityProps } = useSwitch({
		value,
		defaultValue,
		onValueChange,
		haptic,
		disabled,
	});

	const trackStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progress.get(),
			[0, 1],
			styles.trackColors,
		),
	}));

	const thumbStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: interpolate(progress.get(), [0, 1], [0, styles.travel]),
			},
		],
	}));

	return (
		<Tappable
			{...props}
			{...accessibilityProps}
			disabled={disabled}
			onPress={toggle}
		>
			{/* Animated views take `style` only: everything they draw goes through it. */}
			<Animated.View style={[styles.track(style), trackStyle]}>
				<Animated.View style={[styles.thumb, thumbStyle]} />
			</Animated.View>
		</Tappable>
	);
}
