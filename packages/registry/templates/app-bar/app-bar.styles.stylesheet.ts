import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

import {
	APP_BAR_HEIGHT,
	type AppBarProps,
	type AppBarSubtitleProps,
	type AppBarTitleProps,
} from "./app-bar";

export function useAppBarStyles() {
	const { components, tokens } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.appBar.default.default;

	return {
		root: (
			safeArea: boolean,
			bordered: boolean,
			{ style }: Pick<AppBarProps, "style">,
		) => ({
			style: [
				{
					paddingTop: safeArea ? insets.top : 0,
					backgroundColor: colors.background,
					borderBottomWidth: bordered ? tokens.metrics.hairline : 0,
					borderBottomColor: colors.border,
				},
				style,
			],
		}),
		row: ({ style }: Pick<AppBarProps, "style">) => ({
			style: [
				styles.row,
				{
					height: APP_BAR_HEIGHT,
					paddingHorizontal: tokens.spacing[1],
					gap: tokens.spacing[1],
				},
				style,
			],
		}),
		center: (inset: boolean, { style }: Pick<AppBarProps, "style">) => ({
			style: [
				styles.center,
				{
					paddingStart: inset
						? tokens.metrics.screenMargin - tokens.spacing[1]
						: tokens.spacing[1],
					paddingEnd: tokens.spacing[1],
				},
				style,
			],
		}),
		expanded: ({ style }: Pick<AppBarProps, "style">) => ({
			style: [
				{
					gap: tokens.spacing[1],
					paddingHorizontal: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[4],
				},
				style,
			],
		}),
		title: ({ style }: Pick<AppBarTitleProps, "style">) => ({
			style: [{ color: colors.title }, style],
		}),
		subtitle: ({ style }: Pick<AppBarSubtitleProps, "style">) => ({
			style: [{ color: colors.subtitle }, style],
		}),
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	center: {
		flex: 1,
		minWidth: 0,
		justifyContent: "center",
	},
});
