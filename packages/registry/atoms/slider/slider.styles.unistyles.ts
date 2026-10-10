import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { stateColors } from "@/theme/components/states";

const THUMB = 20;
const TRACK = 4;
const TICK = 8;

type Styled = { style?: StyleProp<ViewStyle> };

export function useSliderStyles(disabled: boolean) {
	return {
		container: ({ style }: Styled) => ({ style: [styles.container, style] }),
		hitArea: { style: styles.hitArea },
		track: { style: styles.track(disabled) },
		fill: styles.fill(disabled),
		tick: (percent: number) => ({ style: styles.tick(percent, disabled) }),
		thumb: styles.thumb(disabled),
	};
}

const styles = StyleSheet.create((theme) => {
	// The whole 44pt height accepts a tap, not only the thumb.
	const height = theme.tokens.metrics.touchTarget;
	const states = theme.components.slider.default;
	const colorsFor = (disabled: boolean) =>
		stateColors(states, disabled && "disabled");

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
