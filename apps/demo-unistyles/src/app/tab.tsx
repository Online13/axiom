import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Tab } from "@/components/ui/tab";
import { Text } from "@/components/ui/text";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const ACTIVITY = {
	all: "Everything that happened today.",
	mentions: "Only the messages naming you.",
	requests: "Two people are waiting for access.",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July"];

export default function TabScreen() {

	const [section, setSection] = useState<keyof typeof ACTIVITY>("all");
	const [view, setView] = useState("list");
	const [month, setMonth] = useState("March");
	const [swipeSection, setSwipeSection] = useState("all");

	return (
		<Screen>
			<Section
				title="Tab"
				description="An indicator slides under the selected label."
			>
				<Panel>
					<Tab
						value={section}
						onValueChange={(value) =>
							setSection(value as keyof typeof ACTIVITY)
						}
					>
						<Tab.List>
							<Tab.Item value="all">All</Tab.Item>
							<Tab.Item value="mentions">Mentions</Tab.Item>
							<Tab.Item value="requests" badge={2}>
								Requests
							</Tab.Item>
						</Tab.List>
						<Tab.Content style={styles.content}>
							{Object.entries(ACTIVITY).map(([value, description]) => (
								<Tab.Panel key={value} value={value}>
									<Text variant="bodySm" color="muted">
										{description}
									</Text>
								</Tab.Panel>
							))}
						</Tab.Content>
					</Tab>
				</Panel>
			</Section>

			<Section
				title="Pill"
				description="A capsule behind the label, for a filter inside a screen."
			>
				<Panel>
					<Tab value={view} onValueChange={setView}>
						<Tab.List variant="pill">
							<Tab.Item value="list" icon="file">
								List
							</Tab.Item>
							<Tab.Item value="grid" icon="image">
								Grid
							</Tab.Item>
							<Tab.Item value="map" disabled>
								Map
							</Tab.Item>
						</Tab.List>
					</Tab>
					<Label muted>Selected: {view}</Label>
				</Panel>
			</Section>

			<Section
				title="Scrollable"
				description="Items keep their width and scroll when they no longer fit."
			>
				<Panel>
					<Tab value={month} onValueChange={setMonth}>
						<Tab.List scrollable>
							{MONTHS.map((name) => (
								<Tab.Item key={name} value={name}>
									{name}
								</Tab.Item>
							))}
						</Tab.List>
					</Tab>
					<Label muted>Selected: {month}</Label>
				</Panel>
			</Section>

			<Section
				title="Swipe to switch"
				description="Drag the content sideways to move between nearby tabs."
			>
				<Panel>
					<View style={{ height: 180 }}>
						<Tab
							value={swipeSection}
							onValueChange={setSwipeSection}
							style={{ flex: 1 }}
						>
							<Tab.List>
								<Tab.Item value="all">All</Tab.Item>
								<Tab.Item value="mentions">Mentions</Tab.Item>
								<Tab.Item value="requests">Requests</Tab.Item>
							</Tab.List>
							<Tab.Pager>
								{Object.entries(ACTIVITY).map(
									([value, description]) => (
										<Tab.Panel
											key={value}
											value={value}
											style={styles.panel}
										>
											<Text variant="bodySm" color="muted">
												{description}
											</Text>
										</Tab.Panel>
									),
								)}
							</Tab.Pager>
						</Tab>
					</View>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	content: { paddingTop: theme.tokens.spacing[3] },
	panel: { paddingTop: theme.tokens.spacing[4] },
}));
