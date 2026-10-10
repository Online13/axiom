import { cssInterop } from "nativewind";
import type { ViewProps } from "react-native";

import { cx } from "@/theme";

import { Icon, type IconColor, type IconSize } from "./icon";
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
	default: "text-content",
	muted: "text-content-muted",
	subtle: "text-content-subtle",
	disabled: "text-content-disabled",
	inverse: "text-content-inverse",
	link: "text-content-link",
	info: "text-feedback-info",
	success: "text-feedback-success",
	warning: "text-feedback-warning",
	error: "text-feedback-error",
};

type IconGlyphProps = {
	glyph: IconComponent;
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
};

export function IconGlyph({
	glyph: Glyph,
	size = 0,
	color = "",
	strokeWidth,
}: IconGlyphProps) {
	return <Glyph size={size} color={color} strokeWidth={strokeWidth} />;
}

// A glyph takes its size and its color as props, not as styles: NativeWind reads them from the
// classes, the width of `w-icon-md` as `size` and the color of `text-content` as `color`.
cssInterop(IconGlyph, {
	className: {
		target: false,
		nativeStyleToProp: { color: true, width: "size" },
	},
});

// The same for the icon itself: `<Icon className="text-primary" />` sets its color.
cssInterop(Icon, {
	className: { target: "style", nativeStyleToProp: { color: true } },
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
			className: cx(
				typeof size !== "number" && GLYPH[size],
				color in COLOR && COLOR[color as IconColor],
			),
			size: typeof size === "number" ? size : undefined,
			color: color in COLOR ? undefined : color,
		},
	};
}
