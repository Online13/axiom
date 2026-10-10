import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function usePricingCardTileStyles() {
	return {
		slot: (style: StyleProp<ViewStyle>) => ({ style: [styles.slot, style] }),
		tile: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			style: [styles.tile(checked, pressed), disabled && styles.disabled],
		}),
		top: { style: styles.top },
		heading: { style: styles.heading },
		grow: { style: styles.grow },
		body: { style: styles.body },
		price: { style: styles.price },
		shrink: { style: styles.shrink },
		trial: { style: styles.trial },
	};
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
			borderColor: checked
				? theme.colors.primary.default
				: theme.colors.border.default,
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
