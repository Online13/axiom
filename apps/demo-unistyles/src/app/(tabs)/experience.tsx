import { useState } from "react";
import { StyleSheet } from "react-native-unistyles";

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

export default function ExperienceScreen() {
	const [section, setSection] = useState<ExperienceSection>("behaviors");

	return (
		<Scaffold
			background="subtle"
			safeAreaEdges={["top"]}
			keyboardAvoiding={false}
		>
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
										(experience) => experience.group === group,
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
	tabs: { flex: 1, paddingTop: theme.tokens.spacing[2] },
	content: {
		padding: theme.tokens.metrics.screenMargin,
		// Room for the tab bar and the theme button.
		paddingBottom: theme.tokens.spacing[12] * 3,
		gap: theme.tokens.spacing[8],
	},
}));
