import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
	BottomSheet,
	type KeyboardBehavior,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const ITEMS = Array.from({ length: 30 }, (_, i) => `Place ${i + 1}`);

function Rows({ count }: { count: number }) {
	return ITEMS.slice(0, count).map((item) => (
		<View key={item} style={styles.listRow}>
			<Text>{item}</Text>
		</View>
	));
}

export default function BottomSheetScreen() {
	const [index, setIndex] = useState(0);
	const [dismissible, setDismissible] = useState(true);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);
	const [resetOpen, setResetOpen] = useState(false);
	const [pushes, setPushes] = useState(true);
	const [mapOpen, setMapOpen] = useState(false);
	const [events, setEvents] = useState<string[]>([]);
	const [keyboardBehavior, setKeyboardBehavior] =
		useState<KeyboardBehavior>("interactive");
	const [formOpen, setFormOpen] = useState(false);
	const [listName, setListName] = useState("");

	const record = (entry: string) =>
		setEvents((list) => [entry, ...list].slice(0, 4));

	return (
		<Screen>
			<Panel>
				<Row
					label="Dismissible"
					description="Swipe down, backdrop press and back button"
				>
					<Switch
						value={dismissible}
						onValueChange={setDismissible}
						accessibilityLabel="Dismissible"
					/>
				</Row>
				<Label muted>
					{events.length ? events.join(" · ") : "No event yet"}
				</Label>
			</Panel>

			<Section title="Fits content" description="snapPoints={['content']}">
				<BottomSheet.Root
					onOpenChange={(open) => record(open ? "open" : "close")}
				>
					<BottomSheet.Trigger asChild>
						<Button fullWidth>Actions on an item</Button>
					</BottomSheet.Trigger>
					<BottomSheet.Content
						dismissible={dismissible}
						onDismiss={() => record("onDismiss")}
					>
						<BottomSheet.Handle />
						<BottomSheet.Header title="report.pdf" closeButton />
						<View style={styles.actions}>
							<Button variant="outline" fullWidth>
								Share
							</Button>
							<Button variant="outline" fullWidth>
								Rename
							</Button>
							<Button variant="ghost" fullWidth>
								Delete
							</Button>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>

			<Section title="Detached" description="Floats above the bottom edge.">
				<BottomSheet.Root>
					<BottomSheet.Trigger asChild>
						<Button variant="outline" fullWidth>
							Confirm
						</Button>
					</BottomSheet.Trigger>
					<BottomSheet.Content detached dismissible={dismissible}>
						<BottomSheet.Handle />
						<View style={styles.confirm}>
							<Text variant="bodyLg" weight="semibold" align="center">
								Sign out?
							</Text>
							<Text color="muted" align="center">
								You will need your password to sign in again.
							</Text>
							<Button fullWidth>Sign out</Button>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>

			<Section
				title="Form above the keyboard"
				description={`keyboardBehavior="${keyboardBehavior}"`}
			>
				<SegmentedControl
					options={["interactive", "extend", "none"]}
					value={keyboardBehavior}
					onValueChange={(value) =>
						setKeyboardBehavior(value as KeyboardBehavior)
					}
				/>
				<BottomSheet.Root open={formOpen} onOpenChange={setFormOpen}>
					<BottomSheet.Trigger asChild>
						<Button variant="outline" fullWidth>
							New list
						</Button>
					</BottomSheet.Trigger>
					<BottomSheet.Content
						snapPoints={
							keyboardBehavior === "extend" ? [240, "70%"] : ["content"]
						}
						keyboardBehavior={keyboardBehavior}
						dismissible={dismissible}
						footer={
							<Button
								fullWidth
								disabled={!listName}
								onPress={() => {
									record(`created ${listName}`);
									setListName("");
									setFormOpen(false);
								}}
							>
								Create
							</Button>
						}
					>
						<BottomSheet.Handle />
						<BottomSheet.Header title="New list" closeButton />
						<View style={styles.form}>
							<Input
								autoFocus
								label="Name"
								placeholder="Groceries"
								value={listName}
								onChangeText={setListName}
							/>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>

			<Section
				title="Snap points, scroll, footer"
				description={`snapPoints={[200, '50%', '90%']} · index ${index}`}
			>
				<BottomSheet.Root>
					<BottomSheet.Trigger asChild>
						<Button variant="outline" fullWidth>
							Long list
						</Button>
					</BottomSheet.Trigger>
					<BottomSheet.Content
						snapPoints={[200, "50%", "90%"]}
						index={index}
						onIndexChange={(next) => {
							setIndex(next);
							record(`index ${next}`);
						}}
						dismissible={dismissible}
						footer={<Button fullWidth>Apply</Button>}
					>
						<BottomSheet.Handle />
						<BottomSheet.Header title="Places" closeButton />
						<BottomSheet.ScrollView>
							<Rows count={30} />
						</BottomSheet.ScrollView>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>

			<Section
				title="Stacked sheets"
				description="Each sheet opened over another scales it down, then lets it grow back on close."
			>
				<Row
					label="Second sheet pushes"
					description="stack={false} opens over the first without scaling it"
				>
					<Switch
						value={pushes}
						onValueChange={setPushes}
						accessibilityLabel="Second sheet pushes"
					/>
				</Row>
				<Button
					variant="outline"
					fullWidth
					onPress={() => setFiltersOpen(true)}
				>
					Filters
				</Button>

				<BottomSheet.Root open={filtersOpen} onOpenChange={setFiltersOpen}>
					<BottomSheet.Content
						snapPoints={["55%"]}
						dismissible={dismissible}
					>
						<BottomSheet.Handle />
						<BottomSheet.Header title="Filters" closeButton />
						<View style={styles.stackBody}>
							<Text color="muted">
								Open the next sheet and watch this one step back.
							</Text>
							<Button
								variant="outline"
								fullWidth
								onPress={() => setSortOpen(true)}
							>
								Sort by…
							</Button>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>

				<BottomSheet.Root open={sortOpen} onOpenChange={setSortOpen}>
					<BottomSheet.Content
						stack={pushes}
						snapPoints={["40%"]}
						dismissible={dismissible}
					>
						<BottomSheet.Handle />
						<BottomSheet.Header title="Sort by" closeButton />
						<View style={styles.stackBody}>
							<Text color="muted">
								A third level is as deep as it goes: the first sheet stays
								where it is.
							</Text>
							<Button
								variant="ghost"
								fullWidth
								onPress={() => setResetOpen(true)}
							>
								Reset everything
							</Button>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>

				<BottomSheet.Root open={resetOpen} onOpenChange={setResetOpen}>
					<BottomSheet.Content detached dismissible={dismissible}>
						<BottomSheet.Handle />
						<View style={styles.stackBody}>
							<Text variant="bodyLg" weight="semibold" align="center">
								Reset every filter?
							</Text>
							<Button
								fullWidth
								onPress={() => {
									record("reset");
									setResetOpen(false);
									setSortOpen(false);
									setFiltersOpen(false);
								}}
							>
								Reset
							</Button>
						</View>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>

			<Section
				title="No overlay, always open"
				description="The screen stays interactive behind the sheet."
			>
				<Button
					variant="ghost"
					fullWidth
					onPress={() => setMapOpen((value) => !value)}
				>
					{mapOpen ? "Hide map sheet" : "Show map sheet"}
				</Button>
				<BottomSheet.Root open={mapOpen}>
					<BottomSheet.Content
						snapPoints={[120, "45%"]}
						overlay={false}
						dismissible={false}
					>
						<BottomSheet.Handle />
						<BottomSheet.FlatList
							data={ITEMS}
							keyExtractor={(item) => item}
							renderItem={({ item }) => (
								<View style={styles.mapRow}>
									<Text>{item}</Text>
								</View>
							)}
						/>
					</BottomSheet.Content>
				</BottomSheet.Root>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	listRow: {
		paddingVertical: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		borderBottomWidth: theme.tokens.metrics.hairline,
		borderBottomColor: theme.colors.border.subtle,
	},
	actions: {
		padding: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[2],
	},
	confirm: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[3],
	},
	form: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		paddingBottom: theme.tokens.spacing[4],
	},
	stackBody: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[3],
	},
	mapRow: {
		paddingVertical: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.metrics.screenMargin,
	},
}));
