import { useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Card, type CardVariant } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type StatsCardSparklineProps = {
	/** What is measured: "Revenue", "Steps". */
	label: string;
	/** Already formatted: "$12,480", "8,204". */
	value: string;
	/** The recent values, oldest first: drawn as a line under the value. Two points at least. */
	data: number[];
	icon?: IconName;
	/** Change against the previous period, already formatted: "+12.4%". */
	change?: string;
	/** Direction of the change. Colors the change and the line green or red, with `positive`. */
	trend?: "up" | "down" | "flat";
	/** Whether the change is good news. Defaults to `true` going up: pass `false` for spending, or latency. */
	positive?: boolean;
	/** After the change: "vs last week". */
	caption?: string;
	variant?: CardVariant;
	/** Makes the card pressable, to open the detail. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

const HEIGHT = 40;
const STROKE = 2;

// The path takes its colors as props, not as a style: mapped from the theme through `uniProps`.
const ThemedPath = withUnistyles(Path);

export function StatsCardSparkline({
	label,
	value,
	data,
	icon,
	change,
	trend = "flat",
	positive = trend !== "down",
	caption,
	variant = "filled",
	onPress,
	style,
}: StatsCardSparklineProps) {
	const [width, setWidth] = useState(0);
	const feedback = trend === "flat" ? null : positive ? "success" : "error";
	const line = sparklinePath(data, width, HEIGHT, STROKE);
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
				<View style={styles.row}>
					<Title variant="heading" numberOfLines={1} adjustsFontSizeToFit style={styles.shrink}>
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
				{/* Decorative: the summary already reads the value and the change. */}
				<View
					importantForAccessibility="no-hide-descendants"
					onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
					style={styles.chart}
				>
					{line ? (
						<Svg width={width} height={HEIGHT}>
							<ThemedPath
								d={line.area}
								fillOpacity={0.12}
								uniProps={(theme) => ({
									fill: feedback ? theme.colors.feedback[feedback] : theme.colors.primary.default,
								})}
							/>
							<ThemedPath
								d={line.stroke}
								fill="none"
								strokeWidth={STROKE}
								strokeLinecap="round"
								strokeLinejoin="round"
								uniProps={(theme) => ({
									stroke: feedback ? theme.colors.feedback[feedback] : theme.colors.primary.default,
								})}
							/>
						</Svg>
					) : null}
				</View>
				{caption ? (
					<Text variant="caption" color="muted" numberOfLines={1}>
						{caption}
					</Text>
				) : null}
			</View>
		</Card>
	);
}

/** The line through the points, scaled to the box, and the same line closed along the bottom edge. */
function sparklinePath(data: number[], width: number, height: number, stroke: number) {
	if (data.length < 2 || width === 0) return null;

	const min = Math.min(...data);
	const range = Math.max(...data) - min || 1;
	// Inset by half the stroke, so the line and its round caps aren't cut at the edges.
	const inset = stroke / 2;
	const points = data.map((point, index) => [
		inset + (index / (data.length - 1)) * (width - stroke),
		inset + (1 - (point - min) / range) * (height - stroke),
	]);
	const strokePath = points
		.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
		.join(" ");

	return {
		stroke: strokePath,
		area: `${strokePath} L${width},${height} L0,${height} Z`,
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
	chart: {
		height: HEIGHT,
		marginTop: theme.tokens.spacing[1],
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
}));
