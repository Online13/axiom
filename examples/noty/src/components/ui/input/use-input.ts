import {
	createContext,
	use,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type ReactNode,
	type Ref,
} from "react";
import type { TextInput, TextInputProps } from "react-native";

import { useControllableState } from "@/hooks/use-controllable-state";

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];

export type InputState = "default" | "focused" | "invalid" | "disabled";

type FieldTextPart = "label" | "description" | "error";
type FieldTexts = Partial<Record<FieldTextPart, string>>;

export type FieldContextValue = FieldTexts & {
	invalid: boolean;
	disabled: boolean;
	required: boolean;
	register: (part: FieldTextPart, text: string | undefined) => void;
};

/**
 * Set by Field. Its Label, Description and Error register their text here, so the control inside
 * announces them once, with itself, instead of screen readers reading each line apart.
 */
export const FieldContext = createContext<FieldContextValue | null>(null);

export function useField() {
	return use(FieldContext);
}

export type UseFieldRootOptions = {
	invalid?: boolean;
	disabled?: boolean;
	required?: boolean;
};

export function useFieldRoot({
	invalid = false,
	disabled = false,
	required = false,
}: UseFieldRootOptions): FieldContextValue {
	const [texts, setTexts] = useState<FieldTexts>({});
	const register = useCallback(
		(part: FieldTextPart, text: string | undefined) =>
			setTexts((current) =>
				current[part] === text ? current : { ...current, [part]: text },
			),
		[],
	);

	// A rendered Field.Error is enough to mark the field invalid.
	return {
		...texts,
		invalid: invalid || texts.error !== undefined,
		disabled,
		required,
		register,
	};
}

/**
 * Registers a text part with its Field. Returns true when the control announces it, so the part
 * hides itself from screen readers. Anything other than plain text stays readable on its own.
 */
export function useFieldText(
	part: FieldTextPart,
	children: ReactNode,
): boolean {
	const register = use(FieldContext)?.register;
	const text =
		typeof children === "string" || typeof children === "number"
			? String(children)
			: undefined;

	useEffect(() => {
		if (!register || text === undefined) return;
		register(part, text);
		return () => register(part, undefined);
	}, [register, part, text]);

	return register !== undefined && text !== undefined;
}

export type UseInputOptions = {
	value?: string;
	defaultValue?: string;
	onChangeText?: (text: string) => void;
	onFocus?: (event: FocusEvent) => void;
	onBlur?: (event: BlurEvent) => void;
	/** Falls back to the enclosing Field. */
	invalid?: boolean;
	/** Falls back to the enclosing Field. */
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
	invalid: invalidProp,
	disabled: disabledProp,
	accessibilityLabel,
	accessibilityHint,
	ref,
}: UseInputOptions) {
	const field = useField();
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange: onChangeText,
	});
	const [focused, setFocused] = useState(false);

	const inputRef = useRef<TextInput>(null);
	useImperativeHandle(ref, () => inputRef.current as TextInput);

	const invalid = invalidProp ?? field?.invalid ?? false;
	const disabled = disabledProp ?? field?.disabled ?? false;
	const state: InputState = disabled
		? "disabled"
		: invalid
			? "invalid"
			: focused
				? "focused"
				: "default";

	// The Field's texts are drawn next to the control but hidden from screen readers:
	// the control announces them itself, so they are read once, together.
	const hint = [
		field?.required ? "Required" : undefined,
		field?.error ?? field?.description,
		accessibilityHint,
	]
		.filter(Boolean)
		.join(". ");

	return {
		value,
		state,
		focused,
		invalid,
		disabled,
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
			accessibilityLabel: accessibilityLabel ?? field?.label,
			accessibilityHint: hint || undefined,
			accessibilityState: { disabled },
		},
	};
}
