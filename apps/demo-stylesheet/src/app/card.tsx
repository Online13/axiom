import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function CardScreen() {
	const [presses, setPresses] = useState(0);

	return (
		<Screen>
			<Section
				title="Card"
				description={`Elevated, outlined, filled. Pressed ${presses} times.`}
			>
				<Card
					onPress={() => setPresses((p) => p + 1)}
					accessibilityLabel="Weekend in Porto"
				>
					<Card.Media
						source={{ uri: "https://picsum.photos/seed/porto/800/450" }}
					>
						<Badge variant="inverse">New</Badge>
					</Card.Media>
					<Card.Header>
						<Card.Title>Weekend in Porto</Card.Title>
						<Card.Description>3 days · from $240</Card.Description>
					</Card.Header>
					<Card.Footer>
						<Button size="sm">Book</Button>
						<Button size="sm" variant="ghost">
							Save
						</Button>
					</Card.Footer>
				</Card>
				<Card variant="outlined">
					<Card.Header>
						<Card.Title>Outlined</Card.Title>
						<Card.Description>For plain backgrounds.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Text variant="bodySm">Content goes here.</Text>
					</Card.Content>
				</Card>
				<Card variant="filled" padding={4}>
					<Text>Filled, with padding and no sub-components.</Text>
				</Card>
			</Section>
		</Screen>
	);
}
