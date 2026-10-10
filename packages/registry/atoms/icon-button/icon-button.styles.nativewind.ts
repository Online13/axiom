import { Icon, type IconColor } from "@/components/ui/icon";
import { cx } from "@/theme";

import type {
	IconButtonProps,
	IconButtonShape,
	IconButtonSize,
	IconButtonVariant,
} from "./icon-button";

// Every class is written whole, so Tailwind finds it. The colors and the radius are the icon
// button's own tokens, in `theme/components/icon-button.css`.
const SIZE: Record<IconButtonSize, string> = {
	sm: "size-control-sm",
	md: "size-control-md",
	lg: "size-control-lg",
};

type State = "default" | "selected" | "disabled";

const CONTAINER: Record<IconButtonVariant, Record<State, string>> = {
	ghost: {
		default: "",
		selected: "bg-icon-button-ghost-selected",
		disabled: "",
	},
	tinted: {
		default: "bg-icon-button-tinted",
		selected: "bg-icon-button-tinted-selected",
		disabled: "bg-icon-button-tinted-disabled",
	},
	outline: {
		default:
			"border border-icon-button-outline-border bg-icon-button-outline",
		selected:
			"border border-icon-button-outline-border-selected bg-icon-button-outline-selected",
		disabled:
			"border border-icon-button-outline-border-disabled bg-icon-button-outline-disabled",
	},
	solid: {
		default: "bg-icon-button-solid",
		selected: "bg-icon-button-solid-selected",
		disabled: "bg-icon-button-solid-disabled",
	},
};

// `pressed` is applied by the pressable itself, through `active:`, over the selected state: only
// what the pressed tokens change is listed.
const PRESSED: Record<IconButtonVariant, string> = {
	ghost: "active:bg-icon-button-ghost-pressed",
	tinted: "active:bg-icon-button-tinted-pressed",
	outline: "active:bg-icon-button-outline-pressed",
	solid: "active:bg-icon-button-solid-pressed",
};

// The same scale as `metrics.pressScale`.
const PRESS_SCALE = "active:scale-[0.97]";

// The icon takes its color as a prop. NativeWind gives it from a text color class.
const FOREGROUND: Record<IconButtonVariant, Record<State, string>> = {
	ghost: {
		default: "text-icon-button-ghost-foreground",
		selected: "text-icon-button-ghost-foreground-selected",
		disabled: "text-icon-button-ghost-foreground-disabled",
	},
	tinted: {
		default: "text-icon-button-tinted-foreground",
		selected: "text-icon-button-tinted-foreground-selected",
		disabled: "text-icon-button-tinted-foreground-disabled",
	},
	outline: {
		default: "text-icon-button-outline-foreground",
		selected: "text-icon-button-outline-foreground-selected",
		disabled: "text-icon-button-outline-foreground-disabled",
	},
	solid: {
		default: "text-icon-button-solid-foreground",
		selected: "text-icon-button-solid-foreground-selected",
		disabled: "text-icon-button-solid-foreground-disabled",
	},
};

export const IconButtonIcon = Icon;

export function useIconButtonStyles(
	variant: IconButtonVariant,
	size: IconButtonSize,
	shape: IconButtonShape,
	selected: boolean,
) {
	return {
		container: (
			disabled: boolean,
			{ className }: Pick<IconButtonProps, "className">,
		) => ({
			className: cx(
				"items-center justify-center",
				SIZE[size],
				shape === "circle" ? "rounded-full" : "rounded-icon-button",
				CONTAINER[variant][
					disabled ? "disabled" : selected ? "selected" : "default"
				],
				!disabled && PRESSED[variant],
				!disabled && PRESS_SCALE,
				className,
			),
		}),
		// A color of its own replaces the variant's, except when disabled: the icon names it itself.
		tint: (
			color: IconColor | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			color: color && !disabled ? color : undefined,
			className:
				color && !disabled
					? undefined
					: FOREGROUND[variant][
							disabled ? "disabled" : selected ? "selected" : "default"
						],
		}),
	};
}
