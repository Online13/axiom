import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function usePricingCardCompactStyles() {
	const { tokens, colors } = useTheme();

	return {
		container: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			style: [
				styles.row,
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
		body: { style: [styles.grow, { gap: tokens.spacing[1] }] },
		name: { style: [styles.row, { gap: tokens.spacing[2] }] },
		shrink: { style: styles.shrink },
		price: { style: styles.price },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
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
});
