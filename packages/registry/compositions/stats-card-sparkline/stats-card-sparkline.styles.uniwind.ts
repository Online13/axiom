import { Path } from "react-native-svg";

import { useTheme } from "@/theme";

type Feedback = "success" | "error" | null;

// The paths take their colors as props.
export const StatsCardSparklinePath = Path;

export function useStatsCardSparklineStyles() {
	// A fill and a stroke are props of the path, not styles: their color is read from the theme.
	const { colors } = useTheme();

	return {
		body: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		grow: { className: "flex-1" },
		shrink: { className: "shrink" },
		chart: (height: number) => ({ className: "mt-1", style: { height } }),
		// The trend's color, or the primary one when it is flat.
		area: (feedback: Feedback) => ({
			fill: feedback ? colors.feedback[feedback] : colors.primary.default,
		}),
		line: (feedback: Feedback) => ({
			stroke: feedback ? colors.feedback[feedback] : colors.primary.default,
		}),
	};
}
