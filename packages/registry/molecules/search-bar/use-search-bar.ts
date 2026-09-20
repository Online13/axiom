import {
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type Ref,
} from "react";
import type {
	LayoutChangeEvent,
	TextInput,
	TextInputProps,
} from "react-native";
import {
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useControllableState } from "@/hooks/use-controllable-state";

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];
type SubmitEvent = Parameters<
	NonNullable<TextInputProps["onSubmitEditing"]>
>[0];

export type SearchBarState = "default" | "focused" | "disabled";

/** `true` always shows the cancel button, `'focus'` only while the field is focused. */
export type ShowCancel = boolean | "focus";

export type UseSearchBarOptions = {
	value?: string;
	defaultValue?: string;
	onChangeText?: (text: string) => void;
	onSubmit?: (text: string) => void;
	onFocus?: (event: FocusEvent) => void;
	onBlur?: (event: BlurEvent) => void;
	onCancel?: () => void;
	showCancel?: ShowCancel;
	disabled?: boolean;
	ref?: Ref<TextInput>;
};

// Long enough to read as a slide, short enough not to delay the keyboard.
const DURATION = 220;

/**
 * Query, focus, cancel and clear of a search field, shared by every styling variant.
 * The cancel button animates from a measured width, so it slides in without reflowing the field.
 */
export function useSearchBar({
	value: valueProp,
	defaultValue = "",
	onChangeText,
	onSubmit,
	onFocus,
	onBlur,
	onCancel,
	showCancel = "focus",
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
	const cancelVisible =
		showCancel === true || (showCancel === "focus" && focused);

	const reduceMotion = useReducedMotion();
	// The button keeps its natural width; the wrapper animates from 0 to that width and clips it.
	const [cancelWidth, setCancelWidth] = useState(0);
	const progress = useSharedValue(cancelVisible ? 1 : 0);

	useEffect(() => {
		const target = cancelVisible ? 1 : 0;
		progress.value = reduceMotion
			? target
			: withTiming(target, { duration: DURATION });
	}, [cancelVisible, reduceMotion, progress]);

	const cancelStyle = useAnimatedStyle(() => ({
		width: cancelWidth * progress.value,
		opacity: progress.value,
	}));

	const clear = () => {
		setValue("");
		inputRef.current?.focus();
	};

	// Cancel leaves the search: the field is emptied and blurred before the screen reacts.
	const cancel = () => {
		setValue("");
		inputRef.current?.blur();
		onCancel?.();
	};

	return {
		value,
		state,
		focused,
		/** The clear button only makes sense once something is typed. */
		hasText: value !== "",
		cancelVisible,
		cancelStyle,
		/** On the wrapper of the cancel button, to measure its natural width. */
		onCancelLayout: (event: LayoutChangeEvent) => {
			const { width } = event.nativeEvent.layout;
			setCancelWidth((previous) => (previous === width ? previous : width));
		},
		inputRef,
		/** Focuses the field, for taps on the padding around it. */
		focus: () => {
			if (!disabled) inputRef.current?.focus();
		},
		clear,
		cancel,
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
