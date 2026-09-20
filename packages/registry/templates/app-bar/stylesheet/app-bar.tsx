import { createContext, use, type ReactNode } from "react";
import {
	StyleSheet,
	View,
	type ColorValue,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SearchBar, type SearchBarProps } from "@/components/ui/search-bar";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

import {
	APP_BAR_HEIGHT,
	LARGE_TITLE_HEIGHT,
	useProgress,
	type Progress,
} from "../use-app-bar";

export type { Progress } from "../use-app-bar";

export type AppBarVariant = "compact" | "large";

type AppBarContextValue = {
	variant: AppBarVariant;
	/** 0 to 1, how far the large title has folded into the bar. */
	collapse: ReturnType<typeof useProgress>;
};

const AppBarContext = createContext<AppBarContextValue | null>(null);

function useAppBar() {
	const context = use(AppBarContext);
	if (!context) throw new Error("AppBar parts must be used inside <AppBar>.");
	return context;
}

export type AppBarProps = {
	/** The `Leading`, `Title`, `Actions` and optional `Search` slots. */
	children?: ReactNode;
	/** A centered 17pt title, or a 34pt title on a second row. Use `large` at the root of a section. */
	variant?: AppBarVariant;
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
	/** 0 to 1: folds the large title and its search field into the compact bar. */
	collapseProgress?: Progress;
	/** 0 to 1: fades in the background and the hairline. Overrides `bordered`. */
	elevationProgress?: Progress;
	/** 0 to 1: fades in the compact title, when the page shows its own title first. */
	titleProgress?: Progress;
	/** Overrides the bar background without changing the screen background. */
	backgroundColor?: ColorValue;
	style?: StyleProp<ViewStyle>;
};

function AppBarRoot({
	children,
	variant = "compact",
	bordered = false,
	safeArea = true,
	collapseProgress,
	elevationProgress,
	titleProgress,
	backgroundColor,
	style,
}: AppBarProps) {
	const { components } = useTheme();
	const insets = useSafeAreaInsets();
	const colors = components.appBar.default.default;

	const collapse = useProgress(collapseProgress, 0);
	const elevation = useProgress(elevationProgress, 1);

	// Without `elevationProgress` the bar is simply there; with it, it fades in as the content scrolls under it.
	const surface = useAnimatedStyle(() => ({
		opacity: elevationProgress === undefined ? 1 : elevation.value,
	}));
	const hairline = useAnimatedStyle(() => ({
		opacity:
			elevationProgress === undefined ? (bordered ? 1 : 0) : elevation.value,
	}));

	return (
		<AppBarContext value={{ variant, collapse }}>
			<View style={[{ paddingTop: safeArea ? insets.top : 0 }, style]}>
				<Animated.View
					pointerEvents="none"
					style={[
						StyleSheet.absoluteFill,
						{ backgroundColor: backgroundColor ?? colors.background },
						surface,
					]}
				/>
				<AppBarRow titleProgress={titleProgress}>{children}</AppBarRow>
				<Animated.View
					pointerEvents="none"
					style={[
						styles.hairline,
						{ backgroundColor: colors.border },
						hairline,
					]}
				/>
			</View>
		</AppBarContext>
	);
}

/**
 * Sorts the slots: the compact row holds Leading, Title and Actions, and Search — plus the large
 * title — sit under it. The order the app writes them in doesn't matter.
 */
function AppBarRow({
	children,
	titleProgress,
}: {
	children?: ReactNode;
	titleProgress?: Progress;
}) {
	const { tokens } = useTheme();
	const { variant, collapse } = useAppBar();
	const title = useProgress(titleProgress, 1);

	const slots: Record<"leading" | "title" | "actions" | "search", ReactNode> =
		{
			leading: null,
			title: null,
			actions: null,
			search: null,
		};
	for (const child of flatten(children)) {
		if (isElementOf(child, AppBarLeading)) slots.leading = child;
		else if (isElementOf(child, AppBarTitle)) slots.title = child;
		else if (isElementOf(child, AppBarActions)) slots.actions = child;
		else if (isElementOf(child, AppBarSearch)) slots.search = child;
	}

	// In `large`, the compact title only appears as the large one folds away.
	const compactTitle = useAnimatedStyle(() => ({
		opacity: variant === "large" ? collapse.value : title.value,
	}));

	const largeTitle = useAnimatedStyle(() => ({
		height: interpolate(collapse.value, [0, 1], [LARGE_TITLE_HEIGHT, 0]),
		opacity: interpolate(collapse.value, [0, 0.6], [1, 0]),
		transform: [{ translateY: interpolate(collapse.value, [0, 1], [0, -8]) }],
	}));

	return (
		<>
			<View
				style={[
					styles.row,
					{ height: APP_BAR_HEIGHT, paddingHorizontal: tokens.spacing[1] },
				]}
			>
				<View style={[styles.side, styles.start]}>{slots.leading}</View>
				{variant === "compact" || slots.title ? (
					<Animated.View
						style={[styles.center, compactTitle]}
						pointerEvents="box-none"
					>
						{variant === "compact" ? (
							slots.title
						) : (
							<CompactTitle>{slots.title}</CompactTitle>
						)}
					</Animated.View>
				) : null}
				<View style={[styles.side, styles.end]}>{slots.actions}</View>
			</View>

			{variant === "large" && slots.title ? (
				<Animated.View
					style={[
						styles.largeTitle,
						{ paddingHorizontal: tokens.metrics.screenMargin },
						largeTitle,
					]}
				>
					<LargeTitle>{slots.title}</LargeTitle>
				</Animated.View>
			) : null}

			{slots.search}
		</>
	);
}

