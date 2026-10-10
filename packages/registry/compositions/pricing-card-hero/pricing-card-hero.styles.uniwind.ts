import type { StyleProp, ViewStyle } from "react-native";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";

// The icon takes its color as a prop. Uniwind reads it from the `accent-` class of
// `colorClassName`, which the icon gets by being wrapped.
export const PricingCardHeroIcon = withUniwind(Icon);

// Everything is drawn on the primary color: the texts take its `on` color.
export function usePricingCardHeroStyles() {
	return {
		card: (style: StyleProp<ViewStyle>) => ({
			className: "bg-primary",
			style,
		}),
		header: { className: "gap-2" },
		row: { className: "flex-row items-center gap-2" },
		label: { className: "flex-1 text-primary-on" },
		price: { className: "flex-row items-baseline gap-1" },
		on: { className: "text-primary-on" },
		onMuted: { className: "text-primary-on opacity-[0.72]" },
		features: { className: "gap-2" },
		tint: { colorClassName: "accent-primary-on" },
		// The solid button inverted: the primary text on the `on` color, pressed or not.
		button: { className: "bg-primary-on active:bg-primary-on" },
		buttonLabel: { className: "font-semibold text-primary" },
	};
}
