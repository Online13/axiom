import {
	StyleSheet,
	TextInput,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Icon } from "@/components/ui/icon";
import { searchBarColors } from "@/components/ui/search-bar-colors";
import { useTheme } from "@/theme";

import type {
	SearchBarProps,
	SearchBarSize,
	SearchBarVariant,
} from "./search-bar";
import type { SearchBarState } from "./use-search-bar";

const TEXT = { sm: "subheadline", md: "callout" } as const;

// The icon color, the placeholder and the caret are props.
export const SearchBarIcon = Icon;
export const SearchBarText = TextInput;

export function useSearchBarStyles(
	variant: SearchBarVariant,
	size: SearchBarSize,
) {
	const { tokens, components } = useTheme();
	const typography = tokens.typography[TEXT[size]];

	return {
		field: (state: SearchBarState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [
				styles.field,
				{
					height: tokens.sizes.input[size],
					paddingHorizontal: tokens.spacing[2],
					gap: tokens.spacing[2],
					borderRadius: tokens.radius.md,
					backgroundColor:
						searchBarColors(components, variant, state).background ??
						"transparent",
					borderColor:
						searchBarColors(components, variant, state).border ??
						"transparent",
				},
				containerStyle,
			],
		}),
		tint: (state: SearchBarState) => ({
			color: searchBarColors(components, variant, state).icon,
		}),
		colors: (state: SearchBarState) => ({
			placeholderTextColor: searchBarColors(components, variant, state)
				.placeholder,
			selectionColor: searchBarColors(components, variant, state).caret,
			cursorColor: searchBarColors(components, variant, state).caret,
		}),
		text: (
			state: SearchBarState,
			{ style }: Pick<SearchBarProps, "style">,
		) => ({
			style: [
				styles.text,
				{
					fontSize: typography.fontSize,
					fontWeight: typography.fontWeight,
					color: searchBarColors(components, variant, state).text,
				},
				typography.fontFamily
					? { fontFamily: typography.fontFamily }
					: undefined,
				style,
			],
		}),
	};
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
