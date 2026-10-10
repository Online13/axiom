import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type {
	ToolBarActionProps,
	ToolBarJustify,
	ToolBarPlacement,
	ToolBarProps,
	ToolBarSeparatorProps,
} from "./tool-bar";

// Every class is written whole, so Tailwind finds it. The colors are the tool bar's own tokens, in
// `theme/components/tool-bar.css`.
const JUSTIFY: Record<ToolBarJustify, string> = {
	start: "justify-start",
	center: "justify-center",
	between: "justify-between",
	around: "justify-around",
};

// Later states win: destructive, then disabled.
const content = (destructive: boolean, disabled: boolean) =>
	disabled
		? "text-tool-bar-action-content-disabled"
		: destructive
			? "text-tool-bar-action-content-destructive"
			: "text-tool-bar-action-content";

// The icon takes its color as a prop. NativeWind gives it from a text color class: the label's.
export const ToolBarIcon = Icon;

export function useToolBarStyles() {
	// The bottom inset is a number the device gives: it isn't a class.
	const insets = useSafeAreaInsets();

	return {
		bar: (
			placement: ToolBarPlacement,
			safeArea: boolean,
			justify: ToolBarJustify,
			{ className, style }: Pick<ToolBarProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row items-center gap-1 px-2 pt-2",
				JUSTIFY[justify],
				placement === "floating"
					? "mx-screen-margin rounded-full border-tool-bar-floating-border bg-tool-bar-floating"
					: "border-tool-bar-docked-border bg-tool-bar-docked",
				className,
			),
			style: [
				// Only the device knows the width of a hairline. A docked bar adds the inset to its
				// padding; a floating one keeps it as a margin.
				placement === "floating"
					? {
							borderWidth: metrics.hairline,
							borderCurve: "continuous" as const,
							paddingBottom: spacing[2],
							marginBottom: safeArea ? insets.bottom + spacing[2] : 0,
						}
					: {
							borderTopWidth: metrics.hairline,
							paddingBottom: spacing[2] + (safeArea ? insets.bottom : 0),
						},
				style,
			],
		}),
		action: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
			{ className }: Pick<ToolBarActionProps, "className">,
		) => ({
			className: cx(
				"min-h-touch-target items-center justify-center gap-[2px] rounded-md px-3 py-1",
				selected && "bg-tool-bar-action-selected",
				className,
			),
		}),
		tint: (selected: boolean, destructive: boolean, disabled: boolean) => ({
			className: content(destructive, disabled),
		}),
		actionLabel: (
			selected: boolean,
			destructive: boolean,
			disabled: boolean,
		) => ({ className: content(destructive, disabled) }),
		separator: (
			placement: ToolBarPlacement,
			{
				className,
				style,
			}: Pick<ToolBarSeparatorProps, "className" | "style">,
		) => ({
			className: cx(
				"h-[24px] self-center",
				placement === "floating"
					? "bg-tool-bar-floating-separator"
					: "bg-tool-bar-docked-separator",
				className,
			),
			style: [{ width: metrics.hairline }, style],
		}),
	};
}
