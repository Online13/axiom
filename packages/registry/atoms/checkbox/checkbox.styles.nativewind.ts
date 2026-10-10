import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";

import type { CheckboxProps } from "./checkbox";

// The icon takes its color as a prop. NativeWind gives it from a text color class.
export const CheckboxIcon = Icon;

// Every class is written whole, so Tailwind finds it. The colors are the checkbox's own tokens, in
// `theme/components/checkbox.css`.
export function useCheckboxStyles() {
	return {
		row: ({ className }: Pick<CheckboxProps, "className">) => ({
			className: cx("flex-row items-start gap-3", className),
		}),
		text: { className: "flex-1 gap-[2px]" },
		// Later states win, each one listing what it changes: checked, then invalid, then disabled.
		box: (on: boolean, error: boolean, disabled: boolean) => ({
			className: cx(
				"size-[22px] items-center justify-center rounded-sm border-2 border-checkbox-border",
				on && "border-checkbox-border-checked bg-checkbox-checked",
				error && !disabled && "border-checkbox-border-invalid",
				disabled && "border-checkbox-border-disabled",
			),
		}),
		indicator: (on: boolean, error: boolean, disabled: boolean) => ({
			className: disabled
				? "text-checkbox-indicator-disabled"
				: "text-checkbox-indicator",
		}),
	};
}
