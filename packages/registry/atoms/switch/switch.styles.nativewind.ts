import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "@/theme";

import type { SwitchSize } from "./switch";
import { stateColors } from "@/theme/components/states";

// md matches the iOS system switch.
const DIMENSIONS: Record<
	SwitchSize,
	{ width: number; height: number; thumb: number }
> = {
	sm: { width: 40, height: 24, thumb: 20 },
	md: { width: 51, height: 31, thumb: 27 },
};

// The track and the thumb are animated views, which take `style` only, and the track's color is
// interpolated between its off and on values: this component reads its tokens from the theme.
export function useSwitchStyles(size: SwitchSize, disabled: boolean) {
	const { components } = useTheme();
	const states = components.switch.default;
	const off = stateColors(states, disabled && "disabled");
	const on = stateColors(states, "checked", disabled && "disabled");
	const { width, height, thumb } = DIMENSIONS[size];
	// The thumb is centered in the track: the same inset on every side.
	const inset = (height - thumb) / 2;

	return {
		trackColors: [off.track, on.track],
		travel: width - thumb - inset * 2,
		track: (style: StyleProp<ViewStyle>) => [
			{
				justifyContent: "center" as const,
				width,
				height,
				padding: inset,
				borderRadius: height / 2,
			},
			style,
		],
		thumb: [
			{
				width: thumb,
				height: thumb,
				borderRadius: thumb / 2,
				backgroundColor: on.thumb,
				boxShadow: "0px 2px 4px hsla(0, 0%, 0%, 0.2)",
			},
		],
	};
}
