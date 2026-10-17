import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function AlertScreen() {
	const [dismissed, setDismissed] = useState(false);
	const [retries, setRetries] = useState(0);

	return (
		<Screen>
			<Section
				title="Alert"
				description="Inline feedback, with an action or a close button."
			>
				<Alert variant="info" title="New version available">
					Restart the app to get the latest features.
				</Alert>
				<Alert variant="success" title="Backup complete" />
				{dismissed ? (
					<Button variant="ghost" onPress={() => setDismissed(false)}>
						Show the warning again
					</Button>
				) : (
					<Alert
						variant="warning"
						title="Storage almost full"
						onDismiss={() => setDismissed(true)}
					>
						<Alert.Description>
							Free up space to keep syncing your photos.
						</Alert.Description>
						<Alert.Action onPress={() => {}}>Manage storage</Alert.Action>
					</Alert>
				)}
				<Alert variant="error" title="Payment failed">
					<Alert.Description>Your card was declined.</Alert.Description>
					<Alert.Action
						onPress={() => setRetries((r) => r + 1)}
					>{`Retry (${retries})`}</Alert.Action>
				</Alert>
				<Alert variant="neutral" icon={null}>
					Neutral, without an icon or a title.
				</Alert>
			</Section>
		</Screen>
	);
}
