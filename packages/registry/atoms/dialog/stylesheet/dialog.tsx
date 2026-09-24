import type { ReactNode } from "react";
import {
	StyleSheet,
	useWindowDimensions,
	View,
	type GestureResponderEvent,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Button, type ButtonProps } from "@/components/ui/button";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

import {
	DialogContext,
	useDialog,
	useDialogContent,
	useDialogContext,
	type UseDialogContentOptions,
	type UseDialogOptions,
} from "../use-dialog";

export type DialogRootProps = UseDialogOptions & { children?: ReactNode };

function DialogRoot({ children, ...options }: DialogRootProps) {
	const dialog = useDialog(options);
	return <DialogContext value={dialog}>{children}</DialogContext>;
}

export type DialogTriggerProps = TappableProps & { asChild?: boolean };

function DialogTrigger({
	asChild = false,
	onPress,
	children,
	...props
}: DialogTriggerProps) {
	const { setOpen } = useDialogContext();

	const handlePress = (event: GestureResponderEvent) => {
		onPress?.(event);
		setOpen(true);
	};

	if (asChild) {
		return (
			<Slot {...props} onPress={handlePress}>
				{children as ReactNode}
			</Slot>
		);
	}

	return (
		<Tappable {...props} onPress={handlePress}>
			{children}
		</Tappable>
	);
}

export type DialogContentProps = UseDialogContentOptions & {
	/** Icon or illustration above the title. */
	media?: ReactNode;
	/** Capped by the screen margins. */
	width?: number;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function DialogContent({
	media,
	width = 290,
	children,
	style,
	...options
}: DialogContentProps) {
	const { tokens, components } = useTheme();
	const { width: screenWidth } = useWindowDimensions();
	const dialog = useDialogContent(options);

	if (!dialog.mounted) return null;

	return (
		<Portal>
			<View
				importantForAccessibility={
					dialog.isTop ? "auto" : "no-hide-descendants"
				}
				style={[styles.layer, !dialog.isTop && styles.inert]}
			>
				<Overlay
					visible={dialog.open}
					onPress={dialog.dismissible ? dialog.close : undefined}
				/>
				<Animated.View
					accessibilityViewIsModal={dialog.isTop}
					accessibilityRole="alert"
					style={[
						styles.surface,
						{
							width: Math.min(
								width,
								screenWidth - tokens.metrics.screenMargin * 2,
							),
							padding: tokens.spacing[5],
							gap: tokens.spacing[2],
							borderRadius: tokens.radius.xl,
							backgroundColor:
								components.dialog.default.default.background,
						},
						style,
						dialog.surfaceStyle,
					]}
				>
					{media ? (
						<View
							style={[styles.media, { marginBottom: tokens.spacing[1] }]}
						>
							{media}
						</View>
					) : null}
					{children}
				</Animated.View>
			</View>
		</Portal>
	);
}

function DialogTitle({ children }: { children?: ReactNode }) {
	return (
		<Title variant="subheading" align="center">
			{children}
		</Title>
	);
}

function DialogDescription({ children }: { children?: ReactNode }) {
	return (
		<Text variant="bodySm" color="muted" align="center">
			{children}
		</Text>
	);
}

export type DialogActionsProps = {
	/** `horizontal` for two short actions, `vertical` for three or long labels. */
	orientation?: "horizontal" | "vertical";
	children?: ReactNode;
};

function DialogActions({
	orientation = "horizontal",
	children,
}: DialogActionsProps) {
	const { tokens } = useTheme();

	return (
		<View
			style={[
				orientation === "horizontal" ? styles.row : styles.column,
				{ gap: tokens.spacing[2], marginTop: tokens.spacing[3] },
			]}
		>
			{children}
		</View>
	);
}

export type DialogActionProps = ButtonProps & {
	/** Red button, for irreversible actions. With `variant="ghost"`, a red label instead. */
	destructive?: boolean;
	/** Closes the dialog after `onPress`. `false` keeps it open, for an async action with `loading`. */
	closeOnPress?: boolean;
};

function DialogAction({
	destructive = false,
	closeOnPress = true,
	variant,
	onPress,
	children,
	style,
	...props
}: DialogActionProps) {
	const { colors } = useTheme();
	const { setOpen } = useDialogContext();
	const ghost = variant === "ghost";

	return (
		<Button
			{...props}
			variant={destructive && !ghost ? "destructive" : (variant ?? "solid")}
			style={[styles.action, style]}
			onPress={(event) => {
				onPress?.(event);
				if (closeOnPress) setOpen(false);
			}}
		>
			{destructive && ghost && typeof children === "string" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					style={{
						color: colors.feedback.error,
						fontWeight: FONT_WEIGHT.semibold,
					}}
				>
					{children}
				</Text>
			) : (
				children
			)}
		</Button>
	);
}

/** Outline button that closes the dialog. */
function DialogCancel({
	variant = "outline",
	onPress,
	style,
	...props
}: ButtonProps) {
	const { setOpen } = useDialogContext();

	return (
		<Button
			{...props}
			variant={variant}
			style={[styles.action, style]}
			onPress={(event) => {
				onPress?.(event);
				setOpen(false);
			}}
		/>
	);
}

export const Dialog = {
	Root: DialogRoot,
	Trigger: DialogTrigger,
	Content: DialogContent,
	Title: DialogTitle,
	Description: DialogDescription,
	Actions: DialogActions,
	Action: DialogAction,
	Cancel: DialogCancel,
};

const styles = StyleSheet.create({
	layer: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	surface: {
		boxShadow: "0px 12px 32px hsla(0, 0%, 0%, 0.18)",
	},
	media: {
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
	},
	column: {
		flexDirection: "column",
	},
	action: {
		flexGrow: 1,
		flexBasis: 0,
		alignSelf: "stretch",
	},
});
