import { useState } from "react";

import { Button } from "@/components/ui/button";
import { snackbar } from "@/components/ui/snackbar";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function SnackbarScreen() {
	const [archived, setArchived] = useState(0);
	const [log, setLog] = useState<string[]>([]);
	const note = (line: string) =>
		setLog((previous) => [line, ...previous].slice(0, 4));

	return (
		<Screen>
			<Section
				title="Snackbar"
				description="One at a time at the bottom. A new one replaces the current one."
			>
				<Panel>
					<Button
						fullWidth
						onPress={() => {
							const count = archived + 1;
							setArchived(count);
							snackbar.show({
								message: `Conversation ${count} archived`,
								action: {
									label: "Undo",
									onPress: () => note(`undo ${count}`),
								},
								onDismiss: (reason) => note(`${count}: ${reason}`),
							});
						}}
					>
						Archive (with Undo)
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() =>
							snackbar.show({ message: "Link copied", icon: "check" })
						}
					>
						Short, with an icon
					</Button>
					<Button
						fullWidth
						variant="ghost"
						onPress={() => snackbar.dismiss()}
					>
						Dismiss
					</Button>
					<Label muted>
						{log.length
							? log.join("\n")
							: "Dismiss reasons show up here."}
					</Label>
				</Panel>
			</Section>
		</Screen>
	);
}
