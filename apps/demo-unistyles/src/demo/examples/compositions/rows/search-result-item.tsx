import { useState } from "react";

import { SearchResultItem } from "@/components/compositions/search-result-item";
import { SearchBar } from "@/components/ui/search-bar";
import { Text } from "@/components/ui/text";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars, images } from "../fixtures";
import { List, notify } from "../shared";

const RESULTS = [
	{
		id: "1",
		title: "Midnight City",
		subtitle: "Song · M83",
		image: images.skyline,
	},
	{
		id: "2",
		title: "Midlake",
		subtitle: "Artist",
		image: avatars.noah,
		circle: true,
	},
	{
		id: "3",
		title: "Mild High Club",
		subtitle: "Artist",
		image: avatars.sam,
		circle: true,
	},
	{
		id: "4",
		title: "Summer Mix",
		subtitle: "Playlist",
		image: images.mountains,
	},
];

export default function SearchResultItemScreen() {
	const [query, setQuery] = useState("mi");
	const normalized = query.trim().toLowerCase();
	const results = RESULTS.filter((result) =>
		result.title.toLowerCase().includes(normalized),
	);

	return (
		<Screen>
			<Section
				title="SearchResultItem"
				description="Type to filter: the query is highlighted in each title."
			>
				<SearchBar
					value={query}
					onChangeText={setQuery}
					placeholder="Search music"
					showCancel={false}
				/>
				{results.length === 0 ? (
					<Text color="muted">{`No results for "${query.trim()}".`}</Text>
				) : (
					<List>
						{results.map((result) => (
							<SearchResultItem
								key={result.id}
								title={result.title}
								query={query}
								subtitle={result.subtitle}
								image={result.image}
								imageShape={result.circle ? "circle" : "square"}
								action={{
									icon: "add",
									label: "Add to library",
									onPress: notify(`${result.title} added`),
								}}
								onPress={notify(`Open ${result.title}`)}
							/>
						))}
					</List>
				)}
			</Section>

			<Section
				title="Recent searches"
				description="An icon instead of an image."
			>
				<List>
					<SearchResultItem
						title="midnight playlists"
						icon="search"
						onPress={notify("Search")}
					/>
					<SearchResultItem
						title="daft punk live"
						icon="search"
						onPress={notify("Search")}
					/>
				</List>
			</Section>
		</Screen>
	);
}
