import type { ComponentPropsWithRef } from "react";
import { View } from "react-native";

import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

import { StyleSheet } from "react-native-unistyles";

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
	...props
}: AppBarProps) {
	return (
		<View {...props} style={[styles.root(safeArea, bordered), props.style]} />
	);
}

/** The row of controls. Its children are laid out in the order you write them. */
function AppBarRow(props: ComponentPropsWithRef<typeof View>) {
	return <View {...props} style={[styles.row, props.style]} />;
}

export type AppBarCenterProps = ComponentPropsWithRef<typeof View> & {
	/** Lines the start up with the screen margin, for a row without a leading control. */
	inset?: boolean;
};

/** Fills the row between the controls: a title, a search field, a picker. Empty, it pushes the actions to the end. */
function AppBarCenter({ inset = false, ...props }: AppBarCenterProps) {
	return <View {...props} style={[styles.center(inset), props.style]} />;
}

/** The block under the row, for a medium or large title. */
function AppBarExpanded(props: ComponentPropsWithRef<typeof View>) {
	return <View {...props} style={[styles.expanded, props.style]} />;
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
	...props
}: AppBarTitleProps) {
	return (
		<Title
			{...props}
			variant={TITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			style={[styles.title, props.style]}
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
	...props
}: AppBarSubtitleProps) {
	return (
		<Text
			weight="medium"
			{...props}
			variant={SUBTITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			style={[styles.subtitle, props.style]}
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

const styles = StyleSheet.create((theme, rt) => {
	const colors = theme.components.appBar.default.default;
	const { spacing, metrics } = theme.tokens;

	return {
		root: (safeArea: boolean, bordered: boolean) => ({
			paddingTop: safeArea ? rt.insets.top : 0,
			backgroundColor: colors.background,
			borderBottomWidth: bordered ? metrics.hairline : 0,
			borderBottomColor: colors.border,
		}),
		row: {
			flexDirection: "row",
			alignItems: "center",
			height: APP_BAR_HEIGHT,
			paddingHorizontal: spacing[1],
			gap: spacing[1],
		},
		center: (inset: boolean) => ({
			flex: 1,
			minWidth: 0,
			justifyContent: "center",
			paddingStart: inset ? metrics.screenMargin - spacing[1] : spacing[1],
			paddingEnd: spacing[1],
		}),
		expanded: {
			gap: spacing[1],
			paddingHorizontal: metrics.screenMargin,
			paddingBottom: spacing[4],
		},
		title: {
			color: colors.title,
		},
		subtitle: {
			color: colors.subtitle,
		},
	};
});
