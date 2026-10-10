import type { InputVariant } from "./field";
import type { InputState } from "./use-input";

// The classes of a text field for a variant and a state, written whole so Tailwind finds them. The
// colors are the input's own tokens, in `theme/components/input.css`.

/** The box: its background and its border. */
export const INPUT_CONTROL: Record<InputVariant, Record<InputState, string>> = {
	outline: {
		default: "border-input-outline-border bg-input-outline",
		focused: "border-input-outline-border-focused bg-input-outline-focused",
		invalid: "border-input-outline-border-invalid bg-input-outline-invalid",
		disabled:
			"border-input-outline-border-disabled bg-input-outline-disabled",
	},
	filled: {
		default: "border-transparent bg-input-filled",
		focused: "border-input-filled-border-focused bg-input-filled-focused",
		invalid: "border-input-filled-border-invalid bg-input-filled-invalid",
		disabled: "border-transparent bg-input-filled-disabled",
	},
};

export const INPUT_TEXT: Record<InputVariant, Record<InputState, string>> = {
	outline: {
		default: "text-input-outline-text",
		focused: "text-input-outline-text-focused",
		invalid: "text-input-outline-text-invalid",
		disabled: "text-input-outline-text-disabled",
	},
	filled: {
		default: "text-input-filled-text",
		focused: "text-input-filled-text-focused",
		invalid: "text-input-filled-text-invalid",
		disabled: "text-input-filled-text-disabled",
	},
};

/** Text before and after the value: a unit, a currency sign. */
export const INPUT_AFFIX: Record<InputVariant, Record<InputState, string>> = {
	outline: {
		default: "text-input-outline-affix",
		focused: "text-input-outline-affix-focused",
		invalid: "text-input-outline-affix-invalid",
		disabled: "text-input-outline-affix-disabled",
	},
	filled: {
		default: "text-input-filled-affix",
		focused: "text-input-filled-affix-focused",
		invalid: "text-input-filled-affix-invalid",
		disabled: "text-input-filled-affix-disabled",
	},
};

/** For `placeholderTextColorClassName`: Uniwind reads a color prop from an `accent-` class. */
export const INPUT_PLACEHOLDER: Record<
	InputVariant,
	Record<InputState, string>
> = {
	outline: {
		default: "accent-input-outline-placeholder",
		focused: "accent-input-outline-placeholder-focused",
		invalid: "accent-input-outline-placeholder-invalid",
		disabled: "accent-input-outline-placeholder-disabled",
	},
	filled: {
		default: "accent-input-filled-placeholder",
		focused: "accent-input-filled-placeholder-focused",
		invalid: "accent-input-filled-placeholder-invalid",
		disabled: "accent-input-filled-placeholder-disabled",
	},
};

/** For `cursorColorClassName` and `selectionColorClassName`. */
export const INPUT_CARET: Record<InputVariant, Record<InputState, string>> = {
	outline: {
		default: "accent-input-outline-caret",
		focused: "accent-input-outline-caret-focused",
		invalid: "accent-input-outline-caret-invalid",
		disabled: "accent-input-outline-caret-disabled",
	},
	filled: {
		default: "accent-input-filled-caret",
		focused: "accent-input-filled-caret-focused",
		invalid: "accent-input-filled-caret-invalid",
		disabled: "accent-input-filled-caret-disabled",
	},
};

/** The placeholder color on a text: a field that shows its value without a TextInput. */
export const INPUT_PLACEHOLDER_TEXT: Record<
	InputVariant,
	Record<InputState, string>
> = {
	outline: {
		default: "text-input-outline-placeholder",
		focused: "text-input-outline-placeholder-focused",
		invalid: "text-input-outline-placeholder-invalid",
		disabled: "text-input-outline-placeholder-disabled",
	},
	filled: {
		default: "text-input-filled-placeholder",
		focused: "text-input-filled-placeholder-focused",
		invalid: "text-input-filled-placeholder-invalid",
		disabled: "text-input-filled-placeholder-disabled",
	},
};

/** The affix color for `colorClassName`: an icon in a field. */
export const INPUT_AFFIX_TINT: Record<
	InputVariant,
	Record<InputState, string>
> = {
	outline: {
		default: "accent-input-outline-affix",
		focused: "accent-input-outline-affix-focused",
		invalid: "accent-input-outline-affix-invalid",
		disabled: "accent-input-outline-affix-disabled",
	},
	filled: {
		default: "accent-input-filled-affix",
		focused: "accent-input-filled-affix-focused",
		invalid: "accent-input-filled-affix-invalid",
		disabled: "accent-input-filled-affix-disabled",
	},
};
