import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type StatsTrend = "up" | "down" | "flat";

export type StatsCardProps = {
	/** What is measured: "Revenue", "Steps". */
	label: string;
	/** Already formatted: "$12,480", "8,204". */
	value: string;
	icon?: IconName;
	/** Change against the previous period, already formatted: "+12.4%". */
	change?: string;
	/** Direction of the change. Colors it green or red, with `positive`. */
	trend?: StatsTrend;
	/** Whether the change is good news. Defaults to `true` going up: pass `false` for spending, or latency. */
	positive?: boolean;
	/** After the change: "vs last week". */
	caption?: string;
	variant?: CardVariant;
	/** Makes the card pressable, to open the detail. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function StatsCard({
	label,
	value,
	icon,
	change,
	trend = "flat",
	positive = trend !== "down",
	caption,
	variant = "filled",
	onPress,
	style,
}: StatsCardProps) {
	const summary = [`${label}: ${value}`, change, caption]
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
				accessibilityLabel={summary}
				style={styles.body}
			>
				<View style={styles.row}>
					{icon ? <Icon name={icon} size="sm" color="muted" /> : null}
					<Text variant="footnote" color="muted" numberOfLines={1} style={styles.grow}>
						{label}
					</Text>
				</View>
				<Title variant="heading" numberOfLines={1} adjustsFontSizeToFit>
					{value}
				</Title>
				{change || caption ? (
					<View style={styles.row}>
						{change ? (
							<Badge
								size="sm"
								variant={
									trend === "flat" ? "neutral" : positive ? "success" : "error"
								}
							>
								{change}
							</Badge>
						) : null}
						{caption ? (
							<Text variant="caption" color="muted" numberOfLines={1} style={styles.grow}>
								{caption}
							</Text>
						) : null}
					</View>
				) : null}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	body: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
