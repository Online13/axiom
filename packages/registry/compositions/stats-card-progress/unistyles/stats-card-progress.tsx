import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type StatsCardProgressProps = {
	/** What is measured: "Steps", "Savings". */
	label: string;
	/** Already formatted: "8,204". */
	value: string;
	/** The target, after the value: "/ 10,000". */
	goal?: string;
	/** Share of the goal reached, from 0 to 1. Above 1, the bar stays full and turns green. */
	progress: number;
	icon?: IconName;
	/** Under the bar, on the right: "1,796 to go". The percentage sits on the left. */
	caption?: string;
	variant?: CardVariant;
	/** Makes the card pressable, to open the detail. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

const BAR = 8;

export function StatsCardProgress({
	label,
	value,
	goal,
	progress,
	icon,
	caption,
	variant = "filled",
	onPress,
	style,
}: StatsCardProgressProps) {
	const ratio = Math.min(Math.max(progress, 0), 1);
	const percent = Math.round(Math.max(progress, 0) * 100);
	const reached = progress >= 1;
	const summary = [`${label}: ${value}`, goal, `${percent}%`, caption]
		.filter(Boolean)
		.join(", ");

	return (
		<Card
			variant={variant}
			padding={4}
			onPress={onPress}
			accessibilityLabel={onPress ? summary : undefined}
			style={style}
		>
			<View
				accessible={!onPress}
				accessibilityRole="progressbar"
				accessibilityLabel={summary}
				accessibilityValue={{ min: 0, max: 100, now: Math.min(percent, 100) }}
				style={styles.body}
			>
				<View style={styles.row}>
					{icon ? <Icon name={icon} size="sm" color="muted" /> : null}
					<Text variant="footnote" color="muted" numberOfLines={1} style={styles.grow}>
						{label}
					</Text>
				</View>
				<View style={styles.baseline}>
					<Title variant="heading" numberOfLines={1}>
						{value}
					</Title>
					{goal ? (
						<Text variant="bodySm" color="muted" numberOfLines={1} style={styles.shrink}>
							{goal}
						</Text>
					) : null}
				</View>
				<View style={styles.track}>
					<View style={styles.fill(ratio, reached)} />
				</View>
				<View style={styles.row}>
					<Text variant="caption" weight="semibold" color={reached ? "success" : "default"}>
						{percent}%
					</Text>
					{caption ? (
						<Text variant="caption" color="muted" numberOfLines={1} align="right" style={styles.grow}>
							{caption}
						</Text>
					) : null}
				</View>
			</View>
		</Card>
	);
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
