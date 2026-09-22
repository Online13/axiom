import { useState } from "react";
import {
	ScrollView,
	View,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
	FloatingButton,
	type FloatingButtonPlacement,
} from "@/components/ui/floating-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";

export default function FloatingButtonScreen() {
	const [placement, setPlacement] =
		useState<FloatingButtonPlacement>("bottom-start");
	const [extended, setExtended] = useState(true);
	const [hideOnScroll, setHideOnScroll] = useState(true);
	const [visible, setVisible] = useState(true);
	const [presses, setPresses] = useState(0);
	const [lastY, setLastY] = useState(0);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const y = event.nativeEvent.contentOffset.y;
		if (hideOnScroll && Math.abs(y - lastY) > 8) {
			setVisible(y < lastY || y <= 0);
			setLastY(y);
		}
	};

	return (
		<View style={styles.root}>
			<ScrollView
				onScroll={onScroll}
				scrollEventThrottle={32}
				style={styles.body}
				contentContainerStyle={styles.content}
			>
				<Section
					title="Placement"
					description="The theme button stays bottom-end on every screen. This one moves, so both stay visible."
				>
					<Panel>
						<SegmentedControl
							options={[
								{ value: "bottom-start", label: "Start" },
								{ value: "bottom-center", label: "Center" },
							]}
							value={placement}
							onValueChange={(value) =>
								setPlacement(value as FloatingButtonPlacement)
							}
						/>
						<Row label="Extended" description="Icon and label">
							<Switch
								value={extended}
								onValueChange={setExtended}
								accessibilityLabel="Extended"
							/>
						</Row>
						<Row
							label="Hide on scroll"
							description="Scroll down to hide, up to show"
						>
							<Switch
								value={hideOnScroll}
								onValueChange={(value) => {
									setHideOnScroll(value);
									setVisible(true);
								}}
								accessibilityLabel="Hide on scroll"
							/>
						</Row>
						<Label muted>Presses: {presses}</Label>
					</Panel>
				</Section>

				<Section
					title="Content"
					description="Scroll to see the button hide and come back."
				>
					<Panel>
						{Array.from({ length: 24 }, (_, i) => (
							<Text key={i} color={i % 2 ? "muted" : "default"}>
								Note {i + 1}
							</Text>
						))}
					</Panel>
				</Section>
			</ScrollView>

			{extended ? (
				<FloatingButton
					icon="edit"
					label="New note"
					placement={placement}
					visible={visible}
					onPress={() => setPresses((n) => n + 1)}
				/>
			) : (
				<FloatingButton
					icon="add"
					accessibilityLabel="New note"
					placement={placement}
					visible={visible}
					onPress={() => setPresses((n) => n + 1)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	root: { flex: 1 },
	body: { backgroundColor: theme.colors.background.subtle },
	content: {
		padding: theme.tokens.metrics.screenMargin,
		paddingBottom: theme.tokens.spacing[12] * 2,
		gap: theme.tokens.spacing[8],
	},
}));
