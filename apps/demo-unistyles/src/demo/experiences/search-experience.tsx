import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { SearchBar } from "@/components/ui/search-bar";
import { Text } from "@/components/ui/text";

import { ExperienceScreen, ListRow, Note } from "./shared";

const CITIES = [
	"Lisbon",
	"Lyon",
	"London",
	"Madrid",
	"Marseille",
	"Milan",
	"Munich",
	"Nantes",
	"Naples",
	"Nice",
	"Paris",
	"Porto",
	"Prague",
	"Rome",
	"Rotterdam",
];

// Long enough to skip the keystrokes of a fast typist, short enough not to feel late.
const DEBOUNCE = 300;

export default function SearchExperienceScreen() {

	const [query, setQuery] = useState("");
	const [focused, setFocused] = useState(false);
	const [answer, setAnswer] = useState<{
		query: string;
		results: string[];
	} | null>(null);
	const [recents, setRecents] = useState<string[]>(["Porto", "Milan"]);
	const [counts, setCounts] = useState({
		keystrokes: 0,
		requests: 0,
		stale: 0,
	});

	// Only the newest request may write to the screen.
	const latest = useRef(0);

	const text = query.trim();
	// Results belong to a query: anything older is just not shown.
	const results =
		text !== "" && answer?.query === text ? answer.results : null;
	const loading = text !== "" && results === null;

	useEffect(() => {
		if (text === "") return;

		const timer = setTimeout(async () => {
			const id = ++latest.current;
			setCounts((current) => ({
				...current,
				requests: current.requests + 1,
			}));
			await new Promise((resolve) =>
				setTimeout(resolve, 200 + Math.random() * 600),
			);

			if (id !== latest.current) {
				setCounts((current) => ({ ...current, stale: current.stale + 1 }));
				return;
			}

			setAnswer({
				query: text,
				results: CITIES.filter((city) =>
					city.toLowerCase().includes(text.toLowerCase()),
				),
			});
		}, DEBOUNCE);

		return () => clearTimeout(timer);
	}, [text]);

	const open = (city: string) => {
		setRecents((current) =>
			[city, ...current.filter((item) => item !== city)].slice(0, 5),
		);
		setQuery("");
		setFocused(false);
	};

	const showRecents = focused && text === "";

	return (
		<ExperienceScreen>
			<View style={styles.field}>
				<SearchBar
					value={query}
					onChangeText={(text) => {
						setQuery(text);
						setCounts((current) => ({
							...current,
							keystrokes: current.keystrokes + 1,
						}));
					}}
					onFocus={() => setFocused(true)}
					onCancel={() => {
						setFocused(false);
						setQuery("");
					}}
					loading={loading}
					placeholder="Search a city"
				/>
			</View>

			<ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
				{showRecents ? (
					<>
						<Note>Recent searches, while the field is empty.</Note>
						{recents.length === 0 ? (
							<Text
								variant="bodySm"
								color="muted"
								style={styles.field}
							>
								No recent search yet.
							</Text>
						) : (
							recents.map((city) => (
								<ListRow
									key={city}
									title={city}
									trailing={
										<Icon
											name="chevron-right"
											size="sm"
											color="muted"
										/>
									}
									onPress={() => open(city)}
								/>
							))
						)}
					</>
				) : results === null ? (
					<Note>
						{loading
							? "Searching…"
							: `Start typing: the request leaves ${DEBOUNCE}ms after the last keystroke, not on every letter.`}
					</Note>
				) : results.length === 0 ? (
					<Empty size="sm">
						<Empty.Media icon="search" />
						<Empty.Header>
							<Empty.Title>No city matches “{text}”</Empty.Title>
							<Empty.Description>
								Check the spelling, or search a country instead.
							</Empty.Description>
						</Empty.Header>
					</Empty>
				) : (
					results.map((city) => (
						<ListRow
							key={city}
							title={city}
							subtitle="Tap to open and save the query"
							onPress={() => open(city)}
						/>
					))
				)}
			</ScrollView>

			<View style={styles.counts}>
				<Text variant="footnote" color="muted">
					{counts.keystrokes} keystrokes · {counts.requests} requests ·{" "}
					{counts.stale} stale answers ignored
				</Text>
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	field: { padding: theme.tokens.metrics.screenMargin },
	counts: { padding: theme.tokens.metrics.screenMargin, gap: 2 },
}));
