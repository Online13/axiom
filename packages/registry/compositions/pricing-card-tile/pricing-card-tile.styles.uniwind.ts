import type { StyleProp, ViewStyle } from "react-native";

import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

export function usePricingCardTileStyles() {
	return {
		// Grows with the row or rail it sits in, so tiles side by side share one height.
		slot: (style: StyleProp<ViewStyle>) => ({ className: "grow", style }),
		tile: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			className: cx(
				"min-h-[180px] grow gap-3 rounded-lg",
				checked ? "border-primary" : "border-border",
				pressed ? "bg-background-subtle" : "bg-background",
				disabled && "opacity-50",
			),
			// The selected border is thicker: the padding shrinks by the difference so nothing moves.
			// Only the device knows the width of a hairline, so both stay numbers.
			style: {
				borderWidth: checked ? 2 : metrics.hairline,
				padding: spacing[4] - (checked ? 2 : metrics.hairline),
			},
		}),
		top: { className: "flex-row items-start gap-2" },
		heading: { className: "flex-1 gap-2" },
		grow: { className: "flex-1" },
		body: { className: "gap-1" },
		price: { className: "flex-row items-baseline gap-1" },
		shrink: { className: "shrink" },
		trial: {
			className: "self-stretch border-t-border pt-3",
			style: { borderTopWidth: metrics.hairline },
		},
	};
}
