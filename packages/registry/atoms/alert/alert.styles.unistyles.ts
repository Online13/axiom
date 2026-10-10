import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";

import type { AlertActionProps, AlertProps, AlertVariant } from "./alert";

// The icon takes its color as a prop, not as a style. Wrapped once, here, so the instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const AlertIcon = withUnistyles(Icon);

export function useAlertStyles() {
	return {
		container: (
			variant: AlertVariant,
			dismissible: boolean,
			{ style }: Pick<AlertProps, "style">,
		) => ({ style: [styles.container(variant, dismissible), style] }),
		tint: (variant: AlertVariant) => ({
			uniProps: (theme: Theme) => ({
				color: theme.components.alert[variant].default.icon,
			}),
		}),
		body: { style: styles.body },
		dismiss: { style: styles.dismiss },
		action: ({ style }: Pick<AlertActionProps, "style">) => ({
			style: [styles.action, style],
		}),
		actionLabel: (variant: AlertVariant) => ({
			style: styles.actionLabel(variant),
		}),
	};
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
