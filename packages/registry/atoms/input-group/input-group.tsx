import { type ComponentPropsWithRef, type ReactNode, type Ref } from "react";
import {
	type TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Button, type ButtonProps } from "@/components/ui/button";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useInput } from "@/components/ui/use-input";

import { InputGroupText, useInputGroupStyles } from "./input-group.styles";
import {
	InputGroupContext,
	useInputGroup,
	useInputGroupContext,
	type UseInputGroupOptions,
} from "./use-input-group";

export type InputGroupAddonVariant = "subtle" | "plain";

export type InputGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	UseInputGroupOptions & {
		/** Inputs, addons and buttons, with an `InputGroup.Separator` where you want a line. */
		children: ReactNode;
		style?: StyleProp<ViewStyle>;
	};

function InputGroupRoot({
	children,
	size,
	error,
	disabled,
	...props
}: InputGroupProps) {
	const styles = useInputGroupStyles();
	const group = useInputGroup({ size, error, disabled });

	return (
		<InputGroupContext value={group.context}>
			<View
				{...props}
				{...styles.group(group.context.size, group.state, props)}
			>
				{children}
			</View>
		</InputGroupContext>
	);
}

export type InputGroupInputProps = Omit<TextInputProps, "editable"> & {
	/** Share of the remaining width. */
	flex?: number;
	disabled?: boolean;
	ref?: Ref<TextInput>;
};

function InputGroupInput({
	flex = 1,
	disabled: disabledProp = false,
	value,
	defaultValue,
	onChangeText,
	onFocus,
	onBlur,
	accessibilityLabel,
	accessibilityHint,
	ref,
	...props
}: InputGroupInputProps) {
	const styles = useInputGroupStyles();
	const group = useInputGroupContext();
	const disabled = group.disabled || disabledProp;

	const input = useInput({
		value,
		defaultValue,
		onChangeText,
		onFocus: (event) => {
			group.onPartFocus();
			onFocus?.(event);
		},
		onBlur: (event) => {
			group.onPartBlur();
			onBlur?.(event);
		},
		disabled,
		accessibilityLabel: accessibilityLabel ?? props.placeholder,
		accessibilityHint,
		ref,
	});

	// The group decides invalid and focused; the part only knows whether it is disabled.
	const state = disabled ? "disabled" : group.state;

	return (
		<InputGroupText
			maxFontSizeMultiplier={MAX_FONT_SCALE.control}
			{...styles.colors(state)}
			{...props}
			{...input.inputProps}
			{...styles.input(group.size, state, flex, props)}
		/>
	);
}

export type InputGroupAddonProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	/** Static text or an icon. A string is drawn in the affix color. */
	children: ReactNode;
	/** Makes the addon pressable, for example to open a picker. */
	onPress?: TappableProps["onPress"];
	/** `subtle` fills the addon, `plain` leaves it transparent. */
	variant?: InputGroupAddonVariant;
	style?: StyleProp<ViewStyle>;
};

function InputGroupAddon({
	children,
	onPress,
	variant = "subtle",
	accessibilityLabel,
	...props
}: InputGroupAddonProps) {
	const styles = useInputGroupStyles();
	const group = useInputGroupContext();

	const content =
		typeof children === "string" || typeof children === "number" ? (
			<Text
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				{...styles.addonText(group.size, group.disabled)}
			>
				{children}
			</Text>
		) : (
			children
		);

	if (!onPress) {
		return (
			<View {...props} {...styles.addon(group.size, variant, props)}>
				{content}
			</View>
		);
	}

	return (
		<Tappable
			{...props}
			disabled={group.disabled}
			onPress={onPress}
			accessibilityLabel={
				accessibilityLabel ??
				(typeof children === "string" ? children : undefined)
			}
			{...styles.pressableAddon(group.size, variant, props)}
		>
			{content}
		</Tappable>
	);
}

/** A Button with its radius and border removed, flush with the group. */
function InputGroupButton({
	disabled,
	...props
}: Omit<ButtonProps, "size" | "fullWidth" | "asChild">) {
	const styles = useInputGroupStyles();
	const group = useInputGroupContext();

	return (
		<Button
			size={group.size}
			disabled={group.disabled || disabled}
			{...props}
			{...styles.button(props)}
		/>
	);
}

export type InputGroupSeparatorProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
>;

/** A vertical line between two parts, in the group's divider color. */
function InputGroupSeparator(props: InputGroupSeparatorProps) {
	const styles = useInputGroupStyles();
	const group = useInputGroupContext();

	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			{...props}
			{...styles.divider(group.state, props)}
		/>
	);
}

export const InputGroup = Object.assign(InputGroupRoot, {
	Input: InputGroupInput,
	Addon: InputGroupAddon,
	Button: InputGroupButton,
	Separator: InputGroupSeparator,
});
