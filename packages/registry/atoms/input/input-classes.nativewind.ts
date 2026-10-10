import { cssInterop } from "nativewind";
import { TextInput } from "react-native";

import type { InputVariant } from "./field";
import type { InputState } from "./use-input";

/**
 * A TextInput takes the colors of its placeholder, its selection and its cursor as props, not as
 * styles. NativeWind reads each one from the text color of a class of its own.
 */
export const ColorTextInput = cssInterop(TextInput, {
	className: { target: "style", nativeStyleToProp: { textAlign: true } },
	placeholderClassName: {
		target: false,
		nativeStyleToProp: { color: "placeholderTextColor" },
	},
	selectionClassName: {
		target: false,
		nativeStyleToProp: { color: "selectionColor" },
	},
	cursorClassName: {
		target: false,
		nativeStyleToProp: { color: "cursorColor" },
	},
});

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

/** For `placeholderClassName`. */
export const INPUT_PLACEHOLDER: Record<
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

/** For `cursorClassName` and `selectionClassName`. */
export const INPUT_CARET: Record<InputVariant, Record<InputState, string>> = {
	outline: {
		default: "text-input-outline-caret",
		focused: "text-input-outline-caret-focused",
		invalid: "text-input-outline-caret-invalid",
		disabled: "text-input-outline-caret-disabled",
	},
	filled: {
		default: "text-input-filled-caret",
		focused: "text-input-filled-caret-focused",
		invalid: "text-input-filled-caret-invalid",
		disabled: "text-input-filled-caret-disabled",
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
