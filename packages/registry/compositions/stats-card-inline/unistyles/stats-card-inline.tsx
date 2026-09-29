import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type StatsCardInlineProps = {
	/** What is measured: "Revenue", "Steps". */
	label: string;
	/** Already formatted: "$12,480", "8,204". */
	value: string;
	icon?: IconName;
	/** Change against the previous period, already formatted: "+12.4%". */
	change?: string;
	/** Direction of the change. Colors it green or red, with `positive`. */
	trend?: "up" | "down" | "flat";
	/** Whether the change is good news. Defaults to `true` going up: pass `false` for spending, or latency. */
	positive?: boolean;
	variant?: CardVariant;
	/** Makes the card pressable, to open the detail. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

const TILE = 32;

/** A metric on one line: icon, label, value and change. For stacks of metrics or a dense dashboard. */
export function StatsCardInline({
	label,
	value,
	icon,
	change,
	trend = "flat",
	positive = trend !== "down",
	variant = "filled",
	onPress,
	style,
}: StatsCardInlineProps) {
	const summary = [`${label}: ${value}`, change].filter(Boolean).join(", ");

	return (
		<Card
			variant={variant}
			padding={3}
			onPress={onPress}
			accessibilityLabel={onPress ? summary : undefined}
			style={style}
		>
			<View
				accessible={!onPress}
				accessibilityLabel={summary}
				style={styles.row}
			>
				{icon ? (
					<View style={styles.tile(variant === "filled")}>
						<Icon name={icon} size="sm" />
					</View>
				) : null}
				<Text variant="bodySm" color="muted" numberOfLines={1} style={styles.grow}>
					{label}
				</Text>
				<Title variant="subheading" numberOfLines={1}>
					{value}
				</Title>
				{change ? (
					<Badge
						size="sm"
						variant={trend === "flat" ? "neutral" : positive ? "success" : "error"}
					>
						{change}
					</Badge>
				) : null}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	tile: (onFilled: boolean) => ({
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.sm,
		// Stands out from the card: the page color on a filled card, the filled color otherwise.
		backgroundColor: onFilled
			? theme.colors.background.default
			: theme.colors.background.subtle,
	}),
	grow: {
		flex: 1,
	},
}));
