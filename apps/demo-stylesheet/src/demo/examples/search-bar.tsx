import { useEffect, useState } from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Item } from "@/components/ui/item";
import { SearchBar } from "@/components/ui/search-bar";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const PLACES = ["Lisbon", "Lismore", "Lisburn", "Porto", "Madrid", "Milan"];
const COUNTRIES = ["Poland", "Portugal", "Spain", "Greece"];

/** Highlights the matched part of a result, like a real search list. */
function Match({ text, query }: { text: string; query: string }) {
	const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
	if (at < 0) return <Text>{text}</Text>;

	return (
		<Text color="muted">
			{text.slice(0, at)}
			<Text weight="semibold" color="default">
				{text.slice(at, at + query.length)}
			</Text>
			{text.slice(at + query.length)}
		</Text>
	);
}

export default function SearchBarScreen() {
	const { tokens } = useTheme();
	const [disabled, setDisabled] = useState(false);
	const [query, setQuery] = useState("");
	const [submitted, setSubmitted] = useState<string | null>(null);
	const [cancelled, setCancelled] = useState(0);

	const [live, setLive] = useState("");
	const [settled, setSettled] = useState("");
	const [filter, setFilter] = useState("");

	// Stands in for a debounced request: the query settles 600ms after the last keystroke.
	useEffect(() => {
		const timeout = setTimeout(() => setSettled(live), 600);
		return () => clearTimeout(timeout);
	}, [live]);

	const loading = live !== "" && settled !== live;

	const results =
		live === ""
			? []
			: PLACES.filter((place) =>
					place.toLowerCase().includes(live.toLowerCase()),
				);
	const countries = COUNTRIES.filter((country) =>
		country.toLowerCase().includes(filter.toLowerCase()),
	);

	return (
		<Screen>
			<Panel>
				<Row label="Disabled">
					<Switch
						value={disabled}
						onValueChange={setDisabled}
						accessibilityLabel="Disabled"
					/>
				</Row>
			</Panel>

			<Section
				title="SearchBar"
				description="Cancel slides in while the field is focused."
			>
				<Panel>
					<SearchBar
						placeholder="Search places"
						value={query}
						onChangeText={setQuery}
						onSubmit={setSubmitted}
						onCancel={() => setCancelled((count) => count + 1)}
						disabled={disabled}
						trailing={
							<IconButton
								icon="settings"
								size="sm"
								accessibilityLabel="Filters"
								disabled={disabled}
							/>
						}
					/>
					<Label muted>
						{submitted
							? `Submitted “${submitted}”`
							: "Press the search key to submit."}
						{cancelled > 0 ? ` · cancelled ${cancelled}×` : ""}
					</Label>
				</Panel>
			</Section>

			<Section
				title="Live results"
				description="A spinner replaces the search icon while the request runs."
			>
				<Panel>
					<SearchBar
						placeholder="Search"
						value={live}
						onChangeText={setLive}
						loading={loading}
						disabled={disabled}
					/>
					<View style={{ gap: tokens.spacing[2] }}>
						{live === "" ? (
							<Label muted>Type “lis” to see matches.</Label>
						) : results.length === 0 ? (
							<Label muted>{`No results for “${live}”.`}</Label>
						) : (
							results.map((place) => (
								<Item
									key={place}
									size="sm"
									onPress={() => {}}
									divider="inset"
								>
									<Item.Leading>
										<Icon name="search" size="sm" color="subtle" />
									</Item.Leading>
									<Item.Content>
										<Item.Title>
											<Match text={place} query={live} />
										</Item.Title>
									</Item.Content>
								</Item>
							))
						)}
					</View>
				</Panel>
			</Section>

			<Section
				title="Filtering a local list"
				description="An outline bar, no cancel: the list below narrows as you type."
			>
				<Panel>
					<SearchBar
						variant="outline"
						showCancel={false}
						placeholder="Search countries"
						value={filter}
						onChangeText={setFilter}
						disabled={disabled}
					/>
					<View style={{ gap: tokens.spacing[2] }}>
						{countries.map((country) => (
							<Item key={country} size="sm" onPress={() => {}}>
								<Item.Content>
									<Item.Title>
										<Match text={country} query={filter} />
									</Item.Title>
								</Item.Content>
							</Item>
						))}
					</View>
				</Panel>
			</Section>

			<Section
				title="Sizes"
				description="36pt for a bar in a header, 44pt for a comfortable one."
			>
				<Panel>
					<SearchBar
						size="sm"
						showCancel={false}
						placeholder="Small"
						disabled={disabled}
					/>
					<SearchBar
						size="md"
						showCancel={false}
						placeholder="Medium"
						disabled={disabled}
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
