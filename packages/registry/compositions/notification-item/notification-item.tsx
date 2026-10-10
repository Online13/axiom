import { View, type ImageSourcePropType } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";

import { useNotificationItemStyles } from "./notification-item.styles";

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
	const styles = useNotificationItemStyles();
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
			{...styles.item}
		>
			<Item.Leading>
				{icon && !avatar ? (
					<View {...styles.tile}>
						<Icon name={icon} color="default" />
					</View>
				) : (
					<Avatar source={avatar} name={actor} size="md" colorFromName />
				)}
			</Item.Leading>
			<Item.Content {...styles.content}>
				<Text variant="bodySm" numberOfLines={3}>
					{actor ? (
						<Text variant="bodySm" weight="semibold">
							{actor}{" "}
						</Text>
					) : null}
					{message}
				</Text>
				{time ? (
					<Text variant="footnote" color={unread ? "link" : "muted"}>
						{time}
					</Text>
				) : null}
				{actionLabel && onAction ? (
					<View {...styles.action}>
						<Button
							size="sm"
							variant="outline"
							onPress={onAction}
							accessibilityLabel={
								actor ? `${actionLabel}, ${actor}` : actionLabel
							}
						>
							{actionLabel}
						</Button>
					</View>
				) : null}
			</Item.Content>
			{unread ? (
				<Item.Trailing {...styles.dot}>
					<Badge dot />
				</Item.Trailing>
			) : null}
		</Item>
	);
}
