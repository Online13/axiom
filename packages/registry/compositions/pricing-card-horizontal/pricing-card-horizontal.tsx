import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { usePricingCardHorizontalStyles } from "./pricing-card-horizontal.styles";

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
	const styles = usePricingCardHorizontalStyles();

	return (
		<Card variant="outlined" padding={5} {...styles.card(featured, style)}>
			<View {...styles.plan}>
				<View {...styles.heading}>
					<View {...styles.row}>
						<Title
							variant="subheading"
							numberOfLines={1}
							{...styles.shrink}
						>
							{name}
						</Title>
						{badge ? (
							<Badge
								variant={featured ? "highlight" : "neutral"}
								size="sm"
							>
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
					<View {...styles.features}>
						{features.map((feature, index) => (
							<View key={index} {...styles.row}>
								<Icon
									name="check"
									size="sm"
									color={featured ? "default" : "muted"}
								/>
								<Text variant="bodySm">{feature}</Text>
							</View>
						))}
					</View>
				) : null}
			</View>
			<View {...styles.side}>
				<View
					accessible
					accessibilityLabel={period ? `${price} ${period}` : price}
					{...styles.end}
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
							current
								? `${currentLabel}, ${name}`
								: `${actionLabel}, ${name}`
						}
					>
						{current ? currentLabel : actionLabel}
					</Button>
				) : null}
			</View>
		</Card>
	);
}
