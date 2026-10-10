import { StyleSheet } from "react-native-unistyles";

const BAR = 8;

export function useStatsCardProgressStyles() {
	return {
		body: { style: styles.body },
		row: { style: styles.row },
		baseline: { style: styles.baseline },
		track: { style: styles.track },
		fill: (ratio: number, reached: boolean) => ({
			style: styles.fill(ratio, reached),
		}),
		grow: { style: styles.grow },
		shrink: { style: styles.shrink },
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
	baseline: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: theme.tokens.spacing[1],
	},
	track: {
		overflow: "hidden",
		height: BAR,
		borderRadius: BAR / 2,
		backgroundColor: theme.colors.border.default,
	},
	fill: (ratio: number, reached: boolean) => ({
		width: `${ratio * 100}%`,
		height: BAR,
		borderRadius: BAR / 2,
		backgroundColor: reached
			? theme.colors.feedback.success
			: theme.colors.primary.default,
	}),
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
}));
