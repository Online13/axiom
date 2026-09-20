import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Portal } from "@/components/core/portal";
import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import {
	useToastItem,
	useToasts,
	type ToastData,
	type ToastType,
} from "../use-toast";

export { toast, type ToastOptions, type ToastType } from "../use-toast";

export type ToasterProps = {
	/** Toasts shown in the stack. Older ones wait in the queue. */
	visibleToasts?: number;
	/** Distance below the top safe area. */
	offset?: number;
	/** `press` stacks toasts until the stack is pressed, `always` lists them one under the other. */
	expand?: "press" | "always";
	swipeToDismiss?: boolean;
};

const TYPE_ICON: Partial<Record<ToastType, IconName>> = {
	success: "success",
	error: "error",
	info: "info",
};

const STACK_OFFSET = 10;
const STACK_SCALE = 0.05;

/** Mount once at the root of the app, next to the PortalHost. */
export function Toaster({
	visibleToasts = 3,
	offset = 8,
	expand = "press",
	swipeToDismiss = true,
}: ToasterProps) {
	const { tokens } = useTheme();
	const insets = useSafeAreaInsets();
	const toasts = useToasts();
	const [expandedByPress, setExpanded] = useState(false);
	const [heights, setHeights] = useState<Record<string, number>>({});

	const shown = toasts.slice(0, visibleToasts);
	const expanded =
		expand === "always" || (expandedByPress && shown.length > 1);
	const gap = tokens.spacing[2];

	if (toasts.length === 0) {
		if (expandedByPress) setExpanded(false);
		return null;
	}

	const offsets = shown.map((_, i) =>
		expanded
			? shown
					.slice(0, i)
					.reduce((sum, item) => sum + (heights[item.id] ?? 0) + gap, 0)
			: i * STACK_OFFSET,
	);

	const onLayout = (id: string) => (event: LayoutChangeEvent) => {
		const height = event.nativeEvent.layout.height;
		setHeights((previous) =>
			previous[id] === height ? previous : { ...previous, [id]: height },
		);
	};

	return (
		<Portal>
			<View
				style={[
					styles.container,
					{
						top: insets.top + offset,
						left: tokens.metrics.screenMargin,
						right: tokens.metrics.screenMargin,
					},
				]}
			>
				{/* Oldest first, so the newest toast is drawn on top. */}
				{toasts
					.map((item, i) => ({ item, i }))
					.reverse()
					.map(({ item, i }) => (
						<ToastView
							key={item.id}
							toast={item}
							index={i}
							offset={offsets[i] ?? 0}
							scale={
								expanded
									? 1
									: 1 - Math.min(i, visibleToasts) * STACK_SCALE
							}
							hidden={i >= visibleToasts}
							paused={expanded && expand === "press"}
							swipeToDismiss={swipeToDismiss}
							onLayout={onLayout(item.id)}
							onPress={() => {
								if (!expanded && shown.length > 1 && expand === "press")
									setExpanded(true);
								else if (item.onPress) item.onPress();
								else if (expandedByPress) setExpanded(false);
							}}
						/>
					))}
			</View>
		</Portal>
	);
}

type ToastViewProps = {
	toast: ToastData;
	index: number;
	offset: number;
	scale: number;
	hidden: boolean;
	paused: boolean;
	swipeToDismiss: boolean;
	onLayout: (event: LayoutChangeEvent) => void;
	onPress: () => void;
};

function ToastView({ onLayout, onPress, ...options }: ToastViewProps) {
	const { tokens, components } = useTheme();
	const { toast: data, hidden } = options;
	const { gesture, animatedStyle, setTouching } = useToastItem(options);

	const states = components.toast.default;
	const colors = {
		...states.default,
		...(data.type === "success" ||
		data.type === "error" ||
		data.type === "info"
			? states[data.type]
			: undefined),
	};
	const icon = data.icon ?? TYPE_ICON[data.type];

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				onLayout={onLayout}
				style={[styles.toast, hidden && styles.hidden, animatedStyle]}
				accessibilityElementsHidden={hidden}
				importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
			>
				<Tappable
					accessibilityRole={data.type === "error" ? "alert" : "summary"}
					accessibilityLabel={
						data.description
							? `${data.title}. ${data.description}`
							: data.title
					}
					onPress={onPress}
					onPressIn={() => setTouching(true)}
					onPressOut={() => setTouching(false)}
					style={[
						styles.surface,
						{
							gap: tokens.spacing[3],
							paddingVertical: tokens.spacing[3],
							paddingHorizontal: tokens.spacing[4],
							borderRadius: data.description
								? tokens.radius.xl
								: tokens.radius.full,
							borderWidth: tokens.metrics.hairline,
							borderColor: colors.border,
							backgroundColor: colors.background,
						},
					]}
				>
					{data.type === "loading" ? (
						<Spinner size="md" color="muted" />
					) : icon ? (
						<Icon name={icon} color={colors.icon} />
					) : null}
					<View style={styles.text}>
						<Text variant="bodySm" weight="semibold" numberOfLines={2}>
							{data.title}
						</Text>
						{data.description ? (
							<Text variant="footnote" color="muted" numberOfLines={3}>
								{data.description}
							</Text>
						) : null}
					</View>
				</Tappable>
			</Animated.View>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		pointerEvents: "box-none",
	},
	toast: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	hidden: {
		pointerEvents: "none",
	},
	surface: {
		flexDirection: "row",
		alignItems: "center",
		maxWidth: "100%",
		boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.12)",
	},
	text: {
		flexShrink: 1,
		gap: 2,
	},
});
