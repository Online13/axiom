import { useColorScheme } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type {
	ScaffoldBackground,
	ScaffoldContentProps,
	ScaffoldFooterProps,
	ScaffoldKeyboardAvoidingProps,
	ScaffoldProps,
} from "./scaffold";

export function useScaffoldStyles() {
	// The insets are numbers the device gives: they aren't classes.
	const insets = useSafeAreaInsets();
	const scheme = useColorScheme();

	return {
		// Whether the screen is drawn in the dark scheme, for the status bar.
		dark: scheme === "dark",
		root: (
			background: ScaffoldBackground,
			edges: Edge[],
			{ className, style }: Pick<ScaffoldProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-1",
				background === "subtle" ? "bg-background-subtle" : "bg-background",
				className,
			),
			style: [
				{
					paddingTop: edges.includes("top") ? insets.top : 0,
					paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
					paddingLeft: edges.includes("left") ? insets.left : 0,
					paddingRight: edges.includes("right") ? insets.right : 0,
				},
				style,
			],
		}),
		// Not a React Native component: it takes `style` only.
		keyboardAvoiding: ({
			style,
		}: Pick<ScaffoldKeyboardAvoidingProps, "style">) => ({
			style: [{ flex: 1 }, style],
		}),
		content: ({ className }: Pick<ScaffoldContentProps, "className">) => ({
			className: cx("flex-1", className),
		}),
		footer: (
			bordered: boolean,
			safeArea: boolean,
			{ className, style }: Pick<ScaffoldFooterProps, "className" | "style">,
		) => ({
			className: cx(
				"gap-2 border-t-border-subtle bg-background p-screen-margin",
				className,
			),
			style: [
				{
					paddingBottom:
						metrics.screenMargin + (safeArea ? insets.bottom : 0),
					// Only the device knows the width of a hairline.
					borderTopWidth: bordered ? metrics.hairline : 0,
				},
				style,
			],
		}),
	};
}
