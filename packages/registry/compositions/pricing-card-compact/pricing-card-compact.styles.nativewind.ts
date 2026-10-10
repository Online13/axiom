import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

export function usePricingCardCompactStyles() {
	return {
		container: (checked: boolean, pressed: boolean, disabled: boolean) => ({
			className: cx(
				"flex-row items-center gap-3 rounded-lg",
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
		body: { className: "flex-1 gap-1" },
		name: { className: "flex-row items-center gap-2" },
		shrink: { className: "shrink" },
		price: { className: "items-end" },
	};
}
