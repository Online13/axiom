import { Path } from "react-native-svg";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import type { Theme } from "@/theme";

type Feedback = "success" | "error" | null;

// The paths take their colors as props, not as a style: mapped from the theme through `uniProps`.
export const StatsCardSparklinePath = withUnistyles(Path);

export function useStatsCardSparklineStyles() {
	return {
		body: { style: styles.body },
		row: { style: styles.row },
		grow: { style: styles.grow },
		shrink: { style: styles.shrink },
		chart: (height: number) => ({ style: styles.chart(height) }),
		// The trend's color, or the primary one when it is flat.
		area: (feedback: Feedback) => ({
			uniProps: (theme: Theme) => ({
				fill: feedback
					? theme.colors.feedback[feedback]
					: theme.colors.primary.default,
			}),
		}),
		line: (feedback: Feedback) => ({
			uniProps: (theme: Theme) => ({
				stroke: feedback
					? theme.colors.feedback[feedback]
					: theme.colors.primary.default,
			}),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	body: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	chart: (height: number) => ({
		height,
		marginTop: theme.tokens.spacing[1],
	}),
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
}));
