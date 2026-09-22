import { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { ToolBar } from "@/components/ui/tool-bar";


import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

export default function DynamicToolbarScreen() {

	const [selecting, setSelecting] = useState(false);
	const [selected, setSelected] = useState<number[]>([]);
	const [log, setLog] = useState(
		"Tap Select, or hold a row, to enter the mode.",
	);
	const files = fakeRows(10);

	const toggle = (id: number) =>
		setSelected((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);

	const enter = (id?: number) => {
		setSelecting(true);
		setSelected(id === undefined ? [] : [id]);
	};

	const leave = () => {
		setSelecting(false);
		setSelected([]);
	};

	const one = selected.length === 1;
	const any = selected.length > 0;

	return (
		<ExperienceScreen
			actions={
				<Button
					variant="ghost"
					size="sm"
					onPress={() => (selecting ? leave() : enter())}
				>
					{selecting ? "Done" : "Select"}
				</Button>
			}
		>
			<Note>{log}</Note>
			<View style={styles.fill}>
				<ScrollView
					contentContainerStyle={styles.content}
				>
					{files.map((file) => (
						<ListRow
							key={file.id}
							title={file.title}
							subtitle={file.subtitle}
							selected={selected.includes(file.id)}
							onPress={selecting ? () => toggle(file.id) : undefined}
							onLongPress={() => enter(file.id)}
							trailing={
								selecting ? (
									<Checkbox
										checked={selected.includes(file.id)}
										onCheckedChange={() => toggle(file.id)}
										accessibilityLabel={`Select ${file.title}`}
									/>
								) : undefined
							}
						/>
					))}
				</ScrollView>
				{/* The bar takes the place of navigation for as long as the mode lasts. */}
				<View style={styles.bottom}>
					<ToolBar
						visible={selecting}
						accessibilityLabel="Selection actions"
						style={styles.bar}
					>
						<ToolBar.Action
							icon="share"
							label="Share"
							disabled={!any}
							onPress={() => setLog(`Shared ${selected.length}`)}
						/>
						<ToolBar.Action
							icon="edit"
							label="Rename"
							disabled={!one}
							onPress={() => setLog("Renamed one file")}
						/>
						<ToolBar.Separator />
						<ToolBar.Action
							icon="delete"
							label="Delete"
							destructive
							disabled={!any}
							onPress={() => {
								setLog(
									`Deleted ${selected.length} file${selected.length > 1 ? "s" : ""}`,
								);
								leave();
							}}
						/>
					</ToolBar>
				</View>
			</View>
			{!selecting ? (
				<Text
					variant="footnote"
					color="muted"
					style={styles.note}
				>
					Rename only lights up on exactly one file: the actions stay in
					place, only their state changes.
				</Text>
			) : null}
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	fill: { flex: 1 },
	bottom: { position: "absolute", left: 0, right: 0, bottom: 0 },
	content: { paddingBottom: theme.tokens.spacing[12] * 3 },
	bar: { backgroundColor: theme.colors.background.subtle },
	note: { padding: theme.tokens.metrics.screenMargin },
}));
