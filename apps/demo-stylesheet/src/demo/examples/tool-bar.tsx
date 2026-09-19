import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToolBar } from "@/components/ui/tool-bar";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

/** A frame standing in for the bottom of a screen, so a docked bar can be shown inside the demo. */
function Frame({ children }: { children: React.ReactNode }) {
	const { tokens, colors } = useTheme();

	return (
		<View
			style={{
				overflow: "hidden",
				justifyContent: "flex-end",
				minHeight: 120,
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.subtle,
			}}
		>
			{children}
		</View>
	);
}

export default function ToolBarScreen() {
	const [selection, setSelection] = useState(2);
	const [pinned, setPinned] = useState(false);
	const [last, setLast] = useState<string | null>(null);

	return (
		<Screen>
			<Section
				title="ToolBar"
				description="A docked bar of contextual actions, with labels under the icons."
			>
				<Panel>
					<Row label="Selection" description={`${selection} items`}>
						<Switch
							value={selection > 0}
							onValueChange={(on) => setSelection(on ? 2 : 0)}
							accessibilityLabel="Selection"
						/>
					</Row>
					<Label muted>
						{last
							? `Last action: ${last}`
							: "The bar slides away when nothing is selected."}
					</Label>
				</Panel>
				<Frame>
					<ToolBar safeArea={false} visible={selection > 0}>
						<ToolBar.Action
							icon="share"
							label="Share"
							onPress={() => setLast("Share")}
						/>
						<ToolBar.Action
							icon="file"
							label="Archive"
							onPress={() => setLast("Archive")}
						/>
						<ToolBar.Separator />
						<ToolBar.Action
							icon="delete"
							label="Delete"
							destructive
							onPress={() => setLast("Delete")}
						/>
					</ToolBar>
				</Frame>
			</Section>

			<Section
				title="Floating"
				description="An inset capsule over the content, icons only."
			>
				<Frame>
					<ToolBar safeArea={false} placement="floating" justify="center">
						<ToolBar.Action
							icon="favorite"
							label="Favorite"
							selected={pinned}
							onPress={() => setPinned(!pinned)}
						/>
						<ToolBar.Action
							icon="share"
							label="Share"
							onPress={() => setLast("Share")}
						/>
						<ToolBar.Action
							icon="settings"
							label="Settings"
							disabled
							onPress={() => {}}
						/>
					</ToolBar>
				</Frame>
			</Section>

			<Section
				title="Justify"
				description="How the actions spread across the width."
			>
				<Panel>
					<Button variant="outline" onPress={() => setLast(null)}>
						Reset
					</Button>
				</Panel>
				{(["start", "center", "between", "around"] as const).map(
					(justify) => (
						<Frame key={justify}>
							<ToolBar
								safeArea={false}
								justify={justify}
								accessibilityLabel={`Actions, ${justify}`}
							>
								<ToolBar.Action
									icon="share"
									label="Share"
									onPress={() => setLast(`Share · ${justify}`)}
								/>
								<ToolBar.Action
									icon="delete"
									label="Delete"
									destructive
									onPress={() => setLast(`Delete · ${justify}`)}
								/>
							</ToolBar>
						</Frame>
					),
				)}
			</Section>
		</Screen>
	);
}
