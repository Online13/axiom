import {
	createContext,
	isValidElement,
	use,
	useEffect,
	useRef,
	useState,
	type ComponentPropsWithRef,
	type ReactNode,
	type Ref,
} from "react";
import {
	ScrollView,
	View,
	type LayoutChangeEvent,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { Theme } from "@/theme";

export type TabVariant = "underline" | "pill";

type TabLayout = { x: number; width: number };

const SPRING = { stiffness: 380, damping: 34, mass: 1 };

type UseTabOptions = {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};

function useTab({
	value: valueProp,
	defaultValue = "",
	onValueChange,
}: UseTabOptions) {
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});
	const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});
	const [listViewport, setListViewport] = useState(0);
	const [listContentWidth, setListContentWidth] = useState(0);

	const listRef = useRef<ScrollView>(null);
	const reduceMotion = useReducedMotion();
	const indicatorX = useSharedValue(0);
	const indicatorWidth = useSharedValue(0);
	const indicatorReady = useSharedValue(false);
	const selectedLayout = layouts[value];

	useEffect(() => {
		if (!selectedLayout) return;

		if (!indicatorReady.value || reduceMotion) {
			indicatorX.value = selectedLayout.x;
			indicatorWidth.value = selectedLayout.width;
			indicatorReady.value = true;
			return;
		}

		indicatorX.value = withSpring(selectedLayout.x, SPRING);
		indicatorWidth.value = withSpring(selectedLayout.width, SPRING);
	}, [
		indicatorReady,
		indicatorWidth,
		indicatorX,
		reduceMotion,
		selectedLayout,
	]);

	useEffect(() => {
		if (!selectedLayout || !listViewport) return;
		const max = Math.max(listContentWidth - listViewport, 0);
		const x = Math.min(
			Math.max(
				selectedLayout.x + selectedLayout.width / 2 - listViewport / 2,
				0,
			),
			max,
		);
		listRef.current?.scrollTo({ x, animated: !reduceMotion });
	}, [listContentWidth, listViewport, reduceMotion, selectedLayout]);

	return {
		value,
		listRef,
		select: setValue,
		onItemLayout: (item: string) => (event: LayoutChangeEvent) => {
			const { x, width } = event.nativeEvent.layout;
			setLayouts((current) => {
				const known = current[item];
				return known?.x === x && known.width === width
					? current
					: { ...current, [item]: { x, width } };
			});
		},
		onListLayout: (event: LayoutChangeEvent) =>
			setListViewport(event.nativeEvent.layout.width),
		onListContentSizeChange: (width: number) => setListContentWidth(width),
		indicatorStyle: useAnimatedStyle(() => ({
			opacity: indicatorReady.value ? 1 : 0,
			width: indicatorWidth.value,
			transform: [{ translateX: indicatorX.value }],
		})),
	};
}

type TabContextValue = ReturnType<typeof useTab>;
type TabListContextValue = { variant: TabVariant; scrollable: boolean };
type TabContentContextValue = {
	paged: boolean;
	pageWidth: number;
	onPanelLayout?: (value: string, event: LayoutChangeEvent) => void;
};

const TabContext = createContext<TabContextValue | null>(null);
const TabListContext = createContext<TabListContextValue | null>(null);
const TabContentContext = createContext<TabContentContextValue | null>(null);

function useTabContext() {
	const context = use(TabContext);
	if (!context) throw new Error("Tab components must be used inside <Tab>.");
	return context;
}

function useTabListContext() {
	const context = use(TabListContext);
	if (!context) throw new Error("Tab.Item must be used inside <Tab.List>.");
	return context;
}

