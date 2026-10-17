import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function SeparatorScreen() {
	return (
		<Screen>
			<Section title="Separator">
				<Panel>
					<Text>Above</Text>
					<Separator />
					<Separator label="or" spacing={2} />
					<View style={styles.inline}>
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

const styles = StyleSheet.create((theme) => ({
	inline: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		height: 24,
	},
}));
