import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	ScrollView,
	StatusBar,
	View,
	type ScrollViewProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import {
	KeyboardAvoidingView,
	type KeyboardAvoidingViewProps,
} from "react-native-keyboard-controller";
import type { Edge } from "react-native-safe-area-context";

import { AppBar, type AppBarProps } from "@/components/ui/app-bar";

import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type ScaffoldBackground = "default" | "subtle";

export type ScaffoldProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Screen regions, usually `AppBar`, `Content` and an optional `Footer`. */
	children?: ReactNode;
	/** Safe-area edges the screen owns, so its regions don't apply the same inset twice. */
	safeAreaEdges?: Edge[];
	/** The standard screen background, or the grouped-list one. */
	background?: ScaffoldBackground;
	/** `auto` follows the resolved color scheme. */
	statusBarStyle?: "auto" | "light" | "dark";
	style?: StyleProp<ViewStyle>;
};

function ScaffoldRoot({
	children,
	safeAreaEdges = ["top", "bottom"],
	background = "default",
	statusBarStyle = "auto",
	...props
}: ScaffoldProps) {
	const { rt } = useUnistyles();

	// `auto` means readable on the current background: dark glyphs on a light screen.
	const resolved =
		statusBarStyle === "auto"
			? rt.themeName === "dark"
				? "light"
				: "dark"
			: statusBarStyle;

	return (
		<View
			{...props}
			style={[styles.root(background, safeAreaEdges), props.style]}
		>
			<StatusBar
				barStyle={resolved === "light" ? "light-content" : "dark-content"}
			/>
			{children}
		</View>
	);
}

export type ScaffoldKeyboardAvoidingProps = KeyboardAvoidingViewProps;

/**
 * Wrap the Content and the Footer of a screen with a field: the footer rises above the keyboard and
 * the content keeps its room. Screens without a field leave it out.
 */
function ScaffoldKeyboardAvoiding({
	behavior = "padding",
	...props
}: ScaffoldKeyboardAvoidingProps) {
	return (
		<KeyboardAvoidingView
			{...props}
			behavior={behavior}
			style={[styles.fill, props.style]}
		/>
	);
}

export type ScaffoldAppBarProps = Omit<AppBarProps, "safeArea">;

/** The bar of the screen. The root already owns the top inset, so the bar doesn't add it again. */
function ScaffoldAppBar(props: ScaffoldAppBarProps) {
	return <AppBar {...props} safeArea={false} />;
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
	...props
}: ScaffoldContentProps) {
	if (!scrollable)
		return <View style={[styles.fill, props.style]}>{children}</View>;

	return (
		<ScrollView
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			contentContainerStyle={contentContainerStyle}
			{...props}
			style={[styles.fill, props.style]}
		>
			{children}
		</ScrollView>
	);
}

export type ScaffoldFooterProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
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
	...props
}: ScaffoldFooterProps) {
	return (
		<View {...props} style={[styles.footer(bordered, safeArea), props.style]}>
			{children}
		</View>
	);
}

export const Scaffold = Object.assign(ScaffoldRoot, {
	AppBar: ScaffoldAppBar,
	Content: ScaffoldContent,
	Footer: ScaffoldFooter,
	KeyboardAvoiding: ScaffoldKeyboardAvoiding,
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
			theme.tokens.metrics.screenMargin + (safeArea ? rt.insets.bottom : 0),
		gap: theme.tokens.spacing[2],
		backgroundColor: theme.colors.background.default,
		borderTopWidth: bordered ? StyleSheet.hairlineWidth : 0,
		borderTopColor: theme.colors.border.subtle,
	}),
}));
