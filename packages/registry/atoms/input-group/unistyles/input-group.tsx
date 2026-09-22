import {
	Children,
	Fragment,
	isValidElement,
	type ReactNode,
	type Ref,
} from "react";
import {
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Button, type ButtonProps } from "@/components/ui/button";
import { inputColors } from "@/components/ui/field";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useInput, type InputState } from "@/components/ui/use-input";

import {
	InputGroupContext,
	useInputGroup,
	useInputGroupContext,
	type InputGroupSize,
	type UseInputGroupOptions,
} from "../use-input-group";

export type InputGroupAddonVariant = "subtle" | "plain";

export type InputGroupProps = UseInputGroupOptions & {
	children: ReactNode;
	/** Draws a separator between adjacent parts. */
	divided?: boolean;
	style?: StyleProp<ViewStyle>;
};

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`. Refs are forwarded.
const ThemedTextInput = withUnistyles(TextInput);

function InputGroupRoot({
	children,
	divided = true,
	style,
	...options
}: InputGroupProps) {
	const group = useInputGroup(options);
	const parts = Children.toArray(children).filter(isValidElement);

	return (
		<InputGroupContext value={group.context}>
			<View
				style={[
					styles.group(group.context.size, group.state),
					style,
				]}
			>
				{parts.map((part, index) => (
					<Fragment key={part.key ?? index}>
						{divided && index > 0 ? (
							<View style={styles.divider(group.state)} />
						) : null}
						{part}
					</Fragment>
				))}
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
	style,
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
		<ThemedTextInput
			maxFontSizeMultiplier={MAX_FONT_SCALE.control}
			uniProps={(theme) => {
				const colors = inputColors(theme.components, "outline", state);
				return {
					placeholderTextColor: colors.placeholder,
					selectionColor: colors.caret,
					cursorColor: colors.caret,
				};
			}}
			{...props}
			{...input.inputProps}
			style={[styles.input(group.size, state, flex), style]}
		/>
	);
}

export type InputGroupAddonProps = {
	/** Static text or an icon. A string is drawn in the affix color. */
	children: ReactNode;
	/** Makes the addon pressable, for example to open a picker. */
	onPress?: () => void;
	/** `subtle` fills the addon, `plain` leaves it transparent. */
	variant?: InputGroupAddonVariant;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

function InputGroupAddon({
	children,
	onPress,
	variant = "subtle",
	accessibilityLabel,
	style,
}: InputGroupAddonProps) {
	const group = useInputGroupContext();

	const content =
		typeof children === "string" || typeof children === "number" ? (
			<Text
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				style={styles.addonText(group.size, group.disabled)}
			>
				{children}
			</Text>
		) : (
			children
		);

	const addonStyle = (pressed: boolean): StyleProp<ViewStyle> => [
		styles.addon(group.size, variant, pressed),
		style,
	];

	if (!onPress) {
		return <View style={addonStyle(false)}>{content}</View>;
	}

	return (
		<Tappable
			disabled={group.disabled}
			onPress={onPress}
			accessibilityLabel={
				accessibilityLabel ??
				(typeof children === "string" ? children : undefined)
			}
			style={({ pressed }) => addonStyle(pressed)}
		>
			{content}
		</Tappable>
	);
}

/** A Button with its radius and border removed, flush with the group. */
function InputGroupButton({
	disabled,
	style,
	...props
}: Omit<ButtonProps, "size" | "fullWidth" | "asChild">) {
	const group = useInputGroupContext();

	return (
		<Button
			size={group.size}
			disabled={group.disabled || disabled}
			{...props}
			style={[styles.button, style]}
		/>
	);
}

export const InputGroup = Object.assign(InputGroupRoot, {
	Input: InputGroupInput,
	Addon: InputGroupAddon,
	Button: InputGroupButton,
});

const styles = StyleSheet.create((theme) => ({
	group: (size: InputGroupSize, state: InputState) => {
		const colors = inputColors(theme.components, "outline", state);
		return {
			flexDirection: "row",
			alignItems: "stretch",
			borderWidth: 1,
			borderCurve: "continuous",
			overflow: "hidden",
			minHeight: theme.tokens.sizes.control[size],
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	divider: (state: InputState) => {
		const group = theme.components.inputGroup.default;
		return {
			width: 1,
			backgroundColor:
				(state === "disabled" && group.disabled?.divider) ||
				group.default.divider,
		};
	},
	input: (size: InputGroupSize, state: InputState, flex: number) => {
		const typography = theme.tokens.typography[TEXT[size]];
		return {
			minWidth: 0,
			paddingVertical: 0,
			flex,
			paddingHorizontal: theme.tokens.spacing[size === "sm" ? 2 : 3],
			fontSize: typography.fontSize,
			fontWeight: typography.fontWeight,
			...(typography.fontFamily && { fontFamily: typography.fontFamily }),
			color: inputColors(theme.components, "outline", state).text,
		};
	},
	addon: (
		size: InputGroupSize,
		variant: InputGroupAddonVariant,
		pressed: boolean,
	) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
		paddingHorizontal: theme.tokens.spacing[size === "sm" ? 2 : 3],
		backgroundColor:
			variant === "subtle"
				? theme.components.inputGroup.default.default.addon
				: "transparent",
		...(pressed && { opacity: 0.6 }),
	}),
	addonText: (size: InputGroupSize, disabled: boolean) => ({
		fontSize: theme.tokens.typography[TEXT[size]].fontSize,
		color: inputColors(
			theme.components,
			"outline",
			disabled ? "disabled" : "default",
		).affix,
	}),
	// Button sizes itself and aligns to the start: fill the group height instead.
	button: {
		minHeight: 0,
		alignSelf: "stretch",
		borderRadius: 0,
		borderWidth: 0,
	},
}));
