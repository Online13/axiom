import { useState } from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function SegmentedControlScreen() {
	const [disabled, setDisabled] = useState(false);
	const [layout, setLayout] = useState("list");
	const [status, setStatus] = useState("All");

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
			</Panel>

			<Section
				title="SegmentedControl"
				description="Tap a segment, or drag the indicator. Each change plays a selection tick."
			>
				<Panel>
					<SegmentedControl
						options={["All", "Active", "Done"]}
						value={status}
						onValueChange={setStatus}
						haptic="selection"
						disabled={disabled}
					/>
					<Label muted>Selected: {status}</Label>
					<SegmentedControl
						size="lg"
						options={[
							{ value: "light", label: "Light", icon: "info" },
							{ value: "dark", label: "Dark" },
							{ value: "system", label: "Auto", disabled: true },
						]}
						defaultValue="light"
						disabled={disabled}
					/>
					<SegmentedControl
						fullWidth={false}
						options={[
							{
								value: "list",
								icon: "check",
								accessibilityLabel: "List",
							},
							{
								value: "grid",
								icon: "settings",
								accessibilityLabel: "Grid",
							},
						]}
						value={layout}
						onValueChange={setLayout}
						disabled={disabled}
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
