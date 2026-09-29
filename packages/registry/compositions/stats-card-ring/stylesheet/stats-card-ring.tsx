import {
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Card, type CardVariant } from "@/components/ui/card";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

export type StatsCardRingProps = {
	/** What is measured: "Move", "Storage". */
	label: string;
	/** Already formatted: "420 kcal". */
	value: string;
	/** Share of the goal reached, from 0 to 1. Above 1, the ring stays full and turns green. */
	progress: number;
	/** Under the value: "of 600 kcal". */
	caption?: string;
	/** Inside the ring. Defaults to the percentage. */
	ringLabel?: string;
	variant?: CardVariant;
	/** Makes the card pressable, to open the detail. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

const SIZE = 64;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A metric next to a ring showing how much of a goal is reached. */
export function StatsCardRing({
	label,
	value,
	progress,
	caption,
	ringLabel,
	variant = "filled",
	onPress,
	style,
}: StatsCardRingProps) {
	const { tokens, colors } = useTheme();
	const ratio = Math.min(Math.max(progress, 0), 1);
	const percent = Math.round(Math.max(progress, 0) * 100);
	const reached = progress >= 1;
	const summary = [`${label}: ${value}`, caption, `${percent}%`]
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
				style={[styles.row, { gap: tokens.spacing[4] }]}
			>
				<View style={styles.ring}>
					{/* Rotated a quarter turn, so the arc starts at the top. */}
					<Svg width={SIZE} height={SIZE} style={styles.rotate}>
						<Circle
							cx={SIZE / 2}
							cy={SIZE / 2}
							r={RADIUS}
							fill="none"
							stroke={colors.border.default}
							strokeWidth={STROKE}
						/>
						{ratio > 0 ? (
							<Circle
								cx={SIZE / 2}
								cy={SIZE / 2}
								r={RADIUS}
								fill="none"
								stroke={reached ? colors.feedback.success : colors.primary.default}
								strokeWidth={STROKE}
								strokeLinecap="round"
								strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
								strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
							/>
						) : null}
					</Svg>
					<View style={styles.center}>
						<Text
							variant="caption"
							weight="semibold"
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						>
							{ringLabel ?? `${percent}%`}
						</Text>
					</View>
				</View>
				<View style={[styles.grow, { gap: tokens.spacing[1] }]}>
					<Text variant="footnote" color="muted" numberOfLines={1}>
						{label}
					</Text>
					<Title variant="heading" numberOfLines={1} adjustsFontSizeToFit>
						{value}
					</Title>
					{caption ? (
						<Text variant="caption" color="muted" numberOfLines={1}>
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
	ring: {
		width: SIZE,
		height: SIZE,
	},
	rotate: {
		transform: [{ rotate: "-90deg" }],
	},
	center: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
	grow: {
		flex: 1,
	},
});
