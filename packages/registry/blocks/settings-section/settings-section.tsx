import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

import { useSettingsSectionStyles } from "./settings-section.styles";

export type SettingsSectionProps = {
	/** Header above the rows. */
	title?: string;
	/** Note under the rows, to explain a setting. */
	footer?: string;
	/** `SettingsItem` rows. Give each one but the last a `divider`. */
	children: ReactNode;
};

/**
 * A group of settings rows, with an optional header and footer.
 *
 * @example
 * ```tsx
 * <SettingsSection title="Notifications" footer="Quiet hours mute every alert.">
 *   <SettingsItem
 *     title="Push notifications"
 *     divider
 *     trailing="switch"
 *     checked={push}
 *     onCheckedChange={setPush}
 *   />
 *   <SettingsItem
 *     icon="calendar"
 *     title="Quiet hours"
 *     value="22:00 – 07:00"
 *     onPress={() => router.push("/settings/quiet-hours")}
 *   />
 * </SettingsSection>
 * ```
 */
export function SettingsSection({
	title,
	footer,
	children,
}: SettingsSectionProps) {
	const styles = useSettingsSectionStyles();

	return (
		<View {...styles.section}>
			{title ? (
				<Text
					variant="footnote"
					color="muted"
					weight="semibold"
					accessibilityRole="header"
					{...styles.text}
				>
					{title}
				</Text>
			) : null}
			<View>{children}</View>
			{footer ? (
				<Text variant="footnote" color="muted" {...styles.text}>
					{footer}
				</Text>
			) : null}
		</View>
	);
}
