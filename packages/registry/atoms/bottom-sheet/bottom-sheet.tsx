import { useEffect, type ComponentPropsWithRef, type ReactNode } from "react";
import {
	View,
	type FlatListProps,
	type ScrollViewProps,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { IconButton } from "@/components/ui/icon-button";
import { Title } from "@/components/ui/title";

import { BottomSheetRoot, BottomSheetTrigger } from "./bottom-sheet-root";
import {
	BottomSheetSurface,
	useBottomSheetStyles,
} from "./bottom-sheet.styles";
import {
	BottomSheetContentContext,
	useBottomSheetContent,
	useBottomSheetContentContext,
	type UseBottomSheetContentOptions,
} from "./use-bottom-sheet";

export type { KeyboardBehavior, SnapPoint } from "./use-bottom-sheet";

export type BottomSheetContentProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	Omit<UseBottomSheetContentOptions, "bottomOffset" | "stackScale"> & {
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
	snapPoints,
	index,
	onIndexChange,
	dismissible,
	onDismiss,
	keyboardBehavior,
	stack,
	haptic,
	...props
}: BottomSheetContentProps) {
	const styles = useBottomSheetStyles();
	const bottomOffset = styles.bottomOffset(detached);

	const sheet = useBottomSheetContent({
		snapPoints,
		index,
		onIndexChange,
		dismissible,
		onDismiss,
		keyboardBehavior,
		stack,
		haptic,

		bottomOffset,
		stackScale: styles.stackScale,
	});
	if (!sheet.mounted) return null;

	return (
		<Portal>
			<View {...styles.layer}>
				{overlay ? (
					<Overlay
						visible={sheet.open}
						progress={sheet.progress}
						onPress={sheet.dismissible ? sheet.close : undefined}
					/>
				) : null}
				<GestureDetector gesture={sheet.gesture}>
					<BottomSheetSurface
						{...props}
						{...styles.surface(detached)}
						accessibilityViewIsModal={sheet.isTop}
						importantForAccessibility={
							sheet.isTop ? "yes" : "no-hide-descendants"
						}
						style={[
							styles.sheet(
								detached,
								sheet.sheetHeight,
								bottomOffset,
								sheet.isTop,
							),
							style,
							sheet.sheetStyle,
						]}
					>
						<BottomSheetContentContext value={sheet.context}>
							<View
								onLayout={sheet.onContentLayout}
								{...styles.content(
									sheet.fitsContent,
									detached,
									footer ? sheet.footerHeight : undefined,
								)}
							>
								{children}
							</View>
							{footer ? (
								<BottomSheetSurface
									onLayout={sheet.onFooterLayout}
									{...styles.footerSurface(detached)}
									style={[styles.footer(detached), sheet.footerStyle]}
								>
									{footer}
								</BottomSheetSurface>
							) : null}
						</BottomSheetContentContext>
					</BottomSheetSurface>
				</GestureDetector>
			</View>
		</Portal>
	);
}

export type BottomSheetHandleProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
>;

function BottomSheetHandle(props: BottomSheetHandleProps) {
	const styles = useBottomSheetStyles();
	const { index, snapCount, requestIndex } = useBottomSheetContentContext();

	return (
		<View
			accessible
			accessibilityRole="adjustable"
			accessibilityLabel="Resize sheet"
			{...props}
			accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
			onAccessibilityAction={(event) => {
				if (event.nativeEvent.actionName === "increment")
					requestIndex(Math.min(index + 1, snapCount - 1));
				if (event.nativeEvent.actionName === "decrement")
					requestIndex(Math.max(index - 1, 0));
			}}
			{...styles.handleArea(props)}
		>
			<View {...styles.handle} />
		</View>
	);
}

export type BottomSheetHeaderProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
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
	...props
}: BottomSheetHeaderProps) {
	const styles = useBottomSheetStyles();
	const { close } = useBottomSheetContentContext();

	return (
		<View {...props} {...styles.header(props)}>
			<View {...styles.start}>{leading}</View>
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
			<View {...styles.end}>
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
