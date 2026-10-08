import { useState } from "react";

import { haptic } from "@/components/core/haptics";
import { Button } from "@/components/ui/button";
import { snackbar } from "@/components/ui/snackbar";
import { toast } from "@/components/ui/toast";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const wait = (ms: number, fail = false) =>
	new Promise<void>((resolve, reject) =>
		setTimeout(() => (fail ? reject(new Error("Network")) : resolve()), ms),
	);

export default function ToastScreen() {
	const [archived, setArchived] = useState(0);
	const [log, setLog] = useState<string[]>([]);

	const note = (line: string) =>
		setLog((previous) => [line, ...previous].slice(0, 4));

	return (
		<Screen>
			<Section
				title="Toast"
				description="Stacks at the top. Press the stack to expand it, swipe up to dismiss."
			>
				<Panel>
					<Button
						fullWidth
						variant="outline"
						onPress={() => toast.show({ title: "Profile updated" })}
					>
						Default
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() => {
							haptic("success");
							toast.success("Saved to your library");
						}}
					>
						Success
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() => {
							haptic("error");
							toast.error("Upload failed", {
								description: "The file is larger than 20 MB.",
							});
						}}
					>
						Error with a description
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() =>
							toast.info("Sync paused", { duration: Infinity })
						}
					>
						Info, stays until dismissed
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() =>
							toast.promise(wait(2000), {
								loading: "Uploading…",
								success: "Uploaded",
								error: "Upload failed",
							})
						}
					>
						Promise that succeeds
					</Button>
					<Button
						fullWidth
						variant="outline"
						onPress={() =>
							toast
								.promise(wait(2000, true), {
									loading: "Sending…",
									success: "Sent",
									error: (e) => `Failed: ${String(e)}`,
								})
								.catch(() => {})
						}
					>
						Promise that fails
					</Button>
					<Button
						fullWidth
						variant="ghost"
						onPress={() => toast.dismiss()}
					>
						Dismiss all
					</Button>
				</Panel>
			</Section>

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
