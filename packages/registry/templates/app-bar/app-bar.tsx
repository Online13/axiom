import type { ComponentPropsWithRef } from "react";
import { View } from "react-native";

import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

import { useAppBarStyles } from "./app-bar.styles";

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
	const styles = useAppBarStyles();

	return <View {...props} {...styles.root(safeArea, bordered, props)} />;
}

/** The row of controls. Its children are laid out in the order you write them. */
function AppBarRow(props: ComponentPropsWithRef<typeof View>) {
	const styles = useAppBarStyles();

	return <View {...props} {...styles.row(props)} />;
}

export type AppBarCenterProps = ComponentPropsWithRef<typeof View> & {
	/** Lines the start up with the screen margin, for a row without a leading control. */
	inset?: boolean;
};

/** Fills the row between the controls: a title, a search field, a picker. Empty, it pushes the actions to the end. */
function AppBarCenter({ inset = false, ...props }: AppBarCenterProps) {
	const styles = useAppBarStyles();

	return <View {...props} {...styles.center(inset, props)} />;
}

/** The block under the row, for a medium or large title. */
function AppBarExpanded(props: ComponentPropsWithRef<typeof View>) {
	const styles = useAppBarStyles();

	return <View {...props} {...styles.expanded(props)} />;
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
	const styles = useAppBarStyles();

	return (
		<Title
			{...props}
			variant={TITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			{...styles.title(props)}
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
	const styles = useAppBarStyles();

	return (
		<Text
			weight="medium"
			{...props}
			variant={SUBTITLE_VARIANT[size]}
			numberOfLines={numberOfLines}
			{...styles.subtitle(props)}
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
