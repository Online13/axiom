import { StyleSheet } from "react-native";
import { Circle } from "react-native-svg";

import { useTheme } from "@/theme";

// The circles take their color as a prop.
export const StatsCardRingCircle = Circle;

export function useStatsCardRingStyles() {
	const { tokens, colors } = useTheme();

	return {
		row: { style: [styles.row, { gap: tokens.spacing[4] }] },
		ring: (size: number) => ({ style: { width: size, height: size } }),
		rotate: { style: styles.rotate },
		track: { stroke: colors.border.default },
		arc: (reached: boolean) => ({
			stroke: reached ? colors.feedback.success : colors.primary.default,
		}),
		center: { style: styles.center },
		body: { style: [styles.grow, { gap: tokens.spacing[1] }] },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	rotate: {
		transform: [{ rotate: "-90deg" }],
	},
	center: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
	grow: {
		flex: 1,
	},
});
