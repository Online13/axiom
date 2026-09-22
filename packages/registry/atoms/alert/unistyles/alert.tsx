import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { FONT_WEIGHT, Text } from "@/components/ui/text";

export type AlertVariant = "info" | "success" | "warning" | "error" | "neutral";

export type AlertProps = {
	variant?: AlertVariant;
	/** Short, bold summary. */
	title?: ReactNode;
	/** Description under the title. */
	children?: ReactNode;
	/** Each variant has a default icon; `null` removes it. */
	icon?: IconName | null;
	/** A text action under the description. */
	action?: { label: string; onPress: () => void };
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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so the instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function Alert({
	variant = "info",
	title,
	children,
	icon,
	action,
	onDismiss,
	accessibilityLiveRegion,
	style,
}: AlertProps) {
	const leading = icon === undefined ? DEFAULT_ICON[variant] : icon;
	const live =
		accessibilityLiveRegion ?? (variant === "error" ? "assertive" : "none");

	return (
		<View
			accessibilityRole={variant === "error" ? "alert" : undefined}
			accessibilityLiveRegion={live}
			style={[styles.container(variant, onDismiss !== undefined), style]}
		>
			{leading ? (
				<ThemedIcon
					name={leading}
					uniProps={(theme) => ({
						color: theme.components.alert[variant].default.icon,
					})}
				/>
			) : null}
			<View style={styles.body}>
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
				{action ? (
					<Tappable onPress={action.onPress} style={styles.action}>
						<Text variant="bodySm" style={styles.actionLabel(variant)}>
							{action.label}
						</Text>
					</Tappable>
				) : null}
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
	);
}

const styles = StyleSheet.create((theme) => ({
	container: (variant: AlertVariant, dismissible: boolean) => {
		const colors = theme.components.alert[variant].default;
		return {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: theme.tokens.spacing[3],
			padding: theme.tokens.spacing[4],
			paddingEnd: dismissible
				? theme.tokens.spacing[2]
				: theme.tokens.spacing[4],
			borderRadius: theme.tokens.radius.lg,
			backgroundColor: colors.background,
			borderWidth: colors.border ? theme.tokens.metrics.hairline : 0,
			borderColor: colors.border,
		};
	},
	body: {
		flex: 1,
		gap: theme.tokens.spacing[1],
	},
	action: {
		alignSelf: "flex-start",
		marginTop: theme.tokens.spacing[1],
	},
	actionLabel: (variant: AlertVariant) => ({
		color: theme.components.alert[variant].default.icon,
		fontWeight: FONT_WEIGHT.semibold,
	}),
	dismiss: {
		marginTop: -6,
	},
}));
