import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { FONT_WEIGHT, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type AlertVariant = "info" | "success" | "warning" | "error" | "neutral";

export type AlertProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	variant?: AlertVariant;
	/** Short, bold summary. */
	title?: ReactNode;
	/** Description under the title: a string, or Alert.Description and Alert.Action where you want them. */
	children?: ReactNode;
	/** Each variant has a default icon; `null` removes it. */
	icon?: IconName | null;
	/** Shows a close button. Hiding the alert is up to you. */
	onDismiss?: () => void;
	/** Defaults to `assertive` for errors, so they are announced when they appear. */
	accessibilityLiveRegion?: "polite" | "assertive" | "none";
	style?: StyleProp<ViewStyle>;
};

const DEFAULT_ICON: Record<AlertVariant, IconName> = {
	info: "info",
	success: "success",
	warning: "warning",
	error: "error",
	neutral: "info",
};

const VariantContext = createContext<AlertVariant>("info");

function AlertRoot({
	variant = "info",
	title,
	children,
	icon,
	onDismiss,
	accessibilityLiveRegion,
	style,
	...props
}: AlertProps) {
	const { tokens, components } = useTheme();
	const colors = components.alert[variant].default;
	const leading = icon === undefined ? DEFAULT_ICON[variant] : icon;
	const live =
		accessibilityLiveRegion ?? (variant === "error" ? "assertive" : "none");

	return (
		<VariantContext value={variant}>
			<View
				{...props}
				accessibilityRole={variant === "error" ? "alert" : undefined}
				accessibilityLiveRegion={live}
				style={[
					styles.container,
					{
						gap: tokens.spacing[3],
						padding: tokens.spacing[4],
						paddingEnd: onDismiss ? tokens.spacing[2] : tokens.spacing[4],
						borderRadius: tokens.radius.lg,
						backgroundColor: colors.background,
						borderWidth: colors.border ? tokens.metrics.hairline : 0,
						borderColor: colors.border,
					},
					style,
				]}
			>
				{leading ? <Icon name={leading} color={colors.icon} /> : null}
				<View style={[styles.body, { gap: tokens.spacing[1] }]}>
					{typeof title === "string" ? (
						<Text variant="bodySm" weight="semibold">
							{title}
						</Text>
					) : (
						title
					)}
					{typeof children === "string" ? (
						<Text variant="bodySm" color="muted">
							{children}
						</Text>
					) : (
						children
					)}
				</View>
				{onDismiss ? (
					<IconButton
						icon="close"
						size="sm"
						accessibilityLabel="Dismiss"
						onPress={onDismiss}
						style={styles.dismiss}
					/>
				) : null}
			</View>
		</VariantContext>
	);
}

export type AlertDescriptionProps = ComponentPropsWithRef<typeof Text>;

/** The description, when it sits next to an action. A plain string child is wrapped in one for you. */
function AlertDescription(props: AlertDescriptionProps) {
	return <Text variant="bodySm" color="muted" {...props} />;
}

export type AlertActionProps = Omit<TappableProps, "children" | "style"> & {
	children: string;
	style?: StyleProp<ViewStyle>;
};

/** A text button in the alert's color. For a filled button, put a Button in its place. */
function AlertAction({ children, style, ...props }: AlertActionProps) {
	const { tokens, components } = useTheme();
	const variant = use(VariantContext);

	return (
		<Tappable
			accessibilityRole="button"
			{...props}
			style={[styles.action, { marginTop: tokens.spacing[1] }, style]}
		>
			<Text
				variant="bodySm"
				style={{
					color: components.alert[variant].default.icon,
					fontWeight: FONT_WEIGHT.semibold,
				}}
			>
				{children}
			</Text>
		</Tappable>
	);
}

export const Alert = Object.assign(AlertRoot, {
	Description: AlertDescription,
	Action: AlertAction,
});

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	body: {
		flex: 1,
	},
	action: {
		alignSelf: "flex-start",
	},
	dismiss: {
		marginTop: -6,
	},
});
