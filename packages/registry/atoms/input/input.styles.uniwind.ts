import { TextInput, type StyleProp, type ViewStyle } from "react-native";

import {
	INPUT_AFFIX,
	INPUT_CARET,
	INPUT_CONTROL,
	INPUT_PLACEHOLDER,
	INPUT_TEXT,
} from "@/components/ui/input-classes";
import { cx } from "@/theme";
import { typography } from "@/theme/tokens";

import type { InputVariant } from "./field";
import type { InputProps, InputSize } from "./input";
import type { InputState } from "./use-input";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

const SIZE: Record<InputSize, string> = {
	sm: "h-input-sm px-2",
	md: "h-input-md px-3",
	lg: "h-input-lg px-3",
};

// The placeholder and the caret take their color as props, which Uniwind reads from classes.
export const InputText = TextInput;

export function useInputStyles(size: InputSize, variant: InputVariant) {
	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			className: cx(
				"flex-row items-center gap-2 rounded-input border",
				SIZE[size],
				INPUT_CONTROL[variant][state],
			),
			style: [{ borderCurve: "continuous" as const }, containerStyle],
		}),
		affix: { className: "flex-row items-center" },
		// The affix follows the size of the text, not its line height.
		affixText: (state: InputState) => ({
			className: INPUT_AFFIX[variant][state],
			style: { fontSize: typography[TEXT[size]].fontSize },
		}),
		colors: (state: InputState) => ({
			placeholderTextColorClassName: INPUT_PLACEHOLDER[variant][state],
			selectionColorClassName: INPUT_CARET[variant][state],
			cursorColorClassName: INPUT_CARET[variant][state],
		}),
		// Android adds vertical padding to TextInput; the control sets the height. The text takes the
		// size and the weight of its typography token, without its line height: it is one line.
		text: (
			state: InputState,
			{ className, style }: Pick<InputProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-1 self-stretch p-0",
				INPUT_TEXT[variant][state],
				className,
			),
			style: [
				{
					fontSize: typography[TEXT[size]].fontSize,
					fontWeight: typography[TEXT[size]].fontWeight,
				},
				style,
			],
		}),
	};
}
