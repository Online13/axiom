import type { StyleProp, ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import { cx, type Spacing } from "@/theme";
import { spacing } from "@/theme/tokens";

import type {
	KeyboardVariant,
	PasscodeKeyState,
	PasscodeSlotState,
} from "./passcode";

type Classed = { className?: string };

// Every class is written whole, so Tailwind finds it. The colors are the passcode's own tokens, in
// `theme/components/passcode.css`.
const DOT_BORDER: Record<PasscodeSlotState, string> = {
	default: "border-passcode-slot-dot-border",
	filled: "border-passcode-slot-dot-border-filled",
	error: "border-passcode-slot-dot-border-error",
	success: "border-passcode-slot-dot-border-success",
	disabled: "border-passcode-slot-dot-border-disabled",
};

// The fill of a dot once its digit is entered.
const DOT_FILL: Record<PasscodeSlotState, string> = {
	default: "bg-passcode-slot-dot",
	filled: "bg-passcode-slot-dot-filled",
	error: "bg-passcode-slot-dot-error",
	success: "bg-passcode-slot-dot-success",
	disabled: "bg-passcode-slot-dot-disabled",
};

const BOX: Record<PasscodeSlotState, string> = {
	default: "border-passcode-slot-box-border bg-passcode-slot-box",
	filled: "border-passcode-slot-box-border-filled bg-passcode-slot-box-filled",
	error: "border-passcode-slot-box-border-error bg-passcode-slot-box-error",
	success:
		"border-passcode-slot-box-border-success bg-passcode-slot-box-success",
	disabled:
		"border-passcode-slot-box-border-disabled bg-passcode-slot-box-disabled",
};

const BOX_DOT: Record<PasscodeSlotState, string> = {
	default: "bg-passcode-slot-box-content",
	filled: "bg-passcode-slot-box-content-filled",
	error: "bg-passcode-slot-box-content-error",
	success: "bg-passcode-slot-box-content-success",
	disabled: "bg-passcode-slot-box-content-disabled",
};

const BOX_TEXT: Record<PasscodeSlotState, string> = {
	default: "text-passcode-slot-box-content",
	filled: "text-passcode-slot-box-content-filled",
	error: "text-passcode-slot-box-content-error",
	success: "text-passcode-slot-box-content-success",
	disabled: "text-passcode-slot-box-content-disabled",
};

// `pressed` is applied by the pressable itself, through `active:`.
const KEY: Record<
	KeyboardVariant,
	Record<"default" | "pressed" | "disabled", string>
> = {
	round: {
		default: "bg-passcode-key-round",
		pressed: "active:bg-passcode-key-round-pressed",
		disabled: "bg-passcode-key-round-disabled",
	},
	flat: {
		default: "bg-passcode-key-flat",
		pressed: "active:bg-passcode-key-flat-pressed",
		disabled: "bg-passcode-key-flat-disabled",
	},
};

const KEY_TEXT: Record<
	KeyboardVariant,
	Record<"default" | "disabled", string>
> = {
	round: {
		default: "text-passcode-key-round-text",
		disabled: "text-passcode-key-round-text-disabled",
	},
	flat: {
		default: "text-passcode-key-flat-text",
		disabled: "text-passcode-key-flat-text-disabled",
	},
};

const KEY_LETTERS: Record<
	KeyboardVariant,
	Record<"default" | "disabled", string>
> = {
	round: {
		default: "text-passcode-key-round-letters",
		disabled: "text-passcode-key-round-letters-disabled",
	},
	flat: {
		default: "text-passcode-key-flat-letters",
		disabled: "text-passcode-key-flat-letters-disabled",
	},
};

// The icon takes its color as a prop. NativeWind gives it from a text color class: the digits'.
export const PasscodeIcon = Icon;

export function usePasscodeStyles() {
	return {
		root: ({ className }: Classed) => ({
			className: cx("items-center gap-8", className),
		}),
		// An animated view takes `style` only.
		group: (gap: keyof Spacing) =>
			({
				flexDirection: "row",
				alignItems: "center",
				gap: spacing[gap],
			}) satisfies StyleProp<ViewStyle>,
		// A dot is hollow until its digit is entered.
		dot: (
			state: PasscodeSlotState,
			filled: boolean,
			{ className }: Classed,
		) => ({
			className: cx(
				"size-[14px] rounded-full border-[1.5px]",
				DOT_BORDER[state],
				filled && DOT_FILL[state],
				className,
			),
		}),
		box: (state: PasscodeSlotState, { className }: Classed) => ({
			className: cx(
				"h-[56px] w-[48px] items-center justify-center rounded-md border-[1.5px]",
				BOX[state],
				className,
			),
			style: { borderCurve: "continuous" as const },
		}),
		boxDot: (state: PasscodeSlotState) => ({
			className: cx("size-[10px] rounded-full", BOX_DOT[state]),
		}),
		boxText: (state: PasscodeSlotState) => ({ className: BOX_TEXT[state] }),
		keyboard: (variant: KeyboardVariant, { className }: Classed) => ({
			className: cx(
				"flex-row flex-wrap self-stretch",
				variant === "round" ? "gap-y-3" : "gap-y-2",
				className,
			),
		}),
		// Three columns whatever the width: the space between keys comes from the cells, never from a
		// gap, so three cells always add up to exactly one row.
		cell: { className: "w-1/3 items-center px-[4px]" },
		key: (variant: KeyboardVariant, disabled: boolean) => ({
			className: cx(
				"items-center justify-center",
				variant === "round"
					? "size-[72px] rounded-full"
					: "h-[56px] self-stretch rounded-md",
				KEY[variant][disabled ? "disabled" : "default"],
				!disabled && KEY[variant].pressed,
			),
			style: { borderCurve: "continuous" as const },
		}),
		digit: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			className: cx(
				"text-[28px] leading-[34px]",
				KEY_TEXT[variant][state === "disabled" ? "disabled" : "default"],
			),
		}),
		letters: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			className: cx(
				"tracking-[1px]",
				KEY_LETTERS[variant][state === "disabled" ? "disabled" : "default"],
			),
		}),
		tint: (variant: KeyboardVariant, state: PasscodeKeyState) => ({
			className:
				KEY_TEXT[variant][state === "disabled" ? "disabled" : "default"],
		}),
	};
}
