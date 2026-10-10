import { View, type StyleProp, type ViewStyle } from "react-native";

import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { useStatsCardProgressStyles } from "./stats-card-progress.styles";

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
	const styles = useStatsCardProgressStyles();
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
				accessibilityValue={{
					min: 0,
					max: 100,
					now: Math.min(percent, 100),
				}}
				{...styles.body}
			>
				<View {...styles.row}>
					{icon ? <Icon name={icon} size="sm" color="muted" /> : null}
					<Text
						variant="footnote"
						color="muted"
						numberOfLines={1}
						{...styles.grow}
					>
						{label}
					</Text>
				</View>
				<View {...styles.baseline}>
					<Title variant="heading" numberOfLines={1}>
						{value}
					</Title>
					{goal ? (
						<Text
							variant="bodySm"
							color="muted"
							numberOfLines={1}
							{...styles.shrink}
						>
							{goal}
						</Text>
					) : null}
				</View>
				<View {...styles.track}>
					<View {...styles.fill(ratio, reached)} />
				</View>
				<View {...styles.row}>
					<Text
						variant="caption"
						weight="semibold"
						color={reached ? "success" : "default"}
					>
						{percent}%
					</Text>
					{caption ? (
						<Text
							variant="caption"
							color="muted"
							numberOfLines={1}
							align="right"
							{...styles.grow}
						>
							{caption}
						</Text>
					) : null}
				</View>
			</View>
		</Card>
	);
}
