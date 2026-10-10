import { TextInput, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { inputColors } from "@/components/ui/input-colors";
import type { InputState } from "@/components/ui/use-input";
import type { Theme } from "@/theme";

import type {
	InputGroupAddonVariant,
	InputGroupInputProps,
	InputGroupProps,
} from "./input-group";
import type { InputGroupSize } from "./use-input-group";

const TEXT = { sm: "subheadline", md: "callout", lg: "body" } as const;

type Styled = { style?: StyleProp<ViewStyle> };

// The placeholder and the caret are props, not styles. Wrapped once, here, so each instance only
// has to map the theme to those props through `uniProps`, which `colors` gives it. Refs are forwarded.
export const InputGroupText = withUnistyles(TextInput);

export function useInputGroupStyles() {
	return {
		group: (
			size: InputGroupSize,
			state: InputState,
			{ style }: Pick<InputGroupProps, "style">,
		) => ({ style: [styles.group(size, state), style] }),
		colors: (state: InputState) => ({
			uniProps: (theme: Theme) => ({
				placeholderTextColor: inputColors(
					theme.components,
					"outline",
					state,
				).placeholder,
				selectionColor: inputColors(theme.components, "outline", state)
					.caret,
				cursorColor: inputColors(theme.components, "outline", state).caret,
			}),
		}),
		input: (
			size: InputGroupSize,
			state: InputState,
			flex: number,
			{ style }: Pick<InputGroupInputProps, "style">,
		) => ({ style: [styles.input(size, state, flex), style] }),
		addonText: (size: InputGroupSize, disabled: boolean) => ({
			style: styles.addonText(size, disabled),
		}),
		addon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ style }: Styled,
		) => ({ style: [styles.addon(size, variant, false), style] }),
		pressableAddon: (
			size: InputGroupSize,
			variant: InputGroupAddonVariant,
			{ style }: Styled,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.addon(size, variant, pressed),
				style,
			],
		}),
		button: ({ style }: Styled) => ({ style: [styles.button, style] }),
		divider: (state: InputState, { style }: Styled) => ({
			style: [styles.divider(state), style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	group: (size: InputGroupSize, state: InputState) => {
		const colors = inputColors(theme.components, "outline", state);
		return {
			flexDirection: "row",
			alignItems: "stretch",
			borderWidth: 1,
			borderCurve: "continuous",
			overflow: "hidden",
			height: theme.tokens.sizes.input[size],
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
