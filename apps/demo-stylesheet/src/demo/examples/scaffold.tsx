import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Item } from "@/components/ui/item";
import { Scaffold } from "@/components/ui/scaffold";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

/**
 * A fixed-height window on a screen. Scaffold fills its parent, so a frame is what lets
 * a whole screen structure be shown inside the demo list.
 */
function Frame({
	height = 380,
	children,
}: {
	height?: number;
	children: React.ReactNode;
}) {
	const { tokens, colors } = useTheme();

	return (
		<View
			style={{
				height,
				overflow: "hidden",
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
			}}
		>
			{children}
		</View>
	);
}

export default function ScaffoldScreen() {
	const { tokens } = useTheme();
	const [bordered, setBordered] = useState(true);
	const [name, setName] = useState("");
	const [saved, setSaved] = useState(false);

	return (
		<Screen>
			<Section
				title="Scaffold"
				description="A bar, scrollable content and a fixed footer, inside the safe areas."
			>
				<Panel>
					<Row label="Footer border">
						<Switch
							value={bordered}
							onValueChange={setBordered}
							accessibilityLabel="Footer border"
						/>
					</Row>
					<Label muted>
						{saved
							? "Saved."
							: "The footer stays put while the content scrolls."}
					</Label>
				</Panel>
				<Frame>
					{/* The frame isn't the screen: the scaffold owns no safe area here. */}
					<Scaffold safeAreaEdges={[]} background="subtle">
						<Scaffold.AppBar
							title="Settings"
							bordered
							leading={
								<IconButton
									icon="chevron-left"
									accessibilityLabel="Back"
									onPress={() => {}}
								/>
							}
							actions={
								<IconButton
									icon="search"
									accessibilityLabel="Search settings"
									onPress={() => {}}
								/>
							}
						/>
						<Scaffold.Content
							contentContainerStyle={{
								padding: tokens.metrics.screenMargin,
								gap: tokens.spacing[2],
							}}
						>
							{[
								"Account",
								"Notifications",
								"Privacy",
								"Appearance",
								"Storage",
								"About",
							].map((entry) => (
								<Item key={entry} onPress={() => {}} divider="inset">
									<Item.Content>
										<Item.Title>{entry}</Item.Title>
									</Item.Content>
									<Item.Trailing>
										<Text color="subtle">›</Text>
									</Item.Trailing>
								</Item>
							))}
						</Scaffold.Content>
						<Scaffold.Footer bordered={bordered} safeArea={false}>
							<Button fullWidth onPress={() => setSaved(true)}>
								Save
							</Button>
						</Scaffold.Footer>
					</Scaffold>
				</Frame>
			</Section>

			<Section
				title="A form"
				description="The footer rises above the keyboard; tapping the content dismisses it."
			>
				<Frame height={300}>
					<Scaffold safeAreaEdges={[]}>
						<Scaffold.AppBar title="New contact" />
						<Scaffold.Content
							contentContainerStyle={{
								padding: tokens.metrics.screenMargin,
								gap: tokens.spacing[3],
							}}
						>
							<Input
								label="Name"
								value={name}
								onChangeText={setName}
								placeholder="Ada Lovelace"
							/>
							<Input
								label="Email"
								placeholder="ada@example.com"
								keyboardType="email-address"
							/>
						</Scaffold.Content>
						<Scaffold.Footer safeArea={false}>
							<Button fullWidth disabled={name === ""}>
								Add contact
							</Button>
						</Scaffold.Footer>
					</Scaffold>
				</Frame>
			</Section>

			<Section
				title="Without scrolling"
				description="`scrollable={false}` hands the scrolling to a list or a map."
			>
				<Frame height={220}>
					<Scaffold safeAreaEdges={[]} background="subtle">
						<Scaffold.AppBar title="Map" />
						<Scaffold.Content scrollable={false}>
							<View
								style={{
									flex: 1,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text color="muted">
									A child that owns its own scrolling
								</Text>
							</View>
						</Scaffold.Content>
					</Scaffold>
				</Frame>
			</Section>
		</Screen>
	);
}
