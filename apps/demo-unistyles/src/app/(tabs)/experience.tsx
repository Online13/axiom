import { useState } from "react";
import { StyleSheet } from "react-native-unistyles";

import { AppBar } from "@/components/ui/app-bar";
import { Scaffold } from "@/components/ui/scaffold";
import { Tab } from "@/components/ui/tab";
import { CatalogGroup, CatalogRow } from "@/demo/catalog";
import {
	SECTIONS,
	STATUS_LABEL,
	experiencesOf,
	groupsOfSection,
	type ExperienceSection,
} from "@/demo/experiences";
import { View } from "react-native";
import { SearchBar } from "@/components/ui/search-bar";

export default function ExperienceScreen() {
	const [section, setSection] = useState<ExperienceSection>("behaviors");
	const [query, setQuery] = useState("");
	const normalizedQuery = query.trim().toLowerCase();

	return (
		<Scaffold background="subtle" safeAreaEdges={["top"]}>
			<AppBar safeArea={false} style={styles.bar}>
				<AppBar.Expanded style={styles.header}>
					<View style={styles.heading}>
						<AppBar.Title size="medium">Experience</AppBar.Title>
						<AppBar.Subtitle size="large" numberOfLines={2}>
							Explore the different aspects of the user experience.
						</AppBar.Subtitle>
					</View>
					<SearchBar
						placeholder="Search components"
						value={query}
						onChangeText={setQuery}
					/>
				</AppBar.Expanded>
			</AppBar>
			<Tab
				value={section}
				onValueChange={(value) => setSection(value as ExperienceSection)}
				style={styles.tabs}
			>
				<Tab.List>
					{SECTIONS.map((item) => (
						<Tab.Item key={item.value} value={item.value}>
							{item.label}
						</Tab.Item>
					))}
				</Tab.List>
				<Tab.Pager>
					{SECTIONS.map((item) => (
						<Tab.Panel key={item.value} value={item.value}>
							<Scaffold.Content contentContainerStyle={styles.content}>
								{groupsOfSection(item.value).map((group) => {
									const entries = experiencesOf(item.value).filter(
										(experience) =>
											experience.group === group &&
											(normalizedQuery === "" ||
												experience.title
													.toLocaleLowerCase()
													.includes(normalizedQuery)),
									);

									return (
										<CatalogGroup key={group} title={group}>
											{entries.map((experience, index) => (
												<CatalogRow
													key={experience.slug}
													href={`/experiences/${experience.slug}`}
													title={experience.title}
													description={experience.description}
													badge={STATUS_LABEL[experience.status]}
													divider={index < entries.length - 1}
												/>
											))}
										</CatalogGroup>
									);
								})}
							</Scaffold.Content>
						</Tab.Panel>
					))}
				</Tab.Pager>
			</Tab>
		</Scaffold>
	);
}

const styles = StyleSheet.create((theme) => ({
	bar: { backgroundColor: theme.colors.background.subtle },
	header: {
		paddingTop: theme.tokens.spacing[6],
		gap: theme.tokens.spacing[4],
	},
	heading: { gap: theme.tokens.spacing[1] },
	tabs: { flex: 1, paddingTop: theme.tokens.spacing[2] },
	content: {
		padding: theme.tokens.metrics.screenMargin,
		// Room for the tab bar and the theme button.
		paddingBottom: theme.tokens.spacing[12] * 3,
		gap: theme.tokens.spacing[8],
	},
}));
