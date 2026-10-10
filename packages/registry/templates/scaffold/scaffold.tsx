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

import { useScaffoldStyles } from "./scaffold.styles";

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
	const styles = useScaffoldStyles();

	// `auto` means readable on the current background: dark glyphs on a light screen.
	const resolved =
		statusBarStyle === "auto"
			? styles.dark
				? "light"
				: "dark"
			: statusBarStyle;

	return (
		<View {...props} {...styles.root(background, safeAreaEdges, props)}>
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
	const styles = useScaffoldStyles();

	return (
		<KeyboardAvoidingView
			{...props}
			behavior={behavior}
			{...styles.keyboardAvoiding(props)}
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
	const styles = useScaffoldStyles();

	if (!scrollable) return <View {...styles.content(props)}>{children}</View>;

	return (
		<ScrollView
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			contentContainerStyle={contentContainerStyle}
			{...props}
			{...styles.content(props)}
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
	const styles = useScaffoldStyles();

	return (
		<View {...props} {...styles.footer(bordered, safeArea, props)}>
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
