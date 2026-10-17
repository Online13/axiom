import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function SpinnerScreen() {
	const { tokens } = useTheme();
	return (
		<Screen>
			<Section
				title="Spinner"
				description="Sizes, colors, delay. Turns on the UI thread; pulses with Reduce Motion."
			>
				<Panel>
					<View
						className="flex-row items-center"
						style={{ gap: tokens.spacing[5] }}
					>
						<Spinner size="sm" />
						<Spinner />
						<Spinner size="lg" color="muted" />
						<Spinner size={32} color="link" />
						<Spinner delay={1500} label="Loading with a delay" />
						<Label muted>1.5s delay</Label>
					</View>
					<Button loading fullWidth>
						Button
					</Button>
				</Panel>
			</Section>
		</Screen>
	);
}
