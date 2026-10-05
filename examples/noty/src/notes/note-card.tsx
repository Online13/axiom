import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Card } from "@/components/ui/card";
import { CheckboxIndicator } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { categoryOf, type Note } from "./store";

// A card stays readable at a glance: the rest of a long checklist is in the note.
const MAX_ITEMS = 8;

export type NoteCardProps = {
	note: Note;
	onPress: () => void;
};

export function NoteCard({ note, onPress }: NoteCardProps) {
	const category = categoryOf(note.category);
	const done = note.items.filter((item) => item.done).length;
	const total = note.items.length;
	// Done items go last, as in the note itself.
	const items = [...note.items]
		.sort((a, b) => Number(a.done) - Number(b.done))
		.slice(0, MAX_ITEMS);

	return (
		<Card
			variant="elevated"
			padding={3}
			onPress={onPress}
			accessibilityLabel={`${note.title || "Untitled"}, ${category.label}${
				total ? `, ${done} of ${total} done` : ""
			}`}
			style={styles.card}
		>
			<View style={styles.meta}>
				<Icon name={category.icon} size={14} color="muted" />
				<Text variant="caption" color="muted" style={styles.category}>
					{category.label}
				</Text>
				{note.pinned ? <Icon name="pin" size={14} color="muted" /> : null}
			</View>

			{note.cover ? (
				<Card.Media
					source={{ uri: note.cover }}
					aspectRatio={4 / 3}
					style={styles.cover}
				/>
			) : null}

			<Title variant="subheading" numberOfLines={3}>
				{note.title || "Untitled"}
			</Title>

			{note.body ? (
				<Text variant="bodySm" color="muted" numberOfLines={3}>
					{note.body}
				</Text>
			) : null}

			{items.length ? (
				<View style={styles.items}>
					{items.map((item) => (
						<View key={item.id} style={styles.item}>
							<View style={styles.indicator}>
								<CheckboxIndicator checked={item.done} />
							</View>
							<Text
								variant="footnote"
								color={item.done ? "muted" : "default"}
								numberOfLines={1}
								style={styles.itemText(item.done)}
							>
								{item.text}
							</Text>
						</View>
					))}
				</View>
			) : null}

			{done > 0 ? (
				<View style={styles.track}>
					<View style={styles.progress(done / total)} />
				</View>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	card: {
		gap: theme.tokens.spacing[2],
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	category: {
		flex: 1,
	},
	cover: {
		borderRadius: theme.tokens.radius.md,
		borderCurve: "continuous",
		overflow: "hidden",
	},
	items: {
		gap: theme.tokens.spacing[1],
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	// The indicator is sized for a form row; scaled down, it reads as a card preview.
	indicator: {
		transform: [{ scale: 0.7 }],
		marginHorizontal: -3,
		marginVertical: -3,
	},
	itemText: (done: boolean) => ({
		flex: 1,
		textDecorationLine: done ? "line-through" : "none",
	}),
	track: {
		height: 4,
		borderRadius: theme.tokens.radius.full,
		backgroundColor: theme.colors.border.subtle,
		overflow: "hidden",
	},
	progress: (ratio: number) => ({
		width: `${ratio * 100}%`,
		height: "100%",
		backgroundColor: theme.colors.feedback.success,
	}),
}));
