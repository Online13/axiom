import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
	IconButton,
	type IconButtonSize,
	type IconButtonVariant,
} from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const VARIANTS: IconButtonVariant[] = ["ghost", "tinted", "outline", "solid"];
const SIZES: IconButtonSize[] = ["sm", "md", "lg"];

export default function IconButtonScreen() {
	const [disabled, setDisabled] = useState(false);
	const [liked, setLiked] = useState(false);
	const [bookmarked, setBookmarked] = useState(true);
	const [presses, setPresses] = useState(0);

	const press = () => setPresses((value) => value + 1);

	return (
		<Screen>
			<Panel>
				<Row label="Disabled">
					<Switch
						value={disabled}
						onValueChange={setDisabled}
						accessibilityLabel="Disabled"
					/>
				</Row>
				<Label muted>Presses: {presses}</Label>
			</Panel>

			<Section
				title="Variants and sizes"
				description="sm is 32pt but keeps a 44pt touch area."
			>
				<Panel>
					{VARIANTS.map((variant) => (
						<View key={variant} style={styles.variant}>
							<Label muted>{variant}</Label>
							<View style={styles.variantRow}>
								{SIZES.map((size) => (
									<IconButton
										key={size}
										icon="settings"
										variant={variant}
										size={size}
										disabled={disabled}
										accessibilityLabel={`Settings ${variant} ${size}`}
										onPress={press}
									/>
								))}
								<IconButton
									icon="search"
									variant={variant}
									shape="square"
									disabled={disabled}
									accessibilityLabel={`Search ${variant} square`}
									onPress={press}
								/>
							</View>
						</View>
					))}
				</Panel>
			</Section>

			<Section
				title="Toggles"
				description="selected marks a toggle as on and sets accessibilityState.selected."
			>
				<Panel>
					<View style={styles.toggles}>
						<IconButton
							icon="favorite"
							selected={liked}
							color={liked ? "error" : "default"}
							disabled={disabled}
							accessibilityLabel={liked ? "Unlike" : "Like"}
							onPress={() => setLiked((value) => !value)}
						/>
						<Text variant="bodySm" color="muted">
							{liked ? 128 : 127}
						</Text>
						<IconButton
							icon="add"
							variant="outline"
							selected={bookmarked}
							disabled={disabled}
							accessibilityLabel={
								bookmarked ? "Remove from list" : "Add to list"
							}
							onPress={() => setBookmarked((value) => !value)}
						/>
					</View>
				</Panel>
			</Section>

			<Section title="Floating action">
				<Panel>
					<View style={styles.floating}>
						<IconButton
							icon="add"
							variant="solid"
							size="lg"
							disabled={disabled}
							accessibilityLabel="New note"
							onPress={press}
						/>
					</View>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	variant: { gap: theme.tokens.spacing[2] },
	variantRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[4],
	},
	toggles: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	floating: { alignItems: "flex-end" },
}));
