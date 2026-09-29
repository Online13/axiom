import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Radio, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

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
	return (
		<Radio
			value={value}
			disabled={disabled}
			accessibilityLabel={[name, [price, period].filter(Boolean).join(" "), description, badge]
				.filter(Boolean)
				.join(", ")}
			style={style}
		>
			{({ checked, pressed }) => (
				<View style={[styles.container(checked, pressed), disabled && styles.disabled]}>
					<RadioIndicator checked={checked} disabled={disabled} />
					<View style={styles.body}>
						<View style={styles.name}>
							<Title variant="subheading" numberOfLines={1} style={styles.shrink}>
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
					<View style={styles.price}>
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

const styles = StyleSheet.create((theme) => ({
	container: (checked: boolean, pressed: boolean) => {
		const border = checked ? 2 : theme.tokens.metrics.hairline;
		return {
			flexDirection: "row",
			alignItems: "center",
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
	body: {
		flex: 1,
		gap: theme.tokens.spacing[1],
	},
	name: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	shrink: {
		flexShrink: 1,
	},
	price: {
		alignItems: "flex-end",
	},
	disabled: {
		opacity: 0.5,
	},
}));
