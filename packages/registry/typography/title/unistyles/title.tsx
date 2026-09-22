import {
	Text as NativeText,
	type TextProps as NativeTextProps,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Slot } from "@/components/core/slot";
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

const VARIANT_TOKEN: Record<TitleVariant, TypographyVariant> = {
	display: "largeTitle",
	headingLg: "title1",
	heading: "title2",
	headingSm: "title3",
	subheading: "headline",
};

export function Title({
	variant = "heading",
	color = "default",
	align,
	asChild,
	accessibilityRole = "header",
	style,
	children,
	...props
}: TitleProps) {
	const titleStyle = [styles.title(variant, color, align), style];

	if (asChild) {
		return (
			<Slot
				{...props}
				accessibilityRole={accessibilityRole}
				style={titleStyle}
			>
				{children}
			</Slot>
		);
	}

	return (
		<NativeText
			{...props}
			accessibilityRole={accessibilityRole}
			style={titleStyle}
		>
			{children}
		</NativeText>
	);
}

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
