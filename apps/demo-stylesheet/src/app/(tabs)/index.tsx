import { useState } from "react";
import { View } from "react-native";

import { Scaffold } from "@/components/ui/scaffold";
import { SearchBar } from "@/components/ui/search-bar";
import { Tab } from "@/components/ui/tab";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { CatalogGroup, CatalogRow } from "@/demo/catalog";
import { CATEGORIES, groupsOf, screensOf, type Category } from "@/demo/screens";
import { useTheme } from "@/theme";

export default function ComponentsScreen() {
	const { tokens } = useTheme();
	const [category, setCategory] = useState<Category>("foundation");
	const [query, setQuery] = useState("");
	const normalizedQuery = query.trim().toLowerCase();

	return (
		<Scaffold
			background="subtle"
			safeAreaEdges={["top"]}
			keyboardAvoiding={false}
		>
			<View
				style={{
					paddingHorizontal: tokens.metrics.screenMargin,
					paddingTop: tokens.spacing[6],
					paddingBottom: tokens.spacing[4],
					gap: tokens.spacing[4],
				}}
			>
				<View style={{ gap: tokens.spacing[1] }}>
					<Title variant="headingLg">Components</Title>
					<Text color="muted">
						Browse the building blocks available in Axiom.
					</Text>
				</View>
				<SearchBar
					placeholder="Search components"
					value={query}
					onChangeText={setQuery}
					showCancel={false}
				/>
			</View>
			<Tab
				value={category}
				onValueChange={(value) => setCategory(value as Category)}
				style={{ flex: 1 }}
			>
				<Tab.List scrollable>
					{CATEGORIES.map((item) => (
						<Tab.Item key={item.value} value={item.value}>
							{item.label}
						</Tab.Item>
					))}
				</Tab.List>
				<Tab.Pager>
					{CATEGORIES.map((item) => {
						const matchingScreens = screensOf(item.value).filter(
							(screen) =>
								normalizedQuery === "" ||
								[screen.title, screen.description, screen.group].some(
									(value) =>
										value.toLowerCase().includes(normalizedQuery),
								),
						);

						return (
							<Tab.Panel key={item.value} value={item.value}>
								<Scaffold.Content
									contentContainerStyle={{
										padding: tokens.metrics.screenMargin,
										// Room for the tab bar and the theme button.
										paddingBottom: tokens.spacing[12] * 3,
										gap: tokens.spacing[8],
									}}
								>
									{matchingScreens.length === 0 ? (
										<Text color="muted">
											{`No components match "${query.trim()}" in this category.`}
										</Text>
									) : (
										groupsOf(item.value).map((group) => {
											const screens = matchingScreens.filter(
												(screen) => screen.group === group,
											);

											if (screens.length === 0) return null;

											return (
												<CatalogGroup key={group} title={group}>
													{screens.map((screen, index) => (
														<CatalogRow
															key={screen.name}
															href={`/${screen.name}`}
															title={screen.title}
															description={screen.description}
															divider={
																index < screens.length - 1
															}
														/>
													))}
												</CatalogGroup>
											);
										})
									)}
								</Scaffold.Content>
							</Tab.Panel>
						);
					})}
				</Tab.Pager>
			</Tab>
		</Scaffold>
	);
}
