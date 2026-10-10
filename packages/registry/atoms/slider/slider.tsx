import type { ComponentPropsWithRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { useSliderStyles } from "./slider.styles";
import {
	useSlider,
	type SliderValue,
	type UseSliderOptions,
} from "./use-slider";

export type { SliderValue } from "./use-slider";

export type SliderProps<T extends SliderValue> = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	UseSliderOptions<T> & {
		/** Draws a tick for each step. Only use it when there are few steps. */
		showSteps?: boolean;
		/** What the slider controls. Read on each thumb. */
		accessibilityLabel?: string;
		style?: StyleProp<ViewStyle>;
	};

export function Slider<T extends SliderValue>({
	showSteps = false,
	accessibilityLabel,
	value,
	defaultValue,
	onValueChange,
	onSlidingComplete,
	min,
	max,
	step,
	minRange,
	disabled = false,
	getAccessibilityValue,
	haptic,
	...props
}: SliderProps<T>) {
	const styles = useSliderStyles(disabled);
	const slider = useSlider({
		value,
		defaultValue,
		onValueChange,
		onSlidingComplete,
		min,
		max,
		step,
		minRange,
		disabled,
		getAccessibilityValue,
		haptic,
	});

	return (
		<View {...props} {...styles.container(props)}>
			<GestureDetector gesture={slider.gestures.tap}>
				{/* The whole 44pt height accepts a tap, not only the thumb. */}
				<View {...styles.hitArea} onLayout={slider.onTrackLayout}>
					<View {...styles.track}>
						<Animated.View style={[styles.fill, slider.fillStyle]} />
					</View>
					{showSteps && slider.ticks > 1
						? Array.from({ length: slider.ticks }, (_, i) => (
								<View
									key={i}
									{...styles.tick((i / (slider.ticks - 1)) * 100)}
								/>
							))
						: null}
					{slider.values.map((_, index) => (
						<GestureDetector
							key={index}
							gesture={slider.gestures.thumbs[index]}
						>
							<Animated.View
								{...slider.thumbAccessibility(index)}
								accessibilityLabel={
									slider.range
										? `${accessibilityLabel ?? "Value"}, ${index === 0 ? "minimum" : "maximum"}`
										: accessibilityLabel
								}
								style={[styles.thumb, slider.thumbStyles[index]]}
							/>
						</GestureDetector>
					))}
				</View>
			</GestureDetector>
		</View>
	);
}
