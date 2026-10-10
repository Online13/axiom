import type { ViewStyle } from "react-native";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type {
	FloatingButtonProps,
	FloatingButtonSize,
	FloatingButtonVariant,
} from "./floating-button";

// Every class is written whole, so Tailwind finds it. The colors and the radius are the floating
// button's own tokens, in `theme/components/floating-button.css`.
const SIZE: Record<FloatingButtonSize, string> = {
	sm: "min-h-control-md min-w-control-md",
	md: "min-h-control-lg min-w-control-lg",
};

// `pressed` is applied by the pressable itself, through `active:`.
const SURFACE: Record<
	FloatingButtonVariant,
	Record<"default" | "pressed" | "disabled", string>
> = {
	solid: {
		default: "bg-floating-button-solid",
		pressed: "active:bg-floating-button-solid-pressed",
		disabled: "bg-floating-button-solid-disabled",
	},
	tinted: {
		default: "border-floating-button-tinted-border bg-floating-button-tinted",
		pressed: "active:bg-floating-button-tinted-pressed",
		disabled:
			"border-floating-button-tinted-border-disabled bg-floating-button-tinted-disabled",
	},
};

// The same scale as `metrics.pressScale`.
const PRESS_SCALE = "active:scale-[0.97]";

const FOREGROUND: Record<
	FloatingButtonVariant,
	Record<"default" | "disabled", string>
> = {
	solid: {
		default: "text-floating-button-solid-foreground",
		disabled: "text-floating-button-solid-foreground-disabled",
	},
	tinted: {
		default: "text-floating-button-tinted-foreground",
		disabled: "text-floating-button-tinted-foreground-disabled",
	},
};

// The foreground again, as the `accent-` classes Uniwind reads a color prop from.
const TINT: Record<
	FloatingButtonVariant,
	Record<"default" | "disabled", string>
> = {
	solid: {
		default: "accent-floating-button-solid-foreground",
		disabled: "accent-floating-button-solid-foreground-disabled",
	},
	tinted: {
		default: "accent-floating-button-tinted-foreground",
		disabled: "accent-floating-button-tinted-foreground-disabled",
	},
};

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const FloatingButtonIcon = withUniwind(Icon);

export function useFloatingButtonStyles(
	variant: FloatingButtonVariant,
	size: FloatingButtonSize,
) {
	return {
		// The distance the button keeps from the edges of the screen: a number, for its hook.
		margin: metrics.screenMargin,
		// An animated view takes `style` only. A centered anchor spans the screen width: only the
		// button catches touches.
		anchor: (hidden: boolean) =>
			({
				position: "absolute",
				pointerEvents: hidden ? "none" : "box-none",
			}) satisfies ViewStyle,
		button: (
			extended: boolean,
			disabled: boolean,
			{ className, style }: Pick<FloatingButtonProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row items-center justify-center rounded-floating-button",
				SIZE[size],
				extended && "px-5",
				SURFACE[variant][disabled ? "disabled" : "default"],
				!disabled && SURFACE[variant].pressed,
				!disabled && PRESS_SCALE,
				className,
			),
			style: [
				{ boxShadow: "0px 6px 16px hsla(0, 0%, 0%, 0.18)" },
				// Only the device knows the width of a hairline.
				variant === "tinted" && { borderWidth: metrics.hairline },
				style,
			],
		}),
		content: { className: "flex-row items-center gap-2" },
		tint: (pressed: boolean, disabled: boolean) => ({
			colorClassName: TINT[variant][disabled ? "disabled" : "default"],
		}),
		label: (pressed: boolean, disabled: boolean) => ({
			className: cx(
				"font-semibold",
				FOREGROUND[variant][disabled ? "disabled" : "default"],
			),
		}),
	};
}
