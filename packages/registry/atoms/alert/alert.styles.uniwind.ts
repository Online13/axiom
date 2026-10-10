import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type { AlertActionProps, AlertProps, AlertVariant } from "./alert";

// Every class is written whole, so Tailwind finds it. The colors are the alert's own tokens, in
// `theme/components/alert.css`.
const SURFACE: Record<AlertVariant, string> = {
	info: "bg-alert-info",
	success: "bg-alert-success",
	warning: "bg-alert-warning",
	error: "bg-alert-error",
	neutral: "bg-alert-neutral border-alert-neutral-border",
};

// The color of the icon, which the action takes too.
const ACCENT: Record<AlertVariant, string> = {
	info: "text-alert-info-icon",
	success: "text-alert-success-icon",
	warning: "text-alert-warning-icon",
	error: "text-alert-error-icon",
	neutral: "text-alert-neutral-icon",
};

// The same again, as the `accent-` classes Uniwind reads a color prop from.
const TINT: Record<AlertVariant, string> = {
	info: "accent-alert-info-icon",
	success: "accent-alert-success-icon",
	warning: "accent-alert-warning-icon",
	error: "accent-alert-error-icon",
	neutral: "accent-alert-neutral-icon",
};

// The icon takes its color as a prop. Uniwind gives it from `colorClassName`, which the icon gets
// by being wrapped.
export const AlertIcon = withUniwind(Icon);

export function useAlertStyles() {
	return {
		container: (
			variant: AlertVariant,
			dismissible: boolean,
			{ className, style }: Pick<AlertProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row items-start gap-3 rounded-lg p-4",
				dismissible && "pe-2",
				SURFACE[variant],
				className,
			),
			style: [
				// Only `neutral` has a border, and only the device knows the width of a hairline.
				variant === "neutral" && { borderWidth: metrics.hairline },
				style,
			],
		}),
		tint: (variant: AlertVariant) => ({
			colorClassName: TINT[variant],
		}),
		body: { className: "flex-1 gap-1" },
		dismiss: { className: "mt-[-6px]" },
		action: ({ className }: Pick<AlertActionProps, "className">) => ({
			className: cx("mt-1 self-start", className),
		}),
		actionLabel: (variant: AlertVariant) => ({
			className: cx("font-semibold", ACCENT[variant]),
		}),
	};
}
