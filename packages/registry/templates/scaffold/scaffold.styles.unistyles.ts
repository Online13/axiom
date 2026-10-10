import type { Edge } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type {
	ScaffoldBackground,
	ScaffoldContentProps,
	ScaffoldFooterProps,
	ScaffoldKeyboardAvoidingProps,
	ScaffoldProps,
} from "./scaffold";

export function useScaffoldStyles() {
	// The status bar follows the active Unistyles theme, so a forced theme stays readable even when
	// it differs from the system color scheme. This is the theme-in-logic case.
	const { rt } = useUnistyles();

	return {
		dark: rt.themeName === "dark",
		root: (
			background: ScaffoldBackground,
			edges: Edge[],
			{ style }: Pick<ScaffoldProps, "style">,
		) => ({ style: [styles.root(background, edges), style] }),
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
		) => ({ style: [styles.footer(bordered, safeArea), style] }),
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	root: (background: ScaffoldBackground, edges: Edge[]) => ({
		flex: 1,
		backgroundColor:
			background === "subtle"
				? theme.colors.background.subtle
				: theme.colors.background.default,
		paddingTop: edges.includes("top") ? rt.insets.top : 0,
		paddingBottom: edges.includes("bottom") ? rt.insets.bottom : 0,
		paddingLeft: edges.includes("left") ? rt.insets.left : 0,
		paddingRight: edges.includes("right") ? rt.insets.right : 0,
	}),
	fill: {
		flex: 1,
	},
	footer: (bordered: boolean, safeArea: boolean) => ({
		padding: theme.tokens.metrics.screenMargin,
		paddingBottom:
			theme.tokens.metrics.screenMargin + (safeArea ? rt.insets.bottom : 0),
		gap: theme.tokens.spacing[2],
		backgroundColor: theme.colors.background.default,
		borderTopWidth: bordered ? StyleSheet.hairlineWidth : 0,
		borderTopColor: theme.colors.border.subtle,
	}),
}));
