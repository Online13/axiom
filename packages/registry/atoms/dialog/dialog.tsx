import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	View,
	type GestureResponderEvent,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Button, type ButtonProps } from "@/components/ui/button";
import { MAX_FONT_SCALE, Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

import { DialogSurface, useDialogStyles } from "./dialog.styles";

import {
	DialogContext,
	useDialog,
	useDialogContent,
	useDialogContext,
	type UseDialogContentOptions,
	type UseDialogOptions,
} from "./use-dialog";

export type DialogActionsOrientation = "horizontal" | "vertical";

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
	const styles = useDialogStyles();
	const dialog = useDialogContent({ dismissible, onDismiss });

	if (!dialog.mounted) return null;

	return (
		<Portal>
			<View
				importantForAccessibility={
					dialog.isTop ? "auto" : "no-hide-descendants"
				}
				{...styles.layer(dialog.isTop)}
			>
				<Overlay
					visible={dialog.open}
					onPress={dialog.dismissible ? dialog.close : undefined}
				/>
				<DialogSurface
					accessibilityRole="alert"
					{...props}
					accessibilityViewIsModal={dialog.isTop}
					{...styles.surface}
					style={[styles.frame(width), style, dialog.surfaceStyle]}
				>
					{media ? <View {...styles.media}>{media}</View> : null}
					{children}
				</DialogSurface>
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
	...props
}: DialogActionsProps) {
	const styles = useDialogStyles();

	return (
		<View {...props} {...styles.actions(orientation, props)}>
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
	...props
}: DialogActionProps) {
	const styles = useDialogStyles();
	const { setOpen } = useDialogContext();
	const ghost = variant === "ghost";

	return (
		<Button
			{...props}
			variant={destructive && !ghost ? "destructive" : (variant ?? "solid")}
			{...styles.action(props)}
			onPress={(event) => {
				onPress?.(event);
				if (closeOnPress) setOpen(false);
			}}
		>
			{destructive && ghost && typeof children === "string" ? (
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					{...styles.destructiveLabel}
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
function DialogCancel({ variant = "outline", onPress, ...props }: ButtonProps) {
	const styles = useDialogStyles();
	const { setOpen } = useDialogContext();

	return (
		<Button
			{...props}
			variant={variant}
			{...styles.action(props)}
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
