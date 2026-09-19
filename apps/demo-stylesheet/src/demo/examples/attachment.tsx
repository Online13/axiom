import { useEffect, useState } from "react";
import { View } from "react-native";

import { Attachment } from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const RECEIPT = {
	name: "hotel-lisbon.pdf",
	size: 1_240_000,
	mimeType: "application/pdf",
};
const PHOTO = {
	name: "taxi-receipt.jpg",
	size: 380_000,
	mimeType: "image/jpeg",
};
const AUDIO = {
	name: "interview.m4a",
	size: 26_800_000,
	mimeType: "audio/m4a",
};

export default function AttachmentScreen() {
	const { tokens } = useTheme();
	const [removable, setRemovable] = useState(true);
	const [progress, setProgress] = useState(0.15);
	const [running, setRunning] = useState(true);
	const [removed, setRemoved] = useState<string[]>([]);
	const [retries, setRetries] = useState(0);

	// A fake upload, so progress, done and the bar can be watched without a server.
	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => {
			setProgress((value) => {
				if (value >= 1) return 1;
				return Math.min(value + 0.07, 1);
			});
		}, 400);
		return () => clearInterval(timer);
	}, [running]);

	return (
		<Screen>
			<Panel>
				<Row
					label="Removable"
					description="Shows the remove button on every attachment."
				>
					<Switch
						value={removable}
						onValueChange={setRemovable}
						accessibilityLabel="Removable"
					/>
				</Row>
				<Row label="Upload running">
					<Switch
						value={running}
						onValueChange={setRunning}
						accessibilityLabel="Upload running"
					/>
				</Row>
				<Button variant="outline" onPress={() => setProgress(0)}>
					Restart the upload
				</Button>
			</Panel>

			<Section
				title="Attachment"
				description="Idle, uploading and done, in the row variant."
			>
				<Panel>
					<Attachment
						file={RECEIPT}
						onRemove={
							removable
								? () => setRemoved((r) => [...r, RECEIPT.name])
								: undefined
						}
					/>
					<Attachment
						file={PHOTO}
						progress={progress}
						onRemove={removable ? () => setRunning(false) : undefined}
					/>
					<Label muted>
						{progress >= 1
							? "Upload done."
							: `Uploading ${Math.round(progress * 100)}%.`}
						{removed.length > 0 ? ` Removed: ${removed.join(", ")}.` : ""}
					</Label>
				</Panel>
			</Section>

			<Section
				title="Error and retry"
				description="The message replaces the size, and the whole row retries."
			>
				<Panel>
					<Attachment
						file={AUDIO}
						error="File too large (max 25 MB)"
						onRemove={
							removable
								? () => setRemoved((r) => [...r, AUDIO.name])
								: undefined
						}
					/>
					<Attachment
						file={{
							name: "notes.txt",
							size: 12_000,
							mimeType: "text/plain",
						}}
						error="Connection lost · Tap to retry"
						onRetry={() => setRetries((count) => count + 1)}
					/>
					<Label muted>
						{retries > 0
							? `Retried ${retries}×`
							: "Tap the failed row to retry."}
					</Label>
				</Panel>
			</Section>

			<Section
				title="Tiles"
				description="A square thumbnail for a grid of photos in a composer."
			>
				<Panel>
					<View style={{ flexDirection: "row", gap: tokens.spacing[2] }}>
						<Attachment
							variant="tile"
							file={PHOTO}
							onRemove={removable ? () => {} : undefined}
						/>
						<Attachment
							variant="tile"
							file={{ ...PHOTO, name: "street.jpg" }}
							progress={progress}
						/>
						<Attachment
							variant="tile"
							file={{ ...PHOTO, name: "dinner.heic" }}
							error
							onRetry={() => {}}
						/>
					</View>
				</Panel>
			</Section>
		</Screen>
	);
}
