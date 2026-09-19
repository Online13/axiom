import { useState } from "react";

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

export default function ExperienceScreen() {
	const { tokens } = useTheme();
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
				style={{ paddingTop: tokens.spacing[2] }}
			>
				<Tab.List>
					{SECTIONS.map((item) => (
						<Tab.Item key={item.value} value={item.value}>
							{item.label}
						</Tab.Item>
					))}
				</Tab.List>
			</Tab>
			<Scaffold.Content
				contentContainerStyle={{
					padding: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[12] * 3,
					gap: tokens.spacing[8],
				}}
			>
				{groupsOfSection(section).map((group) => {
					const entries = experiencesOf(section).filter(
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
		</Scaffold>
	);
}
