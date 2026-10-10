import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { usePricingCardStyles } from "./pricing-card.styles";

export type PricingCardProps = {
	/** Name of the plan: "Pro". */
	name: string;
	/** Already formatted: "$12". */
	price: string;
	/** After the price, smaller: "/month". */
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

export function PricingCard({
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
}: PricingCardProps) {
	const styles = usePricingCardStyles();

	return (
		<Card variant="outlined" {...styles.card(featured, style)}>
			<Card.Header {...styles.header}>
				<View {...styles.row}>
					<Title variant="subheading" numberOfLines={1} {...styles.grow}>
						{name}
					</Title>
					{badge ? (
						<Badge variant={featured ? "highlight" : "neutral"} size="sm">
							{badge}
						</Badge>
					) : null}
				</View>
				<View
					accessible
					accessibilityLabel={period ? `${price} ${period}` : price}
					{...styles.price}
				>
					<Title variant="headingLg">{price}</Title>
					{period ? (
						<Text variant="bodySm" color="muted">
							{period}
						</Text>
					) : null}
				</View>
				{description ? (
					<Text variant="bodySm" color="muted">
						{description}
					</Text>
				) : null}
			</Card.Header>
			{features?.length ? (
				<Card.Content {...styles.features}>
					{features.map((feature, index) => (
						<View key={index} {...styles.row}>
							<Icon
								name="check"
								size="sm"
								color={featured ? "default" : "muted"}
							/>
							<Text variant="bodySm" {...styles.grow}>
								{feature}
							</Text>
						</View>
					))}
				</Card.Content>
			) : null}
			{onAction || current ? (
				<Card.Content>
					<Button
						variant={featured && !current ? "solid" : "outline"}
						disabled={current}
						onPress={onAction}
						accessibilityLabel={
							current
								? `${currentLabel}, ${name}`
								: `${actionLabel}, ${name}`
						}
					>
						{current ? currentLabel : actionLabel}
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}
