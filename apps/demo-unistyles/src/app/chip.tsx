import { useState } from "react";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Chip } from "@/components/ui/chip";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const FILTERS = [
	"Unread",
	"Starred",
	"Attachments",
	"From me",
	"This week",
	"Large files",
];

export default function ChipScreen() {
	const [filters, setFilters] = useState<Set<string>>(new Set(["Unread"]));
	const [tags, setTags] = useState(["Travel", "Food", "Family"]);
	const toggleFilter = (filter: string) =>
		setFilters((previous) => {
			const next = new Set(previous);
			if (next.has(filter)) next.delete(filter);
			else next.add(filter);
			return next;
		});

	return (
		<Screen>
			<Section title="Chip" description="Filters toggle, tags remove.">
				<Panel>
					<Label muted>Filters, scrolling</Label>
				</Panel>
				{/* A horizontal ScrollView gives the group no width to wrap at: one line that scrolls. */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.bleed}
					contentContainerStyle={styles.rail}
				>
					<Chip.Group>
						{FILTERS.map((filter) => (
							<Chip
								key={filter}
								selected={filters.has(filter)}
								onPress={() => toggleFilter(filter)}
							>
								{filter}
							</Chip>
						))}
					</Chip.Group>
				</ScrollView>
				<Panel>
					<Label muted>Tags, wrapping</Label>
					<Chip.Group>
						{tags.map((tag) => (
							<Chip
								key={tag}
								variant="filled"
								onRemove={() =>
									setTags((previous) =>
										previous.filter((t) => t !== tag),
									)
								}
							>
								{tag}
							</Chip>
						))}
						<Chip
							leading="add"
							onPress={() =>
								setTags((previous) => [
									...previous,
									`Tag ${previous.length + 1}`,
								])
							}
						>
							Add
						</Chip>
						<Chip size="sm" trailing="chevron-down" onPress={() => {}}>
							Sort
						</Chip>
						<Chip disabled onPress={() => {}}>
							Disabled
						</Chip>
					</Chip.Group>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	bleed: { marginHorizontal: -theme.tokens.metrics.screenMargin },
	// Half a screen of trailing room, so the last chip never scrolls into a wall.
	rail: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		paddingEnd: rt.screen.width / 2,
	},
}));
