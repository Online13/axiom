import { View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Item } from "@/components/ui/item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

function Surface({ children }: { children: React.ReactNode }) {
	const { tokens, colors } = useTheme();
	return (
		<View
			style={{
				overflow: "hidden",
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.elevated,
			}}
		>
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
