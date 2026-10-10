import { ActivityIndicator } from "react-native";

import { cx } from "@/theme";
import { Icon } from "@/components/ui/icon";

import type {
	ButtonProps,
	ButtonSize,
	ButtonState,
	ButtonVariant,
} from "./button";

// Every class is written whole, so Tailwind finds it. The colors and the radius are the button's own
// tokens, in `theme/components/button.css`: restyle the button there, or here for its layout.
const BASE = "flex-row items-center justify-center gap-2 rounded-button";

const SIZE: Record<ButtonSize, string> = {
	sm: "min-h-control-sm px-3",
	md: "min-h-control-md px-4",
	lg: "min-h-control-lg px-5",
};

// `pressed` is applied by the pressable itself, through `active:`.
const CONTAINER: Record<ButtonVariant, Record<ButtonState, string>> = {
	solid: {
		default: "bg-button-solid",
		pressed: "active:bg-button-solid-pressed",
		disabled: "bg-button-solid-disabled",
	},
	outline: {
		default: "border border-button-outline-border bg-button-outline",
		pressed: "active:bg-button-outline-pressed",
		disabled:
			"border border-button-outline-border-disabled bg-button-outline-disabled",
	},
	ghost: {
		default: "",
		pressed: "active:bg-button-ghost-pressed",
		disabled: "",
	},
	destructive: {
		default: "bg-button-destructive",
		pressed: "active:bg-button-destructive-pressed",
		disabled: "bg-button-destructive-disabled",
	},
};

// The same scale as `metrics.pressScale`.
const PRESS_SCALE = "active:scale-[0.97]";

const LABEL_SIZE: Record<ButtonSize, string> = {
	sm: "text-subheadline",
	md: "text-callout",
	lg: "text-headline",
};

const LABEL: Record<ButtonVariant, Record<ButtonState, string>> = {
	solid: {
		default: "text-button-solid-foreground",
		pressed: "text-button-solid-foreground-pressed",
		disabled: "text-button-solid-foreground-disabled",
	},
	outline: {
		default: "text-button-outline-foreground",
		pressed: "text-button-outline-foreground-pressed",
		disabled: "text-button-outline-foreground-disabled",
	},
	ghost: {
		default: "text-button-ghost-foreground",
		pressed: "text-button-ghost-foreground-pressed",
		disabled: "text-button-ghost-foreground-disabled",
	},
	destructive: {
		default: "text-button-destructive-foreground",
		pressed: "text-button-destructive-foreground-pressed",
		disabled: "text-button-destructive-foreground-disabled",
	},
};

// The spinner and the icon take their color as a prop. NativeWind gives it to both from a text
// color class: the label's.
export const ButtonSpinner = ActivityIndicator;
export const ButtonIcon = Icon;

export function useButtonStyles(
	variant: ButtonVariant,
	size: ButtonSize,
	fullWidth: boolean,
) {
	const layout = cx(
		BASE,
		SIZE[size],
		fullWidth ? "self-stretch" : "self-start",
	);

	return {
		container: (
			state: ButtonState,
			{ className }: Pick<ButtonProps, "className">,
		) => ({
			className: cx(layout, CONTAINER[variant][state], className),
		}),
		pressable: (
			disabled: boolean,
			{ className }: Pick<ButtonProps, "className">,
		) => ({
			className: cx(
				layout,
				CONTAINER[variant][disabled ? "disabled" : "default"],
				!disabled && CONTAINER[variant].pressed,
				!disabled && PRESS_SCALE,
				className,
			),
		}),
		text: (state: ButtonState) => ({
			className: cx(
				LABEL_SIZE[size],
				"font-semibold",
				LABEL[variant][state],
			),
		}),
		tint: (state: ButtonState) => ({ className: LABEL[variant][state] }),
		label: (hidden: boolean) => ({
			className: cx("shrink", hidden && "opacity-0"),
		}),
		spinnerOverlay: {
			className: "absolute inset-0 items-center justify-center",
		},
	};
}
