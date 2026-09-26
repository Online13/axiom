import {
	StyleSheet,
	View,
	type ImageSourcePropType,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type NotificationItemProps = {
	/** Who the notification is about, in bold before the message: "Lena Moreau". */
	actor?: string;
	/** "liked your photo." Up to three lines. */
	message: string;
	/** Already formatted: "2m", "Yesterday". */
	time?: string;
	/** The actor's photo. */
	avatar?: ImageSourcePropType;
	/** A system notification: the icon on a tinted tile, in place of the avatar. */
	icon?: IconName;
	/** Adds a dot at the end of the row and "Unread" for screen readers. */
	unread?: boolean;
	/** Button under the message: "Follow back", "Accept". */
	actionLabel?: string;
	onAction?: () => void;
	onPress?: () => void;
	onLongPress?: () => void;
};

const TILE = 40;

export function NotificationItem({
	actor,
	message,
	time,
	avatar,
	icon,
	unread = false,
	actionLabel,
	onAction,
	onPress,
	onLongPress,
}: NotificationItemProps) {
	const { tokens, colors } = useTheme();
	const label = [
		unread ? "Unread" : undefined,
		actor ? `${actor} ${message}` : message,
		time,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<Item
			align="start"
			onPress={onPress}
			onLongPress={onLongPress}
			accessibilityLabel={label}
			style={{ paddingVertical: tokens.spacing[3] }}
		>
			<Item.Leading>
				{icon && !avatar ? (
					<View
						style={[
							styles.tile,
							{
								borderRadius: tokens.radius.full,
								backgroundColor: colors.primary.subtle,
							},
						]}
					>
						<Icon name={icon} color="default" />
					</View>
				) : (
					<Avatar
						source={avatar}
						name={actor}
						size="md"
						colorFromName
					/>
				)}
			</Item.Leading>
			<Item.Content style={{ gap: tokens.spacing[1] }}>
				<Text variant="bodySm" numberOfLines={3}>
					{actor ? <Text variant="bodySm" weight="semibold">{actor} </Text> : null}
					{message}
				</Text>
				{time ? (
					<Text variant="footnote" color={unread ? "link" : "muted"}>
						{time}
					</Text>
				) : null}
				{actionLabel && onAction ? (
					<View style={[styles.action, { paddingTop: tokens.spacing[1] }]}>
						<Button
							size="sm"
							variant="outline"
							onPress={onAction}
							accessibilityLabel={actor ? `${actionLabel}, ${actor}` : actionLabel}
						>
							{actionLabel}
						</Button>
					</View>
				) : null}
			</Item.Content>
			{unread ? (
				<Item.Trailing style={{ paddingTop: tokens.spacing[2] }}>
					<Badge dot />
				</Item.Trailing>
			) : null}
		</Item>
	);
}

const styles = StyleSheet.create({
	tile: {
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
	},
	action: {
		flexDirection: "row",
	},
});
