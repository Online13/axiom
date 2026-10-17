import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const FILES = ["report.pdf", "budget.xlsx", "photo.jpg"];

export default function CheckboxScreen() {
	const [disabled, setDisabled] = useState(false);
	const [accepted, setAccepted] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [selected, setSelected] = useState<Set<string>>(
		new Set(["budget.xlsx"]),
	);
	const all = selected.size === FILES.length;
	const some = selected.size > 0 && !all;

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

			<Section title="Checkbox" description="The whole row is pressable.">
				<Panel>
					<Checkbox
						label="I agree to the Terms"
						description={
							submitted && !accepted
								? "Required to create an account."
								: "Read them before continuing."
						}
						checked={accepted}
						onCheckedChange={setAccepted}
						error={submitted && !accepted}
						disabled={disabled}
					/>
					<Button
						fullWidth
						disabled={disabled}
						onPress={() => setSubmitted(true)}
					>
						Create account
					</Button>
				</Panel>
			</Section>

			<Section
				title="Select all"
				description="The header checkbox is indeterminate when some rows are checked."
			>
				<Panel>
					<Checkbox
						label="Select all"
						checked={all ? true : some ? "indeterminate" : false}
						onCheckedChange={(value) =>
							setSelected(value ? new Set(FILES) : new Set())
						}
						disabled={disabled}
					/>
					{FILES.map((file) => (
						<Checkbox
							key={file}
							label={file}
							checked={selected.has(file)}
							disabled={disabled}
							onCheckedChange={(value) =>
								setSelected((previous) => {
									const next = new Set(previous);
									if (value) next.add(file);
									else next.delete(file);
									return next;
								})
							}
						/>
					))}
					<Checkbox
						label="Uncontrolled, on by default"
						defaultChecked
						disabled={disabled}
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
