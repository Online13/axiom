import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useControllableState } from "@/hooks/use-controllable-state";

import { usePricingCardToggleStyles } from "./pricing-card-toggle.styles";

export type Billing = "monthly" | "yearly";

export type PricingCardToggleProps = {
	/** Name of the plan: "Pro". */
	name: string;
	/** Already formatted, per period: "$12". */
	monthlyPrice: string;
	/** The same period as `monthlyPrice`, billed yearly: "$9.60". */
	yearlyPrice: string;
	/** After both prices: "/month". */
	period?: string;
	/** Next to the yearly price: "-20%". */
	discount?: string;
	/** Under the yearly price: "$115 billed yearly". */
	yearlyCaption?: string;
	/** One line on who the plan is for. */
	description?: string;
	/** Short features, each after a check. */
	features?: string[];
	/** Tag next to the name: "Most popular". */
	badge?: string;
	/** Draws the border in the primary color and makes the button solid. */
	featured?: boolean;
	/** Controlled billing, to share one choice across several cards. */
	billing?: Billing;
	defaultBilling?: Billing;
	onBillingChange?: (billing: Billing) => void;
	monthlyLabel?: string;
	yearlyLabel?: string;
	actionLabel?: string;
	/** Shows the button. Receives the billing shown when pressed. */
	onAction?: (billing: Billing) => void;
	style?: StyleProp<ViewStyle>;
};

export function PricingCardToggle({
	name,
	monthlyPrice,
	yearlyPrice,
	period = "/month",
	discount,
	yearlyCaption,
	description,
	features,
	badge,
	featured = false,
	billing: billingProp,
	defaultBilling = "monthly",
	onBillingChange,
	monthlyLabel = "Monthly",
	yearlyLabel = "Yearly",
	actionLabel = "Choose plan",
	onAction,
	style,
}: PricingCardToggleProps) {
	const styles = usePricingCardToggleStyles();
	const [billing, setBilling] = useControllableState<Billing>({
		value: billingProp,
		defaultValue: defaultBilling,
		onChange: onBillingChange,
	});
	const yearly = billing === "yearly";
	const price = yearly ? yearlyPrice : monthlyPrice;

	return (
		<Card variant="outlined" {...styles.card(featured, style)}>
			<Card.Header {...styles.header}>
				<SegmentedControl
					options={[
						{ value: "monthly", label: monthlyLabel },
						{ value: "yearly", label: yearlyLabel },
					]}
					value={billing}
					onValueChange={(next) => setBilling(next as Billing)}
				/>
				<View {...styles.plan}>
					<View {...styles.row}>
						<Title
							variant="subheading"
							numberOfLines={1}
							{...styles.grow}
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
					<View
						accessible
						accessibilityLabel={[
							`${price} ${period}`,
							yearly ? `instead of ${monthlyPrice}` : undefined,
							yearly ? discount : undefined,
						]
							.filter(Boolean)
							.join(", ")}
						{...styles.prices}
					>
						<View {...styles.price}>
							<Title variant="headingLg">{price}</Title>
							<Text variant="bodySm" color="muted">
								{period}
							</Text>
						</View>
						{yearly ? (
							<Text variant="bodySm" color="subtle" {...styles.struck}>
								{monthlyPrice}
							</Text>
						) : null}
						{yearly && discount ? (
							<Badge variant="success" size="sm" {...styles.center}>
								{discount}
							</Badge>
						) : null}
					</View>
					{yearly && yearlyCaption ? (
						<Text variant="footnote" color="muted">
							{yearlyCaption}
						</Text>
					) : null}
					{description ? (
						<Text variant="bodySm" color="muted">
							{description}
						</Text>
					) : null}
				</View>
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
			{onAction ? (
				<Card.Content>
					<Button
						variant={featured ? "solid" : "outline"}
						fullWidth
						onPress={() => onAction(billing)}
						accessibilityLabel={`${actionLabel}, ${name}, ${yearly ? yearlyLabel : monthlyLabel}`}
					>
						{actionLabel}
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}
