import { StyleSheet } from "react-native";
import { Path } from "react-native-svg";

import { useTheme } from "@/theme";

type Feedback = "success" | "error" | null;

// The paths take their colors as props.
export const StatsCardSparklinePath = Path;

export function useStatsCardSparklineStyles() {
	const { tokens, colors } = useTheme();

	return {
		body: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		grow: { style: styles.grow },
		shrink: { style: styles.shrink },
		chart: (height: number) => ({
			style: { height, marginTop: tokens.spacing[1] },
		}),
		// The trend's color, or the primary one when it is flat.
		area: (feedback: Feedback) => ({
			fill: feedback ? colors.feedback[feedback] : colors.primary.default,
		}),
		line: (feedback: Feedback) => ({
			stroke: feedback ? colors.feedback[feedback] : colors.primary.default,
		}),
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
});
