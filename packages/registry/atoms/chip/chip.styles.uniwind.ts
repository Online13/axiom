import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx, type Spacing } from "@/theme";

import type { ChipGroupProps, ChipProps, ChipSize, ChipVariant } from "./chip";

// Every class is written whole, so Tailwind finds it. The colors and the radius are the chip's own
// tokens, in `theme/components/chip.css`.
const SIZE: Record<ChipSize, string> = {
	sm: "min-h-[28px]",
	md: "min-h-[34px]",
};

// Later states win, each one listing what it changes: selected, then disabled. `pressed` is
// applied by the pressable itself, through `active:`, on a chip that isn't selected.
const SURFACE: Record<
	ChipVariant,
	Record<"default" | "selected" | "pressed" | "disabled", string>
> = {
	outline: {
		default: "border border-chip-outline-border bg-chip-outline",
		selected: "border-chip-outline-border-selected bg-chip-outline-selected",
		pressed: "active:bg-chip-outline-pressed",
		disabled: "border-chip-outline-border-disabled",
	},
	filled: {
		default: "bg-chip-filled",
		selected: "bg-chip-filled-selected",
		pressed: "active:bg-chip-filled-pressed",
		disabled: "",
	},
};

const FOREGROUND: Record<
	ChipVariant,
	Record<"default" | "selected" | "disabled", string>
> = {
	outline: {
		default: "text-chip-outline-foreground",
		selected: "text-chip-outline-foreground-selected",
		disabled: "text-chip-outline-foreground-disabled",
	},
	filled: {
		default: "text-chip-filled-foreground",
		selected: "text-chip-filled-foreground-selected",
		disabled: "text-chip-filled-foreground-disabled",
	},
};

const LABEL_SIZE: Record<ChipSize, string> = {
	sm: "text-footnote",
	md: "text-subheadline",
};

const REMOVE: Record<ChipSize, string> = {
	sm: "size-[20px]",
	md: "size-[26px]",
};

const GAP: Record<keyof Spacing, string> = {
	0: "gap-0",
	1: "gap-1",
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	5: "gap-5",
	6: "gap-6",
	8: "gap-8",
	10: "gap-10",
	12: "gap-12",
};

// The foreground again, as the `accent-` classes Uniwind reads a color prop from.
const TINT: Record<
	ChipVariant,
	Record<"default" | "selected" | "disabled", string>
> = {
	outline: {
		default: "accent-chip-outline-foreground",
		selected: "accent-chip-outline-foreground-selected",
		disabled: "accent-chip-outline-foreground-disabled",
	},
	filled: {
		default: "accent-chip-filled-foreground",
		selected: "accent-chip-filled-foreground-selected",
		disabled: "accent-chip-filled-foreground-disabled",
	},
};

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const ChipIcon = withUniwind(Icon);

export function useChipStyles() {
	return {
		chip: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			disabled: boolean,
			leading: boolean,
			trailing: boolean,
			removable: boolean,
			{ className }: Pick<ChipProps, "className">,
		) => ({
			className: cx(
				"flex-row items-center gap-1 self-start rounded-chip",
				SIZE[size],
				leading ? "ps-2" : "ps-3",
				removable ? "pe-1" : trailing ? "pe-2" : "pe-3",
				SURFACE[variant].default,
				selected && SURFACE[variant].selected,
				disabled && SURFACE[variant].disabled,
				className,
			),
		}),
		pressableChip: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			disabled: boolean,
			leading: boolean,
			trailing: boolean,
			removable: boolean,
			{ className }: Pick<ChipProps, "className">,
		) => ({
			className: cx(
				"flex-row items-center gap-1 self-start rounded-chip",
				SIZE[size],
				leading ? "ps-2" : "ps-3",
				removable ? "pe-1" : trailing ? "pe-2" : "pe-3",
				SURFACE[variant].default,
				selected && SURFACE[variant].selected,
				!selected && !disabled && SURFACE[variant].pressed,
				disabled && SURFACE[variant].disabled,
				className,
			),
		}),
		tint: (
			variant: ChipVariant,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			colorClassName:
				TINT[variant][
					disabled ? "disabled" : selected ? "selected" : "default"
				],
		}),
		label: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			className: cx(
				LABEL_SIZE[size],
				"font-medium",
				FOREGROUND[variant][
					disabled ? "disabled" : selected ? "selected" : "default"
				],
			),
		}),
		remove: (size: ChipSize) => ({
			className: cx(
				"items-center justify-center rounded-full",
				REMOVE[size],
			),
		}),
		group: (
			gap: keyof Spacing,
			{ className }: Pick<ChipGroupProps, "className">,
		) => ({
			className: cx("flex-row flex-wrap items-center", GAP[gap], className),
		}),
	};
}
