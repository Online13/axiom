import { useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { ScrollView, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppBar } from "@/components/ui/app-bar";
import { Chip } from "@/components/ui/chip";
import { Empty } from "@/components/ui/empty";
import { IconButton } from "@/components/ui/icon-button";
import { Scaffold } from "@/components/ui/scaffold";
import { SearchBar } from "@/components/ui/search-bar";
import { NoteCard } from "@/notes/note-card";
import {
	CATEGORIES,
	createNote,
	matchesQuery,
	sortNotes,
	useNotes,
	type CategoryId,
	type Note,
} from "@/notes/store";

// Rough height of a card, in arbitrary units: enough to keep both columns about as long.
function weight(note: Note) {
	return (
		3 +
		(note.cover ? 4 : 0) +
		(note.body ? 1 : 0) +
		Math.min(note.items.length, 8) * 0.7
	);
}

/** Masonry: each note goes into the shorter column so far, in order. */
function toColumns(notes: Note[]) {
	const columns: [Note[], Note[]] = [[], []];
	const heights = [0, 0];
	for (const note of notes) {
		const index = heights[0] <= heights[1] ? 0 : 1;
		columns[index].push(note);
		heights[index] += weight(note);
	}
	return columns;
}

export default function NotesScreen() {
	const router = useRouter();
	const { rt } = useUnistyles();
	const notes = useNotes();
	const [category, setCategory] = useState<CategoryId | null>(null);
	const [query, setQuery] = useState("");

	const visible = sortNotes(notes).filter(
		(note) =>
			(!category || note.category === category) && matchesQuery(note, query),
	);
	const columns = toColumns(visible);

	const open = (id: string) =>
		router.push({ pathname: "/note/[id]", params: { id } });

	return (
		<Scaffold
			background="default"
			safeAreaEdges={["top"]}
		>
			<Scaffold.AppBar>
				<AppBar.Row>
					<AppBar.Center inset>
						<AppBar.Title>My Notes</AppBar.Title>
					</AppBar.Center>
					<IconButton icon="more" accessibilityLabel="More" variant="tinted" />
				</AppBar.Row>
			</Scaffold.AppBar>

			<Scaffold.Content
				scrollable={visible.length > 0}
				contentContainerStyle={styles.content}
			>
				{visible.length ? (
					<Fragment>
						{/* A horizontal ScrollView gives the group no width to wrap at: one line that scrolls. */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.categories}
						>
							<Chip.Group>
								{CATEGORIES.map((item) => (
									<Chip
										key={item.id}
										leading={item.icon}
										selected={category === item.id}
										onPress={() =>
											setCategory((current) =>
												current === item.id ? null : item.id,
											)
										}
									>
										{item.label}
									</Chip>
								))}
							</Chip.Group>
						</ScrollView>
						<View style={styles.grid}>
							{columns.map((column, index) => (
								<View key={index} style={styles.column}>
									{column.map((note) => (
										<NoteCard
											key={note.id}
											note={note}
											onPress={() => open(note.id)}
										/>
									))}
								</View>
							))}
						</View>
					</Fragment>
				) : (
					<Empty fill={false} style={styles.empty}>
						<Empty.Header>
							<Empty.Media icon={query ? "search" : "file"} />
							<Empty.Title>
								{query ? "No results" : "No notes yet"}
							</Empty.Title>
							<Empty.Description>
								{query
									? `Nothing matches “${query.trim()}”.`
									: "Tap + to write your first note."}
							</Empty.Description>
						</Empty.Header>
					</Empty>
				)}
			</Scaffold.Content>

			{/* Rides on top of the keyboard while searching; the bottom inset is then the keyboard's. */}
			<KeyboardStickyView
				offset={{ closed: 0, opened: rt.insets.bottom }}
				style={styles.bar}
			>
				<IconButton
					icon="menu"
					accessibilityLabel="Menu"
					variant="outline"
					style={styles.floating}
				/>
				<SearchBar
					value={query}
					onChangeText={setQuery}
					variant="outline"
					placeholder="Search"
					containerStyle={styles.search}
				/>
				<IconButton
					icon="add"
					accessibilityLabel="New note"
					variant="solid"
					style={styles.floating}
					onPress={() => open(createNote(category ?? undefined))}
				/>
			</KeyboardStickyView>
		</Scaffold>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	content: {
		gap: theme.tokens.spacing[4],
		// The floating bar is as tall as the search field: the last cards scroll out from under it.
		paddingBottom:
			theme.tokens.sizes.input.sm +
			rt.insets.bottom +
			theme.tokens.spacing[8],
	},
	// Half a screen of trailing room, so the last chip never scrolls into a wall.
	categories: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		paddingEnd: rt.screen.width / 2,
	},
	grid: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.metrics.screenMargin,
	},
	column: {
		flex: 1,
		gap: theme.tokens.spacing[3],
	},
	empty: {
		flex: 1,
		marginBottom: theme.tokens.spacing[8],
		paddingTop: theme.tokens.spacing[12],
},
	bar: {
		position: "absolute",
		left: theme.tokens.metrics.screenMargin,
		right: theme.tokens.metrics.screenMargin,
		bottom: rt.insets.bottom + theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	floating: {
		boxShadow: "0px 4px 12px hsla(0, 0%, 0%, 0.12)",
	},
	search: {
		flex: 1,
		borderRadius: theme.tokens.radius.full,
		boxShadow: "0px 4px 12px hsla(0, 0%, 0%, 0.12)",
	},
}));
