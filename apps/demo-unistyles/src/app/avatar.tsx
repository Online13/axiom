import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const PEOPLE = [
	"Jane Cooper",
	"Wade Warren",
	"Esther Howard",
	"Cameron Williamson",
	"Brooklyn Simmons",
	"Leslie Alexander",
];

export default function AvatarScreen() {
	return (
		<Screen>
			<Section
				title="Avatar"
				description="Image, initials, hue from the name, status, group."
			>
				<Panel>
					<View style={styles.avatars}>
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
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	avatars: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: theme.tokens.spacing[3],
	},
}));
