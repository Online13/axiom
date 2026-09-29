import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Radio, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();
	const border = tokens.metrics.hairline;

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
				<View
					style={[
						styles.tile,
						{
							gap: tokens.spacing[3],
							borderRadius: tokens.radius.lg,
							// The selected border is thicker: the padding shrinks by the difference so nothing moves.
							borderWidth: checked ? 2 : border,
							padding: tokens.spacing[4] - (checked ? 2 : border),
							borderColor: checked ? colors.primary.default : colors.border.default,
							backgroundColor: pressed
								? colors.background.subtle
								: colors.background.default,
						},
						disabled && styles.disabled,
					]}
				>
					<View style={[styles.top, { gap: tokens.spacing[2] }]}>
						<View style={[styles.grow, { gap: tokens.spacing[2] }]}>
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
					<View style={{ gap: tokens.spacing[1] }}>
						<View style={[styles.price, { gap: tokens.spacing[1] }]}>
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
						<Text
							variant="footnote"
							weight="semibold"
							style={[
								styles.trial,
								{
									paddingTop: tokens.spacing[3],
									borderTopWidth: tokens.metrics.hairline,
									borderTopColor: colors.border.default,
								},
							]}
						>
							{trial}
						</Text>
					) : null}
				</View>
			)}
		</Radio>
	);
}

const styles = StyleSheet.create({
	slot: {
		flexGrow: 1,
	},
	tile: {
		flexGrow: 1,
		minHeight: 180,
	},
	top: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	price: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	trial: {
		alignSelf: "stretch",
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
});
