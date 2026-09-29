import {
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { AppBar } from "@/components/ui/app-bar";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

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
	const identity = (
		<View style={styles.identity}>
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
				style={styles.leading}
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
						<IconButton
							key={index}
							icon={action.icon}
							badge={action.badge}
							onPress={action.onPress}
							accessibilityLabel={action.label}
						/>
					))}
				</AppBar.Actions>
			) : null}
		</AppBar>
	);
}

const styles = StyleSheet.create((theme) => ({
	leading: {
		flexShrink: 1,
		// The row pads by spacing[1] for icon buttons; the avatar lines up with the screen margin.
		paddingStart: theme.tokens.metrics.screenMargin - theme.tokens.spacing[1],
	},
	identity: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	shrink: {
		flexShrink: 1,
	},
}));
