import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

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
	// The track color is interpolated between its off and on values inside a worklet, so both are
	// read here as plain values rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const states = theme.components.switch.default;
	const off = stateColors(states, disabled && "disabled");
	const on = stateColors(states, "checked", disabled && "disabled");
	const { width, height, thumb } = DIMENSIONS[size];

	return {
		trackColors: [off.track, on.track],
		travel: width - thumb - (height - thumb),
		track: (style: StyleProp<ViewStyle>) => [styles.track(size), style],
		thumb: styles.thumb(size, disabled),
	};
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
			backgroundColor: stateColors(states, "checked", disabled && "disabled")
				.thumb,
			boxShadow: "0px 2px 4px hsla(0, 0%, 0%, 0.2)",
		};
	},
}));
