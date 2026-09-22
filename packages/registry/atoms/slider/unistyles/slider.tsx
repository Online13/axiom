import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import {
	useSlider,
	type SliderValue,
	type UseSliderOptions,
} from "../use-slider";

export type { SliderValue } from "../use-slider";

export type SliderProps<T extends SliderValue> = UseSliderOptions<T> & {
	/** Draws a tick for each step. Only use it when there are few steps. */
	showSteps?: boolean;
	/** What the slider controls. */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const THUMB = 20;
const TRACK = 4;
const TICK = 8;

export function Slider<T extends SliderValue>({
	showSteps = false,
	accessibilityLabel,
	style,
	...options
}: SliderProps<T>) {
	const slider = useSlider(options);
	const disabled = options.disabled ?? false;

	return (
		<View style={[styles.container, style]}>
			<GestureDetector gesture={slider.gestures.tap}>
				<View style={styles.hitArea} onLayout={slider.onTrackLayout}>
					<View style={styles.track(disabled)}>
						<Animated.View
							style={[styles.fill(disabled), slider.fillStyle]}
						/>
					</View>
					{showSteps && slider.ticks > 1
						? Array.from({ length: slider.ticks }, (_, i) => (
								<View
									key={i}
									style={styles.tick(
										(i / (slider.ticks - 1)) * 100,
										disabled,
									)}
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
									styles.thumb(disabled),
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

const styles = StyleSheet.create((theme) => {
	// The whole 44pt height accepts a tap, not only the thumb.
	const height = theme.tokens.metrics.touchTarget;
	const states = theme.components.slider.default;
	const colorsFor = (disabled: boolean) => ({
		...states.default,
		...(disabled ? states.disabled : undefined),
	});

	return {
		container: {
			justifyContent: "center",
			height,
			paddingHorizontal: THUMB / 2,
		},
		hitArea: {
			justifyContent: "center",
			height,
		},
		track: (disabled: boolean) => ({
			height: TRACK,
			overflow: "hidden",
			borderRadius: theme.tokens.radius.full,
			backgroundColor: colorsFor(disabled).track,
		}),
		fill: (disabled: boolean) => ({
			position: "absolute",
			top: 0,
			bottom: 0,
			borderRadius: theme.tokens.radius.full,
			backgroundColor: colorsFor(disabled).fill,
		}),
		tick: (percent: number, disabled: boolean) => ({
			position: "absolute",
			width: 2,
			height: TICK,
			marginLeft: -1,
			borderRadius: 1,
			top: (height - TICK) / 2,
			left: `${percent}%`,
			backgroundColor: colorsFor(disabled).track,
		}),
		thumb: (disabled: boolean) => ({
			position: "absolute",
			left: -THUMB / 2,
			width: THUMB,
			height: THUMB,
			boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.25)",
			top: (height - THUMB) / 2,
			borderRadius: THUMB / 2,
			backgroundColor: colorsFor(disabled).thumb,
		}),
	};
});
