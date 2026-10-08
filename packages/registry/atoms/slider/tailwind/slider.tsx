import type { ComponentPropsWithRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { cx, useTheme } from "@/theme";

import {
	useSlider,
	type SliderValue,
	type UseSliderOptions,
} from "../use-slider";

export type { SliderValue } from "../use-slider";

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

const THUMB = 20;
const TRACK = 4;
const TICK = 8;

export function Slider<T extends SliderValue>({
	showSteps = false,
	accessibilityLabel,
	className,
	style,
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
	...props
}: SliderProps<T>) {
	const { tokens, components } = useTheme();
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
	const states = components.slider.default;
	const colors = {
		...states.default,
		...(disabled ? states.disabled : undefined),
	};
	// The whole 44pt height accepts a tap, not only the thumb.
	const height = tokens.metrics.touchTarget;

	return (
		<View
			{...props}
			className={cx("justify-center", className)}
			style={[{ height, paddingHorizontal: THUMB / 2 }, style]}
		>
			<GestureDetector gesture={slider.gestures.tap}>
				<View
					className="justify-center"
					style={{ height }}
					onLayout={slider.onTrackLayout}
				>
					<View
						className="overflow-hidden"
						style={[
							{
								height: TRACK,
								borderRadius: tokens.radius.full,
								backgroundColor: colors.track,
							},
						]}
					>
						<Animated.View
							style={[
								{
									position: "absolute",
									top: 0,
									bottom: 0,
									borderRadius: tokens.radius.full,
									backgroundColor: colors.fill,
								},
								slider.fillStyle,
							]}
						/>
					</View>
					{showSteps && slider.ticks > 1
						? Array.from({ length: slider.ticks }, (_, i) => (
								<View
									key={i}
									className="absolute"
									style={[
										{
											width: 2,
											height: TICK,
											marginLeft: -1,
											borderRadius: 1,
											top: (height - TICK) / 2,
											left: `${(i / (slider.ticks - 1)) * 100}%`,
											backgroundColor: colors.track,
										},
									]}
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
								style={[
									{
										position: "absolute",
										left: -THUMB / 2,
										width: THUMB,
										height: THUMB,
										boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.25)",
										top: (height - THUMB) / 2,
										borderRadius: THUMB / 2,
										backgroundColor: colors.thumb,
									},
									slider.thumbStyles[index],
								]}
							/>
						</GestureDetector>
					))}
				</View>
			</GestureDetector>
		</View>
	);
}
