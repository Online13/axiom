import type { ViewProps } from "react-native";
import { withUniwind } from "uniwind";

import { cx } from "@/theme";

import type { IconColor, IconSize } from "./icon";
import type { IconComponent } from "./icon-types";

const FRAME: Record<IconSize, string> = {
	sm: "size-icon-sm",
	md: "size-icon-md",
	lg: "size-icon-lg",
};

const GLYPH: Record<IconSize, string> = {
	sm: "w-icon-sm",
	md: "w-icon-md",
	lg: "w-icon-lg",
};

const COLOR: Record<IconColor, string> = {
	default: "accent-content",
	muted: "accent-content-muted",
	subtle: "accent-content-subtle",
	disabled: "accent-content-disabled",
	inverse: "accent-content-inverse",
	link: "accent-content-link",
	info: "accent-feedback-info",
	success: "accent-feedback-success",
	warning: "accent-feedback-warning",
	error: "accent-feedback-error",
};

type GlyphProps = {
	glyph: IconComponent;
	size?: number;
	color?: string;
	strokeWidth?: number;
};

function Glyph({
	glyph: Component,
	size = 0,
	color = "",
	strokeWidth,
}: GlyphProps) {
	return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}

// A glyph takes its size and its color as props, not as styles: Uniwind reads them from the
// classes, the width of `w-icon-md` as `size` and the color of `accent-content` as `color`.
export const IconGlyph = withUniwind(Glyph, {
	size: { fromClassName: "sizeClassName", styleProperty: "width" },
	color: { fromClassName: "colorClassName", styleProperty: "accentColor" },
});

export function useIconStyles(
	size: IconSize | number,
	color: IconColor | (string & {}),
) {
	return {
		frame: ({
			className,
			style,
		}: Pick<ViewProps, "className" | "style">) => ({
			className: cx(
				"items-center justify-center",
				typeof size !== "number" && FRAME[size],
				className,
			),
			style: [
				typeof size === "number" && { width: size, height: size },
				style,
			],
		}),
		// A theme color and a size token are classes; a raw color and a number are given as they are.
		glyph: {
			sizeClassName: typeof size === "number" ? undefined : GLYPH[size],
			colorClassName: color in COLOR ? COLOR[color as IconColor] : undefined,
			size: typeof size === "number" ? size : undefined,
			color: color in COLOR ? undefined : color,
		},
	};
}
