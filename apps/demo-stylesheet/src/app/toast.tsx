import { haptic } from "@/components/core/haptics";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const wait = (ms: number, fail = false) =>
	new Promise<void>((resolve, reject) =>
		setTimeout(() => (fail ? reject(new Error("Network")) : resolve()), ms),
	);

export default function ToastScreen() {
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
		</Screen>
	);
}
