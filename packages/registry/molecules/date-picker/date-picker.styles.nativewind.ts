import { Icon } from "@/components/ui/icon";
import {
	INPUT_AFFIX,
	INPUT_CONTROL,
	INPUT_PLACEHOLDER_TEXT,
	INPUT_TEXT,
} from "@/components/ui/input-classes";
import type { InputState } from "@/components/ui/use-input";
import { cx } from "@/theme";

import type { DatePickerTriggerProps } from "./date-picker";

// The icon takes its color as a prop. NativeWind gives it from a text color class.
export const DatePickerIcon = Icon;

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
			className: INPUT_AFFIX.outline[state],
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
