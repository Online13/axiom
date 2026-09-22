import type { ReactNode } from "react";
import {
	ScrollView,
	StatusBar,
	View,
	type ScrollViewProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { Edge } from "react-native-safe-area-context";

import { AppBar, type AppBarProps } from "@/components/ui/app-bar";

export type ScaffoldBackground = "default" | "subtle";

export type ScaffoldProps = {
	/** Screen regions, usually `AppBar`, `Content` and an optional `Footer`. */
	children?: ReactNode;
	/** Safe-area edges the screen owns, so its regions don't apply the same inset twice. */
	safeAreaEdges?: Edge[];
	/** The standard screen background, or the grouped-list one. */
	background?: ScaffoldBackground;
	/** Moves the footer above the keyboard and leaves the content its room. */
	keyboardAvoiding?: boolean;
	/** `auto` follows the resolved color scheme. */
	statusBarStyle?: "auto" | "light" | "dark";
	style?: StyleProp<ViewStyle>;
};

function ScaffoldRoot({
	children,
	safeAreaEdges = ["top", "bottom"],
	background = "default",
	keyboardAvoiding = true,
	statusBarStyle = "auto",
	style,
}: ScaffoldProps) {
	// The status bar follows the active Unistyles theme, so a forced theme stays readable even when
	// it differs from the system color scheme. This is the theme-in-logic case.
	const { rt } = useUnistyles();

	// `auto` means readable on the current background: dark glyphs on a light screen.
	const resolved =
		statusBarStyle === "auto"
			? rt.themeName === "dark"
				? "light"
				: "dark"
			: statusBarStyle;

	return (
		<View style={[styles.root(background, safeAreaEdges), style]}>
			<StatusBar
				barStyle={resolved === "light" ? "light-content" : "dark-content"}
			/>
			{keyboardAvoiding ? (
				<KeyboardAvoidingView behavior="padding" style={styles.fill}>
					{children}
				</KeyboardAvoidingView>
			) : (
				children
			)}
		</View>
	);
}

export type ScaffoldAppBarProps = Omit<AppBarProps, "children" | "safeArea"> & {
	/** Shortcut for a standard compact bar. */
	title?: string;
	leading?: ReactNode;
	actions?: ReactNode;
	/** The compound slots, when `title` isn't enough. */
	children?: ReactNode;
};

/** The bar of the screen. The root already owns the top inset, so the bar doesn't add it again. */
function ScaffoldAppBar({
	title,
	leading,
	actions,
	children,
	...props
}: ScaffoldAppBarProps) {
	return (
		<AppBar safeArea={false} {...props}>
			{children ?? (
				<>
					{leading ? <AppBar.Leading>{leading}</AppBar.Leading> : null}
					{title ? <AppBar.Title>{title}</AppBar.Title> : null}
					{actions ? <AppBar.Actions>{actions}</AppBar.Actions> : null}
				</>
			)}
		</AppBar>
	);
}

export type ScaffoldContentProps = Omit<ScrollViewProps, "children"> & {
	children?: ReactNode;
	/** `false` for a list, a map or another child that owns its scrolling. */
	scrollable?: boolean;
};

function ScaffoldContent({
	children,
	scrollable = true,
	contentContainerStyle,
	keyboardShouldPersistTaps = "handled",
	style,
	...props
}: ScaffoldContentProps) {
	if (!scrollable) return <View style={[styles.fill, style]}>{children}</View>;

	return (
		<ScrollView
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			contentContainerStyle={contentContainerStyle}
			style={[styles.fill, style]}
			{...props}
		>
			{children}
		</ScrollView>
	);
}

export type ScaffoldFooterProps = {
	/** Fixed actions after the content region. */
	children?: ReactNode;
	/** Hairline above the footer, when content scrolls behind it. */
	bordered?: boolean;
	/** Adds the bottom safe-area inset here. Leave it off when the root already owns that edge. */
	safeArea?: boolean;
	style?: StyleProp<ViewStyle>;
};

function ScaffoldFooter({
	children,
	bordered = false,
	safeArea = false,
	style,
}: ScaffoldFooterProps) {
	return (
		<View style={[styles.footer(bordered, safeArea), style]}>
			{children}
		</View>
	);
}

export const Scaffold = Object.assign(ScaffoldRoot, {
	AppBar: ScaffoldAppBar,
	Content: ScaffoldContent,
	Footer: ScaffoldFooter,
});

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
			theme.tokens.metrics.screenMargin +
			(safeArea ? rt.insets.bottom : 0),
		gap: theme.tokens.spacing[2],
		backgroundColor: theme.colors.background.default,
		borderTopWidth: bordered ? StyleSheet.hairlineWidth : 0,
		borderTopColor: theme.colors.border.subtle,
	}),
}));