function tabItemColors(
	components: Theme["components"],
	variant: TabVariant,
	selected: boolean,
	disabled: boolean,
) {
	const states = components.tab[variant];
	return {
		...states.default,
		...(disabled ? states.disabled : selected ? states.selected : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export type TabProps = Omit<ComponentPropsWithRef<typeof View>, "children"> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	children?: ReactNode;
};

function TabRoot({
	value,
	defaultValue,
	onValueChange,
	children,
	...props
}: TabProps) {
	const tab = useTab({ value, defaultValue, onValueChange });

	return (
		<TabContext value={tab}>
			<View {...props}>{children}</View>
		</TabContext>
	);
}

const INDICATOR_HEIGHT = 2;

type TabListSharedProps = {
	variant?: TabVariant;
	children?: ReactNode;
};

export type TabListViewProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	TabListSharedProps & { scrollable?: false };
export type TabListScrollViewProps = Omit<
	ComponentPropsWithRef<typeof ScrollView>,
	"children"
> &
	TabListSharedProps & { scrollable: true };
export type TabListProps = TabListViewProps | TabListScrollViewProps;

function TabList(props: TabListScrollViewProps): ReactNode;
function TabList(props: TabListViewProps): ReactNode;
function TabList({
	scrollable = false,
	variant = "underline",
	children,
	...props
}: TabListProps) {
	const tab = useTabContext();
	const indicator = (
		<Animated.View
			pointerEvents="none"
			style={[styles.indicator(variant), tab.indicatorStyle]}
		/>
	);

	if (scrollable) {
		const {
			ref,
			style,
			contentContainerStyle,
			onLayout,
			onContentSizeChange,
			...scrollViewProps
		} = props as TabListScrollViewProps;
		return (
			<TabListContext value={{ variant, scrollable }}>
				<ScrollView
					{...scrollViewProps}
					ref={mergeRefs(tab.listRef, ref)}
					accessibilityRole="tablist"
					horizontal
					showsHorizontalScrollIndicator={false}
					onLayout={(event) => {
						tab.onListLayout(event);
						onLayout?.(event);
					}}
					onContentSizeChange={(width, height) => {
						tab.onListContentSizeChange(width);
						onContentSizeChange?.(width, height);
					}}
					style={[styles.row, style]}
					contentContainerStyle={[
						styles.list(variant, false),
						contentContainerStyle,
					]}
				>
					{indicator}
					{children}
				</ScrollView>
			</TabListContext>
		);
	}

	const { style, ...viewProps } = props as TabListViewProps;
	return (
		<TabListContext value={{ variant, scrollable }}>
			<View
				{...viewProps}
				accessibilityRole="tablist"
				style={[styles.list(variant, true), style]}
			>
				{indicator}
				{children}
			</View>
		</TabListContext>
	);
}

export type TabItemProps = Omit<
	TappableProps,
	"children" | "disabled" | "onPress" | "style"
> & {
	value: string;
	children?: ReactNode;
	icon?: IconName | ReactNode;
	badge?: number | string | boolean;
	disabled?: boolean;
	onPress?: TappableProps["onPress"];
	style?: TappableProps["style"];
};

function TabItem({
	value,
	children,
	icon,
	badge,
	disabled = false,
	onLayout,
	onPress,
	style,
	...props
}: TabItemProps) {
	const tab = useTabContext();
	const list = useTabListContext();
	const selected = tab.value === value;
	const base = styles.item(list.scrollable);

	return (
		<Tappable
			{...props}
			accessibilityRole="tab"
			accessibilityState={{
				...props.accessibilityState,
				selected,
				disabled,
			}}
			disabled={disabled}
			onLayout={(event) => {
				tab.onItemLayout(value)(event);
				onLayout?.(event);
			}}
			onPress={(event) => {
				tab.select(value);
				onPress?.(event);
			}}
			style={
				typeof style === "function"
					? (state) => [base, style(state)]
					: [base, style]
			}
		>
			{icon !== undefined ? (
				isValidElement(icon) ? (
					icon
				) : (
					<ThemedIcon
						name={icon as IconName}
						size="sm"
						uniProps={(theme) => ({
							color: tabItemColors(
								theme.components,
								list.variant,
								selected,
								disabled,
							).content,
						})}
					/>
				)
			) : null}
			<Text
				variant="bodySm"
				weight={selected ? "semibold" : "regular"}
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				numberOfLines={1}
				style={styles.label(list.variant, selected, disabled)}
			>
				{children}
			</Text>
			{badge !== undefined && badge !== false && badge !== 0 ? (
				badge === true ? (
					<Badge dot />
				) : typeof badge === "number" ? (
					<Badge count={badge} size="sm" />
				) : (
					<Badge size="sm">{badge}</Badge>
				)
			) : null}
		</Tappable>
	);
}

export type TabContentProps = ComponentPropsWithRef<typeof View>;

function TabContent({ children, ...props }: TabContentProps) {
	return (
		<TabContentContext value={{ paged: false, pageWidth: 0 }}>
			<View {...props}>{children}</View>
		</TabContentContext>
	);
}

export type TabPagerProps = ComponentPropsWithRef<typeof ScrollView>;

function TabPager({
	children,
	ref,
	style,
	onLayout,
	onMomentumScrollEnd,
	...props
}: TabPagerProps) {
	const tab = useTabContext();
	const [pageWidth, setPageWidth] = useState(0);
	const [panelLayouts, setPanelLayouts] = useState<Record<string, TabLayout>>(
		{},
	);
	const pagerRef = useRef<ScrollView>(null);
	const selectedLayout = panelLayouts[tab.value];

	useEffect(() => {
		if (!selectedLayout) return;
		pagerRef.current?.scrollTo({ x: selectedLayout.x, animated: true });
	}, [selectedLayout]);

	const handleLayout = (event: LayoutChangeEvent) => {
		setPageWidth(event.nativeEvent.layout.width);
		onLayout?.(event);
	};
	const handleMomentumScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		const offset = event.nativeEvent.contentOffset.x;
		const closest = Object.entries(panelLayouts).reduce<
			[string, TabLayout] | undefined
		>((nearest, panel) => {
			if (!nearest) return panel;
			return Math.abs(panel[1].x - offset) < Math.abs(nearest[1].x - offset)
				? panel
				: nearest;
		}, undefined);
		if (closest) tab.select(closest[0]);
		onMomentumScrollEnd?.(event);
	};
	const handlePanelLayout = (value: string, event: LayoutChangeEvent) => {
		const { x, width } = event.nativeEvent.layout;
		setPanelLayouts((current) => {
			const known = current[value];
			return known?.x === x && known.width === width
				? current
				: { ...current, [value]: { x, width } };
		});
	};

	return (
		<TabContentContext
			value={{ paged: true, pageWidth, onPanelLayout: handlePanelLayout }}
		>
			<ScrollView
				{...props}
				ref={mergeRefs(pagerRef, ref)}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onLayout={handleLayout}
				onMomentumScrollEnd={handleMomentumScrollEnd}
				style={[styles.pager, style]}
			>
				{children}
			</ScrollView>
		</TabContentContext>
	);
}

export type TabPanelProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	value: string;
	children?: ReactNode;
};

