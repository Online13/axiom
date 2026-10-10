import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type { ButtonGroupProps } from "./button-group";

export function useButtonGroupStyles() {
	return {
		group: (
			orientation: "horizontal" | "vertical",
			bordered: boolean,
			radius: number | undefined,
			{ className, style }: Pick<ButtonGroupProps, "className" | "style">,
		) => ({
			className: cx(
				"self-start overflow-hidden",
				orientation === "horizontal" ? "flex-row" : "flex-col",
				// The button's own radius, from its CSS tokens.
				radius === undefined && "rounded-button",
				bordered && "border-border",
				className,
			),
			style: [
				radius !== undefined && { borderRadius: radius },
				// Only the device knows the width of a hairline.
				bordered && { borderWidth: metrics.hairline },
				style,
			],
		}),
	};
}
