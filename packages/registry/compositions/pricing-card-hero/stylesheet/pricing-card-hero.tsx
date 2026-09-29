import {
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();
	const on = { color: colors.primary.on };
	const onMuted = { color: colors.primary.on, opacity: 0.72 };

	return (
		<Card
			variant="filled"
			style={[{ backgroundColor: colors.primary.default }, style]}
		>
			<Card.Header style={{ gap: tokens.spacing[2] }}>
				<View style={[styles.row, { gap: tokens.spacing[2] }]}>
					<Title variant="subheading" numberOfLines={1} style={[styles.grow, on]}>
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
					style={[styles.price, { gap: tokens.spacing[1] }]}
				>
					<Title variant="display" style={on}>
						{price}
					</Title>
					{period ? (
						<Text variant="bodySm" style={onMuted}>
							{period}
						</Text>
					) : null}
				</View>
				{description ? (
					<Text variant="bodySm" style={onMuted}>
						{description}
					</Text>
				) : null}
			</Card.Header>
			{features?.length ? (
				<Card.Content style={{ gap: tokens.spacing[2] }}>
					{features.map((feature, index) => (
						<View key={index} style={[styles.row, { gap: tokens.spacing[2] }]}>
							<Icon name="check" size="sm" color={colors.primary.on} />
							<Text variant="bodySm" style={[styles.grow, on]}>
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
						style={{ backgroundColor: colors.primary.on }}
					>
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							style={{
								color: colors.primary.default,
								fontWeight: FONT_WEIGHT.semibold,
							}}
						>
							{actionLabel}
						</Text>
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	grow: {
		flex: 1,
	},
});
