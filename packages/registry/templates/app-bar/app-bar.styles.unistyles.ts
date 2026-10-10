import { StyleSheet } from "react-native-unistyles";

import {
	APP_BAR_HEIGHT,
	type AppBarProps,
	type AppBarSubtitleProps,
	type AppBarTitleProps,
} from "./app-bar";

export function useAppBarStyles() {
	return {
		root: (
			safeArea: boolean,
			bordered: boolean,
			{ style }: Pick<AppBarProps, "style">,
		) => ({ style: [styles.root(safeArea, bordered), style] }),
		row: ({ style }: Pick<AppBarProps, "style">) => ({
			style: [styles.row, style],
		}),
		center: (inset: boolean, { style }: Pick<AppBarProps, "style">) => ({
			style: [styles.center(inset), style],
		}),
		expanded: ({ style }: Pick<AppBarProps, "style">) => ({
			style: [styles.expanded, style],
		}),
		title: ({ style }: Pick<AppBarTitleProps, "style">) => ({
			style: [styles.title, style],
		}),
		subtitle: ({ style }: Pick<AppBarSubtitleProps, "style">) => ({
			style: [styles.subtitle, style],
		}),
	};
}

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
