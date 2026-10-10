import {
	StyleSheet,
	TextInput,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { inputColors } from "@/components/ui/input-colors";
import type { InputState } from "@/components/ui/use-input";
import { useTheme } from "@/theme";

import type {
	InputGroupAddonVariant,
	InputGroupInputProps,
	InputGroupProps,
} from "./input-group";
import type { InputGroupSize } from "./use-input-group";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

type Styled = { style?: StyleProp<ViewStyle> };

// The placeholder and the caret take their color as props.
export const InputGroupText = TextInput;

export function useInputGroupStyles() {
	const { tokens, components } = useTheme();

	return {
		group: (
			size: InputGroupSize,
			state: InputState,
			{ style }: Pick<InputGroupProps, "style">,
		) => ({
			style: [
				styles.group,
				{
					height: tokens.sizes.input[size],
					borderRadius: tokens.radius.md,
					backgroundColor:
						inputColors(components, "outline", state).background ??
						"transparent",
					borderColor:
						inputColors(components, "outline", state).border ??
						"transparent",
				},
				style,
			],
		}),
		colors: (state: InputState) => ({
			placeholderTextColor: inputColors(components, "outline", state)
				.placeholder,
			selectionColor: inputColors(components, "outline", state).caret,
			cursorColor: inputColors(components, "outline", state).caret,
		}),
		input: (
			size: InputGroupSize,
			state: InputState,
			flex: number,
			{ style }: Pick<InputGroupInputProps, "style">,
		) => ({
			style: [
				styles.input,
				{
					flex,
					paddingHorizontal: tokens.spacing[size === "sm" ? 2 : 3],
					fontSize: tokens.typography[TEXT[size]].fontSize,
					fontWeight: tokens.typography[TEXT[size]].fontWeight,
					color: inputColors(components, "outline", state).text,
				},
				tokens.typography[TEXT[size]].fontFamily
					? { fontFamily: tokens.typography[TEXT[size]].fontFamily }
					: undefined,
				style,
			],
		}),
		addonText: (size: InputGroupSize, disabled: boolean) => ({
			style: {
				fontSize: tokens.typography[TEXT[size]].fontSize,
				color: inputColors(
					components,
					"outline",
					disabled ? "disabled" : "default",
				).affix,
			},
		}),
		addon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ style }: Styled,
		) => ({
			style: [
				styles.addon,
				{
					gap: tokens.spacing[1],
					paddingHorizontal: tokens.spacing[size === "sm" ? 2 : 3],
					backgroundColor:
						variant === "subtle"
							? components.inputGroup.default.default.addon
							: "transparent",
				},
				style,
			],
		}),
		pressableAddon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ style }: Styled,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.addon,
				{
					gap: tokens.spacing[1],
					paddingHorizontal: tokens.spacing[size === "sm" ? 2 : 3],
					backgroundColor:
						variant === "subtle"
							? components.inputGroup.default.default.addon
							: "transparent",
				},
				pressed && styles.pressed,
				style,
			],
		}),
		button: ({ style }: Styled) => ({ style: [styles.button, style] }),
		divider: (state: InputState, { style }: Styled) => ({
			style: [
				styles.divider,
				{
					backgroundColor:
						(state === "disabled" &&
							components.inputGroup.default.disabled?.divider) ||
						components.inputGroup.default.default.divider,
				},
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	group: {
		flexDirection: "row",
		alignItems: "stretch",
		borderWidth: 1,
		borderCurve: "continuous",
		overflow: "hidden",
	},
	divider: {
		width: 1,
	},
	input: {
		minWidth: 0,
		paddingVertical: 0,
	},
	addon: {
		flexDirection: "row",
		alignItems: "center",
	},
	pressed: {
		opacity: 0.6,
	},
	// Button sizes itself and aligns to the start: fill the group height instead.
	button: {
		minHeight: 0,
		alignSelf: "stretch",
		borderRadius: 0,
		borderWidth: 0,
	},
});
