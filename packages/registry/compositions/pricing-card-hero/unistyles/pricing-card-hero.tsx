import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

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

// The icon takes its color as a prop, not as a style: mapped from the theme through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

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
	return (
		<Card variant="filled" style={[styles.card, style]}>
			<Card.Header style={styles.header}>
				<View style={styles.row}>
					<Title variant="subheading" numberOfLines={1} style={[styles.grow, styles.on]}>
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
					style={styles.price}
				>
					<Title variant="display" style={styles.on}>
						{price}
					</Title>
					{period ? (
						<Text variant="bodySm" style={styles.onMuted}>
							{period}
						</Text>
					) : null}
				</View>
				{description ? (
					<Text variant="bodySm" style={styles.onMuted}>
						{description}
					</Text>
				) : null}
			</Card.Header>
			{features?.length ? (
				<Card.Content style={styles.features}>
					{features.map((feature, index) => (
						<View key={index} style={styles.row}>
							<ThemedIcon
								name="check"
								size="sm"
								uniProps={(theme) => ({ color: theme.colors.primary.on })}
							/>
							<Text variant="bodySm" style={[styles.grow, styles.on]}>
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
						style={styles.button}
					>
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							style={styles.buttonLabel}
						>
							{actionLabel}
						</Text>
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	card: {
		backgroundColor: theme.colors.primary.default,
	},
	header: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: theme.tokens.spacing[1],
	},
	on: {
		color: theme.colors.primary.on,
	},
	onMuted: {
		color: theme.colors.primary.on,
		opacity: 0.72,
	},
	features: {
		gap: theme.tokens.spacing[2],
	},
	button: {
		backgroundColor: theme.colors.primary.on,
	},
	buttonLabel: {
		color: theme.colors.primary.default,
		fontWeight: FONT_WEIGHT.semibold,
	},
	grow: {
		flex: 1,
	},
}));
