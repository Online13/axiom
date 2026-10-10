import { StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

import type {
	ScaffoldBackground,
	ScaffoldContentProps,
	ScaffoldFooterProps,
	ScaffoldKeyboardAvoidingProps,
	ScaffoldProps,
} from "./scaffold";

export function useScaffoldStyles() {
	const { tokens, colors } = useTheme();
	const insets = useSafeAreaInsets();
	const scheme = useColorScheme();

	return {
		// Whether the screen is drawn in the dark scheme, for the status bar.
		dark: scheme === "dark",
		root: (
			background: ScaffoldBackground,
			edges: Edge[],
			{ style }: Pick<ScaffoldProps, "style">,
		) => ({
			style: [
				styles.fill,
				{
					backgroundColor:
						background === "subtle"
							? colors.background.subtle
							: colors.background.default,
					paddingTop: edges.includes("top") ? insets.top : 0,
					paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
					paddingLeft: edges.includes("left") ? insets.left : 0,
					paddingRight: edges.includes("right") ? insets.right : 0,
				},
				style,
			],
		}),
		keyboardAvoiding: ({
			style,
		}: Pick<ScaffoldKeyboardAvoidingProps, "style">) => ({
			style: [styles.fill, style],
		}),
		content: ({ style }: Pick<ScaffoldContentProps, "style">) => ({
			style: [styles.fill, style],
		}),
		footer: (
			bordered: boolean,
			safeArea: boolean,
			{ style }: Pick<ScaffoldFooterProps, "style">,
		) => ({
			style: [
				{
					padding: tokens.metrics.screenMargin,
					paddingBottom:
						tokens.metrics.screenMargin + (safeArea ? insets.bottom : 0),
					gap: tokens.spacing[2],
					backgroundColor: colors.background.default,
					borderTopWidth: bordered ? StyleSheet.hairlineWidth : 0,
					borderTopColor: colors.border.subtle,
				},
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	fill: {
		flex: 1,
	},
});
