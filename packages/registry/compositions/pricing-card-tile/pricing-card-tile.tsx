import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Radio, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { usePricingCardTileStyles } from "./pricing-card-tile.styles";

export type PricingCardTileProps = {
	/** Value given to the RadioGroup when this plan is picked. */
	value: string;
	/** Name of the plan: "Yearly". */
	name: string;
	/** Already formatted, in large type: "$3.33". */
	price: string;
	/** After the price: "/month". */
	period?: string;
	/** Under the price, muted: "$39.99 billed yearly". */
	description?: string;
	/** Last line, emphasized: "7-day free trial". */
	trial?: string;
	/** Above the name: "Best value". */
	badge?: string;
	disabled?: boolean;
	/** Give the tile a width: tiles sit side by side, in a row or a horizontal rail. */
	style?: StyleProp<ViewStyle>;
};

/** A large paywall tile, App Store style. Render the tiles inside a `RadioGroup`, which holds the selected plan. */
export function PricingCardTile({
	value,
	name,
	price,
	period,
	description,
	trial,
	badge,
	disabled = false,
	style,
}: PricingCardTileProps) {
	const styles = usePricingCardTileStyles();

	return (
		<Radio
			value={value}
			disabled={disabled}
			accessibilityLabel={[
				badge,
				name,
				[price, period].filter(Boolean).join(" "),
				description,
				trial,
			]
				.filter(Boolean)
				.join(", ")}
			// Grows with the row or rail it sits in, so tiles side by side share one height.
			{...styles.slot(style)}
		>
			{({ checked, pressed }) => (
				<View {...styles.tile(checked, pressed, disabled)}>
					<View {...styles.top}>
						<View {...styles.heading}>
							{badge ? (
								<Badge variant="highlight" size="sm">
									{badge}
								</Badge>
							) : null}
							<Text weight="semibold" numberOfLines={1}>
								{name}
							</Text>
						</View>
						<RadioIndicator checked={checked} disabled={disabled} />
					</View>
					<View {...styles.grow} />
					<View {...styles.body}>
						<View {...styles.price}>
							<Title
								variant="headingLg"
								numberOfLines={1}
								adjustsFontSizeToFit
								{...styles.shrink}
							>
								{price}
							</Title>
							{period ? (
								<Text variant="bodySm" color="muted">
									{period}
								</Text>
							) : null}
						</View>
						{description ? (
							<Text variant="footnote" color="muted">
								{description}
							</Text>
						) : null}
					</View>
					{trial ? (
						<Text variant="footnote" weight="semibold" {...styles.trial}>
							{trial}
						</Text>
					) : null}
				</View>
			)}
		</Radio>
	);
}
