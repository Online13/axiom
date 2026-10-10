import type { StyleProp, ViewStyle } from "react-native";

export function usePricingCardToggleStyles() {
	return {
		// The featured plan takes a thicker border, in the primary color.
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			className: featured ? "border-primary" : undefined,
			style: [featured ? { borderWidth: 2 } : undefined, style],
		}),
		header: { className: "gap-3" },
		plan: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		prices: { className: "flex-row flex-wrap items-baseline gap-2" },
		price: { className: "flex-row flex-wrap items-baseline gap-1" },
		struck: { className: "line-through" },
		center: { className: "self-center" },
		features: { className: "gap-2" },
		grow: { className: "flex-1" },
	};
}
