import { Image, View, type ImageSourcePropType } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";

export type TrackItemProps = {
	title: string;
	artist: string;
	/** Square cover art. Without it, the row starts with `index`, if any. */
	artwork?: ImageSourcePropType;
	/** Position in an album or a playlist. Shown when there is no artwork. */
	index?: number;
	/** Length in seconds, shown as "3:45". */
	duration?: number;
	/** Adds an "E" badge before the artist. */
	explicit?: boolean;
	/** The track now playing: the title turns to the link color. */
	playing?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
	/** Shows a "more" button at the end of the row, to open the track menu. */
	onMore?: () => void;
	moreLabel?: string;
	disabled?: boolean;
};

const ARTWORK = 48;

/** 225 → "3:45", 3725 → "1:02:05". */
export function formatDuration(seconds: number): string {
	const total = Math.max(0, Math.round(seconds));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const rest = String(total % 60).padStart(2, "0");
	return hours > 0
		? `${hours}:${String(minutes).padStart(2, "0")}:${rest}`
		: `${minutes}:${rest}`;
}

export function TrackItem({
	title,
	artist,
	artwork,
	index,
	duration,
	explicit = false,
	playing = false,
	onPress,
	onLongPress,
	onMore,
	moreLabel = "More",
	disabled = false,
}: TrackItemProps) {
	const time = duration !== undefined ? formatDuration(duration) : undefined;
	const label = [
		title,
		artist,
		explicit ? "Explicit" : undefined,
		time,
		playing ? "Now playing" : undefined,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<Item
			onPress={onPress}
			onLongPress={onLongPress}
			disabled={disabled}
			accessibilityState={{ selected: playing }}
			accessibilityLabel={label}
		>
			{artwork ? (
				<Item.Leading>
					<Image source={artwork} style={styles.artwork} />
				</Item.Leading>
			) : index !== undefined ? (
				<Item.Leading style={styles.index}>
					<Text
						color={playing ? "link" : "muted"}
						weight={playing ? "semibold" : "regular"}
						style={styles.digits}
					>
						{index}
					</Text>
				</Item.Leading>
			) : null}
			<Item.Content>
				<Text
					numberOfLines={1}
					weight={playing ? "semibold" : "regular"}
					color={disabled ? "disabled" : playing ? "link" : "default"}
				>
					{title}
				</Text>
				<View style={styles.row}>
					{explicit ? (
						<Badge size="sm" variant="neutral">
							E
						</Badge>
					) : null}
					<Text
						variant="footnote"
						color={disabled ? "disabled" : "muted"}
						numberOfLines={1}
						style={styles.grow}
					>
						{artist}
					</Text>
				</View>
			</Item.Content>
			{time || onMore ? (
				<Item.Trailing>
					{time ? (
						<Text
							variant="footnote"
							color={disabled ? "disabled" : "muted"}
							style={styles.digits}
						>
							{time}
						</Text>
					) : null}
					{onMore ? (
						<IconButton
							icon="more"
							size="sm"
							color="muted"
							onPress={onMore}
							disabled={disabled}
							accessibilityLabel={`${moreLabel}, ${title}`}
						/>
					) : null}
				</Item.Trailing>
			) : null}
		</Item>
	);
}

const styles = StyleSheet.create((theme) => ({
	artwork: {
		width: ARTWORK,
		height: ARTWORK,
		borderRadius: theme.tokens.radius.sm,
	},
	index: {
		minWidth: 24,
		justifyContent: "center",
	},
	digits: {
		fontVariant: ["tabular-nums"],
	},
	row: {
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
