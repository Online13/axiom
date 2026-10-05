import { useImperativeHandle, useRef, useState, type Ref } from "react";
import type { TextInput, TextInputProps } from "react-native";

import { useControllableState } from "@/hooks/use-controllable-state";

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];
type SubmitEvent = Parameters<
	NonNullable<TextInputProps["onSubmitEditing"]>
>[0];

export type SearchBarState = "default" | "focused" | "disabled";

export type UseSearchBarOptions = {
	value?: string;
	defaultValue?: string;
	onChangeText?: (text: string) => void;
	onSubmit?: (text: string) => void;
	onFocus?: (event: FocusEvent) => void;
	onBlur?: (event: BlurEvent) => void;
	disabled?: boolean;
	ref?: Ref<TextInput>;
};

/** Query, focus and clear of a search field, shared by every styling variant. */
export function useSearchBar({
	value: valueProp,
	defaultValue = "",
	onChangeText,
	onSubmit,
	onFocus,
	onBlur,
	disabled = false,
	ref,
}: UseSearchBarOptions) {
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange: onChangeText,
	});
	const [focused, setFocused] = useState(false);

	const inputRef = useRef<TextInput>(null);
	useImperativeHandle(ref, () => inputRef.current as TextInput);

	const state: SearchBarState = disabled
		? "disabled"
		: focused
			? "focused"
			: "default";

	const clear = () => {
		setValue("");
		inputRef.current?.focus();
	};

	return {
		value,
		state,
		focused,
		/** The clear button only makes sense once something is typed. */
		hasText: value !== "",
		inputRef,
		/** Focuses the field, for taps on the padding around it. */
		focus: () => {
			if (!disabled) inputRef.current?.focus();
		},
		clear,
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
			onSubmitEditing: (event: SubmitEvent) => {
				onSubmit?.(event.nativeEvent.text);
			},
			accessibilityState: { disabled },
		},
	};
}
