import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	View,
	type GestureResponderEvent,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	FONT_WEIGHT,
	MAX_FONT_SCALE,
	Text,
	type TextProps,
} from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

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

export type DialogContentProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	UseDialogContentOptions & {
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
	dismissible,
	onDismiss,
	...props
}: DialogContentProps) {
	const dialog = useDialogContent({ dismissible, onDismiss });

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
					accessibilityRole="alert"
					{...props}
					accessibilityViewIsModal={dialog.isTop}
					style={[styles.surface(width), style, dialog.surfaceStyle]}
				>
					{media ? <View style={styles.media}>{media}</View> : null}
					{children}
				</Animated.View>
			</View>
		</Portal>
	);
}

function DialogTitle(props: TitleProps) {
	return <Title variant="subheading" align="center" {...props} />;
}

function DialogDescription(props: TextProps) {
	return <Text variant="bodySm" color="muted" align="center" {...props} />;
}

export type DialogActionsOrientation = "horizontal" | "vertical";

export type DialogActionsProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** `horizontal` for two short actions, `vertical` for three or long labels. */
	orientation?: DialogActionsOrientation;
	children?: ReactNode;
};

function DialogActions({
	orientation = "horizontal",
	children,
	style,
	...props
}: DialogActionsProps) {
	return (
		<View {...props} style={[styles.actions(orientation), style]}>
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
					style={styles.destructiveLabel}
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

const styles = StyleSheet.create((theme, rt) => ({
	layer: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	surface: (width: number) => ({
		boxShadow: "0px 12px 32px hsla(0, 0%, 0%, 0.18)",
		width: Math.min(
			width,
			rt.screen.width - theme.tokens.metrics.screenMargin * 2,
		),
		padding: theme.tokens.spacing[5],
		gap: theme.tokens.spacing[2],
		borderRadius: theme.tokens.radius.xl,
		backgroundColor: theme.components.dialog.default.default.background,
	}),
	media: {
		alignItems: "center",
		marginBottom: theme.tokens.spacing[1],
	},
	actions: (orientation: DialogActionsOrientation) => ({
		flexDirection: orientation === "horizontal" ? "row" : "column",
		gap: theme.tokens.spacing[2],
		marginTop: theme.tokens.spacing[3],
	}),
	action: {
		flexGrow: 1,
		flexBasis: 0,
		alignSelf: "stretch",
	},
	destructiveLabel: {
		color: theme.colors.feedback.error,
		fontWeight: FONT_WEIGHT.semibold,
	},
}));
