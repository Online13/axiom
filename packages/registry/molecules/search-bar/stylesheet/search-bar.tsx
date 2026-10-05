import type { ReactNode, Ref } from "react";
import {
	Pressable,
	StyleSheet,
	TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

import { useSearchBar, type SearchBarState } from "../use-search-bar";

export type SearchBarVariant = "filled" | "outline";
export type SearchBarSize = "sm" | "md";

export type SearchBarProps = Omit<
	TextInputProps,
	"editable" | "onSubmitEditing"
> & {
	/** Called when the user presses the search key on the keyboard. */
	onSubmit?: (text: string) => void;
	/** Shows a clear button when the field has text. */
	clearable?: boolean;
	/** Replaces the search icon with a spinner while results load. */
	loading?: boolean;
	/** Extra content inside the field on the right, like a microphone. Hidden while there is text. */
	trailing?: ReactNode;
	variant?: SearchBarVariant;
	/** Height of the field: 50 or 56pt, from the `input` size tokens. */
	size?: SearchBarSize;
	disabled?: boolean;
	/** The box around the icon, the text and the buttons. `style` goes to the TextInput. */
	containerStyle?: StyleProp<ViewStyle>;
	ref?: Ref<TextInput>;
};

/** Colors of the bar for a variant and a state; missing properties fall back to `default`. */
export function searchBarColors(
	components: Theme["components"],
	variant: SearchBarVariant,
	state: SearchBarState,
) {
	const states = components.searchBar[variant];
	return {
		...states.default,
		...(state === "default" ? undefined : states[state]),
	};
}

const TEXT = { sm: "subheadline", md: "callout" } as const;

/** The search field alone: icon, text, clear button and loading state. */
export function SearchBar({
	placeholder = "Search",
	clearable = true,
	loading = false,
	trailing,
	variant = "filled",
	size = "sm",
	disabled = false,
	containerStyle,
	style,
	value,
	defaultValue,
	onChangeText,
	onSubmit,
	onFocus,
	onBlur,
	accessibilityLabel,
	ref,
	...props
}: SearchBarProps) {
	const { tokens, components } = useTheme();
	const search = useSearchBar({
		value,
		defaultValue,
		onChangeText,
		onSubmit,
		onFocus,
		onBlur,
		disabled,
		ref,
	});

	const colors = searchBarColors(components, variant, search.state);
	const typography = tokens.typography[TEXT[size]];
	const iconSize = size === "sm" ? "sm" : "md";

	// Taps on the padding around the text focus the field.
	return (
		<Pressable
			accessible={false}
			onPress={search.focus}
			style={[
				styles.field,
				{
					height: tokens.sizes.input[size],
					paddingHorizontal: tokens.spacing[2],
					gap: tokens.spacing[2],
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background ?? "transparent",
					borderColor: colors.border ?? "transparent",
				},
				containerStyle,
			]}
		>
			{loading ? (
				<Spinner size={iconSize} color="subtle" label="Searching" />
			) : (
				<Icon name="search" size={iconSize} color={colors.icon} />
			)}
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={colors.placeholder}
				selectionColor={colors.caret}
				cursorColor={colors.caret}
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				returnKeyType="search"
				clearButtonMode="never"
				autoCorrect={false}
				autoCapitalize="none"
				accessibilityRole="search"
				accessibilityLabel={accessibilityLabel ?? placeholder}
				{...props}
				{...search.inputProps}
				style={[
					styles.text,
					{
						fontSize: typography.fontSize,
						fontWeight: typography.fontWeight,
						color: colors.text,
					},
					typography.fontFamily
						? { fontFamily: typography.fontFamily }
						: undefined,
					style,
				]}
			/>
			{search.hasText
				? clearable && (
						<Tappable
							accessibilityLabel="Clear search"
							onPress={search.clear}
							disabled={disabled}
						>
							<Icon
								name="close"
								size="sm"
								color={colors.icon}
								strokeWidth={2.5}
							/>
						</Tappable>
					)
				: trailing}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	field: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderCurve: "continuous",
	},
	text: {
		flex: 1,
		alignSelf: "stretch",
		// Android adds vertical padding to TextInput; the field sets the height.
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
});
