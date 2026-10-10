import { StyleSheet, type ViewStyle } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { useTheme, type Radius, type Theme } from "@/theme";

import type {
	CardPadding,
	CardPartProps,
	CardProps,
	CardVariant,
} from "./card";
import { stateColors } from "@/theme/components/states";

export function useCardStyles() {
	const theme = useTheme();
	const { tokens } = theme;

	return {
		card: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ style }: Pick<CardProps, "style">,
		) => ({
			style: [
				styles.card,
				surfaceStyle(theme, variant, padding, radius, false),
				variant === "elevated" && styles.shadow,
				disabled && styles.disabled,
				style,
			],
		}),
		pressable: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ style }: Pick<CardProps, "style">,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.card,
				surfaceStyle(theme, variant, padding, radius, pressed),
				variant === "elevated" && styles.shadow,
				disabled && styles.disabled,
				style,
			],
		}),
		media: (aspectRatio: number, { style }: Pick<CardProps, "style">) => ({
			style: [{ aspectRatio }, style],
		}),
		mediaImage: { style: styles.mediaImage },
		mediaOverlay: {
			style: [styles.mediaOverlay, { padding: tokens.spacing[3] }],
		},
		// The sub-components pad their own top and sides; the card pads the bottom of the last one.
		header: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [
				{
					paddingHorizontal: tokens.spacing[4],
					paddingTop: tokens.spacing[4],
					gap: tokens.spacing[1],
				},
				style,
			],
		}),
		content: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [
				{
					paddingHorizontal: tokens.spacing[4],
					paddingTop: tokens.spacing[4],
				},
				style,
			],
		}),
		footer: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [
				styles.footer,
				{
					paddingHorizontal: tokens.spacing[4],
					paddingTop: tokens.spacing[4],
					gap: tokens.spacing[2],
				},
				style,
			],
		}),
	};
}

function surfaceStyle(
	{ tokens, components }: Theme,
	variant: CardVariant,
	padding: CardPadding,
	radius: keyof Radius,
	pressed: boolean,
): ViewStyle {
	const colors = stateColors(components.card[variant], pressed && "pressed");
	return {
		borderRadius: tokens.radius[radius],
		backgroundColor: colors.background,
		borderWidth: colors.border ? tokens.metrics.hairline : 0,
		borderColor: colors.border,
		// The sub-components pad their top; the card pads the bottom of the last one.
		paddingBottom: padding === "none" ? tokens.spacing[4] : undefined,
		padding: padding === "none" ? undefined : tokens.spacing[padding],
	};
}

const styles = StyleSheet.create({
	card: {
		overflow: "hidden",
	},
	shadow: {
		boxShadow:
			"0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)",
	},
	disabled: {
		opacity: 0.5,
	},
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	mediaImage: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
	},
	footer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
});
