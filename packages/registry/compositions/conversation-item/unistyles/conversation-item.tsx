import { View, type ImageSourcePropType } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar, type AvatarStatus } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";

export type ConversationItemProps = {
	/** A person or a group. Gives the avatar its initials and hue when there is no photo. */
	name: string;
	avatar?: ImageSourcePropType;
	/** Presence dot on the avatar. */
	status?: AvatarStatus;
	/** The last message, up to two lines. */
	preview?: string;
	/** Already formatted: "9:41", "Yesterday". */
	time?: string;
	/** Above 0, the name turns bold and a counter shows. */
	unreadCount?: number;
	/** A muted conversation: the counter turns gray. */
	muted?: boolean;
	onPress?: () => void;
	/** Usually opens a menu: pin, mute, delete. */
	onLongPress?: () => void;
};

export function ConversationItem({
	name,
	avatar,
	status,
	preview,
	time,
	unreadCount = 0,
	muted = false,
	onPress,
	onLongPress,
}: ConversationItemProps) {
	const unread = unreadCount > 0;
	const label = [
		name,
		unread
			? `${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}`
			: undefined,
		preview,
		time,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<Item
			size="lg"
			onPress={onPress}
			onLongPress={onLongPress}
			accessibilityLabel={label}
		>
			<Item.Leading>
				<Avatar
					source={avatar}
					name={name}
					status={status}
					size="lg"
					colorFromName
				/>
			</Item.Leading>
			<Item.Content style={styles.content}>
				<View style={styles.row}>
					<Text
						weight={unread ? "semibold" : "medium"}
						numberOfLines={1}
						style={styles.grow}
					>
						{name}
					</Text>
					{time ? (
						<Text
							variant="footnote"
							color={unread && !muted ? "link" : "muted"}
						>
							{time}
						</Text>
					) : null}
				</View>
				<View style={styles.row}>
					<Text
						variant="bodySm"
						color={unread ? "default" : "muted"}
						numberOfLines={2}
						style={styles.grow}
					>
						{preview}
					</Text>
					{unread ? (
						muted ? (
							<Badge variant="neutral" size="sm">
								{unreadCount > 99 ? "99+" : String(unreadCount)}
							</Badge>
						) : (
							<Badge count={unreadCount} />
						)
					) : null}
				</View>
			</Item.Content>
		</Item>
	);
}

const styles = StyleSheet.create((theme) => ({
	content: {
		gap: theme.tokens.spacing[1],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
