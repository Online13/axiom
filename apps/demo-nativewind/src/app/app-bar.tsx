import { useState } from "react";
import { View } from "react-native";

import { AppBar } from "@/components/ui/app-bar";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

/** A frame standing in for the top of a screen, so a bar can be shown inside the demo. */
function Frame({ children }: { children: React.ReactNode }) {
	const { tokens, colors } = useTheme();

	return (
		<View
			className="overflow-hidden"
			style={{
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.default,
			}}
		>
			{children}
		</View>
	);
}

function Body({ lines = 2 }: { lines?: number }) {
	const { tokens, colors } = useTheme();

	return (
		<View style={{ padding: tokens.spacing[4], gap: tokens.spacing[2] }}>
			{Array.from({ length: lines }, (_, i) => (
				<View
					key={i}
					className={
						i % 2 === 0
							? "h-[10px] w-[80%] rounded-[5px]"
							: "h-[10px] w-[55%] rounded-[5px]"
					}
					style={{ backgroundColor: colors.background.subtle }}
				/>
			))}
		</View>
	);
}

function Back() {
	return (
		<IconButton
			icon="arrow-left"
			accessibilityLabel="Back"
			onPress={() => {}}
		/>
	);
}

/** The trailing controls every example shares. */
function Actions() {
	return (
		<>
			<IconButton
				icon="search"
				accessibilityLabel="Search"
				onPress={() => {}}
			/>
			<IconButton
				icon="calendar"
				accessibilityLabel="Pick a date"
				onPress={() => {}}
			/>
		</>
	);
}

export default function AppBarScreen() {
	const { tokens, components } = useTheme();
	const barColors = components.appBar.default.default;
	const [elevation, setElevation] = useState(1);
	const [bordered, setBordered] = useState(true);
	const [query, setQuery] = useState("");

	return (
		<Screen>
			<Section
				title="Search"
				description="AppBar.Center holds anything, not only a title: here a search field between the navigation and the avatar."
			>
				<Frame>
					<AppBar safeArea={false} bordered>
						<AppBar.Row>
							<Back />
							<AppBar.Center>
								<SearchBar
									value={query}
									onChangeText={setQuery}
									placeholder="Search product"
									size="sm"
								/>
							</AppBar.Center>
							<Avatar name="Ada Lovelace" size="sm" colorFromName />
						</AppBar.Row>
					</AppBar>
					<Body />
				</Frame>
			</Section>

			<Section
				title="Small"
				description="The title and its subtitle sit in the row, after the navigation."
			>
				<Panel>
					<Row label="Bordered">
						<Switch
							value={bordered}
							onValueChange={setBordered}
							accessibilityLabel="Bordered"
						/>
					</Row>
				</Panel>
				<Frame>
					<AppBar safeArea={false} bordered={bordered}>
						<AppBar.Row>
							<Back />
							<AppBar.Center>
								<AppBar.Title>Headline</AppBar.Title>
								<AppBar.Subtitle>Subtitle</AppBar.Subtitle>
							</AppBar.Center>
							<Actions />
						</AppBar.Row>
					</AppBar>
					<Body />
				</Frame>
			</Section>

			<Section
				title="Medium"
				description="AppBar.Expanded puts the title on its own line under the row. An empty Center keeps the actions at the end."
			>
				<Frame>
					<AppBar safeArea={false} bordered>
						<AppBar.Row>
							<Back />
							<AppBar.Center />
							<Actions />
						</AppBar.Row>
						<AppBar.Expanded>
							<AppBar.Title size="medium">Headline</AppBar.Title>
							<AppBar.Subtitle size="medium">Subtitle</AppBar.Subtitle>
						</AppBar.Expanded>
					</AppBar>
					<Body />
				</Frame>
			</Section>

			<Section
				title="Large"
				description="The same parts, with the large title size. The Collapsible header experience folds it as the list scrolls."
			>
				<Frame>
					<AppBar safeArea={false} bordered>
						<AppBar.Row>
							<Back />
							<AppBar.Center />
							<Actions />
						</AppBar.Row>
						<AppBar.Expanded>
							<AppBar.Title size="large">Headline</AppBar.Title>
							<AppBar.Subtitle size="large">Subtitle</AppBar.Subtitle>
						</AppBar.Expanded>
					</AppBar>
					<Body lines={3} />
				</Frame>
			</Section>

			<Section
				title="Elevation"
				description="A transparent bar with its own surface layer: the screen decides how opaque the surface is."
			>
				<Panel>
					<Text variant="bodySm" weight="medium">
						Surface opacity · {elevation.toFixed(2)}
					</Text>
					<Slider
						value={elevation}
						onValueChange={setElevation}
						min={0}
						max={1}
						step={0.01}
						accessibilityLabel="Surface opacity"
					/>
					<Label muted>
						At 0 the bar is transparent: the content shows through.
					</Label>
				</Panel>
				<Frame>
					<View
						className="absolute inset-0"
						style={{ padding: tokens.spacing[3] }}
					>
						<Text variant="bodySm" color="muted">
							Content behind the bar
						</Text>
					</View>
					<AppBar
						safeArea={false}
						style={{ backgroundColor: "transparent" }}
					>
						<View
							pointerEvents="none"
							className="absolute inset-0"
							style={{
								opacity: elevation,
								backgroundColor: barColors.background,
								borderBottomWidth: tokens.metrics.hairline,
								borderBottomColor: barColors.border,
							}}
						/>
						<AppBar.Row>
							<IconButton
								icon="chevron-left"
								accessibilityLabel="Back"
								onPress={() => {}}
							/>
							<AppBar.Center>
								<AppBar.Title>Profile</AppBar.Title>
							</AppBar.Center>
						</AppBar.Row>
					</AppBar>
					<Body />
				</Frame>
			</Section>
		</Screen>
	);
}
