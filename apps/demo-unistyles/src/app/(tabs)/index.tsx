import { useState } from "react";
import { StyleSheet } from "react-native-unistyles";

import { Scaffold } from "@/components/ui/scaffold";
import { Tab } from "@/components/ui/tab";
import { CatalogGroup, CatalogRow } from "@/demo/catalog";
import { CATEGORIES, groupsOf, screensOf, type Category } from "@/demo/screens";

export default function ComponentsScreen() {
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
				style={styles.tabs}
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
							<Scaffold.Content contentContainerStyle={styles.content}>
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

const styles = StyleSheet.create((theme) => ({
	tabs: { flex: 1, paddingTop: theme.tokens.spacing[2] },
	content: {
		padding: theme.tokens.metrics.screenMargin,
		// Room for the tab bar and the theme button.
		paddingBottom: theme.tokens.spacing[12] * 3,
		gap: theme.tokens.spacing[8],
	},
}));
