import type { ReactNode, Ref } from "react";
import {
	Pressable,
	StyleSheet,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

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
	const { tokens, components } = useTheme();
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

	const colors = searchBarColors(components, variant, search.state);
	const typography = tokens.typography[TEXT[size]];
	const iconSize = size === "sm" ? "sm" : "md";

	return (
		<View style={[styles.row, containerStyle]}>
			{/* Taps on the padding around the text focus the field. */}
			<Pressable
				accessible={false}
				onPress={search.focus}
				style={[
					styles.field,
					{
						height: HEIGHT[size],
						paddingHorizontal: tokens.spacing[2],
						gap: tokens.spacing[2],
						borderRadius: tokens.radius.md,
						backgroundColor: colors.background ?? "transparent",
						borderColor: colors.border ?? "transparent",
					},
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

			{showCancel === false ? null : (
				<Animated.View
					style={[
						styles.cancel,
						{ height: HEIGHT[size] },
						search.cancelStyle,
					]}
				>
					{/* Absolute: the button keeps its natural width while the wrapper animates and clips it. */}
					<View
						onLayout={search.onCancelLayout}
						style={[
							styles.cancelInner,
							{ paddingStart: tokens.spacing[3] },
						]}
					>
						<Tappable
							accessibilityLabel={cancelLabel}
							onPress={search.cancel}
							disabled={disabled || !search.cancelVisible}
						>
							<Text
								variant="body"
								maxFontSizeMultiplier={MAX_FONT_SCALE.control}
								style={{ color: colors.cancel }}
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

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	field: {
		flex: 1,
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
	cancel: {
		overflow: "hidden",
	},
	cancelInner: {
		position: "absolute",
		start: 0,
		top: 0,
		bottom: 0,
		justifyContent: "center",
	},
});
