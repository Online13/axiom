import { useEffect, type ReactNode } from "react";
import {
	View,
	type FlatListProps,
	type ScrollViewProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { IconButton } from "@/components/ui/icon-button";
import { Title } from "@/components/ui/title";

import { BottomSheetRoot, BottomSheetTrigger } from "../bottom-sheet-root";
import {
	BottomSheetContentContext,
	useBottomSheetContent,
	useBottomSheetContentContext,
	type UseBottomSheetContentOptions,
} from "../use-bottom-sheet";

export type { KeyboardBehavior, SnapPoint } from "../use-bottom-sheet";

export type BottomSheetContentProps = Omit<
	UseBottomSheetContentOptions,
	"bottomOffset"
> & {
	/** Dims the screen behind the sheet. The dimming follows the sheet position. */
	overlay?: boolean;
	/** Floats above the bottom edge with all corners rounded. */
	detached?: boolean;
	/** Floating actions pinned above the bottom safe area, visible at every snap point. */
	footer?: ReactNode;
	style?: StyleProp<ViewStyle>;
	children?: ReactNode;
};

function BottomSheetContent({
	overlay = true,
	detached = false,
	footer,
	style,
	children,
	...options
}: BottomSheetContentProps) {
	// The sheet is laid out in plain numbers by its hook, so the bottom inset and the spacing token
	// are read here rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme, rt } = useUnistyles();
	const bottomOffset = detached
		? rt.insets.bottom + theme.tokens.spacing[2]
		: 0;

	const sheet = useBottomSheetContent({ ...options, bottomOffset });
	if (!sheet.mounted) return null;

	return (
		<Portal>
			<View style={styles.layer}>
				{overlay ? (
					<Overlay
						visible={sheet.open}
						progress={sheet.progress}
						onPress={sheet.dismissible ? sheet.close : undefined}
					/>
				) : null}
				<GestureDetector gesture={sheet.gesture}>
					<Animated.View
						accessibilityViewIsModal
						style={[
							styles.sheet(detached, sheet.sheetHeight, bottomOffset),
							style,
							sheet.sheetStyle,
						]}
					>
						<BottomSheetContentContext value={sheet.context}>
							<View
								onLayout={sheet.onContentLayout}
								style={styles.content(
									sheet.fitsContent,
									detached,
									footer !== undefined ? sheet.footerHeight : undefined,
								)}
							>
								{children}
							</View>
							{footer ? (
								<Animated.View
									onLayout={sheet.onFooterLayout}
									style={[styles.footer(detached), sheet.footerStyle]}
								>
									{footer}
								</Animated.View>
							) : null}
						</BottomSheetContentContext>
					</Animated.View>
				</GestureDetector>
			</View>
		</Portal>
	);
}

function BottomSheetHandle({ style }: { style?: StyleProp<ViewStyle> }) {
	const { index, snapCount, requestIndex } = useBottomSheetContentContext();

	return (
		<View
			accessible
			accessibilityRole="adjustable"
			accessibilityLabel="Resize sheet"
			accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
			onAccessibilityAction={(event) => {
				if (event.nativeEvent.actionName === "increment")
					requestIndex(Math.min(index + 1, snapCount - 1));
				if (event.nativeEvent.actionName === "decrement")
					requestIndex(Math.max(index - 1, 0));
			}}
			style={[styles.handleArea, style]}
		>
			<View style={styles.handle} />
		</View>
	);
}

export type BottomSheetHeaderProps = {
	title?: string;
	leading?: ReactNode;
	trailing?: ReactNode;
	/** Adds a close button after `trailing`. Uses the `close` icon of your registry. */
	closeButton?: boolean;
	style?: StyleProp<ViewStyle>;
};

function BottomSheetHeader({
	title,
	leading,
	trailing,
	closeButton = false,
	style,
}: BottomSheetHeaderProps) {
	const { close } = useBottomSheetContentContext();

	return (
		<View style={[styles.header, style]}>
			<View style={styles.start}>{leading}</View>
			{title ? (
				<Title
					variant="subheading"
					align="center"
					numberOfLines={1}
					style={styles.title}
				>
					{title}
				</Title>
			) : null}
			<View style={styles.end}>
				{trailing}
				{closeButton ? (
					<IconButton
						icon="close"
						variant="tinted"
						size="sm"
						accessibilityLabel="Close"
						onPress={close}
					/>
				) : null}
			</View>
		</View>
	);
}

/** Scrollable content that hands the gesture back to the sheet when scrolled to the top. */
function BottomSheetScrollView(props: ScrollViewProps) {
	const { nativeGesture, scrollRef, scrollHandler, registerScroll } =
		useBottomSheetContentContext();
	useEffect(registerScroll, [registerScroll]);

	return (
		<GestureDetector gesture={nativeGesture}>
			<Animated.ScrollView
				bounces={false}
				overScrollMode="never"
				scrollEventThrottle={16}
				{...props}
				ref={scrollRef}
				onScroll={scrollHandler}
			/>
		</GestureDetector>
	);
}

// `CellRendererComponent` isn't supported by Reanimated's FlatList.
function BottomSheetFlatList<T>(
	props: Omit<FlatListProps<T>, "CellRendererComponent">,
) {
	const { nativeGesture, scrollRef, scrollHandler, registerScroll } =
		useBottomSheetContentContext();
	useEffect(registerScroll, [registerScroll]);

	return (
		<GestureDetector gesture={nativeGesture}>
			<Animated.FlatList
				bounces={false}
				overScrollMode="never"
				scrollEventThrottle={16}
				{...(props as Omit<
					FlatListProps<unknown>,
					"CellRendererComponent"
				>)}
				// The sheet scrolls the list through the same ref as a ScrollView.
				ref={scrollRef as never}
				onScroll={scrollHandler}
			/>
		</GestureDetector>
	);
}

export const BottomSheet = {
	Root: BottomSheetRoot,
	Trigger: BottomSheetTrigger,
	Content: BottomSheetContent,
	Handle: BottomSheetHandle,
	Header: BottomSheetHeader,
	ScrollView: BottomSheetScrollView,
	FlatList: BottomSheetFlatList,
};

const styles = StyleSheet.create((theme, rt) => {
	const colors = theme.components.bottomSheet.default.default;
	// Detached, the sheet already floats above the safe area: it only needs its own inner padding.
	const safeBottom = (detached: boolean) =>
		detached ? theme.tokens.spacing[3] : rt.insets.bottom;

	return {
		layer: {
			...StyleSheet.absoluteFillObject,
			pointerEvents: "box-none",
		},
		sheet: (detached: boolean, height: number, bottom: number) => ({
			position: "absolute",
			left: 0,
			right: 0,
			overflow: "hidden",
			height,
			bottom,
			backgroundColor: colors.background,
			borderTopLeftRadius: theme.tokens.radius.xl,
			borderTopRightRadius: theme.tokens.radius.xl,
			...(detached && {
				left: theme.tokens.metrics.screenMargin,
				right: theme.tokens.metrics.screenMargin,
				borderRadius: theme.tokens.radius.xl,
			}),
		}),
		content: (
			fitsContent: boolean,
			detached: boolean,
			footerHeight: number | undefined,
		) => ({
			...(!fitsContent && { flex: 1 }),
			paddingBottom: footerHeight ?? safeBottom(detached),
		}),
		footer: (detached: boolean) => ({
			position: "absolute",
			left: 0,
			right: 0,
			bottom: 0,
			gap: theme.tokens.spacing[2],
			paddingHorizontal: theme.tokens.metrics.screenMargin,
			paddingTop: theme.tokens.spacing[2],
			paddingBottom: safeBottom(detached) + theme.tokens.spacing[2],
			backgroundColor: colors.background,
		}),
		handleArea: {
			alignItems: "center",
			paddingVertical: theme.tokens.spacing[2],
		},
		handle: {
			width: 36,
			height: 5,
			borderRadius: theme.tokens.radius.full,
			backgroundColor: colors.handle,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			minHeight: theme.tokens.metrics.touchTarget,
			paddingHorizontal: theme.tokens.metrics.screenMargin,
			gap: theme.tokens.spacing[2],
		},
		start: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-start",
		},
		end: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		title: {
			flexShrink: 1,
		},
	};
});
