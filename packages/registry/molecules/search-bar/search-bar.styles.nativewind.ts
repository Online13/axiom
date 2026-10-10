import { cssInterop } from "nativewind";
import { TextInput, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { typography } from "@/theme/tokens";

import type {
	SearchBarProps,
	SearchBarSize,
	SearchBarVariant,
} from "./search-bar";
import type { SearchBarState } from "./use-search-bar";

const TEXT = { sm: "subheadline", md: "callout" } as const;

// Every class is written whole, so Tailwind finds it. The colors are the search bar's own tokens,
// in `theme/components/search-bar.css`.
// The box: its background and its border. `filled` has no border, and no tokens of its own when focused.
const FIELD: Record<SearchBarVariant, Record<SearchBarState, string>> = {
	filled: {
		default: "border-transparent bg-search-bar-filled",
		focused: "border-transparent bg-search-bar-filled",
		disabled: "border-transparent bg-search-bar-filled-disabled",
	},
	outline: {
		default: "border-search-bar-outline-border bg-search-bar-outline",
		focused:
			"border-search-bar-outline-border-focused bg-search-bar-outline-focused",
		disabled:
			"border-search-bar-outline-border-disabled bg-search-bar-outline-disabled",
	},
};

const TEXT_COLOR: Record<SearchBarVariant, Record<SearchBarState, string>> = {
	filled: {
		default: "text-search-bar-filled-text",
		focused: "text-search-bar-filled-text",
		disabled: "text-search-bar-filled-text-disabled",
	},
	outline: {
		default: "text-search-bar-outline-text",
		focused: "text-search-bar-outline-text-focused",
		disabled: "text-search-bar-outline-text-disabled",
	},
};

const ICON: Record<SearchBarVariant, Record<SearchBarState, string>> = {
	filled: {
		default: "text-search-bar-filled-icon",
		focused: "text-search-bar-filled-icon",
		disabled: "text-search-bar-filled-icon-disabled",
	},
	outline: {
		default: "text-search-bar-outline-icon",
		focused: "text-search-bar-outline-icon-focused",
		disabled: "text-search-bar-outline-icon-disabled",
	},
};

const PLACEHOLDER: Record<SearchBarVariant, Record<SearchBarState, string>> = {
	filled: {
		default: "text-search-bar-filled-placeholder",
		focused: "text-search-bar-filled-placeholder",
		disabled: "text-search-bar-filled-placeholder-disabled",
	},
	outline: {
		default: "text-search-bar-outline-placeholder",
		focused: "text-search-bar-outline-placeholder-focused",
		disabled: "text-search-bar-outline-placeholder-disabled",
	},
};

const CARET: Record<SearchBarVariant, Record<SearchBarState, string>> = {
	filled: {
		default: "text-search-bar-filled-caret",
		focused: "text-search-bar-filled-caret",
		disabled: "text-search-bar-filled-caret-disabled",
	},
	outline: {
		default: "text-search-bar-outline-caret",
		focused: "text-search-bar-outline-caret-focused",
		disabled: "text-search-bar-outline-caret-disabled",
	},
};

// The icon color, the placeholder and the caret are props, not styles. NativeWind reads the icon's
// from a text color class, and here each color of the TextInput from a class of its own.
export const SearchBarIcon = Icon;
export const SearchBarText = cssInterop(TextInput, {
	className: { target: "style", nativeStyleToProp: { textAlign: true } },
	placeholderClassName: {
		target: false,
		nativeStyleToProp: { color: "placeholderTextColor" },
	},
	selectionClassName: {
		target: false,
		nativeStyleToProp: { color: "selectionColor" },
	},
	cursorClassName: {
		target: false,
		nativeStyleToProp: { color: "cursorColor" },
	},
});

export function useSearchBarStyles(
	variant: SearchBarVariant,
	size: SearchBarSize,
) {
	return {
		field: (state: SearchBarState, containerStyle: StyleProp<ViewStyle>) => ({
			className: cx(
				"flex-row items-center gap-2 rounded-md border px-2",
				size === "sm" ? "h-input-sm" : "h-input-md",
				FIELD[variant][state],
			),
			style: [{ borderCurve: "continuous" as const }, containerStyle],
		}),
		tint: (state: SearchBarState) => ({
			className: ICON[variant][state],
		}),
		colors: (state: SearchBarState) => ({
			placeholderClassName: PLACEHOLDER[variant][state],
			selectionClassName: CARET[variant][state],
			cursorClassName: CARET[variant][state],
		}),
		// Android adds vertical padding to TextInput; the field sets the height. The text takes the
		// size and the weight of its typography token, without its line height: it is one line.
		text: (
			state: SearchBarState,
			{ className, style }: Pick<SearchBarProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-1 self-stretch p-0",
				TEXT_COLOR[variant][state],
				className,
			),
			style: [
				{
					fontSize: typography[TEXT[size]].fontSize,
					fontWeight: typography[TEXT[size]].fontWeight,
				},
				style,
			],
		}),
	};
}
