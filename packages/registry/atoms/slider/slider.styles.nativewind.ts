import type { StyleProp, ViewStyle } from "react-native";

import { cx, useTheme } from "@/theme";
import { stateColors } from "@/theme/components/states";

const THUMB = 20;
const TRACK = 4;
const TICK = 8;

type Styled = { className?: string; style?: StyleProp<ViewStyle> };

// The fill and the thumbs are animated views, which take `style` only: this component reads its
// tokens from the theme.
export function useSliderStyles(disabled: boolean) {
	const { tokens, components } = useTheme();
	const states = components.slider.default;
	const colors = stateColors(states, disabled && "disabled");
	// The whole 44pt height accepts a tap, not only the thumb.
	const height = tokens.metrics.touchTarget;

	return {
		container: ({ className, style }: Styled) => ({
			className: cx("justify-center", className),
			style: [{ height, paddingHorizontal: THUMB / 2 }, style],
		}),
		hitArea: { className: "justify-center", style: { height } },
		track: {
			className: "overflow-hidden rounded-full",
			style: { height: TRACK, backgroundColor: colors.track },
		},
		fill: {
			position: "absolute",
			top: 0,
			bottom: 0,
			borderRadius: tokens.radius.full,
			backgroundColor: colors.fill,
		} satisfies ViewStyle,
		tick: (percent: number) => ({
			className: "absolute",
			style: {
				width: 2,
				height: TICK,
				marginLeft: -1,
				borderRadius: 1,
				top: (height - TICK) / 2,
				left: `${percent}%` as const,
				backgroundColor: colors.track,
			},
		}),
		thumb: {
			position: "absolute",
			left: -THUMB / 2,
			width: THUMB,
			height: THUMB,
			boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.25)",
			top: (height - THUMB) / 2,
			borderRadius: THUMB / 2,
			backgroundColor: colors.thumb,
		} satisfies ViewStyle,
	};
}
