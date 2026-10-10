import { cx, type Spacing } from "@/theme";

import type { RadioGroupProps, RadioOrientation } from "./radio";

const GAP: Record<keyof Spacing, string> = {
	0: "gap-0",
	1: "gap-1",
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	5: "gap-5",
	6: "gap-6",
	8: "gap-8",
	10: "gap-10",
	12: "gap-12",
};

// Every class is written whole, so Tailwind finds it. The colors are the radio's own tokens, in
// `theme/components/radio.css`.
export function useRadioStyles() {
	return {
		group: (
			orientation: RadioOrientation,
			gap: keyof Spacing,
			{ className }: Pick<RadioGroupProps, "className">,
		) => ({
			className: cx(
				orientation === "horizontal" && "flex-row flex-wrap",
				GAP[gap],
				className,
			),
		}),
		row: { className: "flex-row items-start gap-3" },
		text: { className: "shrink gap-[2px]" },
		// Later states win, each one listing what it changes: checked, then disabled.
		circle: (checked: boolean, disabled: boolean) => ({
			className: cx(
				"size-[22px] items-center justify-center rounded-full border-2 border-radio-border",
				checked && "border-radio-border-checked",
				disabled && "border-radio-border-disabled",
			),
		}),
		dot: (checked: boolean, disabled: boolean) => ({
			className: cx(
				"size-[10px] rounded-full",
				disabled ? "bg-radio-indicator-disabled" : "bg-radio-indicator",
			),
		}),
	};
}
