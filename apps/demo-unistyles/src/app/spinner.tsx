import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function SpinnerScreen() {
	return (
		<Screen>
			<Section
				title="Spinner"
				description="Sizes, colors, delay. Turns on the UI thread; pulses with Reduce Motion."
			>
				<Panel>
					<View style={styles.spinners}>
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

const styles = StyleSheet.create((theme) => ({
	spinners: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[5],
	},
}));
