import { StyleSheet } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import type { Radius } from "@/theme";

import type {
	CardPadding,
	CardPartProps,
	CardProps,
	CardVariant,
} from "./card";
import { stateColors } from "@/theme/components/states";

export function useCardStyles() {
	return {
		card: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ style }: Pick<CardProps, "style">,
		) => ({
			style: [styles.card(variant, padding, radius, false, disabled), style],
		}),
		pressable: (
			variant: CardVariant,
			padding: CardPadding,
			radius: keyof Radius,
			disabled: boolean,
			{ style }: Pick<CardProps, "style">,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.card(variant, padding, radius, pressed, disabled),
				style,
			],
		}),
		media: (aspectRatio: number, { style }: Pick<CardProps, "style">) => ({
			style: [styles.media(aspectRatio), style],
		}),
		mediaImage: { style: styles.mediaImage },
		mediaOverlay: { style: styles.mediaOverlay },
		header: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [styles.header, style],
		}),
		content: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [styles.part, style],
		}),
		footer: ({ style }: Pick<CardPartProps, "style">) => ({
			style: [styles.footer, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	card: (
		variant: CardVariant,
		padding: CardPadding,
		radius: keyof Radius,
		pressed: boolean,
		disabled: boolean,
	) => {
		const colors = stateColors(
			theme.components.card[variant],
			pressed && "pressed",
		);
		return {
			overflow: "hidden",
			borderRadius: theme.tokens.radius[radius],
			backgroundColor: colors.background,
			borderWidth: colors.border ? theme.tokens.metrics.hairline : 0,
			borderColor: colors.border,
			// The sub-components pad their top; the card pads the bottom of the last one.
			paddingBottom:
				padding === "none" ? theme.tokens.spacing[4] : undefined,
			padding:
				padding === "none" ? undefined : theme.tokens.spacing[padding],
			...(variant === "elevated" && {
				boxShadow:
					"0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)",
			}),
			...(disabled && { opacity: 0.5 }),
		};
	},
	media: (aspectRatio: number) => ({ aspectRatio }),
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	mediaImage: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
	// The sub-components pad their own top and sides; the card pads the bottom of the last one.
	part: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
	},
	header: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
		gap: theme.tokens.spacing[1],
	},
	footer: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[2],
	},
}));
