import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme } from "@/theme";

import type { AlertActionProps, AlertProps, AlertVariant } from "./alert";

// The icon takes its color as a prop.
export const AlertIcon = Icon;

export function useAlertStyles() {
	const { tokens, components } = useTheme();

	return {
		container: (
			variant: AlertVariant,
			dismissible: boolean,
			{ style }: Pick<AlertProps, "style">,
		) => ({
			style: [
				styles.container,
				{
					gap: tokens.spacing[3],
					padding: tokens.spacing[4],
					paddingEnd: dismissible ? tokens.spacing[2] : tokens.spacing[4],
					borderRadius: tokens.radius.lg,
					backgroundColor: components.alert[variant].default.background,
					borderWidth: components.alert[variant].default.border
						? tokens.metrics.hairline
						: 0,
					borderColor: components.alert[variant].default.border,
				},
				style,
			],
		}),
		tint: (variant: AlertVariant) => ({
			color: components.alert[variant].default.icon,
		}),
		body: { style: [styles.body, { gap: tokens.spacing[1] }] },
		dismiss: { style: styles.dismiss },
		action: ({ style }: Pick<AlertActionProps, "style">) => ({
			style: [styles.action, { marginTop: tokens.spacing[1] }, style],
		}),
		actionLabel: (variant: AlertVariant) => ({
			style: {
				color: components.alert[variant].default.icon,
				fontWeight: FONT_WEIGHT.semibold,
			},
		}),
	};
}

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
