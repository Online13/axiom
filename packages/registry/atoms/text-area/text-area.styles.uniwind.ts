import {
	TextInput,
	useWindowDimensions,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import {
	INPUT_CARET,
	INPUT_CONTROL,
	INPUT_PLACEHOLDER,
	INPUT_TEXT,
} from "@/components/ui/input-classes";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import type { InputState } from "@/components/ui/use-input";
import { cx } from "@/theme";
import { tokens } from "@/theme/tokens";

import type { TextAreaProps, TextAreaVariant } from "./text-area";

// The placeholder and the caret take their color as props, which Uniwind reads from classes.
export const TextAreaText = TextInput;

export function useTextAreaStyles(
	variant: TextAreaVariant,
	autoGrow: boolean,
	minRows: number,
	maxRows: number,
) {
	const { fontScale } = useWindowDimensions();
	const plain = variant === "plain";
	// `plain` keeps the colors of `outline`; it only drops the border, background and padding.
	const colorVariant = plain ? "outline" : variant;
	// The rows are heights in numbers, computed from the line height: they stay styles.
	const paddingVertical = plain ? 0 : tokens.spacing[3] - 1;
	// The system text size also scales the line height: the rows follow it, up to the cap.
	const scale = Math.min(fontScale, MAX_FONT_SCALE.control);
	const rowsHeight = (rows: number) =>
		rows * tokens.typography.callout.lineHeight * scale + paddingVertical * 2;

	return {
		control: (state: InputState, containerStyle: StyleProp<ViewStyle>) => ({
			className: plain
				? "grow"
				: cx("rounded-md border px-3", INPUT_CONTROL[colorVariant][state]),
			style: [
				!plain && { borderCurve: "continuous" as const },
				containerStyle,
			],
		}),
		colors: (state: InputState) => ({
			placeholderTextColorClassName: INPUT_PLACEHOLDER[colorVariant][state],
			selectionColorClassName: INPUT_CARET[colorVariant][state],
			cursorColorClassName: INPUT_CARET[colorVariant][state],
		}),
		text: (
			state: InputState,
			{ className, style }: Pick<TextAreaProps, "className" | "style">,
		) => ({
			className: cx(
				"px-0 text-callout",
				plain && "grow",
				INPUT_TEXT[colorVariant][state],
				className,
			),
			style: [
				{ paddingVertical },
				plain
					? undefined
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
