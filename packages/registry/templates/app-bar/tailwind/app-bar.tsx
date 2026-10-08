import type { ComponentPropsWithRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";
import { cx, useTheme } from "@/theme";

/** Height of `AppBar.Row`. */
export const APP_BAR_HEIGHT = 64;

export type AppBarTitleSize = "small" | "medium" | "large";

export type AppBarProps = ComponentPropsWithRef<typeof View> & {
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
};

/** The surface of the bar: background, top inset and hairline. What goes inside is yours. */
function AppBarRoot({
	bordered = false,
	safeArea = true,
	style,
	...props
}: AppBarProps) {
	const { components, tokens } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.appBar.default.default;

	return (
		<View
			{...props}
			style={[
				{
					paddingTop: safeArea ? insets.top : 0,
					backgroundColor: colors.background,
					borderBottomWidth: bordered ? tokens.metrics.hairline : 0,
					borderBottomColor: colors.border,
				},
				style,
			]}
		/>
	);
}

/** The row of controls. Its children are laid out in the order you write them. */
function AppBarRow({
	className,
	style,
	...props
}: ComponentPropsWithRef<typeof View>) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			className={cx("flex-row items-center", className)}
			style={[
				{
					height: APP_BAR_HEIGHT,
					paddingHorizontal: tokens.spacing[1],
					gap: tokens.spacing[1],
				},
				style,
			]}
		/>
	);
}

export type AppBarCenterProps = ComponentPropsWithRef<typeof View> & {
	/** Lines the start up with the screen margin, for a row without a leading control. */
	inset?: boolean;
};

/** Fills the row between the controls: a title, a search field, a picker. Empty, it pushes the actions to the end. */
function AppBarCenter({
	inset = false,
	className,
	style,
	...props
}: AppBarCenterProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			className={cx("flex-1 justify-center", className)}
			style={[
				{
					minWidth: 0,
					paddingStart: inset
						? tokens.metrics.screenMargin - tokens.spacing[1]
						: tokens.spacing[1],
					paddingEnd: tokens.spacing[1],
				},
				style,
			]}
		/>
	);
}

/** The block under the row, for a medium or large title. */
function AppBarExpanded({
	style,
	...props
}: ComponentPropsWithRef<typeof View>) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[
				{
					gap: tokens.spacing[1],
					paddingHorizontal: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[4],
				},
				style,
			]}
		/>
	);
}

const TITLE_VARIANT = {
	small: "heading",
	medium: "headingLg",
	large: "display",
} as const;

const SUBTITLE_VARIANT = {
	small: "caption",
	medium: "footnote",
	large: "bodySm",
} as const;

export type AppBarTitleProps = Omit<TitleProps, "variant"> & {
	/** `small` in the row, `medium` or `large` in `AppBar.Expanded`. */
	size?: AppBarTitleSize;
};

function AppBarTitle({
	size = "small",
	numberOfLines = size === "small" ? 1 : 2,
	style,
	...props
}: AppBarTitleProps) {
	const { components } = useTheme();
	return (
		<Title
			{...props}
			variant={TITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			style={[{ color: components.appBar.default.default.title }, style]}
		/>
	);
}

export type AppBarSubtitleProps = Omit<TextProps, "variant"> & {
	/** Matches the size of the title above it. */
	size?: AppBarTitleSize;
};

function AppBarSubtitle({
	size = "small",
	numberOfLines = 1,
	style,
	...props
}: AppBarSubtitleProps) {
	const { components } = useTheme();
	return (
		<Text
			weight="medium"
			{...props}
			variant={SUBTITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			style={[{ color: components.appBar.default.default.subtitle }, style]}
		/>
	);
}

export const AppBar = Object.assign(AppBarRoot, {
	Row: AppBarRow,
	Center: AppBarCenter,
	Expanded: AppBarExpanded,
	Title: AppBarTitle,
	Subtitle: AppBarSubtitle,
});
