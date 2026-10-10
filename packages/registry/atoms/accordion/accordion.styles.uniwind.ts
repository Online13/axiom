import type { ViewStyle } from "react-native";

import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import type { AccordionContentProps, AccordionTriggerProps } from "./accordion";

export function useAccordionStyles() {
	return {
		// Taller than a touch target by one step of spacing: a number, so it stays a style.
		trigger: ({
			className,
			style,
		}: Pick<AccordionTriggerProps, "className" | "style">) => ({
			className: cx(
				"flex-row items-center gap-3 py-3 active:opacity-60",
				className,
			),
			style: [{ minHeight: metrics.touchTarget + spacing[2] }, style],
		}),
		title: { className: "flex-1" },
		// An animated view takes `style` only.
		clip: { overflow: "hidden" } satisfies ViewStyle,
		// Absolute, so the content keeps its natural height while its container animates.
		measure: ({ className }: Pick<AccordionContentProps, "className">) => ({
			className: cx("absolute left-0 right-0 top-0 pb-4", className),
		}),
	};
}
