import type { StyleProp, ViewStyle } from "react-native";

export function usePricingCardStyles() {
	return {
		// The featured plan takes a thicker border, in the primary color.
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			className: featured ? "border-primary" : undefined,
			style: [featured ? { borderWidth: 2 } : undefined, style],
		}),
		header: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		price: { className: "flex-row items-baseline gap-1" },
		features: { className: "gap-2" },
		grow: { className: "flex-1" },
	};
}
