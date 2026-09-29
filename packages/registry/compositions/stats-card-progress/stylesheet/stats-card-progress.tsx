import {
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();
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
				style={{ gap: tokens.spacing[2] }}
			>
				<View style={[styles.row, { gap: tokens.spacing[2] }]}>
					{icon ? <Icon name={icon} size="sm" color="muted" /> : null}
					<Text variant="footnote" color="muted" numberOfLines={1} style={styles.grow}>
						{label}
					</Text>
				</View>
				<View style={[styles.baseline, { gap: tokens.spacing[1] }]}>
					<Title variant="heading" numberOfLines={1}>
						{value}
					</Title>
					{goal ? (
						<Text variant="bodySm" color="muted" numberOfLines={1} style={styles.shrink}>
							{goal}
						</Text>
					) : null}
				</View>
				<View
					style={[
						styles.track,
						{
							height: BAR,
							borderRadius: BAR / 2,
							backgroundColor: colors.border.default,
						},
					]}
				>
					<View
						style={{
							width: `${ratio * 100}%`,
							height: BAR,
							borderRadius: BAR / 2,
							backgroundColor: reached ? colors.feedback.success : colors.primary.default,
						}}
					/>
				</View>
				<View style={[styles.row, { gap: tokens.spacing[2] }]}>
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
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
});
