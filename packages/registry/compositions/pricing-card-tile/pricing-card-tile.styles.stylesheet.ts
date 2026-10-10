import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

export function usePricingCardTileStyles() {
	const { tokens, colors } = useTheme();

	return {
		// Grows with the row or rail it sits in, so tiles side by side share one height.
		slot: (style: StyleProp<ViewStyle>) => ({ style: [styles.slot, style] }),
		tile: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			style: [
				styles.tile,
				{
					gap: tokens.spacing[3],
					borderRadius: tokens.radius.lg,
					// The selected border is thicker: the padding shrinks by the difference so nothing moves.
					borderWidth: checked ? 2 : tokens.metrics.hairline,
					padding:
						tokens.spacing[4] - (checked ? 2 : tokens.metrics.hairline),
					borderColor: checked
						? colors.primary.default
						: colors.border.default,
					backgroundColor: pressed
						? colors.background.subtle
						: colors.background.default,
				},
				disabled && styles.disabled,
			],
		}),
		top: { style: [styles.top, { gap: tokens.spacing[2] }] },
		heading: { style: [styles.grow, { gap: tokens.spacing[2] }] },
		grow: { style: styles.grow },
		body: { style: { gap: tokens.spacing[1] } },
		price: { style: [styles.price, { gap: tokens.spacing[1] }] },
		shrink: { style: styles.shrink },
		trial: {
			style: [
				styles.trial,
				{
					paddingTop: tokens.spacing[3],
					borderTopWidth: tokens.metrics.hairline,
					borderTopColor: colors.border.default,
				},
			],
		},
	};
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