function TabPanel({
	value,
	children,
	style,
	onLayout,
	...props
}: TabPanelProps) {
	const tab = useTabContext();
	const content = use(TabContentContext);

	if (!content)
		throw new Error(
			"Tab.Panel must be used inside <Tab.Content> or <Tab.Pager>.",
		);
	if (!content.paged && tab.value !== value) return null;

	const selected = tab.value === value;
	return (
		<View
			{...props}
			accessibilityElementsHidden={!selected}
			importantForAccessibility={selected ? "auto" : "no-hide-descendants"}
			onLayout={(event) => {
				content.onPanelLayout?.(value, event);
				onLayout?.(event);
			}}
			style={[
				styles.panel(content.paged ? content.pageWidth : undefined),
				style,
			]}
		>
			{children}
		</View>
	);
}

export const Tab = Object.assign(TabRoot, {
	List: TabList,
	Item: TabItem,
	Content: TabContent,
	Pager: TabPager,
	Panel: TabPanel,
});

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
	return (value: T | null) => {
		for (const ref of refs) {
			if (typeof ref === "function") ref(value);
			else if (ref) ref.current = value;
		}
	};
}

const styles = StyleSheet.create((theme) => ({
	list: (variant: TabVariant, stretch: boolean) => {
		const pill = variant === "pill";
		const colors = theme.components.tab[variant].default;
		return {
			flexDirection: "row",
			alignItems: "stretch",
			...(stretch && { alignSelf: "stretch" }),
			padding: pill ? theme.tokens.spacing[1] : 0,
			borderRadius: pill ? theme.tokens.radius.full : 0,
			backgroundColor: colors.background,
			borderBottomWidth: pill ? 0 : StyleSheet.hairlineWidth,
			borderBottomColor: colors.border,
		};
	},
	indicator: (variant: TabVariant) => {
		const pill = variant === "pill";
		return {
			position: "absolute",
			start: 0,
			backgroundColor: theme.components.tab[variant].default.indicator,
			...(pill
				? { top: 4, bottom: 4, borderRadius: theme.tokens.radius.full }
				: { bottom: 0, height: INDICATOR_HEIGHT, borderRadius: 0 }),
		};
	},
	row: {
		flexGrow: 0,
	},
	pager: {
		flex: 1,
	},
	panel: (pageWidth: number | undefined) => ({
		flex: 1,
		...(pageWidth !== undefined && { width: pageWidth }),
	}),
	item: (scrollable: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		...(!scrollable && { flex: 1 }),
		minHeight: theme.tokens.metrics.touchTarget,
		paddingHorizontal: theme.tokens.spacing[3],
		gap: theme.tokens.spacing[1],
	}),
	label: (variant: TabVariant, selected: boolean, disabled: boolean) => ({
		color: tabItemColors(theme.components, variant, selected, disabled)
			.content,
	}),
}));
