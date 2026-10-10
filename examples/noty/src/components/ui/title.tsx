import {
	Text as NativeText,
	type TextProps as NativeTextProps,
} from "react-native";

import { Slot } from "@/components/core/slot";
import { StyleSheet } from "react-native-unistyles";
import type { TypographyVariant } from "@/theme";

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
	const title = { style: [styles.title(variant, color, align), props.style] };

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

const VARIANT_TOKEN: Record<TitleVariant, TypographyVariant> = {
	display: "largeTitle",
	headingLg: "title1",
	heading: "title2",
	headingSm: "title3",
	subheading: "headline",
};

const styles = StyleSheet.create((theme) => ({
	title: (
		variant: TitleVariant,
		color: TitleColor,
		align: TitleAlign | undefined,
	) => ({
		...theme.tokens.typography[VARIANT_TOKEN[variant]],
		color: theme.colors.content[color],
		...(align && { textAlign: align }),
	}),
}));
