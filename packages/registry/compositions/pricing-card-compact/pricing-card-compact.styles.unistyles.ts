import { StyleSheet } from "react-native-unistyles";

export function usePricingCardCompactStyles() {
	return {
		container: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			style: [
				styles.container(checked, pressed),
				disabled && styles.disabled,
			],
		}),
		body: { style: styles.body },
		name: { style: styles.name },
		shrink: { style: styles.shrink },
		price: { style: styles.price },
	};
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
			borderColor: checked
				? theme.colors.primary.default
				: theme.colors.border.default,
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
