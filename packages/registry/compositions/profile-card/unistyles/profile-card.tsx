import { Fragment } from "react";
import {
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type ProfileStat = {
	/** Already formatted: "12.4k". */
	value: string;
	/** Under the value: "Followers". */
	label: string;
};

export type ProfileCardProps = {
	name: string;
	/** Under the name: "@lena.m". */
	handle?: string;
	/** Without it, or while it loads, the avatar shows the initials of `name`. */
	avatar?: ImageSourcePropType;
	/** Up to three lines. */
	bio?: string;
	/** Posts, followers, following. Three fit on one line. */
	stats?: ProfileStat[];
	/** Swaps the follow button to its outlined "Following" state. */
	following?: boolean;
	followLabel?: string;
	followingLabel?: string;
	/** Shows the follow button. The card doesn't keep the state: flip `following` yourself. */
	onFollow?: () => void;
	messageLabel?: string;
	/** Shows the message button. */
	onMessage?: () => void;
	/** Makes the whole card pressable, to open the profile. The buttons keep their own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ProfileCard({
	name,
	handle,
	avatar,
	bio,
	stats,
	following = false,
	followLabel = "Follow",
	followingLabel = "Following",
	onFollow,
	messageLabel = "Message",
	onMessage,
	onPress,
	style,
}: ProfileCardProps) {
	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? name : undefined}
			style={style}
		>
			<Card.Header style={styles.header}>
				<Avatar source={avatar} name={name} size="xl" colorFromName />
				<View style={styles.identity}>
					<Title variant="headingSm" align="center" numberOfLines={1}>
						{name}
					</Title>
					{handle ? (
						<Text variant="bodySm" color="muted" numberOfLines={1}>
							{handle}
						</Text>
					) : null}
				</View>
				{bio ? (
					<Text variant="bodySm" align="center" numberOfLines={3}>
						{bio}
					</Text>
				) : null}
			</Card.Header>
			{stats?.length ? (
				<Card.Content style={styles.stats}>
					{stats.map((stat, index) => (
						<Fragment key={index}>
							{index > 0 ? (
								<Separator orientation="vertical" variant="subtle" />
							) : null}
							<View
								accessible
								accessibilityLabel={`${stat.value} ${stat.label}`}
								style={styles.stat}
							>
								<Title variant="subheading" numberOfLines={1}>
									{stat.value}
								</Title>
								<Text variant="caption" color="muted" numberOfLines={1}>
									{stat.label}
								</Text>
							</View>
						</Fragment>
					))}
				</Card.Content>
			) : null}
			{onFollow || onMessage ? (
				<Card.Content style={styles.actions}>
					{onFollow ? (
						<Button
							variant={following ? "outline" : "solid"}
							onPress={onFollow}
							accessibilityLabel={`${following ? followingLabel : followLabel}, ${name}`}
							accessibilityState={{ selected: following }}
							style={styles.grow}
						>
							{following ? followingLabel : followLabel}
						</Button>
					) : null}
					{onMessage ? (
						<Button
							variant="outline"
							onPress={onMessage}
							accessibilityLabel={`${messageLabel}, ${name}`}
							style={styles.grow}
						>
							{messageLabel}
						</Button>
					) : null}
				</Card.Content>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[3],
		alignItems: "center",
	},
	identity: {
		gap: theme.tokens.spacing[1],
		alignItems: "center",
	},

	stats: {
		flexDirection: "row",
	},
	stat: {
		gap: theme.tokens.spacing[1],
		flex: 1,
		alignItems: "center",
	},

	actions: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
	},
	grow: {
		flex: 1,
	},
}));
