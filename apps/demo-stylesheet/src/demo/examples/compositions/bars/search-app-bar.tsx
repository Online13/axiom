import { useState } from "react";

import { SearchAppBar } from "@/components/compositions/search-app-bar";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { Bleed, notify } from "../shared";

export default function SearchAppBarScreen() {
	const [query, setQuery] = useState("");
	const [modalQuery, setModalQuery] = useState("");

	return (
		<Screen>
			<Section
				title="SearchAppBar"
				description="A search field as the bar, with back and filters."
			>
				<Bleed>
					<SearchAppBar
						value={query}
						onChangeText={setQuery}
						placeholder="Search products"
						safeArea={false}
						onNavigate={notify("Back")}
						actions={[
							{
								icon: "filter",
								label: "Filters",
								badge: 2,
								onPress: notify("Filters"),
							},
						]}
					/>
				</Bleed>
			</Section>

			<Section
				title="In a modal"
				description="navigation=close, for a search opened over the screen."
			>
				<Bleed>
					<SearchAppBar
						value={modalQuery}
						onChangeText={setModalQuery}
						placeholder="Search places"
						safeArea={false}
						navigation="close"
						onNavigate={notify("Close")}
					/>
				</Bleed>
			</Section>
		</Screen>
	);
}
