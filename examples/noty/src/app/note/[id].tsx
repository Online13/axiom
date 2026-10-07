import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Image, TextInput, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Checkbox } from "@/components/ui/checkbox";
import { AppBar } from "@/components/ui/app-bar";
import { Chip } from "@/components/ui/chip";
import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Scaffold } from "@/components/ui/scaffold";
import { Text } from "@/components/ui/text";
import { TextArea } from "@/components/ui/text-area";
import {
	CATEGORIES,
	discardIfEmpty,
	newId,
	updateNote,
	useNote,
	type TodoItem,
} from "@/notes/store";

// The placeholder and the caret are props, not styles.
const ThemedTextInput = withUnistyles(TextInput, (theme) => ({
	placeholderTextColor: theme.colors.content.subtle,
	selectionColor: theme.colors.content.link,
	cursorColor: theme.colors.content.link,
}));

export default function NoteScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const note = useNote(id);

	const inputs = useRef(new Map<string, TextInput>());
	// A new todo, focused as soon as its input mounts.
	const pendingFocus = useRef<string | null>(null);

	// A note left empty isn't worth keeping.
	useEffect(() => () => discardIfEmpty(id), [id]);

	const back = (
		<IconButton
			icon="chevron-left"
			accessibilityLabel="Back"
			onPress={() => router.back()}
		/>
	);

	if (!note) {
		return (
			<Scaffold>
				<Scaffold.AppBar>
					<AppBar.Row>{back}</AppBar.Row>
				</Scaffold.AppBar>
				<Empty>
					<Empty.Header>
						<Empty.Media icon="file" />
						<Empty.Title>Note not found</Empty.Title>
						<Empty.Description>
							It may have been deleted.
						</Empty.Description>
					</Empty.Header>
				</Empty>
			</Scaffold>
		);
	}

	// Done todos move to the bottom; each group keeps its own order.
	const open = note.items.filter((item) => !item.done);
	const done = note.items.filter((item) => item.done);

	const setItems = (update: (items: TodoItem[]) => TodoItem[]) =>
		updateNote(note.id, (current) => ({ items: update(current.items) }));

	/** Adds an empty todo after `afterId`, or at the end of the open ones, and focuses it. */
	const addItem = (afterId?: string) => {
		const item: TodoItem = { id: newId(), text: "", done: false };
		setItems((items) => {
			const index = afterId
				? items.findIndex((candidate) => candidate.id === afterId) + 1
				: items.filter((candidate) => !candidate.done).length;
			return [...items.slice(0, index), item, ...items.slice(index)];
		});
		pendingFocus.current = item.id;
	};

	const removeItem = (itemId: string, focusPrevious: boolean) => {
		const index = open.findIndex((item) => item.id === itemId);
		setItems((items) => items.filter((item) => item.id !== itemId));
		// The todo above is already on screen: focus it now, before this one unmounts.
		if (focusPrevious && index > 0)
			inputs.current.get(open[index - 1].id)?.focus();
	};

	return (
		<Scaffold>
			<Scaffold.AppBar>
				<AppBar.Row>
					{back}
					{/* Empty, it pushes the pin to the end. */}
					<AppBar.Center />
					<IconButton
						icon="pin"
						accessibilityLabel={note.pinned ? "Unpin" : "Pin"}
						selected={note.pinned}
						onPress={() =>
							updateNote(note.id, (current) => ({
								pinned: !current.pinned,
							}))
						}
					/>
				</AppBar.Row>
			</Scaffold.AppBar>

			<Scaffold.Content contentContainerStyle={styles.content}>
				{note.cover ? (
					<Image
						source={{ uri: note.cover }}
						style={styles.cover}
						accessibilityIgnoresInvertColors
					/>
				) : null}

				<Chip.Group>
					{CATEGORIES.map((category) => (
						<Chip
							key={category.id}
							size="sm"
							leading={category.icon}
							selected={note.category === category.id}
							onPress={() =>
								updateNote(note.id, () => ({ category: category.id }))
							}
						>
							{category.label}
						</Chip>
					))}
				</Chip.Group>

				<ThemedTextInput
					value={note.title}
					onChangeText={(title) => updateNote(note.id, () => ({ title }))}
					placeholder="Title"
					accessibilityLabel="Title"
					multiline
					submitBehavior="blurAndSubmit"
					// A new note opens ready to type.
					autoFocus={!note.title && !note.body && !note.items.length}
					style={styles.title}
				/>

				<TextArea
					variant="plain"
					autoGrow
					minRows={2}
					maxRows={1000}
					value={note.body}
					onChangeText={(body) => updateNote(note.id, () => ({ body }))}
					placeholder="Write something…"
					accessibilityLabel="Note"
				/>

				<View style={styles.todos}>
					{[...open, ...done].map((item) => (
						<View key={item.id} style={styles.todo}>
							<Checkbox
								checked={item.done}
								accessibilityLabel={item.text || "Todo"}
								onCheckedChange={(checked) =>
									setItems((items) =>
										items.map((candidate) =>
											candidate.id === item.id
												? { ...candidate, done: checked }
												: candidate,
										),
									)
								}
							/>
							<ThemedTextInput
								ref={(input) => {
									if (!input) {
										inputs.current.delete(item.id);
										return;
									}
									inputs.current.set(item.id, input);
									if (pendingFocus.current === item.id) {
										pendingFocus.current = null;
										input.focus();
									}
								}}
								value={item.text}
								onChangeText={(text) =>
									setItems((items) =>
										items.map((candidate) =>
											candidate.id === item.id
												? { ...candidate, text }
												: candidate,
										),
									)
								}
								placeholder="To do"
								accessibilityLabel="Todo"
								returnKeyType="next"
								// Return adds the next todo and keeps the keyboard up.
								submitBehavior="submit"
								onSubmitEditing={() =>
									item.done ? undefined : addItem(item.id)
								}
								// Backspace on an empty todo removes it.
								onKeyPress={({ nativeEvent }) => {
									if (nativeEvent.key === "Backspace" && !item.text) {
										removeItem(item.id, true);
									}
								}}
								style={styles.todoText(item.done)}
							/>
						</View>
					))}

					<Tappable
						accessibilityRole="button"
						onPress={() => addItem()}
						style={styles.addTodo}
					>
						<Icon name="add" size="md" color="muted" />
						<Text color="muted">Add a todo</Text>
					</Tappable>
				</View>
			</Scaffold.Content>
		</Scaffold>
	);
}

const styles = StyleSheet.create((theme) => ({
	content: {
		gap: theme.tokens.spacing[4],
		padding: theme.tokens.metrics.screenMargin,
		paddingBottom: theme.tokens.spacing[12],
	},
	cover: {
		width: "100%",
		aspectRatio: 16 / 9,
		borderRadius: theme.tokens.radius.lg,
		borderCurve: "continuous",
	},
	title: {
		...theme.tokens.typography.title1,
		color: theme.colors.content.default,
		padding: 0,
	},
	todos: {
		gap: theme.tokens.spacing[1],
	},
	todo: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	todoText: (done: boolean) => ({
		...theme.tokens.typography.callout,
		flex: 1,
		paddingVertical: theme.tokens.spacing[2],
		color: done ? theme.colors.content.muted : theme.colors.content.default,
		textDecorationLine: done ? "line-through" : "none",
	}),
	addTodo: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		minHeight: theme.tokens.metrics.touchTarget,
		paddingHorizontal: theme.tokens.spacing[3],
	},
}));
