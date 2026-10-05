import { useSyncExternalStore } from "react";

import type { IconName } from "@/components/ui/icon";

export type CategoryId = "work" | "personal" | "fitness" | "family" | "home";

export const CATEGORIES: { id: CategoryId; label: string; icon: IconName }[] = [
	{ id: "work", label: "Work", icon: "work" },
	{ id: "personal", label: "Personal", icon: "person" },
	{ id: "fitness", label: "Fitness", icon: "fitness" },
	{ id: "family", label: "Family", icon: "family" },
	{ id: "home", label: "Home", icon: "home" },
];

export function categoryOf(id: CategoryId) {
	return CATEGORIES.find((category) => category.id === id)!;
}

export type TodoItem = { id: string; text: string; done: boolean };

export type Note = {
	id: string;
	title: string;
	body: string;
	category: CategoryId;
	/** Remote image shown on top of the note. */
	cover?: string;
	pinned: boolean;
	items: TodoItem[];
};

let counter = 0;
export function newId() {
	counter += 1;
	return `${Date.now().toString(36)}-${counter}`;
}

function todos(done: number, texts: string[]): TodoItem[] {
	return texts.map((text, index) => ({
		id: newId(),
		text,
		done: index < done,
	}));
}

// In memory for now: the notes come back to this seed on every launch.
const SEED: Note[] = [
	{
		id: newId(),
		title: "🏖️ Leaving home for vacation",
		body: "A final walkthrough before leaving home for a vacation.",
		category: "family",
		cover:
			"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
		pinned: true,
		items: todos(0, [
			"Empty the refrigerator of perishables",
			"Take out all trash",
			"Run the dishwasher",
			"Turn off stove and oven",
			"Close and lock windows",
			"Adjust heating or AC",
			"Unplug non-essential electronics",
			"Water houseplants",
		]),
	},
	{
		id: newId(),
		title: "🏠 Prepare a property listing",
		body: "Prepare and publish a new real estate listing.",
		category: "work",
		pinned: false,
		items: todos(4, [
			"Request property documents",
			"Measure floor area",
			"Take exterior photos",
			"Take interior photos",
			"Create floor plan",
			"Write listing description",
			"Publish listing",
			"Share on portals",
		]),
	},
	{
		id: newId(),
		title: "🏋️ Upper body day",
		body: "A complete upper body session, about an hour.",
		category: "fitness",
		cover:
			"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600",
		pinned: false,
		items: todos(1, [
			"Warm up, 10 min",
			"Bench press 4×8",
			"Pull-ups 4×6",
			"Shoulder press 3×10",
		]),
	},
	{
		id: newId(),
		title: "🏡 Turn over the Airbnb",
		body: "Get the apartment ready between guest stays.",
		category: "work",
		cover:
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
		pinned: false,
		items: todos(0, [
			"Inspect for damage",
			"Replace bed linens",
			"Restock toiletries",
			"Check the smoke detector",
		]),
	},
	{
		id: newId(),
		title: "📚 Books to read",
		body: "Project Hail Mary, then The Left Hand of Darkness. Ask Léa for her list.",
		category: "personal",
		pinned: false,
		items: [],
	},
];

// Starts empty to show the empty state. Set to `SEED` to bring the sample notes back.
let notes: Note[] = [];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function commit(next: Note[]) {
	notes = next;
	listeners.forEach((listener) => listener());
}

const getNotes = () => notes;

export function useNotes() {
	return useSyncExternalStore(subscribe, getNotes);
}

export function useNote(id: string | undefined) {
	return useSyncExternalStore(subscribe, () =>
		notes.find((note) => note.id === id),
	);
}

export function createNote(category: CategoryId = "personal") {
	const note: Note = {
		id: newId(),
		title: "",
		body: "",
		category,
		pinned: false,
		items: [],
	};
	commit([note, ...notes]);
	return note.id;
}

export function updateNote(id: string, update: (note: Note) => Partial<Note>) {
	commit(
		notes.map((note) => (note.id === id ? { ...note, ...update(note) } : note)),
	);
}

/** Drops a note left without a title, a body or a todo, like one opened by mistake. */
export function discardIfEmpty(id: string) {
	const note = notes.find((candidate) => candidate.id === id);
	const empty =
		note &&
		!note.title.trim() &&
		!note.body.trim() &&
		note.items.every((item) => !item.text.trim());
	if (empty) commit(notes.filter((candidate) => candidate.id !== id));
}

/** Pinned notes first; the order of the others doesn't change. */
export function sortNotes(list: Note[]) {
	return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export function matchesQuery(note: Note, query: string) {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return [note.title, note.body, ...note.items.map((item) => item.text)].some(
		(text) => text.toLowerCase().includes(needle),
	);
}
