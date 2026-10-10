import type { ReactNode, Ref } from "react";
import {
	Pressable,
	type TextInput,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Spinner } from "@/components/ui/spinner";
import { MAX_FONT_SCALE } from "@/components/ui/text";

import {
	SearchBarIcon,
	SearchBarText,
	useSearchBarStyles,
} from "./search-bar.styles";
import { useSearchBar } from "./use-search-bar";

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
	const styles = useSearchBarStyles(variant, size);
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
			{...styles.field(search.state, containerStyle)}
		>
			{loading ? (
				<Spinner size={iconSize} color="subtle" label="Searching" />
			) : (
				<SearchBarIcon
					name="search"
					size={iconSize}
					{...styles.tint(search.state)}
				/>
			)}
			<SearchBarText
				placeholder={placeholder}
				{...styles.colors(search.state)}
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				returnKeyType="search"
				clearButtonMode="never"
				autoCorrect={false}
				autoCapitalize="none"
				accessibilityRole="search"
				accessibilityLabel={accessibilityLabel ?? placeholder}
				{...props}
				{...search.inputProps}
				{...styles.text(search.state, props)}
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
								{...styles.tint(search.state)}
							/>
						</Tappable>
					)
				: trailing}
		</Pressable>
	);
}
