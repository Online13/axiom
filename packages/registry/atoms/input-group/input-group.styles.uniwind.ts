import { TextInput } from "react-native";

import {
	INPUT_AFFIX,
	INPUT_CARET,
	INPUT_CONTROL,
	INPUT_PLACEHOLDER,
	INPUT_TEXT,
} from "@/components/ui/input-classes";
import type { InputState } from "@/components/ui/use-input";
import { cx } from "@/theme";
import { typography } from "@/theme/tokens";

import type {
	InputGroupAddonVariant,
	InputGroupInputProps,
	InputGroupProps,
} from "./input-group";
import type { InputGroupSize } from "./use-input-group";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

type Classed = { className?: string };

const HEIGHT: Record<InputGroupSize, string> = {
	sm: "h-input-sm",
	md: "h-input-md",
	lg: "h-input-lg",
};

const PADDING: Record<InputGroupSize, string> = {
	sm: "px-2",
	md: "px-3",
	lg: "px-3",
};

// The placeholder and the caret take their color as props, which Uniwind reads from classes.
export const InputGroupText = TextInput;

// The colors are the input's tokens, and the group's own for its addons and dividers, in
// `theme/components/input-group.css`.
export function useInputGroupStyles() {
	return {
		group: (
			size: InputGroupSize,
			state: InputState,
			{ className, style }: Pick<InputGroupProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row items-stretch overflow-hidden rounded-md border",
				HEIGHT[size],
				INPUT_CONTROL.outline[state],
				className,
			),
			style: [{ borderCurve: "continuous" as const }, style],
		}),
		colors: (state: InputState) => ({
			placeholderTextColorClassName: INPUT_PLACEHOLDER.outline[state],
			selectionColorClassName: INPUT_CARET.outline[state],
			cursorColorClassName: INPUT_CARET.outline[state],
		}),
		// The text takes the size and the weight of its typography token, without its line height.
		input: (
			size: InputGroupSize,
			state: InputState,
			flex: number,
			{
				className,
				style,
			}: Pick<InputGroupInputProps, "className" | "style">,
		) => ({
			className: cx(
				"min-w-0 py-0",
				PADDING[size],
				INPUT_TEXT.outline[state],
				className,
			),
			style: [
				{
					flex,
					fontSize: typography[TEXT[size]].fontSize,
					fontWeight: typography[TEXT[size]].fontWeight,
				},
				style,
			],
		}),
		addonText: (size: InputGroupSize, disabled: boolean) => ({
			className: INPUT_AFFIX.outline[disabled ? "disabled" : "default"],
			style: { fontSize: typography[TEXT[size]].fontSize },
		}),
		addon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ className }: Classed,
		) => ({
			className: cx(
				"flex-row items-center gap-1",
				PADDING[size],
				variant === "subtle" && "bg-input-group-addon",
				className,
			),
		}),
		pressableAddon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ className }: Classed,
		) => ({
			className: cx(
				"flex-row items-center gap-1 active:opacity-60",
				PADDING[size],
				variant === "subtle" && "bg-input-group-addon",
				className,
			),
		}),
		// Button sizes itself and aligns to the start: fill the group height instead.
		button: ({ className }: Classed) => ({
			className: cx("min-h-0 self-stretch rounded-none border-0", className),
		}),
		divider: (state: InputState, { className }: Classed) => ({
			className: cx(
				"w-[1px]",
				state === "disabled"
					? "bg-input-group-divider-disabled"
					: "bg-input-group-divider",
				className,
			),
		}),
	};
}
