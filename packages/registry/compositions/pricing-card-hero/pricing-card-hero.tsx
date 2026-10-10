import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import {
	PricingCardHeroIcon,
	usePricingCardHeroStyles,
} from "./pricing-card-hero.styles";

export type PricingCardHeroProps = {
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
	actionLabel?: string;
	/** Shows the button. */
	onAction?: () => void;
	style?: StyleProp<ViewStyle>;
};

/**
 * The plan to push, on the primary color with inverted text. Show it once, next to
 * outlined `PricingCard`s for the other plans.
 */
export function PricingCardHero({
	name,
	price,
	period,
	description,
	features,
	badge,
	actionLabel = "Choose plan",
	onAction,
	style,
}: PricingCardHeroProps) {
	const styles = usePricingCardHeroStyles();

	return (
		<Card variant="filled" {...styles.card(style)}>
			<Card.Header {...styles.header}>
				<View {...styles.row}>
					<Title variant="subheading" numberOfLines={1} {...styles.label}>
						{name}
					</Title>
					{badge ? (
						<Badge variant="highlight" size="sm">
							{badge}
						</Badge>
					) : null}
				</View>
				<View
					accessible
					accessibilityLabel={period ? `${price} ${period}` : price}
					{...styles.price}
				>
					<Title variant="display" {...styles.on}>
						{price}
					</Title>
					{period ? (
						<Text variant="bodySm" {...styles.onMuted}>
							{period}
						</Text>
					) : null}
				</View>
				{description ? (
					<Text variant="bodySm" {...styles.onMuted}>
						{description}
					</Text>
				) : null}
			</Card.Header>
			{features?.length ? (
				<Card.Content {...styles.features}>
					{features.map((feature, index) => (
						<View key={index} {...styles.row}>
							<PricingCardHeroIcon
								name="check"
								size="sm"
								{...styles.tint}
							/>
							<Text variant="bodySm" {...styles.label}>
								{feature}
							</Text>
						</View>
					))}
				</Card.Content>
			) : null}
			{onAction ? (
				<Card.Content>
					{/* The solid button inverted: the primary text on the `on` color. */}
					<Button
						fullWidth
						onPress={onAction}
						accessibilityLabel={`${actionLabel}, ${name}`}
						{...styles.button}
					>
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							{...styles.buttonLabel}
						>
							{actionLabel}
						</Text>
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}
