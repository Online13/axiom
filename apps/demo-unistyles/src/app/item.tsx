import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Item } from "@/components/ui/item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

function Surface({ children }: { children: React.ReactNode }) {
	return (
		<View style={styles.surface}>
			{children}
		</View>
	);
}

export default function ItemScreen() {
	return (
		<Screen>
			<Section
				title="Item"
				description="Leading, content, trailing. Dividers, sizes, selection."
			>
				<Surface>
					<Item onPress={() => {}} divider="inset">
						<Item.Leading>
							<Avatar name="Jane Cooper" colorFromName />
						</Item.Leading>
						<Item.Content>
							<Item.Title>Jane Cooper</Item.Title>
							<Item.Description>Product designer</Item.Description>
						</Item.Content>
						<Item.Trailing>
							<Icon name="chevron-right" size="sm" color="subtle" />
						</Item.Trailing>
					</Item>
					<Item selected onPress={() => {}} divider="inset">
						<Item.Leading>
							<Avatar name="Wade Warren" colorFromName />
						</Item.Leading>
						<Item.Content>
							<Item.Title>Wade Warren</Item.Title>
							<Item.Description>Selected</Item.Description>
						</Item.Content>
						<Item.Trailing>
							<Badge count={2} />
						</Item.Trailing>
					</Item>
					<Item size="lg" align="start" disabled onPress={() => {}}>
						<Item.Content>
							<Item.Title>
								Disabled, large, aligned to the top
							</Item.Title>
							<Item.Description numberOfLines={3}>
								A longer description that wraps on several lines to show
								the start alignment of the trailing area.
							</Item.Description>
						</Item.Content>
						<Item.Trailing>
							<IconButton
								icon="share"
								size="sm"
								accessibilityLabel="Share"
								disabled
							/>
						</Item.Trailing>
					</Item>
				</Surface>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	surface: {
		overflow: "hidden",
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
}));
