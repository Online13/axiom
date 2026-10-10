import {
	StyleSheet,
	TextInput,
	useWindowDimensions,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { inputColors } from "@/components/ui/input-colors";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import type { InputState } from "@/components/ui/use-input";
import { useTheme } from "@/theme";

import type { TextAreaProps, TextAreaVariant } from "./text-area";

// The placeholder and the caret take their color as props.
export const TextAreaText = TextInput;

export function useTextAreaStyles(
	variant: TextAreaVariant,
	autoGrow: boolean,
	minRows: number,
	maxRows: number,
) {
	const { tokens, components } = useTheme();
	const { fontScale } = useWindowDimensions();
	const plain = variant === "plain";
	// `plain` keeps the colors of `outline`; it only drops the border, background and padding.
	const colorVariant = plain ? "outline" : variant;
	const typography = tokens.typography.callout;
	const paddingVertical = plain ? 0 : tokens.spacing[3] - 1;
	// The system text size also scales the line height: the rows follow it, up to the cap.
	const scale = Math.min(fontScale, MAX_FONT_SCALE.control);
	const rowsHeight = (rows: number) =>
		rows * typography.lineHeight * scale + paddingVertical * 2;

	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			style: [
				plain ? styles.plain : styles.control,
				!plain && {
					paddingHorizontal: tokens.spacing[3],
					borderRadius: tokens.radius.md,
					backgroundColor:
						inputColors(components, colorVariant, state).background ??
						"transparent",
					borderColor:
						inputColors(components, colorVariant, state).border ??
						"transparent",
				},
				containerStyle,
			],
		}),
		colors: (state: InputState) => ({
			placeholderTextColor: inputColors(components, colorVariant, state)
				.placeholder,
			selectionColor: inputColors(components, colorVariant, state).caret,
			cursorColor: inputColors(components, colorVariant, state).caret,
		}),
		text: (state: InputState, { style }: Pick<TextAreaProps, "style">) => ({
			style: [
				styles.text,
				{
					paddingVertical,
					fontSize: typography.fontSize,
					lineHeight: typography.lineHeight,
					fontWeight: typography.fontWeight,
					color: inputColors(components, colorVariant, state).text,
				},
				typography.fontFamily
					? { fontFamily: typography.fontFamily }
					: undefined,
				plain
					? styles.fill
					: autoGrow
						? {
								minHeight: rowsHeight(minRows),
								maxHeight: rowsHeight(maxRows),
							}
						: { height: rowsHeight(minRows) },
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	control: {
		borderWidth: 1,
		borderCurve: "continuous",
	},
	plain: {
		flexGrow: 1,
	},
	text: {
		paddingHorizontal: 0,
	},
	fill: {
		flexGrow: 1,
	},
});
