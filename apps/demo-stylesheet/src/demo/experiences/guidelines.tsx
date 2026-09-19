import { ScrollView, View } from "react-native";

import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

import { ExperienceScreen } from "./shared";

const RULES = [
	[
		"One screen = one main action",
		"Apart from a few hubs and home screens, a mobile screen should have one clear goal.",
	],
	[
		"Avoid excessive card nesting",
		"Each level of padding and border takes space away from the content. Nest a card only for a reason.",
	],
	[
		"One primary scroll direction",
		"A screen scrolls vertically or horizontally, not both. A horizontal row inside a vertical screen stays an exception.",
	],
	[
		"Touch target",
		"A touch action stays comfortable to hit: around 44pt minimum. Tappable and IconButton enforce it.",
	],
	[
		"Context preservation",
		"When the user needs to do something without losing the screen, use a bottom sheet, a menu or another overlay instead of a new screen.",
	],
];

export default function GuidelinesScreen() {
	const { tokens } = useTheme();

	return (
		<ExperienceScreen>
			<ScrollView
				contentContainerStyle={{
					padding: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[12] * 2,
					gap: tokens.spacing[5],
				}}
			>
				<Text color="muted">
					Some concepts don&apos;t belong in a component. They are better
					written down as rules.
				</Text>
				{RULES.map(([title, description], index) => (
					<View key={title} style={{ gap: tokens.spacing[3] }}>
						{index > 0 ? <Separator /> : null}
						<View style={{ gap: tokens.spacing[1] }}>
							<Title variant="subheading">{title}</Title>
							<Text variant="bodySm" color="muted">
								{description}
							</Text>
						</View>
					</View>
				))}
			</ScrollView>
		</ExperienceScreen>
	);
}
