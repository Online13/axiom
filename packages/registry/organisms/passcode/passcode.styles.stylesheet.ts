import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { useTheme, type Spacing, type Theme } from "@/theme";

import type {
	KeyboardVariant,
	PasscodeKeyState,
	PasscodeSlotState,
} from "./passcode";
import { stateColors } from "@/theme/components/states";

type Styled = { style?: StyleProp<ViewStyle> };

const DOT = 14;
const BOX = { width: 48, height: 56 };
const ROUND = 72;
const FLAT_HEIGHT = 56;

/** Colors of a part for a variant and a state; missing properties fall back to `default`. */
function slotColors(
	components: Theme["components"],
	variant: "dot" | "box",
	state: PasscodeSlotState,
) {
	const states = components.passcode.slot[variant];
	return stateColors(states, state);
}

function keyColors(
	components: Theme["components"],
	variant: KeyboardVariant,
	state: PasscodeKeyState,
) {
	const states = components.passcode.key[variant];
	return stateColors(states, state);
}

// The icon takes its color as a prop.
export const PasscodeIcon = Icon;

export function usePasscodeStyles() {
	const { tokens, components } = useTheme();

	return {
		root: ({ style }: Styled) => ({
			style: [styles.root, { gap: tokens.spacing[8] }, style],
		}),
		group: (gap: keyof Spacing) => [
			styles.group,
			{ gap: tokens.spacing[gap] },
		],
		// A dot is hollow until its digit is entered.
		dot: (state: PasscodeSlotState, filled: boolean, { style }: Styled) => ({
			style: [
				{
					width: DOT,
					height: DOT,
					borderRadius: DOT / 2,
					borderWidth: 1.5,
					borderColor: slotColors(components, "dot", state).border,
					backgroundColor: filled
						? slotColors(components, "dot", state).background
						: "transparent",
				},
				style,
			],
		}),
		box: (state: PasscodeSlotState, { style }: Styled) => ({
			style: [
				styles.box,
				{
					...BOX,
					borderRadius: tokens.radius.md,
					borderColor: slotColors(components, "box", state).border,
					backgroundColor: slotColors(components, "box", state).background,
				},
				style,
			],
		}),
		boxDot: (state: PasscodeSlotState) => ({
			style: {
				width: 10,
				height: 10,
				borderRadius: 5,
				backgroundColor: slotColors(components, "box", state).content,
			},
		}),
		boxText: (state: PasscodeSlotState) => ({
			style: { color: slotColors(components, "box", state).content },
		}),
		keyboard: (variant: KeyboardVariant, { style }: Styled) => ({
			style: [
				styles.keyboard,
				{ rowGap: tokens.spacing[variant === "round" ? 3 : 2] },
				style,
			],
		}),
		cell: { style: styles.cell },
		key: (variant: KeyboardVariant, disabled: boolean) => ({
			style: ({ pressed }: TappableState) => [
				styles.key,
				variant === "round"
					? { width: ROUND, height: ROUND, borderRadius: ROUND / 2 }
					: {
							alignSelf: "stretch" as const,
							height: FLAT_HEIGHT,
							borderRadius: tokens.radius.md,
						},
				{
					backgroundColor: keyColors(
						components,
						variant,
						disabled ? "disabled" : pressed ? "pressed" : "default",
					).background,
				},
			],
		}),
		digit: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			style: [
				styles.digit,
				{ color: keyColors(components, variant, state).text },
			],
		}),
		letters: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			style: {
				color: keyColors(components, variant, state).letters,
				letterSpacing: 1,
			},
		}),
		tint: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			color: keyColors(components, variant, state).text,
		}),
	};
}

const styles = StyleSheet.create({
	root: {
		alignItems: "center",
	},
	group: {
		flexDirection: "row",
		alignItems: "center",
	},
	box: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderCurve: "continuous",
	},
	keyboard: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignSelf: "stretch",
	},
	// Three columns whatever the width: the space between keys comes from the cells, never from a gap,
	// so three cells always add up to exactly one row.
	cell: {
		width: "33.333%",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	key: {
		alignItems: "center",
		justifyContent: "center",
		borderCurve: "continuous",
	},
	digit: {
		fontSize: 28,
		lineHeight: 34,
	},
});
