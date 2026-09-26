import {
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type ArticleAuthor = {
	name: string;
	/** Without it, the avatar shows the initials of `name`. */
	avatar?: ImageSourcePropType;
};

export type ArticleCardProps = {
	title: string;
	image: ImageSourcePropType;
	/** Above the title: "Design", "World". */
	category?: string;
	/** Up to two lines under the title. */
	excerpt?: string;
	author?: ArticleAuthor;
	/** Already formatted, under the author: "Sep 24 · 6 min read". */
	meta?: string;
	/** Makes the whole card pressable, to open the article. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

/** Designed for a vertical feed: it takes the full width of its list, one article per row. */
export function ArticleCard({
	title,
	image,
	category,
	excerpt,
	author,
	meta,
	onPress,
	style,
}: ArticleCardProps) {
	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={
				onPress ? [category, title, author?.name].filter(Boolean).join(", ") : undefined
			}
			style={style}
		>
			<Card.Media source={image} aspectRatio={16 / 9} />
			<Card.Header style={styles.header}>
				{category ? (
					<Text variant="caption" color="link" weight="semibold" style={styles.category}>
						{category}
					</Text>
				) : null}
				<Title variant="headingSm" numberOfLines={3}>
					{title}
				</Title>
				{excerpt ? (
					<Text variant="bodySm" color="muted" numberOfLines={2}>
						{excerpt}
					</Text>
				) : null}
			</Card.Header>
			{author || meta ? (
				<Card.Content style={styles.byline}>
					{author ? (
						<Avatar source={author.avatar} name={author.name} size="sm" colorFromName />
					) : null}
					<View style={styles.grow}>
						{author ? (
							<Text variant="footnote" weight="semibold" numberOfLines={1}>
								{author.name}
							</Text>
						) : null}
						{meta ? (
							<Text variant="caption" color="muted" numberOfLines={1}>
								{meta}
							</Text>
						) : null}
					</View>
				</Card.Content>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[2],
	},
	category: {
		textTransform: "uppercase",
		letterSpacing: 0.6,
	},

	byline: {
		gap: theme.tokens.spacing[3],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
