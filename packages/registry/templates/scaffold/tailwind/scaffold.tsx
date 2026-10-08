import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	ScrollView,
	StatusBar,
	useColorScheme,
	View,
	type ScrollViewProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import {
	KeyboardAvoidingView,
	type KeyboardAvoidingViewProps,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

import { AppBar, type AppBarProps } from "@/components/ui/app-bar";
import { cx, useTheme } from "@/theme";

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
	className,
	style,
	...props
}: ScaffoldProps) {
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();
	const scheme = useColorScheme();

	// `auto` means readable on the current background: dark glyphs on a light screen.
	const resolved =
		statusBarStyle === "auto"
			? scheme === "dark"
				? "light"
				: "dark"
			: statusBarStyle;

	const container = [
		{
			backgroundColor:
				background === "subtle"
					? colors.background.subtle
					: colors.background.default,
			paddingTop: safeAreaEdges.includes("top") ? insets.top : 0,
			paddingBottom: safeAreaEdges.includes("bottom") ? insets.bottom : 0,
			paddingLeft: safeAreaEdges.includes("left") ? insets.left : 0,
			paddingRight: safeAreaEdges.includes("right") ? insets.right : 0,
		},
		style,
	];

	return (
		<View {...props} className={cx("flex-1", className)} style={container}>
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
	style,
	...props
}: ScaffoldKeyboardAvoidingProps) {
	return (
		<KeyboardAvoidingView
			{...props}
			behavior={behavior}
			style={[{ flex: 1 }, style]}
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
	className,
	style,
	...props
}: ScaffoldContentProps) {
	if (!scrollable)
		return (
			<View className={cx("flex-1", className)} style={style}>
				{children}
			</View>
		);

	return (
		<ScrollView
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			contentContainerStyle={contentContainerStyle}
			className={cx("flex-1", className)}
			style={style}
			{...props}
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
	style,
	...props
}: ScaffoldFooterProps) {
	const { tokens, colors } = useTheme();
	const insets = useSafeAreaInsets();

	return (
		<View
			{...props}
			style={[
				{
					padding: tokens.metrics.screenMargin,
					paddingBottom:
						tokens.metrics.screenMargin + (safeArea ? insets.bottom : 0),
					gap: tokens.spacing[2],
					backgroundColor: colors.background.default,
					borderTopWidth: bordered ? tokens.metrics.hairline : 0,
					borderTopColor: colors.border.subtle,
				},
				style,
			]}
		>
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
