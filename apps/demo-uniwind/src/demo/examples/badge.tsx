import { useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const FILTERS = [
	"Unread",
	"Starred",
	"Attachments",
	"From me",
	"This week",
	"Large files",
];
const PEOPLE = [
	"Jane Cooper",
	"Wade Warren",
	"Esther Howard",
	"Cameron Williamson",
	"Brooklyn Simmons",
	"Leslie Alexander",
];

export default function BadgeScreen() {
	const { tokens } = useTheme();
	const { width } = useWindowDimensions();
	const [count, setCount] = useState(3);
	const [hidden, setHidden] = useState(false);
	const [filters, setFilters] = useState<Set<string>>(new Set(["Unread"]));
	const [tags, setTags] = useState(["Travel", "Food", "Family"]);

	const toggleFilter = (filter: string) =>
		setFilters((previous) => {
			const next = new Set(previous);
			if (next.has(filter)) next.delete(filter);
			else next.add(filter);
			return next;
		});

	return (
		<Screen>
			<Section
				title="Badge"
				description="Semantic variants, dot, icon, sizes."
			>
				<Panel>
					<View
						className="flex-row flex-wrap"
						style={{ gap: tokens.spacing[2] }}
					>
						<Badge>Archived</Badge>
						<Badge variant="highlight">Featured</Badge>
						<Badge variant="info" dot>
							Building
						</Badge>
						<Badge variant="success" icon="check">
							Delivered
						</Badge>
						<Badge variant="warning">Queued</Badge>
						<Badge variant="error" dot>
							Failed
						</Badge>
						<Badge variant="outline">Preview</Badge>
						<Badge variant="inverse">Pro</Badge>
						<Badge variant="success" size="sm">
							sm
						</Badge>
					</View>
				</Panel>
			</Section>

			<Section
				title="Counter on an anchor"
				description="0 hides the counter; above 99 it shows 99+. The dot animates in and out."
			>
				<Panel>
					<View
						className="flex-row items-center"
						style={{ gap: tokens.spacing[6] }}
					>
						{/* Static: the badge appears and disappears at once. */}
						<Badge.Anchor
							badge={
								hidden ? null : (
									<Badge
										count={count}
										accessibilityLabel={`${count} unread messages`}
									/>
								)
							}
						>
							<IconButton
								icon="search"
								variant="tinted"
								accessibilityLabel="Inbox"
								onPress={() => setCount((c) => c + 1)}
							/>
						</Badge.Anchor>
						{/* Animated: opt in by wrapping the badge in an Animated.View. */}
						<Badge.Anchor
							badge={
								hidden ? null : (
									<Animated.View entering={ZoomIn} exiting={ZoomOut}>
										<Badge dot />
									</Animated.View>
								)
							}
							placement="bottom-right"
						>
							<Avatar name="Jane Cooper" colorFromName />
						</Badge.Anchor>
						<Badge count={120} />
						<Text variant="bodySm" color="muted" style={{ flex: 1 }}>
							Press the icon to add one.
						</Text>
					</View>
					<Row label="Hide badges">
						<Switch
							value={hidden}
							onValueChange={setHidden}
							accessibilityLabel="Hide badges"
						/>
					</Row>
					<Row label="Reset counter">
						<IconButton
							icon="close"
							size="sm"
							variant="tinted"
							accessibilityLabel="Reset"
							onPress={() => setCount(0)}
						/>
					</Row>
				</Panel>
			</Section>

			<Section
				title="Avatar"
				description="Image, initials, hue from the name, status, group."
			>
				<Panel>
					<View
						className="flex-row items-end"
						style={{ gap: tokens.spacing[3] }}
					>
						<Avatar size="xs" name="Jane Cooper" />
						<Avatar
							size="sm"
							name="Wade Warren"
							colorFromName
							status="online"
						/>
						<Avatar
							source={{ uri: "https://i.pravatar.cc/200?img=12" }}
							name="Esther Howard"
							status="busy"
						/>
						<Avatar
							size="lg"
							source={{ uri: "https://invalid.example/avatar.png" }}
							name="Broken Image"
							status="away"
						/>
						<Avatar
							size="xl"
							shape="square"
							name="Axiom Labs"
							colorFromName
						/>
					</View>
					<Separator />
					<Label muted>Group, max 4</Label>
					<Avatar.Group>
						{PEOPLE.slice(0, 4).map((name) => (
							<Avatar key={name} name={name} size="sm" colorFromName />
						))}
						{PEOPLE.length > 4 ? (
							<Avatar.Overflow count={PEOPLE.length - 4} size="sm" />
						) : null}
					</Avatar.Group>
				</Panel>
			</Section>

			<Section title="Chip" description="Filters toggle, tags remove.">
				<Panel>
					<Label muted>Filters, scrolling</Label>
				</Panel>
				{/* A horizontal ScrollView gives the group no width to wrap at: one line that scrolls. */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{ marginHorizontal: -tokens.metrics.screenMargin }}
					contentContainerStyle={{
						paddingHorizontal: tokens.metrics.screenMargin,
						paddingEnd: width / 2,
					}}
				>
					<Chip.Group>
						{FILTERS.map((filter) => (
							<Chip
								key={filter}
								selected={filters.has(filter)}
								onPress={() => toggleFilter(filter)}
							>
								{filter}
							</Chip>
						))}
					</Chip.Group>
				</ScrollView>
				<Panel>
					<Label muted>Tags, wrapping</Label>
					<Chip.Group>
						{tags.map((tag) => (
							<Chip
								key={tag}
								variant="filled"
								onRemove={() =>
									setTags((previous) =>
										previous.filter((t) => t !== tag),
									)
								}
							>
								{tag}
							</Chip>
						))}
						<Chip
							leading="add"
							onPress={() =>
								setTags((previous) => [
									...previous,
									`Tag ${previous.length + 1}`,
								])
							}
						>
							Add
						</Chip>
						<Chip size="sm" trailing="chevron-down" onPress={() => {}}>
							Sort
						</Chip>
						<Chip disabled onPress={() => {}}>
							Disabled
						</Chip>
					</Chip.Group>
				</Panel>
			</Section>

			<Section title="Separator">
				<Panel>
					<Text>Above</Text>
					<Separator />
					<Separator label="or" spacing={2} />
					<View
						className="flex-row items-center h-[24px]"
						style={{ gap: tokens.spacing[3] }}
					>
						<Text>Left</Text>
						<Separator orientation="vertical" />
						<Text>Right</Text>
					</View>
					<Separator variant="subtle" inset={{ start: 8 }} />
					<Text variant="footnote" color="muted">
						Subtle, inset at the start.
					</Text>
				</Panel>
			</Section>
		</Screen>
	);
}
