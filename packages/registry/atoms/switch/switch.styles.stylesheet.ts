import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

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

export function useSwitchStyles(size: SwitchSize, disabled: boolean) {
	// The track color is interpolated between its off and on values: both are read as plain values.
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
			styles.track,
			{ width, height, padding: inset, borderRadius: height / 2 },
			style,
		],
		thumb: [
			styles.thumb,
			{
				width: thumb,
				height: thumb,
				borderRadius: thumb / 2,
				backgroundColor: on.thumb,
			},
		],
	};
}

const styles = StyleSheet.create({
	track: {
		justifyContent: "center",
	},
	thumb: {
		boxShadow: "0px 2px 4px hsla(0, 0%, 0%, 0.2)",
	},
});
