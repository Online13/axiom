import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { textColor, type TextColor } from "@/components/ui/text";
import type { Theme } from "@/theme";

import type { SpinnerProps, SpinnerSize } from "./spinner";

const dimensionOf = (tokens: Theme["tokens"], size: SpinnerSize) =>
	typeof size === "number" ? size : tokens.sizes.icon[size];

// The ring, which turns: with styles, the animated view takes them all.
export const SpinnerRing = Animated.View;

export function useSpinnerStyles(size: SpinnerSize, color: TextColor) {
	return {
		frame: (visible: boolean, { style }: Pick<SpinnerProps, "style">) => ({
			style: [styles.frame(size, visible), style],
		}),
		ring: {},
		spin: styles.ring(size, color),
	};
}

const styles = StyleSheet.create((theme) => ({
	frame: (size: SpinnerSize, visible: boolean) => {
		const dimension = dimensionOf(theme.tokens, size);
		return {
			width: dimension,
			height: dimension,
			opacity: visible ? 1 : 0,
		};
	},
	ring: (size: SpinnerSize, color: TextColor) => {
		const dimension = dimensionOf(theme.tokens, size);
		return {
			flex: 1,
			borderRadius: dimension / 2,
			borderWidth: Math.max(2, Math.round(dimension / 10)),
			borderColor: textColor(theme.colors, color),
			// One transparent side draws the gap of the ring.
			borderTopColor: "transparent",
		};
	},
}));
