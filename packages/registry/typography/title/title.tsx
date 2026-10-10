import {
	Text as NativeText,
	type TextProps as NativeTextProps,
} from "react-native";

import { Slot } from "@/components/core/slot";
import { useTitleStyles } from "./title.styles";

export type TitleVariant =
	"display" | "headingLg" | "heading" | "headingSm" | "subheading";
export type TitleColor = "default" | "muted" | "inverse";

export type TitleAlign = "left" | "center" | "right";

export type TitleProps = NativeTextProps & {
	variant?: TitleVariant;
	color?: TitleColor;
	align?: TitleAlign;
	asChild?: boolean;
};

export function Title({
	variant = "heading",
	color = "default",
	align,
	asChild,
	accessibilityRole = "header",
	children,
	...props
}: TitleProps) {
	const styles = useTitleStyles();
	const title = styles.title(variant, color, align, props);

	if (asChild) {
		return (
			<Slot {...props} accessibilityRole={accessibilityRole} {...title}>
				{children}
			</Slot>
		);
	}

	return (
		<NativeText {...props} accessibilityRole={accessibilityRole} {...title}>
			{children}
		</NativeText>
	);
}
