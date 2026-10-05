import { useState } from "react";

import { SearchAppBar } from "@/components/compositions/search-app-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { Bleed, notify } from "../shared";

export default function SearchAppBarScreen() {
	const [query, setQuery] = useState("");
	const [modalQuery, setModalQuery] = useState("");
	const [cancelQuery, setCancelQuery] = useState("");

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
					>
						<IconButton
							icon="filter"
							badge={2}
							accessibilityLabel="Filters"
							onPress={notify("Filters")}
						/>
					</SearchAppBar>
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
			<Section
				title="With Cancel"
				description="onCancel slides a Cancel button in while the field is focused."
			>
				<Bleed>
					<SearchAppBar
						value={cancelQuery}
						onChangeText={setCancelQuery}
						placeholder="Search messages"
						safeArea={false}
						onCancel={() => setCancelQuery("")}
					/>
				</Bleed>
			</Section>
		</Screen>
	);
}
