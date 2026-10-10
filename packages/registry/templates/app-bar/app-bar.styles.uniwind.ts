import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cx } from "@/theme";
import { metrics, spacing } from "@/theme/tokens";

import {
	APP_BAR_HEIGHT,
	type AppBarProps,
	type AppBarSubtitleProps,
	type AppBarTitleProps,
} from "./app-bar";

// The colors are the app bar's own tokens, in `theme/components/app-bar.css`.
export function useAppBarStyles() {
	// The top inset is a number the device gives: it isn't a class.
	const insets = useSafeAreaInsets();

	return {
		root: (
			safeArea: boolean,
			bordered: boolean,
			{ className, style }: Pick<AppBarProps, "className" | "style">,
		) => ({
			className: cx("border-b-app-bar-border bg-app-bar", className),
			style: [
				{
					paddingTop: safeArea ? insets.top : 0,
					// Only the device knows the width of a hairline.
					borderBottomWidth: bordered ? metrics.hairline : 0,
				},
				style,
			],
		}),
		row: ({
			className,
			style,
		}: Pick<AppBarProps, "className" | "style">) => ({
			className: cx("flex-row items-center gap-1 px-1", className),
			style: [{ height: APP_BAR_HEIGHT }, style],
		}),
		// `inset` lines the start up with the screen margin, the row's own padding taken off.
		center: (
			inset: boolean,
			{ className, style }: Pick<AppBarProps, "className" | "style">,
		) => ({
			className: cx(
				"min-w-0 flex-1 justify-center pe-1",
				!inset && "ps-1",
				className,
			),
			style: [
				inset && { paddingStart: metrics.screenMargin - spacing[1] },
				style,
			],
		}),
		expanded: ({ className }: Pick<AppBarProps, "className">) => ({
			className: cx("gap-1 px-screen-margin pb-4", className),
		}),
		title: ({ className }: Pick<AppBarTitleProps, "className">) => ({
			className: cx("text-app-bar-title", className),
		}),
		subtitle: ({ className }: Pick<AppBarSubtitleProps, "className">) => ({
			className: cx("text-app-bar-subtitle", className),
		}),
	};
}