const TitleSizeContext = createContext<"compact" | "large">("compact");

const CompactTitle = ({ children }: { children: ReactNode }) => (
	<TitleSizeContext value="compact">{children}</TitleSizeContext>
);
const LargeTitle = ({ children }: { children: ReactNode }) => (
	<TitleSizeContext value="large">{children}</TitleSizeContext>
);

export type AppBarSlotProps = {
	/** One leading control, or up to two trailing controls. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function AppBarLeading({ children, style }: AppBarSlotProps) {
	const { tokens } = useTheme();
	return (
		<View style={[styles.slot, { gap: tokens.spacing[1] }, style]}>
			{children}
		</View>
	);
}

function AppBarActions({ children, style }: AppBarSlotProps) {
	const { tokens } = useTheme();
	return (
		<View
			style={[
				styles.slot,
				styles.actions,
				{ gap: tokens.spacing[1] },
				style,
			]}
		>
			{children}
		</View>
	);
}

export type AppBarTitleProps = {
	/** Plain text gets the compact or large text style automatically. */
	children?: ReactNode;
	numberOfLines?: number;
};

function AppBarTitle({ children, numberOfLines = 1 }: AppBarTitleProps) {
	const { components } = useTheme();
	const size = use(TitleSizeContext);
	const colors = components.appBar.default.default;

	if (typeof children !== "string" && typeof children !== "number")
		return <>{children}</>;

	return (
		<Title
			variant={size === "large" ? "display" : "subheading"}
			align={size === "large" ? "left" : "center"}
			numberOfLines={numberOfLines}
			style={{ color: size === "large" ? colors.largeTitle : colors.title }}
		>
			{children}
		</Title>
	);
}

export type AppBarSearchProps = SearchBarProps & {
	/** Folds with the large title as `collapseProgress` reaches 1. */
	collapsible?: boolean;
};

function AppBarSearch({ collapsible = true, ...props }: AppBarSearchProps) {
	const { tokens } = useTheme();
	const { collapse } = useAppBar();

	// The field rises with the large title; `collapsible={false}` pins it under the bar.
	const style = useAnimatedStyle(() => ({
		opacity: collapsible ? interpolate(collapse.value, [0.6, 1], [1, 0]) : 1,
		height: collapsible
			? interpolate(collapse.value, [0.6, 1], [SEARCH_HEIGHT, 0])
			: SEARCH_HEIGHT,
	}));

	return (
		<Animated.View
			style={[
				styles.search,
				{ paddingHorizontal: tokens.metrics.screenMargin },
				style,
			]}
		>
			<SearchBar {...props} />
		</Animated.View>
	);
}

// The bar plus the vertical padding around it.
const SEARCH_HEIGHT = 44;

export const AppBar = Object.assign(AppBarRoot, {
	Leading: AppBarLeading,
	Title: AppBarTitle,
	Actions: AppBarActions,
	Search: AppBarSearch,
});

function flatten(children: ReactNode): ReactNode[] {
	if (Array.isArray(children)) return children.flatMap(flatten);
	return children === null || children === undefined || children === false
		? []
		: [children];
}

function isElementOf(child: ReactNode, component: unknown): boolean {
	return (
		typeof child === "object" &&
		child !== null &&
		"type" in child &&
		child.type === component
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	// The side slots keep the same minimum width, so the compact title stays centered
	// even when one side holds more controls than the other.
	side: {
		minWidth: 44,
		flexDirection: "row",
		alignItems: "center",
	},
	start: {
		justifyContent: "flex-start",
	},
	end: {
		justifyContent: "flex-end",
	},
	center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	slot: {
		flexDirection: "row",
		alignItems: "center",
	},
	actions: {
		justifyContent: "flex-end",
	},
	largeTitle: {
		justifyContent: "flex-end",
		overflow: "hidden",
	},
	search: {
		justifyContent: "center",
		overflow: "hidden",
	},
	hairline: {
		position: "absolute",
		bottom: 0,
		start: 0,
		end: 0,
		height: StyleSheet.hairlineWidth,
	},
});
