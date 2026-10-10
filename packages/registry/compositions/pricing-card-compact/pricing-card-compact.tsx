import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Radio, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { usePricingCardCompactStyles } from "./pricing-card-compact.styles";

export type PricingCardCompactProps = {
	/** Value given to the RadioGroup when this plan is picked. */
	value: string;
	/** Name of the plan: "Yearly". */
	name: string;
	/** Already formatted: "$99". */
	price: string;
	/** After the price, smaller: "/year". */
	period?: string;
	/** Under the name: "$8.25 a month, billed yearly". */
	description?: string;
	/** Tag next to the name: "Save 30%". */
	badge?: string;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

/** A plan on one selectable row. Render it inside a `RadioGroup`, which holds the selected plan. */
export function PricingCardCompact({
	value,
	name,
	price,
	period,
	description,
	badge,
	disabled = false,
	style,
}: PricingCardCompactProps) {
	const styles = usePricingCardCompactStyles();

	return (
		<Radio
			value={value}
			disabled={disabled}
			accessibilityLabel={[
				name,
				[price, period].filter(Boolean).join(" "),
				description,
				badge,
			]
				.filter(Boolean)
				.join(", ")}
			style={style}
		>
			{({ checked, pressed }) => (
				<View {...styles.container(checked, pressed, disabled)}>
					<RadioIndicator checked={checked} disabled={disabled} />
					<View {...styles.body}>
						<View {...styles.name}>
							<Title
								variant="subheading"
								numberOfLines={1}
								{...styles.shrink}
							>
								{name}
							</Title>
							{badge ? (
								<Badge variant="highlight" size="sm">
									{badge}
								</Badge>
							) : null}
						</View>
						{description ? (
							<Text variant="footnote" color="muted">
								{description}
							</Text>
						) : null}
					</View>
					<View {...styles.price}>
						<Title variant="subheading">{price}</Title>
						{period ? (
							<Text variant="footnote" color="muted">
								{period}
							</Text>
						) : null}
					</View>
				</View>
			)}
		</Radio>
	);
}
