import {
	StyleSheet,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { AppBar } from "@/components/ui/app-bar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

export type AppBarAction = {
	icon: IconName;
	/** Read by screen readers: "Notifications". */
	label: string;
	onPress: () => void;
	/** A number shows a counter on the icon, `true` a dot. */
	badge?: number | boolean;
};

export type ProfileAppBarProps = {
	/** The signed-in user. Gives the avatar its initials when there is no photo. */
	name: string;
	avatar?: ImageSourcePropType;
	/** Small line above the name: "Good morning". */
	greeting?: string;
	/** Makes the avatar and the name pressable, to open the profile or the account switcher. */
	onProfilePress?: () => void;
	profileLabel?: string;
	/** Up to two buttons at the end: notifications, menu. */
	actions?: AppBarAction[];
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function ProfileAppBar({
	name,
	avatar,
	greeting,
	onProfilePress,
	profileLabel = "Profile",
	actions,
	bordered = false,
	safeArea = true,
	style,
}: ProfileAppBarProps) {
	const { tokens } = useTheme();

	const identity = (
		<View style={[styles.identity, { gap: tokens.spacing[2] }]}>
			<Avatar source={avatar} name={name} size="sm" colorFromName />
			<View style={styles.shrink}>
				{greeting ? (
					<Text variant="caption" color="muted" numberOfLines={1}>
						{greeting}
					</Text>
				) : null}
				<Title variant="subheading" numberOfLines={1}>
					{name}
				</Title>
			</View>
		</View>
	);

	return (
		<AppBar bordered={bordered} safeArea={safeArea} style={style}>
			<AppBar.Leading
				style={[
					styles.shrink,
					// The row pads by spacing[1] for icon buttons; the avatar lines up with the screen margin.
					{ paddingStart: tokens.metrics.screenMargin - tokens.spacing[1] },
				]}
			>
				{onProfilePress ? (
					<Tappable
						onPress={onProfilePress}
						accessibilityRole="button"
						accessibilityLabel={`${profileLabel}, ${name}`}
						style={({ pressed }) => [styles.shrink, { opacity: pressed ? 0.6 : 1 }]}
					>
						{identity}
					</Tappable>
				) : (
					<View
						accessible
						accessibilityLabel={greeting ? `${greeting}, ${name}` : name}
						style={styles.shrink}
					>
						{identity}
					</View>
				)}
			</AppBar.Leading>
			{actions?.length ? (
				<AppBar.Actions>
					{actions.slice(0, 2).map((action, index) => (
						<ActionButton key={index} action={action} />
					))}
				</AppBar.Actions>
			) : null}
		</AppBar>
	);
}

function ActionButton({ action }: { action: AppBarAction }) {
	const button = (
		<IconButton
			icon={action.icon}
			onPress={action.onPress}
			accessibilityLabel={
				typeof action.badge === "number" && action.badge > 0
					? `${action.label}, ${action.badge}`
					: action.label
			}
		/>
	);
	if (!action.badge) return button;
	return (
		<Badge.Anchor
			badge={
				action.badge === true ? <Badge dot /> : <Badge count={action.badge} />
			}
		>
			{button}
		</Badge.Anchor>
	);
}

const styles = StyleSheet.create({
	identity: {
		flexDirection: "row",
		alignItems: "center",
	},
	shrink: {
		flexShrink: 1,
	},
});
