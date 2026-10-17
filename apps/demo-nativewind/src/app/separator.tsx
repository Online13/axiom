import { View } from "react-native";

import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function SeparatorScreen() {
	const { tokens } = useTheme();

	return (
		<Screen>
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
