import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Radio, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

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
	return (
		<Radio
			value={value}
			disabled={disabled}
			accessibilityLabel={[badge, name, [price, period].filter(Boolean).join(" "), description, trial]
				.filter(Boolean)
				.join(", ")}
			// Grows with the row or rail it sits in, so tiles side by side share one height.
			style={[styles.slot, style]}
		>
			{({ checked, pressed }) => (
				<View style={[styles.tile(checked, pressed), disabled && styles.disabled]}>
					<View style={styles.top}>
						<View style={styles.heading}>
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
					<View style={styles.grow} />
					<View style={styles.body}>
						<View style={styles.price}>
							<Title variant="headingLg" numberOfLines={1} adjustsFontSizeToFit style={styles.shrink}>
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
						<Text variant="footnote" weight="semibold" style={styles.trial}>
							{trial}
						</Text>
					) : null}
				</View>
			)}
		</Radio>
	);
}

const styles = StyleSheet.create((theme) => ({
	slot: {
		flexGrow: 1,
	},
	tile: (checked: boolean, pressed: boolean) => {
		const border = checked ? 2 : theme.tokens.metrics.hairline;
		return {
			flexGrow: 1,
			minHeight: 180,
			gap: theme.tokens.spacing[3],
			borderRadius: theme.tokens.radius.lg,
			// The selected border is thicker: the padding shrinks by the difference so nothing moves.
			borderWidth: border,
			padding: theme.tokens.spacing[4] - border,
			borderColor: checked ? theme.colors.primary.default : theme.colors.border.default,
			backgroundColor: pressed
				? theme.colors.background.subtle
				: theme.colors.background.default,
		};
	},
	top: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[2],
	},
	heading: {
		flex: 1,
		gap: theme.tokens.spacing[2],
	},
	body: {
		gap: theme.tokens.spacing[1],
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: theme.tokens.spacing[1],
	},
	trial: {
		alignSelf: "stretch",
		paddingTop: theme.tokens.spacing[3],
		borderTopWidth: theme.tokens.metrics.hairline,
		borderTopColor: theme.colors.border.default,
	},
	grow: {
		flex: 1,
	},
	shrink: {
		flexShrink: 1,
	},
	disabled: {
		opacity: 0.5,
	},
}));
