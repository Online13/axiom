import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { textColor, type TextColor } from "@/components/ui/text";
import { useTheme } from "@/theme";

import type { SpinnerProps, SpinnerSize } from "./spinner";

// The ring, which turns: with styles, the animated view takes them all.
export const SpinnerRing = Animated.View;

export function useSpinnerStyles(size: SpinnerSize, color: TextColor) {
	const { tokens, colors } = useTheme();
	const dimension = typeof size === "number" ? size : tokens.sizes.icon[size];

	return {
		frame: (visible: boolean, { style }: Pick<SpinnerProps, "style">) => ({
			style: [
				{ width: dimension, height: dimension, opacity: visible ? 1 : 0 },
				style,
			],
		}),
		ring: {},
		spin: [
			styles.ring,
			{
				borderRadius: dimension / 2,
				borderWidth: Math.max(2, Math.round(dimension / 10)),
				borderColor: textColor(colors, color),
			},
		],
	};
}

const styles = StyleSheet.create({
	// One transparent side draws the gap of the ring.
	ring: {
		flex: 1,
		borderTopColor: "transparent",
	},
});
