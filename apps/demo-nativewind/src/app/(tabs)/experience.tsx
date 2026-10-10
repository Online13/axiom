import { useState } from "react";

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
import { useTheme } from "@/theme";
import { View } from "react-native";
import { SearchBar } from "@/components/ui/search-bar";

export default function ExperienceScreen() {
	const { tokens, colors } = useTheme();
	const [section, setSection] = useState<ExperienceSection>("behaviors");
	const [query, setQuery] = useState("");
	const normalizedQuery = query.trim().toLowerCase();

	return (
		<Scaffold background="subtle" safeAreaEdges={["top"]}>
			<AppBar
				safeArea={false}
				style={{ backgroundColor: colors.background.subtle }}
			>
				<AppBar.Expanded
					style={{ paddingTop: tokens.spacing[6], gap: tokens.spacing[4] }}
				>
					<View style={{ gap: tokens.spacing[1] }}>
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
				style={{ flex: 1, paddingTop: tokens.spacing[2] }}
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
							<Scaffold.Content
								contentContainerStyle={{
									padding: tokens.metrics.screenMargin,
									// Room for the tab bar and the theme button.
									paddingBottom: tokens.spacing[12] * 3,
									gap: tokens.spacing[8],
								}}
							>
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
