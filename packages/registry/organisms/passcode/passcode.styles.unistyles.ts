import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { Spacing, Theme } from "@/theme";

import type {
	KeyboardVariant,
	PasscodeKeyState,
	PasscodeSlotState,
} from "./passcode";
import { stateColors } from "@/theme/components/states";

type Styled = { style?: StyleProp<ViewStyle> };
type SlotState = PasscodeSlotState;
type KeyState = PasscodeKeyState;

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const PasscodeIcon = withUnistyles(Icon);

export function usePasscodeStyles() {
	return {
		root: ({ style }: Styled) => ({ style: [styles.root, style] }),
		group: (gap: keyof Spacing) => styles.group(gap),
		dot: (state: PasscodeSlotState, filled: boolean, { style }: Styled) => ({
			style: [styles.dot(state, filled), style],
		}),
		box: (state: PasscodeSlotState, { style }: Styled) => ({
			style: [styles.box(state), style],
		}),
		boxDot: (state: PasscodeSlotState) => ({ style: styles.boxDot(state) }),
		boxText: (state: PasscodeSlotState) => ({
			style: styles.boxDigit(state),
		}),
		keyboard: (variant: KeyboardVariant, { style }: Styled) => ({
			style: [styles.keyboard(variant), style],
		}),
		cell: { style: styles.cell },
		key: (variant: KeyboardVariant, disabled: boolean) => ({
			style: ({ pressed }: TappableState) =>
				styles.key(
					variant,
					disabled ? "disabled" : pressed ? "pressed" : "default",
				),
		}),
		digit: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			style: styles.digit(variant, state),
		}),
		letters: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			style: styles.letters(variant, state),
		}),
		tint: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			uniProps: (theme: Theme) => ({
				color: keyColors(theme.components, variant, state).text,
			}),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	root: {
		alignItems: "center",
		gap: theme.tokens.spacing[8],
	},
	group: (gap: keyof Theme["tokens"]["spacing"]) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[gap],
	}),
	dot: (state: SlotState, filled: boolean) => {
		const colors = slotColors(theme.components, "dot", state);
		return {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			borderWidth: 1.5,
			borderColor: colors.border,
			backgroundColor: filled ? colors.background : "transparent",
		};
	},
	box: (state: SlotState) => {
		const colors = slotColors(theme.components, "box", state);
		return {
			alignItems: "center",
			justifyContent: "center",
			borderWidth: 1.5,
			borderCurve: "continuous",
			...BOX,
			borderRadius: theme.tokens.radius.md,
			borderColor: colors.border,
			backgroundColor: colors.background,
		};
	},
	boxDot: (state: SlotState) => ({
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: slotColors(theme.components, "box", state).content,
	}),
	boxDigit: (state: SlotState) => ({
		color: slotColors(theme.components, "box", state).content,
	}),
	keyboard: (variant: KeyboardVariant) => ({
		flexDirection: "row",
		flexWrap: "wrap",
		alignSelf: "stretch",
		rowGap: theme.tokens.spacing[variant === "round" ? 3 : 2],
	}),
	// Three columns whatever the width: the space between keys comes from the cells, never from a gap,
	// so three cells always add up to exactly one row.
	cell: {
		width: "33.333%",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	key: (variant: KeyboardVariant, state: KeyState) => ({
		alignItems: "center",
		justifyContent: "center",
		borderCurve: "continuous",
		...(variant === "round"
			? { width: ROUND, height: ROUND, borderRadius: ROUND / 2 }
			: {
					alignSelf: "stretch",
					height: FLAT_HEIGHT,
					borderRadius: theme.tokens.radius.md,
				}),
		backgroundColor: keyColors(theme.components, variant, state).background,
	}),
	digit: (variant: KeyboardVariant, state: KeyState) => ({
		fontSize: 28,
		lineHeight: 34,
		color: keyColors(theme.components, variant, state).text,
	}),
	letters: (variant: KeyboardVariant, state: KeyState) => ({
		letterSpacing: 1,
		color: keyColors(theme.components, variant, state).letters,
	}),
}));
