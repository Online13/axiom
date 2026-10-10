import { TextInput, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { searchBarColors } from "@/components/ui/search-bar-colors";
import type { Theme } from "@/theme";

import type {
	SearchBarProps,
	SearchBarSize,
	SearchBarVariant,
} from "./search-bar";
import type { SearchBarState } from "./use-search-bar";

const TEXT = { sm: "subheadline", md: "callout" } as const;

// The icon color, the placeholder and the caret are props, not styles. Wrapped once, here, so each
// instance only has to map the theme to those props through `uniProps`. Refs are forwarded.
export const SearchBarIcon = withUnistyles(Icon);
export const SearchBarText = withUnistyles(TextInput);

export function useSearchBarStyles(
	variant: SearchBarVariant,
	size: SearchBarSize,
) {
	return {
		field: (state: SearchBarState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [styles.field(variant, size, state), containerStyle],
		}),
		tint: (state: SearchBarState) => ({
			uniProps: (theme: Theme) => ({
				color: searchBarColors(theme.components, variant, state).icon,
			}),
		}),
		colors: (state: SearchBarState) => ({
			uniProps: (theme: Theme) => ({
				placeholderTextColor: searchBarColors(
					theme.components,
					variant,
					state,
				).placeholder,
				selectionColor: searchBarColors(theme.components, variant, state)
					.caret,
				cursorColor: searchBarColors(theme.components, variant, state)
					.caret,
			}),
		}),
		text: (
			state: SearchBarState,
			{ style }: Pick<SearchBarProps, "style">,
		) => ({
			style: [styles.text(variant, size, state), style],
		}),
	};
}

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
