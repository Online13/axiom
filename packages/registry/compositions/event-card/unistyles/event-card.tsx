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
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type EventDetail = {
	/** An icon of your registry: add `time`, `location`… to `icons.tsx` first. */
	icon?: IconName;
	/** Already formatted: "Sat · 7:00 PM", "Brooklyn Steel". */
	label: string;
};

export type EventAttendee = {
	name: string;
	/** Without it, the avatar shows the initials of `name`. */
	avatar?: ImageSourcePropType;
};

export type EventCardProps = {
	title: string;
	image: ImageSourcePropType;
	/** Shown as a month and day tile on the photo, in the device's locale. */
	date: Date;
	/** Time, place: one line each. */
	details?: EventDetail[];
	/** The first three are shown as avatars. */
	attendees?: EventAttendee[];
	/** Total shown in "124 going". Defaults to the number of `attendees`. */
	attendeeCount?: number;
	/** After the count: "124 going". */
	attendeeLabel?: string;
	actionLabel?: string;
	/** Shows the action button, next to the attendees. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the event. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

/** Designed for a vertical feed: it takes the full width of its list, one event per row. */
export function EventCard({
	title,
	image,
	date,
	details,
	attendees,
	attendeeCount = attendees?.length ?? 0,
	attendeeLabel = "going",
	actionLabel = "Get tickets",
	onAction,
	onPress,
	style,
}: EventCardProps) {
	const month = date.toLocaleDateString(undefined, { month: "short" });
	const fullDate = date.toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${fullDate}` : undefined}
			style={style}
		>
			<Card.Media source={image} aspectRatio={16 / 9}>
				<View
					accessible
					accessibilityLabel={fullDate}
					style={styles.date}
				>
					<Text variant="caption" color="link" weight="semibold" style={styles.month}>
						{month}
					</Text>
					<Title variant="headingSm">{date.getDate()}</Title>
				</View>
			</Card.Media>
			<Card.Header style={styles.header}>
				<Title variant="headingSm" numberOfLines={2}>
					{title}
				</Title>
				{details?.map((detail, index) => (
					<View key={index} style={styles.detail}>
						{detail.icon ? <Icon name={detail.icon} size="sm" color="muted" /> : null}
						<Text variant="bodySm" color="muted" numberOfLines={1} style={styles.grow}>
							{detail.label}
						</Text>
					</View>
				))}
			</Card.Header>
			{attendeeCount > 0 || onAction ? (
				<Card.Footer style={styles.footer}>
					<View style={styles.attendees}>
						{attendees?.length ? (
							<Avatar.Group size="sm">
								{attendees.slice(0, 3).map((attendee, index) => (
									<Avatar
										key={index}
										source={attendee.avatar}
										name={attendee.name}
										colorFromName
									/>
								))}
							</Avatar.Group>
						) : null}
						{attendeeCount > 0 ? (
							<Text variant="footnote" color="muted" numberOfLines={1} style={styles.grow}>
								<Text weight="semibold" color="default">
									{attendeeCount}
								</Text>
								{` ${attendeeLabel}`}
							</Text>
						) : null}
					</View>
					{onAction ? (
						<Button
							size="sm"
							onPress={onAction}
							accessibilityLabel={`${actionLabel}, ${title}`}
						>
							{actionLabel}
						</Button>
					) : null}
				</Card.Footer>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	date: {
		minWidth: theme.tokens.sizes.control.lg,
		paddingVertical: theme.tokens.spacing[1],
		paddingHorizontal: theme.tokens.spacing[2],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.colors.background.elevated,
		alignItems: "center",
	},
	month: {
		textTransform: "uppercase",
	},

	header: {
		gap: theme.tokens.spacing[2],
	},
	detail: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},

	footer: {
		gap: theme.tokens.spacing[3],
	},
	attendees: {
		gap: theme.tokens.spacing[2],
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
