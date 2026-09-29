import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type PricingCardHorizontalProps = {
	/** Name of the plan: "Pro". */
	name: string;
	/** Already formatted: "$12". */
	price: string;
	/** Under the price: "/month". */
	period?: string;
	/** One line on who the plan is for. */
	description?: string;
	/** Short features, each after a check. */
	features?: string[];
	/** Tag next to the name: "Most popular". */
	badge?: string;
	/** Draws the border in the primary color and makes the button solid. Use it on one plan. */
	featured?: boolean;
	/** The user's plan: the button is disabled and reads `currentLabel`. */
	current?: boolean;
	actionLabel?: string;
	currentLabel?: string;
	/** Shows the button. */
	onAction?: () => void;
	style?: StyleProp<ViewStyle>;
};

/** The plan on the left, the price and the button on the right. For tablets and landscape. */
export function PricingCardHorizontal({
	name,
	price,
	period,
	description,
	features,
	badge,
	featured = false,
	current = false,
	actionLabel = "Choose plan",
	currentLabel = "Current plan",
	onAction,
	style,
}: PricingCardHorizontalProps) {
	return (
		<Card
			variant="outlined"
			padding={5}
			style={[styles.card, featured && styles.featured, style]}
		>
			<View style={styles.plan}>
				<View style={styles.heading}>
					<View style={styles.row}>
						<Title variant="subheading" numberOfLines={1} style={styles.shrink}>
							{name}
						</Title>
						{badge ? (
							<Badge variant={featured ? "highlight" : "neutral"} size="sm">
								{badge}
							</Badge>
						) : null}
					</View>
					{description ? (
						<Text variant="bodySm" color="muted">
							{description}
						</Text>
					) : null}
				</View>
				{features?.length ? (
					<View style={styles.features}>
						{features.map((feature, index) => (
							<View key={index} style={styles.row}>
								<Icon name="check" size="sm" color={featured ? "default" : "muted"} />
								<Text variant="bodySm">{feature}</Text>
							</View>
						))}
					</View>
				) : null}
			</View>
			<View style={styles.side}>
				<View
					accessible
					accessibilityLabel={period ? `${price} ${period}` : price}
					style={styles.end}
				>
					<Title variant="headingLg">{price}</Title>
					{period ? (
						<Text variant="footnote" color="muted">
							{period}
						</Text>
					) : null}
				</View>
				{onAction || current ? (
					<Button
						variant={featured && !current ? "solid" : "outline"}
						disabled={current}
						onPress={onAction}
						accessibilityLabel={
							current ? `${currentLabel}, ${name}` : `${actionLabel}, ${name}`
						}
					>
						{current ? currentLabel : actionLabel}
					</Button>
				) : null}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	card: {
		flexDirection: "row",
		gap: theme.tokens.spacing[5],
	},
	featured: {
		borderWidth: 2,
		borderColor: theme.colors.primary.default,
	},
	plan: {
		flex: 1,
		gap: theme.tokens.spacing[3],
	},
	heading: {
		gap: theme.tokens.spacing[1],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	features: {
		flexDirection: "row",
		flexWrap: "wrap",
		columnGap: theme.tokens.spacing[4],
		rowGap: theme.tokens.spacing[2],
	},
	side: {
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: theme.tokens.spacing[3],
		paddingLeft: theme.tokens.spacing[5],
		borderLeftWidth: theme.tokens.metrics.hairline,
		borderLeftColor: theme.colors.border.default,
	},
	end: {
		alignItems: "flex-end",
	},
	shrink: {
		flexShrink: 1,
	},
}));
