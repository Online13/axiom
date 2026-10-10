import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";
import { stateColors } from "@/theme/components/states";

const THUMB = 20;
const TRACK = 4;
const TICK = 8;

type Styled = { style?: StyleProp<ViewStyle> };

export function useSliderStyles(disabled: boolean) {
	const { tokens, components } = useTheme();
	const states = components.slider.default;
	const colors = stateColors(states, disabled && "disabled");
	// The whole 44pt height accepts a tap, not only the thumb.
	const height = tokens.metrics.touchTarget;

	return {
		container: ({ style }: Styled) => ({
			style: [
				{ height, paddingHorizontal: THUMB / 2 },
				styles.container,
				style,
			],
		}),
		hitArea: { style: [styles.hitArea, { height }] },
		track: {
			style: [
				styles.track,
				{
					borderRadius: tokens.radius.full,
					backgroundColor: colors.track,
				},
			],
		},
		fill: [
			styles.fill,
			{ borderRadius: tokens.radius.full, backgroundColor: colors.fill },
		],
		tick: (percent: number) => ({
			style: [
				styles.tick,
				{
					top: (height - TICK) / 2,
					left: `${percent}%` as const,
					backgroundColor: colors.track,
				},
			],
		}),
		thumb: [
			styles.thumb,
			{
				top: (height - THUMB) / 2,
				borderRadius: THUMB / 2,
				backgroundColor: colors.thumb,
			},
		],
	};
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
	},
	hitArea: {
		justifyContent: "center",
	},
	track: {
		height: TRACK,
		overflow: "hidden",
	},
	fill: {
		position: "absolute",
		top: 0,
		bottom: 0,
	},
	tick: {
		position: "absolute",
		width: 2,
		height: TICK,
		marginLeft: -1,
		borderRadius: 1,
	},
	thumb: {
		position: "absolute",
		left: -THUMB / 2,
		width: THUMB,
		height: THUMB,
		boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.25)",
	},
});
