import type { ReactNode, Ref } from "react";
import {
	Pressable,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Theme } from "@/theme";

import {
	useSearchBar,
	type SearchBarState,
	type ShowCancel,
} from "../use-search-bar";

export type SearchBarVariant = "filled" | "outline";
export type SearchBarSize = "sm" | "md";

export type SearchBarProps = Omit<
	TextInputProps,
	"editable" | "onSubmitEditing"
> & {
	/** Called when the user presses the search key on the keyboard. */
	onSubmit?: (text: string) => void;
	/** Cancel button next to the field. `'focus'` slides it in only while the field is focused. */
	showCancel?: ShowCancel;
	cancelLabel?: string;
	/** Called on Cancel, after the field is cleared and blurred. */
	onCancel?: () => void;
	/** Shows a clear button when the field has text. */
	clearable?: boolean;
	/** Replaces the search icon with a spinner while results load. */
	loading?: boolean;
	/** Extra content inside the field on the right, like a microphone. Hidden while there is text. */
	trailing?: ReactNode;
	variant?: SearchBarVariant;
	/** Height of the field: 36 or 44pt. */
	size?: SearchBarSize;
	disabled?: boolean;
	/** The row holding the field and the cancel button. */
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

// A search field is shorter than a form control: 36pt is the iOS bar, 44pt the comfortable one.
const HEIGHT = { sm: 36, md: 44 } as const;
const TEXT = { sm: "subheadline", md: "callout" } as const;

// The icon color, the placeholder and the caret are props, not styles. Wrapped once, here, so each
// instance only has to map the theme to those props through `uniProps`. Refs are forwarded.
const ThemedIcon = withUnistyles(Icon);
const ThemedTextInput = withUnistyles(TextInput);

export function SearchBar({
	placeholder = "Search",
	showCancel = "focus",
	cancelLabel = "Cancel",
	onCancel,
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
	const search = useSearchBar({
		value,
		defaultValue,
		onChangeText,
		onSubmit,
		onFocus,
		onBlur,
		onCancel,
		showCancel,
		disabled,
		ref,
	});

	const iconSize = size === "sm" ? "sm" : "md";
	const iconColor = (theme: Theme) => ({
		color: searchBarColors(theme.components, variant, search.state).icon,
	});

	return (
		<View style={[styles.row, containerStyle]}>
			{/* Taps on the padding around the text focus the field. */}
			<Pressable
				accessible={false}
				onPress={search.focus}
				style={styles.field(variant, size, search.state)}
			>
				{loading ? (
					<Spinner size={iconSize} color="subtle" label="Searching" />
				) : (
					<ThemedIcon
						name="search"
						size={iconSize}
						uniProps={iconColor}
					/>
				)}
				<ThemedTextInput
					placeholder={placeholder}
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					returnKeyType="search"
					clearButtonMode="never"
					autoCorrect={false}
					autoCapitalize="none"
					accessibilityRole="search"
					accessibilityLabel={accessibilityLabel ?? placeholder}
					uniProps={(theme) => {
						const colors = searchBarColors(
							theme.components,
							variant,
							search.state,
						);
						return {
							placeholderTextColor: colors.placeholder,
							selectionColor: colors.caret,
							cursorColor: colors.caret,
						};
					}}
					{...props}
					{...search.inputProps}
					style={[styles.text(variant, size, search.state), style]}
				/>
				{search.hasText
					? clearable && (
							<Tappable
								accessibilityLabel="Clear search"
								onPress={search.clear}
								disabled={disabled}
							>
								<ThemedIcon
									name="close"
									size="sm"
									strokeWidth={2.5}
									uniProps={iconColor}
								/>
							</Tappable>
						)
					: trailing}
			</Pressable>

			{showCancel === false ? null : (
				<Animated.View
					style={[styles.cancel(size), search.cancelStyle]}
				>
					{/* Absolute: the button keeps its natural width while the wrapper animates and clips it. */}
					<View
						onLayout={search.onCancelLayout}
						style={styles.cancelInner}
					>
						<Tappable
							accessibilityLabel={cancelLabel}
							onPress={search.cancel}
							disabled={disabled || !search.cancelVisible}
						>
							<Text
								variant="body"
								maxFontSizeMultiplier={MAX_FONT_SCALE.control}
								style={styles.cancelLabel(variant, search.state)}
							>
								{cancelLabel}
							</Text>
						</Tappable>
					</View>
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	field: (
		variant: SearchBarVariant,
		size: SearchBarSize,
		state: SearchBarState,
	) => {
		const colors = searchBarColors(theme.components, variant, state);
		return {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			borderCurve: "continuous",
			height: HEIGHT[size],
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
	cancel: (size: SearchBarSize) => ({
		overflow: "hidden",
		height: HEIGHT[size],
	}),
	cancelInner: {
		position: "absolute",
		start: 0,
		top: 0,
		bottom: 0,
		justifyContent: "center",
		paddingStart: theme.tokens.spacing[3],
	},
	cancelLabel: (variant: SearchBarVariant, state: SearchBarState) => ({
		color: searchBarColors(theme.components, variant, state).cancel,
	}),
}));
