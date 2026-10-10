import type { ReactNode, Ref } from "react";
import {
	Pressable,
	TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Spinner } from "@/components/ui/spinner";
import { MAX_FONT_SCALE } from "@/components/ui/text";

import { useSearchBar, type SearchBarState } from "./use-search-bar";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Icon } from "@/components/ui/icon/icon";
import { searchBarColors } from "@/components/ui/search-bar/search-bar-colors";
import type { Theme } from "@/theme";

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

	const iconSize = size === "sm" ? "sm" : "md";

	// Taps on the padding around the text focus the field.
	return (
		<Pressable
			accessible={false}
			onPress={search.focus}
			style={[styles.field(variant, size, search.state), containerStyle]}
		>
			{loading ? (
				<Spinner size={iconSize} color="subtle" label="Searching" />
			) : (
				<SearchBarIcon
					name="search"
					size={iconSize}
					uniProps={(theme: Theme) => ({
						color: searchBarColors(
							theme.components,
							variant,
							search.state,
						).icon,
					})}
				/>
			)}
			<SearchBarText
				placeholder={placeholder}
				uniProps={(theme: Theme) => ({
					placeholderTextColor: searchBarColors(
						theme.components,
						variant,
						search.state,
					).placeholder,
					selectionColor: searchBarColors(
						theme.components,
						variant,
						search.state,
					).caret,
					cursorColor: searchBarColors(
						theme.components,
						variant,
						search.state,
					).caret,
				})}
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				returnKeyType="search"
				clearButtonMode="never"
				autoCorrect={false}
				autoCapitalize="none"
				accessibilityRole="search"
				accessibilityLabel={accessibilityLabel ?? placeholder}
				{...props}
				{...search.inputProps}
				style={[styles.text(variant, size, search.state), props.style]}
			/>
			{search.hasText
				? clearable && (
						<Tappable
							accessibilityLabel="Clear search"
							onPress={search.clear}
							disabled={disabled}
						>
							<SearchBarIcon
								name="close"
								size="sm"
								strokeWidth={2.5}
								uniProps={(theme: Theme) => ({
									color: searchBarColors(
										theme.components,
										variant,
										search.state,
									).icon,
								})}
							/>
						</Tappable>
					)
				: trailing}
		</Pressable>
	);
}

const TEXT = { sm: "subheadline", md: "callout" } as const;

// The icon color, the placeholder and the caret are props, not styles. Wrapped once, here, so each
// instance only has to map the theme to those props through `uniProps`. Refs are forwarded.
const SearchBarIcon = withUnistyles(Icon);

const SearchBarText = withUnistyles(TextInput);

const styles = StyleSheet.create((theme) => ({
	field: (
		variant: SearchBarVariant,
		size: SearchBarSize,
		state: SearchBarState,
	) => {
		const colors = searchBarColors(theme.components, variant, state);
		return {
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			borderCurve: "continuous",
			height: theme.tokens.sizes.input[size],
			paddingHorizontal: theme.tokens.spacing[2],
			gap: theme.tokens.spacing[2],
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	text: (
		variant: SearchBarVariant,
		size: SearchBarSize,
		state: SearchBarState,
	) => {
		const typography = theme.tokens.typography[TEXT[size]];
		return {
			flex: 1,
			alignSelf: "stretch",
			// Android adds vertical padding to TextInput; the field sets the height.
			paddingVertical: 0,
			paddingHorizontal: 0,
			fontSize: typography.fontSize,
			fontWeight: typography.fontWeight,
			...(typography.fontFamily && { fontFamily: typography.fontFamily }),
			color: searchBarColors(theme.components, variant, state).text,
		};
	},
}));
