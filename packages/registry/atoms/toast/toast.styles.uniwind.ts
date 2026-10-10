import type { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type { ToastType } from "./use-toast";

// Every class is written whole, so Tailwind finds it. The colors are the toast's own tokens, in
// `theme/components/toast.css`. `default` and `loading` share the default ones.
const SURFACE: Record<ToastType, string> = {
	default: "border-toast-border bg-toast",
	loading: "border-toast-border bg-toast",
	success: "border-toast-border-success bg-toast-success",
	error: "border-toast-border-error bg-toast-error",
	info: "border-toast-border-info bg-toast-info",
};

const ICON: Record<ToastType, string> = {
	default: "accent-toast-icon",
	loading: "accent-toast-icon",
	success: "accent-toast-icon-success",
	error: "accent-toast-icon-error",
	info: "accent-toast-icon-info",
};

// The icon takes its color as a prop. Uniwind reads it from the `accent-` class of
// `colorClassName`, which the icon gets by being wrapped.
export const ToastIcon = withUniwind(Icon);

export function useToastStyles() {
	// The top inset is a number the device gives: it isn't a class.
	const insets = useSafeAreaInsets();

	return {
		// The space between two toasts of an expanded stack: a number, the offsets are computed with it.
		gap: spacing[2],
		container: (offset: number) => ({
			className: "absolute",
			style: {
				pointerEvents: "box-none" as const,
				top: insets.top + offset,
				left: metrics.screenMargin,
				right: metrics.screenMargin,
			},
		}),
		// An animated view takes `style` only.
		toast: (hidden: boolean) =>
			({
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				alignItems: "center",
				pointerEvents: hidden ? "none" : "auto",
			}) satisfies ViewStyle,
		// A toast with a description is a rounded card; without one, a pill.
		surface: (type: ToastType, described: boolean) => ({
			className: cx(
				"max-w-full flex-row items-center gap-3 px-4 py-3",
				described ? "rounded-xl" : "rounded-full",
				SURFACE[type],
			),
			style: {
				boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.12)",
				// Only the device knows the width of a hairline.
				borderWidth: metrics.hairline,
			},
		}),
		tint: (type: ToastType) => ({ colorClassName: ICON[type] }),
		text: { className: "shrink gap-[2px]" },
	};
}
