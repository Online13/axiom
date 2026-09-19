import { useState } from "react";

import { Scaffold } from "@/components/ui/scaffold";
import { Tab } from "@/components/ui/tab";
import { CatalogGroup, CatalogRow } from "@/demo/catalog";
import { CATEGORIES, groupsOf, screensOf, type Category } from "@/demo/screens";
import { useTheme } from "@/theme";

export default function ComponentsScreen() {
	const { tokens } = useTheme();
	const [category, setCategory] = useState<Category>("foundation");

	return (
		<Scaffold
			background="subtle"
			safeAreaEdges={["top"]}
			keyboardAvoiding={false}
		>
			<Tab
				value={category}
				onValueChange={(value) => setCategory(value as Category)}
				style={{ flex: 1, paddingTop: tokens.spacing[2] }}
			>
				<Tab.List scrollable>
					{CATEGORIES.map((item) => (
						<Tab.Item key={item.value} value={item.value}>
							{item.label}
						</Tab.Item>
					))}
				</Tab.List>
				<Tab.Pager>
					{CATEGORIES.map((item) => (
						<Tab.Panel key={item.value} value={item.value}>
							<Scaffold.Content
								contentContainerStyle={{
									padding: tokens.metrics.screenMargin,
									// Room for the tab bar and the theme button.
									paddingBottom: tokens.spacing[12] * 3,
									gap: tokens.spacing[8],
								}}
							>
								{groupsOf(item.value).map((group) => {
									const screens = screensOf(item.value).filter(
										(screen) => screen.group === group,
									);

									return (
										<CatalogGroup key={group} title={group}>
											{screens.map((screen, index) => (
												<CatalogRow
													key={screen.name}
													href={`/${screen.name}`}
													title={screen.title}
													description={screen.description}
													divider={index < screens.length - 1}
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
