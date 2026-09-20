import { useImperativeHandle, useRef, useState, type Ref } from "react";
import type { TextInput, TextInputProps } from "react-native";

import { useControllableState } from "@/hooks/use-controllable-state";

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];

export type InputState = "default" | "focused" | "invalid" | "disabled";

export type UseInputOptions = {
	value?: string;
	defaultValue?: string;
	onChangeText?: (text: string) => void;
	onFocus?: (event: FocusEvent) => void;
	onBlur?: (event: BlurEvent) => void;
	label?: string;
	helper?: string;
	error?: string | boolean;
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
	ref?: Ref<TextInput>;
};

/** Value, focus, visual state and accessibility of a text field, shared by Input, TextArea and every styling variant. */
export function useInput({
	value: valueProp,
	defaultValue = "",
	onChangeText,
	onFocus,
	onBlur,
	label,
	helper,
	error,
	required = false,
	disabled = false,
	accessibilityLabel,
	accessibilityHint,
	ref,
}: UseInputOptions) {
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange: onChangeText,
	});
	const [focused, setFocused] = useState(false);

	const inputRef = useRef<TextInput>(null);
	useImperativeHandle(ref, () => inputRef.current as TextInput);

	const invalid = error !== undefined && error !== false && error !== "";
	const message =
		typeof error === "string" && error !== "" ? error : undefined;
	const state: InputState = disabled
		? "disabled"
		: invalid
			? "invalid"
			: focused
				? "focused"
				: "default";

	// The label and messages are drawn next to the field but hidden from screen readers:
	// the field announces them itself, so they are read once, together.
	const hint = [
		required ? "Required" : undefined,
		message ?? (invalid ? undefined : helper),
		accessibilityHint,
	]
		.filter(Boolean)
		.join(". ");

	return {
		value,
		state,
		focused,
		invalid,
		/** The error message, when `error` is a string. It replaces `helper`. */
		message,
		inputRef,
		/** Focuses the field, for taps on its padding, prefix or suffix. */
		focus: () => {
			if (!disabled) inputRef.current?.focus();
		},
		inputProps: {
			ref: inputRef,
			value,
			onChangeText: setValue,
			editable: !disabled,
			onFocus: (event: FocusEvent) => {
				setFocused(true);
				onFocus?.(event);
			},
			onBlur: (event: BlurEvent) => {
				setFocused(false);
				onBlur?.(event);
			},
			accessibilityLabel: accessibilityLabel ?? label,
			accessibilityHint: hint || undefined,
			accessibilityState: { disabled },
		},
	};
}
