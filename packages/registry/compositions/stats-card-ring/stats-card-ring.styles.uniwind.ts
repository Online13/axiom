import type { ViewStyle } from "react-native";
import { Circle } from "react-native-svg";

import { useTheme } from "@/theme";

// The circles take their color as a prop.
export const StatsCardRingCircle = Circle;

export function useStatsCardRingStyles() {
	// A stroke is a prop of the circle, not a style: its color is read from the theme.
	const { colors } = useTheme();

	return {
		row: { className: "flex-row items-center gap-4" },
		ring: (size: number) => ({ style: { width: size, height: size } }),
		rotate: {
			style: { transform: [{ rotate: "-90deg" }] } satisfies ViewStyle,
		},
		track: { stroke: colors.border.default },
		arc: (reached: boolean) => ({
			stroke: reached ? colors.feedback.success : colors.primary.default,
		}),
		center: { className: "absolute inset-0 items-center justify-center" },
		body: { className: "flex-1 gap-1" },
	};
}
