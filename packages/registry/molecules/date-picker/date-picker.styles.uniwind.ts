import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import {
	INPUT_AFFIX_TINT,
	INPUT_CONTROL,
	INPUT_PLACEHOLDER_TEXT,
	INPUT_TEXT,
} from "@/components/ui/input-classes";
import type { InputState } from "@/components/ui/use-input";
import { cx } from "@/theme";

import type { DatePickerTriggerProps } from "./date-picker";

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const DatePickerIcon = withUniwind(Icon);

// The trigger is drawn like an input: its colors are the input's tokens.
export function useDatePickerStyles() {
	return {
		control: (
			state: InputState,
			{
				className,
				style,
			}: Pick<DatePickerTriggerProps, "className" | "style">,
		) => ({
			className: cx(
				"h-input-md flex-row items-center gap-2 rounded-input border px-3",
				INPUT_CONTROL.outline[state],
				className,
			),
			style: [{ borderCurve: "continuous" as const }, style],
		}),
		icon: (state: InputState) => ({
			colorClassName: INPUT_AFFIX_TINT.outline[state],
		}),
		value: (state: InputState, empty: boolean) => ({
			className: cx(
				"flex-1",
				empty
					? INPUT_PLACEHOLDER_TEXT.outline[state]
					: INPUT_TEXT.outline[state],
			),
		}),
	};
}
