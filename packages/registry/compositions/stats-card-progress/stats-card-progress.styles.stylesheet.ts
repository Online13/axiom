import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const BAR = 8;

export function useStatsCardProgressStyles() {
	const { tokens, colors } = useTheme();

	return {
		body: { style: { gap: tokens.spacing[2] } },
		row: { style: [styles.row, { gap: tokens.spacing[2] }] },
		baseline: { style: [styles.baseline, { gap: tokens.spacing[1] }] },
		track: {
			style: [styles.track, { backgroundColor: colors.border.default }],
		},
		fill: (ratio: number, reached: boolean) => ({
			style: [
				styles.fill,
				{
					width: `${ratio * 100}%` as const,
					backgroundColor: reached
						? colors.feedback.success
						: colors.primary.default,
				},
			],
		}),
		grow: { style: styles.grow },
		shrink: { style: styles.shrink },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	baseline: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	track: {
		overflow: "hidden",
		height: BAR,
		borderRadius: BAR / 2,
	},
	fill: {
		height: BAR,
		borderRadius: BAR / 2,
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
});
