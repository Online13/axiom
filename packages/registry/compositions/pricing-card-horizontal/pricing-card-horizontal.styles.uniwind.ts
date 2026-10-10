import type { StyleProp, ViewStyle } from "react-native";

import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

export function usePricingCardHorizontalStyles() {
	return {
		// The featured plan takes a thicker border, in the primary color.
		card: (featured: boolean, style: StyleProp<ViewStyle>) => ({
			className: cx("flex-row gap-5", featured && "border-primary"),
			style: [featured ? { borderWidth: 2 } : undefined, style],
		}),
		plan: { className: "flex-1 gap-3" },
		heading: { className: "gap-1" },
		row: { className: "flex-row items-center gap-2" },
		features: { className: "flex-row flex-wrap gap-x-4 gap-y-2" },
		// Only the device knows the width of a hairline.
		side: {
			className: "items-end justify-between gap-3 border-l-border pl-5",
			style: { borderLeftWidth: metrics.hairline },
		},
		end: { className: "items-end" },
		shrink: { className: "shrink" },
	};
}
