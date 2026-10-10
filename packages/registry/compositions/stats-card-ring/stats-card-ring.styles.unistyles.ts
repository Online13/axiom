import { Circle } from "react-native-svg";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import type { Theme } from "@/theme";

// The circles take their color as a prop, not as a style: mapped from the theme through `uniProps`.
export const StatsCardRingCircle = withUnistyles(Circle);

export function useStatsCardRingStyles() {
	return {
		row: { style: styles.row },
		ring: (size: number) => ({ style: styles.ring(size) }),
		rotate: { style: styles.rotate },
		track: {
			uniProps: (theme: Theme) => ({ stroke: theme.colors.border.default }),
		},
		arc: (reached: boolean) => ({
			uniProps: (theme: Theme) => ({
				stroke: reached
					? theme.colors.feedback.success
					: theme.colors.primary.default,
			}),
		}),
		center: { style: styles.center },
		body: { style: styles.body },
	};
}

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[4],
	},
	ring: (size: number) => ({
		width: size,
		height: size,
	}),
	rotate: {
		transform: [{ rotate: "-90deg" }],
	},
	center: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	body: {
		flex: 1,
		gap: theme.tokens.spacing[1],
	},
}));
